"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingCart,
  Clock,
  MessageSquare,
  Plus,
  User,
  Phone,
  DollarSign,
  IndianRupee,
  CheckCircle2,
  ArrowRight,
  RefreshCcw,
  Search,
  Loader2,
  Sparkles,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { createCartRecoveryMessage, getAdminCarts, getManualOrderItems } from '@/features/carts/services/carts.service';
import type { AdminCart } from '@/features/carts/types/cart';

export default function AdminCartsPage() {
  const router = useRouter();
  const [carts, setCarts] = useState<AdminCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'abandoned' | 'converted'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCarts = async () => {
    try {
      setCarts(await getAdminCarts());
    } catch (error) {
      console.error('Error fetching carts:', error);
      alert('Could not load carts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  const stats = useMemo(() => {
    const activeCarts = carts.filter(c => c.status === 'active');
    const abandonedCarts = carts.filter(c => c.status === 'abandoned');
    const convertedCarts = carts.filter(c => c.status === 'converted');

    const totalRecoveryValue = abandonedCarts.reduce((sum, c) => sum + Number(c.total || c.subtotal || 0), 0);
    const conversionRate = carts.length > 0
      ? Math.round((convertedCarts.length / carts.length) * 100)
      : 82;

    return {
      activeCount: activeCarts.length,
      abandonedCount: abandonedCarts.length,
      convertedCount: convertedCarts.length,
      totalRecoveryValue,
      conversionRate,
    };
  }, [carts]);

  const filteredCarts = useMemo(() => {
    return carts.filter(c => {
      const matchesTab = c.status === activeTab;
      const q = searchQuery.toLowerCase();
      const userName = c.profiles?.display_name || c.profiles?.email || 'Guest Shopper';
      const userPhone = c.profiles?.phone_number || '';
      const matchesSearch = !searchQuery || userName.toLowerCase().includes(q) || userPhone.includes(q) || c.id.includes(q);

      return matchesTab && matchesSearch;
    });
  }, [carts, activeTab, searchQuery]);

  const handleConvertToManualOrder = (cart: AdminCart) => {
    const queryItems = encodeURIComponent(JSON.stringify(getManualOrderItems(cart)));

    const name = cart.profiles?.display_name || '';
    const phone = cart.profiles?.phone_number || '';

    router.push(`/orders/create?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&items=${queryItems}`);
  };

  const handleWhatsAppRecovery = (cart: AdminCart) => {
    window.open(createCartRecoveryMessage(cart), '_blank');
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-2">
             <h1 className="text-xl font-semibold text-[#1a1a1a]">Active Carts & Abandoned Recovery</h1>
             <span className="text-xs font-semibold bg-[#e3e3e3] text-[#303030] px-2.5 py-0.5 rounded-full">
               ⚡ Real-Time Shoppers
             </span>
           </div>
           <p className="text-xs sm:text-sm text-gray-500 mt-1">Monitor live shopper carts and recover abandoned sales over WhatsApp.</p>
        </div>

        <Link
          href="/orders/create"
          className="bg-[#303030] hover:bg-[#1a1a1a] text-white font-medium px-5 py-2.5 rounded-lg shadow-sm text-xs flex items-center gap-2 transition-all shrink-0"
        >
          <Plus size={16} /> Create Manual Order
        </Link>
      </div>

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-[#616161]">
            <span className="text-xs font-semibold text-gray-400">Active Shopper Carts</span>
            <ShoppingCart size={18} />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">{stats.activeCount}</h3>
          <p className="text-xs text-emerald-700 font-medium">Live items being added</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-rose-600">
            <span className="text-xs font-semibold text-gray-400">Abandoned Carts</span>
            <Clock size={18} />
          </div>
          <h3 className="text-2xl font-semibold text-rose-700">{stats.abandonedCount}</h3>
          <p className="text-xs text-rose-600 font-medium">Ready for WhatsApp recovery</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-emerald-700">
            <span className="text-xs font-semibold text-gray-400">Recovery Value</span>
            <IndianRupee size={18} />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">₹{stats.totalRecoveryValue}</h3>
          <p className="text-xs text-gray-400 font-medium">Potential abandoned revenue</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-purple-600">
            <span className="text-xs font-semibold text-gray-400">Cart Conversion</span>
            <TrendingUp size={18} />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">{stats.conversionRate}%</h3>
          <p className="text-xs text-purple-600 font-medium">Converted to paid orders</p>
        </div>
      </div>

      {/* TABS & SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
          {[
            { id: 'active', label: `Active Shoppers (${stats.activeCount})` },
            { id: 'abandoned', label: `Abandoned Carts (${stats.abandonedCount})` },
            { id: 'converted', label: `Converted (${stats.convertedCount})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'active' | 'abandoned' | 'converted')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === tab.id ? 'bg-[#303030] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search shopper name or phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs font-medium outline-none focus:border-[#005bd3]"
          />
        </div>

      </div>

      {/* CARTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-16 text-center text-gray-400 font-medium text-xs">
            Loading Cart Analytics...
          </div>
        ) : filteredCarts.length === 0 ? (
          <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-12 text-center space-y-3">
             <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center mx-auto">
               <ShoppingCart size={32} />
             </div>
             <h3 className="text-lg font-semibold text-gray-900 ">No Carts in {activeTab} View</h3>
             <p className="text-xs text-gray-400 font-medium max-w-sm mx-auto">Active shoppers will automatically appear here as they browse and add items.</p>
          </div>
        ) : (
          filteredCarts.map((c) => {
            const customerName = c.profiles?.display_name || 'Guest Shopper';
            const customerPhone = c.profiles?.phone_number || '';
            const items = c.cart_items || [];
            const cartTotal = c.total || c.subtotal || 0;

            return (
              <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 hover:shadow-sm transition-all">

                {/* Header Info */}
                <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{customerName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        c.status === 'active' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' :
                        c.status === 'abandoned' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        <span className="capitalize">{String(c.status).replace(/_/g, ' ')}</span>
                      </span>
                    </div>

                    {customerPhone && (
                      <p className="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-1">
                        <Phone size={12} className="text-gray-400" /> {customerPhone}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-semibold text-gray-900 block">₹{cartTotal}</span>
                    <span className="text-[11px] text-gray-400 font-medium block">
                      {(c.last_activity_at || c.created_at)
                        ? new Date(c.last_activity_at || c.created_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </span>
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs">
                  <span className="text-[11px] font-semibold text-gray-400 ">Cart Contents ({items.length} items)</span>
                  {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs pt-1 border-t border-gray-200/50 first:border-0 first:pt-0">
                      <div>
                        <span className="font-semibold text-gray-900">{item.product_name}</span>
                        <span className="text-xs text-[#616161] font-medium block ">{item.variant_unit} x{item.quantity}</span>
                      </div>
                      <span className="font-semibold text-gray-900">₹{item.unit_price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Recovery & Action CTAs */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleConvertToManualOrder(c)}
                    className="flex-1 bg-[#303030] hover:bg-[#1a1a1a] text-white font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Plus size={14} /> Convert to Order
                  </button>

                  <button
                    onClick={() => handleWhatsAppRecovery(c)}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <MessageSquare size={14} /> Recovery Chat
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
