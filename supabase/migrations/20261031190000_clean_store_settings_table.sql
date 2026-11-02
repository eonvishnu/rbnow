-- Migration: Clean store_settings table by removing legacy delivery columns
-- Delivery pricing & limits are managed exclusively in delivery_settings & delivery_fee_rules

ALTER TABLE public.store_settings
  DROP COLUMN IF EXISTS min_order_amount,
  DROP COLUMN IF EXISTS free_delivery_threshold,
  DROP COLUMN IF EXISTS delivery_fee_per_km;

COMMENT ON TABLE public.store_settings IS
  'Singleton store settings containing store name, address, store open/closed status, and hub coordinates.';
