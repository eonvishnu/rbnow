"use client";

import { useState, useEffect, useCallback } from 'react';
import { listAdminOrders, listReplacementProducts } from '../services/orders.service';
import type { AdminOrder, ReplacementProduct } from '../types/order';

export function useOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<ReplacementProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const [fetchedOrders, fetchedProducts] = await Promise.all([
        listAdminOrders(),
        listReplacementProducts(),
      ]);
      setOrders(fetchedOrders);
      setProducts(fetchedProducts);
    } catch (err: any) {
      setError(err?.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    products,
    loading,
    refreshing,
    error,
    refetch: () => fetchOrders(true),
    setOrders,
  };
}
