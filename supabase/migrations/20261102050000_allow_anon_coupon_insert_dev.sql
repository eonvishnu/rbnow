-- Enable insert/update/delete on public.coupons for public/anon & authenticated users
DROP POLICY IF EXISTS "Public full access coupons" ON public.coupons;
CREATE POLICY "Public full access coupons" ON public.coupons
FOR ALL
USING (true)
WITH CHECK (true);
