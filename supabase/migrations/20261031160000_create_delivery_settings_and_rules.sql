-- Migration: Flexible Delivery Settings & Rule Engine with JSONB Order Snapshots

-- 1. SINGLETON STORE DELIVERY SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.delivery_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_latitude numeric(10,7) NOT NULL DEFAULT 17.351452,
  store_longitude numeric(10,7) NOT NULL DEFAULT 78.391039,
  max_delivery_distance_km numeric(8,2) DEFAULT 15.00,
  is_delivery_enabled boolean NOT NULL DEFAULT true,
  delivery_pricing_mode text NOT NULL DEFAULT 'rules' CHECK (delivery_pricing_mode IN ('always_free', 'rules', 'distance_based')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Singleton index guaranteeing max 1 row in delivery_settings
CREATE UNIQUE INDEX IF NOT EXISTS delivery_settings_singleton
  ON public.delivery_settings ((true));

-- Seed initial default delivery_settings row if empty
INSERT INTO public.delivery_settings (store_latitude, store_longitude, max_delivery_distance_km, is_delivery_enabled)
SELECT 17.351452, 78.391039, 15.00, true
WHERE NOT EXISTS (SELECT 1 FROM public.delivery_settings);

-- 2. DYNAMIC DELIVERY FEE & ELIGIBILITY RULES TABLE
CREATE TABLE IF NOT EXISTS public.delivery_fee_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  min_distance_km numeric(8,2) NOT NULL DEFAULT 0,
  max_distance_km numeric(8,2),
  min_order_amount numeric(12,2) NOT NULL DEFAULT 0,
  max_order_amount numeric(12,2),
  min_checkout_subtotal numeric(12,2) NOT NULL DEFAULT 0,
  fee_type text NOT NULL DEFAULT 'free' CHECK (fee_type IN ('free', 'fixed', 'per_km')),
  fee_amount numeric(10,2) NOT NULL DEFAULT 0,
  priority integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT delivery_fee_valid_distance CHECK (min_distance_km >= 0 AND (max_distance_km IS NULL OR max_distance_km > min_distance_km)),
  CONSTRAINT delivery_fee_valid_order CHECK (min_order_amount >= 0 AND (max_order_amount IS NULL OR max_order_amount > min_order_amount)),
  CONSTRAINT delivery_fee_valid_amount CHECK (fee_amount >= 0)
);

-- Seed initial default rules:
-- Rule 1: Within 5km, min checkout ₹300, Free delivery
-- Rule 2: Outside 5km, min checkout ₹500, Free delivery for orders >= ₹500
-- Rule 3: Outside 5km, subtotal < ₹500, ₹40 delivery fee
INSERT INTO public.delivery_fee_rules (
  name, min_distance_km, max_distance_km, min_order_amount, max_order_amount, min_checkout_subtotal, fee_type, fee_amount, priority, is_active
)
SELECT 'Free delivery within 5 km (min ₹300 order)', 0, 5, 0, NULL, 300, 'free', 0, 1, true
WHERE NOT EXISTS (SELECT 1 FROM public.delivery_fee_rules WHERE name LIKE 'Free delivery within 5 km%');

INSERT INTO public.delivery_fee_rules (
  name, min_distance_km, max_distance_km, min_order_amount, max_order_amount, min_checkout_subtotal, fee_type, fee_amount, priority, is_active
)
SELECT 'Free delivery outside 5 km (orders >= ₹500)', 5, NULL, 500, NULL, 500, 'free', 0, 2, true
WHERE NOT EXISTS (SELECT 1 FROM public.delivery_fee_rules WHERE name LIKE 'Free delivery outside 5 km%');

INSERT INTO public.delivery_fee_rules (
  name, min_distance_km, max_distance_km, min_order_amount, max_order_amount, min_checkout_subtotal, fee_type, fee_amount, priority, is_active
)
SELECT 'Standard delivery fee outside 5 km (orders < ₹500)', 5, NULL, 0, 500, 0, 'fixed', 40, 3, true
WHERE NOT EXISTS (SELECT 1 FROM public.delivery_fee_rules WHERE name LIKE 'Standard delivery fee outside 5 km%');

-- 3. HISTORICAL SNAPSHOT COLUMNS ON ORDERS
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS delivery_distance_km numeric(8,2),
  ADD COLUMN IF NOT EXISTS delivery_fee numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivery_rule_id uuid REFERENCES public.delivery_fee_rules(id),
  ADD COLUMN IF NOT EXISTS delivery_rule_snapshot jsonb;

-- 4. RLS POLICIES FOR DELIVERY TABLES
ALTER TABLE public.delivery_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_fee_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read delivery_settings" ON public.delivery_settings;
CREATE POLICY "Public can read delivery_settings" ON public.delivery_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff can manage delivery_settings" ON public.delivery_settings;
CREATE POLICY "Staff can manage delivery_settings" ON public.delivery_settings FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('super_admin', 'admin')));

DROP POLICY IF EXISTS "Public can read active delivery_fee_rules" ON public.delivery_fee_rules;
CREATE POLICY "Public can read active delivery_fee_rules" ON public.delivery_fee_rules FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Staff can manage delivery_fee_rules" ON public.delivery_fee_rules;
CREATE POLICY "Staff can manage delivery_fee_rules" ON public.delivery_fee_rules FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('super_admin', 'admin')));

-- Triggers for updated_at
DROP TRIGGER IF EXISTS set_delivery_settings_updated_at ON public.delivery_settings;
CREATE TRIGGER set_delivery_settings_updated_at
  BEFORE UPDATE ON public.delivery_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_delivery_fee_rules_updated_at ON public.delivery_fee_rules;
CREATE TRIGGER set_delivery_fee_rules_updated_at
  BEFORE UPDATE ON public.delivery_fee_rules
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
