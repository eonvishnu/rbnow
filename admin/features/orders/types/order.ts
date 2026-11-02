export type AdminOrderSource = 'whatsapp' | 'phone' | 'walk_in' | 'admin';
export type ManualOrderPaymentMethod = 'cod' | 'upi' | 'paid';

export interface ManualOrderCustomer {
  name: string;
  phone: string;
  houseNo: string;
  area: string;
  city: string;
  pincode: string;
  source: AdminOrderSource;
  paymentMethod: ManualOrderPaymentMethod;
}

export interface ManualOrderItem {
  variantId: string;
  productId: string;
  name: string;
  unit: string;
  price: number;
  qty: number;
  img: string;
}

export interface ManualOrderProductVariant {
  id: string;
  unit: string;
  price: number;
}

export interface ManualOrderProduct {
  id: string;
  name: string;
  image_url: string | null;
  product_variants: ManualOrderProductVariant[] | null;
}

export interface AdminDeliveryAddress {
  name?: string | null;
  phone?: string | null;
  houseNumber?: string | null;
  address?: string | null;
  city?: string | null;
  pincode?: string | null;
}

export interface AdminOrderItem {
  id: string;
  productId: string | null;
  variantId: string | null;
  name: string;
  qty: number;
  price: number;
  subtotal: number;
  unit: string;
}

export interface AdminOrderItemChange {
  change_type: string;
  reason: string | null;
  old_unit_price: number;
  new_unit_price: number;
  created_at: string;
}

export interface AdminOrder {
  id: string;
  orderId: string;
  createdAt: string | null;
  status: string;
  orderSource: string;
  total: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  shipping: AdminDeliveryAddress | null;
  userPhone: string | null;
  userName: string | null;
  itemChanges: AdminOrderItemChange[];
  items: AdminOrderItem[];
}

export interface ReplacementProduct {
  id: string;
  name: string;
  product_variants: Array<{ id: string; unit: string; price: number }> | null;
}
