import { supabase } from '@/lib/supabase';

export interface PendingOrderItem {
  id: string;
  order_id: string;
  order_number?: number;
  user_id: string;
  customer_name: string;
  product_name: string;
  quantity_ordered: number;
  quantity_fulfilled: number;
  quantity_cancelled: number;
  quantity_on_hold: number;
  quantity_remaining: number;
  hold_reason?: string | null;
  created_at: string;
}

export interface FulfillmentBatchRow {
  id: string;
  fulfillment_number: string;
  user_id: string | null;
  customer_name?: string;
  status: 'preparing' | 'ready_for_dispatch' | 'out_for_delivery' | 'delivered' | 'cancelled';
  scheduled_delivery_at?: string | null;
  delivered_at?: string | null;
  delivery_notes?: string | null;
  driver_name?: string | null;
  driver_phone?: string | null;
  delivery_address_snapshot?: any;
  created_at: string;
  fulfillment_items?: any[];
}

export async function fetchPendingOrderItems(): Promise<PendingOrderItem[]> {
  const { data: orderItems, error } = await supabase
    .from('order_items')
    .select('*, orders(id, order_number, user_id, user_name, status, created_at)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending order items:', error);
    return [];
  }

  const result: PendingOrderItem[] = [];
  (orderItems || []).forEach((item: any) => {
    const qOrdered = Number(item.quantity || 0);
    const qFulfilled = Number(item.quantity_fulfilled || 0);
    const qCancelled = Number(item.quantity_cancelled || 0);
    const qHold = Number(item.quantity_on_hold || 0);
    const qRemaining = Math.max(0, qOrdered - qFulfilled - qCancelled);

    if (qRemaining > 0 || qHold > 0) {
      result.push({
        id: item.id,
        order_id: item.order_id,
        order_number: item.orders?.order_number,
        user_id: item.orders?.user_id,
        customer_name: item.orders?.user_name || 'Customer',
        product_name: item.product_name,
        quantity_ordered: qOrdered,
        quantity_fulfilled: qFulfilled,
        quantity_cancelled: qCancelled,
        quantity_on_hold: qHold,
        quantity_remaining: qRemaining,
        hold_reason: item.hold_reason,
        created_at: item.created_at,
      });
    }
  });

  return result;
}

export async function fetchFulfillmentBatches(): Promise<FulfillmentBatchRow[]> {
  const { data, error } = await supabase
    .from('fulfillments')
    .select('*, fulfillment_items(*, order_items(*, orders(order_number, user_name)))')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching fulfillments:', error);
    return [];
  }

  return (data || []).map((f: any) => ({
    ...f,
    customer_name: f.fulfillment_items?.[0]?.order_items?.orders?.user_name || 'Customer',
  }));
}

export async function createFulfillmentBatchRecord(input: {
  userId: string;
  addressSnapshot?: any;
  notes?: string;
}): Promise<FulfillmentBatchRow> {
  const fulNumber = `DEL-${Date.now().toString().slice(-6)}`;
  const { data, error } = await supabase
    .from('fulfillments')
    .insert({
      fulfillment_number: fulNumber,
      user_id: input.userId,
      status: 'preparing',
      delivery_address_snapshot: input.addressSnapshot || {},
      delivery_notes: input.notes || '',
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function allocateItemToBatch(input: {
  fulfillmentId: string;
  orderItemId: string;
  quantity: number;
  holdReason?: string;
}): Promise<void> {
  const { data, error } = await supabase.rpc('allocate_fulfillment_item', {
    p_fulfillment_id: input.fulfillmentId,
    p_order_item_id: input.orderItemId,
    p_quantity: input.quantity,
    p_hold_reason: input.holdReason || null,
  });

  if (error) throw error;
  if (data && data.success === false) {
    throw new Error(data.message || 'Allocation failed');
  }
}

export async function updateFulfillmentDriverInfo(input: {
  fulfillmentId: string;
  status: 'ready_for_dispatch' | 'out_for_delivery';
  driverName: string;
  driverPhone: string;
  notes?: string;
}): Promise<void> {
  const { error } = await supabase
    .from('fulfillments')
    .update({
      status: input.status,
      driver_name: input.driverName,
      driver_phone: input.driverPhone,
      delivery_notes: input.notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', input.fulfillmentId);

  if (error) throw error;
}

export async function completeFulfillmentDeliveryRpc(fulfillmentId: string): Promise<void> {
  const { data, error } = await supabase.rpc('complete_fulfillment_delivery', {
    p_fulfillment_id: fulfillmentId,
  });

  if (error) throw error;
  if (data && data.success === false) {
    throw new Error(data.message || 'Delivery completion failed');
  }
}

export async function cancelFulfillmentBatchRpc(fulfillmentId: string, reason: string): Promise<void> {
  const { data, error } = await supabase.rpc('cancel_fulfillment_batch', {
    p_fulfillment_id: fulfillmentId,
    p_reason: reason,
  });

  if (error) throw error;
  if (data && data.success === false) {
    throw new Error(data.message || 'Batch cancellation failed');
  }
}
