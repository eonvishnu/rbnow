
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { splitOrderItem } from '@/lib/fulfillment';
import { OrdersMapView } from '@/components/OrdersMapView';
import { SingleOrderMiniMap } from '@/components/SingleOrderMiniMap';
import {
  Printer, MapPin, Search, X, User, Phone, Box, Plus, RefreshCw,
  History, MessageSquare, PhoneCall, Store, Globe, Loader2,
  ChevronDown, Download, Copy, Check, CalendarClock, List,
  Map as MapIcon, AlertCircle, PackageCheck,
} from 'lucide-react';
import {
  changeAdminOrderStatus,
  listAdminOrders,
  listReplacementProducts,
  swapAdminOrderItem,
} from '@/features/orders/services/orders.service';
import type {
  AdminOrder,
  AdminOrderItem,
  ReplacementProduct,
} from '@/features/orders/types/order';

const DAY = 86400000;
const PAGE_SIZE = 25;

const STATUSES = [
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready_for_delivery', label: 'Ready for delivery' },
  { value: 'out_for_delivery', label: 'Out for delivery' },
  { value: 'partially_fulfilled', label: 'Partially fulfilled' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const STATUS_TONE: Record<string, string> = {
  pending_payment: 'bg-[#fed1d7] text-[#8e0b21]',
  confirmed: 'bg-[#dcefe7] text-[#005b43]',
  processing: 'bg-[#e7e9ff] text-[#373b83]',
  preparing: 'bg-[#fff0d6] text-[#795000]',
  ready_for_delivery: 'bg-[#d9f1ee] text-[#075e57]',
  out_for_delivery: 'bg-[#d9efff] text-[#07517b]',
  partially_fulfilled: 'bg-[#d9efff] text-[#07517b]',
  delivered: 'bg-[#cdfed4] text-[#014b40]',
  cancelled: 'bg-[#fed1d7] text-[#8e0b21]',
};

const RANGES = [
  { value: 'all', label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: '7d', label: 'Last 7 days' },
  { value: '14d', label: 'Last 14 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'this_month', label: 'This month' },
  { value: 'last_month', label: 'Last month' },
];

const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'high', label: 'Highest total' },
  { value: 'low', label: 'Lowest total' },
  { value: 'delivery_soon', label: 'Delivery date (earliest)' },
  { value: 'promised_soon', label: 'Promised date (earliest)' },
];

const SOURCE_META: Record<string, { label: string; icon: React.ReactNode }> = {
  online_web: { label: 'Online store', icon: <Globe size={12} /> },
  whatsapp: { label: 'WhatsApp', icon: <MessageSquare size={12} /> },
  phone: { label: 'Phone', icon: <PhoneCall size={12} /> },
  walk_in: { label: 'Walk-in', icon: <Store size={12} /> },
};

const pretty = (s: string) =>
  String(s || '').replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

const sourceLabel = (s: string) =>
  SOURCE_META[s]?.label ?? pretty(s || 'online_web');

const sourceIcon = (s: string) =>
  SOURCE_META[s]?.icon ?? <Globe size={12} />;

const paymentStatusValue = (s?: string | null) =>
  String(s || 'unverified').toLowerCase();

const paymentStatusLabel = (s?: string | null) => {
  const v = paymentStatusValue(s);

  if (['captured', 'success', 'paid'].includes(v)) return 'Paid / Captured';
  if (['pending', 'authorized', 'created'].includes(v)) return 'Pending';
  if (v === 'failed') return 'Failed';
  if (v === 'refunded') return 'Refunded';
  if (v === 'partially_refunded') return 'Partially refunded';
  if (v === 'unverified') return 'Unverified';

  return pretty(v);
};

const paymentStatusTone = (s?: string | null) => {
  const v = paymentStatusValue(s);

  if (['captured', 'success', 'paid'].includes(v)) {
    return 'bg-[#cdfed4] text-[#014b40]';
  }

  if (['pending', 'authorized', 'created'].includes(v)) {
    return 'bg-[#fff0d6] text-[#795000]';
  }

  if (v === 'refunded') return 'bg-[#e7e9ff] text-[#373b83]';

  if (v === 'unverified') return 'bg-[#eeeeee] text-[#555555]';

  return 'bg-[#fed1d7] text-[#8e0b21]';
};

const FULFILL = [
  { value: 'pending', label: 'To pack' },
  { value: 'packed', label: 'Packed' },
  { value: 'backordered', label: 'Awaiting stock' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'unavailable', label: 'Unavailable' },
];

const FULFILL_TONE: Record<string, string> = {
  pending: 'bg-[#eeeeee] text-[#444444]',
  packed: 'bg-[#d9efff] text-[#07517b]',
  backordered: 'bg-[#fff0d6] text-[#795000]',
  delivered: 'bg-[#cdfed4] text-[#014b40]',
  unavailable: 'bg-[#fed1d7] text-[#8e0b21]',
};

const fmtDay = (d?: string | null) =>
  d
    ? new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })
    : '—';

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

type ItemExtra = {
  fulfillment_status: string;
  promised_date: string | null;
  fulfillment_note: string | null;
};

const fetchAll = async (build: (from: number, to: number) => any) => {
  let all: any[] = [];

  for (let from = 0; ; from += 1000) {
    const { data, error } = await build(from, from + 999);
    if (error) throw error;

    all = all.concat(data || []);
    if (!data || data.length < 1000) break;
  }

  return all;
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

const fmtDate = (d: any) =>
  d
    ? new Date(d).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : '—';

const startOfDay = (t: number) => {
  const d = new Date(t);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
};

const toIndianPhone = (raw: string) => {
  const digits = String(raw || '').replace(/\D/g, '');
  const ten = digits.length >= 10 ? digits.slice(-10) : '';
  return /^[6-9]\d{9}$/.test(ten) ? ten : null;
};

const esc = (v: any) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c] as string));

