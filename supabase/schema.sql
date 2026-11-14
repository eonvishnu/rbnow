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
  order_number bigint generated always as identity,
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
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

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
  quantity integer not null,
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
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS duplicate_payment BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS refund_review_required BOOLEAN NOT NULL DEFAULT FALSE;

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
  v_variant_stock INT;
  v_variant_is_available BOOLEAN;
  v_has_stock_issue BOOLEAN := FALSE;
  v_failed_item_name TEXT := '';
  v_rows_updated INT;
  v_assigned_order_number BIGINT;
BEGIN
  -- 1. STRICT PAYMENT ID AND AMOUNT VALIDATION
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

  -- 3. FETCH SPECIFIC PAYMENT ATTEMPT RECORD
  SELECT * INTO v_payment_record
  FROM public.payments
  WHERE order_id = p_order_id AND razorpay_order_id = p_razorpay_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO public.payments (order_id, razorpay_order_id, amount, currency, status)
    VALUES (p_order_id, p_razorpay_order_id, p_payment_amount, 'INR', 'created')
    RETURNING * INTO v_payment_record;
  END IF;

  -- 4. IDEMPOTENCY CHECK (Preserves stock exception status for cancelled orders)
  IF v_order.payment_status = 'paid' THEN
    IF v_order.status = 'cancelled' THEN
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

  -- 5. EXACT AMOUNT MATCH CHECK (amount in paise)
  IF v_order.total * 100 <> p_payment_amount AND v_order.total <> p_payment_amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', format('Payment amount mismatch: Expected %s, received %s', v_order.total * 100, p_payment_amount)
    );
  END IF;

  -- 6. REJECT ORDERS WITH ZERO ITEMS
  IF NOT EXISTS (
    SELECT 1 FROM public.order_items
    WHERE order_id = p_order_id
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Cannot confirm an order without items.'
    );
  END IF;

  -- 6. AGGREGATE VARIANT QUANTITIES & LOCK IN ASCENDING ORDER TO PREVENT DEADLOCKS
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

    IF v_variant_stock IS NULL OR v_variant_is_available = FALSE OR v_variant_stock < v_item.total_qty THEN
      v_has_stock_issue := TRUE;
      v_failed_item_name := v_item.sample_name;
      EXIT;
    END IF;
  END LOOP;

  -- IF STOCK OR AVAILABILITY ISSUE: Flag order for stock exception & alert staff
  IF v_has_stock_issue THEN
    UPDATE public.orders
    SET payment_status = 'paid',
        status = 'cancelled',
        payment_id = v_payment_record.id,
        razorpay_order_id = p_razorpay_order_id,
        razorpay_payment_id = p_razorpay_payment_id,
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
      'error', format('Insufficient inventory for item %s. Order flagged for fulfillment review.', v_failed_item_name)
    );
  END IF;

  -- 7. ASSIGN STRICTLY SEQUENTIAL ORDER NUMBER ONLY ON PAYMENT CONFIRMATION
  IF v_order.order_number IS NULL THEN
    v_assigned_order_number := nextval('public.confirmed_order_number_seq');
  ELSE
    v_assigned_order_number := v_order.order_number;
  END IF;

  -- 8. ATOMIC ORDER STATUS TRANSITION TO CONFIRMED
  UPDATE public.orders
  SET order_number = v_assigned_order_number,
      payment_status = 'paid',
      status = 'confirmed',
      payment_id = v_payment_record.id,
      razorpay_order_id = p_razorpay_order_id,
      razorpay_payment_id = p_razorpay_payment_id,
      updated_at = NOW()
  WHERE id = p_order_id;

  -- 9. UPDATE PAYMENT RECORD TO CAPTURED
  UPDATE public.payments
  SET status = 'captured',
      razorpay_payment_id = p_razorpay_payment_id,
      paid_at = NOW(),
      updated_at = NOW()
  WHERE id = v_payment_record.id;

  -- 10. ATOMIC AGGREGATED STOCK DEDUCTION WITH ROW COUNT CHECK
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
    If v_rows_updated = 0 THEN
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

-- Insert default store settings if missing
insert into public.store_settings (id, is_store_open, store_name)
values ('default', true, 'Royal Bengal')
on conflict (id) do nothing;

-- ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.banners enable row level security;
alter table public.coupons enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.store_settings enable row level security;
alter table public.inventory_transactions enable row level security;
alter table public.order_status_history enable row level security;
alter table public.payments enable row level security;
alter table public.coupon_usages enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.checkout_sessions enable row level security;
alter table public.checkout_events enable row level security;
alter table public.preorder_campaigns enable row level security;
alter table public.discounts enable row level security;
alter table public.discount_variants enable row level security;
alter table public.order_item_changes enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.suppliers enable row level security;
alter table public.purchase_orders enable row level security;
alter table public.purchase_order_items enable row level security;
alter table public.payment_gateways enable row level security;
alter table public.payment_gateway_credentials enable row level security;

-- Public Read Policies (SECURE: Filter active/available items & active categories)
create policy "Public can read categories" on public.categories for select using (status = 'active');
create policy "Public can read active products" on public.products for select using (
  is_available = true and (
    category_id is null or exists (
      select 1 from public.categories
      where categories.id = products.category_id and categories.status = 'active'
    ) or exists (
      select 1 from public.categories
      where lower(categories.name) = lower(products.category_name) and categories.status = 'active'
    )
  )
);
create policy "Public can read active product_variants" on public.product_variants for select using (is_available = true);
create policy "Public can read active banners" on public.banners for select using (status = 'active');
create policy "Public can read store settings" on public.store_settings for select using (true);
create policy "Public can read coupons" on public.coupons for select using (is_active = true and (expiry_date is null or expiry_date > now()));
create policy "Public can read active preorder_campaigns" on public.preorder_campaigns for select using (status = 'active' and starts_at <= now() and (ends_at is null or ends_at > now()));
create policy "Public can read active discounts" on public.discounts for select using (is_active = true and (ends_at is null or ends_at > now()));
create policy "Public can read active discount_variants" on public.discount_variants for select using (
  exists (
    select 1 from public.discounts
    where discounts.id = discount_variants.discount_id
    and discounts.is_active = true
    and discounts.starts_at <= now()
    and (discounts.ends_at is null or discounts.ends_at > now())
  )
);
create policy "Public can read payment_gateways" on public.payment_gateways for select using (true);

-- Customer Specific RLS Policies (SECURE: SELECT ONLY for orders, no client-side payment_status mutation)
create policy "Users can view own addresses" on public.addresses for select using (auth.uid() = user_id);
create policy "Users can insert own addresses" on public.addresses for insert with check (auth.uid() = user_id);
create policy "Users can update own addresses" on public.addresses for update using (auth.uid() = user_id);
create policy "Users can delete own addresses" on public.addresses for delete using (auth.uid() = user_id);

create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can view own order items" on public.order_items for select using (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
create policy "Users can view own order history" on public.order_status_history for select using (
  exists (select 1 from public.orders where orders.id = order_status_history.order_id and orders.user_id = auth.uid())
);
create policy "Users can view own order item changes" on public.order_item_changes for select using (
  exists (select 1 from public.orders where orders.id = order_item_changes.order_id and orders.user_id = auth.uid())
);

create policy "Users can view own coupon usages" on public.coupon_usages for select using (auth.uid() = user_id);

create policy "Users can manage own carts" on public.carts for all using (
  auth.uid() = user_id or (user_id is null and session_id is not null)
);
create policy "Users can manage own cart items" on public.cart_items for all using (
  exists (select 1 from public.carts where carts.id = cart_items.cart_id and (carts.user_id = auth.uid() or (carts.user_id is null and carts.session_id is not null)))
);
create policy "Users can manage own checkout sessions" on public.checkout_sessions for all using (
  auth.uid() = user_id or (user_id is null and session_id is not null)
);

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
  public.current_user_role() = 'admin'
);

create policy "Staff can manage payment_gateways" on public.payment_gateways for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('super_admin', 'admin'))
);

create policy "Staff can manage payment_gateway_credentials" on public.payment_gateway_credentials for all using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('super_admin', 'admin'))
);

-- STORAGE BUCKETS SETUP
insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('categories', 'categories', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('banners', 'banners', true) on conflict (id) do nothing;
