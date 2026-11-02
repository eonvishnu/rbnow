-- PHASE 1: CHECKOUTS, PAYMENTS, AND WEBHOOK EVENTS SCHEMA

-- 1. CARTS & CART_ITEMS TABLES
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

-- 2. CHECKOUTS & CHECKOUT_ITEMS TABLES
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

-- 3. PAYMENTS TABLE (SUPPORTS MULTI-ATTEMPT RETRIES PER CHECKOUT)
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

-- 4. PAYMENT_WEBHOOK_EVENTS TABLE
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
