import { z } from 'zod';

const supplierSchema = z.object({
  id: z.string(),
  name: z.string(),
  contact_person: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  city: z.string().nullable(),
});

const productVariantSchema = z.object({
  id: z.string(),
  unit: z.string(),
  price: z.coerce.number(),
});

const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  product_variants: z.array(productVariantSchema).nullable(),
});

const purchaseOrderLineSchema = z.object({
  id: z.string(),
  variant_id: z.string(),
  quantity_ordered: z.coerce.number(),
  quantity_received: z.coerce.number(),
  unit_cost_price: z.coerce.number(),
  total_cost_price: z.coerce.number(),
  product_variants: z.object({
    unit: z.string(),
    products: z.object({ name: z.string() }).nullable(),
  }).nullable(),
});

const purchaseOrderSchema = z.object({
  id: z.string(),
  po_number: z.string(),
  supplier_id: z.string(),
  status: z.string(),
  total_cost: z.coerce.number(),
  invoice_number: z.string().nullable(),
  notes: z.string().nullable(),
  suppliers: z.object({ name: z.string() }).nullable(),
  purchase_order_items: z.array(purchaseOrderLineSchema).nullable(),
});

export const procurementRows = {
  suppliers: z.array(supplierSchema),
  products: z.array(productSchema),
  purchaseOrders: z.array(purchaseOrderSchema),
};

export const createSupplierSchema = z.object({
  name: z.string().trim().min(1, 'Supplier name required'),
  contactPerson: z.string(),
  phone: z.string(),
  email: z.string(),
  city: z.string(),
});

export const createPurchaseOrderSchema = z.object({
  supplierId: z.string().min(1, 'Please select a supplier.'),
  invoiceNumber: z.string(),
  notes: z.string(),
  items: z.array(z.object({
    variantId: z.string().min(1),
    productName: z.string(),
    unit: z.string(),
    qty: z.number().int().positive(),
    costPrice: z.number().finite().min(0),
  })).min(1, 'Please add at least one product item to the PO.'),
});
