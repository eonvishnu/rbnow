-- Enable RLS on delivery_settings
ALTER TABLE public.delivery_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to delivery_settings for storefront checkout
DROP POLICY IF EXISTS "Public read delivery_settings" ON public.delivery_settings;
CREATE POLICY "Public read delivery_settings" ON public.delivery_settings
FOR SELECT
USING (true);

-- Allow full access to delivery_settings for admin and dev
DROP POLICY IF EXISTS "Full access delivery_settings" ON public.delivery_settings;
CREATE POLICY "Full access delivery_settings" ON public.delivery_settings
FOR ALL
USING (true)
WITH CHECK (true);
