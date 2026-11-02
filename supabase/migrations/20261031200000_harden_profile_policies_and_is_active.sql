-- Migration: Harden public.profiles policies, WITH CHECK constraints, and self-demotion protection

-- 1. Ensure is_active column exists on public.profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- 2. Trigger protecting role and is_active columns from unauthorized edits or self-demotion
CREATE OR REPLACE FUNCTION public.protect_profile_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Non-super-admin users CANNOT change role or is_active
  IF public.current_user_role() <> 'super_admin' THEN
    IF NEW.role <> OLD.role OR NEW.is_active <> OLD.is_active THEN
      RAISE EXCEPTION 'Forbidden: Only super admins can modify user roles or active status.';
    END IF;
  END IF;

  -- Super admins cannot deactivate or demote their own account
  IF OLD.id = auth.uid() AND OLD.role = 'super_admin' AND (NEW.role <> 'super_admin' OR NEW.is_active = false) THEN
    RAISE EXCEPTION 'Super admins cannot demote or deactivate their own account.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_protect_profile_columns ON public.profiles;
CREATE TRIGGER tr_protect_profile_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_columns();

-- 3. Update Profiles RLS WITH CHECK clauses
DROP POLICY IF EXISTS "Super admins can update profile roles" ON public.profiles;
CREATE POLICY "Super admins can update profile roles" ON public.profiles
  FOR UPDATE
  USING (public.current_user_role() = 'super_admin')
  WITH CHECK (public.current_user_role() = 'super_admin');

DROP POLICY IF EXISTS "Users can update own non-protected profile fields" ON public.profiles;
CREATE POLICY "Users can update own non-protected profile fields" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
