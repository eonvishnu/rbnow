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
  if (error) {
    console.error('listCustomerProfiles error:', error, JSON.stringify(error));
    throw error;
  }
  return customerProfilesSchema.parse(data);
}

export async function listCustomerProfilesPaginated(page: number = 1, pageSize: number = 25, searchQuery: string = '') {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from('profiles')
    .select('id, display_name, email, phone_number, created_at, role', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (searchQuery.trim()) {
    const q = searchQuery.trim();
    query = query.or(`display_name.ilike.%${q}%,email.ilike.%${q}%,phone_number.ilike.%${q}%`);
  }

  const { data, count, error } = await query;
  if (error) {
    console.error('listCustomerProfilesPaginated error:', error, JSON.stringify(error));
    throw error;
  }
  return {
    profiles: customerProfilesSchema.parse(data),
    totalCount: count ?? 0,
  };
}

export async function listCustomerOrderSummaries() {
  const { data, error } = await supabase.from('orders')
    .select('id, user_id, total, status, created_at');
  if (error) {
    console.error('listCustomerOrderSummaries error:', error, JSON.stringify(error));
    throw error;
  }
  return customerOrderSummariesSchema.parse(data);
}

export async function listOrdersForCustomer(userId: string) {
  const { data, error } = await supabase.from('orders')
    .select('id, order_number, total, status, created_at, order_items(product_name, variant_unit, quantity, total_price)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('listOrdersForCustomer error:', error, JSON.stringify(error));
    throw error;
  }
  return customerOrdersSchema.parse(data);
}
