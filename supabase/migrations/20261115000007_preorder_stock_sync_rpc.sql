-- Migration: Atomic Pre-order vs Regular Stock Synchronization RPC (Strict Validation & Zero Mutation at Creation)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
  v_variant RECORD;
  v_product RECORD;
  v_computed_fingerprint TEXT;
  v_items_json TEXT;
  v_is_preorder BOOLEAN;
  v_dispatch_date DATE;
  v_sale_mode TEXT;
  v_calc_subtotal NUMERIC := 0;
  v_calc_total NUMERIC := 0;
BEGIN
  IF p_checkout_id IS NULL OR p_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Missing required checkout ID or user ID');
  END IF;

  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot create an order without a valid items array.');
  END IF;

  -- 1. Check for conflicting prices for the same variant across payload items
  IF EXISTS (
    SELECT (x->>'variant_id')::UUID, COUNT(DISTINCT (x->>'price')::NUMERIC)
    FROM jsonb_array_elements(p_items) AS x
    GROUP BY (x->>'variant_id')::UUID
    HAVING COUNT(DISTINCT (x->>'price')::NUMERIC) > 1
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Conflicting unit prices provided for the same product variant.');
  END IF;

  -- 2. Independent Item Validation & Relationship Check
  FOR v_item IN
    SELECT
      (x->>'product_id')::UUID as product_id,
      (x->>'variant_id')::UUID as variant_id,
      (x->>'product_name')::TEXT as product_name,
      (x->>'variant_unit')::TEXT as variant_unit,
      (x->>'product_image')::TEXT as product_image,
      (x->>'price')::NUMERIC as price,
      (x->>'quantity')::INT as quantity,
      (x->>'total_price')::NUMERIC as total_price
    FROM jsonb_array_elements(p_items) AS x
  LOOP
    IF v_item.variant_id IS NULL OR v_item.product_id IS NULL OR v_item.quantity IS NULL OR v_item.quantity <= 0 OR v_item.price IS NULL OR v_item.price < 0 OR v_item.total_price IS NULL OR v_item.total_price < 0 THEN
      RETURN jsonb_build_object('success', false, 'error', 'Invalid or negative item details provided in cart.');
    END IF;

    -- Verify total_price = price * quantity with exact numeric precision
    IF ABS(v_item.total_price - (v_item.price * v_item.quantity)) > 0.01 THEN
      RETURN jsonb_build_object('success', false, 'error', format('Line item total price mismatch for variant %s.', v_item.variant_id));
    END IF;

    v_calc_subtotal := v_calc_subtotal + v_item.total_price;

    SELECT * INTO v_variant FROM public.product_variants WHERE id = v_item.variant_id;
    IF NOT FOUND THEN
      RETURN jsonb_build_object('success', false, 'error', format('Variant %s not found.', v_item.variant_id));
    END IF;

    SELECT * INTO v_product FROM public.products WHERE id = v_item.product_id;
    IF NOT FOUND OR v_variant.product_id != v_product.id THEN
      RETURN jsonb_build_object('success', false, 'error', format('Variant %s does not belong to product %s.', v_item.variant_id, v_item.product_id));
    END IF;
  END LOOP;

  -- 3. Validate Order-Level Financial Consistency
  IF ABS(p_subtotal - v_calc_subtotal) > 0.01 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order subtotal does not match line item totals.');
  END IF;

  v_calc_total := GREATEST(0, v_calc_subtotal - COALESCE(p_discount, 0)) + COALESCE(p_delivery_fee, 0);
  IF ABS(p_total - v_calc_total) > 0.01 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order total calculation mismatch.');
  END IF;

  -- 4. Server-Side Canonical Fingerprint Calculation using md5
  SELECT string_agg(
    format('%s:%s:%s:%s:%s:%s:%s:%s',
      COALESCE((x->>'product_id')::text, ''),
      COALESCE((x->>'variant_id')::text, ''),
      COALESCE((x->>'product_name')::text, ''),
      COALESCE((x->>'variant_unit')::text, ''),
      COALESCE((x->>'product_image')::text, ''),
      COALESCE((x->>'quantity')::text, '0'),
      COALESCE((x->>'price')::text, '0'),
      COALESCE((x->>'total_price')::text, '0')
    ),
    ',' ORDER BY (x->>'product_id')::text, (x->>'variant_id')::text, (x->>'quantity')::text
  ) INTO v_items_json
  FROM jsonb_array_elements(p_items) AS x;

  v_computed_fingerprint := md5(
    format('name:%s|phone:%s|addr:%s|sub:%s|del:%s|disc:%s|tot:%s|items:[%s]',
      COALESCE(p_customer_name, ''),
      COALESCE(p_customer_phone, ''),
      COALESCE(p_delivery_address::text, '{}'),
      p_subtotal, p_delivery_fee, p_discount, p_total, COALESCE(v_items_json, '')
    )
  );

  -- 5. Advisory Transaction Lock keyed by checkout_id
  PERFORM pg_advisory_xact_lock(hashtextextended(p_checkout_id::text, 0));

  SELECT * INTO v_existing_order
  FROM public.orders
  WHERE checkout_id = p_checkout_id;

  IF FOUND THEN
    IF v_existing_order.user_id <> p_user_id THEN
      RETURN jsonb_build_object('success', false, 'error', 'Checkout ID belongs to another user.');
    END IF;

    -- If existing order was cancelled, failed, or abandoned, allow placing a fresh order
    IF v_existing_order.status IN ('cancelled', 'failed') OR v_existing_order.payment_status = 'failed' THEN
      -- Allow proceeding to create a new order record
    ELSIF v_existing_order.payload_fingerprint IS DISTINCT FROM v_computed_fingerprint THEN
      RETURN jsonb_build_object('success', false, 'error', 'Checkout ID reused with modified cart contents or pricing.');
    ELSE
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
  END IF;

  -- 6. Create Order Record (Status: pending_payment) - ZERO Inventory Mutation at Creation
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

  -- 7. Insert Order Items Snapshot WITHOUT Inventory Mutation
  FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(product_id UUID, variant_id UUID, product_name TEXT, variant_unit TEXT, product_image TEXT, price NUMERIC, quantity INT, total_price NUMERIC)
  LOOP
    SELECT * INTO v_variant FROM public.product_variants WHERE id = v_item.variant_id;
    SELECT * INTO v_product FROM public.products WHERE id = v_item.product_id;

    v_is_preorder := (v_product.sale_mode = 'preorder' OR v_variant.preorder_enabled = TRUE);
    v_dispatch_date := v_product.expected_dispatch_date;
    v_sale_mode := COALESCE(v_product.sale_mode, 'regular');

    INSERT INTO public.order_items (
      order_id,
      product_id,
      variant_id,
      product_name,
      variant_unit,
      product_image,
      unit_price,
      quantity,
      total_price,
      is_preorder,
      expected_dispatch_date,
      sale_mode_snapshot
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
      v_item.total_price,
      v_is_preorder,
      v_dispatch_date,
      v_sale_mode
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

REVOKE ALL ON FUNCTION public.create_pending_order(UUID, UUID, TEXT, TEXT, JSONB, NUMERIC, NUMERIC, NUMERIC, NUMERIC, JSONB) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_pending_order(UUID, UUID, TEXT, TEXT, JSONB, NUMERIC, NUMERIC, NUMERIC, NUMERIC, JSONB) TO service_role;
