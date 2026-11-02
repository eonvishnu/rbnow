"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import { Plus, X, Loader2, CalendarClock, ClipboardList, Printer, Copy, Check, AlertTriangle, ArrowRight } from 'lucide-react';

type Phase = 'scheduled' | 'open' | 'closed' | 'completed' | 'cancelled';
type Tab = 'active' | 'completed' | 'cancelled';

const PHASE_TONE: Record<Phase, string> = {
  scheduled: 'bg-[#e3e3e3] text-[#303030]',
  open: 'bg-[#cdfed4] text-[#014b40]',
  closed: 'bg-[#ffd6a4] text-[#5e4200]',
  completed: 'bg-[#a4e8f2] text-[#00424d]',
  cancelled: 'bg-[#fed1d7] text-[#8e0b21]',
};
const PHASE_LABEL: Record<Phase, string> = {
  scheduled: 'Scheduled', open: 'Accepting orders', closed: 'Ordering closed', completed: 'Completed', cancelled: 'Cancelled',
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(n) || 0);

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true });

// 'YYYY-MM-DD' -> readable, without timezone shifting the day
const fmtDay = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

const pad = (n: number) => String(n).padStart(2, '0');
const toDateInput = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toLocalInput = (iso: string | Date) => {
  const d = new Date(iso);
  return `${toDateInput(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const atTime = (base: Date, dayOffset: number, h: number, m = 0) => {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + dayOffset, h, m);
  return d;
};

const phaseOf = (b: any): Phase => {
  if (b.status === 'cancelled') return 'cancelled';
  if (b.status === 'completed') return 'completed';
  const now = Date.now();
  if (now < new Date(b.orders_open_at).getTime()) return 'scheduled';
  if (b.closed_early || now > new Date(b.orders_close_at).getTime()) return 'closed';
  return 'open';
};

const esc = (v: any) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

const inputCls =
  'w-full min-h-11 sm:min-h-9 py-2 px-3 text-base sm:text-[13px] text-[#1a1a1a] placeholder:text-[#8a8a8a] bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.2)] outline-none focus:shadow-[0_0_0_2px_#005bd3] transition-shadow';

const emptyForm = () => {
  const now = new Date();
  return {
    id: '' as string,
    name: '',
    nameEdited: false,
    opens: toLocalInput(atTime(now, 0, 18)),
    closes: toLocalInput(atTime(now, 1, 8)),
    delivery: toDateInput(atTime(now, 1, 0)),
    notes: '',
  };
};

export default function BatchesPage() {
  const { userData } = useAuth();
  const canEdit = ['super_admin', 'admin', 'operations_staff'].includes(userData?.role || '');

  const [batches, setBatches] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [setupNeeded, setSetupNeeded] = useState(false);
  const [tab, setTab] = useState<Tab>('active');

  const [form, setForm] = useState<ReturnType<typeof emptyForm> | null>(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [pickBatch, setPickBatch] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [, setTick] = useState(0);

  const [toast, setToast] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const flash = (type: 'error' | 'success', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const load = async () => {
    const { data: bData, error: bErr } = await supabase
      .from('order_batches')
      .select('*')
      .order('delivery_date', { ascending: false })
      .limit(60);

    if (bErr) {
      if (bErr.code === '42P01' || /order_batches/i.test(bErr.message || '')) setSetupNeeded(true);
      else flash('error', 'Could not load batches.');
      setLoading(false);
      return;
    }
    setBatches(bData || []);

    const ids = (bData || []).map((b) => b.id);
    if (ids.length) {
      const { data: oData } = await supabase
        .from('orders')
        .select('id, batch_id, status, total, order_items(product_name, variant_unit, quantity, fulfillment_status, promised_date)')
        .in('batch_id', ids);
      setOrders(oData || []);
    } else {
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const t = setInterval(() => setTick((n) => n + 1), 30000); // keep Open / Closed labels fresh
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !saving) {
        setForm(null);
        setPickBatch(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [saving]);

  // ---------- per-batch numbers ----------
  const statsByBatch = useMemo(() => {
    const map: Record<string, any> = {};
    batches.forEach((b) => (map[b.id] = { orders: 0, revenue: 0, items: 0, delivered: 0, late: 0, unavailable: 0 }));
    orders.forEach((o) => {
      const s = map[o.batch_id];
      if (!s || o.status === 'cancelled') return;
      const b = batches.find((x) => x.id === o.batch_id);
      s.orders += 1;
      s.revenue += Number(o.total) || 0;
      (o.order_items || []).forEach((i: any) => {
        if (i.fulfillment_status === 'unavailable') { s.unavailable += 1; return; }
        s.items += 1;
        if (i.fulfillment_status === 'delivered') s.delivered += 1;
        if (i.promised_date && b && i.promised_date > b.delivery_date) s.late += 1;
      });
    });
    return map;
  }, [batches, orders]);

  const openBatch = batches.find((b) => phaseOf(b) === 'open');

  const shownBatches = useMemo(() => {
    const list = batches.filter((b) => {
      const p = phaseOf(b);
      return tab === 'active' ? ['scheduled', 'open', 'closed'].includes(p) : tab === 'completed' ? p === 'completed' : p === 'cancelled';
    });
    return tab === 'active'
      ? [...list].sort((a, b) => a.delivery_date.localeCompare(b.delivery_date))
      : list;
  }, [batches, tab]);

  const tabCount = (t: Tab) =>
    batches.filter((b) => {
      const p = phaseOf(b);
      return t === 'active' ? ['scheduled', 'open', 'closed'].includes(p) : t === 'completed' ? p === 'completed' : p === 'cancelled';
    }).length;

  // ---------- create / edit ----------
  const suggestName = (delivery: string) => (delivery ? `Delivery ${new Date(`${delivery}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : '');

  const openCreate = () => {
    const f = emptyForm();
    f.name = suggestName(f.delivery);
    setFormError('');
    setForm(f);
  };

  const openEdit = (b: any) => {
    setFormError('');
    setForm({ id: b.id, name: b.name, nameEdited: true, opens: toLocalInput(b.orders_open_at), closes: toLocalInput(b.orders_close_at), delivery: b.delivery_date, notes: b.notes || '' });
  };

  const applyPreset = (kind: 'morning' | 'evening') => {
    const now = new Date();
    setForm((f) => {
      if (!f) return f;
      const delivery = toDateInput(atTime(now, kind === 'morning' ? 1 : 2, 0));
      return {
        ...f,
        opens: toLocalInput(atTime(now, 0, 18)),
        closes: toLocalInput(kind === 'morning' ? atTime(now, 1, 8) : atTime(now, 1, 18)),
        delivery,
        name: f.nameEdited ? f.name : suggestName(delivery),
      };
    });
  };

  const saveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setFormError('');

    if (!form.name.trim()) return setFormError('Give the batch a name.');
    if (!form.opens || !form.closes || !form.delivery) return setFormError('Fill in all dates.');
    const opens = new Date(form.opens);
    const closes = new Date(form.closes);
    if (closes <= opens) return setFormError('Ordering must close after it opens.');
    if (form.delivery < toDateInput(closes)) return setFormError('Delivery date cannot be before ordering closes.');

    setSaving(true);
    try {
      const row = {
        name: form.name.trim(),
        orders_open_at: opens.toISOString(),
        orders_close_at: closes.toISOString(),
        delivery_date: form.delivery,
        notes: form.notes.trim() || null,
      };

      if (form.id) {
        const prev = batches.find((b) => b.id === form.id);
        const { error } = await supabase.from('order_batches').update(row).eq('id', form.id);
        if (error) throw error;
        if (prev && prev.delivery_date !== form.delivery) {
          // orders in this batch follow the new delivery date (items with their own promised date keep it)
          const { error: oErr } = await supabase.from('orders').update({ delivery_date: form.delivery }).eq('batch_id', form.id);
          if (oErr) throw oErr;
        }
        flash('success', 'Batch updated');
      } else {
        const { error } = await supabase.from('order_batches').insert(row);
        if (error) throw error;
        flash('success', 'Batch created');
      }
      setForm(null);
      await load();
    } catch (err: any) {
      console.error(err);
      setFormError(err?.message || 'Could not save the batch.');
    } finally {
      setSaving(false);
    }
  };

  // ---------- batch actions ----------
  const patchBatch = async (b: any, patch: any, okText: string) => {
    setBusyId(b.id);
    const { error } = await supabase.from('order_batches').update(patch).eq('id', b.id);
    setBusyId(null);
    if (error) return flash('error', 'Could not update the batch.');
    setBatches((prev) => prev.map((x) => (x.id === b.id ? { ...x, ...patch } : x)));
    flash('success', okText);
  };

  const closeOrdering = (b: any) => {
    if (!confirm(`Close ordering for "${b.name}" now? New orders will no longer join this batch.`)) return;
    patchBatch(b, { closed_early: true }, 'Ordering closed');
  };
  const reopenOrdering = (b: any) => patchBatch(b, { closed_early: false }, 'Ordering reopened');

  const completeBatch = (b: any) => {
    const s = statsByBatch[b.id];
    const open = s ? s.items - s.delivered : 0;
    const msg = open > 0 ? `${open} item${open > 1 ? 's are' : ' is'} not delivered yet. Mark "${b.name}" completed anyway?` : `Mark "${b.name}" as completed?`;
    if (!confirm(msg)) return;
    patchBatch(b, { status: 'completed' }, 'Batch completed');
  };

  const cancelBatch = (b: any) => {
    if (!confirm(`Cancel "${b.name}"? Its orders stay as they are.`)) return;
    patchBatch(b, { status: 'cancelled' }, 'Batch cancelled');
  };

  const deleteBatch = async (b: any) => {
    if ((statsByBatch[b.id]?.orders || 0) > 0) return flash('error', 'This batch has orders. Cancel it instead.');
    if (!confirm(`Delete "${b.name}"?`)) return;
    setBusyId(b.id);
    const { error } = await supabase.from('order_batches').delete().eq('id', b.id);
    setBusyId(null);
    if (error) return flash('error', 'Could not delete the batch.');
    setBatches((prev) => prev.filter((x) => x.id !== b.id));
    flash('success', 'Batch deleted');
  };

  // ---------- pick list ----------
  const pickList = useMemo(() => {
    if (!pickBatch) return [];
    const map = new Map<string, { name: string; unit: string; qty: number; orders: number }>();
    orders
      .filter((o) => o.batch_id === pickBatch.id && o.status !== 'cancelled')
      .forEach((o) => {
        (o.order_items || []).forEach((i: any) => {
          if (i.fulfillment_status === 'delivered' || i.fulfillment_status === 'unavailable') return;
          // items pushed to a later date are not part of this batch's packing run
          if (i.promised_date && i.promised_date > pickBatch.delivery_date) return;
          const key = `${i.product_name}__${i.variant_unit}`;
          const cur = map.get(key) || { name: i.product_name, unit: i.variant_unit, qty: 0, orders: 0 };
          cur.qty += Number(i.quantity) || 0;
          cur.orders += 1;
          map.set(key, cur);
        });
      });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [pickBatch, orders]);

  const copyPickList = async () => {
    const text = `${pickBatch.name} — ${fmtDay(pickBatch.delivery_date)}\n` + pickList.map((p) => `${p.name} (${p.unit}) × ${p.qty}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      flash('error', 'Could not copy.');
    }
  };

  const printPickList = () => {
    const w = window.open('', '_blank', 'width=800,height=900');
    if (!w) return flash('error', 'Allow pop-ups to print.');
    w.document.write(`<!doctype html><html><head><title>Pick list</title>
      <style>body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#303030;padding:32px;max-width:720px;margin:auto}
      h1{font-size:20px;margin:0}small{color:#616161}table{width:100%;border-collapse:collapse;margin-top:16px}
      th,td{text-align:left;padding:8px 0;border-bottom:1px solid #e3e3e3;font-size:14px}th{color:#616161;font-weight:500}
      td.r,th.r{text-align:right}</style></head><body>
      <h1>Pick list — ${esc(pickBatch.name)}</h1><small>Delivery ${esc(fmtDay(pickBatch.delivery_date))}</small>
      <table><thead><tr><th>Product</th><th>Unit</th><th class="r">Qty</th><th class="r">Orders</th></tr></thead><tbody>
      ${pickList.map((p) => `<tr><td>${esc(p.name)}</td><td>${esc(p.unit)}</td><td class="r"><strong>${esc(p.qty)}</strong></td><td class="r">${esc(p.orders)}</td></tr>`).join('')}
      </tbody></table><script>window.onload=function(){window.print()}</script></body></html>`);
    w.document.close();
  };

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[#1a1a1a]">Batches</h1>
          <p className="text-sm sm:text-[13px] text-[#616161] mt-0.5">Each batch is an ordering window with one delivery date.</p>
        </div>
        {canEdit && !setupNeeded && (
          <button onClick={openCreate} className="min-h-10 sm:min-h-8 px-3 inline-flex items-center gap-1.5 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-sm sm:text-[13px] font-medium text-white shrink-0">
            <Plus size={15} /> Create batch
          </button>
        )}
      </div>

      {/* ONE-TIME SETUP */}
      {setupNeeded && (
        <Card className="p-4 border-l-4 !border-l-[#ffd6a4]">
          <div className="flex gap-3">
            <AlertTriangle size={18} className="text-[#5e4200] shrink-0 mt-0.5" />
            <div className="text-sm sm:text-[13px] space-y-1">
              <p className="font-semibold text-[#1a1a1a]">One-time database setup needed</p>
              <p className="text-[#616161]">Run the file <code className="bg-[#f7f7f7] px-1.5 py-0.5 rounded">001_order_batches.sql</code> in the Supabase SQL editor, then refresh this page.</p>
            </div>
          </div>
        </Card>
      )}

      {/* STATUS BANNER */}
      {!setupNeeded && !loading && (
        <Card className="p-4 flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${openBatch ? 'bg-emerald-500' : 'bg-[#c9c9c9]'}`} />
          {openBatch ? (
            <p className="text-sm sm:text-[13px] text-[#303030]">
              <span className="font-semibold text-[#1a1a1a]">{openBatch.name}</span> is accepting orders until {fmtDateTime(openBatch.orders_close_at)}. Delivery on {fmtDay(openBatch.delivery_date)}.
            </p>
          ) : (
            <p className="text-sm sm:text-[13px] text-[#616161]">No batch is accepting orders right now. New orders won't get a delivery date until one opens.</p>
          )}
        </Card>
      )}

      {/* TABS */}
      {!setupNeeded && (
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {([['active', 'Active'], ['completed', 'Completed'], ['cancelled', 'Cancelled']] as [Tab, string][]).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} className={`min-h-9 py-1.5 px-3 rounded-lg text-sm sm:text-[13px] whitespace-nowrap transition-colors ${tab === id ? 'bg-[#303030] text-white font-medium' : 'text-[#303030] hover:bg-black/5'}`}>
              {label} <span className={tab === id ? 'text-white/70' : 'text-[#8a8a8a]'}>{tabCount(id)}</span>
            </button>
          ))}
        </div>
      )}

      {/* LIST */}
      {!setupNeeded && (loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-56 bg-white rounded-xl animate-pulse shadow-[0_0_0_1px_rgba(0,0,0,0.06)]" />)}
        </div>
      ) : shownBatches.length === 0 ? (
        <Card className="py-14 px-6 text-center">
          <CalendarClock size={28} className="mx-auto text-[#8a8a8a]" />
          <p className="mt-3 text-sm sm:text-[13px] text-[#616161]">
            {tab === 'active' ? 'No active batches. Create one to start taking orders for a delivery day.' : 'Nothing here yet.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {shownBatches.map((b) => {
            const phase = phaseOf(b);
            const s = statsByBatch[b.id] || { orders: 0, revenue: 0, items: 0, delivered: 0, late: 0, unavailable: 0 };
            const pct = s.items ? Math.round((s.delivered / s.items) * 100) : 0;
            const live = phase === 'scheduled' || phase === 'open' || phase === 'closed';
            return (
              <Card key={b.id} className="p-4 sm:p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-[#1a1a1a] truncate">{b.name}</h2>
                    <p className="text-sm sm:text-[13px] text-[#616161] mt-0.5">Delivery · <span className="text-[#1a1a1a] font-medium">{fmtDay(b.delivery_date)}</span></p>
                  </div>
                  <Pill tone={PHASE_TONE[phase]}>{PHASE_LABEL[phase]}</Pill>
                </div>

                <div className="rounded-lg bg-[#f7f7f7] px-3 py-2.5 text-sm sm:text-[13px] text-[#303030] flex items-center gap-2 flex-wrap">
                  <span>{fmtDateTime(b.orders_open_at)}</span>
                  <ArrowRight size={13} className="text-[#8a8a8a]" />
                  <span>{b.closed_early ? <span>Closed early</span> : fmtDateTime(b.orders_close_at)}</span>
                </div>

                <div className="grid grid-cols-3 divide-x divide-gray-200/80 text-center">
                  <Stat label="Orders" value={String(s.orders)} />
                  <Stat label="Revenue" value={formatCurrency(s.revenue)} />
                  <Stat label="Items" value={String(s.items)} />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-[#616161] mb-1.5">
                    <span>{s.delivered} of {s.items} items delivered</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#303030] rounded-full" style={{ width: `${pct}%` }} /></div>
                  {(s.late > 0 || s.unavailable > 0) && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {s.late > 0 && <Pill tone="bg-[#ffd6a4] text-[#5e4200]">{s.late} late item{s.late > 1 ? 's' : ''}</Pill>}
                      {s.unavailable > 0 && <Pill tone="bg-[#fed1d7] text-[#8e0b21]">{s.unavailable} unavailable</Pill>}
                    </div>
                  )}
                </div>

                {b.notes && <p className="text-sm sm:text-[13px] text-[#616161]">{b.notes}</p>}

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button onClick={() => setPickBatch(b)} className="btn-secondary"><ClipboardList size={14} /> Pick list</button>
                  <Link href={`/orders?batch=${b.id}`} className="btn-secondary">View orders</Link>
                  {canEdit && live && (
                    <>
                      {phase === 'open' && <button disabled={busyId === b.id} onClick={() => closeOrdering(b)} className="btn-secondary">Close ordering</button>}
                      {b.closed_early && new Date(b.orders_close_at).getTime() > Date.now() && <button disabled={busyId === b.id} onClick={() => reopenOrdering(b)} className="btn-secondary">Reopen</button>}
                      <button onClick={() => openEdit(b)} className="btn-secondary">Edit</button>
                      {phase !== 'scheduled' && <button disabled={busyId === b.id} onClick={() => completeBatch(b)} className="btn-primary">Mark completed</button>}
                      {phase === 'scheduled' && s.orders === 0 && <button disabled={busyId === b.id} onClick={() => deleteBatch(b)} className="text-sm sm:text-[13px] font-medium text-[#8e0b21] px-2 min-h-9 hover:underline">Delete</button>}
                      {phase !== 'scheduled' && <button disabled={busyId === b.id} onClick={() => cancelBatch(b)} className="text-sm sm:text-[13px] font-medium text-[#8e0b21] px-2 min-h-9 hover:underline">Cancel batch</button>}
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ))}

      {/* CREATE / EDIT DRAWER */}
      {form && (
        <div className="relative z-[100]">
          <div className="fixed inset-0 bg-black/40" onClick={() => !saving && setForm(null)} />
          <aside className="fixed inset-y-0 right-0 w-full max-w-md bg-[#f1f1f1] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="h-14 px-4 sm:px-5 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
              <h2 className="text-sm font-semibold text-[#1a1a1a]">{form.id ? 'Edit batch' : 'Create batch'}</h2>
              <button onClick={() => setForm(null)} disabled={saving} className="p-2 -mr-2 rounded-lg hover:bg-gray-100" aria-label="Close"><X size={18} /></button>
            </div>

            <form onSubmit={saveForm} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {formError && <p role="alert" className="rounded-lg bg-[#fed1d7] px-3 py-2 text-sm sm:text-[13px] text-[#8e0b21]">{formError}</p>}

              {!form.id && (
                <Card className="p-4 space-y-2.5">
                  <p className="text-sm font-semibold text-[#1a1a1a]">Quick start</p>
                  <button type="button" onClick={() => applyPreset('morning')} className="w-full text-left rounded-lg bg-[#f7f7f7] hover:bg-[#f1f1f1] p-3">
                    <p className="text-sm sm:text-[13px] font-medium text-[#1a1a1a]">Evening to morning</p>
                    <p className="text-xs text-[#616161] mt-0.5">Orders 6 pm today → 8 am tomorrow. Delivery tomorrow.</p>
                  </button>
                  <button type="button" onClick={() => applyPreset('evening')} className="w-full text-left rounded-lg bg-[#f7f7f7] hover:bg-[#f1f1f1] p-3">
                    <p className="text-sm sm:text-[13px] font-medium text-[#1a1a1a]">Evening to evening</p>
                    <p className="text-xs text-[#616161] mt-0.5">Orders 6 pm today → 6 pm tomorrow. Delivery day after tomorrow.</p>
                  </button>
                </Card>
              )}

              <Card className="p-4 space-y-3">
                <Field label="Batch name">
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, nameEdited: true })} className={inputCls} placeholder="e.g. Delivery 2 Nov" />
                </Field>
                <Field label="Ordering opens">
                  <input type="datetime-local" value={form.opens} onChange={(e) => setForm({ ...form, opens: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Ordering closes">
                  <input type="datetime-local" value={form.closes} onChange={(e) => setForm({ ...form, closes: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Delivery date">
                  <input
                    type="date"
                    value={form.delivery}
                    onChange={(e) => setForm({ ...form, delivery: e.target.value, name: form.nameEdited ? form.name : suggestName(e.target.value) })}
                    className={inputCls}
                  />
                </Field>
                <p className="text-xs text-[#616161]">Customers only see the delivery date, not a time.</p>
                <Field label="Notes (optional)">
                  <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputCls} />
                </Field>
              </Card>
            </form>

            <div className="p-4 bg-white border-t border-gray-200 shrink-0 flex gap-2">
              <button type="button" onClick={() => setForm(null)} disabled={saving} className="btn-secondary min-h-11 sm:min-h-10">Cancel</button>
              <button onClick={(e) => saveForm(e as any)} disabled={saving} className="flex-1 min-h-11 sm:min-h-10 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-sm sm:text-[13px] font-medium text-white disabled:opacity-50 inline-flex items-center justify-center gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : form.id ? 'Save changes' : 'Create batch'}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* PICK LIST DRAWER */}
      {pickBatch && (
        <div className="relative z-[100]">
          <div className="fixed inset-0 bg-black/40" onClick={() => setPickBatch(null)} />
          <aside className="fixed inset-y-0 right-0 w-full max-w-md bg-[#f1f1f1] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="px-4 sm:px-5 py-3 bg-white border-b border-gray-200 flex items-start justify-between shrink-0">
              <div>
                <h2 className="text-sm font-semibold text-[#1a1a1a]">Pick list</h2>
                <p className="text-xs text-[#616161]">{pickBatch.name} · {fmtDay(pickBatch.delivery_date)}</p>
              </div>
              <button onClick={() => setPickBatch(null)} className="p-2 -mr-2 rounded-lg hover:bg-gray-100" aria-label="Close"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              <Card className="overflow-hidden">
                {pickList.length === 0 ? (
                  <p className="py-12 px-6 text-center text-sm sm:text-[13px] text-[#616161]">Nothing left to pack for this batch.</p>
                ) : (
                  <table className="w-full text-sm sm:text-[13px]">
                    <thead>
                      <tr className="bg-[#f7f7f7] text-[#616161] border-b border-gray-200/80 text-left">
                        <th className="font-medium px-4 py-2">Product</th>
                        <th className="font-medium px-2 py-2 text-right">Qty</th>
                        <th className="font-medium px-4 py-2 text-right">Orders</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {pickList.map((p) => (
                        <tr key={`${p.name}${p.unit}`}>
                          <td className="px-4 py-2.5"><span className="font-medium text-[#1a1a1a]">{p.name}</span> <span className="text-[#616161]">({p.unit})</span></td>
                          <td className="px-2 py-2.5 text-right font-semibold text-[#1a1a1a] tabular-nums">{p.qty}</td>
                          <td className="px-4 py-2.5 text-right text-[#616161] tabular-nums">{p.orders}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Card>
              <p className="text-xs text-[#616161] mt-3">Counts items that are still pending or packed. Delivered, unavailable and rescheduled items are left out.</p>
            </div>

            <div className="p-4 bg-white border-t border-gray-200 shrink-0 flex gap-2">
              <button onClick={copyPickList} disabled={!pickList.length} className="btn-secondary min-h-11 sm:min-h-10 flex-1">{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}</button>
              <button onClick={printPickList} disabled={!pickList.length} className="btn-primary min-h-11 sm:min-h-10 flex-1"><Printer size={14} /> Print</button>
            </div>
          </aside>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div role="status" className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[120] max-w-[90vw] px-4 py-2.5 rounded-lg text-sm sm:text-[13px] shadow-lg ${toast.type === 'error' ? 'bg-[#fed1d7] text-[#8e0b21]' : 'bg-[#303030] text-white'}`}>
          {toast.text}
        </div>
      )}

      <style jsx global>{`
        .btn-secondary { display:inline-flex; align-items:center; justify-content:center; gap:6px; min-height:36px; padding:6px 12px; border-radius:8px; background:#fff; color:#303030; font-size:13px; font-weight:500; box-shadow:0 0 0 1px rgba(0,0,0,0.12); }
        .btn-secondary:hover { background:#f7f7f7; }
        .btn-secondary:disabled { opacity:.5; }
        .btn-primary { display:inline-flex; align-items:center; justify-content:center; gap:6px; min-height:36px; padding:6px 14px; border-radius:8px; background:#303030; color:#fff; font-size:13px; font-weight:500; }
        .btn-primary:hover { background:#1a1a1a; }
        .btn-primary:disabled { opacity:.5; }
      `}</style>
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] ${className}`}>{children}</div>;
}
function Pill({ children, tone }: { children: React.ReactNode; tone: string }) {
  return <span className={`inline-flex items-center px-2 h-5 rounded-full text-[11px] font-medium whitespace-nowrap ${tone}`}>{children}</span>;
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2">
      <p className="text-xs text-[#616161]">{label}</p>
      <p className="text-base font-semibold text-[#1a1a1a] mt-0.5 tabular-nums">{value}</p>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm sm:text-[13px] font-medium text-[#303030]">{label}</span>
      {children}
    </label>
  );
}