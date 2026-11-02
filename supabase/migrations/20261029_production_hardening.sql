-- Apply after the existing Supabase schema; safe to run more than once.
BEGIN;

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coupon_id uuid REFERENCES public.coupons(id) ON DELETE SET NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS browser_id text;

REVOKE ALL ON FUNCTION public.confirm_order_payment(UUID, TEXT, NUMERIC) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_order_payment(UUID, TEXT, NUMERIC) TO service_role;

-- Role lookup is SECURITY DEFINER to avoid recursive profile RLS checks. It returns only the caller's role.
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;
REVOKE ALL ON FUNCTION public.current_user_role() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_user_role() TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can update profile roles" ON public.profiles;
DROP POLICY IF EXISTS "Admin read-only inventory_transactions" ON public.inventory_transactions;
DROP POLICY IF EXISTS "Admin write inventory_transactions" ON public.inventory_transactions;
DROP POLICY IF EXISTS "Admin read-only order_status_history" ON public.order_status_history;
DROP POLICY IF EXISTS "Admin write order_status_history" ON public.order_status_history;
DROP POLICY IF EXISTS "Admin read-only payments" ON public.payments;
DROP POLICY IF EXISTS "Admin write payments" ON public.payments;
DROP POLICY IF EXISTS "Admin full access categories" ON public.categories;
DROP POLICY IF EXISTS "Admin full access products" ON public.products;
DROP POLICY IF EXISTS "Admin full access product_variants" ON public.product_variants;
DROP POLICY IF EXISTS "Admin full access banners" ON public.banners;
DROP POLICY IF EXISTS "Admin full access coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admin full access carts" ON public.carts;
DROP POLICY IF EXISTS "Admin full access checkout_sessions" ON public.checkout_sessions;
DROP POLICY IF EXISTS "Admin full access preorder_campaigns" ON public.preorder_campaigns;
DROP POLICY IF EXISTS "Admin full access discounts" ON public.discounts;
DROP POLICY IF EXISTS "Admin full access discount_variants" ON public.discount_variants;
DROP POLICY IF EXISTS "Admin full access order_item_changes" ON public.order_item_changes;
DROP POLICY IF EXISTS "Admin full access admin_audit_logs" ON public.admin_audit_logs;
DROP POLICY IF EXISTS "Admin full access suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Admin full access purchase_orders" ON public.purchase_orders;
DROP POLICY IF EXISTS "Admin full access purchase_order_items" ON public.purchase_order_items;

CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can read profiles" ON public.profiles FOR SELECT USING (
  public.current_user_role() IN ('super_admin', 'admin')
);
CREATE POLICY "Super admins can update profile roles" ON public.profiles FOR UPDATE
  USING (public.current_user_role() = 'super_admin')
  WITH CHECK (public.current_user_role() = 'super_admin');

-- Admin & Staff Access Policies
create policy "Admin read-only inventory_transactions" on public.inventory_transactions for select using (
  public.current_user_role() in ('super_admin', 'admin', 'operations_staff', 'read_only')
);
create policy "Admin write inventory_transactions" on public.inventory_transactions for all using (
  public.current_user_role() in ('super_admin', 'admin', 'operations_staff')
);

create policy "Admin read-only order_status_history" on public.order_status_history for select using (
  public.current_user_role() in ('super_admin', 'admin', 'operations_staff', 'support_agent', 'read_only')
);
create policy "Admin write order_status_history" on public.order_status_history for all using (
  public.current_user_role() in ('super_admin', 'admin', 'operations_staff', 'support_agent')
);

create policy "Admin read-only payments" on public.payments for select using (
  public.current_user_role() in ('super_admin', 'admin', 'read_only')
);
create policy "Admin write payments" on public.payments for all using (
  public.current_user_role() in ('super_admin', 'admin')
);

create policy "Admin full access categories" on public.categories for all using (
  public.current_user_role() in ('super_admin', 'admin')
);

create policy "Admin full access products" on public.products for all using (
  public.current_user_role() in ('super_admin', 'admin', 'operations_staff')
);

create policy "Admin full access product_variants" on public.product_variants for all using (
  public.current_user_role() in ('super_admin', 'admin', 'operations_staff')
);

create policy "Admin full access banners" on public.banners for all using (
  public.current_user_role() in ('super_admin', 'admin')
);

create policy "Admin full access coupons" on public.coupons for all using (
  public.current_user_role() in ('super_admin', 'admin')
);

create policy "Admin full access carts" on public.carts for select using (
  public.current_user_role() in ('super_admin', 'admin', 'support_agent', 'read_only')
);

create policy "Admin full access checkout_sessions" on public.checkout_sessions for select using (
  public.current_user_role() in ('super_admin', 'admin', 'support_agent', 'read_only')
);

create policy "Admin full access preorder_campaigns" on public.preorder_campaigns for all using (
  public.current_user_role() in ('super_admin', 'admin', 'operations_staff')
);

create policy "Admin full access discounts" on public.discounts for all using (
  public.current_user_role() in ('super_admin', 'admin')
);

create policy "Admin full access discount_variants" on public.discount_variants for all using (
  public.current_user_role() in ('super_admin', 'admin')
);

create policy "Admin full access order_item_changes" on public.order_item_changes for all using (
  public.current_user_role() in ('super_admin', 'admin', 'support_agent')
);

