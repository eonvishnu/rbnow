-- PHASE 6 SECURITY VERIFICATION SUITE

-- 1. TEST RLS SECURITY ISOLATION ON CHECKOUTS
DO $$
BEGIN
  -- Verify RLS is enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'checkouts' AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'SECURITY FAIL: RLS is not enabled on public.checkouts!';
  END IF;

  -- Verify RLS is enabled on orders
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders' AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'SECURITY FAIL: RLS is not enabled on public.orders!';
  END IF;

  -- Verify RLS is enabled on payments
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'payments' AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'SECURITY FAIL: RLS is not enabled on public.payments!';
  END IF;

  RAISE NOTICE 'SUCCESS: RLS is enabled on all commerce tables.';
END $$;
