-- Migration: Remove max_delivery_distance_km from delivery_settings
-- Distance is used exclusively by delivery_fee_rules to determine pricing and eligibility

ALTER TABLE public.delivery_settings
  DROP COLUMN IF EXISTS max_delivery_distance_km;

COMMENT ON TABLE public.delivery_settings IS
  'Singleton store delivery configuration. Distance is used exclusively by rules to determine fees and eligibility.';