create policy "Admin full access admin_audit_logs" on public.admin_audit_logs for select using (
  public.current_user_role() in ('super_admin', 'admin', 'read_only')
);

create policy "Admin full access suppliers" on public.suppliers for all using (
  public.current_user_role() in ('super_admin', 'admin', 'operations_staff')
);

create policy "Admin full access purchase_orders" on public.purchase_orders for all using (
  public.current_user_role() in ('super_admin', 'admin', 'operations_staff')
);

create policy "Admin full access purchase_order_items" on public.purchase_order_items for all using (
  public.current_user_role() in ('super_admin', 'admin', 'operations_staff')
);

CREATE OR REPLACE FUNCTION public.prevent_unverified_razorpay_payment_mutation()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.role() IS DISTINCT FROM 'service_role'
     AND current_user NOT IN ('postgres', 'supabase_admin')
     AND (OLD.payment_method = 'razorpay' OR NEW.payment_method = 'razorpay')
     AND (
       NEW.payment_method IS DISTINCT FROM OLD.payment_method
       OR NEW.payment_status IS DISTINCT FROM OLD.payment_status
       OR NEW.razorpay_payment_id IS DISTINCT FROM OLD.razorpay_payment_id
     ) THEN
    RAISE EXCEPTION 'Razorpay payment state can only be changed by the verified payment backend.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_razorpay_payment_state ON public.orders;
CREATE TRIGGER protect_razorpay_payment_state
  BEFORE UPDATE OF payment_method, payment_status, razorpay_payment_id ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.prevent_unverified_razorpay_payment_mutation();

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check
  CHECK (status in ('pending_payment', 'pending', 'confirmed', 'processing', 'preparing', 'ready_for_delivery', 'out_for_delivery', 'delivered', 'cancelled'));

DROP POLICY IF EXISTS "Staff can read all orders" ON public.orders;
DROP POLICY IF EXISTS "Staff can create manual orders" ON public.orders;
DROP POLICY IF EXISTS "Staff can update order records" ON public.orders;
DROP POLICY IF EXISTS "Staff can read all order items" ON public.order_items;
DROP POLICY IF EXISTS "Staff can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Staff can update order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can update store settings" ON public.store_settings;
DROP POLICY IF EXISTS "Staff can create audit logs" ON public.admin_audit_logs;
DROP POLICY IF EXISTS "Staff can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Staff can manage product images" ON storage.objects;
DROP POLICY IF EXISTS "Staff can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload category and banner images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage category and banner images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete category and banner images" ON storage.objects;

CREATE POLICY "Staff can read all orders" ON public.orders FOR SELECT USING (
  public.current_user_role() IN ('super_admin', 'admin', 'operations_staff', 'support_agent', 'read_only')
);
CREATE POLICY "Staff can create manual orders" ON public.orders FOR INSERT WITH CHECK (
  public.current_user_role() IN ('super_admin', 'admin', 'operations_staff')
);
CREATE POLICY "Staff can update order records" ON public.orders FOR UPDATE
  USING (public.current_user_role() IN ('super_admin', 'admin', 'operations_staff', 'support_agent'))
  WITH CHECK (public.current_user_role() IN ('super_admin', 'admin', 'operations_staff', 'support_agent'));

CREATE POLICY "Staff can read all order items" ON public.order_items FOR SELECT USING (
  public.current_user_role() IN ('super_admin', 'admin', 'operations_staff', 'support_agent', 'read_only')
);
CREATE POLICY "Staff can insert order items" ON public.order_items FOR INSERT WITH CHECK (
  public.current_user_role() IN ('super_admin', 'admin', 'operations_staff')
);
CREATE POLICY "Staff can update order items" ON public.order_items FOR UPDATE
  USING (public.current_user_role() IN ('super_admin', 'admin', 'operations_staff', 'support_agent'))
  WITH CHECK (public.current_user_role() IN ('super_admin', 'admin', 'operations_staff', 'support_agent'));

CREATE POLICY "Admins can update store settings" ON public.store_settings FOR UPDATE
  USING (public.current_user_role() IN ('super_admin', 'admin'))
  WITH CHECK (public.current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Staff can create audit logs" ON public.admin_audit_logs FOR INSERT WITH CHECK (
  public.current_user_role() IN ('super_admin', 'admin', 'operations_staff')
  AND (admin_id IS NULL OR admin_id = auth.uid())
);

CREATE POLICY "Staff can upload product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'products' AND public.current_user_role() IN ('super_admin', 'admin', 'operations_staff')
);
CREATE POLICY "Staff can manage product images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'products' AND public.current_user_role() IN ('super_admin', 'admin', 'operations_staff'))
  WITH CHECK (bucket_id = 'products' AND public.current_user_role() IN ('super_admin', 'admin', 'operations_staff'));
CREATE POLICY "Staff can delete product images" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'products' AND public.current_user_role() IN ('super_admin', 'admin', 'operations_staff')
);

CREATE POLICY "Admins can upload category and banner images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id IN ('categories', 'banners') AND public.current_user_role() IN ('super_admin', 'admin')
);
CREATE POLICY "Admins can manage category and banner images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('categories', 'banners') AND public.current_user_role() IN ('super_admin', 'admin'))
  WITH CHECK (bucket_id IN ('categories', 'banners') AND public.current_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "Admins can delete category and banner images" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id IN ('categories', 'banners') AND public.current_user_role() IN ('super_admin', 'admin')
);

COMMIT;
