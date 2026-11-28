-- Migration: Fix adjust_customer_wallet authorization to allow customers to apply store credit to their own orders

CREATE OR REPLACE FUNCTION public.adjust_customer_wallet(
  p_wallet_id UUID,
  p_user_id UUID,
  p_amount NUMERIC(12,2),
  p_type TEXT,
  p_description TEXT,
  p_performed_by UUID
)
RETURNS NUMERIC(12,2)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  v_current_balance NUMERIC(12,2);
  v_new_balance NUMERIC(12,2);
  v_is_super_admin BOOLEAN := FALSE;
BEGIN
  -- Check if caller is super_admin
  SELECT (role = 'super_admin') INTO v_is_super_admin
  FROM public.profiles
  WHERE id = auth.uid();

  -- Allow super_admin OR customer debiting their own wallet for store credit checkout
  IF NOT (COALESCE(v_is_super_admin, false) OR (auth.uid() = p_user_id AND p_type = 'debit') OR (auth.uid() IS NULL)) THEN
    RAISE EXCEPTION 'You are not authorized. Only system can add or deduct wallets automatically.';
  END IF;

  -- Lock wallet row for update to prevent concurrent race conditions
  SELECT balance INTO v_current_balance
  FROM public.customer_wallets
  WHERE id = p_wallet_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Wallet not found';
  END IF;

  IF p_type = 'debit' THEN
    IF v_current_balance < p_amount THEN
      RAISE EXCEPTION 'Insufficient wallet balance';
    END IF;
    v_new_balance := v_current_balance - p_amount;
  ELSIF p_type = 'credit' THEN
    v_new_balance := v_current_balance + p_amount;
  ELSE
    RAISE EXCEPTION 'Invalid transaction type: %', p_type;
  END IF;

  -- Update wallet balance
  UPDATE public.customer_wallets
  SET balance = v_new_balance,
      updated_at = NOW()
  WHERE id = p_wallet_id;

  -- Record wallet transaction audit log
  INSERT INTO public.wallet_transactions (
    wallet_id,
    user_id,
    amount,
    transaction_type,
    description,
    performed_by
  ) VALUES (
    p_wallet_id,
    p_user_id,
    p_amount,
    p_type,
    p_description,
    p_performed_by
  );

  RETURN v_new_balance;
END;
$$;
