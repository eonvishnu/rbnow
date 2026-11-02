import { supabase } from '@/lib/supabase';
import { manualOrderProductSchema } from '../schemas/order.schema';
import type {
  ManualOrderCustomer,
  ManualOrderItem,
} from '../types/order';

export async function listManualOrderProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, image_url, product_variants(id, unit, price)')
    .order('name');
  if (error) throw error;
  return manualOrderProductSchema.array().parse(data);
}

export async function insertManualOrder(input: {
  customer: ManualOrderCustomer;
  items: ManualOrderItem[];
  createdBy: string | undefined;
  deliveryFee: number;
  manualDiscount: number;
  subtotal: number;
  total: number;
}) {
  const { customer, items, createdBy, deliveryFee, manualDiscount, subtotal, total } = input;
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_name: customer.name,
      user_phone: customer.phone,
      delivery_address: {
        name: customer.name,
        phone: customer.phone,
        houseNumber: customer.houseNo,
        address: customer.area,
        city: customer.city,
        pincode: customer.pincode,
      },
      subtotal,
      delivery_fee: deliveryFee,
      discount: manualDiscount,
      total,
      payment_method: customer.paymentMethod,
      payment_status: customer.paymentMethod === 'paid' ? 'paid' : 'pending',
      status: 'processing',
      order_source: customer.source,
      notes: `Manual order created via Admin (${customer.source})`,
    })
    .select('id')
    .single();
  if (orderError) throw orderError;

  const { error: itemsError } = await supabase.from('order_items').insert(items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    variant_id: item.variantId,
    product_name: item.name,
    variant_unit: item.unit,
    product_image: item.img,
    price: item.price,
    quantity: item.qty,
    total_price: item.price * item.qty,
  })));
  if (itemsError) throw itemsError;

  const { error: historyError } = await supabase.from('order_status_history').insert({
    order_id: order.id,
    created_by: createdBy,
    status: 'processing',
    notes: `Assisted manual order created by Admin via ${customer.source.toUpperCase()}`,
  });
  if (historyError) throw historyError;

  const { error: auditError } = await supabase.from('admin_audit_logs').insert({
    admin_id: createdBy,
    action: 'CREATE_MANUAL_ORDER',
    entity_type: 'order',
    entity_id: order.id,
    details: { customerName: customer.name, source: customer.source, total },
  });
  if (auditError) throw auditError;
}
