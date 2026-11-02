"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Package, Tag, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import {
  getDashboardFunnel,
  getDashboardOrders,
  getStoreOpenStatus,
  updateStoreOpenStatus,
} from '@/features/dashboard/services/dashboard.service';
import type { DashboardFunnel, DashboardOrder } from '@/features/dashboard/types/dashboard';

type Range = 'today' | '7d' | '30d' | 'all';

const RANGES: { key: Range; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
  { key: 'all', label: 'All time' },
];

const DAY = 86400000;

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

const compact = (n: number) =>
  new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(n || 0);

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

const STATUS_TONE: Record<string, string> = {
  pending: 'bg-[#e3e3e3] text-[#303030]',
  processing: 'bg-[#ffd6a4] text-[#5e4200]',
  out_for_delivery: 'bg-[#a4e8f2] text-[#00424d]',
  delivered: 'bg-[#cdfed4] text-[#014b40]',
  cancelled: 'bg-[#fed1d7] text-[#8e0b21]',
};

const statusLabel = (s: string) => (s || 'pending').replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

export default function AdminDashboard() {
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [funnel, setFunnel] = useState<DashboardFunnel>({ activeCarts: 0, convertedCarts: 0, totalCheckouts: 0 });
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<Range>('7d');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [storeStatusLoading, setStoreStatusLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const [storeResult, funnelResult] = await Promise.allSettled([
          getStoreOpenStatus(),
          getDashboardFunnel(),
        ]);
        if (storeResult.status === 'fulfilled') {
          setIsStoreOpen(storeResult.value);
        } else {
          console.error('Store status fetch error:', storeResult.reason);
        }
        if (funnelResult.status === 'fulfilled') {
          setFunnel(funnelResult.value);
        } else {
          console.error('Dashboard funnel fetch error:', funnelResult.reason);
        }
      } finally {
        setStoreStatusLoading(false);
      }
    };
    run();
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        setOrders(await getDashboardOrders());
      } catch (error) {
        console.error('Dashboard orders fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const toggleStoreStatus = async () => {
    try {
      setStoreStatusLoading(true);
      const nextStatus = !isStoreOpen;
      await updateStoreOpenStatus(nextStatus);
      setIsStoreOpen(nextStatus);
    } catch (e) {
      console.error(e);
    } finally {
      setStoreStatusLoading(false);
    }
  };

  // ---- Period math ----------------------------------------------------
  const { current, previous, days } = useMemo(() => {
    const now = Date.now();
    const today0 = startOfDay(new Date());
    const live = orders.filter((o) => o.status !== 'cancelled');
    if (range === 'all') return { current: live, previous: [] as DashboardOrder[], days: 0 };
    const len = range === 'today' ? 1 : range === '7d' ? 7 : 30;
    const from = today0 - (len - 1) * DAY;
    const prevFrom = from - len * DAY;
    return {
      current: live.filter((o) => o.createdAt >= from && o.createdAt <= now),
      previous: live.filter((o) => o.createdAt >= prevFrom && o.createdAt < from),
      days: len,
    };
  }, [orders, range]);

  const sum = (list: DashboardOrder[]) => list.reduce((s, o) => s + o.total, 0);
  const pct = (cur: number, prev: number) => (range === 'all' ? null : prev === 0 ? (cur > 0 ? 100 : null) : ((cur - prev) / prev) * 100);

  const sales = sum(current);
  const orderCount = current.length;
  const aov = orderCount ? sales / orderCount : 0;
  const uniqueCustomers = new Set(current.map((o) => o.userPhone || o.userName)).size;

  const kpis = [
    { label: 'Total sales', value: formatCurrency(sales), delta: pct(sales, sum(previous)) },
    { label: 'Orders', value: orderCount.toLocaleString('en-IN'), delta: pct(orderCount, previous.length) },
    { label: 'Average order value', value: formatCurrency(aov), delta: pct(aov, previous.length ? sum(previous) / previous.length : 0) },
    {
      label: 'Customers',
      value: uniqueCustomers.toLocaleString('en-IN'),
      delta: pct(uniqueCustomers, new Set(previous.map((o) => o.userPhone || o.userName)).size),
    },
  ];

  // ---- Chart series ---------------------------------------------------
  const series = useMemo(() => {
    const today0 = startOfDay(new Date());
    const len = range === 'today' ? 7 : range === '7d' ? 7 : range === '30d' ? 30 : 30; // today & all show a trailing window for context
    const buckets = Array.from({ length: len }, (_, i) => {
      const t = today0 - (len - 1 - i) * DAY;
      return { t, total: 0, count: 0 };
    });
    orders
      .filter((o) => o.status !== 'cancelled')
      .forEach((o) => {
        const idx = Math.floor((startOfDay(new Date(o.createdAt)) - buckets[0].t) / DAY);
        if (idx >= 0 && idx < len) {
          buckets[idx].total += o.total;
          buckets[idx].count += 1;
        }
      });
    return buckets;
  }, [orders, range]);

  const W = 640, H = 200, PAD = { l: 8, r: 8, t: 12, b: 8 };
  const max = Math.max(...series.map((s) => s.total), 1);
  const pts = series.map((s, i) => ({
    x: PAD.l + (i / Math.max(series.length - 1, 1)) * (W - PAD.l - PAD.r),
    y: PAD.t + (1 - s.total / max) * (H - PAD.t - PAD.b),
  }));
  const linePath = pts.map((p, i) => `${i ? 'L' : 'M'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaPath = pts.length ? `${linePath} L ${pts[pts.length - 1].x} ${H - PAD.b} L ${pts[0].x} ${H - PAD.b} Z` : '';
  const hover = hoverIdx !== null ? series[hoverIdx] : null;
  const fmtDay = (t: number) => new Date(t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  // ---- Operational numbers (all derived from real orders) -------------
  const counts = useMemo(() => {
    const c: Record<string, number> = { pending: 0, processing: 0, out_for_delivery: 0, delivered: 0, cancelled: 0 };
    orders.forEach((o) => { c[o.status] = (c[o.status] || 0) + 1; });
    return c;
  }, [orders]);

  const conversion = funnel.activeCarts + funnel.convertedCarts > 0
    ? (funnel.convertedCarts / (funnel.activeCarts + funnel.convertedCarts)) * 100
    : 0;

  const sourceMix = useMemo(() => {
    const m: Record<string, number> = {};
    current.forEach((o) => { m[o.source] = (m[o.source] || 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [current]);

  const todayLabel = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="space-y-5">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[#1a1a1a]">Home</h1>
          <p className="text-[13px] text-[#616161] mt-0.5">{todayLabel}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex max-w-full overflow-x-auto no-scrollbar bg-white rounded-lg p-0.5 shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`px-3 min-h-9 sm:min-h-7 py-1 text-sm sm:text-[13px] whitespace-nowrap rounded-md transition-colors ${
                  range === r.key ? 'bg-[#303030] text-white font-medium' : 'text-[#303030] hover:bg-gray-100'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <button
            onClick={toggleStoreStatus}
            disabled={storeStatusLoading}
            className="inline-flex items-center gap-2 min-h-10 sm:min-h-8 py-1.5 px-3 rounded-lg bg-white text-sm sm:text-[13px] font-medium shadow-[0_0_0_1px_rgba(0,0,0,0.08)] hover:bg-gray-50 disabled:opacity-60 transition-colors"
          >
            <span className={`w-2 h-2 rounded-full ${isStoreOpen ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            {storeStatusLoading ? 'Updating…' : isStoreOpen ? 'Store open' : 'Store closed'}
          </button>
        </div>
      </div>

      {/* KPI STRIP */}
      <Card className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-200/80">
        {kpis.map((k) => (
          <div key={k.label} className="p-4 sm:p-5">
            <p className="text-[13px] text-[#616161] underline decoration-dotted decoration-gray-300 underline-offset-4 w-fit">{k.label}</p>
            {loading ? (
              <div className="h-7 w-24 bg-gray-100 rounded mt-2 animate-pulse" />
            ) : (
              <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
                <span className="text-[22px] font-semibold text-[#1a1a1a] leading-none">{k.value}</span>
                <Delta value={k.delta} />
              </div>
            )}
          </div>
        ))}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* SALES CHART */}
        <Card className="lg:col-span-2 p-4 sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#1a1a1a]">Sales over time</h2>
              <p className="text-[13px] text-[#616161] mt-0.5">
                {hover ? `${fmtDay(hover.t)} · ${formatCurrency(hover.total)} · ${hover.count} orders` : `Last ${series.length} days`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[22px] font-semibold text-[#1a1a1a] leading-none">{formatCurrency(series.reduce((s, b) => s + b.total, 0))}</p>
            </div>
          </div>

          <div className="relative mt-4" onMouseLeave={() => setHoverIdx(null)}>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full h-48 overflow-visible"
              preserveAspectRatio="none"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - r.left) / r.width) * W;
                setHoverIdx(Math.max(0, Math.min(series.length - 1, Math.round(((x - PAD.l) / (W - PAD.l - PAD.r)) * (series.length - 1)))));
              }}
            >
              <defs>
                <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#303030" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#303030" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0.25, 0.5, 0.75].map((g) => (
                <line key={g} x1={PAD.l} x2={W - PAD.r} y1={PAD.t + g * (H - PAD.t - PAD.b)} y2={PAD.t + g * (H - PAD.t - PAD.b)} stroke="#ececec" strokeDasharray="3 4" />
              ))}
              <path d={areaPath} fill="url(#salesFill)" />
              <path d={linePath} fill="none" stroke="#303030" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              {hoverIdx !== null && pts[hoverIdx] && (
                <>
                  <line x1={pts[hoverIdx].x} x2={pts[hoverIdx].x} y1={PAD.t} y2={H - PAD.b} stroke="#c9c9c9" />
                  <circle cx={pts[hoverIdx].x} cy={pts[hoverIdx].y} r="4.5" fill="#fff" stroke="#303030" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                </>
              )}
            </svg>
            <div className="flex justify-between text-xs text-[#616161] mt-2">
              <span>{series.length ? fmtDay(series[0].t) : ''}</span>
              <span>{series.length ? fmtDay(series[Math.floor(series.length / 2)].t) : ''}</span>
              <span>{series.length ? fmtDay(series[series.length - 1].t) : ''}</span>
            </div>
          </div>
        </Card>

        {/* TO DO / NEEDS ACTION */}
        <Card className="p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-[#1a1a1a]">To do</h2>
          <div className="mt-3 -mx-2 space-y-0.5">
            <TodoRow href="/orders" tone="bg-[#e3e3e3] text-[#303030]" count={counts.pending} label="Orders to confirm" />
            <TodoRow href="/orders" tone="bg-[#ffd6a4] text-[#5e4200]" count={counts.processing} label="Orders being prepared" />
            <TodoRow href="/orders" tone="bg-[#a4e8f2] text-[#00424d]" count={counts.out_for_delivery} label="Out for delivery" />
            <TodoRow href="/carts" tone="bg-[#fed1d7] text-[#8e0b21]" count={funnel.activeCarts} label="Active carts not checked out" />
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-[13px] text-[#616161]">Cart conversion</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-lg font-semibold text-[#1a1a1a]">{conversion.toFixed(1)}%</span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#303030] rounded-full" style={{ width: `${Math.min(conversion, 100)}%` }} />
              </div>
            </div>
            <p className="text-xs text-[#616161] mt-1.5">
              {funnel.convertedCarts} converted · {funnel.totalCheckouts} checkout sessions
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* RECENT ORDERS TABLE */}
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5">
            <h2 className="text-sm font-semibold text-[#1a1a1a]">Recent orders</h2>
            <Link href="/orders" className="text-[13px] font-medium text-[#005bd3] hover:underline">View all</Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[13px] text-left">
              <thead>
                <tr className="bg-[#f7f7f7] text-[#616161] border-y border-gray-200/80">
                  <th className="font-medium px-4 sm:px-5 py-2">Order</th>
                  <th className="font-medium px-3 py-2">Customer</th>
                  <th className="font-medium px-3 py-2">Status</th>
                  <th className="font-medium px-4 sm:px-5 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={4} className="px-5 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-10 text-center text-[#616161]">No orders yet. Orders will appear here as they come in.</td></tr>
                ) : (
                  orders.slice(0, 6).map((o) => (
                    <tr key={o.id} className="hover:bg-[#fafafa] transition-colors">
                      <td className="px-4 sm:px-5 py-3">
                        <Link href="/orders" className="font-semibold text-[#1a1a1a] hover:underline">#{o.orderId}</Link>
                        <div className="text-xs text-[#616161]">
                          {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {o.itemCount} items
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[#303030]">{o.userName}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center px-2 h-6 rounded-full text-xs font-medium ${STATUS_TONE[o.status] || STATUS_TONE.pending}`}>
                          {statusLabel(o.status)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-3 text-right font-medium text-[#1a1a1a] tabular-nums">{formatCurrency(o.total)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-5">
          {/* QUICK ACTIONS */}
          <Card className="p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-[#1a1a1a]">Quick actions</h2>
            <div className="mt-3 grid gap-2">
              <ActionLink href="/orders/create" icon={<Plus size={15} />} label="Create order" primary />
              <ActionLink href="/products/add" icon={<Package size={15} />} label="Add product" />
              <ActionLink href="/coupons" icon={<Tag size={15} />} label="Create discount" />
            </div>
          </Card>

          {/* SALES BY CHANNEL */}
          <Card className="p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-[#1a1a1a]">Orders by channel</h2>
            <div className="mt-3 space-y-3">
              {sourceMix.length === 0 ? (
                <p className="text-[13px] text-[#616161]">No orders in this period.</p>
              ) : (
                sourceMix.map(([src, n]) => (
                  <div key={src}>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[#303030]">{src.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}</span>
                      <span className="text-[#616161] tabular-nums">{n}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                      <div className="h-full bg-[#303030] rounded-full" style={{ width: `${(n / orderCount) * 100}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ---------- UI primitives ----------

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] ${className}`}>{children}</div>;
}

function Delta({ value }: { value: number | null }) {
  if (value === null || !isFinite(value)) return <span className="text-xs text-[#8a8a8a] flex items-center gap-0.5"><Minus size={12} />—</span>;
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`text-xs font-medium flex items-center gap-0.5 ${up ? 'text-[#0c5132]' : 'text-[#8e0b21]'}`}>
      <Icon size={13} />
      {Math.abs(value).toFixed(0)}%
    </span>
  );
}

function TodoRow({ href, tone, count, label }: { href: string; tone: string; count: number; label: string }) {
  return (
    <Link href={href} className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors">
      <span className="flex items-center gap-2.5 text-[13px] text-[#303030]">
        <span className={`min-w-[24px] h-6 px-1.5 rounded-full text-xs font-semibold flex items-center justify-center ${tone}`}>{count}</span>
        {label}
      </span>
      <ArrowUpRight size={14} className="text-[#8a8a8a]" />
    </Link>
  );
}

function ActionLink({ href, icon, label, primary }: { href: string; icon: React.ReactNode; label: string; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={`min-h-11 sm:min-h-9 py-2 px-3 rounded-lg text-sm sm:text-[13px] font-medium inline-flex items-center gap-2 transition-colors ${
        primary
          ? 'bg-[#303030] text-white hover:bg-[#1a1a1a]'
          : 'bg-white text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}