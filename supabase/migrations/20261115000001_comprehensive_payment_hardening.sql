-- Migration: Comprehensive Payment Hardening & Authoritative Atomic Checkout RPCs (SHA-256 PGCrypto Fingerprinting)

-- Ensure pgcrypto extension is available for sha256 digest
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Ensure orders table has checkout_id and payload_fingerprint columns for stable idempotency
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS checkout_id UUID,
  ADD COLUMN IF NOT EXISTS payload_fingerprint TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_checkout_id_unique
  ON public.orders (checkout_id)
  WHERE checkout_id IS NOT NULL;

-- Drop older overloads of create_pending_order to prevent accidental execution
DROP FUNCTION IF EXISTS public.create_pending_order(UUID, UUID, TEXT, TEXT, JSONB, NUMERIC, NUMERIC, NUMERIC, NUMERIC, TEXT, JSONB);
DROP FUNCTION IF EXISTS public.create_pending_order(UUID, UUID, TEXT, TEXT, JSONB, NUMERIC, NUMERIC, NUMERIC, NUMERIC, JSONB);
DROP FUNCTION IF EXISTS public.create_pending_order(UUID, UUID, TEXT, TEXT, JSONB, NUMERIC, NUMERIC, NUMERIC, NUMERIC);

-- 2. Update confirm_order_payment to permit failed payment attempt reconciliation with refund review required
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
  v_variant_stock INT;
  v_variant_is_available BOOLEAN;
  v_has_stock_issue BOOLEAN := FALSE;
  v_failed_item_name TEXT := '';
  v_rows_updated INT;
  v_assigned_order_number BIGINT;
  v_expected_amount_paise BIGINT;
BEGIN
  IF p_razorpay_order_id IS NULL OR TRIM(p_razorpay_order_id) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Missing required Razorpay order ID');
  END IF;

  IF p_razorpay_payment_id IS NULL OR TRIM(p_razorpay_payment_id) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Missing required Razorpay payment ID');
  END IF;

  IF p_payment_amount IS NULL OR p_payment_amount <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid payment amount received');
  END IF;

  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order not found');
  END IF;

  v_expected_amount_paise := ROUND(v_order.total * 100)::BIGINT;

  IF v_expected_amount_paise <> p_payment_amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', format('Payment amount mismatch: Expected %s paise, received %s paise', v_expected_amount_paise, p_payment_amount)
    );
  END IF;

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

  IF v_payment_record.status NOT IN ('created', 'authorized', 'captured', 'failed') THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Payment attempt is not eligible for confirmation.'
    );
  END IF;

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

  IF EXISTS (
    SELECT 1 FROM public.order_items
    WHERE order_id = p_order_id AND variant_id IS NULL
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order contains items with missing variant IDs.');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.order_items
    WHERE order_id = p_order_id
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot confirm an order without items.');
  END IF;

  FOR v_item IN
    SELECT variant_id, SUM(quantity) as total_qty, MAX(product_name) as sample_name
    FROM public.order_items
    WHERE order_id = p_order_id AND variant_id IS NOT NULL
    GROUP BY variant_id
    ORDER BY variant_id ASC
  LOOP
    SELECT stock, is_available INTO v_variant_stock, v_variant_is_available
    FROM public.product_variants
    WHERE id = v_item.variant_id
    FOR UPDATE;

    IF v_variant_stock IS NULL OR v_variant_is_available IS DISTINCT FROM TRUE OR v_variant_stock < v_item.total_qty THEN
      v_has_stock_issue := TRUE;
      v_failed_item_name := v_item.sample_name;
      EXIT;
    END IF;
  END LOOP;

  IF v_has_stock_issue THEN
    UPDATE public.orders
    SET payment_status = 'paid',
        status = 'cancelled',
        payment_id = v_payment_record.id,
        razorpay_order_id = p_razorpay_order_id,
        razorpay_payment_id = p_razorpay_payment_id,
        fulfillment_exception = format('Stock exception for %s. Refund/replacement required.', v_failed_item_name),
        notes = format('Stock exception for %s. Refund/replacement required.', v_failed_item_name),
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
      'error', format('Insufficient inventory for item %s. Order flagged for fulfillment review.', v_failed_item_name)
    );
  END IF;

  IF v_order.order_number IS NULL THEN
    v_assigned_order_number := nextval('public.orders_confirmed_order_number_seq');
  ELSE
    v_assigned_order_number := v_order.order_number;
  END IF;

  UPDATE public.orders
  SET order_number = v_assigned_order_number,
      payment_status = 'paid',
      status = 'confirmed',
      payment_id = v_payment_record.id,
      razorpay_order_id = p_razorpay_order_id,
      razorpay_payment_id = p_razorpay_payment_id,
      updated_at = NOW()
  WHERE id = p_order_id;

  UPDATE public.payments
  SET status = 'captured',
      razorpay_payment_id = p_razorpay_payment_id,
      refund_review_required = (v_payment_record.status = 'failed'),
      paid_at = NOW(),
      updated_at = NOW()
  WHERE id = v_payment_record.id;

  FOR v_item IN
    SELECT variant_id, SUM(quantity) as total_qty
    FROM public.order_items
    WHERE order_id = p_order_id AND variant_id IS NOT NULL
    GROUP BY variant_id
    ORDER BY variant_id ASC
  LOOP
    UPDATE public.product_variants
    SET stock = stock - v_item.total_qty,
        is_available = (stock - v_item.total_qty) > 0
    WHERE id = v_item.variant_id AND stock >= v_item.total_qty;

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
    IF v_rows_updated = 0 THEN
      RAISE EXCEPTION 'Atomic stock deduction failed for variant %', v_item.variant_id;
    END IF;

    INSERT INTO public.inventory_transactions (variant_id, transaction_type, quantity, reference_type, reference_id, notes)
    VALUES (v_item.variant_id, 'sale', -v_item.total_qty, 'order', v_order.id, 'Atomic purchase deduction');
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

