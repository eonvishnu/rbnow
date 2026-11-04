-- 1. Add fulfillment_type and expected_available_date columns for Preorder Sourcing
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS fulfillment_type text NOT NULL DEFAULT 'regular',
  ADD COLUMN IF NOT EXISTS expected_available_date date NULL;

-- 2. Add fulfillment_type check constraint
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_fulfillment_type_check;
ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_fulfillment_type_check
  CHECK (fulfillment_type IN ('regular', 'preorder'));

-- 3. Update fulfillment_status check constraint to support preorders & quality holds
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_fulfillment_status_check;
ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_fulfillment_status_check
  CHECK (
    fulfillment_status IN (
      'pending',
      'awaiting_preorder',
      'backordered',
      'quality_hold',
      'packed',
      'delivered',
      'unavailable'
    )
  );

-- 4. Add quantity validation check
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_quantity_check;
ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_quantity_check
  CHECK (
    quantity > 0
    AND quantity_fulfilled >= 0
    AND quantity_cancelled >= 0
    AND quantity_on_hold >= 0
    AND (quantity_fulfilled + quantity_cancelled + quantity_on_hold) <= quantity
  );
