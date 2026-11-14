import { supabase } from '@/lib/supabase';
import type { AdminCheckout } from '../types/checkout';

export async function listAdminCheckouts(): Promise<AdminCheckout[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('status', 'pending_payment')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('listAdminCheckouts error:', error);
    throw error;
  }

  return (data || []).map((o: any) => ({
    id: o.id,
    user_id: o.user_id,
    customer_name: o.user_name || 'Guest Customer',
    customer_phone: o.user_phone || '',
    delivery_address: o.delivery_address || {},
    subtotal: Number(o.subtotal || 0),
    delivery_fee: Number(o.delivery_fee || 0),
    discount: Number(o.discount || 0),
    grand_total: Number(o.total || 0),
    currency: 'INR',
    status: o.status,
    created_at: o.created_at,
    checkout_items: (o.order_items || []).map((i: any) => ({
      id: i.id,
      product_name: i.product_name,
      variant_unit: i.variant_unit || 'pack',
      quantity: i.quantity,
      unit_price: Number(i.price || 0),
      line_total: Number(i.total_price || 0),
    })),
  }));
}
