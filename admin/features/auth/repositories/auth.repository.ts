import { supabase } from '@/lib/supabase';
import { adminProfileSchema } from '../schemas/profile.schema';

export async function getAdminProfile(userId: string) {
  const { data, error } = await supabase.from('profiles')
    .select('id, display_name, phone_number, role, is_verified')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return adminProfileSchema.parse(data);
}

export async function getProfileRole(userId: string) {
  const { data, error } = await supabase.from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data?.role ?? null;
}
