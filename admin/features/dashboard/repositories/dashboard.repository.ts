import { supabase } from '@/lib/supabase';
import {
  cartStatusRowsSchema,
  checkoutRowsSchema,
  dashboardOrderRowsSchema,
  storeOpenSchema,
} from '../schemas/dashboard.schema';

export async function listDashboardOrders() {
  const { data, error } = await supabase.from('orders')
    .select('id, order_number, total, status, order_source, created_at, user_name, user_phone, delivery_address, order_items(quantity)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return dashboardOrderRowsSchema.parse(data);
}

export async function getStoreOpenStatus() {
  const { data, error } = await supabase.from('store_settings')
    .select('is_store_open')
    .eq('id', 'default')
    .single();
  if (error) throw error;
  return storeOpenSchema.parse(data).is_store_open;
}

export async function updateStoreOpenStatus(isOpen: boolean) {
  const { error } = await supabase.from('store_settings')
    .update({ is_store_open: isOpen })
    .eq('id', 'default');
  if (error) throw error;
}

export async function listDashboardCartStatuses() {
  const { data, error } = await supabase.from('carts').select('id, status');
  if (error) throw error;
  return cartStatusRowsSchema.parse(data);
}

export async function listDashboardCheckouts() {
  const { data, error } = await supabase.from('checkout_sessions').select('id, status');
  if (error) throw error;
  return checkoutRowsSchema.parse(data);
}
