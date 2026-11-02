import { supabase } from '@/lib/supabase';
import { procurementRows } from '../schemas/procurement.schema';
import type {
  AdminPurchaseOrder,
  AdminSupplier,
  ProcurementProduct,
  PurchaseOrderDraftItem,
} from '../types/procurement';

export async function listProcurementWorkspace(): Promise<{
  suppliers: AdminSupplier[];
  purchaseOrders: AdminPurchaseOrder[];
  products: ProcurementProduct[];
}> {
  const [supplierResult, orderResult, productResult] = await Promise.all([
    supabase.from('suppliers').select('*').order('name'),
    supabase.from('purchase_orders').select('*, suppliers(*), purchase_order_items(*, product_variants(*, products(*)))').order('created_at', { ascending: false }),
    supabase.from('products').select('id, name, product_variants(id, unit, price)').order('name'),
  ]);
  if (supplierResult.error) throw supplierResult.error;
  if (orderResult.error) throw orderResult.error;
  if (productResult.error) throw productResult.error;
  return {
    suppliers: procurementRows.suppliers.parse(supplierResult.data),
    purchaseOrders: procurementRows.purchaseOrders.parse(orderResult.data),
    products: procurementRows.products.parse(productResult.data),
  };
}

export async function insertSupplier(input: {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
}) {
  const { error } = await supabase.from('suppliers').insert({
    name: input.name,
    contact_person: input.contactPerson,
    phone: input.phone,
    email: input.email,
    city: input.city,
  });
  if (error) throw error;
}

export async function insertPurchaseOrder(input: {
  poNumber: string;
  supplierId: string;
  invoiceNumber: string;
  notes: string;
  totalCost: number;
  items: PurchaseOrderDraftItem[];
}) {
  const { data, error } = await supabase.from('purchase_orders').insert({
    po_number: input.poNumber,
    supplier_id: input.supplierId,
    status: 'sent',
    total_cost: input.totalCost,
    invoice_number: input.invoiceNumber,
    notes: input.notes,
  }).select('id').single();
  if (error) throw error;

  const { error: itemsError } = await supabase.from('purchase_order_items').insert(input.items.map((item) => ({
    po_id: data.id,
    variant_id: item.variantId,
    quantity_ordered: item.qty,
    quantity_received: 0,
    unit_cost_price: item.costPrice,
    total_cost_price: item.qty * item.costPrice,
  })));
  if (itemsError) throw itemsError;
}

export async function receivePurchaseOrder(order: AdminPurchaseOrder) {
  const { error: orderError } = await supabase.from('purchase_orders')
    .update({ status: 'received', received_at: new Date().toISOString() })
    .eq('id', order.id);
  if (orderError) throw orderError;

  for (const item of order.purchase_order_items || []) {
    const { data: variant, error: variantError } = await supabase.from('product_variants')
      .select('stock')
      .eq('id', item.variant_id)
      .single();
    if (variantError) throw variantError;
    if (!variant) continue;

    const { error: stockError } = await supabase.from('product_variants')
      .update({ stock: (variant.stock || 0) + item.quantity_ordered, is_available: true })
      .eq('id', item.variant_id);
    if (stockError) throw stockError;

    const { error: transactionError } = await supabase.from('inventory_transactions').insert({
      variant_id: item.variant_id,
      transaction_type: 'received',
      quantity: item.quantity_ordered,
      reference_type: 'purchase_order',
      reference_id: order.id,
      notes: `Stock inwarded from ${order.po_number}`,
    });
    if (transactionError) throw transactionError;
  }
}
