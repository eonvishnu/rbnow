-- Migration: Enforce schema constraints and database-level single active gateway constraint
-- Ensure NOT NULL constraints, unique provider, automatic updated_at, and partial unique index

-- 1. Ensure NOT NULL constraints and defaults
ALTER TABLE public.payment_gateways
  ALTER COLUMN provider SET NOT NULL,
  ALTER COLUMN display_name SET NOT NULL,
  ALTER COLUMN is_active SET NOT NULL,
  ALTER COLUMN is_active SET DEFAULT false,
  ALTER COLUMN environment SET NOT NULL,
  ALTER COLUMN environment SET DEFAULT 'test',
  ALTER COLUMN created_at SET NOT NULL,
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET NOT NULL,
  ALTER COLUMN updated_at SET DEFAULT now();

-- 2. Unique constraint on provider
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payment_gateways_provider_unique'
  ) THEN
    ALTER TABLE public.payment_gateways
      ADD CONSTRAINT payment_gateways_provider_unique UNIQUE (provider);
  END IF;
END $$;

-- 3. Deactivate any duplicate active gateways prior to creating partial unique index
WITH active_rows AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY updated_at DESC) as rn
  FROM public.payment_gateways
  WHERE is_active = true
)
UPDATE public.payment_gateways
SET is_active = false
WHERE id IN (SELECT id FROM active_rows WHERE rn > 1);

-- 4. Database-level partial unique index ensuring MAX 1 active gateway at any time
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_gateways_single_active
  ON public.payment_gateways (is_active)
  WHERE is_active = true;

-- 5. Automatic updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_payment_gateways_updated_at ON public.payment_gateways;
CREATE TRIGGER set_payment_gateways_updated_at
  BEFORE UPDATE ON public.payment_gateways
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
