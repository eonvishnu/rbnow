-- Migration: Add secret_key and webhook_secret columns to public.payment_gateways table
ALTER TABLE public.payment_gateways
  ADD COLUMN IF NOT EXISTS secret_key text,
  ADD COLUMN IF NOT EXISTS webhook_secret text;
