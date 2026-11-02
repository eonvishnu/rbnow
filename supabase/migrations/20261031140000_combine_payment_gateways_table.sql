-- Migration: Consolidate payment_gateways and payment_gateway_credentials into 1 single table

-- 1. Add credential metadata columns directly to public.payment_gateways
ALTER TABLE public.payment_gateways
  ADD COLUMN IF NOT EXISTS key_id text,
  ADD COLUMN IF NOT EXISTS secret_reference text DEFAULT 'RAZORPAY_KEY_SECRET',
  ADD COLUMN IF NOT EXISTS webhook_secret_reference text DEFAULT 'RAZORPAY_WEBHOOK_SECRET',
  ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS last_verified_at timestamptz;

-- 2. Migrate existing key_id data from payment_gateway_credentials if present
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'payment_gateway_credentials'
  ) THEN
    UPDATE public.payment_gateways g
    SET
      key_id = c.key_id,
      secret_reference = COALESCE(c.secret_reference, UPPER(g.provider) || '_KEY_SECRET'),
      webhook_secret_reference = COALESCE(c.webhook_secret_reference, UPPER(g.provider) || '_WEBHOOK_SECRET'),
      verification_status = COALESCE(c.verification_status, 'verified'),
      last_verified_at = COALESCE(c.last_verified_at, now())
    FROM public.payment_gateway_credentials c
    WHERE c.gateway_id::text = g.id::text OR c.gateway_id::text = g.provider;
  END IF;
END $$;

-- 3. Drop legacy payment_gateway_credentials table
DROP TABLE IF EXISTS public.payment_gateway_credentials CASCADE;

-- 4. Enable RLS on single combined payment_gateways table
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

COMMENT ON TABLE public.payment_gateways IS
  'Consolidated single table storing payment gateway configuration, publishable key_id, vault secret references, and active status.';
