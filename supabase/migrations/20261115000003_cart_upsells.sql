-- Migration: Create cart_upsells table for cart upsell recommendations

CREATE TABLE IF NOT EXISTS public.cart_upsells (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
  title TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cart_upsells_active ON public.cart_upsells(is_active, display_order);

ALTER TABLE public.cart_upsells ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active cart upsells" ON public.cart_upsells;
CREATE POLICY "Public can view active cart upsells"
  ON public.cart_upsells FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admin full access cart upsells" ON public.cart_upsells;
CREATE POLICY "Admin full access cart upsells"
  ON public.cart_upsells FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
