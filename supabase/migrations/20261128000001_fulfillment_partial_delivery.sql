-- Migration: Add partial delivery and damage resolution to fulfillment_items

ALTER TABLE public.fulfillment_items
ADD COLUMN IF NOT EXISTS quantity_delivered NUMERIC(10, 2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS quantity_damaged NUMERIC(10, 2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS damage_disposition TEXT NULL DEFAULT 'investigating'::text;

ALTER TABLE public.fulfillment_items
DROP CONSTRAINT IF EXISTS fulfillment_items_quantities_nonnegative;

ALTER TABLE public.fulfillment_items
ADD CONSTRAINT fulfillment_items_quantities_nonnegative
CHECK (quantity_delivered >= 0 AND quantity_damaged >= 0);

ALTER TABLE public.fulfillment_items
DROP CONSTRAINT IF EXISTS fulfillment_items_quantities_invariant;

ALTER TABLE public.fulfillment_items
ADD CONSTRAINT fulfillment_items_quantities_invariant
CHECK ((quantity_delivered + quantity_damaged) <= quantity);
