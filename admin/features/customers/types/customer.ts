export interface AdminCustomer {
  id: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  createdAt: Date;
  role: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate: Date | null;
  isVip: boolean;
  isRepeat: boolean;
  isNew: boolean;
  isAtRisk: boolean;
}

export interface CustomerOrderItem {
  product_name: string;
  variant_unit: string | null;
  quantity: number;
  total_price: number | null;
}

export interface CustomerOrder {
  id: string;
  order_number: string | number | null;
  total: number | null;
  status: string | null;
  created_at: string;
  order_items: CustomerOrderItem[] | null;
}
