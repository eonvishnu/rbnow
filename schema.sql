-- ============================================================================
-- ROYAL BENGAL E-COMMERCE LIVE DATABASE SCHEMA, RLS, TRIGGERS, FUNCTIONS & GRANTS
-- Synchronized with Live Supabase Database
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- SEQUENCES
-- ----------------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.orders_confirmed_order_number_seq
  INCREMENT BY 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;

CREATE SEQUENCE IF NOT EXISTS public.order_number_seq
  INCREMENT BY 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;


-- ----------------------------------------------------------------------------
-- 1. PROFILES & USERS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL,
  email TEXT NULL,
  display_name TEXT NULL,
  phone_number TEXT NULL,
  role TEXT NULL DEFAULT 'customer'::text,
  is_verified BOOLEAN NULL DEFAULT false,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS profiles_pkey ON public.profiles USING btree (id);


-- ----------------------------------------------------------------------------
-- 2. ADDRESSES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  house_no TEXT NULL,
  building_name TEXT NULL,
  area TEXT NULL,
  landmark TEXT NULL,
  city TEXT NULL,
  pincode TEXT NULL,
  latitude DOUBLE PRECISION NULL,
  longitude DOUBLE PRECISION NULL,
  address_type TEXT NULL DEFAULT 'home'::text,
  is_default BOOLEAN NULL DEFAULT false,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT addresses_pkey PRIMARY KEY (id),
  CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS addresses_pkey ON public.addresses USING btree (id);


-- ----------------------------------------------------------------------------
-- 3. ADMIN AUDIT LOGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  admin_id UUID NULL,
  action TEXT NOT NULL,
  entity_type TEXT NULL,
  entity_id UUID NULL,
  details JSONB NULL,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT admin_audit_logs_pkey PRIMARY KEY (id),
  CONSTRAINT admin_audit_logs_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.profiles (id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS admin_audit_logs_pkey ON public.admin_audit_logs USING btree (id);


-- ----------------------------------------------------------------------------
-- 4. BANNERS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  title TEXT NULL,
  image_url TEXT NOT NULL,
  link TEXT NULL,
  status TEXT NULL DEFAULT 'active'::text,
  order_index INTEGER NULL DEFAULT 0,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT banners_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS banners_pkey ON public.banners USING btree (id);


-- ----------------------------------------------------------------------------
-- 5. CATEGORIES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT NULL,
  status TEXT NULL DEFAULT 'active'::text,
  order_index INTEGER NULL DEFAULT 0,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  parent_id UUID NULL,
  description TEXT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories (id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS categories_pkey ON public.categories USING btree (id);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories USING btree (parent_id);


-- ----------------------------------------------------------------------------
-- 6. PRODUCTS & VARIANTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NULL,
  image_url TEXT NULL,
  category_id UUID NULL,
  category_name TEXT NULL,
  is_available BOOLEAN NULL DEFAULT true,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NULL DEFAULT now(),
  is_preorder BOOLEAN NOT NULL DEFAULT false,
  preorder_delivery_date DATE NULL,
  preorder_limit INTEGER NULL,
  sale_mode TEXT NOT NULL DEFAULT 'regular'::text,
  preorder_start_at TIMESTAMPTZ NULL,
  preorder_end_at TIMESTAMPTZ NULL,
  expected_dispatch_date DATE NULL,
  preorder_description TEXT NULL,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories (id) ON DELETE SET NULL,
  CONSTRAINT products_sale_mode_check CHECK (sale_mode = ANY (ARRAY['regular'::text, 'preorder'::text]))
);
CREATE UNIQUE INDEX IF NOT EXISTS products_pkey ON public.products USING btree (id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products USING btree (category_id);
CREATE INDEX IF NOT EXISTS idx_products_sale_mode ON public.products USING btree (sale_mode);

CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  unit TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2) NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  committed_qty INTEGER NOT NULL DEFAULT 0,
  sku TEXT NULL,
  is_available BOOLEAN NULL DEFAULT true,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NULL DEFAULT now(),
  preorder_enabled BOOLEAN NOT NULL DEFAULT false,
  preorder_limit INTEGER NULL,
  preorder_reserved_qty INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT product_variants_pkey PRIMARY KEY (id),
  CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products (id) ON DELETE CASCADE,
  CONSTRAINT product_variants_stock_nonnegative CHECK (stock >= 0),
  CONSTRAINT product_variants_committed_nonnegative CHECK (committed_qty >= 0)
);
CREATE UNIQUE INDEX IF NOT EXISTS product_variants_pkey ON public.product_variants USING btree (id);
CREATE INDEX IF NOT EXISTS idx_product_variants_preorder_enabled ON public.product_variants USING btree (preorder_enabled);


