-- PHASE 5 MIGRATION: REFUND RECONCILIATION TABLES & AUDIT TRAIL

-- 1. PUBLIC.REFUNDS TABLE
CREATE TABLE IF NOT EXISTS public.refunds (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id            UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  checkout_id           UUID REFERENCES public.checkouts(id) ON DELETE SET NULL,
  razorpay_payment_id   TEXT NOT NULL,
  razorpay_refund_id    TEXT UNIQUE,
  amount                NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  currency              TEXT NOT NULL DEFAULT 'INR',
  reason                TEXT NOT NULL CHECK (reason IN (
                          'duplicate_capture',
                          'late_capture_expired',
                          'customer_cancellation',
                          'stock_unavailable_refund'
                        )),
  status                TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'processed', 'failed')),
  idempotency_key       TEXT UNIQUE NOT NULL,
  attempt_count         INTEGER NOT NULL DEFAULT 0,
  error_details         JSONB,
  processed_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. PUBLIC.PAYMENT_RECONCILIATION_EVENTS TABLE (AUDIT LEDGER)
CREATE TABLE IF NOT EXISTS public.payment_reconciliation_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id    UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  checkout_id   UUID REFERENCES public.checkouts(id) ON DELETE SET NULL,
  event_type    TEXT NOT NULL,
  notes         TEXT,
  payload       JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. INDEXES FOR REFUND RECONCILIATION
CREATE INDEX IF NOT EXISTS idx_refunds_payment_id ON public.refunds(payment_id);
CREATE INDEX IF NOT EXISTS idx_refunds_checkout_id ON public.refunds(checkout_id);
CREATE INDEX IF NOT EXISTS idx_refunds_idempotency_key ON public.refunds(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON public.refunds(status);

CREATE INDEX IF NOT EXISTS idx_reconciliation_payment_id ON public.payment_reconciliation_events(payment_id);
CREATE INDEX IF NOT EXISTS idx_reconciliation_checkout_id ON public.payment_reconciliation_events(checkout_id);

-- 4. RLS POLICIES FOR REFUNDS & RECONCILIATION LEDGER
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_reconciliation_events ENABLE ROW LEVEL SECURITY;

-- NO PUBLIC DIRECT ACCESS TO REFUNDS OR RECONCILIATION LEDGER (SERVICE_ROLE & ADMIN ONLY)
DROP POLICY IF EXISTS "Staff view refunds" ON public.refunds;
CREATE POLICY "Staff view refunds"
  ON public.refunds FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('super_admin', 'admin', 'operations_staff')));

DROP POLICY IF EXISTS "Staff view reconciliation events" ON public.payment_reconciliation_events;
CREATE POLICY "Staff view reconciliation events"
  ON public.payment_reconciliation_events FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('super_admin', 'admin', 'operations_staff')));

COMMENT ON TABLE public.refunds IS 'Durable, idempotent ledger for Razorpay refund requests and reconciliation.';
COMMENT ON TABLE public.payment_reconciliation_events IS 'Audit trail for late captures, duplicate captures, and refund reconciliation.';
