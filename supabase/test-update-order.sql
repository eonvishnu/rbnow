DO $$
DECLARE
  v_order_id uuid;
BEGIN
  INSERT INTO public.orders (delivery_address, subtotal, total)
  VALUES ('{}'::jsonb, 100, 100)
  RETURNING id INTO v_order_id;

  RAISE NOTICE 'Created test order %', v_order_id;

  -- Test UPDATE payment_status
  UPDATE public.orders
  SET payment_status = 'paid',
      status = 'confirmed',
      razorpay_payment_id = 'pay_test_123'
  WHERE id = v_order_id;

  RAISE NOTICE 'UPDATE succeeded!';

  DELETE FROM public.orders WHERE id = v_order_id;
END $$;
