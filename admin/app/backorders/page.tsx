"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import { splitOrderItem } from '@/lib/fulfillment';
import { ChevronDown, Loader2, PackagePlus, AlertTriangle, CalendarClock, X } from 'lucide-react';

type Tab = 'awaiting' | 'scheduled';

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const fmtDay = (d?: string | null) =>
  d ? new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : '—';
const daysSince = (iso: string) => Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000));
const num = (v: any) => Number(v) || 0;

const inputCls =
  'w-full min-h-11 sm:min-h-9 py-2 px-3 text-base sm:text-[13px] text-[#1a1a1a] placeholder:text-[#8a8a8a] bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.2)] outline-none focus:shadow-[0_0_0_2px_#005bd3] transition-shadow';

const customerOf = (o: any) => o?.user_name || o?.delivery_address?.name || 'Customer';

export default function BackordersPage() {
  const { userData } = useAuth();
  const canEdit = ['super_admin', 'admin', 'operations_staff'].includes(userData?.role || '');

  const [tab, setTab] = useState<Tab>('awaiting');
  const [rows, setRows] = useState<any[]>([]);
  const [scheduled, setScheduled] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [setupNeeded, setSetupNeeded] = useState(false);

  const [openKey, setOpenKey] = useState<string | null>(null);
  const [receive, setReceive] = useState<{ key: string; qty: string; date: string } | null>(null);
  const [lineDate, setLineDate] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [busyLine, setBusyLine] = useState<string | null>(null);

  const [toast, setToast] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const flash = (type: 'error' | 'success', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const select =
    'id, order_id, product_name, variant_unit, quantity, fulfillment_status, promised_date, fulfillment_note, orders!inner(id, order_number, status, user_name, user_phone, delivery_address, created_at, delivery_date)';

  const load = async () => {
    const [aw, sc, bt] = await Promise.all([
      supabase.from('order_items').select(select).eq('fulfillment_status', 'backordered').neq('orders.status', 'cancelled').limit(2000),
      supabase
        .from('order_items')
        .select(select)
        .in('fulfillment_status', ['pending', 'packed'])
        .not('promised_date', 'is', null)
        .gte('promised_date', todayStr())
        .neq('orders.status', 'cancelled')
        .limit(2000),
      supabase.from('order_batches').select('id, name, delivery_date, status').eq('status', 'active').gte('delivery_date', todayStr()).order('delivery_date').limit(6),
    ]);

    const err = aw.error || sc.error;
    if (err) {
      if (err.code === '42703' || err.code === '42P01' || /fulfillment_status|promised_date|check constraint/i.test(err.message || '')) setSetupNeeded(true);
      else flash('error', 'Could not load backorders.');
      setLoading(false);
      return;
    }
    setRows(aw.data || []);
    // a pending item only counts as "scheduled later" when its date is after the order's own delivery date
    setScheduled((sc.data || []).filter((r: any) => !r.orders?.delivery_date || r.promised_date > r.orders.delivery_date));
    setBatches(bt.data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !busy && setReceive(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [busy]);

  // ---------- grouping ----------
  const groups = useMemo(() => {
    const map = new Map<string, { key: string; name: string; unit: string; owed: number; lines: any[]; oldest: string }>();
    rows.forEach((r: any) => {
      const key = `${r.product_name}__${r.variant_unit}`;
      const existing = map.get(key);
      const g = existing || { key, name: r.product_name, unit: r.variant_unit, owed: 0, lines: [] as any[], oldest: r.orders.created_at };
      g.owed += num(r.quantity);
      g.lines.push(r);
      if (new Date(r.orders.created_at) < new Date(g.oldest)) g.oldest = r.orders.created_at;
      map.set(key, g);
    });
    return Array.from(map.values())
      .map((g) => ({ ...g, lines: g.lines.sort((a, b) => new Date(a.orders.created_at).getTime() - new Date(b.orders.created_at).getTime()) })) // first come, first served
      .sort((a, b) => new Date(a.oldest).getTime() - new Date(b.oldest).getTime());
  }, [rows]);

  const scheduledByDate = useMemo(() => {
    const map = new Map<string, any[]>();
    scheduled.forEach((r) => map.set(r.promised_date, [...(map.get(r.promised_date) || []), r]));
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [scheduled]);

  const stats = useMemo(
    () => ({
      lines: rows.length,
      orders: new Set(rows.map((r) => r.order_id)).size,
      products: groups.length,
      oldest: groups.length ? Math.max(...groups.map((g) => daysSince(g.oldest))) : 0,
    }),
    [rows, groups]
  );

  // ---------- stock arrived: allocate first come, first served ----------
  const plan = useMemo(() => {
    if (!receive) return null;
    const g = groups.find((x) => x.key === receive.key);
    if (!g) return null;
    let remaining = num(receive.qty);
    const full: any[] = [];
    let partial: { line: any; qty: number } | null = null;
    for (const line of g.lines) {
      if (remaining <= 0) break;
      const q = num(line.quantity);
      if (remaining >= q) { full.push(line); remaining -= q; }
      else { partial = { line, qty: remaining }; remaining = 0; }
    }
    return { group: g, full, partial, leftover: remaining };
  }, [receive, groups]);

  const applyReceive = async () => {
    if (!receive || !plan) return;
    if (!(num(receive.qty) > 0)) return flash('error', 'Enter how much stock arrived.');
    if (!receive.date || receive.date < todayStr()) return flash('error', 'Pick today or a future delivery date.');
    if (plan.full.length === 0 && !plan.partial) return flash('error', 'Nothing to allocate.');

    setBusy(true);
    let failed = 0;
    const note = `Stock arrived, delivering ${fmtDay(receive.date)}`;

    for (const line of plan.full) {
      const { error } = await supabase.from('order_items').update({ fulfillment_status: 'pending', promised_date: receive.date, fulfillment_note: note }).eq('id', line.id);
      if (error) failed++;
    }
    if (plan.partial) {
      const res = await splitOrderItem(
        plan.partial.line.id,
        plan.partial.qty,
        { status: 'backordered', promised_date: null, note: 'Still waiting for the remaining stock' },
        { fulfillment_status: 'pending', promised_date: receive.date, fulfillment_note: note }
      );
      if (!res.ok) { failed++; console.error(res.message); }
    }

    setBusy(false);
    setReceive(null);
    await load();
    failed ? flash('error', `${failed} line${failed > 1 ? 's' : ''} could not be updated. Check and try again.`) : flash('success', 'Stock allocated to waiting orders');
  };

  // ---------- single line actions ----------
  const scheduleLine = async (line: any) => {
    const date = lineDate[line.id];
    if (!date || date < todayStr()) return flash('error', 'Pick today or a future date.');
    setBusyLine(line.id);
    const { error } = await supabase.from('order_items').update({ fulfillment_status: 'pending', promised_date: date, fulfillment_note: `Rescheduled to ${fmtDay(date)}` }).eq('id', line.id);
    setBusyLine(null);
    if (error) return flash('error', 'Could not schedule the item.');
    flash('success', `Scheduled for ${fmtDay(date)}`);
    load();
  };

  const markUnavailable = async (line: any) => {
    if (!confirm(`Mark ${line.product_name} (${line.variant_unit}) × ${line.quantity} as unavailable for order #${line.orders.order_number || String(line.order_id).slice(0, 6)}?\n\nThe customer may need a refund.`)) return;
    setBusyLine(line.id);
    const { error } = await supabase.from('order_items').update({ fulfillment_status: 'unavailable', fulfillment_note: 'Could not be supplied' }).eq('id', line.id);
    setBusyLine(null);
    if (error) return flash('error', 'Could not update the item.');
    flash('success', 'Marked unavailable');
    load();
  };

  const orderNo = (o: any, id: string) => `#RB-${o?.order_number || String(id).slice(0, 6).toUpperCase()}`;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Backorders</h1>
        <p className="text-sm sm:text-[13px] text-[#616161] mt-0.5">Items customers have paid for that are waiting for stock or a later delivery.</p>
      </div>

      {setupNeeded && (
        <Card className="p-4 border-l-4 !border-l-[#ffd6a4]">
          <div className="flex gap-3">
            <AlertTriangle size={18} className="text-[#5e4200] shrink-0 mt-0.5" />
            <div className="text-sm sm:text-[13px] space-y-1">
              <p className="font-semibold text-[#1a1a1a]">One-time database setup needed</p>
              <p className="text-[#616161]">Run <code className="bg-[#f7f7f7] px-1.5 py-0.5 rounded">001_order_batches.sql</code> and then <code className="bg-[#f7f7f7] px-1.5 py-0.5 rounded">002_backorders.sql</code> in the Supabase SQL editor, then refresh.</p>
            </div>
          </div>
        </Card>
      )}

      {!setupNeeded && (
        <>
          <Card className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-200/80">
            <Kpi label="Products waiting" value={String(stats.products)} loading={loading} />
            <Kpi label="Orders affected" value={String(stats.orders)} loading={loading} />
            <Kpi label="Item lines" value={String(stats.lines)} loading={loading} />
            <Kpi label="Longest wait" value={stats.oldest ? `${stats.oldest} day${stats.oldest > 1 ? 's' : ''}` : '—'} warn={stats.oldest >= 3} loading={loading} />
          </Card>

          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {([['awaiting', 'Awaiting stock', rows.length], ['scheduled', 'Scheduled later', scheduled.length]] as [Tab, string, number][]).map(([id, label, n]) => (
              <button key={id} onClick={() => setTab(id)} className={`min-h-9 py-1.5 px-3 rounded-lg text-sm sm:text-[13px] whitespace-nowrap transition-colors ${tab === id ? 'bg-[#303030] text-white font-medium' : 'text-[#303030] hover:bg-black/5'}`}>
                {label} <span className={tab === id ? 'text-white/70' : 'text-[#8a8a8a]'}>{n}</span>
              </button>
            ))}
          </div>

          {/* AWAITING STOCK */}
          {tab === 'awaiting' && (
            loading ? (
              <Card className="p-4"><div className="h-14 bg-gray-100 rounded-lg animate-pulse" /></Card>
            ) : groups.length === 0 ? (
              <Card className="py-14 px-6 text-center text-sm sm:text-[13px] text-[#616161]">
                Nothing is waiting for stock. When an item can't be supplied, set it to "Awaiting stock" from the order details.
              </Card>
            ) : (
              <Card className="overflow-hidden divide-y divide-gray-100">
                {groups.map((g) => {
                  const open = openKey === g.key;
                  return (
                    <div key={g.key}>
                      <div className="p-4 flex items-center gap-3 flex-wrap">
                        <button onClick={() => setOpenKey(open ? null : g.key)} className="flex-1 min-w-0 text-left flex items-center gap-3" aria-expanded={open}>
                          <ChevronDown size={16} className={`text-[#616161] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#1a1a1a] truncate">{g.name} <span className="font-normal text-[#616161]">({g.unit})</span></p>
                            <p className="text-xs text-[#616161] mt-0.5">{g.lines.length} order{g.lines.length > 1 ? 's' : ''} · waiting {daysSince(g.oldest)} day{daysSince(g.oldest) === 1 ? '' : 's'}</p>
                          </div>
                        </button>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-[#1a1a1a] tabular-nums leading-none">{g.owed}</p>
                          <p className="text-xs text-[#616161]">owed</p>
                        </div>
                        {canEdit && (
                          <button
                            onClick={() => setReceive({ key: g.key, qty: String(g.owed), date: batches[0]?.delivery_date || '' })}
                            className="min-h-10 sm:min-h-9 px-3 inline-flex items-center gap-1.5 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-sm sm:text-[13px] font-medium text-white"
                          >
                            <PackagePlus size={14} /> Stock arrived
                          </button>
                        )}
                      </div>

                      {open && (
                        <div className="bg-[#f7f7f7] px-4 pb-4 pt-1 space-y-2">
                          {g.lines.map((l, idx) => (
                            <div key={l.id} className="bg-white rounded-lg p-3 shadow-[0_0_0_1px_rgba(0,0,0,0.06)] space-y-2">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="text-sm sm:text-[13px] font-semibold text-[#1a1a1a]">
                                    <Link href={`/orders?q=${encodeURIComponent(String(l.orders.order_number || l.order_id))}`} className="hover:underline">{orderNo(l.orders, l.order_id)}</Link>
                                    <span className="ml-2 text-[11px] font-medium text-[#8a8a8a]">#{idx + 1} in line</span>
                                  </p>
                                  <p className="text-xs text-[#616161]">{customerOf(l.orders)} · ordered {fmtDay(l.orders.created_at?.slice(0, 10))}</p>
                                </div>
                                <p className="text-sm font-semibold text-[#1a1a1a] tabular-nums">× {l.quantity}</p>
                              </div>
                              {canEdit && (
                                <div className="flex flex-wrap items-center gap-2">
                                  <input type="date" min={todayStr()} value={lineDate[l.id] || ''} onChange={(e) => setLineDate({ ...lineDate, [l.id]: e.target.value })} className={`${inputCls} !w-auto`} aria-label="Delivery date" />
                                  <button disabled={busyLine === l.id} onClick={() => scheduleLine(l)} className="min-h-10 sm:min-h-9 px-3 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50 disabled:opacity-50">Schedule</button>
                                  <button disabled={busyLine === l.id} onClick={() => markUnavailable(l)} className="min-h-10 sm:min-h-9 px-2 text-sm sm:text-[13px] font-medium text-[#8e0b21] hover:underline disabled:opacity-50">Unavailable</button>
                                  {busyLine === l.id && <Loader2 size={14} className="animate-spin text-[#616161]" />}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </Card>
            )
          )}

          {/* SCHEDULED LATER */}
          {tab === 'scheduled' && (
            loading ? (
              <Card className="p-4"><div className="h-14 bg-gray-100 rounded-lg animate-pulse" /></Card>
            ) : scheduledByDate.length === 0 ? (
              <Card className="py-14 px-6 text-center text-sm sm:text-[13px] text-[#616161]">No items are scheduled for a later delivery.</Card>
            ) : (
              <div className="space-y-4">
                {scheduledByDate.map(([date, list]) => (
                  <Card key={date} className="overflow-hidden">
                    <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-100">
                      <CalendarClock size={15} className="text-[#616161]" />
                      <h2 className="text-sm font-semibold text-[#1a1a1a]">{fmtDay(date)}</h2>
                      <span className="text-xs text-[#616161]">{list.length} item{list.length > 1 ? 's' : ''}</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {list.map((l) => (
                        <div key={l.id} className="px-4 py-3 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm sm:text-[13px] font-medium text-[#1a1a1a]">{l.product_name} <span className="text-[#616161] font-normal">({l.variant_unit}) × {l.quantity}</span></p>
                            <p className="text-xs text-[#616161]">
                              <Link href={`/orders?q=${encodeURIComponent(String(l.orders.order_number || l.order_id))}`} className="hover:underline">{orderNo(l.orders, l.order_id)}</Link> · {customerOf(l.orders)}
                              {l.fulfillment_note ? ` · ${l.fulfillment_note}` : ''}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-2 h-5 rounded-full text-[11px] font-medium ${l.fulfillment_status === 'packed' ? 'bg-[#a4e8f2] text-[#00424d]' : 'bg-[#e3e3e3] text-[#303030]'}`}>
                            {l.fulfillment_status === 'packed' ? 'Packed' : 'To pack'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )
          )}
        </>
      )}

      {/* STOCK ARRIVED DRAWER */}
      {receive && plan && (
        <div className="relative z-[100]">
          <div className="fixed inset-0 bg-black/40" onClick={() => !busy && setReceive(null)} />
          <aside className="fixed inset-y-0 right-0 w-full max-w-md bg-[#f1f1f1] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="px-4 sm:px-5 py-3 bg-white border-b border-gray-200 flex items-start justify-between shrink-0">
              <div>
                <h2 className="text-sm font-semibold text-[#1a1a1a]">Stock arrived</h2>
                <p className="text-xs text-[#616161]">{plan.group.name} ({plan.group.unit}) · {plan.group.owed} owed</p>
              </div>
              <button onClick={() => setReceive(null)} disabled={busy} className="p-2 -mr-2 rounded-lg hover:bg-gray-100" aria-label="Close"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <Card className="p-4 space-y-3">
                <label className="block space-y-1.5">
                  <span className="text-sm sm:text-[13px] font-medium text-[#303030]">Quantity received</span>
                  <input inputMode="decimal" value={receive.qty} onChange={(e) => setReceive({ ...receive, qty: e.target.value })} className={inputCls} />
                </label>
                <div className="space-y-1.5">
                  <span className="text-sm sm:text-[13px] font-medium text-[#303030]">Deliver on</span>
                  {batches.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {batches.slice(0, 3).map((b) => (
                        <button key={b.id} type="button" onClick={() => setReceive({ ...receive, date: b.delivery_date })}
                          className={`min-h-8 px-2.5 rounded-lg text-xs font-medium ${receive.date === b.delivery_date ? 'bg-[#303030] text-white' : 'bg-white text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]'}`}>
                          {b.name} · {fmtDay(b.delivery_date)}
                        </button>
                      ))}
                    </div>
                  )}
                  <input type="date" min={todayStr()} value={receive.date} onChange={(e) => setReceive({ ...receive, date: e.target.value })} className={inputCls} />
                </div>
              </Card>

              <Card className="p-4 space-y-2">
                <p className="text-sm font-semibold text-[#1a1a1a]">What will happen</p>
                <p className="text-xs text-[#616161]">Oldest orders are served first.</p>
                {plan.full.length === 0 && !plan.partial ? (
                  <p className="text-sm sm:text-[13px] text-[#616161]">Enter a quantity to see the allocation.</p>
                ) : (
                  <ul className="text-sm sm:text-[13px] space-y-1.5">
                    {plan.full.map((l) => (
                      <li key={l.id} className="flex justify-between gap-3"><span>{orderNo(l.orders, l.order_id)} · {customerOf(l.orders)}</span><span className="text-[#014b40] font-medium tabular-nums">{l.quantity} of {l.quantity}</span></li>
                    ))}
                    {plan.partial && (
                      <li className="flex justify-between gap-3"><span>{orderNo(plan.partial.line.orders, plan.partial.line.order_id)} · {customerOf(plan.partial.line.orders)}</span><span className="text-[#5e4200] font-medium tabular-nums">{plan.partial.qty} of {plan.partial.line.quantity}</span></li>
                    )}
                  </ul>
                )}
                {plan.partial && <p className="text-xs text-[#5e4200] bg-[#ffd6a4]/60 rounded-md px-2 py-1.5">The last order gets only part. The rest stays awaiting stock.</p>}
                {plan.leftover > 0 && <p className="text-xs text-[#616161]">{plan.leftover} unit{plan.leftover > 1 ? 's' : ''} left over after all waiting orders.</p>}
              </Card>
              <p className="text-xs text-[#616161]">This doesn't change product stock. Update stock on the Products page.</p>
            </div>

            <div className="p-4 bg-white border-t border-gray-200 shrink-0 flex gap-2">
              <button onClick={() => setReceive(null)} disabled={busy} className="min-h-11 sm:min-h-10 px-4 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50">Cancel</button>
              <button onClick={applyReceive} disabled={busy || (plan.full.length === 0 && !plan.partial)} className="flex-1 min-h-11 sm:min-h-10 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-sm sm:text-[13px] font-medium text-white disabled:opacity-50 inline-flex items-center justify-center gap-2">
                {busy ? <Loader2 size={16} className="animate-spin" /> : 'Allocate stock'}
              </button>
            </div>
          </aside>
        </div>
      )}

      {toast && (
        <div role="status" className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[120] max-w-[90vw] px-4 py-2.5 rounded-lg text-sm sm:text-[13px] shadow-lg ${toast.type === 'error' ? 'bg-[#fed1d7] text-[#8e0b21]' : 'bg-[#303030] text-white'}`}>{toast.text}</div>
      )}
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] ${className}`}>{children}</div>;
}
function Kpi({ label, value, warn, loading }: { label: string; value: string; warn?: boolean; loading: boolean }) {
  return (
    <div className="p-4 sm:p-5">
      <p className="text-sm sm:text-[13px] text-[#616161]">{label}</p>
      {loading ? <div className="h-7 w-16 bg-gray-100 rounded mt-2 animate-pulse" /> : <p className={`text-[22px] font-semibold mt-1.5 leading-none ${warn ? 'text-[#5e4200]' : 'text-[#1a1a1a]'}`}>{value}</p>}
    </div>
  );
}