-- Add status and error_message columns to public.webhook_events for robust retry handling
ALTER TABLE public.webhook_events
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS error_message text NULL;

-- Add check constraint on status
ALTER TABLE public.webhook_events DROP CONSTRAINT IF EXISTS webhook_events_status_check;
ALTER TABLE public.webhook_events
  ADD CONSTRAINT webhook_events_status_check
  CHECK (status IN ('pending', 'processed', 'failed'));
