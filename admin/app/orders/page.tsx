"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { splitOrderItem } from '@/lib/fulfillment';
import { OrdersMapView } from '@/components/OrdersMapView';
import { SingleOrderMiniMap } from '@/components/SingleOrderMiniMap';
import {
  Printer, MapPin, Search, X, User, Phone, Box, Plus, RefreshCw, History, MessageSquare, PhoneCall,
  Store, Globe, Loader2, ChevronDown, Download, Copy, Check, CalendarClock, List, Map as MapIcon,
} from 'lucide-react';
import {
  changeAdminOrderStatus,
  listAdminOrders,
  listReplacementProducts,
  swapAdminOrderItem,
} from '@/features/orders/services/orders.service';
import type { AdminOrder, AdminOrderItem, ReplacementProduct } from '@/features/orders/types/order';

const DAY = 86400000;
const PAGE_SIZE = 25;

const STATUSES = [
  { value: 'pending_payment', label: 'Payment Failed / Pending' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'out_for_delivery', label: 'Out for delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const STATUS_TONE: Record<string, string> = {
  pending_payment: 'bg-[#fed1d7] text-[#8e0b21]',
  pending: 'bg-[#e3e3e3] text-[#303030]',
  processing: 'bg-[#ffd6a4] text-[#5e4200]',
  out_for_delivery: 'bg-[#a4e8f2] text-[#00424d]',
  delivered: 'bg-[#cdfed4] text-[#014b40]',
  cancelled: 'bg-[#fed1d7] text-[#8e0b21]',
};

const RANGES = [
  { value: 'all', label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
];

const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'high', label: 'Highest total' },
  { value: 'low', label: 'Lowest total' },
];

const SOURCE_META: Record<string, { label: string; icon: React.ReactNode }> = {
  online_web: { label: 'Online store', icon: <Globe size={12} /> },
  whatsapp: { label: 'WhatsApp', icon: <MessageSquare size={12} /> },
  phone: { label: 'Phone', icon: <PhoneCall size={12} /> },
  walk_in: { label: 'Walk-in', icon: <Store size={12} /> },
};

const pretty = (s: string) => String(s || '').replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
const sourceLabel = (s: string) => SOURCE_META[s]?.label ?? pretty(s || 'online_web');
const sourceIcon = (s: string) => SOURCE_META[s]?.icon ?? <Globe size={12} />;

const FULFILL = [
  { value: 'pending', label: 'To pack' },
  { value: 'packed', label: 'Packed' },
  { value: 'backordered', label: 'Awaiting stock' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'unavailable', label: 'Unavailable' },
];
const FULFILL_TONE: Record<string, string> = {
  pending: 'bg-[#e3e3e3] text-[#303030]',
  packed: 'bg-[#a4e8f2] text-[#00424d]',
  backordered: 'bg-[#ffd6a4] text-[#5e4200]',
  delivered: 'bg-[#cdfed4] text-[#014b40]',
  unavailable: 'bg-[#fed1d7] text-[#8e0b21]',
};

// 'YYYY-MM-DD' -> "Sat, 1 Nov" without timezone shifting the day
const fmtDay = (d?: string | null) =>
  d ? new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : '—';
const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

type ItemExtra = { fulfillment_status: string; promised_date: string | null; fulfillment_note: string | null };

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
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(n) || 0);

const fmtDate = (d: any) =>
  d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true }) : '—';

const startOfDay = (t: number) => { const d = new Date(t); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); };

const toIndianPhone = (raw: string) => {
  const digits = String(raw || '').replace(/\D/g, '');
  const ten = digits.length >= 10 ? digits.slice(-10) : '';
  return /^[6-9]\d{9}$/.test(ten) ? ten : null;
};

const esc = (v: any) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

