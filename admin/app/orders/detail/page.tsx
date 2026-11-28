"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Printer, MapPin, Search, X, User, Phone, Box, Plus, RefreshCw,
  History, MessageSquare, PhoneCall, Store, Globe, Loader2,
  ChevronDown, Download, Copy, Check, CalendarClock, List,
  Map as MapIcon, AlertCircle, PackageCheck, CheckCircle2, Sparkles
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  changeAdminOrderStatus,
  listAdminOrders,
} from '@/features/orders/services/orders.service';
import type { AdminOrder } from '@/features/orders/types/order';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

const STATUS_TONE: Record<string, string> = {
  pending_payment: 'bg-amber-100 text-amber-900',
  pending: 'bg-gray-100 text-gray-800',
  confirmed: 'bg-emerald-100 text-emerald-800',
  processing: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-900',
  ready_for_delivery: 'bg-indigo-100 text-indigo-900',
  out_for_delivery: 'bg-cyan-100 text-cyan-900',
  partially_fulfilled: 'bg-orange-100 text-orange-900',
  delivered: 'bg-emerald-200 text-emerald-950 font-bold',
  completed: 'bg-emerald-300 text-emerald-950 font-bold',
  cancelled: 'bg-rose-100 text-rose-800',
};

const pretty = (s: string) => (s || '').replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

function OrderDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('id') || '';

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const flash = (type: 'error' | 'success', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOrder = async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const orders = await listAdminOrders();
      const found = orders.find(o => o.id === orderId || o.orderId === orderId || o.id.includes(orderId));
      setOrder(found || null);
    } catch (err: any) {
      console.error('Error fetching order details:', err);
      flash('error', 'Failed to load order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order || newStatus === order.status) return;
    setUpdatingStatus(true);
    try {
      await changeAdminOrderStatus(order.id, newStatus);
      setOrder(prev => prev ? { ...prev, status: newStatus } : null);
      flash('success', `Order #${order.orderId} status updated to ${pretty(newStatus)}`);
    } catch (err: any) {
      console.error('Status update failed:', err);
      flash('error', err.message || 'Failed to update order status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const copyAddress = () => {
    if (!order?.shipping) return;
    const s = order.shipping;
    const text = [
      s.name,
      s.phone,
      s.houseNumber || (s as any).houseNo,
      (s as any).buildingName || (s as any).building_name,
      s.address,
      s.city,
      s.pincode
    ].filter(Boolean).join(', ');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    flash('success', 'Address copied to clipboard!');
  };

  const printOrderReceipt = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7F6] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#006B50]" size={36} />
      </div>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#F5F7F6] p-6 text-center space-y-4">
        <h1 className="text-lg font-bold text-gray-800">Order not found</h1>
        <p className="text-xs text-gray-500">Could not locate an order for ID: {orderId || 'None provided'}</p>
        <Link href="/orders" className="text-xs font-bold text-[#006B50] underline">← Back to Orders</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7F6] text-[#17211D] p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#004D3B] hover:text-[#006B50] transition-colors"
          >
            <ArrowLeft size={16} /> Back to Orders
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={printOrderReceipt}
              className="px-4 py-2 rounded-xl bg-white hover:bg-gray-50 text-[#303030] text-xs font-bold border border-gray-200 shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Printer size={14} /> Print Invoice
            </button>
            <button
              onClick={fetchOrder}
              className="px-4 py-2 rounded-xl bg-[#004D3B] hover:bg-[#00382B] text-amber-300 text-xs font-bold shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>

        {/* TOAST */}
        {toast && (
          <div className={`p-3 rounded-xl text-xs font-bold text-center ${toast.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-900 border border-emerald-200'}`}>
            {toast.text}
          </div>
        )}

        {/* Main Order Header Card */}
        <div className="bg-white border border-[#E3EAE6] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-serif font-black text-[#17211D]">Order #{order.orderId}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_TONE[order.status] || 'bg-gray-100 text-gray-800'}`}>
                  {pretty(order.status)}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Payment: {pretty(order.paymentStatus)}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Placed on {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'} via <span className="uppercase font-bold">{order.orderSource}</span>
              </p>
            </div>

            {/* Status Change Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-600 uppercase">Status:</span>
              <select
                value={order.status}
                disabled={updatingStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="bg-[#F5F7F6] border border-gray-300 focus:border-[#006B50] rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 outline-none cursor-pointer uppercase"
              >
                <option value="pending_payment">Pending Payment</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="preparing">Preparing</option>
                <option value="ready_for_delivery">Ready For Delivery</option>
                <option value="out_for_delivery">Out For Delivery</option>
                <option value="partially_fulfilled">Partially Fulfilled</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Grid Layout: Customer & Shipping Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Customer Information */}
            <div className="p-5 rounded-2xl bg-[#F5F7F6] border border-gray-200/80 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <User size={15} className="text-[#006B50]" /> Customer Information
              </h3>
              <div>
                <p className="text-sm font-black text-gray-900">{order.userName || 'Guest User'}</p>
                <p className="text-xs text-gray-600 font-bold mt-0.5 flex items-center gap-1.5">
                  <Phone size={13} className="text-emerald-700" /> {order.userPhone ? `+91 ${order.userPhone}` : 'No phone on profile'}
                </p>
              </div>
            </div>

            {/* Delivery Shipping Address */}
            <div className="p-5 rounded-2xl bg-[#F5F7F6] border border-gray-200/80 space-y-3 relative">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <MapPin size={15} className="text-[#006B50]" /> Delivery Address
                </h3>
                <button
                  onClick={copyAddress}
                  className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-50 inline-flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check size={13} className="text-emerald-700" /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div>
                <p className="text-sm font-black text-gray-900">{order.shipping?.name || order.userName || '—'}</p>
                <p className="text-xs text-gray-700 font-medium mt-1 leading-relaxed">
                  {[
                    order.shipping?.houseNumber || (order.shipping as any)?.houseNo,
                    (order.shipping as any)?.buildingName || (order.shipping as any)?.building_name,
                    order.shipping?.address || (order.shipping as any)?.area,
                  ].filter(Boolean).join(', ')}
                  <br />
                  {[order.shipping?.city, order.shipping?.pincode].filter(Boolean).join(' - ')}
                </p>
                <p className="text-xs font-bold text-gray-600 mt-2 flex items-center gap-1">
                  <Phone size={12} /> {order.shipping?.phone || order.userPhone || '—'}
                </p>
              </div>
            </div>

          </div>

          {/* Ordered Items Table */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <Box size={15} className="text-[#006B50]" /> Order Items ({order.items.length})
            </h3>

            <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-200 bg-white">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center font-black text-xs text-gray-700 shrink-0">
                      {item.qty}x
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 font-medium">Unit: {item.unit || 'pack'} · ₹{item.price} each</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-gray-900">{formatCurrency(item.subtotal)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Summary */}
          <div className="p-5 rounded-2xl bg-[#F5F7F6] border border-gray-200/80 space-y-2.5 max-w-sm ml-auto">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 pb-1 border-b border-gray-200">Bill Details</h3>
            <div className="flex justify-between text-xs font-bold text-gray-700">
              <span>Items Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-xs font-bold text-emerald-800">
                <span>Discount / Coupon</span>
                <span>- {formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs font-bold text-gray-700">
              <span>Delivery Fee</span>
              <span>{order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
              <span>Grand Total</span>
              <span className="text-[#004D3B]">{formatCurrency(order.total)}</span>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F7F6] flex items-center justify-center"><Loader2 className="animate-spin text-[#006B50]" size={36} /></div>}>
      <OrderDetailContent />
    </Suspense>
  );
}
