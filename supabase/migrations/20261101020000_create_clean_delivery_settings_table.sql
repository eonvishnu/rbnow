-- Migration: Replace delivery_settings and delivery_fee_rules with clean 1:1 UI delivery_settings table

DROP TABLE IF EXISTS public.delivery_fee_rules CASCADE;
DROP TABLE IF EXISTS public.delivery_settings CASCADE;

CREATE TABLE public.delivery_settings (
  id                          TEXT PRIMARY KEY DEFAULT 'default',
  is_free_delivery_enabled    BOOLEAN NOT NULL DEFAULT true,
  delivery_mode               TEXT NOT NULL DEFAULT 'preset_rules'
                                CHECK (delivery_mode IN ('preset_rules', 'distance_tiered', 'flat_fee')),
  flat_delivery_fee           NUMERIC(10,2) NOT NULL DEFAULT 65.00,

  -- Preset 2-Zone Values
  preset_zone_radius_km       NUMERIC(10,2) NOT NULL DEFAULT 5.00,
  preset_zone1_subtotal       NUMERIC(10,2) NOT NULL DEFAULT 299.00,
  preset_zone1_fee            NUMERIC(10,2) NOT NULL DEFAULT 30.00,
  preset_zone2_subtotal       NUMERIC(10,2) NOT NULL DEFAULT 499.00,
  preset_zone2_fee            NUMERIC(10,2) NOT NULL DEFAULT 30.00,

  -- Distance Tiered 3-Zone Values
  tier1_max_km                NUMERIC(10,2) NOT NULL DEFAULT 5.00,
  tier1_subtotal              NUMERIC(10,2) NOT NULL DEFAULT 299.00,
  tier1_fee                   NUMERIC(10,2) NOT NULL DEFAULT 30.00,

  tier2_max_km                NUMERIC(10,2) NOT NULL DEFAULT 10.00,
  tier2_subtotal              NUMERIC(10,2) NOT NULL DEFAULT 500.00,
  tier2_fee                   NUMERIC(10,2) NOT NULL DEFAULT 30.00,

  tier3_subtotal              NUMERIC(10,2) NOT NULL DEFAULT 699.00,
  tier3_fee                   NUMERIC(10,2) NOT NULL DEFAULT 30.00,

  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial default configuration row
INSERT INTO public.delivery_settings (id) VALUES ('default')
ON CONFLICT (id) DO NOTHING;

-- RLS Policies
ALTER TABLE public.delivery_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read delivery settings" ON public.delivery_settings;
CREATE POLICY "Anyone can read delivery settings"
  ON public.delivery_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff can update delivery settings" ON public.delivery_settings;
CREATE POLICY "Staff can update delivery settings"
  ON public.delivery_settings FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('super_admin', 'admin', 'operations_staff')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('super_admin', 'admin', 'operations_staff')));

COMMENT ON TABLE public.delivery_settings IS
  '1:1 UI mapped delivery settings table controlling free delivery modes, distance tiers, and flat delivery fees.';
