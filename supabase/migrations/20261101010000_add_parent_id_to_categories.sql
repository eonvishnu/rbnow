-- Migration: Add parent_id self-referential hierarchy to categories and optimize category_id FK on products

-- 1) ADD PARENT_ID & IS_ACTIVE TO PUBLIC.CATEGORIES
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.categories(id) ON DELETE RESTRICT,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- 2) PERFORMANCE INDEX FOR CATEGORY HIERARCHY
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);

-- 3) ENSURE PRODUCTS.CATEGORY_ID INDEX EXISTS
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);

COMMENT ON COLUMN public.categories.parent_id IS
  'Self-referential foreign key for nested category hierarchies (parent_id = NULL for main category, parent_id = category UUID for subcategories).';
