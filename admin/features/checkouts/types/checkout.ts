export interface AdminCheckoutItem {
  id: string;
  product_id?: string;
  variant_id?: string;
  product_name: string;
  variant_unit: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface AdminCheckout {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  delivery_address: any;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  grand_total: number;
  currency: string;
  status: string;
  created_at: string;
  checkout_items?: AdminCheckoutItem[];
}
