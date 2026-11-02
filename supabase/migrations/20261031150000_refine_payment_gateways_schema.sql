-- Migration: Refine payment_gateways schema based on production review recommendations
-- 1. Remove Razorpay-specific default secret references
-- 2. Change uniqueness to UNIQUE(provider, environment) for test/live coexistence
-- 3. Add check constraint ensuring key_id is present when active
-- 4. Add automatic updated_at trigger and secure RLS policies

-- 1. Drop Razorpay-specific column defaults
ALTER TABLE public.payment_gateways
  ALTER COLUMN secret_reference DROP DEFAULT,
  ALTER COLUMN webhook_secret_reference DROP DEFAULT;

-- 2. Update provider uniqueness to support environment-aware configurations
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payment_gateways_provider_key'
  ) THEN
    ALTER TABLE public.payment_gateways DROP CONSTRAINT payment_gateways_provider_key;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payment_gateways_provider_unique'
  ) THEN
    ALTER TABLE public.payment_gateways DROP CONSTRAINT payment_gateways_provider_unique;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payment_gateways_provider_env_unique'
  ) THEN
    ALTER TABLE public.payment_gateways
      ADD CONSTRAINT payment_gateways_provider_env_unique UNIQUE (provider, environment);
  END IF;
END $$;

-- 3. Add check constraint ensuring active gateways have a valid key_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_active_gateway_has_key'
  ) THEN
    ALTER TABLE public.payment_gateways
      ADD CONSTRAINT check_active_gateway_has_key
      CHECK (is_active = false OR (key_id IS NOT NULL AND key_id <> ''));
  END IF;
END $$;

-- 4. Automatic updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS payment_gateways_updated_at ON public.payment_gateways;
CREATE TRIGGER payment_gateways_updated_at
  BEFORE UPDATE ON public.payment_gateways
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 5. RLS Policies
ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read payment_gateways" ON public.payment_gateways;
CREATE POLICY "Public can read payment_gateways"
  ON public.payment_gateways FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Staff can manage payment_gateways" ON public.payment_gateways;
CREATE POLICY "Staff can manage payment_gateways"
  ON public.payment_gateways FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('super_admin', 'admin')
    )
  );