const inputCls =
  'w-full min-h-11 sm:min-h-9 py-2 px-3 text-base sm:text-[13px] text-[#1a1a1a] placeholder:text-[#8a8a8a] bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.2)] outline-none focus:shadow-[0_0_0_2px_#005bd3] transition-shadow';

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<ReplacementProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [tab, setTab] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [range, setRange] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  // batches + item-level fulfillment (needs the SQL migration; silently off until then)
  const [fulfillmentReady, setFulfillmentReady] = useState(false);
  const [batches, setBatches] = useState<any[]>([]);
  const [orderExtras, setOrderExtras] = useState<Record<string, { batch_id: string | null; delivery_date: string | null }>>({});
  const [itemExtras, setItemExtras] = useState<Record<string, ItemExtra>>({});
  const [batchFilter, setBatchFilter] = useState('all');
  const [rescheduling, setRescheduling] = useState<{ itemId: string; date: string; note: string } | null>(null);
  const [savingItemId, setSavingItemId] = useState<string | null>(null);
  const [splitting, setSplitting] = useState<{ itemId: string; keep: string; mode: 'stock' | 'date'; date: string } | null>(null);

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // item replacement
  const [replacingItemId, setReplacingItemId] = useState<string | null>(null);
  const [replacementSearch, setReplacementSearch] = useState('');
  const [selectedReplacementVariant, setSelectedReplacementVariant] = useState('');
  const [replaceReason, setReplaceReason] = useState('Product unavailable - replaced with customer consent');
  const [isSwapping, setIsSwapping] = useState(false);

  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const flash = (type: 'error' | 'success', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const load = async (silent = false) => {
    if (silent) setRefreshing(true);
    try {
      const [orderRows, productRows] = await Promise.all([listAdminOrders(), listReplacementProducts()]);
      setOrders(orderRows);
      setProducts(productRows);

      try {
        const [bRes, oRows, iRows] = await Promise.all([
          supabase.from('order_batches').select('id, name, delivery_date, status').order('delivery_date', { ascending: false }).limit(60),
          fetchAll((f, t) => supabase.from('orders').select('id, batch_id, delivery_date').or('batch_id.not.is.null,delivery_date.not.is.null').range(f, t)),
          fetchAll((f, t) => supabase.from('order_items').select('id, fulfillment_status, promised_date, fulfillment_note').or('fulfillment_status.neq.pending,promised_date.not.is.null').range(f, t)),
        ]);
        if (bRes.error) throw bRes.error;
        setBatches(bRes.data || []);
        setOrderExtras(Object.fromEntries(oRows.map((r) => [r.id, { batch_id: r.batch_id, delivery_date: r.delivery_date }])));
        setItemExtras(Object.fromEntries(iRows.map((r) => [r.id, { fulfillment_status: r.fulfillment_status, promised_date: r.promised_date, fulfillment_note: r.fulfillment_note }])));
        setFulfillmentReady(true);
      } catch {
        setFulfillmentReady(false); // migration not run yet: the page works exactly as before
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
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) setSearchQuery(q);
    const bq = new URLSearchParams(window.location.search).get('batch');
    if (bq) setBatchFilter(bq);
  }, []);

  const selectedOrder = useMemo(() => orders.find((o) => o.id === selectedOrderId) || null, [orders, selectedOrderId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSwapping) setSelectedOrderId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSwapping]);

  useEffect(() => {
    setReplacingItemId(null);
    setReplacementSearch('');
  }, [selectedOrderId]);

  // ---------- filtering ----------
  const sources = useMemo(() => Array.from(new Set(orders.map((o) => String(o.orderSource || 'online_web')))), [orders]);

  const base = useMemo(() => {
    const now = Date.now();
    const today0 = startOfDay(now);
    const from = range === 'today' ? today0 : range === '7d' ? today0 - 6 * DAY : range === '30d' ? today0 - 29 * DAY : 0;
    const q = searchQuery.trim().toLowerCase();
    return orders.filter((o) => {
      if (from && (!o.createdAt || new Date(o.createdAt).getTime() < from)) return false;
      if (sourceFilter !== 'all' && String(o.orderSource || 'online_web') !== sourceFilter) return false;
      if (batchFilter !== 'all') {
        const bid = orderExtras[o.id]?.batch_id ?? null;
        if (batchFilter === 'none' ? bid : bid !== batchFilter) return false;
      }
      if (!q) return true;
      return (
        String(o.orderId || '').toLowerCase().includes(q) ||
        String(o.userName || '').toLowerCase().includes(q) ||
        String(o.shipping?.name || '').toLowerCase().includes(q) ||
        String(o.shipping?.phone || o.userPhone || '').includes(q)
      );
    });
  }, [orders, range, sourceFilter, searchQuery, batchFilter, orderExtras]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: base.length };
    STATUSES.forEach((s) => (c[s.value] = 0));
    base.forEach((o) => { c[o.status] = (c[o.status] || 0) + 1; });
    return c;
  }, [base]);

  const filtered = useMemo(() => {
    const list = tab === 'all' ? base : base.filter((o) => o.status === tab);
    const t = (o: AdminOrder) => (o.createdAt ? new Date(o.createdAt).getTime() : 0);
    return [...list].sort((a, b) =>
      sort === 'oldest' ? t(a) - t(b) : sort === 'high' ? Number(b.total) - Number(a.total) : sort === 'low' ? Number(a.total) - Number(b.total) : t(b) - t(a)
    );
  }, [base, tab, sort]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
    setSelected(new Set());
  }, [tab, searchQuery, range, sourceFilter, sort, batchFilter]);

  const stats = useMemo(() => {
    const live = base.filter((o) => o.status !== 'cancelled');
    return {
      orders: base.length,
      revenue: live.reduce((s, o) => s + (Number(o.total) || 0), 0),
      awaiting: (counts.pending || 0) + (counts.processing || 0),
      delivered: counts.delivered || 0,
    };
  }, [base, counts]);

  const shown = filtered.slice(0, visible);
  const allShownSelected = shown.length > 0 && shown.every((o) => selected.has(o.id));

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const toggleAll = () => setSelected(allShownSelected ? new Set() : new Set(shown.map((o) => o.id)));

  // ---------- status changes ----------
  const setLocalStatus = (id: string, status: string) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

  const handleStatusChange = async (order: AdminOrder, newStatus: string, itemsAlreadyChecked = false) => {
    if (newStatus === order.status) return;
    if (newStatus === 'cancelled' && !confirm(`Cancel order #${order.orderId}?`)) return;
    const undeliveredIds = order.items.filter((i) => !['delivered', 'unavailable'].includes(itemStatus(i))).map((i) => i.id);
    if (newStatus === 'delivered' && fulfillmentReady && !itemsAlreadyChecked && undeliveredIds.length > 0) {
      if (!confirm(`${undeliveredIds.length} item${undeliveredIds.length > 1 ? 's are' : ' is'} not marked delivered yet. Mark the order and all its items as delivered?`)) return;
    }
    const prevStatus = order.status;
    setUpdatingStatusId(order.id);
    setLocalStatus(order.id, newStatus);
    try {
      await changeAdminOrderStatus(order.id, newStatus);
      if (newStatus === 'delivered' && fulfillmentReady && undeliveredIds.length > 0) {
        const { error: itemErr } = await supabase.from('order_items').update({ fulfillment_status: 'delivered' }).in('id', undeliveredIds);
        if (!itemErr) {
          setItemExtras((prev) => {
            const next = { ...prev };
            undeliveredIds.forEach((id) => { next[id] = { fulfillment_status: 'delivered', promised_date: prev[id]?.promised_date ?? null, fulfillment_note: prev[id]?.fulfillment_note ?? null }; });
            return next;
          });
        }
      }
      flash('success', `Order #${order.orderId} marked ${pretty(newStatus).toLowerCase()}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      setLocalStatus(order.id, prevStatus);
      flash('error', 'Failed to update order status.');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleBulkStatus = async (newStatus: string) => {
    if (!newStatus || selected.size === 0) return;
    const ids = Array.from(selected);
    if (!confirm(`Mark ${ids.length} order${ids.length > 1 ? 's' : ''} as ${pretty(newStatus).toLowerCase()}?`)) return;
    setBulkBusy(true);
    const results = await Promise.allSettled(ids.map((id) => changeAdminOrderStatus(id, newStatus)));
    const okIds = ids.filter((_, i) => results[i].status === 'fulfilled');
    setOrders((prev) => prev.map((o) => (okIds.includes(o.id) ? { ...o, status: newStatus } : o)));
    setSelected(new Set());
    setBulkBusy(false);
    const failed = ids.length - okIds.length;
    failed ? flash('error', `${okIds.length} updated, ${failed} failed.`) : flash('success', `${okIds.length} orders updated`);
  };

  // ---------- item replacement ----------
  const replacementOptions = useMemo(() => {
    const q = replacementSearch.trim().toLowerCase();
    return products
      .map((p) => ({ ...p, product_variants: (p.product_variants || []) }))
      .filter((p) => p.product_variants.length > 0 && (!q || String(p.name).toLowerCase().includes(q)));
  }, [products, replacementSearch]);

  useEffect(() => {
    const flat = replacementOptions.flatMap((p) => p.product_variants.map((v) => v.id));
    if (!flat.includes(selectedReplacementVariant)) setSelectedReplacementVariant(flat[0] || '');
  }, [replacementOptions, selectedReplacementVariant]);

  const handleExecuteSwapItem = async (oldItem: AdminOrderItem) => {
    if (!selectedOrder) return;
    if (!selectedReplacementVariant) return flash('error', 'Select a replacement variant.');
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
      await load(true); // drawer stays open and shows the updated order
    } catch (error) {
      console.error(error);
      flash('error', error instanceof Error ? error.message : 'Item replacement failed');
    } finally {
      setIsSwapping(false);
    }
  };

  // ---------- export & print ----------
  const exportCsv = () => {
    const q = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = [
      ['Order', 'Date', 'Delivery date', 'Customer', 'Phone', 'Source', 'Status', 'Items', 'Total'],
      ...filtered.map((o) => [
        `#${o.orderId}`, o.createdAt ? new Date(o.createdAt).toISOString() : '', orderExtras[o.id]?.delivery_date || '', o.shipping?.name || o.userName || '',
        o.shipping?.phone || o.userPhone || '', sourceLabel(String(o.orderSource)), pretty(o.status), o.items.length, o.total,
      ]),
    ];
    const blob = new Blob([rows.map((r) => r.map(q).join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const printOrder = (o: AdminOrder) => {
    const w = window.open('', '_blank', 'width=800,height=950');
    if (!w) return flash('error', 'Allow pop-ups to print.');

    const subtotal = o.subtotal || o.items.reduce((s, i) => s + (Number(i.subtotal) || 0), 0);
    const deliveryFee = Number(o.deliveryFee || 0);
    const discount = Number(o.discount || 0);
    const total = Number(o.total || 0);

    w.document.write(`<!doctype html><html><head><title>Invoice & Packing Slip #${esc(o.orderId)}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #17211d; padding: 32px; max-width: 760px; margin: auto; background: #fff; }
        .header { text-align: center; border-bottom: 2px solid #004d3b; padding-bottom: 16px; margin-bottom: 20px; }
        .brand { font-family: Georgia, serif; font-size: 24px; font-weight: 900; color: #004d3b; letter-spacing: 2px; text-transform: uppercase; }
        .subtitle { font-size: 10px; font-weight: 700; color: #b48312; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 2px; }
        .invoice-title { font-size: 13px; font-weight: 800; color: #303030; text-transform: uppercase; letter-spacing: 1px; margin-top: 10px; background: #f5f7f6; display: inline-block; padding: 4px 16px; border-radius: 8px; border: 1px solid #e3eae6; }

        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; font-size: 12px; }
        .box { background: #fafafa; border: 1px solid #e3eae6; border-radius: 12px; padding: 14px; }
        .box-title { font-size: 10px; font-weight: 800; color: #75817b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .box-text { color: #17211d; font-size: 12px; line-height: 1.5; font-weight: 600; }

        table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
        th { background: #004d3b; color: #fff; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; padding: 10px 12px; text-align: left; }
        td { padding: 10px 12px; border-bottom: 1px solid #e3eae6; font-size: 12px; color: #17211d; }
        .r { text-align: right; }

        .totals-table { width: 280px; margin-left: auto; margin-top: 16px; font-size: 12px; }
        .totals-table td { padding: 4px 8px; border-bottom: none; }
        .totals-table .grand-tot { font-size: 15px; font-weight: 900; color: #004d3b; border-top: 2px solid #004d3b; padding-top: 8px; }

        .footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #e3eae6; text-align: center; font-size: 10px; color: #75817b; font-weight: 600; }
        .badge { background: #cdfed4; color: #014b40; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
      </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">ROYAL BENGAL</div>
          <div class="subtitle">Pure • Fresh • Trusted | Gourmet Sourcing</div>
          <div class="invoice-title">INVOICE & PACKING SLIP: #${esc(o.orderId)}</div>
        </div>

        <div class="meta-grid">
          <div class="box">
            <div class="box-title">Order Information</div>
            <div class="box-text">
              Date: ${esc(fmtDate(o.createdAt))}<br/>
              Status: <span class="badge">${esc(pretty(o.status))}</span><br/>
              Channel: ${esc(sourceLabel(String(o.orderSource)))}
            </div>
          </div>

          <div class="box">
            <div class="box-title">Delivery Customer</div>
            <div class="box-text">
              <strong>${esc(customerName(o))}</strong><br/>
              Phone: ${esc(o.shipping?.phone || o.userPhone || '—')}<br/>
              ${esc([o.shipping?.houseNumber || (o.shipping as any)?.houseNo, o.shipping?.address].filter(Boolean).join(', '))}<br/>
              ${esc([o.shipping?.city, o.shipping?.pincode].filter(Boolean).join(' - '))}
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              <th>Unit</th>
              <th class="r">Qty</th>
              <th class="r">Unit Price</th>
              <th class="r">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${o.items.map((i) => `
              <tr>
                <td><strong>${esc(i.name)}</strong></td>
                <td>${esc(i.unit)}</td>
                <td class="r">${esc(i.qty)}</td>
                <td class="r">₹${esc(i.price)}</td>
                <td class="r"><strong>₹${esc(i.subtotal)}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <table class="totals-table">
          <tr>
            <td>Items Subtotal:</td>
            <td class="r">₹${esc(subtotal)}</td>
          </tr>
          ${discount > 0 ? `<tr><td>Discount Saved:</td><td class="r">- ₹${esc(discount)}</td></tr>` : ''}
          <tr>
            <td>Delivery Fee:</td>
            <td class="r">${deliveryFee === 0 ? 'FREE' : `₹${esc(deliveryFee)}`}</td>
          </tr>
          <tr class="grand-tot">
            <td>TOTAL PAID:</td>
            <td class="r">₹${esc(total)}</td>
          </tr>
        </table>

        <div class="footer">
          100% Temperature-Controlled Cold Chain Packaging Guarantee.<br/>
          Thank you for choosing Royal Bengal! For support, call +91 98765 43210.
        </div>

        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>`);
    w.document.close();
  };

  const handleBulkPrint = () => {
    if (selected.size === 0) return;
    const selectedOrdersList = orders.filter((o) => selected.has(o.id));
    if (selectedOrdersList.length === 0) return;

    const w = window.open('', '_blank', 'width=800,height=950');
    if (!w) return flash('error', 'Allow pop-ups to print invoices.');

    const htmlContent = selectedOrdersList.map((o, idx) => {
      const subtotal = o.subtotal || o.items.reduce((s, i) => s + (Number(i.subtotal) || 0), 0);
      const deliveryFee = Number(o.deliveryFee || 0);
      const discount = Number(o.discount || 0);
      const total = Number(o.total || 0);

      return `
        <div class="page ${idx < selectedOrdersList.length - 1 ? 'page-break' : ''}">
          <div class="header">
            <div class="brand">ROYAL BENGAL</div>
            <div class="subtitle">Pure • Fresh • Trusted | Gourmet Sourcing</div>
            <div class="invoice-title">INVOICE & PACKING SLIP: #${esc(o.orderId)}</div>
          </div>

          <div class="meta-grid">
            <div class="box">
              <div class="box-title">Order Information</div>
              <div class="box-text">
                Date: ${esc(fmtDate(o.createdAt))}<br/>
                Status: <span class="badge">${esc(pretty(o.status))}</span><br/>
                Channel: ${esc(sourceLabel(String(o.orderSource)))}
              </div>
            </div>

            <div class="box">
              <div class="box-title">Delivery Customer</div>
              <div class="box-text">
                <strong>${esc(customerName(o))}</strong><br/>
                Phone: ${esc(o.shipping?.phone || o.userPhone || '—')}<br/>
                ${esc([o.shipping?.houseNumber || (o.shipping as any)?.houseNo, o.shipping?.address].filter(Boolean).join(', '))}<br/>
                ${esc([o.shipping?.city, o.shipping?.pincode].filter(Boolean).join(' - '))}
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Unit</th>
                <th class="r">Qty</th>
                <th class="r">Unit Price</th>
                <th class="r">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${o.items.map((i) => `
                <tr>
                  <td><strong>${esc(i.name)}</strong></td>
                  <td>${esc(i.unit)}</td>
                  <td class="r">${esc(i.qty)}</td>
                  <td class="r">₹${esc(i.price)}</td>
                  <td class="r"><strong>₹${esc(i.subtotal)}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <table class="totals-table">
            <tr>
              <td>Items Subtotal:</td>
              <td class="r">₹${esc(subtotal)}</td>
            </tr>
            ${discount > 0 ? `<tr><td>Discount Saved:</td><td class="r">- ₹${esc(discount)}</td></tr>` : ''}
            <tr>
              <td>Delivery Fee:</td>
              <td class="r">${deliveryFee === 0 ? 'FREE' : `₹${esc(deliveryFee)}`}</td>
            </tr>
            <tr class="grand-tot">
              <td>TOTAL PAID:</td>
              <td class="r">₹${esc(total)}</td>
            </tr>
          </table>

          <div class="footer">
            100% Temperature-Controlled Cold Chain Packaging Guarantee.<br/>
            Thank you for choosing Royal Bengal! For support, call +91 98765 43210.
          </div>
        </div>
      `;
    }).join('');

    w.document.write(`<!doctype html><html><head><title>Bulk Orders Invoice Print (${selectedOrdersList.length})</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #17211d; padding: 24px; max-width: 760px; margin: auto; background: #fff; }
        .page { margin-bottom: 40px; }
        .page-break { page-break-after: always; break-after: page; }
        .header { text-align: center; border-bottom: 2px solid #004d3b; padding-bottom: 16px; margin-bottom: 20px; }
        .brand { font-family: Georgia, serif; font-size: 24px; font-weight: 900; color: #004d3b; letter-spacing: 2px; text-transform: uppercase; }
        .subtitle { font-size: 10px; font-weight: 700; color: #b48312; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 2px; }
        .invoice-title { font-size: 13px; font-weight: 800; color: #303030; text-transform: uppercase; letter-spacing: 1px; margin-top: 10px; background: #f5f7f6; display: inline-block; padding: 4px 16px; border-radius: 8px; border: 1px solid #e3eae6; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; font-size: 12px; }
        .box { background: #fafafa; border: 1px solid #e3eae6; border-radius: 12px; padding: 14px; }
        .box-title { font-size: 10px; font-weight: 800; color: #75817b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .box-text { color: #17211d; font-size: 12px; line-height: 1.5; font-weight: 600; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
        th { background: #004d3b; color: #fff; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; padding: 10px 12px; text-align: left; }
        td { padding: 10px 12px; border-bottom: 1px solid #e3eae6; font-size: 12px; color: #17211d; }
        .r { text-align: right; }
        .totals-table { width: 280px; margin-left: auto; margin-top: 16px; font-size: 12px; }
        .totals-table td { padding: 4px 8px; border-bottom: none; }
        .totals-table .grand-tot { font-size: 15px; font-weight: 900; color: #004d3b; border-top: 2px solid #004d3b; padding-top: 8px; }
        .footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #e3eae6; text-align: center; font-size: 10px; color: #75817b; font-weight: 600; }
        .badge { background: #cdfed4; color: #014b40; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
      </style>
      </head>
      <body>
        ${htmlContent}
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>`);
    w.document.close();
  };

  const copyAddress = async (o: AdminOrder) => {
    const text = [o.shipping?.name || o.userName, o.shipping?.phone || o.userPhone, [o.shipping?.houseNumber, o.shipping?.address].filter(Boolean).join(', '), [o.shipping?.city, o.shipping?.pincode].filter(Boolean).join(' - ')]
      .filter(Boolean).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      flash('error', 'Could not copy the address.');
    }
  };

  const customerName = (o: AdminOrder) => o.shipping?.name || o.userName || 'Customer';

  // ---------- batches & item fulfillment ----------
  const orderDelivery = (o: AdminOrder) => orderExtras[o.id]?.delivery_date || null;
  const itemStatus = (i: AdminOrderItem) => itemExtras[i.id]?.fulfillment_status || 'pending';
  const itemDate = (o: AdminOrder, i: AdminOrderItem) => itemExtras[i.id]?.promised_date || orderDelivery(o);
  const batchName = (o: AdminOrder) => batches.find((b) => b.id === orderExtras[o.id]?.batch_id)?.name || null;

  const orderFlags = (o: AdminOrder) => {
    const od = orderDelivery(o);
    let late = false, unavailable = false, backordered = false, delivered = 0, open = 0;
    o.items.forEach((i) => {
      const st = itemStatus(i);
      if (st === 'backordered') backordered = true;
      if (st === 'unavailable') unavailable = true;
      else if (st === 'delivered') delivered++;
      else open++;
      const pd = itemExtras[i.id]?.promised_date;
      if (pd && od && pd > od) late = true;
    });
    return { late, unavailable, backordered, partial: delivered > 0 && open > 0 };
  };

  const renderFlags = (o: AdminOrder) => {
    if (!fulfillmentReady || o.status === 'cancelled') return null;
    const f = orderFlags(o);
    return (
      <>
        {f.partial && <Pill tone="bg-[#a4e8f2] text-[#00424d]">Partial</Pill>}
        {f.backordered && <Pill tone="bg-[#ffd6a4] text-[#5e4200]">Awaiting stock</Pill>}
        {f.late && !f.backordered && <Pill tone="bg-[#ffd6a4] text-[#5e4200]">Late items</Pill>}
        {f.unavailable && <Pill tone="bg-[#fed1d7] text-[#8e0b21]">Unavailable</Pill>}
      </>
    );
  };

  const updateItem = async (item: AdminOrderItem, patch: Partial<ItemExtra>) => {
    const prev: ItemExtra = itemExtras[item.id] || { fulfillment_status: 'pending', promised_date: null, fulfillment_note: null };
    setSavingItemId(item.id);
    setItemExtras((p) => ({ ...p, [item.id]: { ...prev, ...patch } }));
    const { error } = await supabase.from('order_items').update(patch).eq('id', item.id);
    setSavingItemId(null);
    if (error) {
      console.error(error);
      setItemExtras((p) => ({ ...p, [item.id]: prev }));
      flash('error', 'Could not update the item.');
      return false;
    }
    return true;
  };

  const changeItemStatus = async (o: AdminOrder, item: AdminOrderItem, status: string) => {
    const ok = await updateItem(item, { fulfillment_status: status });
    if (!ok || status === 'pending' || status === 'packed') return;
    const everyoneDone = o.items.every((i) => i.id === item.id || ['delivered', 'unavailable'].includes(itemStatus(i)));
    const anyDelivered = status === 'delivered' || o.items.some((i) => itemStatus(i) === 'delivered');
    if (everyoneDone && anyDelivered && o.status !== 'delivered' && o.status !== 'cancelled' && confirm('Every item is now handled. Mark the whole order as delivered?')) {
      handleStatusChange(o, 'delivered', true);
    }
  };

  const saveReschedule = async (o: AdminOrder, item: AdminOrderItem) => {
    if (!rescheduling) return;
    if (!rescheduling.date) return flash('error', 'Pick a delivery date.');
    if (rescheduling.date < todayStr()) return flash('error', 'Pick today or a future date.');
    const od = orderDelivery(o);
    const ok = await updateItem(item, {
      promised_date: rescheduling.date === od ? null : rescheduling.date,
      fulfillment_note: rescheduling.note.trim() || null,
      ...(itemStatus(item) === 'backordered' ? { fulfillment_status: 'pending' } : {}),
    });
    if (ok) {
      setRescheduling(null);
      flash('success', `${item.name} moved to ${fmtDay(rescheduling.date)}`);
    }
  };

  const saveSplit = async (item: AdminOrderItem) => {
    if (!splitting) return;
    const keep = Number(splitting.keep);
    const total = Number(item.qty);
    if (!(keep > 0 && keep < total)) return flash('error', `Enter a quantity above 0 and below ${total}.`);
    if (splitting.mode === 'date' && (!splitting.date || splitting.date < todayStr())) return flash('error', 'Pick today or a future date for the rest.');
    setSavingItemId(item.id);
    const res = await splitOrderItem(item.id, keep, {
      status: splitting.mode === 'stock' ? 'backordered' : 'pending',
      promised_date: splitting.mode === 'date' ? splitting.date : null,
      note: splitting.mode === 'stock' ? 'Waiting for stock' : `Rest delivered ${fmtDay(splitting.date)}`,
    });
    setSavingItemId(null);
    if (!res.ok) return flash('error', res.message);
    setSplitting(null);
    flash('success', 'Item split. The rest is tracked separately.');
    await load(true);
  };

  const upcomingBatches = (after: string | null) =>
    batches.filter((b) => b.status === 'active' && b.delivery_date >= todayStr() && (!after || b.delivery_date > after)).sort((a, b) => a.delivery_date.localeCompare(b.delivery_date)).slice(0, 3);

  const renderFulfillment = (o: AdminOrder, item: AdminOrderItem) => {
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
              onChange={(e) => changeItemStatus(o, item, e.target.value)}
              aria-label={`Fulfillment status for ${item.name}`}
              className={`appearance-none cursor-pointer outline-none min-h-8 pl-2.5 pr-7 rounded-full text-xs font-medium disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[#005bd3] ${FULFILL_TONE[st]}`}
            >
              {FULFILL.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            {busy ? <Loader2 size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin pointer-events-none" /> : <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" />}
          </div>
          {late && <Pill tone="bg-[#ffd6a4] text-[#5e4200]">Late · {fmtDay(d)}</Pill>}
          {!locked && st !== 'delivered' && st !== 'unavailable' && !editing && !splitEditing && (
            <button type="button" onClick={() => setRescheduling({ itemId: item.id, date: pd || '', note: note || '' })} className="text-sm sm:text-[13px] text-[#005bd3] hover:underline inline-flex items-center gap-1 min-h-8">
              <CalendarClock size={13} /> Reschedule
            </button>
          )}
          {!locked && st !== 'delivered' && st !== 'unavailable' && !editing && !splitEditing && Number(item.qty) > 1 && (
            <button type="button" onClick={() => setSplitting({ itemId: item.id, keep: '', mode: 'stock', date: '' })} className="text-sm sm:text-[13px] text-[#005bd3] hover:underline min-h-8">
              Short supply
            </button>
          )}
        </div>
        {note && !editing && <p className="text-xs text-[#616161]">{note}</p>}
        {st === 'unavailable' && <p className="text-xs text-[#8e0b21]">Could not be supplied. Adjust the total or refund if the customer has already paid.</p>}

        {splitEditing && splitting && (
          <div className="rounded-lg bg-[#f7f7f7] p-3 space-y-2.5">
            <p className="text-sm sm:text-[13px] font-semibold text-[#1a1a1a]">Short supply · ordered {item.qty}</p>
            <label className="block space-y-1.5">
              <span className="text-sm sm:text-[13px] font-medium text-[#303030]">How many can you supply now?</span>
              <input inputMode="decimal" value={splitting.keep} onChange={(e) => setSplitting({ ...splitting, keep: e.target.value })} placeholder={`1 to ${Number(item.qty) - 1}`} className={inputCls} />
            </label>
            <div className="space-y-1.5">
              <p className="text-sm sm:text-[13px] font-medium text-[#303030]">The rest</p>
              <div className="flex gap-1.5 flex-wrap">
                {([['stock', 'Wait for stock'], ['date', 'Deliver on a date']] as ['stock' | 'date', string][]).map(([m, label]) => (
                  <button key={m} type="button" onClick={() => setSplitting({ ...splitting, mode: m })}
                    className={`min-h-8 px-2.5 rounded-lg text-xs font-medium ${splitting.mode === m ? 'bg-[#303030] text-white' : 'bg-white text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]'}`}>{label}</button>
                ))}
              </div>
              {splitting.mode === 'date' && <input type="date" min={todayStr()} value={splitting.date} onChange={(e) => setSplitting({ ...splitting, date: e.target.value })} className={inputCls} />}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => saveSplit(item)} disabled={busy} className="flex-1 min-h-10 sm:min-h-9 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-sm sm:text-[13px] font-medium text-white disabled:opacity-50">Split item</button>
              <button type="button" onClick={() => setSplitting(null)} className="min-h-10 sm:min-h-9 px-3 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]">Cancel</button>
            </div>
          </div>
        )}

        {editing && rescheduling && (
          <div className="rounded-lg bg-[#f7f7f7] p-3 space-y-2.5">
            <p className="text-sm sm:text-[13px] font-semibold text-[#1a1a1a]">Deliver this item on</p>
            <div className="flex flex-wrap gap-1.5">
              {upcomingBatches(od && od > todayStr() ? od : todayStr()).map((b) => (
                <button key={b.id} type="button" onClick={() => setRescheduling({ ...rescheduling, date: b.delivery_date })}
                  className={`min-h-8 px-2.5 rounded-lg text-xs font-medium ${rescheduling.date === b.delivery_date ? 'bg-[#303030] text-white' : 'bg-white text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]'}`}>
                  {b.name} · {fmtDay(b.delivery_date)}
                </button>
              ))}
            </div>
            <input type="date" min={todayStr()} value={rescheduling.date} onChange={(e) => setRescheduling({ ...rescheduling, date: e.target.value })} className={inputCls} />
            <input value={rescheduling.note} onChange={(e) => setRescheduling({ ...rescheduling, note: e.target.value })} placeholder="Note (e.g. Fresh stock arrives Monday)" className={inputCls} />
            <div className="flex gap-2">
              <button type="button" onClick={() => saveReschedule(o, item)} disabled={busy} className="flex-1 min-h-10 sm:min-h-9 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-sm sm:text-[13px] font-medium text-white disabled:opacity-50">Save date</button>
              <button type="button" onClick={() => setRescheduling(null)} className="min-h-10 sm:min-h-9 px-3 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]">Cancel</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const sortedItems = selectedOrder ? [...selectedOrder.items].sort((a, b) => String(itemDate(selectedOrder, a) || '').localeCompare(String(itemDate(selectedOrder, b) || ''))) : [];
  const multiDates = selectedOrder ? new Set(selectedOrder.items.map((i) => itemDate(selectedOrder, i) || '')).size > 1 : false;

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Orders</h1>
        <div className="flex items-center gap-2">
          {/* VIEW MODE TOGGLE BUTTONS */}
          <div className="bg-white p-1 rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.12)] flex items-center">
            <button
              onClick={() => setViewMode('list')}
              className={`min-h-8 px-2.5 sm:px-3 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#303030] text-white'
                  : 'text-[#616161] hover:text-[#1a1a1a] hover:bg-gray-100'
              }`}
            >
              <List size={14} /> <span className="hidden sm:inline">List View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`min-h-8 px-2.5 sm:px-3 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                viewMode === 'map'
                  ? 'bg-[#004d3b] text-white'
                  : 'text-[#616161] hover:text-[#1a1a1a] hover:bg-gray-100'
              }`}
            >
              <MapIcon size={14} /> <span className="hidden sm:inline">Map View</span>
            </button>
          </div>

          <button onClick={() => load(true)} disabled={refreshing} className="min-h-10 sm:min-h-8 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50 disabled:opacity-60" aria-label="Refresh orders">
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> <span className="hidden sm:inline">Refresh</span>
          </button>
          <button onClick={exportCsv} disabled={!filtered.length} className="min-h-10 sm:min-h-8 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50 disabled:opacity-50">
            <Download size={14} /> <span className="hidden sm:inline">Export</span>
          </button>
          <Link href="/orders/create" className="min-h-10 sm:min-h-8 px-3 sm:px-3 inline-flex items-center gap-1.5 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-sm sm:text-[13px] font-medium text-white transition-colors">
            <Plus size={15} /> Create order
          </Link>
        </div>
      </div>

      {/* KPI STRIP */}
      <Card className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-200/80">
        <Kpi label="Orders" value={String(stats.orders)} loading={loading} />
        <Kpi label="Revenue" value={formatCurrency(stats.revenue)} loading={loading} />
        <Kpi label="Awaiting action" value={String(stats.awaiting)} warn={stats.awaiting > 0} loading={loading} />
        <Kpi label="Delivered" value={String(stats.delivered)} loading={loading} />
      </Card>

      {/* MAP VIEW OR LIST VIEW */}
      {viewMode === 'map' ? (
        <OrdersMapView orders={filtered} onSelectOrder={(id: string) => setSelectedOrderId(id)} />
      ) : (
        /* LIST VIEW CARD */
        <Card className="overflow-hidden">
        <div className="px-3 sm:px-4 pt-3 space-y-3">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {[{ value: 'all', label: 'All' }, ...STATUSES].map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`min-h-9 py-1.5 px-3 rounded-lg text-sm sm:text-[13px] whitespace-nowrap transition-colors ${
                  tab === t.value ? 'bg-[#303030] text-white font-medium' : 'text-[#303030] hover:bg-gray-100'
                }`}
              >
                {t.label} <span className={tab === t.value ? 'text-white/70' : 'text-[#8a8a8a]'}>{counts[t.value] ?? 0}</span>
              </button>
            ))}
          </div>

          <div className={`grid grid-cols-2 gap-2 ${fulfillmentReady ? 'lg:grid-cols-[1fr_150px_150px_150px_170px]' : 'lg:grid-cols-[1fr_150px_150px_150px]'}`}>
            <div className="relative col-span-2 lg:col-span-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]" />
              <input placeholder="Search order, customer or phone" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`${inputCls} pl-9`} />
            </div>
            <select value={range} onChange={(e) => setRange(e.target.value)} className={`${inputCls} cursor-pointer`} aria-label="Date range">
              {RANGES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className={`${inputCls} cursor-pointer`} aria-label="Sales channel">
              <option value="all">All channels</option>
              {sources.map((s) => <option key={s} value={s}>{sourceLabel(s)}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className={`${inputCls} cursor-pointer col-span-2 lg:col-span-1`} aria-label="Sort">
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            {fulfillmentReady && (
              <select value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)} className={`${inputCls} cursor-pointer col-span-2 lg:col-span-1`} aria-label="Batch">
                <option value="all">All batches</option>
                {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                <option value="none">No batch</option>
              </select>
            )}
          </div>
        </div>

        {/* bulk bar */}
        {selected.size > 0 && (
          <div className="mt-3 mx-3 sm:mx-4 px-3 py-2 rounded-lg bg-[#f1f1f1] flex flex-wrap items-center gap-3">
            <span className="text-sm sm:text-[13px] font-medium text-[#1a1a1a]">{selected.size} selected</span>

            <button
              onClick={handleBulkPrint}
              className="min-h-9 px-3 inline-flex items-center gap-1.5 rounded-lg bg-[#004d3b] hover:bg-[#00382b] text-white text-sm sm:text-[13px] font-semibold shadow-sm transition-colors"
            >
              <Printer size={14} /> Print Invoices ({selected.size})
            </button>

            <div className="relative">
              <select
                value=""
                disabled={bulkBusy}
                onChange={(e) => handleBulkStatus(e.target.value)}
                className="appearance-none min-h-9 pl-3 pr-8 rounded-lg bg-white text-sm sm:text-[13px] font-medium shadow-[0_0_0_1px_rgba(0,0,0,0.15)] cursor-pointer disabled:opacity-60"
              >
                <option value="" disabled>Update status…</option>
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#616161]" />
            </div>
            {bulkBusy && <Loader2 size={15} className="animate-spin text-[#616161]" />}
            <button onClick={() => setSelected(new Set())} className="ml-auto text-sm sm:text-[13px] text-[#005bd3] hover:underline">Clear</button>
          </div>
        )}

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto mt-3">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="bg-[#f7f7f7] text-[#616161] border-y border-gray-200/80">
                <th className="w-10 pl-4 py-2"><Check3 checked={allShownSelected} onChange={toggleAll} label="Select all" /></th>
                <th className="font-medium px-3 py-2">Order</th>
                <th className="font-medium px-3 py-2">Date</th>
                {fulfillmentReady && <th className="font-medium px-3 py-2">Delivery</th>}
                <th className="font-medium px-3 py-2">Customer</th>
                <th className="font-medium px-3 py-2">Channel</th>
                <th className="font-medium px-3 py-2">Status</th>
                <th className="font-medium px-3 py-2">Items</th>
                <th className="font-medium pl-3 pr-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}><td colSpan={fulfillmentReady ? 9 : 8} className="px-5 py-3.5"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                ))
              ) : shown.length === 0 ? (
                <tr><td colSpan={fulfillmentReady ? 9 : 8} className="py-14 text-center text-[#616161]">No orders match this view.</td></tr>
              ) : (
                shown.map((o) => (
                  <tr key={o.id} onClick={() => setSelectedOrderId(o.id)} className={`cursor-pointer transition-colors ${selected.has(o.id) ? 'bg-[#f7f7f7]' : 'hover:bg-[#fafafa]'}`}>
                    <td className="pl-4 py-3" onClick={(e) => e.stopPropagation()}><Check3 checked={selected.has(o.id)} onChange={() => toggleOne(o.id)} label={`Select order ${o.orderId}`} /></td>
                    <td className="px-3 py-3 font-semibold text-[#1a1a1a]">#{o.orderId}</td>
                    <td className="px-3 py-3 text-[#616161] whitespace-nowrap">{fmtDate(o.createdAt)}</td>
                    {fulfillmentReady && (
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-[#303030]">{fmtDay(orderDelivery(o))}</div>
                        <div className="flex gap-1 mt-0.5">{renderFlags(o)}</div>
                      </td>
                    )}
                    <td className="px-3 py-3">
                      <div className="text-[#1a1a1a] font-medium">{customerName(o)}</div>
                      <div className="text-xs text-[#616161]">{o.shipping?.phone || o.userPhone}</div>
                    </td>
                    <td className="px-3 py-3 text-[#303030]">
                      <span className="inline-flex items-center gap-1.5 text-[#616161]">{sourceIcon(String(o.orderSource))}{sourceLabel(String(o.orderSource))}</span>
                    </td>
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <StatusSelect order={o} busy={updatingStatusId === o.id} onChange={(s) => handleStatusChange(o, s)} />
                    </td>
                    <td className="px-3 py-3 text-[#616161] tabular-nums">{o.items.length} {o.items.length === 1 ? 'item' : 'items'}</td>
                    <td className="pl-3 pr-4 py-3 text-right font-medium text-[#1a1a1a] tabular-nums">{formatCurrency(o.total)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden mt-3 border-t border-gray-100 divide-y divide-gray-100">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="p-4"><div className="h-14 bg-gray-100 rounded-lg animate-pulse" /></div>)
          ) : shown.length === 0 ? (
            <p className="py-12 text-center text-sm text-[#616161]">No orders match this view.</p>
          ) : (
            shown.map((o) => (
              <div key={o.id} onClick={() => setSelectedOrderId(o.id)} className="p-4 space-y-2.5 active:bg-[#fafafa]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="pt-0.5" onClick={(e) => e.stopPropagation()}><Check3 checked={selected.has(o.id)} onChange={() => toggleOne(o.id)} label={`Select order ${o.orderId}`} /></div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1a1a1a]">#{o.orderId}</p>
                      <p className="text-sm text-[#303030] truncate">{customerName(o)}</p>
                      <div className="flex gap-1 mt-1 flex-wrap">{renderFlags(o)}</div>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-[#1a1a1a] tabular-nums">{formatCurrency(o.total)}</p>
                </div>
                <div className="flex items-center justify-between gap-2 pl-8">
                  <p className="text-xs text-[#616161] min-w-0 truncate">
                    {fulfillmentReady && orderDelivery(o) ? `Delivery ${fmtDay(orderDelivery(o))} · ` : ''}{fmtDate(o.createdAt)} · {o.items.length} {o.items.length === 1 ? 'item' : 'items'}
                  </p>
                  <div onClick={(e) => e.stopPropagation()}>
                    <StatusSelect order={o} busy={updatingStatusId === o.id} onChange={(s) => handleStatusChange(o, s)} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm sm:text-[13px] text-[#616161]">
            <span>Showing {Math.min(visible, filtered.length)} of {filtered.length}</span>
            {visible < filtered.length && (
              <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="min-h-9 py-1.5 px-3 rounded-lg bg-white font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50">Show more</button>
            )}
          </div>
        )}
      </Card>
      )}

      {/* ORDER DRAWER */}
      {selectedOrder && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[60]" onClick={() => !isSwapping && setSelectedOrderId(null)} />
          <aside className="fixed inset-y-0 right-0 w-full max-w-xl bg-[#f1f1f1] shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-200">
            <div className="px-4 sm:px-5 py-3 bg-white border-b border-gray-200 flex items-start justify-between gap-3 shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-semibold text-[#1a1a1a]">#{selectedOrder.orderId}</h2>
                  <Pill tone={STATUS_TONE[selectedOrder.status] || STATUS_TONE.pending}>{pretty(selectedOrder.status)}</Pill>
                </div>
                <p className="text-xs text-[#616161] mt-0.5 flex items-center gap-1.5">
                  {sourceIcon(String(selectedOrder.orderSource))} {sourceLabel(String(selectedOrder.orderSource))} · {fmtDate(selectedOrder.createdAt)}
                </p>
                {fulfillmentReady && orderDelivery(selectedOrder) && (
                  <p className="text-xs text-[#303030] mt-1 flex items-center gap-1.5">
                    <CalendarClock size={12} className="text-[#616161]" /> Delivery {fmtDay(orderDelivery(selectedOrder))}{batchName(selectedOrder) ? ` · ${batchName(selectedOrder)}` : ''}
                  </p>
                )}
              </div>
              <button onClick={() => setSelectedOrderId(null)} className="p-2 -mr-2 rounded-lg hover:bg-gray-100" aria-label="Close"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-[13px]">
              {/* customer */}
              <Card className="p-4 space-y-3">
                <h3 className="text-sm font-semibold text-[#1a1a1a] flex items-center gap-2"><User size={15} className="text-[#616161]" /> Customer</h3>
                <div>
                  <p className="font-semibold text-[#1a1a1a]">{customerName(selectedOrder)}</p>
                  <p className="text-[#616161] flex items-center gap-1.5 mt-0.5"><Phone size={13} /> {selectedOrder.shipping?.phone || selectedOrder.userPhone || '—'}</p>
                </div>
                {(() => {
                  const phone = selectedOrder.shipping?.phone || selectedOrder.userPhone || '';
                  const ten = toIndianPhone(phone);
                  return ten ? (
                    <div className="flex gap-2">
                      <a href={`tel:+91${ten}`} className="min-h-9 py-1.5 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50"><PhoneCall size={13} /> Call</a>
                      <a href={`https://wa.me/91${ten}`} target="_blank" rel="noreferrer" className="min-h-9 py-1.5 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50"><MessageSquare size={13} /> WhatsApp</a>
                    </div>
                  ) : null;
                })()}
                <div className="pt-3 border-t border-gray-100 flex gap-2 items-start">
                  <MapPin size={15} className="text-[#616161] shrink-0 mt-0.5" />
                  <p className="flex-1 text-[#303030] leading-relaxed">
                    {selectedOrder.shipping?.houseNumber || (selectedOrder.shipping as any)?.houseNo ? `${selectedOrder.shipping?.houseNumber || (selectedOrder.shipping as any)?.houseNo}, ` : ''}
                    {selectedOrder.shipping?.address || 'No address on file'}
                    <br />
                    {[selectedOrder.shipping?.city, selectedOrder.shipping?.pincode].filter(Boolean).join(' - ')}
                  </p>
                  <button onClick={() => copyAddress(selectedOrder)} className="p-2 -m-1 rounded-lg text-[#616161] hover:bg-gray-100" aria-label="Copy address" title="Copy address">
                    {copied ? <Check size={15} className="text-[#014b40]" /> : <Copy size={15} />}
                  </button>
                </div>

                {/* Single Order Embedded Mini Map */}
                <SingleOrderMiniMap
                  lat={(selectedOrder.shipping as any)?.lat ?? (selectedOrder.shipping as any)?.latitude}
                  lng={(selectedOrder.shipping as any)?.lng ?? (selectedOrder.shipping as any)?.longitude}
                  address={selectedOrder.shipping?.address}
                  orderId={selectedOrder.orderId}
                />
              </Card>

              {/* items */}
              <Card className="overflow-hidden">
                <div className="px-4 py-3 flex items-center gap-2">
                  <Box size={15} className="text-[#616161]" />
                  <h3 className="text-sm font-semibold text-[#1a1a1a]">Items ({selectedOrder.items.length})</h3>
                </div>
                <div className="divide-y divide-gray-100 border-t border-gray-100">
                  {sortedItems.map((item, i) => {
                    const canSwap = selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled';
                    const dThis = itemDate(selectedOrder, item);
                    const showHead = fulfillmentReady && multiDates && (i === 0 || dThis !== itemDate(selectedOrder, sortedItems[i - 1]));
                    return (
                      <div key={item.id || i} className="p-4 space-y-3">
                        {showHead && (
                          <p className="text-xs font-semibold text-[#303030] bg-[#f1f1f1] rounded-md px-2 py-1 w-fit flex items-center gap-1.5">
                            <CalendarClock size={12} /> Delivery {fmtDay(dThis)}
                          </p>
                        )}
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-[#1a1a1a]">{item.name}</p>
                            <p className="text-xs text-[#616161] mt-0.5">{item.unit} · {formatCurrency(item.price)} × {item.qty}</p>
                          </div>
                          <p className="font-medium text-[#1a1a1a] tabular-nums">{formatCurrency(item.subtotal)}</p>
                        </div>

                        {renderFulfillment(selectedOrder, item)}

                        {replacingItemId === item.id ? (
                          <div className="rounded-lg bg-[#f7f7f7] p-3 space-y-2.5">
                            <p className="font-semibold text-[#1a1a1a]">Replace {item.name}</p>
                            <input value={replacementSearch} onChange={(e) => setReplacementSearch(e.target.value)} placeholder="Search replacement product" className={inputCls} />
                            <select value={selectedReplacementVariant} onChange={(e) => setSelectedReplacementVariant(e.target.value)} className={`${inputCls} cursor-pointer`}>
                              {replacementOptions.length === 0 && <option value="">No matching products</option>}
                              {replacementOptions.map((p) => (
                                <optgroup key={p.id} label={p.name}>
                                  {p.product_variants.map((v) => (
                                    <option key={v.id} value={v.id}>{v.unit} — ₹{v.price}</option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                            <input value={replaceReason} onChange={(e) => setReplaceReason(e.target.value)} placeholder="Reason for replacement" className={inputCls} />
                            <div className="flex gap-2 pt-0.5">
                              <button type="button" onClick={() => handleExecuteSwapItem(item)} disabled={isSwapping || !selectedReplacementVariant} className="flex-1 min-h-10 sm:min-h-9 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-sm sm:text-[13px] font-medium text-white disabled:opacity-50 inline-flex items-center justify-center gap-2">
                                {isSwapping ? <><Loader2 size={14} className="animate-spin" /> Replacing…</> : 'Confirm replacement'}
                              </button>
                              <button type="button" onClick={() => setReplacingItemId(null)} disabled={isSwapping} className="min-h-10 sm:min-h-9 px-3 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50">Cancel</button>
                            </div>
                          </div>
                        ) : canSwap ? (
                          <button type="button" onClick={() => setReplacingItemId(item.id)} className="min-h-9 py-1.5 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50">
                            <RefreshCw size={13} /> Replace item
                          </button>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                {/* totals */}
                {(() => {
                  const sub = selectedOrder.items.reduce((s, i) => s + (Number(i.subtotal) || 0), 0);
                  const extra = Number(selectedOrder.total) - sub;
                  return (
                    <div className="border-t border-gray-100 p-4 space-y-1.5">
                      <div className="flex justify-between text-[#616161]"><span>Subtotal</span><span className="tabular-nums">{formatCurrency(sub)}</span></div>
                      {Math.abs(extra) > 0.5 && <div className="flex justify-between text-[#616161]"><span>Delivery & other</span><span className="tabular-nums">{formatCurrency(extra)}</span></div>}
                      <div className="flex justify-between font-semibold text-[#1a1a1a] text-sm pt-1.5 border-t border-gray-100"><span>Total</span><span className="tabular-nums">{formatCurrency(selectedOrder.total)}</span></div>
                    </div>
                  );
                })()}
              </Card>

              {/* timeline */}
              {selectedOrder.itemChanges && selectedOrder.itemChanges.length > 0 && (
                <Card className="p-4">
                  <h3 className="text-sm font-semibold text-[#1a1a1a] flex items-center gap-2 mb-3"><History size={15} className="text-[#616161]" /> Item changes</h3>
                  <ol className="relative border-l border-gray-200 ml-1.5 space-y-4">
                    {selectedOrder.itemChanges.map((ch, i) => (
                      <li key={i} className="pl-4 relative">
                        <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#303030] ring-2 ring-white" />
                        <p className="font-medium text-[#1a1a1a]">{pretty(ch.change_type)}{ch.reason ? ` · ${ch.reason}` : ''}</p>
                        <p className="text-xs text-[#616161] mt-0.5">₹{ch.old_unit_price} → ₹{ch.new_unit_price}</p>
                        <p className="text-xs text-[#8a8a8a] mt-0.5">{fmtDate(ch.created_at)}</p>
                      </li>
                    ))}
                  </ol>
                </Card>
              )}
            </div>

            {/* footer */}
            <div className="p-4 bg-white border-t border-gray-200 shrink-0 flex flex-wrap items-center gap-2">
              <button onClick={() => printOrder(selectedOrder)} className="min-h-11 sm:min-h-9 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50">
                <Printer size={14} /> Print
              </button>
              <div className="flex-1 min-w-[160px]">
                <StatusSelect order={selectedOrder} busy={updatingStatusId === selectedOrder.id} onChange={(s) => handleStatusChange(selectedOrder, s)} block />
              </div>
            </div>
          </aside>
        </>
      )}

      {/* TOAST */}
      {toast && (
        <div role="status" className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[120] max-w-[90vw] px-4 py-2.5 rounded-lg text-sm sm:text-[13px] shadow-lg ${toast.type === 'error' ? 'bg-[#fed1d7] text-[#8e0b21]' : 'bg-[#303030] text-white'}`}>
          {toast.text}
        </div>
      )}
    </div>
  );
}

// ---------- UI primitives ----------

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] ${className}`}>{children}</div>;
}

function Kpi({ label, value, warn, loading }: { label: string; value: string; warn?: boolean; loading: boolean }) {
  return (
    <div className="p-4 sm:p-5">
      <p className="text-sm sm:text-[13px] text-[#616161]">{label}</p>
      {loading ? <div className="h-7 w-20 bg-gray-100 rounded mt-2 animate-pulse" /> : <p className={`text-[22px] font-semibold mt-1.5 leading-none ${warn ? 'text-[#5e4200]' : 'text-[#1a1a1a]'}`}>{value}</p>}
    </div>
  );
}

function Pill({ children, tone }: { children: React.ReactNode; tone: string }) {
  return <span className={`inline-flex items-center px-2 h-5 rounded-full text-[11px] font-medium whitespace-nowrap ${tone}`}>{children}</span>;
}

function Check3({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return <input type="checkbox" checked={checked} onChange={onChange} aria-label={label} className="w-4 h-4 rounded border-gray-300 accent-[#303030] cursor-pointer" />;
}

function StatusSelect({ order, busy, onChange, block }: { order: AdminOrder; busy?: boolean; onChange: (s: string) => void; block?: boolean }) {
  return (
    <div className={`relative ${block ? 'w-full' : 'inline-block'}`}>
      <select
        value={order.status}
        disabled={busy}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`Status for order ${order.orderId}`}
        className={`appearance-none cursor-pointer outline-none font-medium disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[#005bd3] ${
          block
            ? `w-full min-h-11 sm:min-h-9 pl-3 pr-8 rounded-lg text-sm sm:text-[13px] shadow-[0_0_0_1px_rgba(0,0,0,0.15)] bg-white text-[#303030]`
            : `min-h-8 pl-2.5 pr-7 rounded-full text-xs ${STATUS_TONE[order.status] || STATUS_TONE.pending}`
        }`}
      >
        {STATUSES.map((s) => <option key={s.value} value={s.value}>{block ? `Status: ${s.label}` : s.label}</option>)}
      </select>
      {busy ? (
        <Loader2 size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin pointer-events-none" />
      ) : (
        <ChevronDown size={block ? 14 : 12} className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${block ? 'right-3 text-[#616161]' : 'right-2.5 opacity-70'}`} />
      )}
    </div>
  );
}