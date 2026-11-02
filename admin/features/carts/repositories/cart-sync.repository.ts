import { supabase } from '@/lib/supabase';

export async function findActiveCustomerCart(userId: string | null, browserId: string) {
  let query = supabase.from('carts').select('id').eq('status', 'active');
  query = userId ? query.eq('user_id', userId) : query.eq('session_id', browserId);
  const { data, error } = await query.limit(1);
  if (error) throw error;
  return data?.[0]?.id ?? null;
}

export async function findGuestCart(browserId: string) {
  const { data, error } = await supabase.from('carts')
    .select('id')
    .eq('session_id', browserId)
    .eq('status', 'active')
    .limit(1);
  if (error) throw error;
  return data?.[0]?.id ?? null;
}

export async function attachGuestCartToUser(cartId: string, userId: string) {
  const { error } = await supabase.from('carts')
    .update({ user_id: userId, updated_at: new Date().toISOString() })
    .eq('id', cartId);
  if (error) throw error;
}

export async function createCustomerCart(userId: string | null, browserId: string) {
  const { data, error } = await supabase.from('carts').insert({
    user_id: userId,
    session_id: browserId,
    status: 'active',
    last_activity_at: new Date().toISOString(),
  }).select('id').single();
  if (error) throw error;
  return data.id;
}

export async function updateCustomerCartTotal(cartId: string, subtotal: number) {
  const { error } = await supabase.from('carts').update({
    subtotal,
    total: subtotal,
    last_activity_at: new Date().toISOString(),
  }).eq('id', cartId);
  if (error) throw error;
}

export async function replaceCustomerCartItems(
  cartId: string,
  items: Array<{
    cart_id: string;
    variant_id: string;
    product_id: string;
    product_name: string;
    variant_unit: string;
    unit_price: number;
    quantity: number;
  }>,
) {
  const { error: deleteError } = await supabase.from('cart_items').delete().eq('cart_id', cartId);
  if (deleteError) throw deleteError;
  if (items.length) {
    const { error: insertError } = await supabase.from('cart_items').insert(items);
    if (insertError) throw insertError;
  }
}

export async function clearCustomerCartItems(cartId: string) {
  const { error: deleteError } = await supabase.from('cart_items').delete().eq('cart_id', cartId);
  if (deleteError) throw deleteError;
  const { error: updateError } = await supabase.from('carts')
    .update({ subtotal: 0, total: 0 })
    .eq('id', cartId);
  if (updateError) throw updateError;
}
