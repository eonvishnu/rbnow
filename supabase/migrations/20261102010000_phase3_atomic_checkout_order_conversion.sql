-- PHASE 3 MIGRATION: ATOMIC CHECKOUT-TO-ORDER CONVERSION RPC FUNCTION

CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START WITH 101;

DROP FUNCTION IF EXISTS public.generate_order_number();
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS BIGINT AS $$
BEGIN
  RETURN nextval('public.order_number_seq');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.convert_checkout_to_order(
  p_checkout_id UUID,
  p_payment_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_checkout RECORD;
  v_payment RECORD;
  v_item RECORD;
  v_variant RECORD;
  v_existing_order RECORD;
  v_order_id UUID;
  v_order_number BIGINT;
  v_has_stock_exception BOOLEAN := false;
  v_exception_type TEXT := NULL;
BEGIN
  -- 1. LOCK CHECKOUT ROW
  SELECT * INTO v_checkout
  FROM public.checkouts
  WHERE id = p_checkout_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Checkout record not found.');
  END IF;

  -- 2. LOCK PAYMENT ROW
  SELECT * INTO v_payment
  FROM public.payments
  WHERE id = p_payment_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payment record not found.');
  END IF;

  -- 3. IDEMPOTENCY GUARD: IF CHECKOUT ALREADY CONVERTED
  IF v_checkout.status = 'converted' THEN
    SELECT id, order_number, payment_id INTO v_existing_order
    FROM public.orders
    WHERE checkout_id = p_checkout_id;

    -- If this is a secondary captured payment attempt for an already-converted checkout, mark duplicate refund pending
    IF v_payment.status = 'captured' AND (v_existing_order.id IS NULL OR v_existing_order.payment_id != p_payment_id) THEN
      UPDATE public.payments
      SET status = 'duplicate_captured_refund_pending',
          updated_at = NOW()
      WHERE id = p_payment_id;
    END IF;

    RETURN jsonb_build_object(
      'success', true,
      'already_converted', true,
      'order_id', v_existing_order.id,
      'order_number', 'RB-' || v_existing_order.order_number::text
    );
  END IF;

  -- 4. VALIDATE PAYMENT OWNERSHIP & FINANCIAL INTEGRITY
  IF v_payment.checkout_id != p_checkout_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payment does not belong to the specified checkout.');
  END IF;

  IF v_payment.status != 'captured' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payment status is not captured.');
  END IF;

  IF v_payment.amount != v_checkout.grand_total THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payment amount does not match checkout total.');
  END IF;

  IF v_payment.currency != v_checkout.currency THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payment currency mismatch.');
  END IF;

  -- 5. CHECKOUT EXPIRATION GUARD
  IF NOW() > v_checkout.expires_at THEN
    UPDATE public.payments
    SET status = 'duplicate_captured_refund_pending',
        updated_at = NOW()
    WHERE id = p_payment_id;

    RETURN jsonb_build_object('success', false, 'error', 'Checkout session expired prior to payment completion.');
  END IF;

  -- 6. VALIDATE & DECREMENT INVENTORY WITH EXPLICIT UUID CASTING
  FOR v_item IN
    SELECT * FROM public.checkout_items WHERE checkout_id = p_checkout_id
  LOOP
    -- Lock variant row safely casting text to uuid
    BEGIN
      SELECT id, stock, is_available INTO v_variant
      FROM public.product_variants
      WHERE id = v_item.variant_id::uuid
      FOR UPDATE;
    EXCEPTION WHEN OTHERS THEN
      v_variant := NULL;
    END;

    IF v_variant.id IS NULL OR v_variant.stock < v_item.quantity OR NOT v_variant.is_available THEN
      v_has_stock_exception := true;
      v_exception_type := 'stock_unavailable';
    ELSE
      -- Atomic stock decrement
      UPDATE public.product_variants
      SET stock = stock - v_item.quantity,
          is_available = CASE WHEN (stock - v_item.quantity) > 0 THEN true ELSE false END,
          updated_at = NOW()
      WHERE id = v_item.variant_id::uuid;
    END IF;
  END LOOP;

  -- 7. CREATE CONFIRMED ORDER
  v_order_number := public.generate_order_number();

  INSERT INTO public.orders (
    order_number,
    checkout_id,
    payment_id,
    user_id,
    customer_name,
    customer_phone,
    delivery_address,
    subtotal,
    delivery_fee,
    discount,
    total,
    currency,
    status,
    fulfillment_exception
  ) VALUES (
    v_order_number,
    p_checkout_id,
    p_payment_id,
    v_checkout.user_id,
    v_checkout.customer_name,
    v_checkout.customer_phone,
    v_checkout.delivery_address,
    v_checkout.subtotal,
    v_checkout.delivery_fee,
    v_checkout.discount,
    v_checkout.grand_total,
    v_checkout.currency,
    'confirmed',
    v_exception_type
  ) RETURNING id INTO v_order_id;

  -- 8. COPY FROZEN CHECKOUT ITEMS TO ORDER ITEMS SAFELY CASTING TO UUID
  INSERT INTO public.order_items (
    order_id,
    variant_id,
    product_id,
    product_name,
    variant_unit,
    price,
    quantity,
    total_price
  )
  SELECT
    v_order_id,
    variant_id::uuid,
    product_id::uuid,
    product_name,
    variant_unit,
    unit_price,
    quantity,
    line_total
  FROM public.checkout_items
  WHERE checkout_id = p_checkout_id;

  -- 9. MARK CHECKOUT CONVERTED
  UPDATE public.checkouts
  SET status = 'converted',
      updated_at = NOW()
  WHERE id = p_checkout_id;

  RETURN jsonb_build_object(
    'success', true,
    'already_converted', false,
    'order_id', v_order_id,
    'order_number', 'RB-' || v_order_number::text,
    'fulfillment_exception', v_exception_type
  );
END;
$$;

-- RESTRICT EXECUTION TO SERVICE_ROLE ONLY
REVOKE ALL ON FUNCTION public.convert_checkout_to_order(UUID, UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.convert_checkout_to_order(UUID, UUID) TO service_role;

COMMENT ON FUNCTION public.convert_checkout_to_order(UUID, UUID) IS
  'Atomic, idempotent checkout-to-order conversion RPC with SELECT FOR UPDATE row locking, payment verification, and stock decrement.';
