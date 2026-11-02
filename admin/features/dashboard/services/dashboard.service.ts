import {
  getStoreOpenStatus,
  listDashboardCartStatuses,
  listDashboardCheckouts,
  listDashboardOrders,
  updateStoreOpenStatus,
} from '../repositories/dashboard.repository';
import type { DashboardFunnel, DashboardOrder } from '../types/dashboard';

export async function getDashboardOrders(): Promise<DashboardOrder[]> {
  const rows = await listDashboardOrders();
  return rows.map((order) => ({
    id: order.id,
    orderId: `RB-${order.order_number || order.id.slice(0, 6).toUpperCase()}`,
    total: Number(order.total || 0),
    status: order.status || 'pending',
    source: order.order_source || 'online_web',
    createdAt: new Date(order.created_at).getTime(),
    userName: order.user_name || order.delivery_address?.name || 'Customer',
    userPhone: order.user_phone || order.delivery_address?.phone || '',
    itemCount: (order.order_items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0),
  }));
}

export async function getDashboardFunnel(): Promise<DashboardFunnel> {
  const [carts, checkouts] = await Promise.all([
    listDashboardCartStatuses(),
    listDashboardCheckouts(),
  ]);
  return {
    activeCarts: carts.filter((cart) => cart.status === 'active').length,
    convertedCarts: carts.filter((cart) => cart.status === 'converted').length,
    totalCheckouts: checkouts.length,
  };
}

export { getStoreOpenStatus, updateStoreOpenStatus };
