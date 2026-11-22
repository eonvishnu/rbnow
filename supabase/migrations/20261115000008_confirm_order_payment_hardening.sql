-- Migration: Hardened confirm_order_payment RPC with Preorder Capacity & Late-Capture Support

CREATE OR REPLACE FUNCTION public.confirm_order_payment(
  p_order_id UUID,
  p_razorpay_order_id TEXT,
  p_razorpay_payment_id TEXT,
  p_payment_amount NUMERIC
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  v_order RECORD;
  v_item RECORD;
  v_payment_record RECORD;
  v_existing_payment_record RECORD;
  v_variant RECORD;
  v_product RECORD;
  v_has_stock_issue BOOLEAN := FALSE;
  v_failed_item_name TEXT := '';
  v_rows_updated INT;
  v_assigned_order_number BIGINT;
  v_expected_amount_paise BIGINT;
  v_is_preorder BOOLEAN;
BEGIN
  -- 1. STRICT INPUT VALIDATION
  IF p_razorpay_order_id IS NULL OR TRIM(p_razorpay_order_id) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Missing required Razorpay order ID');
  END IF;

  IF p_razorpay_payment_id IS NULL OR TRIM(p_razorpay_payment_id) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Missing required Razorpay payment ID');
  END IF;

  IF p_payment_amount IS NULL OR p_payment_amount <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid payment amount received');
  END IF;

  -- 2. ROW-LEVEL LOCK ON ORDER FIRST TO PREVENT CONCURRENCY RACES
  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order not found');
  END IF;

  v_expected_amount_paise := ROUND(v_order.total * 100)::BIGINT;

  -- 3. STRICT PAISE-ONLY AMOUNT VALIDATION
  IF v_expected_amount_paise <> p_payment_amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', format('Payment amount mismatch: Expected %s paise, received %s paise', v_expected_amount_paise, p_payment_amount)
    );
  END IF;

  -- 4. FETCH SPECIFIC PAYMENT ATTEMPT RECORD
  SELECT * INTO v_payment_record
  FROM public.payments
  WHERE order_id = p_order_id AND razorpay_order_id = p_razorpay_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', format('Payment record for order ID %s and Razorpay Order ID %s not found.', p_order_id, p_razorpay_order_id)
    );
  END IF;

  -- 4.5. VALIDATE PAYMENT ATTEMPT STATUS (Allow created, authorized, captured, or late-captured failed attempts)
  IF v_payment_record.status NOT IN ('created', 'authorized', 'captured', 'failed') THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Payment attempt is not eligible for confirmation.'
    );
  END IF;

  -- 5. VERIFY STORED PAYMENT RECORD AMOUNT & STRICT CURRENCY
  IF v_payment_record.amount <> p_payment_amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Stored payment record amount does not match received payment amount.'
    );
  END IF;

  IF UPPER(TRIM(COALESCE(v_payment_record.currency, ''))) <> 'INR' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', format('Invalid payment currency: Expected INR, received %s', v_payment_record.currency)
    );
  END IF;

  -- 6. CONCURRENCY ADVISORY LOCK & STRICT PAYMENT ID OWNERSHIP CHECK
  PERFORM pg_advisory_xact_lock(
    hashtextextended(p_razorpay_payment_id, 0)
  );

  SELECT * INTO v_existing_payment_record
  FROM public.payments
  WHERE razorpay_payment_id = p_razorpay_payment_id
  FOR UPDATE;

  IF FOUND AND v_existing_payment_record.id <> v_payment_record.id THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Razorpay payment ID is already registered for a different payment record.'
    );
  END IF;

  IF v_payment_record.razorpay_payment_id IS NOT NULL AND v_payment_record.razorpay_payment_id <> p_razorpay_payment_id THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'This payment record is already associated with a different Razorpay payment ID.'
    );
  END IF;

  -- 7. ROBUST IDEMPOTENCY & DUPLICATE PAYMENT CHECK
  IF v_order.payment_status = 'paid' THEN
    IF v_order.razorpay_payment_id = p_razorpay_payment_id THEN
      IF v_order.fulfillment_exception IS NOT NULL THEN
        RETURN jsonb_build_object(
          'success', false,
          'already_paid', true,
          'stock_exception', true,
          'order_id', v_order.id,
          'order_number', v_order.order_number,
          'error', 'Order has a stock exception and requires fulfillment review/refund.'
        );
      END IF;

      RETURN jsonb_build_object(
        'success', true,
        'already_paid', true,
        'order_id', v_order.id,
        'order_number', v_order.order_number
      );
    END IF;

    -- Secondary distinct capture: persist payment record and flag for refund review
    UPDATE public.payments
    SET status = 'captured',
        razorpay_payment_id = p_razorpay_payment_id,
        duplicate_payment = true,
        refund_review_required = true,
        paid_at = NOW(),
        updated_at = NOW()
    WHERE id = v_payment_record.id;

    RETURN jsonb_build_object(
      'success', false,
      'duplicate_payment', true,
      'order_id', v_order.id,
      'order_number', v_order.order_number,
      'error', 'Order has already been paid with a different payment ID. Secondary payment captured and flagged for refund review.'
    );
  END IF;

  -- 8. LATE PAYMENT CAPTURE ON CANCELLED ORDERS CHECK
  IF v_order.status = 'cancelled' AND v_order.payment_status IS DISTINCT FROM 'paid' THEN
    UPDATE public.orders
    SET payment_status = 'paid',
        payment_id = v_payment_record.id,
        razorpay_order_id = p_razorpay_order_id,
        razorpay_payment_id = p_razorpay_payment_id,
        fulfillment_exception = 'Payment captured after order cancellation. Refund required.',
        notes = 'Payment captured after order cancellation. Refund required.',
        updated_at = NOW()
    WHERE id = p_order_id;

    UPDATE public.payments
    SET status = 'captured',
        razorpay_payment_id = p_razorpay_payment_id,
        refund_review_required = TRUE,
        paid_at = NOW(),
        updated_at = NOW()
    WHERE id = v_payment_record.id;

    RETURN jsonb_build_object(
      'success', false,
      'stock_exception', true,
      'order_id', v_order.id,
      'order_number', v_order.order_number,
      'error', 'Payment captured after order cancellation. Refund required.'
    );
  END IF;

  -- 9. REJECT ITEMS WITH NULL VARIANT_ID & REJECT ZERO ITEMS
  IF EXISTS (
    SELECT 1 FROM public.order_items
    WHERE order_id = p_order_id AND variant_id IS NULL
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Order contains items with missing variant IDs.'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.order_items
    WHERE order_id = p_order_id
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Cannot confirm an order without items.'
    );
  END IF;

  -- 10. FULFILLMENT-TIME AVAILABILITY & CAPACITY VALIDATION (Locking variants in ascending order)
  FOR v_item IN
    SELECT product_id, variant_id, SUM(quantity) as total_qty, MAX(product_name) as sample_name
    FROM public.order_items
    WHERE order_id = p_order_id AND variant_id IS NOT NULL
    GROUP BY product_id, variant_id
    ORDER BY variant_id ASC
  LOOP
    SELECT * INTO v_variant FROM public.product_variants WHERE id = v_item.variant_id FOR UPDATE;
    SELECT * INTO v_product FROM public.products WHERE id = v_item.product_id;

    IF NOT FOUND OR v_variant.product_id != v_product.id THEN
      v_has_stock_issue := TRUE;
      v_failed_item_name := v_item.sample_name;
      EXIT;
    END IF;

    v_is_preorder := (v_product.sale_mode = 'preorder' OR v_variant.preorder_enabled = TRUE);

    IF v_is_preorder THEN
      IF (COALESCE(v_variant.preorder_reserved_qty, 0) + v_item.total_qty) > COALESCE(v_variant.preorder_limit, 100) THEN
        v_has_stock_issue := TRUE;
        v_failed_item_name := v_item.sample_name;
        EXIT;
      END IF;
    ELSE
      IF COALESCE(v_variant.stock, 0) < v_item.total_qty THEN
        v_has_stock_issue := TRUE;
        v_failed_item_name := v_item.sample_name;
        EXIT;
      END IF;
    END IF;
  END LOOP;

  -- IF STOCK OR PREORDER CAPACITY EXCEEDED: Preserve payment record, set order to cancelled / stock exception, flag refund review
  IF v_has_stock_issue THEN
    UPDATE public.orders
    SET payment_status = 'paid',
        status = 'cancelled',
        payment_id = v_payment_record.id,
        razorpay_order_id = p_razorpay_order_id,
        razorpay_payment_id = p_razorpay_payment_id,
        fulfillment_exception = format('Stock/preorder capacity exception for %s. Refund/replacement required.', v_failed_item_name),
        notes = format('Stock/preorder capacity exception for %s. Refund/replacement required.', v_failed_item_name),
        updated_at = NOW()
    WHERE id = p_order_id;

    UPDATE public.payments
    SET status = 'captured',
        razorpay_payment_id = p_razorpay_payment_id,
        refund_review_required = TRUE,
        paid_at = NOW(),
        updated_at = NOW()
    WHERE id = v_payment_record.id;

    RETURN jsonb_build_object(
      'success', false,
      'stock_exception', true,
      'order_id', v_order.id,
      'order_number', v_order.order_number,
      'error', format('Insufficient inventory or preorder capacity for item %s. Payment preserved and flagged for fulfillment review.', v_failed_item_name)
    );
  END IF;

  -- 11. ASSIGN STRICTLY SEQUENTIAL ORDER NUMBER
  IF v_order.order_number IS NULL THEN
    v_assigned_order_number := nextval('public.orders_confirmed_order_number_seq');
  ELSE
    v_assigned_order_number := v_order.order_number;
  END IF;

  -- 12. ATOMIC ORDER STATUS TRANSITION TO CONFIRMED
  UPDATE public.orders
  SET order_number = v_assigned_order_number,
      payment_status = 'paid',
      status = 'confirmed',
      payment_id = v_payment_record.id,
      razorpay_order_id = p_razorpay_order_id,
      razorpay_payment_id = p_razorpay_payment_id,
      updated_at = NOW()
  WHERE id = p_order_id;

  -- 13. UPDATE PAYMENT RECORD TO CAPTURED
  UPDATE public.payments
  SET status = 'captured',
      razorpay_payment_id = p_razorpay_payment_id,
      paid_at = NOW(),
      updated_at = NOW()
  WHERE id = v_payment_record.id;

  -- 14. ATOMIC FULFILLMENT-TIME STOCK / PREORDER CAPACITY DEDUCTION
  FOR v_item IN
    SELECT product_id, variant_id, SUM(quantity) as total_qty
    FROM public.order_items
    WHERE order_id = p_order_id AND variant_id IS NOT NULL
    GROUP BY product_id, variant_id
    ORDER BY variant_id ASC
  LOOP
    SELECT * INTO v_variant FROM public.product_variants WHERE id = v_item.variant_id;
    SELECT * INTO v_product FROM public.products WHERE id = v_item.product_id;

    v_is_preorder := (v_product.sale_mode = 'preorder' OR v_variant.preorder_enabled = TRUE);

    IF v_is_preorder THEN
      UPDATE public.product_variants
      SET preorder_reserved_qty = COALESCE(preorder_reserved_qty, 0) + v_item.total_qty,
          updated_at = NOW()
      WHERE id = v_item.variant_id;
    else
      UPDATE public.product_variants
      SET stock = stock - v_item.total_qty,
          is_available = (stock - v_item.total_qty) > 0,
          updated_at = NOW()
      WHERE id = v_item.variant_id AND stock >= v_item.total_qty;

      GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
      IF v_rows_updated = 0 THEN
        RAISE EXCEPTION 'Atomic stock deduction failed for variant %', v_item.variant_id;
      END IF;
    END IF;

    INSERT INTO public.inventory_transactions (variant_id, transaction_type, quantity, reference_type, reference_id, notes)
    VALUES (v_item.variant_id, 'sale', -v_item.total_qty, 'order', v_order.id, v_is_preorder ? 'Pre-order purchase reservation' : 'Atomic purchase deduction');
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'already_paid', false,
    'order_id', v_order.id,
    'order_number', v_assigned_order_number
  );
END;
$$;

REVOKE ALL ON FUNCTION public.confirm_order_payment(UUID, TEXT, TEXT, NUMERIC) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_order_payment(UUID, TEXT, TEXT, NUMERIC) TO service_role;