-- 3. COMPLETE AUTHORITATIVE STABLE-INTENT ORDER CREATION RPC (Cryptographic SHA-256 Fingerprint & Deterministic Ordering)
CREATE OR REPLACE FUNCTION public.create_pending_order(
  p_checkout_id UUID,
  p_user_id UUID,
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_delivery_address JSONB,
  p_subtotal NUMERIC,
  p_delivery_fee NUMERIC,
  p_discount NUMERIC,
  p_total NUMERIC,
  p_items JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  v_existing_order RECORD;
  v_new_order RECORD;
  v_item RECORD;
  v_computed_fingerprint TEXT;
  v_items_json TEXT;
BEGIN
  IF p_checkout_id IS NULL OR p_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Missing required checkout ID or user ID');
  END IF;

  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot create an order without items.');
  END IF;

  -- 1. Server-Side Cryptographic SHA-256 Canonical Fingerprint Calculation
  SELECT string_agg(
    format('%s:%s:%s:%s:%s:%s:%s:%s',
      COALESCE((x->>'product_id')::text, ''),
      COALESCE((x->>'variant_id')::text, ''),
      COALESCE((x->>'product_name')::text, ''),
      COALESNACE((x->>'variant_unit')::text, ''),
      COALESCE((x->>'product_image')::text, ''),
      COALESCE((x->>'quantity')::text, '0'),
      COALESCE((x->>'price')::text, '0'),
      COALESCE((x->>'total_price')::text, '0')
    ),
    ',' ORDER BY (x->>'product_id')::text, (x->>'variant_id')::text, (x->>'quantity')::text
  ) INTO v_items_json
  FROM jsonb_array_elements(p_items) AS x;

  v_computed_fingerprint := encode(
    digest(
      format('name:%s|phone:%s|addr:%s|sub:%s|del:%s|disc:%s|tot:%s|items:[%s]',
        COALESCE(p_customer_name, ''),
        COALESCE(p_customer_phone, ''),
        COALESCE(p_delivery_address::text, '{}'),
        p_subtotal, p_delivery_fee, p_discount, p_total, COALESCE(v_items_json, '')
      ),
      'sha256'
    ),
    'hex'
  );

  -- 2. Advisory Transaction Lock keyed by checkout_id
  PERFORM pg_advisory_xact_lock(hashtextextended(p_checkout_id::text, 0));

  SELECT * INTO v_existing_order
  FROM public.orders
  WHERE checkout_id = p_checkout_id;

  IF FOUND THEN
    IF v_existing_order.user_id <> p_user_id THEN
      RETURN jsonb_build_object('success', false, 'error', 'Checkout ID belongs to another user.');
    END IF;
    IF v_existing_order.payload_fingerprint IS DISTINCT FROM v_computed_fingerprint THEN
      RETURN jsonb_build_object('success', false, 'error', 'Checkout ID reused with modified cart contents or pricing.');
    END IF;

    -- Return order and original items with stable deterministic ordering
    RETURN jsonb_build_object(
      'success', true,
      'order', row_to_json(v_existing_order),
      'items', (
        SELECT json_agg(row_to_json(oi) ORDER BY oi.product_id, oi.variant_id, oi.quantity)
        FROM public.order_items oi
        WHERE oi.order_id = v_existing_order.id
      ),
      'already_exists', true
    );
  END IF;

  -- 3. Atomically create order and order_items
  INSERT INTO public.orders (
    checkout_id,
    user_id,
    customer_name,
    customer_phone,
    delivery_address,
    subtotal,
    delivery_fee,
    discount,
    total,
    currency,
    payment_method,
    payment_status,
    status,
    payload_fingerprint
  )
  VALUES (
    p_checkout_id,
    p_user_id,
    p_customer_name,
    p_customer_phone,
    p_delivery_address,
    p_subtotal,
    p_delivery_fee,
    p_discount,
    p_total,
    'INR',
    'razorpay',
    'pending',
    'pending_payment',
    v_computed_fingerprint
  )
  RETURNING * INTO v_new_order;

  FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(product_id UUID, variant_id UUID, product_name TEXT, variant_unit TEXT, product_image TEXT, price NUMERIC, quantity INT, total_price NUMERIC)
  LOOP
    IF v_item.variant_id IS NULL OR v_item.quantity IS NULL OR v_item.quantity <= 0 OR v_item.price < 0 THEN
      RAISE EXCEPTION 'Invalid item payload detected during order creation.';
    END IF;

    INSERT INTO public.order_items (
      order_id,
      product_id,
      variant_id,
      product_name,
      variant_unit,
      product_image,
      price,
      quantity,
      total_price
    )
    VALUES (
      v_new_order.id,
      v_item.product_id,
      v_item.variant_id,
      v_item.product_name,
      v_item.variant_unit,
      v_item.product_image,
      v_item.price,
      v_item.quantity,
      v_item.total_price
    );
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'order', row_to_json(v_new_order),
    'items', (
      SELECT json_agg(row_to_json(oi) ORDER BY oi.product_id, oi.variant_id, oi.quantity)
      FROM public.order_items oi
      WHERE oi.order_id = v_new_order.id
    ),
    'already_exists', false
  );
END;
$$;
REVOKE ALL ON FUNCTION public.create_pending_order(UUID, UUID, TEXT, TEXT, JSONB, NUMERIC, NUMERIC, NUMERIC, NUMERIC, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_pending_order(UUID, UUID, TEXT, TEXT, JSONB, NUMERIC, NUMERIC, NUMERIC, NUMERIC, JSONB) TO service_role;
