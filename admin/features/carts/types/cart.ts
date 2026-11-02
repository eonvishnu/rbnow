export type AdminCartStatus = 'active' | 'abandoned' | 'converted' | string;

export interface AdminCartItem {
  id: string;
  variant_id: string | null;
  product_id: string | null;
  product_name: string;
  variant_unit: string | null;
  unit_price: number;
  quantity: number;
}

export interface AdminCart {
  id: string;
  status: AdminCartStatus;
  created_at: string | null;
  last_activity_at: string | null;
  subtotal: number | null;
  total: number | null;
  cart_items: AdminCartItem[] | null;
  profiles?: { display_name: string | null; email: string | null; phone_number: string | null } | null;
}

export interface ManualCartOrderItem {
  variantId: string | null;
  productId: string | null;
  name: string;
  unit: string;
  price: number;
  qty: number;
}

export interface CartItem {
  id: string;
  product_id?: string;
  name: string;
  price: number;
  unit?: string;
  img?: string | null;
}

export interface CartContextValue {
  cart: CartItem[];
  activeCartId: string | null;
  addToCart: (item: CartItem, availableStock: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  totalAmount: number;
}
