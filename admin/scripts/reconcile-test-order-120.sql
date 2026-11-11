-- Reconcile Test Order #RB-120 and restore inventory
DO $$
DECLARE
  v_order_id UUID := '488f0bdd-dda9-4640-942a-4fc0444b37c9';
  v_checkout_id UUID := 'bc862db7-28ba-4ffc-89c5-96cfe9a9baaa';
  v_variant_id UUID := 'a473db4b-1e5a-4da8-9979-a967e220f1c2';
BEGIN
  -- 1. Delete order_items
  DELETE FROM public.order_items WHERE order_id = v_order_id;

  -- 2. Delete order
  DELETE FROM public.orders WHERE id = v_order_id;

  -- 3. Delete checkout items & checkout
  DELETE FROM public.checkout_items WHERE checkout_id = v_checkout_id;
  DELETE FROM public.payments WHERE checkout_id = v_checkout_id;
  DELETE FROM public.checkouts WHERE id = v_checkout_id;

  -- 4. Restore stock to 10
  UPDATE public.product_variants
  SET stock = 10,
      is_available = true,
      updated_at = NOW()
  WHERE id = v_variant_id;

  RAISE NOTICE 'Order RB-120 deleted and stock restored to 10 successfully.';
END $$;
