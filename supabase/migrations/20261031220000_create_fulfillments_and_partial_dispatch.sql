-- Migration: Partial Fulfillment, Quality Holds, and Combined Customer Delivery Batches

-- 1. FULFILLMENTS / DELIVERY BATCHES TABLE
CREATE TABLE IF NOT EXISTS public.fulfillments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fulfillment_number text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'preparing' CHECK (status IN ('preparing', 'ready_for_dispatch', 'out_for_delivery', 'delivered', 'cancelled')),
  scheduled_delivery_at timestamptz,
  delivered_at timestamptz,
  delivery_notes text,
  driver_name text,
  driver_phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. FULFILLMENT ITEMS JUNCTION TABLE
CREATE TABLE IF NOT EXISTS public.fulfillment_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fulfillment_id uuid NOT NULL REFERENCES public.fulfillments(id) ON DELETE CASCADE,
  order_item_id uuid NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  quantity numeric(10,2) NOT NULL CHECK (quantity > 0),
  hold_reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. LINE-ITEM FULFILLMENT TRACKING ON ORDER_ITEMS
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS quantity_fulfilled numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS quantity_cancelled numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS quantity_on_hold numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS hold_reason text;

-- 4. RLS POLICIES FOR FULFILLMENT TABLES
ALTER TABLE public.fulfillments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fulfillment_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own fulfillments" ON public.fulfillments;
CREATE POLICY "Users can view own fulfillments" ON public.fulfillments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Staff can manage fulfillments" ON public.fulfillments;
CREATE POLICY "Staff can manage fulfillments" ON public.fulfillments FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('super_admin', 'admin', 'operations_staff')));

DROP POLICY IF EXISTS "Users can view own fulfillment items" ON public.fulfillment_items;
CREATE POLICY "Users can view own fulfillment items" ON public.fulfillment_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.fulfillments WHERE fulfillments.id = fulfillment_items.fulfillment_id AND fulfillments.user_id = auth.uid()));

DROP POLICY IF EXISTS "Staff can manage fulfillment items" ON public.fulfillment_items;
CREATE POLICY "Staff can manage fulfillment items" ON public.fulfillment_items FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('super_admin', 'admin', 'operations_staff')));

-- 5. Updated_at trigger for fulfillments
DROP TRIGGER IF EXISTS set_fulfillments_updated_at ON public.fulfillments;
CREATE TRIGGER set_fulfillments_updated_at
  BEFORE UPDATE ON public.fulfillments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.fulfillments IS
  'Physical delivery batches for dispatching orders. Supports partial fulfillment and combining multiple orders from the same customer into 1 delivery batch.';
