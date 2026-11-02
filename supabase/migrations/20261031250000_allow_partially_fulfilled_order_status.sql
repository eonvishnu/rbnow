-- Migration: Allow partially_fulfilled and completed in orders.status CHECK constraint

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders ADD CONSTRAINT orders_status_check CHECK (
  status IN (
    'pending_payment',
    'pending',
    'confirmed',
    'processing',
    'preparing',
    'ready_for_delivery',
    'out_for_delivery',
    'partially_fulfilled',
    'delivered',
    'completed',
    'cancelled'
  )
);
