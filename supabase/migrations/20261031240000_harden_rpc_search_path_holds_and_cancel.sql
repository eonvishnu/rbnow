-- Migration: Fix search_path, Hold-Aware Allocations, and Cancel Fulfillment Batch RPC

-- 1. HOLD-AWARE ALLOCATION RPC WITH FIXED SEARCH PATH & FOR UPDATE
CREATE OR REPLACE FUNCTION public.allocate_fulfillment_item(
  p_fulfillment_id uuid,
  p_order_item_id uuid,
  p_quantity numeric,
  p_hold_reason text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_fulfillment_user_id uuid;
  v_order_user_id uuid;
  v_qty_ordered numeric;
  v_qty_fulfilled numeric;
  v_qty_cancelled numeric;
  v_active_allocated numeric;
  v_open_holds numeric;
  v_available numeric;
BEGIN
  -- Lock fulfillment
  SELECT user_id INTO v_fulfillment_user_id
  FROM public.fulfillments
  WHERE id = p_fulfillment_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Fulfillment batch not found.';
  END IF;

  -- Lock order item
  SELECT o.user_id, oi.quantity, oi.quantity_fulfilled, oi.quantity_cancelled
  INTO v_order_user_id, v_qty_ordered, v_qty_fulfilled, v_qty_cancelled
  FROM public.order_items oi
  JOIN public.orders o ON o.id = oi.order_id
  WHERE oi.id = p_order_item_id
  FOR UPDATE OF oi;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order item not found.';
  END IF;

  -- Validate customer match
  IF v_fulfillment_user_id IS NOT NULL AND v_order_user_id IS NOT NULL AND v_fulfillment_user_id <> v_order_user_id THEN
    RAISE EXCEPTION 'Forbidden: Cannot add item from a different customer to this fulfillment batch.';
  END IF;

  -- Calculate active allocations across pending/active fulfillments
  SELECT COALESCE(SUM(fi.quantity), 0) INTO v_active_allocated
  FROM public.fulfillment_items fi
  JOIN public.fulfillments f ON f.id = fi.fulfillment_id
  WHERE fi.order_item_id = p_order_item_id
    AND f.status IN ('preparing', 'ready_for_dispatch', 'out_for_delivery');

  -- Calculate open quality holds for this item
  SELECT COALESCE(SUM(quantity), 0) INTO v_open_holds
  FROM public.order_item_holds
  WHERE order_item_id = p_order_item_id
    AND status = 'open';

  v_available := v_qty_ordered - v_qty_fulfilled - v_qty_cancelled - v_active_allocated - v_open_holds;

  IF p_quantity > v_available THEN
    RAISE EXCEPTION 'Cannot allocate % units. Only % units available for allocation (% on quality hold).', p_quantity, v_available, v_open_holds;
  END IF;

  -- Insert fulfillment item
  INSERT INTO public.fulfillment_items (fulfillment_id, order_item_id, quantity, hold_reason)
  VALUES (p_fulfillment_id, p_order_item_id, p_quantity, p_hold_reason);

  RETURN jsonb_build_object(
    'success', true,
    'allocated_quantity', p_quantity,
    'remaining_available', v_available - p_quantity
  );
END;
$$;

-- 2. IDEMPOTENT DELIVERY COMPLETION RPC WITH FIXED SEARCH PATH
CREATE OR REPLACE FUNCTION public.complete_fulfillment_delivery(
  p_fulfillment_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_status text;
  v_item RECORD;
  v_all_fulfilled boolean;
  v_order_id uuid;
BEGIN
  -- Lock fulfillment
  SELECT status INTO v_status
  FROM public.fulfillments
  WHERE id = p_fulfillment_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Fulfillment batch not found.';
  END IF;

  -- Idempotent check
  IF v_status = 'delivered' THEN
    RETURN jsonb_build_object('success', true, 'message', 'Fulfillment was already marked delivered.');
  END IF;

  -- Mark fulfillment as delivered
  UPDATE public.fulfillments
  SET status = 'delivered',
      delivered_at = NOW(),
      updated_at = NOW()
  WHERE id = p_fulfillment_id;

  -- Increment quantity_fulfilled on order_items
  FOR v_item IN
    SELECT order_item_id, quantity
    FROM public.fulfillment_items
    WHERE fulfillment_id = p_fulfillment_id
  LOOP
    UPDATE public.order_items
    SET quantity_fulfilled = quantity_fulfilled + v_item.quantity
    WHERE id = v_item.order_item_id
    RETURNING order_id INTO v_order_id;

    -- Update parent order status
    SELECT (COUNT(*) = COUNT(*) FILTER (WHERE (quantity_fulfilled + quantity_cancelled) >= quantity))
    INTO v_all_fulfilled
    FROM public.order_items
    WHERE order_id = v_order_id;

    IF v_all_fulfilled THEN
      UPDATE public.orders SET status = 'completed', updated_at = NOW() WHERE id = v_order_id;
    ELSE
      UPDATE public.orders SET status = 'partially_fulfilled', updated_at = NOW() WHERE id = v_order_id;
    END IF;
  END LOOP;

  RETURN jsonb_build_object('success', true, 'message', 'Fulfillment delivery completed successfully.');
END;
$$;

-- 3. CANCEL FULFILLMENT BATCH RPC
CREATE OR REPLACE FUNCTION public.cancel_fulfillment_batch(
  p_fulfillment_id uuid,
  p_reason text DEFAULT 'Batch cancelled'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_status text;
BEGIN
  SELECT status INTO v_status
  FROM public.fulfillments
  WHERE id = p_fulfillment_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Fulfillment batch not found.';
  END IF;

  IF v_status = 'delivered' THEN
    RAISE EXCEPTION 'Cannot cancel a fulfillment batch that has already been delivered.';
  END IF;

  UPDATE public.fulfillments
  SET status = 'cancelled',
      delivery_notes = COALESCE(delivery_notes, '') || ' [Cancelled: ' || p_reason || ']',
      updated_at = NOW()
  WHERE id = p_fulfillment_id;

  RETURN jsonb_build_object('success', true, 'message', 'Fulfillment batch cancelled successfully.');
END;
$$;

GRANT EXECUTE ON FUNCTION public.cancel_fulfillment_batch TO authenticated, service_role;
