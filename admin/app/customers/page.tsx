"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, X, MessageSquare, Download, ArrowUpDown, ArrowUp, ArrowDown, Phone, Mail, ShoppingBag, ChevronLeft, ChevronRight, Wallet, MapPin, PlusCircle, ArrowUpRight, ArrowDownLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getAdminCustomersPaginated, getCustomerOrderHistory } from '@/features/customers/services/customers.service';
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

const toIndianPhone = (raw: string) => {
  const digits = (raw || '').replace(/\D/g, '');
  const ten = digits.length >= 10 ? digits.slice(-10) : '';
  return /^[6-9]\d{9}$/.test(ten) ? ten : null;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [segment, setSegment] = useState<SegmentId>('all');
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'spent', dir: 'desc' });

  const [selected, setSelected] = useState<AdminCustomer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [customerWallet, setCustomerWallet] = useState<number>(0);
  const [customerWalletRecord, setCustomerWalletRecord] = useState<any | null>(null);
  const [customerAddresses, setCustomerAddresses] = useState<any[]>([]);
  const [customerTransactions, setCustomerTransactions] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Wallet expansion drawer state & actions
  const [drawerTab, setDrawerTab] = useState<'overview' | 'wallet' | 'addresses' | 'orders'>('overview');
  const [copiedId, setCopiedId] = useState(false);
  const [txType, setTxType] = useState<'credit' | 'debit'>('credit');
  const [walletAmount, setWalletAmount] = useState('');
  const [walletReason, setWalletReason] = useState('');
  const [walletSubmitting, setWalletSubmitting] = useState(false);
  const [walletMsg, setWalletMsg] = useState<{ success: boolean; text: string } | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await getAdminCustomersPaginated(page, PAGE_SIZE, searchQuery);
        setCustomers(res.customers);
        setTotalCount(res.totalCount);
      } catch (err: any) {
        console.error('CRM Fetch error details:', err?.message || JSON.stringify(err), err);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [page, searchQuery]);

  const refreshCustomerDetails = async () => {
    if (!selected) return;
    setOrdersLoading(true);
    try {
      const [orders, walletRes, addrRes, txRes] = await Promise.all([
        getCustomerOrderHistory(selected.id),
        supabase.from('customer_wallets').select('*').eq('user_id', selected.id).maybeSingle(),
        supabase.from('addresses').select('*').eq('user_id', selected.id).order('created_at', { ascending: false }),
        supabase.from('wallet_transactions').select('*').eq('user_id', selected.id).order('created_at', { ascending: false }),
      ]);
      setCustomerOrders(orders);
      if (walletRes.data) {
        setCustomerWalletRecord(walletRes.data);
        setCustomerWallet(Number(walletRes.data.balance || 0));
      } else {
        setCustomerWalletRecord(null);
        setCustomerWallet(0);
      }
      if (addrRes.data) setCustomerAddresses(addrRes.data);
      if (txRes.data) {
        const txs = txRes.data;
        const adminIds = [...new Set(txs.map((t: any) => t.performed_by).filter(Boolean))];
        const adminMap = new Map<string, string>();
        if (adminIds.length > 0) {
          const { data: adminProfiles } = await supabase
            .from('profiles')
            .select('id, display_name, email')
            .in('id', adminIds);
          if (adminProfiles) {
            adminProfiles.forEach((ap: any) => {
              adminMap.set(ap.id, ap.display_name || ap.email || 'Admin');
            });
          }
        }
        const mappedTxs = txs.map((tx: any) => ({
          ...tx,
          adminName: tx.performed_by ? adminMap.get(tx.performed_by) : null,
        }));
        setCustomerTransactions(mappedTxs);
      } else {
        setCustomerTransactions([]);
      }
    } catch (error) {
      console.error('Customer detail data fetch error:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (!selected) {
      setCustomerOrders([]);
      setCustomerWallet(0);
      setCustomerAddresses([]);
      setCustomerTransactions([]);
      setCustomerWalletRecord(null);
      setDrawerTab('overview');
      return;
    }
    setDrawerTab('overview');
    refreshCustomerDetails();
  }, [selected]);

  const handleWalletAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const amt = Number(walletAmount);
    if (isNaN(amt) || amt <= 0) {
      setWalletMsg({ success: false, text: 'Please enter a valid amount.' });
      return;
    }

    if (txType === 'debit' && customerWallet < amt) {
      setWalletMsg({ success: false, text: 'Cannot deduct more than current wallet balance.' });
      return;
    }

    setWalletSubmitting(true);
    setWalletMsg(null);

    try {
      let walletId = customerWalletRecord?.id;
      if (!walletId) {
        const { data: newW, error: newWErr } = await supabase
          .from('customer_wallets')
          .insert({ user_id: selected.id, balance: 0 })
          .select('id')
          .single();
        if (newWErr) throw newWErr;
        walletId = newW.id;
      }

      const { data: { user: adminUser } } = await supabase.auth.getUser();
      const description = walletReason.trim() || (txType === 'credit' ? 'Admin Credited Store Credit' : 'Admin Debited Store Credit');

      const { data: newBalance, error: rpcErr } = await supabase.rpc('adjust_customer_wallet', {
        p_wallet_id: walletId,
        p_user_id: selected.id,
        p_amount: amt,
        p_type: txType,
        p_description: description,
        p_performed_by: adminUser?.id || null,
      });

      if (rpcErr) throw rpcErr;

      setWalletMsg({
        success: true,
        text: txType === 'credit' ? `Successfully credited ₹${amt}!` : `Successfully deducted ₹${amt}!`
      });
      setWalletAmount('');
      setWalletReason('');
      await refreshCustomerDetails();
      setTimeout(() => {
        setDrawerTab('overview');
        setWalletMsg(null);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setWalletMsg({ success: false, text: err.message || 'Failed to update wallet.' });
    } finally {
      setWalletSubmitting(false);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const stats = useMemo(() => {
    const totalCountVal = customers.length;
    const totalSpentAll = customers.reduce((s, c) => s + c.totalSpent, 0);
    const avgLtv = totalCountVal ? totalSpentAll / totalCountVal : 0;
    const repeat = customers.filter((c) => c.isRepeat).length;
    const repeatRate = totalCountVal ? Math.round((repeat / totalCountVal) * 100) : 0;
    const vip = customers.filter((c) => c.isVip).length;
    const risk = customers.filter((c) => c.isAtRisk).length;
    const newCount = customers.filter((c) => c.isNew).length;
    return { avgLtv, repeatRate, vip, risk, newCount };
  }, [customers]);

  const filtered = useMemo(() => {
    let list = [...customers];
    if (segment === 'vip') list = list.filter((c) => c.isVip);
    if (segment === 'repeat') list = list.filter((c) => c.isRepeat);
    if (segment === 'new') list = list.filter((c) => c.isNew);
    if (segment === 'risk') list = list.filter((c) => c.isAtRisk);

    list.sort((a, b) => {
      let comp = 0;
      if (sort.key === 'name') comp = a.displayName.localeCompare(b.displayName);
      if (sort.key === 'orders') comp = a.orderCount - b.orderCount;
      if (sort.key === 'spent') comp = a.totalSpent - b.totalSpent;
      if (sort.key === 'last') {
        const at = a.lastOrderDate ? new Date(a.lastOrderDate).getTime() : 0;
        const bt = b.lastOrderDate ? new Date(b.lastOrderDate).getTime() : 0;
        comp = at - bt;
      }
      return sort.dir === 'asc' ? comp : -comp;
    });

    return list;
  }, [customers, segment, sort]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const toggleSort = (k: SortKey) => {
    if (sort.key === k) {
      setSort({ key: k, dir: sort.dir === 'asc' ? 'desc' : 'asc' });
    } else {
      setSort({ key: k, dir: 'desc' });
    }
  };

  const fmtDate = (d: Date | null) => {
    if (!d) return 'Never';
    const now = new Date();
    const diff = now.getTime() - new Date(d).getTime();
    if (diff < DAY) return 'Today';
    if (diff < DAY * 2) return 'Yesterday';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const openWhatsApp = (c: AdminCustomer) => {
    const ten = toIndianPhone(c.phoneNumber);
    if (!ten) return;
    const text = encodeURIComponent(`Hi ${c.displayName}, thank you for ordering with Royal Bengal! We have a special offer waiting for you.`);
    window.open(`https://wa.me/91${ten}?text=${text}`, '_blank');
  };

  const exportCsv = () => {
    const rows = [
      ['Customer Name', 'Phone', 'Orders Count', 'Total Spent', 'VIP', 'Last Order'],
      ...customers.map((c) => [c.displayName, c.phoneNumber || '', c.orderCount, c.totalSpent, c.isVip ? 'Yes' : 'No', c.lastOrderDate ? new Date(c.lastOrderDate).toISOString() : '']),
    ];
    const blob = new Blob(['\uFEFF' + rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const isStaff = (role: string) => role && role !== 'customer';

  const segments: { id: SegmentId; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: totalCount },
    { id: 'vip', label: 'VIP', count: stats.vip },
    { id: 'repeat', label: 'Repeat', count: customers.filter(c => c.isRepeat).length },
    { id: 'new', label: 'New', count: stats.newCount },
    { id: 'risk', label: 'At risk', count: stats.risk },
  ];

  return (
    <div className="space-y-5 text-xs font-sans text-[#303030]">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Customers</h1>
        <button
          onClick={exportCsv}
          disabled={!filtered.length}
          className="h-8 px-3 rounded-lg bg-white text-[13px] font-medium inline-flex items-center gap-1.5 shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
        >
          <Download size={14} /> Export
        </button>
      </div>

      {/* KPI STRIP */}
      <Card className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-200/80">
        <Kpi label="Total customers" value={totalCount.toLocaleString('en-IN')} loading={loading} />
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
                className={`h-8 px-3 rounded-lg text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
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
              placeholder="Search name or phone"
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
                filtered.map((c) => (
                  <tr key={c.id} onClick={() => setSelected(c)} className="hover:bg-[#fafafa] cursor-pointer transition-colors">
                    <td className="pl-4 sm:pl-5 pr-3 py-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-[#1a1a1a] truncate">{c.displayName}</span>
                          {c.isVip && <Pill tone="bg-[#ffd6a4] text-[#5e4200]">VIP</Pill>}
                          {c.isNew && <Pill tone="bg-[#a4e8f2] text-[#00424d]">New</Pill>}
                          {c.isAtRisk && <Pill tone="bg-[#fed1d7] text-[#8e0b21]">At risk</Pill>}
                          {isStaff(c.role) && <Pill tone="bg-[#e3e3e3] text-[#303030]">{pretty(c.role)}</Pill>}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-[#303030]">{c.phoneNumber || <span className="text-[#8a8a8a]">—</span>}</td>
                    <td className="px-3 py-2 tabular-nums">{c.orderCount} {c.orderCount === 1 ? 'order' : 'orders'}</td>
                    <td className="px-3 py-2 text-[#616161]">{fmtDate(c.lastOrderDate)}</td>
                    <td className="pl-3 pr-4 sm:pr-5 py-2 text-right font-medium text-[#1a1a1a] tabular-nums">{formatCurrency(c.totalSpent)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && (
          <div className="px-4 sm:px-5 py-3 border-t border-gray-100 flex items-center justify-between text-[13px] text-[#616161]">
            <span>Page {page} of {totalPages} ({totalCount} total customers)</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="h-8 px-3 rounded-lg bg-white font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="h-8 px-3 rounded-lg bg-white font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 cursor-pointer"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* DETAIL DRAWER (Expandable Side-by-Side Panel) */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[60]" onClick={() => setSelected(null)} />
          <aside className={`fixed inset-y-0 right-0 w-full ${drawerTab !== 'overview' ? 'max-w-4xl' : 'max-w-lg'} bg-[#f1f1f1] shadow-2xl z-[70] flex flex-col transition-all duration-300 ease-in-out`}>
            <div className="h-14 px-5 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
              <h2 className="text-sm font-semibold text-[#1a1a1a]">
                Customer details {drawerTab !== 'overview' && <span className="text-[#006B50] font-bold">— {drawerTab === 'wallet' ? 'Wallet Management' : drawerTab === 'addresses' ? 'Saved Addresses' : 'Order History'} Active</span>}
              </h2>
              <button onClick={() => setSelected(null)} className="p-2 -mr-2 rounded-lg hover:bg-gray-100 cursor-pointer" aria-label="Close"><X size={18} /></button>
            </div>

            <div className={`flex-1 overflow-hidden p-5 ${drawerTab !== 'overview' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch' : 'overflow-y-auto space-y-4'} text-[13px] transition-all`}>
              {/* Left Column: Customer Details (always visible) */}
              <div className={`space-y-4 ${drawerTab !== 'overview' ? 'h-full overflow-y-auto pr-1' : ''}`}>
                <Card className="p-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-base font-semibold text-[#1a1a1a]">{selected.displayName}</h3>
                      {selected.isVip && <Pill tone="bg-[#ffd6a4] text-[#5e4200]">VIP</Pill>}
                      {isStaff(selected.role) && <Pill tone="bg-[#e3e3e3] text-[#303030]">{pretty(selected.role)}</Pill>}
                    </div>
                    <p className="text-xs text-[#616161] mt-0.5">Customer since {fmtDate(selected.createdAt)}</p>
                  </div>
                  <div className="mt-4 space-y-2 text-[#303030]">
                    <p className="flex items-center gap-2"><Phone size={14} className="text-[#8a8a8a]" />{selected.phoneNumber || 'No phone on file'}</p>
                  </div>
                </Card>

                <Card className="grid grid-cols-3 divide-x divide-gray-200/80">
                  <MiniStat label="Total spent" value={formatCurrency(selected.totalSpent)} />
                  <MiniStat label="Orders" value={String(selected.orderCount)} />
                  <MiniStat label="Avg. order" value={formatCurrency(selected.orderCount ? selected.totalSpent / selected.orderCount : 0)} />
                </Card>

                {/* Store Credit Summary Card */}
                <Card className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet size={16} className="text-[#006B50]" />
                    <div>
                      <span className="font-semibold text-[#1a1a1a] block">Store Credit</span>
                      <span className="text-xs font-bold text-emerald-900">{formatCurrency(customerWallet)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setWalletAmount('');
                      setWalletReason('');
                      setTxType('credit');
                      setWalletMsg(null);
                      setDrawerTab('wallet');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    Manage wallet
                  </button>
                </Card>

                {/* Saved Addresses Summary Card */}
                <Card className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-[#006B50]" />
                    <div>
                      <span className="font-semibold text-[#1a1a1a] block">Saved Addresses</span>
                      <span className="text-xs font-bold text-gray-600">{customerAddresses.length} addresses on file</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setDrawerTab('addresses')}
                    className="px-3 py-1.5 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    View addresses
                  </button>
                </Card>

                {/* Order History Summary Card */}
                <Card className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={16} className="text-[#006B50]" />
                    <div>
                      <span className="font-semibold text-[#1a1a1a] block">Order History</span>
                      <span className="text-xs font-bold text-gray-600">{customerOrders.length} orders placed</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setDrawerTab('orders')}
                    className="px-3 py-1.5 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    View orders
                  </button>
                </Card>
              </div>

              {/* Right Column: Expanded Management Panel (Wallet, Addresses, or Orders) */}
              {drawerTab !== 'overview' && (
                <div className="space-y-4 h-full overflow-y-auto pr-1 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-2xs">
                    <span className="font-semibold text-[#1a1a1a] capitalize">
                      {drawerTab === 'wallet' ? 'Wallet Management' : drawerTab === 'addresses' ? 'Saved Addresses' : 'Order History'}
                    </span>
                    <button
                      onClick={() => setDrawerTab('overview')}
                      className="text-xs font-bold text-[#006B50] hover:underline cursor-pointer"
                    >
                      Close panel ✕
                    </button>
                  </div>

                  {drawerTab === 'wallet' && (
                    <>
                      {/* Balance & ID Card */}
                      <Card className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-[#616161]">Wallet Balance</p>
                            <p className="text-2xl font-semibold text-[#1a1a1a] mt-1 tabular-nums">{formatCurrency(customerWallet)}</p>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#303030] flex items-center justify-center font-bold">
                            <Wallet size={20} />
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                          <div className="min-w-0">
                            <p className="text-xs text-[#616161]">Wallet ID</p>
                            <p className="font-mono text-[#1a1a1a] truncate max-w-[200px] mt-0.5">{customerWalletRecord?.id || 'Generating...'}</p>
                          </div>
                          {customerWalletRecord?.id && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(customerWalletRecord.id);
                                setCopiedId(true);
                                setTimeout(() => setCopiedId(false), 2000);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50 font-medium text-xs tracking-wider shrink-0 cursor-pointer"
                            >
                              {copiedId ? 'Copied!' : 'Copy ID'}
                            </button>
                          )}
                        </div>
                      </Card>

                      {/* Credit / Debit Form */}
                      <Card className="p-5 space-y-4">
                        <h3 className="text-sm font-semibold text-[#1a1a1a]">Adjust store credit</h3>
                        <form onSubmit={handleWalletAdjustment} className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-600">Action Type</label>
                            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                              <button
                                type="button"
                                onClick={() => setTxType('credit')}
                                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                  txType === 'credit' ? 'bg-emerald-800 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                }`}
                              >
                                <ArrowDownLeft size={13} /> Add Credit (+)
                              </button>
                              <button
                                type="button"
                                onClick={() => setTxType('debit')}
                                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                  txType === 'debit' ? 'bg-rose-700 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                }`}
                              >
                                <ArrowUpRight size={13} /> Deduct Credit (-)
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-600">Amount (₹)</label>
                            <input
                              required
                              type="number"
                              placeholder="e.g. 500"
                              value={walletAmount}
                              onChange={e => setWalletAmount(e.target.value)}
                              className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg p-2.5 text-xs font-semibold text-gray-900 outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-600">Reason / Description</label>
                            <input
                              type="text"
                              placeholder="e.g. Refund, Promotional cashback"
                              value={walletReason}
                              onChange={e => setWalletReason(e.target.value)}
                              className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg p-2.5 text-xs font-semibold text-gray-900 outline-none"
                            />
                          </div>

                          {walletMsg && (
                            <div className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${walletMsg.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                              {walletMsg.success ? <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> : <AlertCircle size={16} className="text-rose-600 shrink-0" />}
                              <span>{walletMsg.text}</span>
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={walletSubmitting || !walletAmount}
                            className={`w-full font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                              txType === 'credit' ? 'bg-emerald-800 hover:bg-emerald-900 text-amber-300' : 'bg-rose-700 hover:bg-rose-800 text-white'
                            }`}
                          >
                            {walletSubmitting ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />}
                            <span>{txType === 'credit' ? 'Confirm Credit' : 'Confirm Debit'}</span>
                          </button>
                        </form>
                      </Card>

                      {/* Wallet Transactions Below */}
                      <Card className="overflow-hidden">
                        <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-100">
                          <Wallet size={15} className="text-[#616161]" />
                          <h3 className="text-sm font-semibold text-[#1a1a1a]">Transaction history ({customerTransactions.length})</h3>
                        </div>
                        <div className="p-4 space-y-3">
                          {ordersLoading ? (
                            <div className="h-4 bg-gray-100 rounded animate-pulse" />
                          ) : customerTransactions.length === 0 ? (
                            <p className="text-center text-[#616161] py-4">No wallet transactions recorded.</p>
                          ) : (
                            customerTransactions.map((tx: any) => (
                              <div key={tx.id} className="text-xs space-y-1 pb-2.5 last:pb-0 border-b last:border-b-0 border-gray-100 flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-bold text-[#1a1a1a]">{tx.description}</p>
                                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                    <span>{new Date(tx.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                    {tx.adminName && <span>• Processed by: <strong className="text-gray-600">{tx.adminName}</strong></span>}
                                  </div>
                                </div>
                                <span className={`font-black shrink-0 ${tx.type === 'credit' ? 'text-emerald-800' : 'text-rose-600'}`}>
                                  {tx.type === 'credit' ? '+' : '-'}{formatCurrency(Number(tx.amount))}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </Card>
                    </>
                  )}

                  {drawerTab === 'addresses' && (
                    <Card className="overflow-hidden">
                      <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-100">
                        <MapPin size={15} className="text-[#616161]" />
                        <h3 className="text-sm font-semibold text-[#1a1a1a]">Saved Addresses ({customerAddresses.length})</h3>
                      </div>
                      <div className="p-4 space-y-3">
                        {ordersLoading ? (
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        ) : customerAddresses.length === 0 ? (
                          <p className="text-center text-[#616161]">No saved addresses found.</p>
                        ) : (
                          customerAddresses.map((addr: any) => (
                            <div key={addr.id} className="text-xs space-y-1 pb-2.5 last:pb-0 border-b last:border-b-0 border-gray-100">
                              <div className="flex items-center justify-between">
                                <span className="font-bold uppercase text-[#1a1a1a]">{addr.address_type || addr.label || 'Address'}</span>
                                <span className="text-[10px] text-gray-400">{addr.pincode}</span>
                              </div>
                              {addr.name && <p className="font-semibold text-gray-900">Recipient: {addr.name}</p>}
                              <p className="text-[#616161]">{addr.house_no ? `${addr.house_no}, ` : ''}{addr.address || addr.area}, {addr.city}</p>
                              {addr.phone && <p className="text-[11px] text-gray-500">Phone: {addr.phone}</p>}
                              {addr.latitude && addr.longitude && (
                                <a
                                  href={`https://www.google.com/maps?q=${addr.latitude},${addr.longitude}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006B50] hover:underline mt-1"
                                >
                                  <MapPin size={12} /> View pin on map
                                </a>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </Card>
                  )}

                  {drawerTab === 'orders' && (
                    <Card className="overflow-hidden">
                      <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-100">
                        <ShoppingBag size={15} className="text-[#616161]" />
                        <h3 className="text-sm font-semibold text-[#1a1a1a]">Order history ({customerOrders.length})</h3>
                      </div>
                      <div className="divide-y divide-gray-100 border-t border-gray-100 max-h-96 overflow-y-auto">
                        {ordersLoading ? (
                          <div className="p-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></div>
                        ) : customerOrders.length === 0 ? (
                          <p className="p-6 text-center text-[#616161]">No orders placed yet.</p>
                        ) : (
                          customerOrders.map((o) => (
                            <div key={o.id} className="p-4 space-y-1.5 text-xs">
                              <div className="flex items-center justify-between font-bold">
                                <span className="text-[#1a1a1a]">RB-{o.order_number || o.id.slice(0, 6).toUpperCase()}</span>
                                <span className="text-emerald-900 font-black">{formatCurrency(Number(o.total || 0))}</span>
                              </div>
                              <div className="flex items-center justify-between text-gray-500 text-[11px]">
                                <span>{new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                <span className="capitalize bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-bold">{o.status?.replace(/_/g, ' ')}</span>
                              </div>
                              {o.order_items && o.order_items.length > 0 && (
                                <p className="text-[11px] text-gray-600 truncate">
                                  {o.order_items.map((i: any) => `${i.quantity}x ${i.product_name}`).join(', ')}
                                </p>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-gray-200 shrink-0">
              <button
                onClick={() => openWhatsApp(selected)}
                disabled={!toIndianPhone(selected.phoneNumber)}
                className="w-full h-10 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-white text-[13px] font-medium inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${tone}`}>{children}</span>;
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
