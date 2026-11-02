import { supabase } from '@/lib/supabase';
import { adminOrderRowSchema, replacementProductSchema } from '../schemas/order.schema';
import type { AdminOrderItem } from '../types/order';

export async function listAdminOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*), order_status_history(*), order_item_changes(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;

  return adminOrderRowSchema.array().parse(data).map((order) => ({
    id: order.id,
    orderId: `RB-${order.order_number || order.id.slice(0, 6).toUpperCase()}`,
    createdAt: order.created_at,
    status: order.status || 'pending',
    orderSource: order.order_source || 'online_web',
    total: order.total,
    subtotal: order.subtotal,
    deliveryFee: order.delivery_fee || 0,
    discount: order.discount || 0,
    shipping: order.delivery_address,
    userPhone: order.user_phone,
    userName: order.user_name,
    itemChanges: order.order_item_changes || [],
    items: (order.order_items || []).map((item) => ({
      id: item.id,
      productId: item.product_id,
      variantId: item.variant_id,
      name: item.product_name,
      qty: item.quantity,
      price: item.price,
      subtotal: item.total_price,
      unit: item.variant_unit || 'pack',
    })),
  }));
}

export async function listReplacementProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, product_variants(id, unit, price)')
    .order('name');
  if (error) throw error;
  return replacementProductSchema.array().parse(data);
}

export async function updateOrderStatus(orderId: string, status: string) {
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);
  if (error) throw error;

  const { error: historyError } = await supabase.from('order_status_history').insert({
    order_id: orderId,
    status,
    notes: `Order status updated to ${status} by Admin`,
  });
  if (historyError) throw historyError;
}

export async function replaceOrderItem(input: {
  orderId: string;
  orderSubtotal: number;
  orderDiscount: number;
  deliveryFee: number;
  item: AdminOrderItem;
  replacementVariantId: string;
  reason: string;
}) {
  const { data: replacement, error: variantError } = await supabase
    .from('product_variants')
    .select('*, products(*)')
    .eq('id', input.replacementVariantId)
    .single();
  if (variantError) throw variantError;
  if (!replacement) throw new Error('Replacement variant not found');

  const newPrice = Number(replacement.price);
  const newSubtotal = newPrice * input.item.qty;
  const subtotalDiff = newSubtotal - input.item.subtotal;
  const updatedSubtotal = input.orderSubtotal + subtotalDiff;
  const updatedTotal = Math.max(0, updatedSubtotal - input.orderDiscount + input.deliveryFee);

  const { error: itemError } = await supabase.from('order_items').update({
    product_id: replacement.product_id,
    variant_id: replacement.id,
    product_name: replacement.products?.name || 'Replacement Item',
    variant_unit: replacement.unit,
    product_image: replacement.products?.image_url,
    price: newPrice,
    total_price: newSubtotal,
  }).eq('id', input.item.id);
  if (itemError) throw itemError;

  const { error: orderError } = await supabase.from('orders').update({
    subtotal: updatedSubtotal,
    total: updatedTotal,
    updated_at: new Date().toISOString(),
  }).eq('id', input.orderId);
  if (orderError) throw orderError;

  const { error: auditError } = await supabase.from('order_item_changes').insert({
    order_id: input.orderId,
    order_item_id: input.item.id,
    change_type: 'replace',
    old_product_id: input.item.productId,
    old_variant_id: input.item.variantId,
    old_quantity: input.item.qty,
    old_unit_price: input.item.price,
    new_product_id: replacement.product_id,
    new_variant_id: replacement.id,
    new_quantity: input.item.qty,
    new_unit_price: newPrice,
    reason: input.reason,
  });
  if (auditError) throw auditError;
}
