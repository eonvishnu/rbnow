-- Add store_latitude and store_longitude columns to public.delivery_settings
ALTER TABLE public.delivery_settings
  ADD COLUMN IF NOT EXISTS store_latitude numeric(10, 6) DEFAULT 17.351452,
  ADD COLUMN IF NOT EXISTS store_longitude numeric(10, 6) DEFAULT 78.391039;
