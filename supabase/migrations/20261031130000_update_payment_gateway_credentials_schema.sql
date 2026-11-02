-- Migration: Update payment_gateway_credentials table schema with secret_reference, verification_status, and timestamps

-- 1. Ensure columns exist with correct types
ALTER TABLE public.payment_gateway_credentials
  ADD COLUMN IF NOT EXISTS secret_reference text DEFAULT 'RAZORPAY_KEY_SECRET',
  ADD COLUMN IF NOT EXISTS webhook_secret_reference text DEFAULT 'RAZORPAY_WEBHOOK_SECRET',
  ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS last_verified_at timestamptz;

-- 2. Ensure verification_status check constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_verification_status'
  ) THEN
    ALTER TABLE public.payment_gateway_credentials
      ADD CONSTRAINT check_verification_status
      CHECK (verification_status IN ('unverified', 'verified', 'failed'));
  END IF;
END $$;

-- 3. Set NOT NULL on secret_reference
ALTER TABLE public.payment_gateway_credentials
  ALTER COLUMN secret_reference SET NOT NULL;

-- 4. Enable RLS on payment_gateway_credentials and enforce admin-only access
ALTER TABLE public.payment_gateway_credentials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can manage payment_gateway_credentials" ON public.payment_gateway_credentials;

CREATE POLICY "Staff can manage payment_gateway_credentials"
  ON public.payment_gateway_credentials FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('super_admin', 'admin')
    )
  );

-- 5. Updated_at trigger for credentials
DROP TRIGGER IF EXISTS set_payment_gateway_credentials_updated_at ON public.payment_gateway_credentials;
CREATE TRIGGER set_payment_gateway_credentials_updated_at
  BEFORE UPDATE ON public.payment_gateway_credentials
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

COMMENT ON TABLE public.payment_gateway_credentials IS
  'Stores Key ID, secret references pointers, verification status, and timestamps. Actual secret keys stay in Supabase Vault/Secrets.';