-- ----------------------------------------------------------------------------
-- 7. DISCOUNTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.discounts (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  discount_type TEXT NULL DEFAULT 'percentage'::text,
  discount_value NUMERIC(10, 2) NOT NULL,
  starts_at TIMESTAMPTZ NULL DEFAULT now(),
  ends_at TIMESTAMPTZ NULL,
  is_active BOOLEAN NULL DEFAULT true,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT discounts_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS discounts_pkey ON public.discounts USING btree (id);

CREATE TABLE IF NOT EXISTS public.discount_variants (
  discount_id UUID NOT NULL,
  variant_id UUID NOT NULL,
  CONSTRAINT discount_variants_pkey PRIMARY KEY (discount_id, variant_id),
  CONSTRAINT discount_variants_discount_id_fkey FOREIGN KEY (discount_id) REFERENCES public.discounts (id) ON DELETE CASCADE,
  CONSTRAINT discount_variants_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants (id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS discount_variants_pkey ON public.discount_variants USING btree (discount_id, variant_id);


-- ----------------------------------------------------------------------------
-- 8. COUPONS & USAGES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  discount_type TEXT NULL DEFAULT 'percentage'::text,
  discount_value NUMERIC(10, 2) NOT NULL,
  min_order_amount NUMERIC(10, 2) NULL DEFAULT 0,
  max_discount_amount NUMERIC(10, 2) NULL,
  is_active BOOLEAN NULL DEFAULT true,
  expiry_date TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  is_first_order_only BOOLEAN NULL DEFAULT false,
  CONSTRAINT coupons_pkey PRIMARY KEY (id),
  CONSTRAINT coupons_code_key UNIQUE (code)
);
CREATE UNIQUE INDEX IF NOT EXISTS coupons_pkey ON public.coupons USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS coupons_code_key ON public.coupons USING btree (code);

CREATE TABLE IF NOT EXISTS public.coupon_usages (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL,
  user_id UUID NULL,
  phone_number TEXT NULL,
  browser_id TEXT NULL,
  order_id UUID NULL,
  used_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT coupon_usages_pkey PRIMARY KEY (id),
  CONSTRAINT coupon_usages_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.coupons (id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS coupon_usages_pkey ON public.coupon_usages USING btree (id);


-- ----------------------------------------------------------------------------
-- 9. CARTS & UPSELLS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NULL,
  session_id TEXT NULL,
  status TEXT NULL DEFAULT 'active'::text,
  subtotal NUMERIC(10, 2) NULL DEFAULT 0,
  discount_amount NUMERIC(10, 2) NULL DEFAULT 0,
  delivery_fee NUMERIC(10, 2) NULL DEFAULT 0,
  total NUMERIC(10, 2) NULL DEFAULT 0,
  coupon_id UUID NULL,
  last_activity_at TIMESTAMPTZ NULL DEFAULT now(),
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT carts_pkey PRIMARY KEY (id),
  CONSTRAINT carts_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.coupons (id) ON DELETE SET NULL,
  CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles (id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS carts_pkey ON public.carts USING btree (id);
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON public.carts USING btree (user_id);

CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL,
  product_id UUID NOT NULL,
  variant_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  variant_unit TEXT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NULL DEFAULT 1,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT cart_items_pkey PRIMARY KEY (id),
  CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts (id) ON DELETE CASCADE,
  CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products (id) ON DELETE CASCADE,
  CONSTRAINT cart_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants (id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS cart_items_pkey ON public.cart_items USING btree (id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON public.cart_items USING btree (cart_id);

CREATE TABLE IF NOT EXISTS public.cart_upsells (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  product_id UUID NULL,
  variant_id UUID NULL,
  title TEXT NULL,
  display_order INTEGER NULL DEFAULT 0,
  is_active BOOLEAN NULL DEFAULT true,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT cart_upsells_pkey PRIMARY KEY (id),
  CONSTRAINT cart_upsells_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products (id) ON DELETE SET NULL,
  CONSTRAINT cart_upsells_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants (id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS cart_upsells_pkey ON public.cart_upsells USING btree (id);
CREATE INDEX IF NOT EXISTS idx_cart_upsells_active ON public.cart_upsells USING btree (is_active, display_order);


-- ----------------------------------------------------------------------------
-- 10. DELIVERY SETTINGS & STORE SETTINGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.delivery_settings (
  id TEXT NOT NULL DEFAULT 'default'::text,
  is_free_delivery_enabled BOOLEAN NOT NULL DEFAULT true,
  delivery_mode TEXT NOT NULL DEFAULT 'preset_rules'::text,
  flat_delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 65.00,
  preset_zone_radius_km NUMERIC(10, 2) NOT NULL DEFAULT 5.00,
  preset_zone1_subtotal NUMERIC(10, 2) NOT NULL DEFAULT 299.00,
  preset_zone1_fee NUMERIC(10, 2) NOT NULL DEFAULT 30.00,
  preset_zone2_subtotal NUMERIC(10, 2) NOT NULL DEFAULT 499.00,
  preset_zone2_fee NUMERIC(10, 2) NOT NULL DEFAULT 30.00,
  tier1_max_km NUMERIC(10, 2) NOT NULL DEFAULT 5.00,
  tier1_subtotal NUMERIC(10, 2) NOT NULL DEFAULT 299.00,
  tier1_fee NUMERIC(10, 2) NOT NULL DEFAULT 30.00,
  tier2_max_km NUMERIC(10, 2) NOT NULL DEFAULT 10.00,
  tier2_subtotal NUMERIC(10, 2) NOT NULL DEFAULT 500.00,
  tier2_fee NUMERIC(10, 2) NOT NULL DEFAULT 30.00,
  tier3_subtotal NUMERIC(10, 2) NOT NULL DEFAULT 699.00,
  tier3_fee NUMERIC(10, 2) NOT NULL DEFAULT 30.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivery_pricing_mode TEXT NULL,
  store_latitude NUMERIC(10, 6) NULL DEFAULT 17.351452,
  store_longitude NUMERIC(10, 6) NULL DEFAULT 78.391039,
  tier3_max_km NUMERIC(10, 2) NOT NULL DEFAULT 25.00,
  tier4_subtotal NUMERIC(10, 2) NOT NULL DEFAULT 999.00,
  tier4_fee NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
  CONSTRAINT delivery_settings_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS delivery_settings_pkey ON public.delivery_settings USING btree (id);

CREATE TABLE IF NOT EXISTS public.store_settings (
  id TEXT NOT NULL DEFAULT 'default'::text,
  is_store_open BOOLEAN NULL DEFAULT true,
  store_name TEXT NULL DEFAULT 'E-Commerce Store'::text,
  store_address TEXT NULL,
  store_latitude DOUBLE PRECISION NULL DEFAULT 19.0760,
  store_longitude DOUBLE PRECISION NULL DEFAULT 72.8777,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT store_settings_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS store_settings_pkey ON public.store_settings USING btree (id);


-- ----------------------------------------------------------------------------
-- 11. BATCHES, ORDERS & FULFILLMENT
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_batches (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  orders_open_at TIMESTAMPTZ NOT NULL,
  orders_close_at TIMESTAMPTZ NOT NULL,
  delivery_date DATE NOT NULL,
  closed_early BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active'::text,
  notes TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT order_batches_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS order_batches_pkey ON public.order_batches USING btree (id);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  order_number BIGINT NULL,
  user_id UUID NULL,
  delivery_address JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  delivery_fee NUMERIC(10, 2) NULL DEFAULT 0,
  discount NUMERIC(10, 2) NULL DEFAULT 0,
  store_credit_used NUMERIC(10, 2) NULL DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT NULL DEFAULT 'pending_payment'::text,
  notes TEXT NULL,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NULL DEFAULT now(),
  order_type TEXT NULL DEFAULT 'normal'::text,
  order_source TEXT NULL DEFAULT 'online_web'::text,
  coupon_id UUID NULL,
  browser_id TEXT NULL,
  batch_id UUID NULL,
  delivery_date DATE NULL,
  payment_id UUID NULL,
  customer_name TEXT NULL,
  customer_phone TEXT NULL,
  fulfillment_exception TEXT NULL,
  checkout_id UUID NULL,
  currency TEXT NULL DEFAULT 'INR'::text,
  payment_method TEXT NULL DEFAULT 'razorpay'::text,
  payment_status TEXT NULL DEFAULT 'pending'::text,
  razorpay_order_id TEXT NULL,
  razorpay_payment_id TEXT NULL,
  payload_fingerprint TEXT NULL,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT unique_orders_payment UNIQUE (payment_id),
  CONSTRAINT unique_orders_checkout UNIQUE (checkout_id),
  CONSTRAINT orders_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.coupons (id) ON DELETE SET NULL,
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles (id) ON DELETE SET NULL,
  CONSTRAINT orders_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.order_batches (id) ON DELETE SET NULL,
  CONSTRAINT orders_order_type_check CHECK (order_type = ANY (ARRAY['normal'::text, 'preorder'::text])),
  CONSTRAINT orders_status_check CHECK (status = ANY (ARRAY['pending_payment'::text, 'pending'::text, 'confirmed'::text, 'processing'::text, 'preparing'::text, 'ready_for_delivery'::text, 'out_for_delivery'::text, 'partially_fulfilled'::text, 'delivered'::text, 'completed'::text, 'cancelled'::text])),
  CONSTRAINT orders_order_source_check CHECK (order_source = ANY (ARRAY['online_web'::text, 'mobile_app'::text, 'admin'::text, 'whatsapp'::text, 'phone'::text, 'walk_in'::text]))
);
CREATE UNIQUE INDEX IF NOT EXISTS orders_pkey ON public.orders USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS unique_orders_payment ON public.orders USING btree (payment_id);
CREATE UNIQUE INDEX IF NOT EXISTS unique_orders_checkout ON public.orders USING btree (checkout_id);
CREATE UNIQUE INDEX IF NOT EXISTS orders_order_number_unique ON public.orders USING btree (order_number) WHERE (order_number IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON public.orders USING btree (payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders USING btree (status);
CREATE INDEX IF NOT EXISTS orders_batch_id_idx ON public.orders USING btree (batch_id);
CREATE INDEX IF NOT EXISTS idx_orders_checkout_id ON public.orders USING btree (checkout_id);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  product_id UUID NULL,
  product_name TEXT NOT NULL,
  product_image TEXT NULL,
  price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  variant_id UUID NULL,
  variant_unit TEXT NULL,
  quantity_fulfilled NUMERIC(10, 2) NOT NULL DEFAULT 0,
  quantity_cancelled NUMERIC(10, 2) NOT NULL DEFAULT 0,
  quantity_on_hold NUMERIC(10, 2) NOT NULL DEFAULT 0,
  hold_reason TEXT NULL,
  fulfillment_status TEXT NOT NULL DEFAULT 'pending'::text,
  promised_date DATE NULL,
  fulfillment_note TEXT NULL,
  fulfillment_type TEXT NOT NULL DEFAULT 'regular'::text,
  expected_available_date DATE NULL,
  is_preorder BOOLEAN NOT NULL DEFAULT false,
  expected_dispatch_date DATE NULL,
  sale_mode_snapshot TEXT NULL DEFAULT 'regular'::text,
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders (id) ON DELETE CASCADE,
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products (id) ON DELETE SET NULL,
  CONSTRAINT order_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants (id) ON DELETE SET NULL,
  CONSTRAINT order_items_quantity_positive CHECK (quantity > 0),
  CONSTRAINT order_items_price_check CHECK (price >= 0 AND total_price >= 0),
  CONSTRAINT order_items_fulfillment_type_check CHECK (fulfillment_type = ANY (ARRAY['regular'::text, 'preorder'::text])),
  CONSTRAINT order_items_fulfillment_status_check CHECK (fulfillment_status = ANY (ARRAY['pending'::text, 'awaiting_preorder'::text, 'backordered'::text, 'quality_hold'::text, 'packed'::text, 'delivered'::text, 'unavailable'::text])),
  CONSTRAINT order_items_quantity_check CHECK (quantity > 0 AND quantity_fulfilled >= 0 AND quantity_cancelled >= 0 AND quantity_on_hold >= 0 AND (quantity_fulfilled + quantity_cancelled + quantity_on_hold) <= quantity)
);
CREATE UNIQUE INDEX IF NOT EXISTS order_items_pkey ON public.order_items USING btree (id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items USING btree (order_id);
CREATE INDEX IF NOT EXISTS order_items_fulfillment_idx ON public.order_items USING btree (fulfillment_status);
CREATE INDEX IF NOT EXISTS order_items_promised_date_idx ON public.order_items USING btree (promised_date);

CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  status TEXT NOT NULL,
  notes TEXT NULL,
  created_by UUID NULL,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT order_status_history_pkey PRIMARY KEY (id),
  CONSTRAINT order_status_history_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders (id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS order_status_history_pkey ON public.order_status_history USING btree (id);

CREATE TABLE IF NOT EXISTS public.order_item_changes (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  order_item_id UUID NULL,
  change_type TEXT NOT NULL,
  old_product_id UUID NULL,
  old_variant_id UUID NULL,
  old_quantity INTEGER NULL,
  old_unit_price NUMERIC(10, 2) NULL,
  new_product_id UUID NULL,
  new_variant_id UUID NULL,
  new_quantity INTEGER NULL,
  new_unit_price NUMERIC(10, 2) NULL,
  reason TEXT NULL,
  changed_by UUID NULL,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT order_item_changes_pkey PRIMARY KEY (id),
  CONSTRAINT order_item_changes_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders (id) ON DELETE CASCADE,
  CONSTRAINT order_item_changes_order_item_id_fkey FOREIGN KEY (order_item_id) REFERENCES public.order_items (id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS order_item_changes_pkey ON public.order_item_changes USING btree (id);

CREATE TABLE IF NOT EXISTS public.order_item_holds (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  order_item_id UUID NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'::text,
  created_by UUID NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ NULL,
  CONSTRAINT order_item_holds_pkey PRIMARY KEY (id),
  CONSTRAINT order_item_holds_order_item_id_fkey FOREIGN KEY (order_item_id) REFERENCES public.order_items (id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS order_item_holds_pkey ON public.order_item_holds USING btree (id);


-- ----------------------------------------------------------------------------
-- 12. PAYMENTS, GATEWAYS & REFUNDS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_gateways (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  display_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  environment TEXT NOT NULL DEFAULT 'test'::text,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  key_id TEXT NULL,
  secret_reference TEXT NULL,
  webhook_secret_reference TEXT NULL,
  verification_status TEXT NOT NULL DEFAULT 'unverified'::text,
  last_verified_at TIMESTAMPTZ NULL,
  CONSTRAINT payment_gateways_pkey PRIMARY KEY (id),
  CONSTRAINT payment_gateways_provider_env_unique UNIQUE (provider, environment)
);
CREATE UNIQUE INDEX IF NOT EXISTS payment_gateways_pkey ON public.payment_gateways USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS payment_gateways_provider_env_unique ON public.payment_gateways USING btree (provider, environment);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_gateways_single_active ON public.payment_gateways USING btree (is_active) WHERE (is_active = true);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  razorpay_order_id TEXT NULL,
  razorpay_payment_id TEXT NULL,
  amount BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR'::text,
  status TEXT NOT NULL DEFAULT 'created'::text,
  method TEXT NULL,
  failure_code TEXT NULL,
  failure_description TEXT NULL,
  refund_id TEXT NULL,
  refund_amount BIGINT NULL DEFAULT 0,
  refund_status TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ NULL,
  refunded_at TIMESTAMPTZ NULL,
  duplicate_payment BOOLEAN NOT NULL DEFAULT false,
  refund_review_required BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders (id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS payments_pkey ON public.payments USING btree (id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments USING btree (order_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_razorpay_order_id_unique ON public.payments USING btree (razorpay_order_id) WHERE (razorpay_order_id IS NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_razorpay_payment_id_unique ON public.payments USING btree (razorpay_payment_id) WHERE (razorpay_payment_id IS NOT NULL);

CREATE TABLE IF NOT EXISTS public.payment_reconciliation_events (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  payment_id UUID NULL,
  checkout_id UUID NULL,
  event_type TEXT NOT NULL,
  notes TEXT NULL,
  payload JSONB NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT payment_reconciliation_events_pkey PRIMARY KEY (id),
  CONSTRAINT payment_reconciliation_events_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments (id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS payment_reconciliation_events_pkey ON public.payment_reconciliation_events USING btree (id);
CREATE INDEX IF NOT EXISTS idx_reconciliation_payment_id ON public.payment_reconciliation_events USING btree (payment_id);
CREATE INDEX IF NOT EXISTS idx_reconciliation_checkout_id ON public.payment_reconciliation_events USING btree (checkout_id);

CREATE TABLE IF NOT EXISTS public.refunds (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  payment_id UUID NULL,
  checkout_id UUID NULL,
  razorpay_payment_id TEXT NOT NULL,
  razorpay_refund_id TEXT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR'::text,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'::text,
  idempotency_key TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  error_details JSONB NULL,
  processed_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT refunds_pkey PRIMARY KEY (id),
  CONSTRAINT refunds_idempotency_key_key UNIQUE (idempotency_key),
  CONSTRAINT refunds_razorpay_refund_id_key UNIQUE (razorpay_refund_id),
  CONSTRAINT refunds_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments (id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS refunds_pkey ON public.refunds USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS refunds_idempotency_key_key ON public.refunds USING btree (idempotency_key);
CREATE UNIQUE INDEX IF NOT EXISTS refunds_razorpay_refund_id_key ON public.refunds USING btree (razorpay_refund_id);
CREATE INDEX IF NOT EXISTS idx_refunds_payment_id ON public.refunds USING btree (payment_id);
CREATE INDEX IF NOT EXISTS idx_refunds_checkout_id ON public.refunds USING btree (checkout_id);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON public.refunds USING btree (status);
CREATE INDEX IF NOT EXISTS idx_refunds_idempotency_key ON public.refunds USING btree (idempotency_key);


-- ----------------------------------------------------------------------------
-- 13. FULFILLMENTS, WAREHOUSE & PROCUREMENT
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.fulfillments (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  fulfillment_number TEXT NOT NULL,
  user_id UUID NULL,
  status TEXT NOT NULL DEFAULT 'preparing'::text,
  scheduled_delivery_at TIMESTAMPTZ NULL,
  delivered_at TIMESTAMPTZ NULL,
  delivery_notes TEXT NULL,
  driver_name TEXT NULL,
  driver_phone TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivery_address_snapshot JSONB NULL,
  CONSTRAINT fulfillments_pkey PRIMARY KEY (id),
  CONSTRAINT fulfillments_fulfillment_number_key UNIQUE (fulfillment_number)
);
CREATE UNIQUE INDEX IF NOT EXISTS fulfillments_pkey ON public.fulfillments USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS fulfillments_fulfillment_number_key ON public.fulfillments USING btree (fulfillment_number);

CREATE TABLE IF NOT EXISTS public.fulfillment_items (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  fulfillment_id UUID NOT NULL,
  order_item_id UUID NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL,
  quantity_delivered NUMERIC(10, 2) NOT NULL DEFAULT 0,
  quantity_damaged NUMERIC(10, 2) NOT NULL DEFAULT 0,
  damage_disposition TEXT NULL DEFAULT 'investigating'::text,
  hold_reason TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fulfillment_items_pkey PRIMARY KEY (id),
  CONSTRAINT fulfillment_items_fulfillment_id_fkey FOREIGN KEY (fulfillment_id) REFERENCES public.fulfillments (id) ON DELETE CASCADE,
  CONSTRAINT fulfillment_items_order_item_id_fkey FOREIGN KEY (order_item_id) REFERENCES public.order_items (id) ON DELETE CASCADE,
  CONSTRAINT fulfillment_items_quantities_nonnegative CHECK (quantity_delivered >= 0 AND quantity_damaged >= 0),
  CONSTRAINT fulfillment_items_quantities_invariant CHECK ((quantity_delivered + quantity_damaged) <= quantity)
);
CREATE UNIQUE INDEX IF NOT EXISTS fulfillment_items_pkey ON public.fulfillment_items USING btree (id);

CREATE TABLE IF NOT EXISTS public.inventory_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  variant_id UUID NOT NULL,
  transaction_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  reference_type TEXT NULL,
  reference_id UUID NULL,
  notes TEXT NULL,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT inventory_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT inventory_transactions_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants (id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS inventory_transactions_pkey ON public.inventory_transactions USING btree (id);

CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_person TEXT NULL,
  phone TEXT NULL,
  email TEXT NULL,
  city TEXT NULL,
  address TEXT NULL,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT suppliers_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS suppliers_pkey ON public.suppliers USING btree (id);

CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  po_number TEXT NOT NULL,
  supplier_id UUID NULL,
  status TEXT NULL DEFAULT 'draft'::text,
  total_cost NUMERIC(10, 2) NULL DEFAULT 0,
  invoice_number TEXT NULL,
  invoice_url TEXT NULL,
  notes TEXT NULL,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  received_at TIMESTAMPTZ NULL,
  CONSTRAINT purchase_orders_pkey PRIMARY KEY (id),
  CONSTRAINT purchase_orders_po_number_key UNIQUE (po_number),
  CONSTRAINT purchase_orders_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers (id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS purchase_orders_pkey ON public.purchase_orders USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS purchase_orders_po_number_key ON public.purchase_orders USING btree (po_number);

CREATE TABLE IF NOT EXISTS public.purchase_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  po_id UUID NOT NULL,
  variant_id UUID NOT NULL,
  quantity_ordered INTEGER NOT NULL,
  quantity_received INTEGER NULL DEFAULT 0,
  unit_cost_price NUMERIC(10, 2) NOT NULL,
  total_cost_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT purchase_order_items_pkey PRIMARY KEY (id),
  CONSTRAINT purchase_order_items_po_id_fkey FOREIGN KEY (po_id) REFERENCES public.purchase_orders (id) ON DELETE CASCADE,
  CONSTRAINT purchase_order_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants (id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS purchase_order_items_pkey ON public.purchase_order_items USING btree (id);

CREATE TABLE IF NOT EXISTS public.replacement_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  order_item_id UUID NOT NULL,
  replacement_product_id UUID NULL,
  quantity NUMERIC(10, 2) NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'requested'::text,
  price_difference NUMERIC(10, 2) NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT replacement_requests_pkey PRIMARY KEY (id),
  CONSTRAINT replacement_requests_order_item_id_fkey FOREIGN KEY (order_item_id) REFERENCES public.order_items (id) ON DELETE CASCADE,
  CONSTRAINT replacement_requests_replacement_product_id_fkey FOREIGN KEY (replacement_product_id) REFERENCES public.products (id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS replacement_requests_pkey ON public.replacement_requests USING btree (id);


-- ----------------------------------------------------------------------------
-- 14. CUSTOMER WALLETS & TOKENS & WEBHOOKS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT customer_wallets_pkey PRIMARY KEY (id),
  CONSTRAINT customer_wallets_user_id_key UNIQUE (user_id),
  CONSTRAINT customer_wallets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles (id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS customer_wallets_pkey ON public.customer_wallets USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS customer_wallets_user_id_key ON public.customer_wallets USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_customer_wallets_user_id ON public.customer_wallets USING btree (user_id);

CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL,
  user_id UUID NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  order_id UUID NULL,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT wallet_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT wallet_transactions_wallet_id_fkey FOREIGN KEY (wallet_id) REFERENCES public.customer_wallets (id) ON DELETE CASCADE,
  CONSTRAINT wallet_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles (id) ON DELETE CASCADE,
  CONSTRAINT wallet_transactions_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders (id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS wallet_transactions_pkey ON public.wallet_transactions USING btree (id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON public.wallet_transactions USING btree (user_id);

CREATE TABLE IF NOT EXISTS public.device_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NULL,
  token TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'android'::text,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT device_tokens_pkey PRIMARY KEY (id),
  CONSTRAINT device_tokens_token_key UNIQUE (token),
  CONSTRAINT device_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles (id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS device_tokens_pkey ON public.device_tokens USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS device_tokens_token_key ON public.device_tokens USING btree (token);
CREATE INDEX IF NOT EXISTS idx_device_tokens_user_id ON public.device_tokens USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_device_tokens_token ON public.device_tokens USING btree (token);

CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending'::text,
  error_message TEXT NULL,
  lease_token UUID NULL,
  updated_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT webhook_events_pkey PRIMARY KEY (id),
  CONSTRAINT webhook_events_event_id_key UNIQUE (event_id)
);
CREATE UNIQUE INDEX IF NOT EXISTS webhook_events_pkey ON public.webhook_events USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS webhook_events_event_id_key ON public.webhook_events USING btree (event_id);


-- ----------------------------------------------------------------------------
-- 15. GRANTS & PERMISSIONS
-- ----------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public TO anon, authenticated;


-- ----------------------------------------------------------------------------
-- 16. ENABLE ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------------------
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_upsells ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fulfillment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fulfillments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_item_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_item_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_reconciliation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replacement_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;


-- ----------------------------------------------------------------------------
-- 17. RPC FUNCTIONS & TRIGGERS
-- ----------------------------------------------------------------------------

-- abandon_pending_order
CREATE OR REPLACE FUNCTION public.abandon_pending_order(p_order_id uuid, p_user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public', 'pg_temp'
AS $function$
DECLARE
  v_order RECORD;
  v_payment RECORD;
  v_has_active_payment BOOLEAN := FALSE;
  v_has_refund_review BOOLEAN := FALSE;
BEGIN
  IF p_order_id IS NULL OR p_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Missing required order or user ID');
  END IF;

  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id AND user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order not found');
  END IF;

  IF v_order.status IS DISTINCT FROM 'pending_payment' OR v_order.payment_status IS DISTINCT FROM 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order cannot be modified or abandoned in its current state');
  END IF;

  PERFORM 1
  FROM public.payments
  WHERE order_id = p_order_id
  FOR UPDATE;

  FOR v_payment IN
    SELECT status, refund_review_required FROM public.payments WHERE order_id = p_order_id
  LOOP
    IF v_payment.status IN ('captured', 'authorized', 'created') THEN
      v_has_active_payment := TRUE;
      EXIT;
    END IF;
    IF v_payment.refund_review_required IS TRUE OR v_payment.status = 'refunded' THEN
      v_has_refund_review := TRUE;
    END IF;
  END LOOP;

  IF v_has_active_payment THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Cannot abandon order while payment attempts remain active, unresolved, or captured.'
    );
  END IF;

  IF v_has_refund_review THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Cannot abandon order while payment attempts require refund review.'
    );
  END IF;

  UPDATE public.orders
  SET status = 'cancelled', updated_at = NOW()
  WHERE id = p_order_id AND status IS DISTINCT FROM 'cancelled';

  -- Release committed_qty back to product variants
  UPDATE public.product_variants
  SET committed_qty = GREATEST(0, committed_qty - oi.quantity)
  FROM public.order_items oi
  WHERE oi.order_id = p_order_id AND product_variants.id = oi.variant_id;

  RETURN jsonb_build_object('success', true);
END;
$function$;

-- allocate_fulfillment_item
CREATE OR REPLACE FUNCTION public.allocate_fulfillment_item(p_fulfillment_id uuid, p_order_item_id uuid, p_quantity numeric, p_hold_reason text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_fulfillment_user_id uuid;
  v_batch_status text;
  v_order_user_id uuid;
  v_qty_ordered numeric;
  v_qty_fulfilled numeric;
  v_qty_cancelled numeric;
  v_active_allocated numeric;
  v_open_holds numeric;
  v_available numeric;
BEGIN
  -- 1. Batch-first locking
  SELECT status, user_id INTO v_batch_status, v_fulfillment_user_id
  FROM public.fulfillments
  WHERE id = p_fulfillment_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Fulfillment batch not found.';
  END IF;

  IF v_batch_status NOT IN ('preparing', 'ready_for_dispatch') THEN
    RAISE EXCEPTION 'Cannot allocate items to a batch with status %.', v_batch_status;
  END IF;

  IF p_quantity IS NULL OR p_quantity <= 0 THEN
    RAISE EXCEPTION 'Allocation quantity must be greater than zero.';
  END IF;

  -- 2. Lock order item
  SELECT o.user_id, oi.quantity, oi.quantity_fulfilled, oi.quantity_cancelled
  INTO v_order_user_id, v_qty_ordered, v_qty_fulfilled, v_qty_cancelled
  FROM public.order_items oi
  JOIN public.orders o ON o.id = oi.order_id
  WHERE oi.id = p_order_item_id
  FOR UPDATE OF oi;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order item not found.';
  END IF;

  IF v_fulfillment_user_id IS NOT NULL AND v_order_user_id IS NOT NULL AND v_fulfillment_user_id <> v_order_user_id THEN
    RAISE EXCEPTION 'Forbidden: Cannot add item from a different customer to this fulfillment batch.';
  END IF;

  SELECT COALESCE(SUM(fi.quantity), 0) INTO v_active_allocated
  FROM public.fulfillment_items fi
  JOIN public.fulfillments f ON f.id = fi.fulfillment_id
  WHERE fi.order_item_id = p_order_item_id
    AND f.status IN ('preparing', 'ready_for_dispatch', 'out_for_delivery');

  SELECT COALESCE(SUM(quantity), 0) INTO v_open_holds
  FROM public.order_item_holds
  WHERE order_item_id = p_order_item_id
    AND status = 'open';

  v_available := v_qty_ordered - v_qty_fulfilled - v_qty_cancelled - v_active_allocated - v_open_holds;

  IF p_quantity > v_available THEN
    RAISE EXCEPTION 'Cannot allocate % units. Only % units available for allocation (% on quality hold).', p_quantity, v_available, v_open_holds;
  END IF;

  INSERT INTO public.fulfillment_items (fulfillment_id, order_item_id, quantity, hold_reason)
  VALUES (p_fulfillment_id, p_order_item_id, p_quantity, p_hold_reason);

  RETURN jsonb_build_object(
    'success', true,
    'allocated_quantity', p_quantity,
    'remaining_available', v_available - p_quantity
  );
END;
$function$;

-- assign_order_batch
CREATE OR REPLACE FUNCTION public.assign_order_batch()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  b public.order_batches%rowtype;
BEGIN
  IF NEW.batch_id IS NULL THEN
    SELECT * INTO b
    FROM public.order_batches
    WHERE status = 'active'
      AND closed_early = false
      AND NOW() BETWEEN orders_open_at AND orders_close_at
    ORDER BY orders_close_at ASC
    LIMIT 1;

    IF FOUND THEN
      NEW.batch_id := b.id;
      NEW.delivery_date := b.delivery_date;
    END IF;
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$function$;

-- auto_link_product_category_fn
CREATE OR REPLACE FUNCTION public.auto_link_product_category_fn()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  IF NEW.category_name IS NOT NULL THEN
    SELECT id INTO NEW.category_id FROM public.categories WHERE lower(trim(name)) = lower(trim(NEW.category_name)) LIMIT 1;
  END IF;
  RETURN NEW;
END;
$function$;

-- cancel_fulfillment_batch
CREATE OR REPLACE FUNCTION public.cancel_fulfillment_batch(p_fulfillment_id uuid, p_reason text DEFAULT 'Batch cancelled'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_status text;
BEGIN
  SELECT status INTO v_status
  FROM public.fulfillments
  WHERE id = p_fulfillment_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Fulfillment batch not found.';
  END IF;

  IF v_status IN ('out_for_delivery', 'delivered') THEN
    RAISE EXCEPTION 'Cannot cancel an out-for-delivery or delivered fulfillment batch.';
  END IF;

  IF v_status = 'cancelled' THEN
    RETURN jsonb_build_object('success', true, 'message', 'Fulfillment batch was already cancelled.');
  END IF;

  UPDATE public.fulfillments
  SET status = 'cancelled',
      delivery_notes = COALESCE(delivery_notes, '') || ' [Cancelled: ' || p_reason || ']',
      updated_at = NOW()
  WHERE id = p_fulfillment_id;

  RETURN jsonb_build_object('success', true, 'message', 'Fulfillment batch cancelled successfully.');
END;
$function$;

-- claim_webhook_event
CREATE OR REPLACE FUNCTION public.claim_webhook_event(p_event_id text, p_event_type text, p_payload jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public', 'pg_temp'
AS $function$
DECLARE
  v_token UUID;
  v_row_count BIGINT := 0;
BEGIN
  IF p_event_id IS NULL OR p_event_id = ''
     OR p_event_type IS NULL OR p_event_type = ''
     OR p_payload IS NULL THEN
    RAISE EXCEPTION 'Invalid webhook event parameters';
  END IF;

  v_token := gen_random_uuid();

  INSERT INTO public.webhook_events (
    event_id,
    event_type,
    payload,
    status,
    lease_token
  )
  VALUES (
    p_event_id,
    p_event_type,
    p_payload,
    'processing',
    v_token
  )
  ON CONFLICT (event_id) DO NOTHING;

  GET DIAGNOSTICS v_row_count = ROW_COUNT;

  IF v_row_count > 0 THEN
    RETURN v_token;
  END IF;

  UPDATE public.webhook_events
  SET
    status = 'processing',
    payload = p_payload,
    lease_token = v_token,
    updated_at = NOW()
  WHERE event_id = p_event_id
    AND (
      status IN ('pending', 'failed')
      OR (
        status = 'processing'
        AND updated_at < NOW() - INTERVAL '10 minutes'
      )
    );

  GET DIAGNOSTICS v_row_count = ROW_COUNT;

  IF v_row_count > 0 THEN
    RETURN v_token;
  END IF;

  RETURN NULL;
END;
$function$;

-- complete_fulfillment_delivery
CREATE OR REPLACE FUNCTION public.complete_fulfillment_delivery(p_fulfillment_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_status text;
  v_item RECORD;
  v_all_fulfilled boolean;
  v_order_id uuid;
BEGIN
  SELECT status INTO v_status
  FROM public.fulfillments
  WHERE id = p_fulfillment_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Fulfillment batch not found.';
  END IF;

  IF v_status = 'cancelled' THEN
    RAISE EXCEPTION 'Cannot complete delivery for a cancelled fulfillment batch.';
  END IF;

  IF v_status = 'delivered' THEN
    RETURN jsonb_build_object('success', true, 'message', 'Fulfillment was already marked delivered.');
  END IF;

  UPDATE public.fulfillments
  SET status = 'delivered',
      delivered_at = NOW(),
      updated_at = NOW()
  WHERE id = p_fulfillment_id;

  FOR v_item IN
    SELECT order_item_id, quantity
    FROM public.fulfillment_items
    WHERE fulfillment_id = p_fulfillment_id
    ORDER BY order_item_id ASC
  LOOP
    UPDATE public.order_items
    SET quantity_fulfilled = quantity_fulfilled + v_item.quantity
    WHERE id = v_item.order_item_id
    RETURNING order_id INTO v_order_id;

    SELECT (COUNT(*) = COUNT(*) FILTER (WHERE (quantity_fulfilled + quantity_cancelled) >= quantity))
    INTO v_all_fulfilled
    FROM public.order_items
    WHERE order_id = v_order_id;

    IF v_all_fulfilled THEN
      UPDATE public.orders SET status = 'completed', updated_at = NOW() WHERE id = v_order_id;
    ELSE
      UPDATE public.orders SET status = 'partially_fulfilled', updated_at = NOW() WHERE id = v_order_id;
    END IF;
  END LOOP;

  RETURN jsonb_build_object('success', true, 'message', 'Fulfillment delivery completed successfully.');
END;
$function$;

-- confirm_order_payment
CREATE OR REPLACE FUNCTION public.confirm_order_payment(p_order_id uuid, p_razorpay_order_id text, p_razorpay_payment_id text, p_payment_amount numeric)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public', 'pg_temp'
AS $function$
DECLARE
  v_order RECORD;
  v_item RECORD;
  v_payment_record RECORD;
  v_existing_payment_record RECORD;
  v_variant_stock INT;
  v_variant_is_available BOOLEAN;
  v_has_stock_issue BOOLEAN := FALSE;
  v_failed_item_name TEXT := '';
  v_rows_updated INT;
  v_assigned_order_number BIGINT;
  v_expected_amount_paise BIGINT;
BEGIN
  IF p_razorpay_order_id IS NULL OR TRIM(p_razorpay_order_id) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Missing required Razorpay order ID');
  END IF;

  IF p_razorpay_payment_id IS NULL OR TRIM(p_razorpay_payment_id) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Missing required Razorpay payment ID');
  END IF;

  IF p_payment_amount IS NULL OR p_payment_amount <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid payment amount received');
  END IF;

  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order not found');
  END IF;

  v_expected_amount_paise := ROUND(v_order.total * 100)::BIGINT;

  IF v_expected_amount_paise <> p_payment_amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', format('Payment amount mismatch: Expected %s paise, received %s paise', v_expected_amount_paise, p_payment_amount)
    );
  END IF;

  SELECT * INTO v_payment_record
  FROM public.payments
  WHERE order_id = p_order_id AND razorpay_order_id = p_razorpay_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', format('Payment record for order ID %s and Razorpay Order ID %s not found.', p_order_id, p_razorpay_order_id)
    );
  END IF;

  IF v_payment_record.status NOT IN ('created', 'authorized', 'captured', 'failed') THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Payment attempt is not eligible for confirmation.'
    );
  END IF;

  IF v_payment_record.status = 'failed' THEN
    UPDATE public.payments
    SET refund_review_required = TRUE
    WHERE id = v_payment_record.id;
  END IF;

  IF v_payment_record.amount <> p_payment_amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Stored payment record amount does not match received payment amount.'
    );
  END IF;

  IF UPPER(TRIM(COALESCE(v_payment_record.currency, ''))) <> 'INR' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', format('Invalid payment currency: Expected INR, received %s', v_payment_record.currency)
    );
  END IF;

  PERFORM pg_advisory_xact_lock(
    hashtextextended(p_razorpay_payment_id, 0)
  );

  SELECT * INTO v_existing_payment_record
  FROM public.payments
  WHERE razorpay_payment_id = p_razorpay_payment_id
  FOR UPDATE;

  IF FOUND AND v_existing_payment_record.id <> v_payment_record.id THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Razorpay payment ID is already registered for a different payment record.'
    );
  END IF;

  IF v_payment_record.razorpay_payment_id IS NOT NULL AND v_payment_record.razorpay_payment_id <> p_razorpay_payment_id THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'This payment record is already associated with a different Razorpay payment ID.'
    );
  END IF;

  IF v_order.payment_status = 'paid' THEN
    IF v_order.razorpay_payment_id = p_razorpay_payment_id THEN
      IF v_order.fulfillment_exception IS NOT NULL THEN
        RETURN jsonb_build_object(
          'success', false,
          'already_paid', true,
          'stock_exception', true,
          'order_id', v_order.id,
          'order_number', v_order.order_number,
          'error', 'Order has a stock exception and requires fulfillment review/refund.'
        );
      END IF;

      RETURN jsonb_build_object(
        'success', true,
        'already_paid', true,
        'order_id', v_order.id,
        'order_number', v_order.order_number
      );
    END IF;

    UPDATE public.payments
    SET status = 'captured',
        razorpay_payment_id = p_razorpay_payment_id,
        duplicate_payment = true,
        refund_review_required = true,
        paid_at = NOW(),
        updated_at = NOW()
    WHERE id = v_payment_record.id;

    RETURN jsonb_build_object(
      'success', false,
      'duplicate_payment', true,
      'order_id', v_order.id,
      'order_number', v_order.order_number,
      'error', 'Order has already been paid with a different payment ID. Secondary payment captured and flagged for refund review.'
    );
  END IF;

  IF v_order.status = 'cancelled' AND v_order.payment_status IS DISTINCT FROM 'paid' THEN
    UPDATE public.orders
    SET payment_status = 'paid',
        payment_id = v_payment_record.id,
        razorpay_order_id = p_razorpay_order_id,
        razorpay_payment_id = p_razorpay_payment_id,
        fulfillment_exception = 'Payment captured after order cancellation. Refund required.',
        notes = 'Payment captured after order cancellation. Refund required.',
        updated_at = NOW()
    WHERE id = p_order_id;

    UPDATE public.payments
    SET status = 'captured',
        razorpay_payment_id = p_razorpay_payment_id,
        refund_review_required = TRUE,
        paid_at = NOW(),
        updated_at = NOW()
    WHERE id = v_payment_record.id;

    RETURN jsonb_build_object(
      'success', false,
      'stock_exception', true,
      'order_id', v_order.id,
      'order_number', v_order.order_number,
      'error', 'Payment captured after order cancellation. Refund required.'
    );
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.order_items
    WHERE order_id = p_order_id AND variant_id IS NULL
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Order contains items with missing variant IDs.'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.order_items
    WHERE order_id = p_order_id
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Cannot confirm an order without items.'
    );
  END IF;

  FOR v_item IN
    SELECT variant_id, SUM(quantity) as total_qty, MAX(product_name) as sample_name
    FROM public.order_items
    WHERE order_id = p_order_id AND variant_id IS NOT NULL
    GROUP BY variant_id
    ORDER BY variant_id ASC
  LOOP
    SELECT stock, is_available INTO v_variant_stock, v_variant_is_available
    FROM public.product_variants
    WHERE id = v_item.variant_id
    FOR UPDATE;

    IF v_variant_stock IS NULL OR v_variant_is_available IS DISTINCT FROM TRUE OR v_variant_stock < v_item.total_qty THEN
      v_has_stock_issue := TRUE;
      v_failed_item_name := v_item.sample_name;
      EXIT;
    END IF;
  END LOOP;

  IF v_has_stock_issue THEN
    UPDATE public.orders
    SET payment_status = 'paid',
        status = 'cancelled',
        payment_id = v_payment_record.id,
        razorpay_order_id = p_razorpay_order_id,
        razorpay_payment_id = p_razorpay_payment_id,
        fulfillment_exception = format('Stock exception for %s. Refund/replacement required.', v_failed_item_name),
        notes = format('Stock exception for %s. Refund/replacement required.', v_failed_item_name),
        updated_at = NOW()
    WHERE id = p_order_id;

    UPDATE public.payments
    SET status = 'captured',
        razorpay_payment_id = p_razorpay_payment_id,
        refund_review_required = TRUE,
        paid_at = NOW(),
        updated_at = NOW()
    WHERE id = v_payment_record.id;

    RETURN jsonb_build_object(
      'success', false,
      'stock_exception', true,
      'order_id', v_order.id,
      'order_number', v_order.order_number,
      'error', format('Insufficient inventory for item %s. Order flagged for fulfillment review.', v_failed_item_name)
    );
  END IF;

  IF v_order.order_number IS NULL THEN
    v_assigned_order_number := nextval('public.orders_confirmed_order_number_seq');
  ELSE
    v_assigned_order_number := v_order.order_number;
  END IF;

  UPDATE public.orders
  SET order_number = v_assigned_order_number,
      payment_status = 'paid',
      status = 'confirmed',
      payment_id = v_payment_record.id,
      razorpay_order_id = p_razorpay_order_id,
      razorpay_payment_id = p_razorpay_payment_id,
      updated_at = NOW()
  WHERE id = p_order_id;

  UPDATE public.payments
  SET status = 'captured',
      razorpay_payment_id = p_razorpay_payment_id,
      paid_at = NOW(),
      updated_at = NOW()
  WHERE id = v_payment_record.id;

  FOR v_item IN
    SELECT variant_id, SUM(quantity) as total_qty
    FROM public.order_items
    WHERE order_id = p_order_id AND variant_id IS NOT NULL
    GROUP BY variant_id
    ORDER BY variant_id ASC
  LOOP
    UPDATE public.product_variants
    SET stock = stock - v_item.total_qty,
        is_available = (stock - v_item.total_qty) > 0
    WHERE id = v_item.variant_id AND stock >= v_item.total_qty;

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
    IF v_rows_updated = 0 THEN
      RAISE EXCEPTION 'Atomic stock deduction failed for variant %', v_item.variant_id;
    END IF;

    INSERT INTO public.inventory_transactions (variant_id, transaction_type, quantity, reference_type, reference_id, notes)
    VALUES (v_item.variant_id, 'sale', -v_item.total_qty, 'order', v_order.id, 'Atomic purchase deduction');
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'already_paid', false,
    'order_id', v_order.id,
    'order_number', v_assigned_order_number
  );
END;
$function$;

-- create_pending_order
CREATE OR REPLACE FUNCTION public.create_pending_order(p_checkout_id uuid, p_user_id uuid, p_customer_name text, p_customer_phone text, p_delivery_address jsonb, p_subtotal numeric, p_delivery_fee numeric, p_discount numeric, p_total numeric, p_items jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public', 'pg_temp'
AS $function$
DECLARE
  v_existing_order RECORD;
  v_new_order RECORD;
  v_item RECORD;
  v_variant RECORD;
  v_product RECORD;
  v_computed_fingerprint TEXT;
  v_items_json TEXT;
  v_is_preorder BOOLEAN;
  v_dispatch_date DATE;
  v_sale_mode TEXT;
BEGIN
  IF p_checkout_id IS NULL OR p_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Missing required checkout ID or user ID');
  END IF;

  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot create an order without items.');
  END IF;

  FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(product_id UUID, variant_id UUID, quantity INT)
  LOOP
    SELECT * INTO v_variant FROM public.product_variants WHERE id = v_item.variant_id FOR UPDATE;
    SELECT * INTO v_product FROM public.products WHERE id = v_item.product_id;

    IF NOT FOUND THEN
      RETURN jsonb_build_object('success', false, 'error', 'Product or variant not found.');
    END IF;

    IF v_product.sale_mode = 'preorder' OR v_variant.preorder_enabled = TRUE THEN
      IF (COALESCE(v_variant.preorder_reserved_qty, 0) + v_item.quantity) > COALESCE(v_variant.preorder_limit, 100) THEN
        RETURN jsonb_build_object('success', false, 'error', format('Pre-order limit exceeded for %s (%s). Remaining capacity: %s', v_product.name, v_variant.unit, GREATEST(0, COALESCE(v_variant.preorder_limit, 100) - COALESCE(v_variant.preorder_reserved_qty, 0))));
      END IF;
    ELSE
      IF COALESCE(v_variant.stock, 0) < v_item.quantity THEN
        RETURN jsonb_build_object('success', false, 'error', format('Insufficient stock for %s (%s). Available: %s', v_product.name, v_variant.unit, COALESCE(v_variant.stock, 0)));
      END IF;
    END IF;
  END LOOP;

  SELECT string_agg(
    format('%s:%s:%s:%s:%s:%s:%s:%s',
      COALESCE((x->>'product_id')::text, ''),
      COALESCE((x->>'variant_id')::text, ''),
      COALESCE((x->>'product_name')::text, ''),
      COALESCE((x->>'variant_unit')::text, ''),
      COALESCE((x->>'product_image')::text, ''),
      COALESCE((x->>'quantity')::text, '0'),
      COALESCE((x->>'price')::text, '0'),
      COALESCE((x->>'total_price')::text, '0')
    ),
    ',' ORDER BY (x->>'product_id')::text, (x->>'variant_id')::text, (x->>'quantity')::text
  ) INTO v_items_json
  FROM jsonb_array_elements(p_items) AS x;

  v_computed_fingerprint := encode(
    digest(
      format('name:%s|phone:%s|addr:%s|sub:%s|del:%s|disc:%s|tot:%s|items:[%s]',
        COALESCE(p_customer_name, ''),
        COALESCE(p_customer_phone, ''),
        COALESCE(p_delivery_address::text, '{}'),
        p_subtotal, p_delivery_fee, p_discount, p_total, COALESCE(v_items_json, '')
      ),
      'sha256'
    ),
    'hex'
  );

  PERFORM pg_advisory_xact_lock(hashtextextended(p_checkout_id::text, 0));

  SELECT * INTO v_existing_order
  FROM public.orders
  WHERE checkout_id = p_checkout_id;

  IF FOUND THEN
    IF v_existing_order.user_id <> p_user_id THEN
      RETURN jsonb_build_object('success', false, 'error', 'Checkout ID belongs to another user.');
    END IF;
    IF v_existing_order.payload_fingerprint IS DISTINCT FROM v_computed_fingerprint THEN
      RETURN jsonb_build_object('success', false, 'error', 'Checkout ID reused with modified cart contents or pricing.');
    END IF;

    RETURN jsonb_build_object(
      'success', true,
      'order', row_to_json(v_existing_order),
      'items', (
        SELECT json_agg(row_to_json(oi) ORDER BY oi.product_id, oi.variant_id, oi.quantity)
        FROM public.order_items oi
        WHERE oi.order_id = v_existing_order.id
      ),
      'already_exists', true
    );
  END IF;

  INSERT INTO public.orders (
    checkout_id,
    user_id,
    customer_name,
    customer_phone,
    delivery_address,
    subtotal,
    delivery_fee,
    discount,
    total,
    currency,
    payment_method,
    payment_status,
    status,
    payload_fingerprint
  )
  VALUES (
    p_checkout_id,
    p_user_id,
    p_customer_name,
    p_customer_phone,
    p_delivery_address,
    p_subtotal,
    p_delivery_fee,
    p_discount,
    p_total,
    'INR',
    'razorpay',
    'pending',
    'pending_payment',
    v_computed_fingerprint
  )
  RETURNING * INTO v_new_order;

  FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(product_id UUID, variant_id UUID, product_name TEXT, variant_unit TEXT, product_image TEXT, price NUMERIC, quantity INT, total_price NUMERIC)
  LOOP
    IF v_item.variant_id IS NULL OR v_item.quantity IS NULL OR v_item.quantity <= 0 OR v_item.price < 0 THEN
      RAISE EXCEPTION 'Invalid item payload detected during order creation.';
    END IF;

    SELECT * INTO v_variant FROM public.product_variants WHERE id = v_item.variant_id;
    SELECT * INTO v_product FROM public.products WHERE id = v_item.product_id;

    v_is_preorder := (v_product.sale_mode = 'preorder' OR v_variant.preorder_enabled = TRUE);
    v_dispatch_date := v_product.expected_dispatch_date;
    v_sale_mode := COALESCE(v_product.sale_mode, 'regular');

    IF v_is_preorder THEN
      UPDATE public.product_variants
      SET preorder_reserved_qty = COALESCE(preorder_reserved_qty, 0) + v_item.quantity,
          updated_at = now()
      WHERE id = v_item.variant_id;
    ELSE
      UPDATE public.product_variants
      SET stock = stock - v_item.quantity,
          is_available = (stock - v_item.quantity) > 0,
          updated_at = now()
      WHERE id = v_item.variant_id;
    END IF;

    INSERT INTO public.order_items (
      order_id,
      product_id,
      variant_id,
      product_name,
      variant_unit,
      product_image,
      unit_price,
      quantity,
      total_price,
      is_preorder,
      expected_dispatch_date,
      sale_mode_snapshot
    )
    VALUES (
      v_new_order.id,
      v_item.product_id,
      v_item.variant_id,
      v_item.product_name,
      v_item.variant_unit,
      v_item.product_image,
      v_item.price,
      v_item.quantity,
      v_item.total_price,
      v_is_preorder,
      v_dispatch_date,
      v_sale_mode
    );
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'order', row_to_json(v_new_order),
    'items', (
      SELECT json_agg(row_to_json(oi) ORDER BY oi.product_id, oi.variant_id, oi.quantity)
      FROM public.order_items oi
      WHERE oi.order_id = v_new_order.id
    ),
    'already_exists', false
  );
END;
$function$;

-- current_user_role
CREATE OR REPLACE FUNCTION public.current_user_role()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$function$;

-- generate_order_number
CREATE OR REPLACE FUNCTION public.generate_order_number()
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN nextval('public.order_number_seq');
END;
$function$;

-- handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, phone_number, role)
  VALUES (
    new.id,
    CASE WHEN new.email LIKE '%@royalbengal.internal' THEN NULL ELSE new.email END,
    NULLIF(COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name'), 'Member'),
    COALESCE(NULLIF(new.raw_user_meta_data->>'phone_number', ''), new.phone, ''),
    'customer'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = CASE WHEN EXCLUDED.email LIKE '%@royalbengal.internal' THEN profiles.email ELSE EXCLUDED.email END,
    display_name = COALESCE(NULLIF(EXCLUDED.display_name, 'Member'), profiles.display_name),
    phone_number = COALESCE(NULLIF(EXCLUDED.phone_number, ''), profiles.phone_number);
  RETURN new;
END;
$function$;

-- handle_new_user_wallet
CREATE OR REPLACE FUNCTION public.handle_new_user_wallet()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.customer_wallets (user_id, balance)
  VALUES (NEW.id, 0.00)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$function$;

-- handle_updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- prevent_unverified_razorpay_payment_mutation
CREATE OR REPLACE FUNCTION public.prevent_unverified_razorpay_payment_mutation()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
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
$function$;

-- protect_profile_columns
CREATE OR REPLACE FUNCTION public.protect_profile_columns()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  IF public.current_user_role() <> 'super_admin' THEN
    IF NEW.role <> OLD.role OR NEW.is_active <> OLD.is_active THEN
      RAISE EXCEPTION 'Forbidden: Only super admins can modify user roles or active status.';
    END IF;
  END IF;

  IF OLD.id = auth.uid() AND OLD.role = 'super_admin' AND (NEW.role <> 'super_admin' OR NEW.is_active = false) THEN
    RAISE EXCEPTION 'Super admins cannot demote or deactivate their own account.';
  END IF;

  RETURN NEW;
END;
$function$;

-- reserve_payment_attempt
CREATE OR REPLACE FUNCTION public.reserve_payment_attempt(p_order_id uuid, p_user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public', 'pg_temp'
AS $function$
DECLARE
  v_order RECORD;
  v_existing_payment RECORD;
  v_has_active_payment BOOLEAN := FALSE;
  v_has_refund_review BOOLEAN := FALSE;
  v_payment_record RECORD;
  v_expected_amount_paise BIGINT;
BEGIN
  IF p_order_id IS NULL OR p_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Missing required order or user ID');
  END IF;

  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id AND user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Eligible pending order not found');
  END IF;

  IF v_order.status IS DISTINCT FROM 'pending_payment' OR v_order.payment_status IS DISTINCT FROM 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order is not eligible for payment retry');
  END IF;

  IF UPPER(TRIM(COALESCE(v_order.currency, 'INR'))) <> 'INR' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unsupported order currency');
  END IF;

  v_expected_amount_paise := ROUND(v_order.total * 100)::BIGINT;
  IF v_expected_amount_paise <= 0 OR v_expected_amount_paise > 9223372036854775807::BIGINT THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid order total amount');
  END IF;

  PERFORM 1
  FROM public.payments
  WHERE order_id = p_order_id
  FOR UPDATE;

  FOR v_existing_payment IN
    SELECT status, refund_review_required FROM public.payments WHERE order_id = p_order_id
  LOOP
    IF v_existing_payment.status IN ('captured', 'authorized', 'created') THEN
      v_has_active_payment := TRUE;
      EXIT;
    END IF;
    IF v_existing_payment.refund_review_required IS TRUE OR v_existing_payment.status = 'refunded' THEN
      v_has_refund_review := TRUE;
    END IF;
  END LOOP;

  IF v_has_active_payment THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'A payment attempt is already captured, active, or unresolved for this order.'
    );
  END IF;

  IF v_has_refund_review THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Previous payment attempts require refund review and cannot be retried automatically.'
    );
  END IF;

  INSERT INTO public.payments (order_id, amount, currency, status)
  VALUES (p_order_id, v_expected_amount_paise, 'INR', 'created')
  RETURNING * INTO v_payment_record;

  RETURN jsonb_build_object(
    'success', true,
    'payment_id', v_payment_record.id,
    'amount', v_expected_amount_paise
  );
END;
$function$;

-- set_updated_at
CREATE OR REPLACE FUNCTION public.adjust_customer_wallet(
  p_wallet_id UUID,
  p_user_id UUID,
  p_amount NUMERIC(12,2),
  p_type TEXT,
  p_description TEXT,
  p_performed_by UUID
)
RETURNS NUMERIC(12,2)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  v_current_balance NUMERIC(12,2);
  v_new_balance NUMERIC(12,2);
  v_is_super_admin BOOLEAN := FALSE;
BEGIN
  -- Check if caller is super_admin
  SELECT (role = 'super_admin') INTO v_is_super_admin
  FROM public.profiles
  WHERE id = auth.uid();

  -- Allow super_admin OR customer debiting their own wallet for store credit checkout
  IF NOT (COALESCE(v_is_super_admin, false) OR (auth.uid() = p_user_id AND p_type = 'debit') OR (auth.uid() IS NULL)) THEN
    RAISE EXCEPTION 'You are not authorized. Only system can add or deduct wallets automatically.';
  END IF;

  -- Lock wallet row for update to prevent concurrent race conditions
  SELECT balance INTO v_current_balance
  FROM public.customer_wallets
  WHERE id = p_wallet_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Wallet not found';
  END IF;

  IF p_type = 'credit' THEN
    v_new_balance := v_current_balance + p_amount;
  ELSIF p_type = 'debit' THEN
    IF v_current_balance < p_amount THEN
      RAISE EXCEPTION 'Insufficient wallet balance for debit';
    END IF;
    v_new_balance := v_current_balance - p_amount;
  ELSE
    RAISE EXCEPTION 'Invalid transaction type: %', p_type;
  END IF;

  -- Update balance
  UPDATE public.customer_wallets
  SET balance = v_new_balance, updated_at = now()
  WHERE id = p_wallet_id;

  -- Insert transaction log with performed_by tracking
  INSERT INTO public.wallet_transactions (wallet_id, user_id, amount, type, description, performed_by)
  VALUES (p_wallet_id, p_user_id, p_amount, p_type, p_description, p_performed_by);

  RETURN v_new_balance;
END;
$$;

-- set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;


-- ----------------------------------------------------------------------------
-- 18. TRIGGERS
-- ----------------------------------------------------------------------------
CREATE TRIGGER set_fulfillments_updated_at BEFORE UPDATE ON public.fulfillments FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_assign_order_batch BEFORE INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION assign_order_batch();
CREATE TRIGGER payment_gateways_updated_at BEFORE UPDATE ON public.payment_gateways FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_payment_gateways_updated_at BEFORE UPDATE ON public.payment_gateways FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER trg_auto_link_product_category BEFORE INSERT OR UPDATE OF category_name, category_id ON public.products FOR EACH ROW EXECUTE FUNCTION auto_link_product_category_fn();
CREATE TRIGGER tr_protect_profile_columns BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION protect_profile_columns();

-- ----------------------------------------------------------------------------
-- 19. WALLET RLS POLICIES (SUPER ADMIN ONLY)
-- ----------------------------------------------------------------------------
ALTER TABLE public.customer_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users and super admins can view wallets" ON public.customer_wallets;
CREATE POLICY "Users and super admins can view wallets"
  ON public.customer_wallets FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

DROP POLICY IF EXISTS "Super admins can manage customer wallets" ON public.customer_wallets;
CREATE POLICY "Super admins can manage customer wallets"
  ON public.customer_wallets FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

DROP POLICY IF EXISTS "Users and super admins can view wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Users and super admins can view wallet transactions"
  ON public.wallet_transactions FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

DROP POLICY IF EXISTS "Super admins can manage wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Super admins can manage wallet transactions"
  ON public.wallet_transactions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- ----------------------------------------------------------------------------
-- 20. INVENTORY TRANSACTIONS RLS POLICIES (AUTHENTICATED WRITE)
-- ----------------------------------------------------------------------------
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin write inventory_transactions" ON public.inventory_transactions;
CREATE POLICY "Admin write inventory_transactions"
ON public.inventory_transactions
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin read-only inventory_transactions" ON public.inventory_transactions;
CREATE POLICY "Admin read-only inventory_transactions"
ON public.inventory_transactions
FOR SELECT
TO authenticated
USING (true);
