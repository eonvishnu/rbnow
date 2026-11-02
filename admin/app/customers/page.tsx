"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, MessageSquare, Download, ArrowUpDown, ArrowUp, ArrowDown, Phone, Mail, ShoppingBag } from 'lucide-react';
import { getAdminCustomers, getCustomerOrderHistory } from '@/features/customers/services/customers.service';
import type { AdminCustomer, CustomerOrder } from '@/features/customers/types/customer';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

const DAY = 86400000;
const PAGE_SIZE = 25;

type SegmentId = 'all' | 'vip' | 'repeat' | 'new' | 'risk';
type SortKey = 'name' | 'orders' | 'spent' | 'last';

const STATUS_TONE: Record<string, string> = {
  pending: 'bg-[#e3e3e3] text-[#303030]',
  processing: 'bg-[#ffd6a4] text-[#5e4200]',
  out_for_delivery: 'bg-[#a4e8f2] text-[#00424d]',
  delivered: 'bg-[#cdfed4] text-[#014b40]',
  confirmed: 'bg-[#cdfed4] text-[#014b40]',
  cancelled: 'bg-[#fed1d7] text-[#8e0b21]',
};
const pretty = (s: string) => (s || '').replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

// Normalise to a 10-digit Indian number; returns null if it doesn't look valid
const toIndianPhone = (raw: string) => {
  const digits = (raw || '').replace(/\D/g, '');
  const ten = digits.length >= 10 ? digits.slice(-10) : '';
  return /^[6-9]\d{9}$/.test(ten) ? ten : null;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [segment, setSegment] = useState<SegmentId>('all');
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'spent', dir: 'desc' });
  const [visible, setVisible] = useState(PAGE_SIZE);

  const [selected, setSelected] = useState<AdminCustomer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setCustomers(await getAdminCustomers());
      } catch (err) {
        console.error('CRM Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  useEffect(() => {
    if (!selected) { setCustomerOrders([]); return; }
    setOrdersLoading(true);
    getCustomerOrderHistory(selected.id)
      .then((orders) => setCustomerOrders(orders))
      .catch((error: unknown) => console.error('Customer order history fetch error:', error))
      .finally(() => setOrdersLoading(false));
  }, [selected]);

  // Close drawer on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openWhatsApp = (c: AdminCustomer) => {
    const phone = toIndianPhone(c.phoneNumber);
    if (!phone) return;
    const msg = `Hi ${c.displayName || 'there'}, we miss you at Royal Bengal! Use promo code "ROYAL10" for 10% OFF your next order of fresh Padma Hilsa & delicacies. Order here: https://rbnowin.web.app`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const stats = useMemo(() => {
    const n = customers.length;
    const ltv = customers.reduce((s, c) => s + c.totalSpent, 0);
    return {
      total: n,
      avgLtv: n ? Math.round(ltv / n) : 0,
      repeatRate: n ? Math.round((customers.filter((c) => c.isRepeat).length / n) * 100) : 0,
      vip: customers.filter((c) => c.isVip).length,
    };
  }, [customers]);

  const segments: { id: SegmentId; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: customers.length },
    { id: 'vip', label: 'VIP', count: customers.filter((c) => c.isVip).length },
    { id: 'repeat', label: 'Repeat', count: customers.filter((c) => c.isRepeat).length },
    { id: 'new', label: 'New', count: customers.filter((c) => c.isNew).length },
    { id: 'risk', label: 'At risk', count: customers.filter((c) => c.isAtRisk).length },
  ];

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = customers.filter((c) => {
      const match = !q || c.displayName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phoneNumber.includes(q);
      const seg =
        segment === 'all' ? true : segment === 'vip' ? c.isVip : segment === 'repeat' ? c.isRepeat : segment === 'new' ? c.isNew : c.isAtRisk;
      return match && seg;
    });
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      switch (sort.key) {
        case 'name': return a.displayName.localeCompare(b.displayName) * dir;
        case 'orders': return (a.orderCount - b.orderCount) * dir;
        case 'last': return ((a.lastOrderDate?.getTime() || 0) - (b.lastOrderDate?.getTime() || 0)) * dir;
        default: return (a.totalSpent - b.totalSpent) * dir;
      }
    });
  }, [customers, searchQuery, segment, sort]);

  useEffect(() => setVisible(PAGE_SIZE), [searchQuery, segment, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'name' ? 'asc' : 'desc' }));

  const exportCsv = () => {
    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const rows = [
      ['Name', 'Email', 'Phone', 'Orders', 'Total spent', 'Last order', 'Customer since'],
      ...filtered.map((c) => [
        c.displayName, c.email, c.phoneNumber, c.orderCount, c.totalSpent,
        c.lastOrderDate ? c.lastOrderDate.toISOString().slice(0, 10) : '', c.createdAt.toISOString().slice(0, 10),
      ]),
    ];
    const blob = new Blob([rows.map((r) => r.map(esc).join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const fmtDate = (d: Date | null) => (d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
  const isStaff = (r: string) => r && r !== 'customer';

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Customers</h1>
        <button
          onClick={exportCsv}
          disabled={!filtered.length}
          className="h-8 px-3 rounded-lg bg-white text-[13px] font-medium inline-flex items-center gap-1.5 shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50 disabled:opacity-50"
        >
          <Download size={14} /> Export
        </button>
      </div>

      {/* KPI STRIP */}
      <Card className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-200/80">
        <Kpi label="Total customers" value={stats.total.toLocaleString('en-IN')} loading={loading} />
        <Kpi label="Average lifetime value" value={formatCurrency(stats.avgLtv)} loading={loading} />
        <Kpi label="Repeat customer rate" value={`${stats.repeatRate}%`} loading={loading} />
        <Kpi label="VIP customers (₹5,000+)" value={String(stats.vip)} loading={loading} />
      </Card>

      {/* TABLE CARD */}
      <Card className="overflow-hidden">
        <div className="px-3 sm:px-4 pt-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {segments.map((s) => (
              <button
                key={s.id}
                onClick={() => setSegment(s.id)}
                className={`h-8 px-3 rounded-lg text-[13px] whitespace-nowrap transition-colors ${
                  segment === s.id ? 'bg-[#303030] text-white font-medium' : 'text-[#303030] hover:bg-gray-100'
                }`}
              >
                {s.label} <span className={segment === s.id ? 'text-white/70' : 'text-[#8a8a8a]'}>{s.count}</span>
              </button>
            ))}
          </div>
          <div className="relative lg:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]" />
            <input
              placeholder="Search name, email or phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-9 pr-3 rounded-lg text-[13px] shadow-[0_0_0_1px_rgba(0,0,0,0.15)] outline-none focus:shadow-[0_0_0_2px_#005bd3]"
            />
          </div>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="bg-[#f7f7f7] text-[#616161] border-y border-gray-200/80">
                <SortTh label="Customer" k="name" sort={sort} onSort={toggleSort} className="pl-4 sm:pl-5" />
                <th className="font-medium px-3 py-2">Contact</th>
                <SortTh label="Orders" k="orders" sort={sort} onSort={toggleSort} />
                <SortTh label="Last order" k="last" sort={sort} onSort={toggleSort} />
                <SortTh label="Total spent" k="spent" sort={sort} onSort={toggleSort} right className="pr-4 sm:pr-5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-5 py-3.5"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-14 text-center text-[#616161]">No customers match your search or filter.</td></tr>
              ) : (
                filtered.slice(0, visible).map((c) => (
                  <tr key={c.id} onClick={() => setSelected(c)} className="hover:bg-[#fafafa] cursor-pointer transition-colors">
                    <td className="pl-4 sm:pl-5 pr-3 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={c.displayName} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-[#1a1a1a] truncate">{c.displayName}</span>
                            {c.isVip && <Pill tone="bg-[#ffd6a4] text-[#5e4200]">VIP</Pill>}
                            {c.isNew && <Pill tone="bg-[#a4e8f2] text-[#00424d]">New</Pill>}
                            {c.isAtRisk && <Pill tone="bg-[#fed1d7] text-[#8e0b21]">At risk</Pill>}
                            {isStaff(c.role) && <Pill tone="bg-[#e3e3e3] text-[#303030]">{pretty(c.role)}</Pill>}
                          </div>
                          <p className="text-xs text-[#616161] truncate">{c.email || 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[#303030]">{c.phoneNumber || <span className="text-[#8a8a8a]">—</span>}</td>
                    <td className="px-3 py-3 tabular-nums">{c.orderCount} {c.orderCount === 1 ? 'order' : 'orders'}</td>
                    <td className="px-3 py-3 text-[#616161]">{fmtDate(c.lastOrderDate)}</td>
                    <td className="pl-3 pr-4 sm:pr-5 py-3 text-right font-medium text-[#1a1a1a] tabular-nums">{formatCurrency(c.totalSpent)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length > 0 && (
          <div className="px-4 sm:px-5 py-3 border-t border-gray-100 flex items-center justify-between text-[13px] text-[#616161]">
            <span>Showing {Math.min(visible, filtered.length)} of {filtered.length}</span>
            {visible < filtered.length && (
              <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="h-8 px-3 rounded-lg bg-white font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50">
                Show more
              </button>
            )}
          </div>
        )}
      </Card>

      {/* DETAIL DRAWER (read-only) */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[60]" onClick={() => setSelected(null)} />
          <aside className="fixed inset-y-0 right-0 w-full max-w-lg bg-[#f1f1f1] shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-200">
            <div className="h-14 px-5 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
              <h2 className="text-sm font-semibold text-[#1a1a1a]">Customer details</h2>
              <button onClick={() => setSelected(null)} className="p-2 -mr-2 rounded-lg hover:bg-gray-100" aria-label="Close"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-[13px]">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar name={selected.displayName} size="lg" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-base font-semibold text-[#1a1a1a]">{selected.displayName}</h3>
                      {selected.isVip && <Pill tone="bg-[#ffd6a4] text-[#5e4200]">VIP</Pill>}
                      {isStaff(selected.role) && <Pill tone="bg-[#e3e3e3] text-[#303030]">{pretty(selected.role)}</Pill>}
                    </div>
                    <p className="text-xs text-[#616161]">Customer since {fmtDate(selected.createdAt)}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-[#303030]">
                  <p className="flex items-center gap-2"><Mail size={14} className="text-[#8a8a8a]" />{selected.email || 'No email on file'}</p>
                  <p className="flex items-center gap-2"><Phone size={14} className="text-[#8a8a8a]" />{selected.phoneNumber || 'No phone on file'}</p>
                </div>
              </Card>

              <Card className="grid grid-cols-3 divide-x divide-gray-200/80">
                <MiniStat label="Total spent" value={formatCurrency(selected.totalSpent)} />
                <MiniStat label="Orders" value={String(selected.orderCount)} />
                <MiniStat label="Avg. order" value={formatCurrency(selected.orderCount ? selected.totalSpent / selected.orderCount : 0)} />
              </Card>

              <Card className="overflow-hidden">
                <div className="px-4 py-3 flex items-center gap-2">
                  <ShoppingBag size={15} className="text-[#616161]" />
                  <h3 className="text-sm font-semibold text-[#1a1a1a]">Order history</h3>
                </div>
                <div className="divide-y divide-gray-100 border-t border-gray-100">
                  {ordersLoading ? (
                    <div className="p-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></div>
                  ) : customerOrders.length === 0 ? (
                    <p className="p-6 text-center text-[#616161]">No orders placed yet.</p>
                  ) : (
                    customerOrders.map((o) => (
                      <div key={o.id} className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-[#1a1a1a]">#RB-{o.order_number || String(o.id).slice(0, 6).toUpperCase()}</p>
                            <p className="text-xs text-[#616161]">{new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-[#1a1a1a] tabular-nums">{formatCurrency(o.total || 0)}</p>
                            <Pill tone={STATUS_TONE[o.status || 'pending'] || STATUS_TONE.pending}>{pretty(o.status || 'pending')}</Pill>
                          </div>
                        </div>
                        <ul className="text-xs text-[#616161] space-y-0.5">
                          {(o.order_items || []).map((i, idx) => (
                            <li key={idx} className="flex justify-between gap-3">
                              <span className="truncate">{i.product_name} ({i.variant_unit}) × {i.quantity}</span>
                              <span className="tabular-nums text-[#303030]">₹{i.total_price}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            <div className="p-4 bg-white border-t border-gray-200 shrink-0">
              <button
                onClick={() => openWhatsApp(selected)}
                disabled={!toIndianPhone(selected.phoneNumber)}
                className="w-full h-10 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-white text-[13px] font-medium inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <MessageSquare size={15} /> Send WhatsApp offer
              </button>
              {!toIndianPhone(selected.phoneNumber) && (
                <p className="text-xs text-[#616161] text-center mt-2">A valid phone number is needed to send a WhatsApp message.</p>
              )}
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

// ---------- UI primitives ----------

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] ${className}`}>{children}</div>;
}

function Kpi({ label, value, loading }: { label: string; value: string; loading: boolean }) {
  return (
    <div className="p-4 sm:p-5">
      <p className="text-[13px] text-[#616161]">{label}</p>
      {loading ? <div className="h-7 w-20 bg-gray-100 rounded mt-2 animate-pulse" /> : <p className="text-[22px] font-semibold text-[#1a1a1a] mt-1.5 leading-none">{value}</p>}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4">
      <p className="text-xs text-[#616161]">{label}</p>
      <p className="text-base font-semibold text-[#1a1a1a] mt-1 tabular-nums">{value}</p>
    </div>
  );
}

function Pill({ children, tone }: { children: React.ReactNode; tone: string }) {
  return <span className={`inline-flex items-center px-2 h-5 rounded-full text-[11px] font-medium ${tone}`}>{children}</span>;
}

function Avatar({ name, size = 'md' }: { name: string; size?: 'md' | 'lg' }) {
  const dim = size === 'lg' ? 'w-12 h-12 text-base' : 'w-9 h-9 text-[13px]';
  return <div className={`${dim} rounded-full bg-[#e3e3e3] text-[#303030] font-semibold flex items-center justify-center shrink-0`}>{name.charAt(0).toUpperCase()}</div>;
}

function SortTh({ label, k, sort, onSort, right, className = '' }: { label: string; k: SortKey; sort: { key: SortKey; dir: 'asc' | 'desc' }; onSort: (k: SortKey) => void; right?: boolean; className?: string }) {
  const active = sort.key === k;
  const Icon = !active ? ArrowUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown;
  return (
    <th className={`font-medium px-3 py-2 ${right ? 'text-right' : ''} ${className}`}>
      <button onClick={() => onSort(k)} className={`inline-flex items-center gap-1 hover:text-[#1a1a1a] ${active ? 'text-[#1a1a1a]' : ''}`}>
        {label} <Icon size={12} />
      </button>
    </th>
  );
}