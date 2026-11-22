-- Migration: Create device_tokens table for FCM push notifications

CREATE TABLE IF NOT EXISTS public.device_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  platform TEXT NOT NULL DEFAULT 'android',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_device_tokens_user_id ON public.device_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_device_tokens_token ON public.device_tokens(token);

ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;

-- Allow public (anon + authenticated) to insert and update device tokens
DROP POLICY IF EXISTS "Public device tokens access" ON public.device_tokens;
CREATE POLICY "Public device tokens access"
  ON public.device_tokens
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access device_tokens" ON public.device_tokens;
CREATE POLICY "Service role full access device_tokens"
  ON public.device_tokens
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
