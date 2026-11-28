-- Migration: Add key_secret, secret_key, and webhook_secret columns to public.payment_gateways

ALTER TABLE public.payment_gateways
  ADD COLUMN IF NOT EXISTS key_secret text,
  ADD COLUMN IF NOT EXISTS secret_key text,
  ADD COLUMN IF NOT EXISTS webhook_secret text;
