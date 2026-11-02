export interface DashboardOrder {
  id: string;
  orderId: string;
  total: number;
  status: string;
  source: string;
  createdAt: number;
  userName: string;
  userPhone: string;
  itemCount: number;
}

export interface DashboardFunnel {
  activeCarts: number;
  convertedCarts: number;
  totalCheckouts: number;
}
