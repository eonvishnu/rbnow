-- Create webhook_events table for Razorpay event deduplication
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Service role full access only
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access webhook_events" ON public.webhook_events;
CREATE POLICY "Service role full access webhook_events" ON public.webhook_events
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');
