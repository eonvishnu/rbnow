-- 31. STRENGTHENED ABANDON PENDING ORDER RPC
CREATE OR REPLACE FUNCTION public.abandon_pending_order(
  p_order_id UUID,
  p_user_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  v_order RECORD;
  v_payment RECORD;
  v_has_active_payment BOOLEAN := FALSE;
  v_has_refund_review BOOLEAN := FALSE;
BEGIN
  IF p_order_id IS NULL OR p_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Missing required order or user ID');
  END IF;

  -- 1. Lock order row first
  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id AND user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order not found');
  END IF;

  IF v_order.status IS DISTINCT FROM 'pending_payment' OR v_order.payment_status IS DISTINCT FROM 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order cannot be modified or abandoned in its current state');
  END IF;

  -- 2. Lock all associated payment rows afterward
  PERFORM 1
  FROM public.payments
  WHERE order_id = p_order_id
  FOR UPDATE;

  -- 3. Inspect every payment attempt
  FOR v_payment IN
    SELECT status, refund_review_required FROM public.payments WHERE order_id = p_order_id
  LOOP
    IF v_payment.status IN ('captured', 'authorized', 'created') THEN
      v_has_active_payment := TRUE;
      EXIT;
    END IF;
    IF v_payment.refund_review_required IS TRUE OR v_payment.status = 'refunded' THEN
      v_has_refund_review := TRUE;
    END IF;
  END LOOP;

  IF v_has_active_payment THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Cannot abandon order while payment attempts remain active, unresolved, or captured.'
    );
  END IF;

  IF v_has_refund_review THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Cannot abandon order while payment attempts require refund review.'
    );
  END IF;

  -- 4. Cancel eligible order, preserving existing order_items
  UPDATE public.orders
  SET status = 'cancelled', updated_at = NOW()
  WHERE id = p_order_id AND status IS DISTINCT FROM 'cancelled';

  RETURN jsonb_build_object('success', true);
END;
$$;

REVOKE ALL ON FUNCTION public.abandon_pending_order(UUID, UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.abandon_pending_order(UUID, UUID) TO service_role;

-- 32. STRENGTHENED RESERVE PAYMENT ATTEMPT RPC
CREATE OR REPLACE FUNCTION public.reserve_payment_attempt(
  p_order_id UUID,
  p_user_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  v_order RECORD;
  v_existing_payment RECORD;
  v_has_active_payment BOOLEAN := FALSE;
  v_has_refund_review BOOLEAN := FALSE;
  v_payment_record RECORD;
  v_expected_amount_paise BIGINT;
BEGIN
  IF p_order_id IS NULL OR p_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Missing required order or user ID');
  END IF;

  -- 1. ROW-LEVEL LOCK ON ORDER FIRST (Order first, payments second)
  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id AND user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Eligible pending order not found');
  END IF;

  IF v_order.status IS DISTINCT FROM 'pending_payment' OR v_order.payment_status IS DISTINCT FROM 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order is not eligible for payment retry');
  END IF;

  IF UPPER(TRIM(COALESCE(v_order.currency, 'INR'))) <> 'INR' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unsupported order currency');
  END IF;

  v_expected_amount_paise := ROUND(v_order.total * 100)::BIGINT;
  IF v_expected_amount_paise <= 0 OR v_expected_amount_paise > 9223372036854775807::BIGINT THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid order total amount');
  END IF;

  -- 2. ROW-LEVEL LOCK ON ALL ASSOCIATED PAYMENT ROWS AFTERWARD
  PERFORM 1
  FROM public.payments
  WHERE order_id = p_order_id
  FOR UPDATE;

  -- 3. INSPECT PREVIOUS PAYMENT ATTEMPTS
  FOR v_existing_payment IN
    SELECT status, refund_review_required FROM public.payments WHERE order_id = p_order_id
  LOOP
    IF v_existing_payment.status IN ('captured', 'authorized', 'created') THEN
      v_has_active_payment := TRUE;
      EXIT;
    END IF;
    IF v_existing_payment.refund_review_required IS TRUE OR v_existing_payment.status = 'refunded' THEN
      v_has_refund_review := TRUE;
    END IF;
  END LOOP;

  IF v_has_active_payment THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'A payment attempt is already captured, active, or unresolved for this order.'
    );
  END IF;

  IF v_has_refund_review THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Previous payment attempts require refund review and cannot be retried automatically.'
    );
  END IF;

  -- 4. INSERT NEW PAYMENT ATTEMPT
  INSERT INTO public.payments (order_id, amount, currency, status)
  VALUES (p_order_id, v_expected_amount_paise, 'INR', 'created')
  RETURNING * INTO v_payment_record;

  RETURN jsonb_build_object(
    'success', true,
    'payment_id', v_payment_record.id,
    'amount', v_expected_amount_paise
  );
END;
$$;

REVOKE ALL ON FUNCTION public.reserve_payment_attempt(UUID, UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_payment_attempt(UUID, UUID) TO service_role;
