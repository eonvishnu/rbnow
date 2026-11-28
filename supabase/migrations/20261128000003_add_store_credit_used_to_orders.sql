-- Migration: Add store_credit_used column to public.orders table

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS store_credit_used NUMERIC(10, 2) NULL DEFAULT 0;
