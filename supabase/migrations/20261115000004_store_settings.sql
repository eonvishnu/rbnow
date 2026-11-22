-- Migration: Create store_settings table for open/closed status

CREATE TABLE IF NOT EXISTS public.store_settings (
  id TEXT NOT NULL DEFAULT 'default'::text,
  is_store_open BOOLEAN NULL DEFAULT TRUE,
  store_name TEXT NULL DEFAULT 'E-Commerce Store'::text,
  store_address TEXT NULL,
  store_latitude DOUBLE PRECISION NULL DEFAULT 19.0760,
  store_longitude DOUBLE PRECISION NULL DEFAULT 72.8777,
  created_at TIMESTAMPTZ NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NULL DEFAULT NOW(),
  CONSTRAINT store_settings_pkey PRIMARY KEY (id)
);

INSERT INTO public.store_settings (id, is_store_open, store_name)
VALUES ('default', true, 'Royal Bengal')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view store_settings" ON public.store_settings;
CREATE POLICY "Public can view store_settings"
  ON public.store_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin full access store_settings" ON public.store_settings;
CREATE POLICY "Admin full access store_settings"
  ON public.store_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
