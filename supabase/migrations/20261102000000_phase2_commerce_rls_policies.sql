-- PHASE 2 MIGRATION: ROW-LEVEL SECURITY (RLS) POLICIES FOR COMMERCE TABLES

-- ENABLE RLS ON ALL COMMERCE TABLES
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkout_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_webhook_events ENABLE ROW LEVEL SECURITY;

-- 1. CARTS & CART_ITEMS POLICIES
DROP POLICY IF EXISTS "Customers can view own active cart" ON public.carts;
CREATE POLICY "Customers can view own active cart"
  ON public.carts FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Customers can insert own cart" ON public.carts;
CREATE POLICY "Customers can insert own cart"
  ON public.carts FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Customers can update own cart" ON public.carts;
CREATE POLICY "Customers can update own cart"
  ON public.carts FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Customers can view own cart items" ON public.cart_items;
CREATE POLICY "Customers can view own cart items"
  ON public.cart_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_items.cart_id AND c.user_id = auth.uid()));

DROP POLICY IF EXISTS "Customers can manage own cart items" ON public.cart_items;
CREATE POLICY "Customers can manage own cart items"
  ON public.cart_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_items.cart_id AND c.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_items.cart_id AND c.user_id = auth.uid()));

-- 2. CHECKOUTS & CHECKOUT_ITEMS POLICIES
DROP POLICY IF EXISTS "Customers can view own checkouts" ON public.checkouts;
CREATE POLICY "Customers can view own checkouts"
  ON public.checkouts FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Customers can view own checkout items" ON public.checkout_items;
CREATE POLICY "Customers can view own checkout items"
  ON public.checkout_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.checkouts c WHERE c.id = checkout_items.checkout_id AND c.user_id = auth.uid()));

-- NO DIRECT PUBLIC INSERT/UPDATE/DELETE ON CHECKOUTS (EXECUTE VIA SERVICE_ROLE EDGE FUNCTIONS ONLY)

-- 3. PAYMENTS POLICIES
DROP POLICY IF EXISTS "Customers can view own payments" ON public.payments;
CREATE POLICY "Customers can view own payments"
  ON public.payments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.checkouts c WHERE c.id = payments.checkout_id AND c.user_id = auth.uid()));

-- NO DIRECT PUBLIC INSERT/UPDATE/DELETE ON PAYMENTS

-- 4. ORDERS & ORDER_ITEMS POLICIES
DROP POLICY IF EXISTS "Customers can view own orders" ON public.orders;
CREATE POLICY "Customers can view own orders"
  ON public.orders FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Customers can view own order items" ON public.order_items;
CREATE POLICY "Customers can view own order items"
  ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()));

-- NO DIRECT PUBLIC INSERT/UPDATE/DELETE ON ORDERS (CONVERSIONS EXECUTED VIA SERVICE_ROLE ONLY)

-- 5. PAYMENT_WEBHOOK_EVENTS POLICIES
-- NO PUBLIC SELECT/INSERT/UPDATE ACCESS ON WEBHOOK LEDGER (SERVICE_ROLE & ADMIN ONLY)

-- 6. STAFF & OPERATIONAL AUTHORIZATION POLICIES (AUTHENTICATED STAFF ONLY)
DROP POLICY IF EXISTS "Staff full access to checkouts" ON public.checkouts;
CREATE POLICY "Staff full access to checkouts"
  ON public.checkouts FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('super_admin', 'admin', 'operations_staff', 'support_agent')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('super_admin', 'admin', 'operations_staff', 'support_agent')));

DROP POLICY IF EXISTS "Staff full access to checkout_items" ON public.checkout_items;
CREATE POLICY "Staff full access to checkout_items"
  ON public.checkout_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('super_admin', 'admin', 'operations_staff', 'support_agent')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('super_admin', 'admin', 'operations_staff', 'support_agent')));

DROP POLICY IF EXISTS "Staff full access to payments" ON public.payments;
CREATE POLICY "Staff full access to payments"
  ON public.payments FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('super_admin', 'admin', 'operations_staff', 'support_agent')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('super_admin', 'admin', 'operations_staff', 'support_agent')));

DROP POLICY IF EXISTS "Staff full access to orders" ON public.orders;
CREATE POLICY "Staff full access to orders"
  ON public.orders FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('super_admin', 'admin', 'operations_staff', 'support_agent')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('super_admin', 'admin', 'operations_staff', 'support_agent')));

DROP POLICY IF EXISTS "Staff full access to order_items" ON public.order_items;
CREATE POLICY "Staff full access to order_items"
  ON public.order_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('super_admin', 'admin', 'operations_staff', 'support_agent')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('super_admin', 'admin', 'operations_staff', 'support_agent')));

DROP POLICY IF EXISTS "Staff view webhook events" ON public.payment_webhook_events;
CREATE POLICY "Staff view webhook events"
  ON public.payment_webhook_events FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('super_admin', 'admin', 'operations_staff')));
