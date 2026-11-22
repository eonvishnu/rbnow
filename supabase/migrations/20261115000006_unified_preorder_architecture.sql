-- Migration: Unified Preorder Architecture on Products & Variants

-- 1. PRODUCTS TABLE: Preorder Configuration
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS sale_mode TEXT NOT NULL DEFAULT 'regular' CHECK (sale_mode IN ('regular', 'preorder')),
  ADD COLUMN IF NOT EXISTS preorder_start_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS preorder_end_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS expected_dispatch_date DATE,
  ADD COLUMN IF NOT EXISTS preorder_description TEXT;

-- 2. PRODUCT_VARIANTS TABLE: Preorder Capacity & Limits
ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS preorder_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS preorder_limit INTEGER,
  ADD COLUMN IF NOT EXISTS preorder_reserved_qty INTEGER NOT NULL DEFAULT 0;

-- 3. ORDER_ITEMS TABLE: Preorder Snapshots for Historical Preservation
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS is_preorder BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS expected_dispatch_date DATE,
  ADD COLUMN IF NOT EXISTS sale_mode_snapshot TEXT DEFAULT 'regular';

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_sale_mode ON public.products(sale_mode);
CREATE INDEX IF NOT EXISTS idx_product_variants_preorder_enabled ON public.product_variants(preorder_enabled);
