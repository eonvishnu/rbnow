import {
  insertPurchaseOrder,
  insertSupplier,
  listProcurementWorkspace,
  receivePurchaseOrder,
} from '../repositories/procurement.repository';
import {
  createPurchaseOrderSchema,
  createSupplierSchema,
} from '../schemas/procurement.schema';
import type { AdminPurchaseOrder } from '../types/procurement';

export { listProcurementWorkspace };

export async function createProcurementSupplier(input: {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
}) {
  const result = createSupplierSchema.safeParse(input);
  if (!result.success) throw new Error(result.error.issues[0]?.message || 'Supplier details are invalid.');
  await insertSupplier(result.data);
}

export async function createProcurementOrder(input: {
  supplierId: string;
  invoiceNumber: string;
  notes: string;
  items: Array<{ variantId: string; productName: string; unit: string; qty: number; costPrice: number }>;
}) {
  const result = createPurchaseOrderSchema.safeParse(input);
  if (!result.success) throw new Error(result.error.issues[0]?.message || 'Purchase order details are invalid.');
  const poNumber = `PO-${Date.now().toString().slice(-6)}`;
  const totalCost = result.data.items.reduce((sum, item) => sum + item.qty * item.costPrice, 0);
  await insertPurchaseOrder({
    ...result.data,
    poNumber,
    invoiceNumber: result.data.invoiceNumber || `INV-${poNumber}`,
    totalCost,
  });
}

export async function markPurchaseOrderReceived(order: AdminPurchaseOrder) {
  await receivePurchaseOrder(order);
}
