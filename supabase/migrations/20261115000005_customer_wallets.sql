-- Migration: Customer Wallets & Usage History System

CREATE TABLE IF NOT EXISTS public.customer_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES public.customer_wallets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  description TEXT NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_wallets_user_id ON public.customer_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON public.wallet_transactions(user_id);

-- Automatic wallet creation trigger on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.customer_wallets (user_id, balance)
  VALUES (NEW.id, 0.00)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_wallet ON auth.users;
CREATE TRIGGER on_auth_user_created_wallet
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_wallet();

-- Backfill wallets for existing users
INSERT INTO public.customer_wallets (user_id, balance)
SELECT id, 0.00 FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- RLS Policies
ALTER TABLE public.customer_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own wallet" ON public.customer_wallets;
CREATE POLICY "Users can view own wallet"
  ON public.customer_wallets FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can view own wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Users can view own wallet transactions"
  ON public.wallet_transactions FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Service role full access customer_wallets" ON public.customer_wallets;
CREATE POLICY "Service role full access customer_wallets"
  ON public.customer_wallets FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access wallet_transactions" ON public.wallet_transactions;
CREATE POLICY "Service role full access wallet_transactions"
  ON public.wallet_transactions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update wallets" ON public.customer_wallets;
CREATE POLICY "Authenticated users can update wallets"
  ON public.customer_wallets FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can insert wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Authenticated users can insert wallet transactions"
  ON public.wallet_transactions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
