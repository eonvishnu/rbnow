import {
  listAdminOrders,
  listReplacementProducts,
  replaceOrderItem,
  updateOrderStatus,
} from '../repositories/orders.repository';
import type { AdminOrder, AdminOrderItem } from '../types/order';

export { listAdminOrders, listReplacementProducts };

export async function changeAdminOrderStatus(orderId: string, status: string) {
  await updateOrderStatus(orderId, status);
}

export async function swapAdminOrderItem(input: {
  order: AdminOrder;
  item: AdminOrderItem;
  replacementVariantId: string;
  reason: string;
}) {
  if (!input.replacementVariantId) throw new Error('Select replacement variant.');
  await replaceOrderItem({
    orderId: input.order.id,
    orderSubtotal: input.order.subtotal,
    orderDiscount: input.order.discount,
    deliveryFee: input.order.deliveryFee,
    item: input.item,
    replacementVariantId: input.replacementVariantId,
    reason: input.reason,
  });
}
