-- Migration: Add foreign key relationship from admin_audit_logs.admin_id to public.profiles(id)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'admin_audit_logs_admin_id_fkey'
  ) THEN
    ALTER TABLE public.admin_audit_logs DROP CONSTRAINT admin_audit_logs_admin_id_fkey;
  END IF;

  ALTER TABLE public.admin_audit_logs
    ADD CONSTRAINT admin_audit_logs_admin_id_fkey
    FOREIGN KEY (admin_id)
    REFERENCES public.profiles(id)
    ON DELETE SET NULL;
END $$;
