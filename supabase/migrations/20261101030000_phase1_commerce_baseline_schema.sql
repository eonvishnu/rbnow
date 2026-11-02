-- PHASE 1 MIGRATION: COMMERCE BASELINE ARCHITECTURE SCHEMA & CONSTRAINTS

-- 1. SEQUENTIAL ORDER NUMBER GENERATOR
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START WITH 101;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'RB-' || nextval('public.order_number_seq')::text;
END;
$$ LANGUAGE plpgsql;

-- 2. CARTS & CART_ITEMS TABLES
CREATE TABLE IF NOT EXISTS public.carts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status            TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'abandoned', 'converted')),
  subtotal          NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (subtotal >= 0),
  total             NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (total >= 0),
  last_activity_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cart_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id       UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  variant_id    TEXT NOT NULL,
  product_id    TEXT NOT NULL,
  product_name  TEXT NOT NULL,
  variant_unit  TEXT NOT NULL,
  unit_price    NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. CHECKOUTS & CHECKOUT_ITEMS TABLES (IMMUTABLE PRE-PAYMENT SNAPSHOT)
CREATE TABLE IF NOT EXISTS public.checkouts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name     TEXT NOT NULL,
  customer_phone    TEXT NOT NULL,
  delivery_address  JSONB NOT NULL,
  subtotal          NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee      NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (delivery_fee >= 0),
  discount          NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (discount >= 0),
  grand_total       NUMERIC(10,2) NOT NULL CHECK (grand_total >= 0),
  currency          TEXT NOT NULL DEFAULT 'INR',
  status            TEXT NOT NULL DEFAULT 'pending_payment'
                      CHECK (status IN ('pending_payment', 'converted', 'expired', 'cancelled')),
  expires_at        TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 minutes'),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.checkout_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checkout_id   UUID NOT NULL REFERENCES public.checkouts(id) ON DELETE CASCADE,
  variant_id    TEXT NOT NULL,
  product_id    TEXT NOT NULL,
  product_name  TEXT NOT NULL,
  variant_unit  TEXT NOT NULL,
  unit_price    NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  line_total    NUMERIC(10,2) NOT NULL CHECK (line_total >= 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. PAYMENTS TABLE (SUPPORTS MULTI-ATTEMPT RETRIES PER CHECKOUT)
CREATE TABLE IF NOT EXISTS public.payments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checkout_id           UUID NOT NULL REFERENCES public.checkouts(id) ON DELETE CASCADE,
  razorpay_order_id     TEXT UNIQUE,
  razorpay_payment_id   TEXT UNIQUE,
  razorpay_signature    TEXT,
  amount                NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  currency              TEXT NOT NULL DEFAULT 'INR',
  status                TEXT NOT NULL DEFAULT 'created'
                          CHECK (status IN (
                            'created',
                            'authorized',
                            'captured',
                            'failed',
                            'refunded',
                            'duplicate_captured_refund_pending'
                          )),
  error_details         JSONB,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. ORDERS & ORDER_ITEMS TABLES (OPERATIONAL FULFILLMENT QUEUE)
CREATE TABLE IF NOT EXISTS public.orders (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number          TEXT UNIQUE NOT NULL DEFAULT public.generate_order_number(),
  user_id               UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  delivery_address      JSONB NOT NULL,
  subtotal              NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee          NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (delivery_fee >= 0),
  discount              NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (discount >= 0),
  total                 NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  currency              TEXT NOT NULL DEFAULT 'INR',
  status                TEXT NOT NULL DEFAULT 'confirmed',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SAFELY ADD COLUMNS TO ORDERS BEFORE INDEXES OR CONSTRAINTS
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS checkout_id UUID REFERENCES public.checkouts(id);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES public.payments(id);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS fulfillment_exception TEXT;

CREATE TABLE IF NOT EXISTS public.order_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  variant_id    TEXT NOT NULL,
  product_id    TEXT NOT NULL,
  product_name  TEXT NOT NULL,
  variant_unit  TEXT NOT NULL,
  price         NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  total_price   NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. PAYMENT_WEBHOOK_EVENTS TABLE (IDEMPOTENT EVENT LEDGER)
CREATE TABLE IF NOT EXISTS public.payment_webhook_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      TEXT UNIQUE NOT NULL,
  event_type    TEXT NOT NULL,
  payload       JSONB NOT NULL,
  status        TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'processed', 'ignored', 'failed')),
  processed_at  TIMESTAMPTZ,
  error_message TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON public.carts(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON public.cart_items(cart_id);

CREATE INDEX IF NOT EXISTS idx_checkouts_user_id ON public.checkouts(user_id);
CREATE INDEX IF NOT EXISTS idx_checkouts_status ON public.checkouts(status);
CREATE INDEX IF NOT EXISTS idx_checkout_items_checkout_id ON public.checkout_items(checkout_id);

CREATE INDEX IF NOT EXISTS idx_payments_checkout_id ON public.payments(checkout_id);
CREATE INDEX IF NOT EXISTS idx_payments_rzp_order ON public.payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_rzp_payment ON public.payments(razorpay_payment_id);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_checkout_id ON public.orders(checkout_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON public.orders(payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON public.payment_webhook_events(event_id);

COMMENT ON TABLE public.checkouts IS 'Pre-payment checkout intention snapshot created when user clicks Place Order.';
COMMENT ON TABLE public.payments IS 'Payment attempts log supporting multi-attempt retries per checkout.';
COMMENT ON TABLE public.orders IS 'Operational fulfillment queue containing 100% verified paid orders.';
COMMENT ON TABLE public.payment_webhook_events IS 'Idempotent webhook ledger for tracking Razorpay webhook events.';
