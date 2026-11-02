export interface AdminSupplier {
  id: string;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
}

export interface ProcurementProductVariant {
  id: string;
  unit: string;
  price: number;
}

export interface ProcurementProduct {
  id: string;
  name: string;
  product_variants: ProcurementProductVariant[] | null;
}

export interface PurchaseOrderLine {
  id: string;
  variant_id: string;
  quantity_ordered: number;
  quantity_received: number;
  unit_cost_price: number;
  total_cost_price: number;
  product_variants: {
    unit: string;
    products: { name: string } | null;
  } | null;
}

export interface AdminPurchaseOrder {
  id: string;
  po_number: string;
  supplier_id: string;
  status: string;
  total_cost: number;
  invoice_number: string | null;
  notes: string | null;
  suppliers: { name: string } | null;
  purchase_order_items: PurchaseOrderLine[] | null;
}

export interface PurchaseOrderDraftItem {
  variantId: string;
  productName: string;
  unit: string;
  qty: number;
  costPrice: number;
}
