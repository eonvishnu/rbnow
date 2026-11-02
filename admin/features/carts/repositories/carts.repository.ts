import { supabase } from '@/lib/supabase';
import { cartRowsSchema } from '../schemas/cart.schema';

export async function listAdminCarts() {
  const { data, error } = await supabase.from('carts')
    .select('*, cart_items(*), profiles(*)')
    .order('last_activity_at', { ascending: false });

  if (!error) return cartRowsSchema.parse(data);
  console.warn('PostgREST profiles join fallback:', error);
  const { data: fallback, error: fallbackError } = await supabase.from('carts')
    .select('*, cart_items(*)')
    .order('last_activity_at', { ascending: false });
  if (fallbackError) throw fallbackError;
  return cartRowsSchema.parse(fallback);
}