const csvSafe = (value: any) => {
  let text = String(value ?? '');

  // Prevent spreadsheet formula execution.
  if (/^[\s]*[=+\-@]/.test(text) || /^[\t\r]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
};

const inputCls =
  'w-full min-h-11 sm:min-h-9 py-2 px-3 text-base sm:text-[13px] text-[#1a1a1a] placeholder:text-[#8a8a8a] bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.14)] outline-none focus:shadow-[0_0_0_2px_#006B50] transition-shadow';

const OPERATIONAL_STATUSES = new Set(STATUSES.map((s) => s.value));

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<ReplacementProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [tab, setTab] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [range, setRange] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [pageSize, setPageSize] = useState(25);
  const [visible, setVisible] = useState(25);

  const [columnVisibility, setColumnVisibility] = useState({
    orderId: true,
    customer: true,
    payment: true,
    status: true,
    itemsCount: true,
    total: true,
  });
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [savedViews, setSavedViews] = useState<Array<{ name: string; filter: any }>>([]);
  const [adminTags, setAdminTags] = useState<Record<string, string[]>>({});

  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [fulfillmentReady, setFulfillmentReady] = useState(false);
  const [fulfillmentError, setFulfillmentError] = useState(false);
  const [batches, setBatches] = useState<any[]>([]);
  const [orderExtras, setOrderExtras] = useState<
    Record<string, { batch_id: string | null; delivery_date: string | null }>
  >({});
  const [itemExtras, setItemExtras] = useState<Record<string, ItemExtra>>({});
  const [batchFilter, setBatchFilter] = useState('all');

  const [rescheduling, setRescheduling] = useState<{
    itemId: string;
    date: string;
    note: string;
  } | null>(null);

  const [savingItemId, setSavingItemId] = useState<string | null>(null);

  const [splitting, setSplitting] = useState<{
    itemId: string;
    keep: string;
    mode: 'stock' | 'date';
    date: string;
  } | null>(null);

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const [replacingItemId, setReplacingItemId] = useState<string | null>(null);
  const [replacementSearch, setReplacementSearch] = useState('');
  const [selectedReplacementVariant, setSelectedReplacementVariant] = useState('');
  const [replaceReason, setReplaceReason] = useState(
    'Product unavailable - replaced with customer consent'
  );
  const [isSwapping, setIsSwapping] = useState(false);

  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

  const flash = useCallback((type: 'error' | 'success', text: string) => {
    setToast({ type, text });
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  const customerName = (o: AdminOrder) =>
    o.shipping?.name || o.userName || 'Customer';

  const itemStatus = (i: AdminOrderItem) =>
    itemExtras[i.id]?.fulfillment_status || 'pending';

  const orderDelivery = (o: AdminOrder) =>
    orderExtras[o.id]?.delivery_date || null;

  const itemDate = (o: AdminOrder, i: AdminOrderItem) =>
    itemExtras[i.id]?.promised_date || orderDelivery(o);

  const batchName = (o: AdminOrder) =>
    batches.find((b) => b.id === orderExtras[o.id]?.batch_id)?.name || null;

  const load = async (silent = false) => {
    if (silent) setRefreshing(true);

    try {
      const orderRows = await listAdminOrders();
      setOrders(orderRows);

      // Replacement catalog is independent from loading the order workspace.
      try {
        const productRows = await listReplacementProducts();
        setProducts(productRows);
      } catch (error) {
        console.error('Could not load replacement products:', error);
        setProducts([]);
      }

      try {
        const [bRes, oRows, iRows] = await Promise.all([
          supabase
            .from('order_batches')
            .select('id, name, delivery_date, status')
            .order('delivery_date', { ascending: false })
            .limit(60),

          fetchAll((f, t) =>
            supabase
              .from('orders')
              .select('id, batch_id, delivery_date')
              .or('batch_id.not.is.null,delivery_date.not.is.null')
              .range(f, t)
          ),

          fetchAll((f, t) =>
            supabase
              .from('order_items')
              .select('id, fulfillment_status, promised_date, fulfillment_note')
              .or('fulfillment_status.neq.pending,promised_date.not.is.null')
              .range(f, t)
          ),
        ]);

        if (bRes.error) throw bRes.error;

        setBatches(bRes.data || []);

        setOrderExtras(
          Object.fromEntries(
            oRows.map((r) => [
              r.id,
              {
                batch_id: r.batch_id,
                delivery_date: r.delivery_date,
              },
            ])
          )
        );

        setItemExtras(
          Object.fromEntries(
            iRows.map((r) => [
              r.id,
              {
                fulfillment_status: r.fulfillment_status,
                promised_date: r.promised_date,
                fulfillment_note: r.fulfillment_note,
              },
            ])
          )
        );

        setFulfillmentReady(true);
        setFulfillmentError(false);
      } catch (error) {
        console.error('Could not load fulfillment information:', error);
        setFulfillmentReady(false);
        setFulfillmentError(true);
      }
    } catch (error) {
      console.error('Failed to load orders workspace:', error);
      flash('error', 'Could not load orders. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();

    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const bq = params.get('batch');

    if (q) setSearchQuery(q);
    if (bq) setBatchFilter(bq);
  }, []);

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId) || null,
    [orders, selectedOrderId]
  );

  // Drawer keyboard handling and body scroll locking.
  useEffect(() => {
    if (!selectedOrderId) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSwapping) {
        setSelectedOrderId(null);
      }
    };

    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [selectedOrderId, isSwapping]);

  useEffect(() => {
    setReplacingItemId(null);
    setReplacementSearch('');
    setRescheduling(null);
    setSplitting(null);
  }, [selectedOrderId]);

  // ---------- Filtering ----------

  const paymentStatuses = useMemo(
    () =>
      Array.from(
        new Set(
          orders
            .filter((o) => o.status !== 'pending_payment')
            .map((o) => paymentStatusValue(o.paymentStatus))
        )
      ),
    [orders]
  );

  const base = useMemo(() => {
    const now = Date.now();
    const today0 = startOfDay(now);

    const from =
      range === 'today'
        ? today0
        : range === '7d'
          ? today0 - 6 * DAY
          : range === '30d'
            ? today0 - 29 * DAY
            : 0;

    const q = searchQuery.trim().toLowerCase();

    return orders.filter((o) => {
      // Payment reconciliation records are not operational orders.
      if (o.status === 'pending_payment') return false;

      if (from && (!o.createdAt || new Date(o.createdAt).getTime() < from)) {
        return false;
      }

      if (
        paymentStatusFilter !== 'all' &&
        paymentStatusValue(o.paymentStatus) !== paymentStatusFilter
      ) {
        return false;
      }

      if (batchFilter !== 'all') {
        const bid = orderExtras[o.id]?.batch_id ?? null;

        if (batchFilter === 'none' ? bid : bid !== batchFilter) {
          return false;
        }
      }

      if (!q) return true;

      return (
        String(o.orderId || '').toLowerCase().includes(q) ||
        String(o.userName || '').toLowerCase().includes(q) ||
        String(o.shipping?.name || '').toLowerCase().includes(q) ||
        String(o.shipping?.phone || o.userPhone || '').includes(q)
      );
    });
  }, [
    orders,
    range,
    paymentStatusFilter,
    searchQuery,
    batchFilter,
    orderExtras,
  ]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: base.length };

    STATUSES.forEach((s) => {
      c[s.value] = 0;
    });

    base.forEach((o) => {
      c[o.status] = (c[o.status] || 0) + 1;
    });

    return c;
  }, [base]);

  const filtered = useMemo(() => {
    const list =
      tab === 'all' ? base : base.filter((o) => o.status === tab);

    const timestamp = (o: AdminOrder) =>
      o.createdAt ? new Date(o.createdAt).getTime() : 0;

    return [...list].sort((a, b) =>
      sort === 'oldest'
        ? timestamp(a) - timestamp(b)
        : sort === 'high'
          ? Number(b.total) - Number(a.total)
          : sort === 'low'
            ? Number(a.total) - Number(b.total)
            : timestamp(b) - timestamp(a)
    );
  }, [base, tab, sort]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
    setSelected(new Set());
  }, [tab, searchQuery, range, paymentStatusFilter, sort, batchFilter]);

  const stats = useMemo(() => {
    const live = base.filter((o) => o.status !== 'cancelled');

    const activeStatuses = [
      'confirmed',
      'processing',
      'preparing',
      'ready_for_delivery',
      'out_for_delivery',
      'partially_fulfilled',
    ];

    return {
      orders: base.length,
      orderValue: live.reduce(
        (sum, o) => sum + (Number(o.total) || 0),
        0
      ),
      awaiting: base.filter((o) => activeStatuses.includes(o.status)).length,
      delivered: base.filter((o) => o.status === 'delivered').length,
    };
  }, [base]);

  const shown = filtered.slice(0, visible);

  const allShownSelected =
    shown.length > 0 && shown.every((o) => selected.has(o.id));

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(
      allShownSelected
        ? new Set()
        : new Set(shown.map((o) => o.id))
    );
  };

  // ---------- Status changes ----------

  const setLocalStatus = (id: string, status: string) =>
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );

  const handleStatusChange = async (
    order: AdminOrder,
    newStatus: string
  ) => {
    if (newStatus === order.status) return;

    if (!OPERATIONAL_STATUSES.has(newStatus)) {
      flash('error', 'That status is not available in the operational workspace.');
      return;
    }

    if (
      newStatus === 'delivered' &&
      fulfillmentReady &&
      order.items.some((item) => itemStatus(item) !== 'delivered')
    ) {
      flash(
        'error',
        'Every item must be marked delivered before the order can be completed. Unavailable items must be resolved separately.'
      );
      return;
    }

    if (
      newStatus === 'cancelled' &&
      !confirm(`Cancel order #${order.orderId}?`)
    ) {
      return;
    }

    const previousStatus = order.status;

    setUpdatingStatusId(order.id);
    setLocalStatus(order.id, newStatus);

    try {
      await changeAdminOrderStatus(order.id, newStatus);

      flash(
        'success',
        `Order #${order.orderId} marked ${pretty(newStatus).toLowerCase()}`
      );
    } catch (error) {
      console.error('Failed to update status:', error);
      setLocalStatus(order.id, previousStatus);
      flash('error', 'Failed to update order status.');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // ---------- Item replacement ----------

  const replacementOptions = useMemo(() => {
    const q = replacementSearch.trim().toLowerCase();

    return products
      .map((p) => ({
        ...p,
        product_variants: p.product_variants || [],
      }))
      .filter(
        (p) =>
          p.product_variants.length > 0 &&
          (!q || String(p.name).toLowerCase().includes(q))
      );
  }, [products, replacementSearch]);

  useEffect(() => {
    const flat = replacementOptions.flatMap((p) =>
      p.product_variants.map((v) => v.id)
    );

    if (!flat.includes(selectedReplacementVariant)) {
      setSelectedReplacementVariant(flat[0] || '');
    }
  }, [replacementOptions, selectedReplacementVariant]);

  const handleExecuteSwapItem = async (oldItem: AdminOrderItem) => {
    if (!selectedOrder) return;

    if (
      ['delivered', 'unavailable'].includes(itemStatus(oldItem)) ||
      ['delivered', 'cancelled'].includes(selectedOrder.status)
    ) {
      return flash(
        'error',
        'This item can no longer be replaced from the Orders workspace.'
      );
    }

    if (!selectedReplacementVariant) {
      return flash('error', 'Select a replacement variant.');
    }

    setIsSwapping(true);

    try {
      await swapAdminOrderItem({
        order: selectedOrder,
        item: oldItem,
        replacementVariantId: selectedReplacementVariant,
        reason: replaceReason,
      });

      flash('success', 'Item replaced');
      setReplacingItemId(null);
      await load(true);
    } catch (error) {
      console.error(error);

      flash(
        'error',
        error instanceof Error
          ? error.message
          : 'Item replacement failed'
      );
    } finally {
      setIsSwapping(false);
    }
  };

  // ---------- Export ----------

  const exportCsv = () => {
    const rows = [
      [
        'Order',
        'Date',
        'Delivery date',
        'Customer',
        'Phone',
        'Source',
        'Payment status',
        'Status',
        'Items',
        'Order total',
      ],

      ...filtered.map((o) => [
        `#${o.orderId}`,
        o.createdAt ? new Date(o.createdAt).toISOString() : '',
        orderExtras[o.id]?.delivery_date || '',
        o.shipping?.name || o.userName || '',
        o.shipping?.phone || o.userPhone || '',
        sourceLabel(String(o.orderSource)),
        paymentStatusLabel(o.paymentStatus),
        o.items.length,
        pretty(o.status),
        o.total,
      ]),
    ];

    const blob = new Blob(
      [
        '\uFEFF' +
          rows.map((r) => r.map(csvSafe).join(',')).join('\r\n'),
      ],
      { type: 'text/csv;charset=utf-8;' }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // ---------- Printing ----------

  const invoiceHtml = (o: AdminOrder) => {
    const subtotal =
      Number(o.subtotal) ||
      o.items.reduce((s, i) => s + (Number(i.subtotal) || 0), 0);

    const deliveryFee = Number(o.deliveryFee || 0);
    const discount = Number(o.discount || 0);
    const total = Number(o.total || 0);

    const address = [
      o.shipping?.houseNumber ||
        (o.shipping as any)?.houseNo,
      o.shipping?.address,
      [o.shipping?.city, o.shipping?.pincode]
        .filter(Boolean)
        .join(' - '),
    ]
      .filter(Boolean)
      .join(', ');

    return `
      <section class="page">
        <header class="header">
          <div class="brand">ROYAL BENGAL</div>
          <div class="subtitle">Fresh from Bengal. Delivered with care.</div>
          <div class="invoice-title">ORDER #${esc(o.orderId)}</div>
        </header>

        <div class="meta-grid">
          <div class="box">
            <div class="box-title">Order information</div>
            <div class="box-text">
              Date: ${esc(fmtDate(o.createdAt))}<br/>
              Status: <strong>${esc(pretty(o.status))}</strong><br/>
              Channel: ${esc(sourceLabel(String(o.orderSource)))}<br/>
              Payment: ${esc(paymentStatusLabel(o.paymentStatus))}
            </div>
          </div>

          <div class="box">
            <div class="box-title">Delivery customer</div>
            <div class="box-text">
              <strong>${esc(customerName(o))}</strong><br/>
              Phone: ${esc(o.shipping?.phone || o.userPhone || '—')}<br/>
              ${esc(address || 'No address on file')}
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item description</th>
              <th>Unit</th>
              <th class="r">Qty</th>
              <th class="r">Unit price</th>
              <th class="r">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${o.items
              .map(
                (i) => `
                  <tr>
                    <td><strong>${esc(i.name)}</strong></td>
                    <td>${esc(i.unit)}</td>
                    <td class="r">${esc(i.qty)}</td>
                    <td class="r">₹${esc(i.price)}</td>
                    <td class="r"><strong>₹${esc(i.subtotal)}</strong></td>
                  </tr>
                `
              )
              .join('')}
          </tbody>
        </table>

        <table class="totals-table">
          <tr>
            <td>Items subtotal:</td>
            <td class="r">₹${esc(subtotal)}</td>
          </tr>

          ${
            discount > 0
              ? `<tr><td>Discount:</td><td class="r">- ₹${esc(discount)}</td></tr>`
              : ''
          }

          <tr>
            <td>Delivery fee:</td>
            <td class="r">${deliveryFee === 0 ? 'FREE' : `₹${esc(deliveryFee)}`}</td>
          </tr>

          <tr class="grand-tot">
            <td>ORDER TOTAL:</td>
            <td class="r">₹${esc(total)}</td>
          </tr>
        </table>

        <footer class="footer">
          Payment status: ${esc(paymentStatusLabel(o.paymentStatus))}<br/>
          Thank you for choosing Royal Bengal.
        </footer>
      </section>
    `;
  };

  const printDocument = (selectedOrders: AdminOrder[], title: string) => {
    const w = window.open('', '_blank', 'width=900,height=950');

    if (!w) {
      flash('error', 'Allow pop-ups to print.');
      return;
    }

    w.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${esc(title)}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              color: #17211d;
              padding: 24px;
              max-width: 800px;
              margin: auto;
              background: #fff;
            }
            .page { margin-bottom: 40px; }
            .page:not(:last-child) {
              page-break-after: always;
              break-after: page;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #006b50;
              padding-bottom: 16px;
              margin-bottom: 20px;
            }
            .brand {
              font-family: Georgia, serif;
              font-size: 25px;
              font-weight: 900;
              color: #006b50;
              letter-spacing: 2px;
            }
            .subtitle {
              font-size: 10px;
              font-weight: 700;
              color: #a27a12;
              text-transform: uppercase;
              letter-spacing: 1.3px;
              margin-top: 4px;
            }
            .invoice-title {
              font-size: 13px;
              font-weight: 800;
              margin-top: 12px;
              background: #e5f5ef;
              display: inline-block;
              padding: 6px 16px;
              border-radius: 8px;
            }
            .meta-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
              margin-bottom: 20px;
              font-size: 12px;
            }
            .box {
              background: #fafafa;
              border: 1px solid #e3eae6;
              border-radius: 12px;
              padding: 14px;
              overflow-wrap: anywhere;
            }
            .box-title {
              font-size: 10px;
              font-weight: 800;
              color: #75817b;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 6px;
            }
            .box-text {
              color: #17211d;
              font-size: 12px;
              line-height: 1.6;
              font-weight: 600;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 16px;
              font-size: 12px;
            }
            th {
              background: #006b50;
              color: #fff;
              font-weight: 700;
              text-transform: uppercase;
              font-size: 10px;
              letter-spacing: 1px;
              padding: 10px 12px;
              text-align: left;
            }
            td {
              padding: 10px 12px;
              border-bottom: 1px solid #e3eae6;
              font-size: 12px;
            }
            .r { text-align: right; }
            .totals-table {
              width: 280px;
              margin-left: auto;
              margin-top: 16px;
            }
            .totals-table td {
              padding: 5px 8px;
              border-bottom: none;
            }
            .totals-table .grand-tot {
              font-size: 15px;
              font-weight: 900;
              color: #006b50;
              border-top: 2px solid #006b50;
            }
            .footer {
              margin-top: 36px;
              padding-top: 16px;
              border-top: 1px solid #e3eae6;
              text-align: center;
              font-size: 10px;
              color: #75817b;
              line-height: 1.7;
            }
            @media print {
              body { padding: 0; }
              .page { margin: 0; }
            }
            @media (max-width: 540px) {
              .meta-grid { grid-template-columns: 1fr; }
              body { padding: 12px; }
              th, td { padding: 7px 5px; }
            }
          </style>
        </head>
        <body>
          ${selectedOrders.map(invoiceHtml).join('')}
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    w.document.close();
  };

  const printOrder = (o: AdminOrder) =>
    printDocument([o], `Royal Bengal Order #${o.orderId}`);

  const handleBulkPrint = () => {
    const selectedOrdersList = orders.filter(
      (o) => selected.has(o.id) && o.status !== 'pending_payment'
    );

    if (!selectedOrdersList.length) return;

    printDocument(
      selectedOrdersList,
      `Royal Bengal Orders (${selectedOrdersList.length})`
    );
  };

  const copyAddress = async (o: AdminOrder) => {
    const text = [
      o.shipping?.name || o.userName,
      o.shipping?.phone || o.userPhone,
      [
        o.shipping?.houseNumber ||
          (o.shipping as any)?.houseNo,
        o.shipping?.address,
      ]
        .filter(Boolean)
        .join(', '),
      [o.shipping?.city, o.shipping?.pincode]
        .filter(Boolean)
        .join(' - '),
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      flash('error', 'Could not copy the address.');
    }
  };

  // ---------- Fulfillment ----------

  const orderFlags = (o: AdminOrder) => {
    const od = orderDelivery(o);

    let late = false;
    let unavailable = false;
    let backordered = false;
    let delivered = 0;
    let open = 0;

    o.items.forEach((i) => {
      const st = itemStatus(i);

      if (st === 'backordered') backordered = true;
      if (st === 'unavailable') unavailable = true;

      if (st === 'delivered') delivered++;
      else if (st !== 'unavailable') open++;

      const pd = itemExtras[i.id]?.promised_date;

      if (pd && od && pd > od) late = true;
    });

    return {
      late,
      unavailable,
      backordered,
      partial: delivered > 0 && (open > 0 || unavailable),
    };
  };

  const renderFlags = (o: AdminOrder) => {
    if (!fulfillmentReady || o.status === 'cancelled') return null;

    const f = orderFlags(o);

    return (
      <>
        {f.partial && (
          <Pill tone="bg-[#d9efff] text-[#07517b]">Partial</Pill>
        )}
        {f.backordered && (
          <Pill tone="bg-[#fff0d6] text-[#795000]">
            Awaiting stock
          </Pill>
        )}
        {f.late && !f.backordered && (
          <Pill tone="bg-[#fff0d6] text-[#795000]">Late items</Pill>
        )}
        {f.unavailable && (
          <Pill tone="bg-[#fed1d7] text-[#8e0b21]">
            Unavailable
          </Pill>
        )}
      </>
    );
  };

  const updateItem = async (
    item: AdminOrderItem,
    patch: Partial<ItemExtra>
  ) => {
    const previous: ItemExtra = itemExtras[item.id] || {
      fulfillment_status: 'pending',
      promised_date: null,
      fulfillment_note: null,
    };

    setSavingItemId(item.id);

    setItemExtras((p) => ({
      ...p,
      [item.id]: { ...previous, ...patch },
    }));

    const { error } = await supabase
      .from('order_items')
      .update(patch)
      .eq('id', item.id);

    setSavingItemId(null);

    if (error) {
      console.error(error);

      setItemExtras((p) => ({
        ...p,
        [item.id]: previous,
      }));

      flash('error', 'Could not update the item.');
      return false;
    }

    return true;
  };

  const changeItemStatus = async (
    o: AdminOrder,
    item: AdminOrderItem,
    status: string
  ) => {
    const ok = await updateItem(item, {
      fulfillment_status: status,
    });

    if (!ok || status !== 'delivered') return;

    const everyoneDelivered = o.items.every((i) =>
      i.id === item.id
        ? status === 'delivered'
        : itemStatus(i) === 'delivered'
    );

    if (
      everyoneDelivered &&
      o.status !== 'delivered' &&
      o.status !== 'cancelled' &&
      confirm(
        'Every item is now marked delivered. Mark the whole order as delivered?'
      )
    ) {
      handleStatusChange(o, 'delivered');
    }
  };

  const saveReschedule = async (
    o: AdminOrder,
    item: AdminOrderItem
  ) => {
    if (!rescheduling) return;

    if (!rescheduling.date) {
      return flash('error', 'Pick a delivery date.');
    }

    if (rescheduling.date < todayStr()) {
      return flash('error', 'Pick today or a future date.');
    }

    const od = orderDelivery(o);

    const ok = await updateItem(item, {
      promised_date:
        rescheduling.date === od ? null : rescheduling.date,
      fulfillment_note: rescheduling.note.trim() || null,
      ...(itemStatus(item) === 'backordered'
        ? { fulfillment_status: 'pending' }
        : {}),
    });

    if (ok) {
      setRescheduling(null);
      flash(
        'success',
        `${item.name} moved to ${fmtDay(rescheduling.date)}`
      );
    }
  };

  const saveSplit = async (item: AdminOrderItem) => {
    if (!splitting) return;

    const keep = Number(splitting.keep);
    const total = Number(item.qty);

    if (!(keep > 0 && keep < total)) {
      return flash(
        'error',
        `Enter a quantity above 0 and below ${total}.`
      );
    }

    if (
      splitting.mode === 'date' &&
      (!splitting.date || splitting.date < todayStr())
    ) {
      return flash(
        'error',
        'Pick today or a future date for the remaining quantity.'
      );
    }

    setSavingItemId(item.id);

    const res = await splitOrderItem(item.id, keep, {
      status:
        splitting.mode === 'stock' ? 'backordered' : 'pending',
      promised_date:
        splitting.mode === 'date' ? splitting.date : null,
      note:
        splitting.mode === 'stock'
          ? 'Waiting for stock'
          : `Rest delivered ${fmtDay(splitting.date)}`,
    });

    setSavingItemId(null);

    if (!res.ok) {
      return flash('error', res.message);
    }

    setSplitting(null);
    flash('success', 'Item split. The remaining quantity is tracked separately.');

    await load(true);
  };

  const upcomingBatches = (after: string | null) =>
    batches
      .filter(
        (b) =>
          b.status === 'active' &&
          b.delivery_date >= todayStr() &&
          (!after || b.delivery_date > after)
      )
      .sort((a, b) =>
        a.delivery_date.localeCompare(b.delivery_date)
      )
      .slice(0, 3);

  const renderFulfillment = (
    o: AdminOrder,
    item: AdminOrderItem
  ) => {
    if (!fulfillmentReady) return null;

    const st = itemStatus(item);
    const od = orderDelivery(o);
    const d = itemDate(o, item);
    const pd = itemExtras[item.id]?.promised_date;
    const late = !!(pd && od && pd > od);
    const note = itemExtras[item.id]?.fulfillment_note;
    const locked = o.status === 'cancelled';
    const busy = savingItemId === item.id;
    const editing = rescheduling?.itemId === item.id;
    const splitEditing = splitting?.itemId === item.id;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative inline-block">
            <select
              value={st}
              disabled={busy || locked}
              onChange={(e) =>
                changeItemStatus(o, item, e.target.value)
              }
              aria-label={`Fulfillment status for ${item.name}`}
              className={`appearance-none cursor-pointer outline-none min-h-9 pl-2.5 pr-7 rounded-full text-xs font-semibold disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[#006B50] ${
                FULFILL_TONE[st] || FULFILL_TONE.pending
              }`}
            >
              {FULFILL.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            {busy ? (
              <Loader2
                size={12}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin pointer-events-none"
              />
            ) : (
              <ChevronDown
                size={12}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-70"
              />
            )}
          </div>

          {late && (
            <Pill tone="bg-[#fff0d6] text-[#795000]">
              Late · {fmtDay(d)}
            </Pill>
          )}

          {!locked &&
            st !== 'delivered' &&
            st !== 'unavailable' &&
            !editing &&
            !splitEditing && (
              <button
                type="button"
                onClick={() =>
                  setRescheduling({
                    itemId: item.id,
                    date: pd || '',
                    note: note || '',
                  })
                }
                className="text-sm sm:text-[13px] text-[#006B50] hover:underline inline-flex items-center gap-1 min-h-9"
              >
                <CalendarClock size={13} />
                Reschedule
              </button>
            )}

          {!locked &&
            st !== 'delivered' &&
            st !== 'unavailable' &&
            !editing &&
            !splitEditing &&
            Number(item.qty) > 1 && (
              <button
                type="button"
                onClick={() =>
                  setSplitting({
                    itemId: item.id,
                    keep: '',
                    mode: 'stock',
                    date: '',
                  })
                }
                className="text-sm sm:text-[13px] text-[#006B50] hover:underline min-h-9"
              >
                Short supply
              </button>
            )}
        </div>

        {note && !editing && (
          <p className="text-xs text-[#616161]">{note}</p>
        )}

        {st === 'unavailable' && (
          <p className="text-xs text-[#8e0b21]">
            This item could not be supplied. Review the order total and
            arrange an appropriate customer resolution if payment was
            already collected.
          </p>
        )}

        {splitEditing && splitting && (
          <div className="rounded-xl border border-[#e5e5e5] bg-[#f8faf9] p-3 space-y-2.5">
            <p className="text-sm font-semibold text-[#1a1a1a]">
              Short supply · ordered {item.qty}
            </p>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-[#303030]">
                How many can you supply now?
              </span>

              <input
                inputMode="decimal"
                value={splitting.keep}
                onChange={(e) =>
                  setSplitting({
                    ...splitting,
                    keep: e.target.value,
                  })
                }
                placeholder={`1 to ${Number(item.qty) - 1}`}
                className={inputCls}
              />
            </label>

            <div className="space-y-1.5">
              <p className="text-sm font-medium text-[#303030]">
                The remaining quantity
              </p>

              <div className="flex gap-1.5 flex-wrap">
                {(
                  [
                    ['stock', 'Wait for stock'],
                    ['date', 'Deliver on a date'],
                  ] as ['stock' | 'date', string][]
                ).map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() =>
                      setSplitting({ ...splitting, mode })
                    }
                    className={`min-h-9 px-3 rounded-lg text-xs font-semibold ${
                      splitting.mode === mode
                        ? 'bg-[#006B50] text-white'
                        : 'bg-white text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {splitting.mode === 'date' && (
                <input
                  type="date"
                  min={todayStr()}
                  value={splitting.date}
                  onChange={(e) =>
                    setSplitting({
                      ...splitting,
                      date: e.target.value,
                    })
                  }
                  className={inputCls}
                />
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => saveSplit(item)}
                disabled={busy}
                className="flex-1 min-h-10 rounded-lg bg-[#006B50] hover:bg-[#00543f] text-sm font-semibold text-white disabled:opacity-50"
              >
                Split item
              </button>

              <button
                type="button"
                onClick={() => setSplitting(null)}
                className="min-h-10 px-3 rounded-lg bg-white text-sm font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {editing && rescheduling && (
          <div className="rounded-xl border border-[#e5e5e5] bg-[#f8faf9] p-3 space-y-2.5">
            <p className="text-sm font-semibold text-[#1a1a1a]">
              Deliver this item on
            </p>

            <div className="flex flex-wrap gap-1.5">
              {upcomingBatches(
                od && od > todayStr() ? od : todayStr()
              ).map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() =>
                    setRescheduling({
                      ...rescheduling,
                      date: b.delivery_date,
                    })
                  }
                  className={`min-h-9 px-3 rounded-lg text-xs font-semibold ${
                    rescheduling.date === b.delivery_date
                      ? 'bg-[#006B50] text-white'
                      : 'bg-white text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]'
                  }`}
                >
                  {b.name} · {fmtDay(b.delivery_date)}
                </button>
              ))}
            </div>

            <input
              type="date"
              min={todayStr()}
              value={rescheduling.date}
              onChange={(e) =>
                setRescheduling({
                  ...rescheduling,
                  date: e.target.value,
                })
              }
              className={inputCls}
            />

            <input
              value={rescheduling.note}
              onChange={(e) =>
                setRescheduling({
                  ...rescheduling,
                  note: e.target.value,
                })
              }
              placeholder="Note (e.g. Fresh stock arrives Monday)"
              className={inputCls}
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => saveReschedule(o, item)}
                disabled={busy}
                className="flex-1 min-h-10 rounded-lg bg-[#006B50] hover:bg-[#00543f] text-sm font-semibold text-white disabled:opacity-50"
              >
                Save date
              </button>

              <button
                type="button"
                onClick={() => setRescheduling(null)}
                className="min-h-10 px-3 rounded-lg bg-white text-sm font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const sortedItems = selectedOrder
    ? [...selectedOrder.items].sort((a, b) =>
        String(itemDate(selectedOrder, a) || '').localeCompare(
          String(itemDate(selectedOrder, b) || '')
        )
      )
    : [];

  const multiDates = selectedOrder
    ? new Set(
        selectedOrder.items.map(
          (i) => itemDate(selectedOrder, i) || ''
        )
      ).size > 1
    : false;

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[#17211d]">
            Orders
          </h1>
          <p className="text-xs text-[#75817b] mt-1">
            Manage customer orders, delivery and fulfilment.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div
            className="bg-white p-1 rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.12)] flex items-center"
            aria-label="Orders view"
          >
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-pressed={viewMode === 'list'}
              className={`min-h-9 px-3 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#006B50] text-white'
                  : 'text-[#616161] hover:bg-gray-100'
              }`}
            >
              <List size={14} />
              <span className="hidden sm:inline">List</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('map')}
              aria-pressed={viewMode === 'map'}
              className={`min-h-9 px-3 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                viewMode === 'map'
                  ? 'bg-[#006B50] text-white'
                  : 'text-[#616161] hover:bg-gray-100'
              }`}
            >
              <MapIcon size={14} />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => load(true)}
            disabled={refreshing}
            className="min-h-10 sm:min-h-9 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white text-sm font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50 disabled:opacity-60"
            aria-label="Refresh orders"
          >
            <RefreshCw
              size={14}
              className={refreshing ? 'animate-spin' : ''}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={exportCsv}
            disabled={!filtered.length}
            className="min-h-10 sm:min-h-9 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white text-sm font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50 disabled:opacity-50"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>

          <Link
            href="/orders/create"
            className="min-h-10 sm:min-h-9 px-3 inline-flex items-center gap-1.5 rounded-lg bg-[#006B50] hover:bg-[#00543f] text-sm font-semibold text-white transition-colors"
          >
            <Plus size={15} />
            Create order
          </Link>
        </div>
      </div>

      {/* FULFILLMENT WARNING */}
      {fulfillmentError && (
        <div className="rounded-xl border border-[#f1dfb8] bg-[#fffaf0] p-3 flex items-start gap-2.5 text-sm text-[#795000]">
          <AlertCircle size={17} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Fulfilment details unavailable</p>
            <p className="text-xs mt-0.5 leading-relaxed">
              Order management is still available, but item delivery dates,
              batches and item-level fulfilment controls could not be loaded.
              Refresh to try again.
            </p>
          </div>
        </div>
      )}

      {/* KPI STRIP */}
      <Card className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-200/80">
        <Kpi
          label="Orders"
          value={String(stats.orders)}
          loading={loading}
        />
        <Kpi
          label="Order value"
          value={formatCurrency(stats.orderValue)}
          loading={loading}
        />
        <Kpi
          label="In progress"
          value={String(stats.awaiting)}
          warn={stats.awaiting > 0}
          loading={loading}
        />
        <Kpi
          label="Delivered"
          value={String(stats.delivered)}
          loading={loading}
        />
      </Card>

      {/* MAP VIEW */}
      {viewMode === 'map' ? (
        <Card className="overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#17211d]">
                Order locations
              </h2>
              <p className="text-xs text-[#75817b] mt-0.5">
                {filtered.length} orders in the current filters
              </p>
            </div>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="text-xs font-semibold text-[#006B50] hover:underline"
            >
              Back to list
            </button>
          </div>

          <OrdersMapView
            orders={filtered}
            onSelectOrder={(id: string) => setSelectedOrderId(id)}
          />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          {/* FILTERS */}
          <div className="px-3 sm:px-4 pt-3 space-y-3">
            <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
              {[{ value: 'all', label: 'All' }, ...STATUSES].map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTab(t.value)}
                  aria-pressed={tab === t.value}
                  className={`min-h-9 py-1.5 px-3 rounded-lg text-xs sm:text-[13px] whitespace-nowrap transition-colors ${
                    tab === t.value
                      ? 'bg-[#006B50] text-white font-semibold'
                      : 'text-[#303030] hover:bg-[#e5f5ef]'
                  }`}
                >
                  {t.label}
                  <span
                    className={`ml-1.5 ${
                      tab === t.value
                        ? 'text-white/75'
                        : 'text-[#8a8a8a]'
                    }`}
                  >
                    {counts[t.value] ?? 0}
                  </span>
                </button>
              ))}
            </div>

            <div
              className={`grid grid-cols-2 gap-2 ${
                fulfillmentReady
                  ? 'lg:grid-cols-[1fr_150px_150px_150px_170px]'
                  : 'lg:grid-cols-[1fr_150px_150px_150px]'
              }`}
            >
              <div className="relative col-span-2 lg:col-span-1">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]"
                />
                <input
                  placeholder="Search order, customer or phone"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${inputCls} pl-9`}
                />
              </div>

              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className={`${inputCls} cursor-pointer`}
                aria-label="Date range"
              >
                {RANGES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>

              <select
                value={paymentStatusFilter}
                onChange={(e) =>
                  setPaymentStatusFilter(e.target.value)
                }
                className={`${inputCls} cursor-pointer`}
                aria-label="Payment status"
              >
                <option value="all">All payment statuses</option>
                {paymentStatuses.map((s) => (
                  <option key={s} value={s}>
                    {paymentStatusLabel(s)}
                  </option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className={`${inputCls} cursor-pointer col-span-2 lg:col-span-1`}
                aria-label="Sort orders"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>

              {fulfillmentReady && (
                <select
                  value={batchFilter}
                  onChange={(e) => setBatchFilter(e.target.value)}
                  className={`${inputCls} cursor-pointer col-span-2 lg:col-span-1`}
                  aria-label="Delivery batch"
                >
                  <option value="all">All batches</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                  <option value="none">No batch</option>
                </select>
              )}
            </div>
          </div>

          {/* BULK ACTIONS */}
          {selected.size > 0 && (
            <div className="mt-3 mx-3 sm:mx-4 px-3 py-2.5 rounded-xl bg-[#e5f5ef] border border-[#cce8dc] flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-[#00543f]">
                {selected.size} selected
              </span>

              <button
                type="button"
                onClick={handleBulkPrint}
                className="min-h-9 px-3 inline-flex items-center gap-1.5 rounded-lg bg-[#006B50] hover:bg-[#00543f] text-white text-xs sm:text-[13px] font-semibold shadow-sm transition-colors"
              >
                <Printer size={14} />
                Print invoices
              </button>

              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="ml-auto text-xs sm:text-[13px] font-semibold text-[#006B50] hover:underline"
              >
                Clear selection
              </button>
            </div>
          )}

          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto mt-3">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-[#f7faf8] text-[#64736c] border-y border-gray-200/80">
                  <th className="w-10 pl-4 py-3">
                    <Check3
                      checked={allShownSelected}
                      onChange={toggleAll}
                      label="Select all visible orders"
                    />
                  </th>
                  <th className="font-semibold px-3 py-3">Order</th>
                  <th className="font-semibold px-3 py-3">Date</th>
                  {fulfillmentReady && (
                    <th className="font-semibold px-3 py-3">Delivery</th>
                  )}
                  <th className="font-semibold px-3 py-3">Customer</th>
                  <th className="font-semibold px-3 py-3">Payment</th>
                  <th className="font-semibold px-3 py-3">Status</th>
                  <th className="font-semibold px-3 py-3">Items</th>
                  <th className="font-semibold pl-3 pr-4 py-3 text-right">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td
                        colSpan={fulfillmentReady ? 9 : 8}
                        className="px-5 py-4"
                      >
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : shown.length === 0 ? (
                  <tr>
                    <td
                      colSpan={fulfillmentReady ? 9 : 8}
                      className="py-16 text-center"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <PackageCheck
                          size={28}
                          className="text-[#aab8b1]"
                        />
                        <p className="font-semibold text-[#303030]">
                          No orders found
                        </p>
                        <p className="text-xs text-[#8a8a8a]">
                          Try changing your filters or search.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  shown.map((o) => (
                    <tr
                      key={o.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`Open order ${o.orderId}`}
                      onClick={() => setSelectedOrderId(o.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedOrderId(o.id);
                        }
                      }}
                      className={`cursor-pointer transition-colors focus-visible:outline-none focus-visible:bg-[#e5f5ef] ${
                        selected.has(o.id)
                          ? 'bg-[#f0f8f4]'
                          : 'hover:bg-[#f8fbf9]'
                      }`}
                    >
                      <td
                        className="pl-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Check3
                          checked={selected.has(o.id)}
                          onChange={() => toggleOne(o.id)}
                          label={`Select order ${o.orderId}`}
                        />
                      </td>

                      <td className="px-3 py-3 font-semibold text-[#17211d]">
                        #{o.orderId}
                      </td>

                      <td className="px-3 py-3 text-[#64736c] whitespace-nowrap">
                        {fmtDate(o.createdAt)}
                      </td>

                      {fulfillmentReady && (
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-[#303030]">
                            {fmtDay(orderDelivery(o))}
                          </div>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {renderFlags(o)}
                          </div>
                        </td>
                      )}

                      <td className="px-3 py-3">
                        <div className="text-[#17211d] font-semibold">
                          {customerName(o)}
                        </div>
                        <div className="text-xs text-[#75817b] mt-0.5">
                          {o.shipping?.phone || o.userPhone || '—'}
                        </div>
                      </td>

                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${paymentStatusTone(o.paymentStatus)}`}
                        >
                          {paymentStatusLabel(o.paymentStatus)}
                        </span>
                      </td>

                      <td
                        className="px-3 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <StatusSelect
                          order={o}
                          busy={updatingStatusId === o.id}
                          onChange={(s) => handleStatusChange(o, s)}
                        />
                      </td>

                      <td className="px-3 py-3 text-[#64736c] tabular-nums">
                        {o.items.length}{' '}
                        {o.items.length === 1 ? 'item' : 'items'}
                      </td>

                      <td className="pl-3 pr-4 py-3 text-right font-semibold text-[#17211d] tabular-nums">
                        {formatCurrency(o.total)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="md:hidden mt-3 border-t border-gray-100 divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4">
                  <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                </div>
              ))
            ) : shown.length === 0 ? (
              <div className="py-14 text-center">
                <PackageCheck
                  size={28}
                  className="mx-auto text-[#aab8b1]"
                />
                <p className="text-sm font-semibold text-[#303030] mt-2">
                  No orders found
                </p>
                <p className="text-xs text-[#8a8a8a] mt-1">
                  Try changing your filters or search.
                </p>
              </div>
            ) : (
              shown.map((o) => (
                <div
                  key={o.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open order ${o.orderId}`}
                  onClick={() => setSelectedOrderId(o.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedOrderId(o.id);
                    }
                  }}
                  className="p-4 space-y-3 active:bg-[#f7faf8] focus-visible:outline-none focus-visible:bg-[#e5f5ef]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className="pt-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Check3
                          checked={selected.has(o.id)}
                          onChange={() => toggleOne(o.id)}
                          label={`Select order ${o.orderId}`}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#17211d]">
                          Order #{o.orderId}
                        </p>
                        <p className="text-sm text-[#303030] truncate mt-0.5">
                          {customerName(o)}
                        </p>
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {renderFlags(o)}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm font-bold text-[#17211d] tabular-nums whitespace-nowrap">
                      {formatCurrency(o.total)}
                    </p>
                  </div>

                  <div className="pl-7 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-[#75817b] truncate">
                        {fulfillmentReady && orderDelivery(o)
                          ? `Delivery ${fmtDay(orderDelivery(o))} · `
                          : ''}
                        {fmtDate(o.createdAt)}
                      </p>

                      <span
                        className={`inline-flex mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${paymentStatusTone(o.paymentStatus)}`}
                      >
                        {paymentStatusLabel(o.paymentStatus)}
                      </span>
                    </div>

                    <div onClick={(e) => e.stopPropagation()}>
                      <StatusSelect
                        order={o}
                        busy={updatingStatusId === o.id}
                        onChange={(s) => handleStatusChange(o, s)}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PAGINATION */}
          {!loading && filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-3 text-xs sm:text-[13px] text-[#75817b]">
              <span>
                Showing {Math.min(visible, filtered.length)} of{' '}
                {filtered.length}
              </span>

              {visible < filtered.length && (
                <button
                  type="button"
                  onClick={() =>
                    setVisible((v) => v + PAGE_SIZE)
                  }
                  className="min-h-9 py-1.5 px-4 rounded-lg bg-white font-semibold text-[#006B50] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-[#e5f5ef]"
                >
                  Show more
                </button>
              )}
            </div>
          )}
        </Card>
      )}

      {/* ORDER DRAWER */}
      {selectedOrder && (
        <>
          <div
            className="fixed inset-0 bg-[#10231b]/45 backdrop-blur-[2px] z-[60] transition-opacity"
            onClick={() => !isSwapping && setSelectedOrderId(null)}
            aria-hidden="true"
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-drawer-title"
            className="fixed inset-y-0 right-0 w-full max-w-xl bg-[#f5f8f6] shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-200"
          >
            {/* DRAWER HEADER */}
            <div className="px-4 sm:px-5 py-4 bg-white border-b border-[#e5ece8] flex items-start justify-between gap-3 shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2
                    id="order-drawer-title"
                    className="text-lg font-bold text-[#17211d]"
                  >
                    Order #{selectedOrder.orderId}
                  </h2>

                  <Pill
                    tone={
                      STATUS_TONE[selectedOrder.status] ||
                      'bg-[#eeeeee] text-[#444444]'
                    }
                  >
                    {pretty(selectedOrder.status)}
                  </Pill>
                </div>

                <p className="text-xs text-[#75817b] mt-1 flex items-center gap-1.5">
                  {sourceIcon(String(selectedOrder.orderSource))}
                  {sourceLabel(String(selectedOrder.orderSource))}
                  <span>·</span>
                  {fmtDate(selectedOrder.createdAt)}
                </p>

                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${paymentStatusTone(selectedOrder.paymentStatus)}`}
                  >
                    Payment: {paymentStatusLabel(selectedOrder.paymentStatus)}
                  </span>
                </div>

                {fulfillmentReady && orderDelivery(selectedOrder) && (
                  <p className="text-xs text-[#303030] mt-2 flex items-center gap-1.5">
                    <CalendarClock
                      size={12}
                      className="text-[#006B50]"
                    />
                    Delivery {fmtDay(orderDelivery(selectedOrder))}
                    {batchName(selectedOrder)
                      ? ` · ${batchName(selectedOrder)}`
                      : ''}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrderId(null)}
                disabled={isSwapping}
                className="p-2 -mr-2 rounded-xl text-[#64736c] hover:text-[#17211d] hover:bg-[#f0f5f2] disabled:opacity-50"
                aria-label="Close order details"
              >
                <X size={19} />
              </button>
            </div>

            {/* DRAWER BODY */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-[13px]">
              {/* CUSTOMER */}
              <Card className="p-4 space-y-3">
                <h3 className="text-sm font-bold text-[#17211d] flex items-center gap-2">
                  <User size={15} className="text-[#006B50]" />
                  Customer
                </h3>

                <div>
                  <p className="font-semibold text-[#17211d]">
                    {customerName(selectedOrder)}
                  </p>

                  <p className="text-[#64736c] flex items-center gap-1.5 mt-1">
                    <Phone size={13} />
                    {selectedOrder.shipping?.phone ||
                      selectedOrder.userPhone ||
                      '—'}
                  </p>
                </div>

                {(() => {
                  const phone =
                    selectedOrder.shipping?.phone ||
                    selectedOrder.userPhone ||
                    '';

                  const ten = toIndianPhone(phone);

                  return ten ? (
                    <div className="flex gap-2">
                      <a
                        href={`tel:+91${ten}`}
                        className="min-h-10 py-2 px-3 inline-flex items-center gap-1.5 rounded-lg bg-[#e5f5ef] text-sm font-semibold text-[#00543f] hover:bg-[#d6eee3]"
                      >
                        <PhoneCall size={14} />
                        Call
                      </a>

                      <a
                        href={`https://wa.me/91${ten}`}
                        target="_blank"
                        rel="noreferrer"
                        className="min-h-10 py-2 px-3 inline-flex items-center gap-1.5 rounded-lg bg-[#e5f5ef] text-sm font-semibold text-[#00543f] hover:bg-[#d6eee3]"
                      >
                        <MessageSquare size={14} />
                        WhatsApp
                      </a>
                    </div>
                  ) : null;
                })()}

                <div className="pt-3 border-t border-gray-100 flex gap-2 items-start">
                  <MapPin
                    size={16}
                    className="text-[#006B50] shrink-0 mt-0.5"
                  />

                  <p className="flex-1 text-[#303030] leading-relaxed">
                    {selectedOrder.shipping?.houseNumber ||
                    (selectedOrder.shipping as any)?.houseNo
                      ? `${
                          selectedOrder.shipping?.houseNumber ||
                          (selectedOrder.shipping as any)?.houseNo
                        }, `
                      : ''}
                    {selectedOrder.shipping?.address ||
                      'No address on file'}
                    <br />
                    {[
                      selectedOrder.shipping?.city,
                      selectedOrder.shipping?.pincode,
                    ]
                      .filter(Boolean)
                      .join(' - ')}
                  </p>

                  <button
                    type="button"
                    onClick={() => copyAddress(selectedOrder)}
                    className="p-2 -m-1 rounded-lg text-[#64736c] hover:bg-[#f0f5f2]"
                    aria-label="Copy customer address"
                    title="Copy address"
                  >
                    {copied ? (
                      <Check
                        size={15}
                        className="text-[#006B50]"
                      />
                    ) : (
                      <Copy size={15} />
                    )}
                  </button>
                </div>

                <SingleOrderMiniMap
                  lat={
                    (selectedOrder.shipping as any)?.lat ??
                    (selectedOrder.shipping as any)?.latitude
                  }
                  lng={
                    (selectedOrder.shipping as any)?.lng ??
                    (selectedOrder.shipping as any)?.longitude
                  }
                  address={selectedOrder.shipping?.address}
                  orderId={selectedOrder.orderId}
                />
              </Card>

              {/* ITEMS */}
              <Card className="overflow-hidden">
                <div className="px-4 py-3.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Box size={16} className="text-[#006B50]" />
                    <h3 className="text-sm font-bold text-[#17211d]">
                      Items ({selectedOrder.items.length})
                    </h3>
                  </div>

                  {fulfillmentReady && (
                    <span className="text-[11px] text-[#75817b]">
                      Item-level fulfilment
                    </span>
                  )}
                </div>

                <div className="divide-y divide-gray-100 border-t border-gray-100">
                  {sortedItems.map((item, i) => {
                    const currentItemStatus = itemStatus(item);

                    const canSwap =
                      !['delivered', 'unavailable'].includes(
                        currentItemStatus
                      ) &&
                      !['delivered', 'cancelled'].includes(
                        selectedOrder.status
                      );

                    const dThis = itemDate(selectedOrder, item);

                    const showHead =
                      fulfillmentReady &&
                      multiDates &&
                      (i === 0 ||
                        dThis !==
                          itemDate(selectedOrder, sortedItems[i - 1]));

                    return (
                      <div
                        key={item.id || i}
                        className="p-4 space-y-3"
                      >
                        {showHead && (
                          <p className="text-xs font-semibold text-[#00543f] bg-[#e5f5ef] rounded-lg px-3 py-2 w-fit flex items-center gap-1.5">
                            <CalendarClock size={12} />
                            Delivery {fmtDay(dThis)}
                          </p>
                        )}

                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-[#17211d]">
                              {item.name}
                            </p>

                            <p className="text-xs text-[#75817b] mt-1">
                              {item.unit} · {formatCurrency(item.price)} ×{' '}
                              {item.qty}
                            </p>
                          </div>

                          <p className="font-semibold text-[#17211d] tabular-nums whitespace-nowrap">
                            {formatCurrency(item.subtotal)}
                          </p>
                        </div>

                        {renderFulfillment(selectedOrder, item)}

                        {replacingItemId === item.id ? (
                          <div className="rounded-xl border border-[#e5ece8] bg-[#f8faf9] p-3 space-y-2.5">
                            <p className="font-semibold text-[#17211d]">
                              Replace {item.name}
                            </p>

                            <input
                              value={replacementSearch}
                              onChange={(e) =>
                                setReplacementSearch(e.target.value)
                              }
                              placeholder="Search replacement product"
                              className={inputCls}
                            />

                            <select
                              value={selectedReplacementVariant}
                              onChange={(e) =>
                                setSelectedReplacementVariant(
                                  e.target.value
                                )
                              }
                              className={`${inputCls} cursor-pointer`}
                            >
                              {replacementOptions.length === 0 && (
                                <option value="">
                                  No matching products
                                </option>
                              )}

                              {replacementOptions.map((p) => (
                                <optgroup
                                  key={p.id}
                                  label={p.name}
                                >
                                  {p.product_variants.map((v) => (
                                    <option
                                      key={v.id}
                                      value={v.id}
                                    >
                                      {v.unit} — ₹{v.price}
                                    </option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>

                            <input
                              value={replaceReason}
                              onChange={(e) =>
                                setReplaceReason(e.target.value)
                              }
                              placeholder="Reason for replacement"
                              className={inputCls}
                            />

                            <div className="flex gap-2 pt-0.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleExecuteSwapItem(item)
                                }
                                disabled={
                                  isSwapping ||
                                  !selectedReplacementVariant
                                }
                                className="flex-1 min-h-10 rounded-lg bg-[#006B50] hover:bg-[#00543f] text-sm font-semibold text-white disabled:opacity-50 inline-flex items-center justify-center gap-2"
                              >
                                {isSwapping ? (
                                  <>
                                    <Loader2
                                      size={14}
                                      className="animate-spin"
                                    />
                                    Replacing…
                                  </>
                                ) : (
                                  'Confirm replacement'
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setReplacingItemId(null)
                                }
                                disabled={isSwapping}
                                className="min-h-10 px-3 rounded-lg bg-white text-sm font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : canSwap ? (
                          <button
                            type="button"
                            onClick={() =>
                              setReplacingItemId(item.id)
                            }
                            className="min-h-9 py-2 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white text-xs font-semibold text-[#006B50] shadow-[0_0_0_1px_rgba(0,107,80,0.22)] hover:bg-[#e5f5ef]"
                          >
                            <RefreshCw size={13} />
                            Replace item
                          </button>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                {/* TOTALS */}
                {(() => {
                  const sub = selectedOrder.items.reduce(
                    (s, i) => s + (Number(i.subtotal) || 0),
                    0
                  );

                  const extra = Number(selectedOrder.total) - sub;

                  return (
                    <div className="border-t border-gray-100 p-4 space-y-2">
                      <div className="flex justify-between text-[#64736c]">
                        <span>Subtotal</span>
                        <span className="tabular-nums">
                          {formatCurrency(sub)}
                        </span>
                      </div>

                      {Math.abs(extra) > 0.5 && (
                        <div className="flex justify-between text-[#64736c]">
                          <span>Delivery & other</span>
                          <span className="tabular-nums">
                            {formatCurrency(extra)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between font-bold text-[#17211d] text-sm pt-2 border-t border-gray-100">
                        <span>Order total</span>
                        <span className="tabular-nums">
                          {formatCurrency(selectedOrder.total)}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </Card>

              {/* ITEM CHANGE HISTORY */}
              {selectedOrder.itemChanges &&
                selectedOrder.itemChanges.length > 0 && (
                  <Card className="p-4">
                    <h3 className="text-sm font-bold text-[#17211d] flex items-center gap-2 mb-4">
                      <History
                        size={15}
                        className="text-[#006B50]"
                      />
                      Item changes
                    </h3>

                    <ol className="relative border-l border-[#dce7e1] ml-1.5 space-y-4">
                      {selectedOrder.itemChanges.map((ch, i) => (
                        <li key={i} className="pl-4 relative">
                          <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#006B50] ring-2 ring-white" />

                          <p className="font-semibold text-[#17211d]">
                            {pretty(ch.change_type)}
                            {ch.reason ? ` · ${ch.reason}` : ''}
                          </p>

                          <p className="text-xs text-[#64736c] mt-1">
                            ₹{ch.old_unit_price} → ₹
                            {ch.new_unit_price}
                          </p>

                          <p className="text-xs text-[#8a8a8a] mt-1">
                            {fmtDate(ch.created_at)}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </Card>
                )}
            </div>

            {/* DRAWER FOOTER */}
            <div className="p-4 bg-white border-t border-[#e5ece8] shrink-0 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => printOrder(selectedOrder)}
                className="min-h-11 sm:min-h-10 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white text-sm font-semibold text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-[#f5f8f6]"
              >
                <Printer size={14} />
                Print
              </button>

              <div className="flex-1 min-w-[160px]">
                <StatusSelect
                  order={selectedOrder}
                  busy={updatingStatusId === selectedOrder.id}
                  onChange={(s) =>
                    handleStatusChange(selectedOrder, s)
                  }
                  block
                />
              </div>
            </div>
          </aside>
        </>
      )}

      {/* TOAST */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[120] max-w-[90vw] px-4 py-3 rounded-xl text-sm font-medium shadow-xl ${
            toast.type === 'error'
              ? 'bg-[#fff0f0] text-[#8e0b21] border border-[#f5cbd0]'
              : 'bg-[#173d30] text-white'
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}

// ---------- UI primitives ----------

function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,107,80,0.08),0_2px_5px_rgba(0,0,0,0.025)] ${className}`}
    >
      {children}
    </div>
  );
}

function Kpi({
  label,
  value,
  warn,
  loading,
}: {
  label: string;
  value: string;
  warn?: boolean;
  loading: boolean;
}) {
  return (
    <div className="p-4 sm:p-5">
      <p className="text-xs sm:text-[13px] font-medium text-[#75817b]">
        {label}
      </p>

      {loading ? (
        <div className="h-7 w-20 bg-[#edf2ef] rounded-lg mt-2 animate-pulse" />
      ) : (
        <p
          className={`text-[22px] font-bold mt-2 leading-none tabular-nums ${
            warn ? 'text-[#795000]' : 'text-[#17211d]'
          }`}
        >
          {value}
        </p>
      )}
    </div>
  );
}

function Pill({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: string;
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 h-5 rounded-full text-[10px] font-semibold whitespace-nowrap ${tone}`}
    >
      {children}
    </span>
  );
}

function Check3({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
      aria-label={label}
      className="w-4 h-4 rounded border-gray-300 accent-[#006B50] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#006B50]"
    />
  );
}

function StatusSelect({
  order,
  busy,
  onChange,
  block,
}: {
  order: AdminOrder;
  busy?: boolean;
  onChange: (s: string) => void;
  block?: boolean;
}) {
  const currentIsKnown = STATUSES.some(
    (s) => s.value === order.status
  );

  return (
    <div className={`relative ${block ? 'w-full' : 'inline-block'}`}>
      <select
        value={order.status}
        disabled={busy}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        aria-label={`Status for order ${order.orderId}`}
        className={`appearance-none cursor-pointer outline-none font-semibold disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[#006B50] ${
          block
            ? 'w-full min-h-11 sm:min-h-10 pl-3 pr-9 rounded-lg text-sm shadow-[0_0_0_1px_rgba(0,107,80,0.2)] bg-white text-[#303030]'
            : `min-h-9 pl-2.5 pr-7 rounded-full text-[11px] ${
                STATUS_TONE[order.status] || 'bg-[#eeeeee] text-[#444444]'
              }`
        }`}
      >
        {!currentIsKnown && (
          <option value={order.status}>
            {pretty(order.status)}
          </option>
        )}

        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {block ? `Status: ${s.label}` : s.label}
          </option>
        ))}
      </select>

      {busy ? (
        <Loader2
          size={13}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin pointer-events-none"
        />
      ) : (
        <ChevronDown
          size={block ? 15 : 12}
          className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${
            block
              ? 'right-3 text-[#64736c]'
              : 'right-2.5 opacity-70'
          }`}
        />
      )}
    </div>
  );
}
