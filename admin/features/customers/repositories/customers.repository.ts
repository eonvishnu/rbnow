import { supabase } from '@/lib/supabase';
import {
  customerOrderSummariesSchema,
  customerOrdersSchema,
  customerProfilesSchema,
} from '../schemas/customer.schema';

export async function listCustomerProfiles() {
  const { data, error } = await supabase.from('profiles')
    .select('id, display_name, email, phone_number, created_at, role')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return customerProfilesSchema.parse(data);
}

export async function listCustomerOrderSummaries() {
  const { data, error } = await supabase.from('orders')
    .select('id, user_id, total, status, payment_status, created_at');
  if (error) throw error;
  return customerOrderSummariesSchema.parse(data);
}

export async function listOrdersForCustomer(userId: string) {
  const { data, error } = await supabase.from('orders')
    .select('id, order_number, total, status, created_at, order_items(product_name, variant_unit, quantity, total_price)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return customerOrdersSchema.parse(data);
}
