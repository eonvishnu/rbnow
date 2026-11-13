"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, ArrowRight, Phone, MapPin, AlertCircle, CheckCircle2, Clock, MessageSquare, X, ChevronRight, Package } from 'lucide-react';
import { getAdminCheckouts } from '@/features/checkouts/services/checkout.service';
import type { AdminCheckout } from '@/features/checkouts/types/checkout';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

const STATUS_TONE: Record<string, string> = {
  pending_payment: 'bg-[#fed1d7] text-[#8e0b21]',
  completed: 'bg-[#cdfed4] text-[#014b40]',
  failed: 'bg-[#fed1d7] text-[#8e0b21]',
};

const pretty = (s: string) => (s || '').replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

const toIndianPhone = (raw: string) => {
  const digits = (raw || '').replace(/\D/g, '');
  const ten = digits.length >= 10 ? digits.slice(-10) : '';
  return /^[6-9]\d{9}$/.test(ten) ? ten : null;
};

export default function AdminCheckoutsPage() {
  const router = useRouter();
  const [checkouts, setCheckouts] = useState<AdminCheckout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<AdminCheckout | null>(null);

  const fetchCheckouts = async () => {
    try {
      setCheckouts(await getAdminCheckouts());
    } catch (err) {
      console.error('Error fetching checkouts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckouts();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filteredCheckouts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return checkouts.filter((c) => {
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchSearch =
        !q ||
        c.customer_name?.toLowerCase().includes(q) ||
        c.customer_phone?.includes(q) ||
        c.id.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [checkouts, searchQuery, statusFilter]);

  const handleConvertToOrder = (checkout: AdminCheckout) => {
    const itemsPayload = (checkout.checkout_items || []).map((i) => ({
      variantId: i.variant_id || i.product_id,
      productId: i.product_id,
      name: i.product_name,
      unit: i.variant_unit || 'pack',
      price: i.unit_price,
      qty: i.quantity,
      img: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80',
    }));

    const queryItems = encodeURIComponent(JSON.stringify(itemsPayload));
    const name = encodeURIComponent(checkout.customer_name || '');
    const phone = encodeURIComponent(checkout.customer_phone || '');
    const addr = checkout.delivery_address || {};
    const houseNo = encodeURIComponent(addr.houseNumber || addr.house_no || '');
    const area = encodeURIComponent(addr.area || '');
    const city = encodeURIComponent(addr.city || 'Hyderabad');
    const pincode = encodeURIComponent(addr.pincode || '500081');

    router.push(`/orders/create?name=${name}&phone=${phone}&houseNo=${houseNo}&area=${area}&city=${city}&pincode=${pincode}&items=${queryItems}`);
  };

  const openWhatsApp = (c: AdminCheckout) => {
    const phone = toIndianPhone(c.customer_phone);
    if (!phone) return;
    const msg = `Hi ${c.customer_name || 'there'}, we noticed your payment was pending for your Royal Bengal order. Need any assistance completing your checkout? Use code "ROYAL10" for 10% OFF! Order here: https://rbnowin.web.app`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-[#1a1a1a]">Checkout Attempts & Failed Payments</h1>
            <span className="text-xs font-semibold bg-[#ffd6a4] text-[#5e4200] px-2.5 py-0.5 rounded-full">
              ⚡ Recovery Hub
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Review pending and failed checkouts, click any row for details, and convert them to orders.</p>
        </div>

        <button
          onClick={fetchCheckouts}
          className="h-9 px-3 rounded-lg bg-white text-[13px] font-medium inline-flex items-center gap-1.5 shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50"
        >
          <Clock size={14} /> Refresh
        </button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'pending_payment', 'failed', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`h-8 px-3 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                statusFilter === st ? 'bg-[#303030] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {pretty(st)}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search by customer name or phone"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg text-[13px] border border-gray-200 outline-none focus:border-[#005bd3]"
          />
        </div>
      </div>

      {/* CHECKOUTS TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="bg-[#f7f7f7] text-[#616161] border-b border-gray-200">
                <th className="font-medium px-4 py-3">Customer</th>
                <th className="font-medium px-3 py-3">Items Count</th>
                <th className="font-medium px-3 py-3">Grand Total</th>
                <th className="font-medium px-3 py-3">Status</th>
                <th className="font-medium px-3 py-3">Time</th>
                <th className="font-medium px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                ))
              ) : filteredCheckouts.length === 0 ? (
                <tr><td colSpan={6} className="py-14 text-center text-gray-500">No checkouts found.</td></tr>
              ) : (
                filteredCheckouts.map((chk) => (
                  <tr
                    key={chk.id}
                    onClick={() => setSelected(chk)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-gray-900">{chk.customer_name || 'Guest Customer'}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Phone size={12} /> {chk.customer_phone || 'No phone'}
                      </p>
                    </td>
                    <td className="px-3 py-3.5 font-medium text-gray-700">
                      {(chk.checkout_items || []).length} { (chk.checkout_items || []).length === 1 ? 'item' : 'items' }
                    </td>
                    <td className="px-3 py-3.5 font-semibold text-gray-900 tabular-nums">
                      {formatCurrency(chk.grand_total || chk.subtotal)}
                    </td>
                    <td className="px-3 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_TONE[chk.status] || 'bg-gray-100 text-gray-800'}`}>
                        {pretty(chk.status)}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-xs text-gray-500">
                      {new Date(chk.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-2" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => openWhatsApp(chk)}
                        disabled={!toIndianPhone(chk.customer_phone)}
                        className="h-8 px-3 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs inline-flex items-center gap-1 disabled:opacity-40"
                        title="Send WhatsApp Follow-up"
                      >
                        <MessageSquare size={13} /> WhatsApp
                      </button>
                      <button
                        onClick={() => handleConvertToOrder(chk)}
                        className="h-8 px-3 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-white font-semibold text-xs inline-flex items-center gap-1 shadow-sm"
                      >
                        Convert <ArrowRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL DRAWER */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[60]" onClick={() => setSelected(null)} />
          <aside className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-200">
            <div className="h-14 px-5 bg-[#1a1a1a] text-white flex items-center justify-between shrink-0">
              <h2 className="text-sm font-semibold uppercase tracking-wider">Checkout Details</h2>
              <button onClick={() => setSelected(null)} className="p-2 -mr-2 rounded-lg hover:bg-white/10" aria-label="Close"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-[13px]">
              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Customer Information</h3>
                <p className="font-bold text-gray-900 text-sm">{selected.customer_name || 'Guest Customer'}</p>
                <p className="text-xs text-gray-600 flex items-center gap-1.5"><Phone size={13} className="text-gray-400" /> {selected.customer_phone || 'No phone'}</p>
                {selected.delivery_address && (
                  <p className="text-xs text-gray-600 flex items-start gap-1.5 mt-1">
                    <MapPin size={13} className="text-gray-400 shrink-0 mt-0.5" />
                    <span>
                      {selected.delivery_address.houseNumber || selected.delivery_address.house_no ? `${selected.delivery_address.houseNumber || selected.delivery_address.house_no}, ` : ''}
                      {selected.delivery_address.area || ''}, {selected.delivery_address.city || 'Hyderabad'} - {selected.delivery_address.pincode || ''}
                    </span>
                  </p>
                )}
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <Package size={14} /> Cart Items ({(selected.checkout_items || []).length})
                </h3>
                <div className="bg-gray-50 rounded-xl border border-gray-200 divide-y divide-gray-200 overflow-hidden">
                  {(selected.checkout_items || []).map((item, idx) => (
                    <div key={idx} className="p-3.5 flex justify-between items-center gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">{item.product_name}</p>
                        <p className="text-xs text-gray-500">{item.variant_unit} × {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 tabular-nums">{formatCurrency(item.line_total || (item.unit_price * item.quantity))}</p>
                        <p className="text-[11px] text-gray-500">{formatCurrency(item.unit_price)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill Summary */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium">{formatCurrency(selected.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="tabular-nums font-medium">{formatCurrency(selected.delivery_fee)}</span>
                </div>
                {selected.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span className="tabular-nums">-{formatCurrency(selected.discount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900 text-sm">
                  <span>Grand Total</span>
                  <span className="tabular-nums">{formatCurrency(selected.grand_total)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-gray-200 shrink-0 flex gap-3">
              <button
                onClick={() => openWhatsApp(selected)}
                disabled={!toIndianPhone(selected.customer_phone)}
                className="flex-1 h-10 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs inline-flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                <MessageSquare size={14} /> WhatsApp Follow-up
              </button>
              <button
                onClick={() => handleConvertToOrder(selected)}
                className="flex-1 h-10 rounded-xl bg-[#303030] hover:bg-[#1a1a1a] text-white font-semibold text-xs inline-flex items-center justify-center gap-1.5 shadow-sm"
              >
                Convert to Order <ArrowRight size={14} />
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
