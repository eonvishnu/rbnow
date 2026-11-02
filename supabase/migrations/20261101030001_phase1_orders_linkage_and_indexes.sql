-- PHASE 1: ORDERS LINKAGE, CONSTRAINTS, AND INDEXES

-- 1. ADD UNIQUE CONSTRAINTS SAFELY
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS unique_orders_checkout;
ALTER TABLE public.orders ADD CONSTRAINT unique_orders_checkout UNIQUE (checkout_id);

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS unique_orders_payment;
ALTER TABLE public.orders ADD CONSTRAINT unique_orders_payment UNIQUE (payment_id);

-- 2. CREATE PERFORMANCE INDEXES
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
