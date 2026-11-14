-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  phone_number text,
  role text default 'customer' check (role in ('super_admin', 'admin', 'operations_staff', 'support_agent', 'read_only', 'customer')),
  is_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger to automatically insert a profile when a new auth user signs up (FORCES customer role to prevent privilege escalation)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, phone_number, role)
  values (
    new.id,
    case when new.email like '%@royalbengal.internal' then null else new.email end,
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', null),
    coalesce(new.raw_user_meta_data->>'phone_number', ''),
    'customer' -- SECURE: Always force 'customer' role on public signups
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. CATEGORIES TABLE
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  status text default 'active' check (status in ('active', 'inactive')),
  order_index integer default 0,
  created_at timestamptz default now()
);

-- 3. PRODUCTS TABLE (Parent entity)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  category_id uuid references public.categories(id) on delete set null,
  category_name text,
  is_available boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. PRODUCT VARIANTS TABLE (Relational units/prices/stock)
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade not null,
  unit text not null, -- e.g. '250g', '500g', '1 kg', '2 kg', '500ml', '1 Litre'
  price numeric(10, 2) not null,
  original_price numeric(10, 2),
  stock integer default 0,
  sku text,
  is_available boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. BANNERS TABLE
create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  link text,
  status text default 'active' check (status in ('active', 'inactive')),
  order_index integer default 0,
  created_at timestamptz default now()
);

-- 6. COUPONS TABLE
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text default 'percentage' check (discount_type in ('percentage', 'flat')),
  discount_value numeric(10, 2) not null,
  min_order_amount numeric(10, 2) default 0,
  max_discount_amount numeric(10, 2),
  is_first_order_only boolean default false,
  is_active boolean default true,
  expiry_date timestamptz,
  created_at timestamptz default now()
);

-- 7. ADDRESSES TABLE
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  phone text not null,
  house_no text,
  area text,
  landmark text,
  city text,
  pincode text,
  latitude double precision,
  longitude double precision,
  address_type text default 'home',
  is_default boolean default false,
  created_at timestamptz default now()
);

-- 8. ORDERS TABLE (SECURE: Unique razorpay_order_id constraint)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint,
  user_id uuid references auth.users(id) on delete set null,
  user_name text,
  user_email text,
  user_phone text,
  delivery_address jsonb not null,
  subtotal numeric(10, 2) not null,
  delivery_fee numeric(10, 2) default 0,
  discount numeric(10, 2) default 0,
  total numeric(10, 2) not null,
  payment_method text default 'razorpay',
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refund_pending', 'partially_refunded', 'refunded')),
  razorpay_order_id text unique,
  razorpay_payment_id text,
  status text default 'pending_payment' check (status in ('pending_payment', 'pending', 'confirmed', 'preparing', 'ready_for_delivery', 'out_for_delivery', 'delivered', 'cancelled')),
  order_type text default 'normal' check (order_type in ('normal', 'preorder')),
  order_source text default 'online_web' check (order_source in ('online_web', 'mobile_app', 'admin', 'whatsapp', 'phone', 'walk_in')),
  notes text,
  fulfillment_exception text,
  payment_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Sequence for confirmed order numbers
create sequence if not exists public.orders_confirmed_order_number_seq start 1001 increment 1;

-- 9. ORDER ITEMS TABLE (Snapshots variant & price)
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  variant_unit text,
  product_image text,
  price numeric(10, 2) not null,
  quantity integer not null CHECK (quantity > 0),
  total_price numeric(10, 2) not null,
  purchase_type text default 'normal' check (purchase_type in ('normal', 'preorder')),
  expected_available_at timestamptz,
  created_at timestamptz default now()
);

