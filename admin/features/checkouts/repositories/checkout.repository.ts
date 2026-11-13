import { supabase } from '@/lib/supabase';
import type { AdminCheckout } from '../types/checkout';

export async function listAdminCheckouts(): Promise<AdminCheckout[]> {
  const { data, error } = await supabase
    .from('checkouts')
    .select('*, checkout_items(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('listAdminCheckouts error:', error);
    throw error;
  }
  return data || [];
}
