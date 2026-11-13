import { supabase } from '@/lib/supabase';
import {
  listCustomerOrderSummaries,
  listCustomerProfiles,
  listCustomerProfilesPaginated,
  listOrdersForCustomer,
} from '../repositories/customers.repository';
import type { AdminCustomer } from '../types/customer';

const DAY = 24 * 60 * 60 * 1000;

export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  const [profiles, orders] = await Promise.all([
    listCustomerProfiles(),
    listCustomerOrderSummaries(),
  ]);
  const now = Date.now();

  return profiles.map((profile) => {
    const mine = orders.filter((order) => order.user_id === profile.id);
    const paid = mine.filter((order) =>
      order.status === 'delivered' ||
      order.status === 'confirmed'
    );
    const totalSpent = paid.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const lastOrderDate = paid.length
      ? new Date(Math.max(...paid.map((order) => new Date(order.created_at).getTime())))
      : null;
    const createdAt = profile.created_at ? new Date(profile.created_at) : new Date();

    return {
      id: profile.id,
      displayName: profile.display_name || 'Customer',
      email: profile.email || '',
      phoneNumber: profile.phone_number || '',
      createdAt,
      role: profile.role || 'customer',
      totalSpent,
      orderCount: paid.length,
      lastOrderDate,
      isVip: totalSpent >= 5000,
      isRepeat: paid.length >= 2,
      isNew: now - createdAt.getTime() <= 30 * DAY,
      isAtRisk: lastOrderDate ? now - lastOrderDate.getTime() > 45 * DAY : false,
    };
  });
}

export async function getAdminCustomersPaginated(page: number = 1, pageSize: number = 25, searchQuery: string = '') {
  const { profiles, totalCount } = await listCustomerProfilesPaginated(page, pageSize, searchQuery);

  const userIds = profiles.map(p => p.id);
  let orders: any[] = [];
  if (userIds.length > 0) {
    const { data } = await supabase.from('orders')
      .select('id, user_id, total, status, created_at')
      .in('user_id', userIds);
    if (data) orders = data;
  }

  const now = Date.now();
  const customers = profiles.map((profile) => {
    const mine = orders.filter((order) => order.user_id === profile.id);
    const paid = mine.filter((order) =>
      order.status === 'delivered' ||
      order.status === 'confirmed'
    );
    const totalSpent = paid.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const lastOrderDate = paid.length
      ? new Date(Math.max(...paid.map((order) => new Date(order.created_at).getTime())))
      : null;
    const createdAt = profile.created_at ? new Date(profile.created_at) : new Date();

    return {
      id: profile.id,
      displayName: profile.display_name || 'Customer',
      email: profile.email || '',
      phoneNumber: profile.phone_number || '',
      createdAt,
      role: profile.role || 'customer',
      totalSpent,
      orderCount: paid.length,
      lastOrderDate,
      isVip: totalSpent >= 5000,
      isRepeat: paid.length >= 2,
      isNew: now - createdAt.getTime() <= 30 * DAY,
      isAtRisk: lastOrderDate ? now - lastOrderDate.getTime() > 45 * DAY : false,
    };
  });

  return { customers, totalCount };
}

export function getCustomerOrderHistory(userId: string) {
  return listOrdersForCustomer(userId);
}
