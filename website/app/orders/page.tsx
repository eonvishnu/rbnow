"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import { useCart } from '@/context/CartProvider';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Package, 
  Check,
  X,
  ShoppingBag,
  MapPin,
  Sparkles,
  RefreshCw,
  Truck,
  PhoneCall,
  Clock,
  Box,
  Bike,
  CheckCircle2,
  XCircle,
  Leaf
} from 'lucide-react';

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reorderSuccessMsg, setReorderSuccessMsg] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*, order_items(*), order_status_history(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!ordersError && ordersData) {
          setOrders(ordersData.map(o => ({
            id: o.id,
            orderId: `RB-${o.order_number || o.id.slice(0, 6).toUpperCase()}`,
            status: o.status || 'pending',
            createdAt: o.created_at ? new Date(o.created_at) : new Date(),
            total: o.total,
            subtotal: o.subtotal,
            deliveryFee: o.delivery_fee,
            discount: o.discount,
            deliveryAddress: o.delivery_address,
            history: o.order_status_history || [],
            items: (o.order_items || []).map((item: any) => ({
              id: item.variant_id || item.product_id,
              name: item.product_name,
              qty: item.quantity,
              price: item.price,
              subtotal: item.total_price,
              unit: item.variant_unit || 'pack',
              img: item.product_image || 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80',
            })),
          })));
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, authLoading]);

  const activeOrders = useMemo(() => {
    return orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  }, [orders]);

  const pastOrders = useMemo(() => {
    return orders.filter(o => o.status === 'delivered' || o.status === 'cancelled');
  }, [orders]);

  const handleReorder = (items: any[]) => {
    items.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        unit: item.unit,
        img: item.img,
      }, 99);
    });
    setReorderSuccessMsg('All items added back to your cart!');
    setTimeout(() => setReorderSuccessMsg(''), 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#ffc400] border-t-[#004d3b] rounded-full animate-spin" />
        <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Loading Your Orders...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-[#e5f5ef] rounded-3xl border border-[#bce2d3] flex items-center justify-center mb-6 shadow-md">
          <ShoppingBag className="text-[#004d3b]" size={36} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Sign In to View Orders</h2>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-2 mb-8">Access live tracking and order receipts</p>
        <Link href="/login" className="bg-[#004d3b] text-[#ffc400] px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-[#004d3b]/20 hover:bg-[#00382b] transition-all">
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-28 text-[#17211D] select-none">
      
      {/* Toast Notification */}
      {reorderSuccessMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-[#004d3b] text-[#ffc400] border border-amber-300 px-6 py-3 rounded-2xl shadow-2xl text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top duration-300 flex items-center gap-2">
          <Sparkles size={16} /> {reorderSuccessMsg}
        </div>
      )}

      {/* Header Bar matching rbnow.in screenshot */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 py-3.5 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-1.5 -ml-2 text-gray-700 hover:text-[#004d3b] hover:bg-[#e5f5ef] rounded-full transition-all">
              <ArrowLeft size={22} />
            </Link>
            <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider text-[#004d3b] font-serif">ROYAL BENGAL</h1>
          </div>

          <Link href="/" className="bg-[#e5f5ef] hover:bg-[#d5efe5] text-[#006b50] border border-[#bce2d3] px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all">
            <Leaf size={14} className="fill-[#006b50]" /> SHOP FRESH
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">

        {/* ACTIVE / PAST TABS SWITCHER */}
        <div className="flex border-b border-gray-200 text-xs font-black tracking-wider uppercase">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3 px-4 relative transition-colors ${
              activeTab === 'active' ? 'text-[#004d3b]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            ACTIVE ORDERS ({activeOrders.length})
            {activeTab === 'active' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#004d3b] rounded-t-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('past')}
            className={`pb-3 px-4 relative transition-colors ${
              activeTab === 'past' ? 'text-[#004d3b]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            PAST ORDERS
            {activeTab === 'past' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#004d3b] rounded-t-full" />
            )}
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-[32px] p-8 shadow-sm">
             <div className="w-20 h-20 bg-[#e5f5ef] rounded-3xl border border-[#bce2d3] flex items-center justify-center mx-auto mb-6">
                <Package className="text-[#004d3b]" size={40} />
             </div>
             <h3 className="text-gray-900 font-black text-xl uppercase tracking-tight">No Royal Orders Yet</h3>
             <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-2 mb-8">
               Explore fresh river fish, mutton & authentic Bengal groceries.
             </p>
             <Link href="/" className="bg-[#004d3b] text-[#ffc400] font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#004d3b]/20 hover:bg-[#00382b] transition-all">
                Browse Menu
             </Link>
          </div>
        ) : (
          <>
            {/* TAB 1: ACTIVE ORDERS */}
            {activeTab === 'active' && (
              <div className="space-y-6">
                {activeOrders.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-3xl p-10 text-center space-y-2">
                    <p className="text-sm font-black text-gray-800 uppercase">No Active Orders Currently</p>
                    <p className="text-xs text-gray-500">Your active fresh dispatches will appear here.</p>
                  </div>
                ) : (
                  activeOrders.map((order) => {
                    const statusVal = order.status || 'pending';
                    const isPlaced = true;
                    const isProcessing = ['processing', 'ready_for_dispatch', 'out_for_delivery', 'delivered'].includes(statusVal);
                    const isReady = ['ready_for_dispatch', 'out_for_delivery', 'delivered'].includes(statusVal);
                    const isOut = ['out_for_delivery', 'delivered'].includes(statusVal);
                    const isDelivered = statusVal === 'delivered';

                    return (
                      <div key={order.id} className="bg-white border border-gray-200 rounded-[28px] overflow-hidden shadow-sm p-5 space-y-5">

                        {/* Top Header Row */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-[#004d3b] font-mono tracking-tight">{order.orderId}</span>
                            <span className="bg-[#fef08a] text-[#854d0e] text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                              <Clock size={12} /> {statusVal === 'out_for_delivery' ? 'Out for Delivery' : 'Processing & Packing'}
                            </span>
                          </div>

                          <a
                            href="tel:+919876543210"
                            className="border-2 border-[#004d3b] text-[#004d3b] hover:bg-[#e5f5ef] px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
                          >
                            <PhoneCall size={13} /> Call Support
                          </a>
                        </div>

                        {/* Status Heading & Description */}
                        <div className="space-y-1">
                          <h2 className="text-base font-black text-[#004d3b] leading-snug">
                            {isOut ? "Your order is on the way!" : "We're preparing your order."}
                          </h2>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed">
                            Your payment is confirmed. We'll notify you when your order is ready for dispatch.
                          </p>
                        </div>

                        {/* 5-Stage Vertical Timeline matching rbnow.in screenshot */}
                        <div className="space-y-4 pt-1 relative">

                          {/* Stage 1: Placed & Paid */}
                          <div className="flex items-start justify-between gap-3 relative">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#006b50] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm z-10">
                                ✓
                              </div>
                              <div>
                                <h4 className="text-xs font-black text-gray-900">Placed & Paid</h4>
                                <p className="text-[11px] text-gray-500 font-medium">Payment confirmed successfully.</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-[#006b50] bg-[#e5f5ef] px-2.5 py-1 rounded-full shrink-0">
                              {order.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          {/* Stage 2: Processing & Packing */}
                          <div className="flex items-start justify-between gap-3 relative">
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-sm z-10 ${
                                isProcessing ? 'bg-[#ffc400] text-[#004d3b]' : 'bg-gray-100 text-gray-400 border border-gray-200'
                              }`}>
                                <Box size={15} />
                              </div>
                              <div>
                                <h4 className="text-xs font-black text-gray-900">Processing & Packing</h4>
                                <p className="text-[11px] text-gray-500 font-medium">Your items are being checked and packed.</p>
                              </div>
                            </div>
                            {isProcessing && !isReady && (
                              <span className="text-[10px] font-bold text-[#854d0e] bg-[#fef08a] px-2.5 py-1 rounded-full shrink-0">
                                In Progress
                              </span>
                            )}
                          </div>

                          {/* Stage 3: Ready for Dispatch */}
                          <div className="flex items-start justify-between gap-3 relative">
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-sm z-10 ${
                                isReady ? 'bg-[#ffc400] text-[#004d3b]' : 'bg-gray-100 text-gray-400 border border-gray-200'
                              }`}>
                                <Truck size={15} />
                              </div>
                              <div>
                                <h4 className="text-xs font-black text-gray-900">Ready for Dispatch</h4>
                                <p className="text-[11px] text-gray-500 font-medium">Your order is ready for delivery assignment.</p>
                              </div>
                            </div>
                          </div>

                          {/* Stage 4: Out for Delivery */}
                          <div className="flex items-start justify-between gap-3 relative">
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-sm z-10 ${
                                isOut ? 'bg-[#ffc400] text-[#004d3b]' : 'bg-gray-100 text-gray-400 border border-gray-200'
                              }`}>
                                <Bike size={15} />
                              </div>
                              <div>
                                <h4 className="text-xs font-black text-gray-900">Out for Delivery</h4>
                                <p className="text-[11px] text-gray-500 font-medium">Your order has been handed to a delivery partner.</p>
                              </div>
                            </div>
                          </div>

                          {/* Stage 5: Delivered */}
                          <div className="flex items-start justify-between gap-3 relative">
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-sm z-10 ${
                                isDelivered ? 'bg-[#006b50] text-white' : 'bg-gray-100 text-gray-400 border border-gray-200'
                              }`}>
                                ✓
                              </div>
                              <div>
                                <h4 className="text-xs font-black text-gray-900">Delivered</h4>
                                <p className="text-[11px] text-gray-500 font-medium">Your order has been delivered.</p>
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* Order Items List */}
                        <div className="pt-4 border-t border-gray-100 space-y-3">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <div className="flex items-center gap-3">
                                <img src={item.img} className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shrink-0" alt={item.name} />
                                <div>
                                  <p className="font-black text-gray-900 text-xs sm:text-sm">{item.name}</p>
                                  <p className="text-[11px] text-gray-500 font-bold">{item.qty} x {item.unit}</p>
                                </div>
                              </div>
                              <span className="font-black text-[#004d3b] text-base">₹{item.subtotal}</span>
                            </div>
                          ))}
                        </div>

                        {/* Bottom Summary Bar matching rbnow.in screenshot */}
                        <div className="bg-[#e5f5ef] border border-[#bce2d3] rounded-2xl p-3.5 flex items-center justify-between text-xs gap-3">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <MapPin size={16} className="text-[#006b50] shrink-0 fill-[#006b50]/30" />
                            <p className="text-[11px] font-bold text-gray-700 truncate">
                              {order.deliveryAddress?.houseNumber || order.deliveryAddress?.houseNo ? `${order.deliveryAddress.houseNumber || order.deliveryAddress.houseNo}, ` : ''}{order.deliveryAddress?.address || 'Delivery Address'}
                            </p>
                          </div>

                          <div className="h-8 w-px bg-[#bce2d3] shrink-0" />

                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-bold text-gray-500 block uppercase">Total Paid</span>
                            <span className="text-base font-black text-[#004d3b]">₹{order.total}</span>
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 2: PAST ORDERS */}
            {activeTab === 'past' && (
              <div className="space-y-4">
                {pastOrders.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-3xl p-10 text-center space-y-2">
                    <p className="text-sm font-black text-gray-800 uppercase">No Past Orders</p>
                    <p className="text-xs text-gray-500">Delivered orders will appear here for 1-tap reordering.</p>
                  </div>
                ) : (
                  pastOrders.map((order) => {
                    const isDelivered = order.status === 'delivered';

                    return (
                      <div key={order.id} className="bg-white border border-gray-200 rounded-[28px] overflow-hidden shadow-sm p-5 space-y-4">

                        {/* Header */}
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isDelivered ? 'bg-[#e5f5ef] text-[#006b50]' : 'bg-rose-50 text-rose-600'
                            }`}>
                              {isDelivered ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-gray-900 text-sm">{order.orderId}</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  isDelivered ? 'bg-[#e5f5ef] text-[#006b50]' : 'bg-rose-50 text-rose-700'
                                }`}>
                                  {isDelivered ? 'Delivered Fresh' : 'Cancelled'}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                                {order.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleReorder(order.items)}
                            className="bg-[#004d3b] hover:bg-[#00382b] text-[#ffc400] px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                          >
                            <RefreshCw size={12} /> Reorder
                          </button>
                        </div>

                        {/* Items */}
                        <div className="space-y-2.5">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <div className="flex items-center gap-3">
                                <img src={item.img} className="w-10 h-10 rounded-xl object-cover border border-gray-100 shrink-0" alt={item.name} />
                                <div>
                                  <p className="font-bold text-gray-800">{item.name}</p>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase">{item.qty} x {item.unit}</p>
                                </div>
                              </div>
                              <span className="font-bold text-gray-900">{formatCurrency(item.subtotal)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-400 uppercase">Amount Paid</span>
                          <span className="text-base font-black text-gray-900">{formatCurrency(order.total)}</span>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}
