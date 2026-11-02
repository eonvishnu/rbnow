import { insertManualOrder, listManualOrderProducts } from '../repositories/manual-orders.repository';
import { manualOrderInputSchema } from '../schemas/order.schema';
import type {
  ManualOrderCustomer,
  ManualOrderItem,
} from '../types/order';

export { listManualOrderProducts };

export async function createAssistedOrder(input: {
  customer: ManualOrderCustomer;
  items: ManualOrderItem[];
  createdBy: string | undefined;
  deliveryFee: number;
  manualDiscount: number;
}) {
  const subtotal = input.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = Math.max(0, subtotal - input.manualDiscount + input.deliveryFee);
  const result = manualOrderInputSchema.safeParse({
    ...input,
    subtotal,
    total,
  });
  if (!result.success) throw new Error(result.error.issues[0]?.message || 'Order details are invalid.');
  await insertManualOrder({ ...input, subtotal, total });
}