-- 10. STORE SETTINGS TABLE
create table if not exists public.store_settings (
  id text primary key default 'default',
  is_store_open boolean default true,
  store_name text default 'Royal Bengal',
  store_address text,
  store_latitude double precision default 19.0760,
  store_longitude double precision default 72.8777,
  min_order_amount numeric(10, 2) default 0,
  free_delivery_threshold numeric(10, 2) default 500,
  delivery_fee_per_km numeric(10, 2) default 10,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- SINGLETON STORE DELIVERY SETTINGS TABLE
create table if not exists public.delivery_settings (
  id uuid primary key default gen_random_uuid(),
  store_latitude numeric(10,7) not null default 17.351452,
  store_longitude numeric(10,7) not null default 78.391039,
  max_delivery_distance_km numeric(8,2) default 15.00,
  is_delivery_enabled boolean not null default true,
  delivery_pricing_mode text not null default 'rules' check (delivery_pricing_mode in ('always_free', 'rules', 'distance_based')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists delivery_settings_singleton on public.delivery_settings ((true));

-- DYNAMIC DELIVERY FEE & ELIGIBILITY RULES TABLE
create table if not exists public.delivery_fee_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  min_distance_km numeric(8,2) not null default 0,
  max_distance_km numeric(8,2),
  min_order_amount numeric(12,2) not null default 0,
  max_order_amount numeric(12,2),
  min_checkout_subtotal numeric(12,2) not null default 0,
  fee_type text not null default 'free' check (fee_type in ('free', 'fixed', 'per_km')),
  fee_amount numeric(10,2) not null default 0,
  priority integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 11. INVENTORY TRANSACTIONS TABLE
create table if not exists public.inventory_transactions (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid references public.product_variants(id) on delete cascade not null,
  transaction_type text not null check (transaction_type in ('received', 'sale', 'return', 'damaged', 'adjustment')),
  quantity integer not null,
  reference_type text,
  reference_id uuid,
  notes text,
  created_at timestamptz default now()
);

-- 12. ORDER STATUS HISTORY TABLE
create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  status text not null,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

-- 13. PAYMENTS TABLE (Multi-attempt payment audit ledger)
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  amount bigint not null, -- in paise
  currency text not null default 'INR',
  status text not null default 'created' check (status in ('created', 'authorized', 'captured', 'failed', 'refunded')),
  method text,
  failure_code text,
  failure_description text,
  refund_id text,
  refund_amount bigint default 0,
  refund_status text check (refund_status in ('pending', 'processed', 'failed')),
  duplicate_payment boolean not null default false,
  refund_review_required boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz,
  refunded_at timestamptz
);

create index if not exists idx_payments_order_id on public.payments(order_id);
create unique index if not exists idx_payments_razorpay_order_id_unique on public.payments(razorpay_order_id) where razorpay_order_id is not null;
create unique index if not exists idx_payments_razorpay_payment_id_unique on public.payments(razorpay_payment_id) where razorpay_payment_id is not null;

-- 14. COUPON USAGES TABLE (Multi-signal promo anti-abuse tracking)
create table if not exists public.coupon_usages (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid references public.coupons(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete set null,
  phone_number text,
  browser_id text,
  order_id uuid references public.orders(id) on delete cascade,
  used_at timestamptz default now()
);

-- 15. CARTS TABLE
create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  session_id text,
  status text default 'active' check (status in ('active', 'converted', 'abandoned', 'expired')),
  subtotal numeric(10, 2) default 0,
  discount_amount numeric(10, 2) default 0,
  delivery_fee numeric(10, 2) default 0,
  total numeric(10, 2) default 0,
  coupon_id uuid references public.coupons(id) on delete set null,
  last_activity_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 16. CART ITEMS TABLE
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid references public.carts(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  variant_id uuid references public.product_variants(id) on delete cascade not null,
  product_name text not null,
  variant_unit text,
  unit_price numeric(10, 2) not null,
  quantity integer default 1 check (quantity > 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 17. CHECKOUT SESSIONS TABLE
create table if not exists public.checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid references public.carts(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  session_id text,
  status text default 'started' check (status in ('started', 'address_added', 'payment_started', 'completed', 'abandoned', 'failed')),
  email text,
  phone text,
  shipping_address jsonb,
  subtotal numeric(10, 2) default 0,
  discount_amount numeric(10, 2) default 0,
  delivery_fee numeric(10, 2) default 0,
  total numeric(10, 2) default 0,
  started_at timestamptz default now(),
  last_activity_at timestamptz default now(),
  completed_at timestamptz,
  abandoned_at timestamptz
);

-- 18. CHECKOUT EVENTS TABLE
create table if not exists public.checkout_events (
  id uuid primary key default gen_random_uuid(),
  checkout_id uuid references public.checkout_sessions(id) on delete cascade not null,
  event text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

-- 19. PRE-ORDER CAMPAIGNS TABLE
create table if not exists public.preorder_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  product_id uuid references public.products(id) on delete cascade,
  product_variant_id uuid references public.product_variants(id) on delete cascade not null,
  status text default 'active' check (status in ('draft', 'active', 'ended', 'fulfilled', 'cancelled')),
  starts_at timestamptz default now(),
  ends_at timestamptz,
  expected_available_at timestamptz not null,
  max_quantity integer not null default 100,
  reserved_quantity integer not null default 0,
  price numeric(10, 2) not null,
  deposit_amount numeric(10, 2),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 20. DISCOUNTS TABLE
create table if not exists public.discounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  discount_type text default 'percentage' check (discount_type in ('percentage', 'fixed_amount')),
  discount_value numeric(10, 2) not null,
  starts_at timestamptz default now(),
  ends_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 21. DISCOUNT VARIANTS TABLE
create table if not exists public.discount_variants (
  discount_id uuid references public.discounts(id) on delete cascade not null,
  variant_id uuid references public.product_variants(id) on delete cascade not null,
  primary key (discount_id, variant_id)
);

-- 22. ORDER ITEM CHANGES TABLE (Order modification audit trail)
create table if not exists public.order_item_changes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  order_item_id uuid references public.order_items(id) on delete set null,
  change_type text not null check (change_type in ('replace', 'add', 'remove', 'quantity_change', 'price_adjustment')),
  old_product_id uuid references public.products(id) on delete set null,
  old_variant_id uuid references public.product_variants(id) on delete set null,
  old_quantity integer,
  old_unit_price numeric(10, 2),
  new_product_id uuid references public.products(id) on delete set null,
  new_variant_id uuid references public.product_variants(id) on delete set null,
  new_quantity integer,
  new_unit_price numeric(10, 2),
  reason text,
  changed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

-- 23. ADMIN AUDIT LOGS TABLE
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  details jsonb,
  created_at timestamptz default now()
);

-- 24. SUPPLIERS TABLE
create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_person text,
  phone text,
  email text,
  city text,
  address text,
  created_at timestamptz default now()
);

-- 25. PURCHASE ORDERS TABLE
create table if not exists public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  po_number text unique not null,
  supplier_id uuid references public.suppliers(id) on delete set null,
  status text default 'draft' check (status in ('draft', 'sent', 'received', 'cancelled')),
  total_cost numeric(10, 2) default 0,
  invoice_number text,
  invoice_url text,
  notes text,
  created_at timestamptz default now(),
  received_at timestamptz
);

-- 26. PURCHASE ORDER ITEMS TABLE
create table if not exists public.purchase_order_items (
  id uuid primary key default gen_random_uuid(),
  po_id uuid references public.purchase_orders(id) on delete cascade not null,
  variant_id uuid references public.product_variants(id) on delete cascade not null,
  quantity_ordered integer not null,
  quantity_received integer default 0,
  unit_cost_price numeric(10, 2) not null,
  total_cost_price numeric(10, 2) not null,
  created_at timestamptz default now()
);

-- 28. CONSOLIDATED PAYMENT GATEWAYS TABLE (SINGLE TABLE)
-- Stores configuration, publishable key_id, vault secret references, and active status.
create table if not exists public.payment_gateways (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  display_name text not null,
  key_id text,
  secret_key text,
  webhook_secret text,
  secret_reference text,
  webhook_secret_reference text,
  verification_status text not null default 'unverified' check (verification_status in ('unverified', 'verified', 'failed')),
  last_verified_at timestamptz,
  is_active boolean not null default false,
  environment text not null default 'test' check (environment in ('test', 'live')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payment_gateways_provider_env_unique unique (provider, environment),
  constraint check_active_gateway_has_key check (is_active = false or (key_id is not null and key_id <> ''))
);

create unique index if not exists idx_payment_gateways_single_active
  on public.payment_gateways (is_active)
  where is_active = true;

-- 27. ATOMIC STORED PROCEDURE FOR PAYMENT CONFIRMATION & INVENTORY DEDUCTION
CREATE OR REPLACE FUNCTION public.confirm_order_payment(
  p_order_id UUID,
  p_razorpay_order_id TEXT,
  p_razorpay_payment_id TEXT,
  p_payment_amount NUMERIC
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
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
  -- 1. STRICT INPUT VALIDATION
  IF p_razorpay_order_id IS NULL OR TRIM(p_razorpay_order_id) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Missing required Razorpay order ID');
  END IF;

  IF p_razorpay_payment_id IS NULL OR TRIM(p_razorpay_payment_id) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Missing required Razorpay payment ID');
  END IF;

  IF p_payment_amount IS NULL OR p_payment_amount <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid payment amount received');
  END IF;

  -- 2. ROW-LEVEL LOCK ON ORDER FIRST TO PREVENT CONCURRENCY RACES
  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order not found');
  END IF;

  v_expected_amount_paise := ROUND(v_order.total * 100)::BIGINT;

  -- 3. STRICT PAISE-ONLY AMOUNT VALIDATION
  IF v_expected_amount_paise <> p_payment_amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', format('Payment amount mismatch: Expected %s paise, received %s paise', v_expected_amount_paise, p_payment_amount)
    );
  END IF;

  -- 4. FETCH SPECIFIC PAYMENT ATTEMPT RECORD (Must exist from place-order)
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

  -- 4.5. VALIDATE PAYMENT ATTEMPT STATUS (Reject failed or refunded records)
  IF v_payment_record.status NOT IN ('created', 'authorized', 'captured') THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Payment attempt is not eligible for confirmation.'
    );
  END IF;

  -- 5. VERIFY STORED PAYMENT RECORD AMOUNT & STRICT CURRENCY
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

  -- 6. CONCURRENCY ADVISORY LOCK & STRICT PAYMENT ID OWNERSHIP CHECK
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

  -- 7. ROBUST IDEMPOTENCY & DUPLICATE PAYMENT CHECK
  IF v_order.payment_status = 'paid' THEN
    -- Case A: Same payment ID confirming already paid order
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

    -- Case B: A different payment attempt captured after order is already paid (Duplicate payment)
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

  -- 8. LATE PAYMENT CAPTURE ON CANCELLED ORDERS CHECK
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

  -- 9. REJECT ITEMS WITH NULL VARIANT_ID & REJECT ZERO ITEMS
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

  -- 10. AGGREGATE VARIANT QUANTITIES & LOCK IN ASCENDING ORDER TO PREVENT DEADLOCKS
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

  -- IF STOCK OR AVAILABILITY ISSUE: Flag order for stock exception & alert staff, preserve captured payment with review flag
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

  -- 11. ASSIGN STRICTLY SEQUENTIAL ORDER NUMBER USING CORRECT SEQUENCE
  IF v_order.order_number IS NULL THEN
    v_assigned_order_number := nextval('public.orders_confirmed_order_number_seq');
  ELSE
    v_assigned_order_number := v_order.order_number;
  END IF;

  -- 12. ATOMIC ORDER STATUS TRANSITION TO CONFIRMED
  UPDATE public.orders
  SET order_number = v_assigned_order_number,
      payment_status = 'paid',
      status = 'confirmed',
      payment_id = v_payment_record.id,
      razorpay_order_id = p_razorpay_order_id,
      razorpay_payment_id = p_razorpay_payment_id,
      updated_at = NOW()
  WHERE id = p_order_id;

  -- 13. UPDATE PAYMENT RECORD TO CAPTURED
  UPDATE public.payments
  SET status = 'captured',
      razorpay_payment_id = p_razorpay_payment_id,
      paid_at = NOW(),
      updated_at = NOW()
  WHERE id = v_payment_record.id;

  -- 14. ATOMIC AGGREGATED STOCK DEDUCTION WITH ROW COUNT CHECK
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
$$;

-- Secure RPC execution permissions
REVOKE ALL ON FUNCTION public.confirm_order_payment(UUID, TEXT, TEXT, NUMERIC) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_order_payment(UUID, TEXT, TEXT, NUMERIC) TO service_role;

-- 29. ATOMIC STORED PROCEDURE FOR RESERVING A PAYMENT ATTEMPT (RETRY SAFETY & CONCURRENCY)
CREATE OR REPLACE FUNCTION public.reserve_payment_attempt(
  p_order_id UUID,
  p_user_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  v_order RECORD;
  v_existing_payment RECORD;
  v_has_active_payment BOOLEAN := FALSE;
  v_payment_record RECORD;
  v_expected_amount_paise BIGINT;
BEGIN
  IF p_order_id IS NULL OR p_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Missing required order or user ID');
  END IF;

  -- 1. ROW-LEVEL LOCK ON ORDER TO PREVENT CONCURRENT RETRY RACES
  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id AND user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Eligible pending order not found');
  END IF;

  IF v_order.status <> 'pending_payment' OR v_order.payment_status <> 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order is not eligible for payment retry');
  END IF;

  v_expected_amount_paise := ROUND(v_order.total * 100)::BIGINT;
  IF v_expected_amount_paise <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid order total amount');
  END IF;

  -- 2. INSPECT PREVIOUS PAYMENT ATTEMPTS
  FOR v_existing_payment IN
    SELECT status FROM public.payments WHERE order_id = p_order_id
  LOOP
    IF v_existing_payment.status IN ('captured', 'created', 'authorized') THEN
      v_has_active_payment := TRUE;
      EXIT;
    END IF;
  END LOOP;

  if v_has_active_payment THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'A payment attempt is already captured, active, or unresolved for this order.'
    );
  END IF;

  -- 3. INSERT NEW PAYMENT ATTEMPT
  INSERT INTO public.payments (order_id, amount, currency, status)
  VALUES (p_order_id, v_expected_amount_paise, 'INR', 'created')
  RETURNING * INTO v_payment_record;

  RETURN jsonb_build_object(
    'success', true,
    'payment_id', v_payment_record.id,
    'amount', v_expected_amount_paise
  );
END;
$$;

-- Secure RPC execution permissions
REVOKE ALL ON FUNCTION public.reserve_payment_attempt(UUID, UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_payment_attempt(UUID, UUID) TO service_role;

-- 30. WEBHOOK EVENTS LEDGER & ATOMIC CLAIM RPC (CONCURRENCY-SAFE DEDUPLICATION)
CREATE TABLE IF NOT EXISTS public.webhook_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload JSONB,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status in ('processing', 'processed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.claim_webhook_event(
  p_event_id TEXT,
  p_event_type TEXT,
  p_payload JSONB
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  v_inserted BOOLEAN := FALSE;
BEGIN
  INSERT INTO public.webhook_events (event_id, event_type, payload, status)
  VALUES (p_event_id, p_event_type, p_payload, 'processing')
  ON CONFLICT (event_id) DO NOTHING;

  GET DIAGNOSTICS v_inserted = ROW_COUNT;
  IF v_inserted THEN
    RETURN TRUE;
  END IF;

  -- If already exists, check if stuck in processing for > 10 minutes or failed
  UPDATE public.webhook_events
  SET status = 'processing', payload = p_payload, updated_at = NOW()
  WHERE event_id = p_event_id
    AND (status = 'failed' OR (status = 'processing' AND updated_at < NOW() - INTERVAL '10 minutes'));

  GET DIAGNOSTICS v_inserted = ROW_COUNT;
  RETURN v_inserted;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_webhook_event(TEXT, TEXT, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_webhook_event(TEXT, TEXT, JSONB) TO service_role;
