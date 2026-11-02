ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS checkout_id UUID REFERENCES public.checkouts(id);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES public.payments(id);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS fulfillment_exception TEXT;
