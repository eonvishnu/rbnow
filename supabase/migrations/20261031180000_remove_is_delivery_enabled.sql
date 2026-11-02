-- Migration: Drop redundant is_delivery_enabled column from delivery_settings
-- Store open/closed status (is_store_open in store_settings) controls order placement globally

ALTER TABLE public.delivery_settings
  DROP COLUMN IF EXISTS is_delivery_enabled;

COMMENT ON TABLE public.delivery_settings IS
  'Singleton store delivery configuration. Order placement is governed globally by is_store_open in store_settings.';
