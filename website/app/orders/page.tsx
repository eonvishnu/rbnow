"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import { useCart } from '@/context/CartProvider';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Package, 
  Clock,
  CheckCircle2,
  XCircle, 
  ShoppingBag,
  MapPin,
  Sparkles,
  RefreshCw,
  Truck,
  PhoneCall,
  History
} from 'lucide-react';

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const { addToCart } = useCart();

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
        <div className="w-10 h-10 border-4 border-amber-400 border-t-emerald-800 rounded-full animate-spin" />
        <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Loading Your Orders...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-center mb-6 shadow-md">
          <ShoppingBag className="text-emerald-800" size={36} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Sign In to View Orders</h2>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-2 mb-8">Access live tracking and order receipts</p>
        <Link href="/login" className="bg-emerald-800 text-amber-300 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-900/20 hover:bg-emerald-900 transition-all">
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-28 text-gray-900">
      
      {/* Toast Notification */}
      {reorderSuccessMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-emerald-950 text-amber-300 border border-amber-400/50 px-6 py-3 rounded-2xl shadow-2xl text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top duration-300 flex items-center gap-2">
          <Sparkles size={16} /> {reorderSuccessMsg}
        </div>
      )}

      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-100 px-4 sm:px-6 py-4 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Link href="/" className="p-2 -ml-2 text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-full transition-all">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-emerald-950">Royal Orders</h1>
            </div>
            <Link href="/" className="text-[10px] font-black text-emerald-800 bg-emerald-50 border border-amber-200 px-4 py-2 rounded-full uppercase tracking-widest hover:bg-emerald-100 transition-colors">
                Shop Fresh
            </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-8">

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-[32px] p-8 shadow-sm">
             <div className="w-20 h-20 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-center mx-auto mb-6">
                <Package className="text-emerald-700" size={40} />
             </div>
             <h3 className="text-gray-900 font-black text-xl uppercase tracking-tight">No Royal Orders Yet</h3>
             <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-2 mb-8">
               Explore fresh river fish, mutton & authentic Bengal groceries.
             </p>
             <Link href="/" className="bg-emerald-800 text-amber-300 font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-900/20 hover:bg-emerald-900 transition-all">
                Browse Menu
             </Link>
          </div>
        ) : (
          <>
            {/* SECTION 1: ACTIVE / IN-PROGRESS ORDERS */}
            {activeOrders.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                    Active Orders ({activeOrders.length})
                  </h2>
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    ⚡ Delivering Soon
                  </span>
                </div>

                <div className="space-y-4">
                  {activeOrders.map((order) => {
                    const isOutForDelivery = order.status === 'out_for_delivery';

                    return (
                      <div key={order.id} className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white border-2 border-amber-400/80 rounded-[28px] overflow-hidden shadow-2xl">

                        {/* Header */}
                        <div className="p-5 border-b border-emerald-800/80 flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-amber-300 font-black text-base">{order.orderId}</span>
                              <span className="bg-amber-400 text-emerald-950 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                {order.status === 'out_for_delivery' ? 'Out for Delivery 🚚' : 'Processing ⚡'}
                              </span>
                            </div>
                            <p className="text-[11px] text-emerald-200 mt-0.5 font-medium">
                              Estimated Arrival: <span className="font-bold text-amber-300">20 - 30 Mins</span>
                            </p>
                          </div>

                          <a
                            href="tel:+919876543210"
                            className="bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 border border-amber-400/30 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all"
                          >
                            <PhoneCall size={12} /> Call Support
                          </a>
                        </div>

                        {/* Live Delivery Progress Tracker */}
                        <div className="p-5 bg-emerald-900/60 border-b border-emerald-800/80 space-y-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300 flex items-center gap-1">
                            <Sparkles size={12} /> Real-Time Live Status
                          </p>

                          <div className="grid grid-cols-3 gap-2 text-center relative">
                            <div className="flex flex-col items-center">
                              <div className="w-9 h-9 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center font-black text-xs shadow-lg shadow-amber-400/20">
                                ✓
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-wider mt-1 text-amber-300">Packed</span>
                            </div>

                            <div className="flex flex-col items-center">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs border ${
                                isOutForDelivery ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-lg' : 'bg-emerald-950/80 text-emerald-400 border-emerald-700'
                              }`}>
                                🚚
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-wider mt-1 text-emerald-200">On The Way</span>
                            </div>

                            <div className="flex flex-col items-center">
                              <div className="w-9 h-9 rounded-full bg-emerald-950/80 text-emerald-500 border border-emerald-700 flex items-center justify-center font-bold text-xs">
                                🏠
                              </div>
                              <span className="text-[9px] font-bold uppercase tracking-wider mt-1 text-emerald-400">Delivered</span>
                            </div>
                          </div>

                          {/* Audit History Timeline */}
                          {order.history && order.history.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-emerald-800/80 space-y-1 text-[10px] text-emerald-200">
                              <p className="font-bold uppercase text-amber-300 flex items-center gap-1">
                                <History size={11} /> Order Audit Log
                              </p>
                              {order.history.map((h: any, i: number) => (
                                <div key={i} className="flex justify-between items-center text-[10px]">
                                  <span className="capitalize">{h.status}: {h.notes || 'Status updated'}</span>
                                  <span className="text-emerald-400">{new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Items */}
                        <div className="p-5 space-y-3 divide-y divide-emerald-800/50">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-xs pt-2">
                              <div className="flex items-center gap-3">
                                <img src={item.img} className="w-10 h-10 rounded-xl object-cover border border-amber-400/20 shrink-0" alt={item.name} />
                                <div>
                                  <p className="font-bold text-white">{item.name}</p>
                                  <p className="text-[10px] text-amber-300 font-bold uppercase">{item.qty} x {item.unit}</p>
                                </div>
                              </div>
                              <span className="font-black text-amber-300 text-sm">{formatCurrency(item.subtotal)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Address & Total */}
                        <div className="p-5 bg-emerald-950/90 border-t border-emerald-800/80 flex justify-between items-center">
                          {order.deliveryAddress && (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-200 truncate max-w-[220px]">
                              <MapPin size={14} className="text-amber-400 shrink-0" />
                              <span className="truncate">{order.deliveryAddress.houseNumber ? `${order.deliveryAddress.houseNumber}, ` : ''}{order.deliveryAddress.address}</span>
                            </div>
                          )}
                          <div className="text-right">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300 block">Total Paid</span>
                            <span className="text-xl font-black text-amber-400 tracking-tight">{formatCurrency(order.total)}</span>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* SECTION 2: PAST / DELIVERED ORDERS */}
            {pastOrders.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 pt-2">
                  Past Orders ({pastOrders.length})
                </h2>

                <div className="space-y-4">
                  {pastOrders.map((order) => {
                    const isDelivered = order.status === 'delivered';

                    return (
                      <div key={order.id} className="bg-white border border-gray-200 rounded-[28px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">

                        {/* Order Header */}
                        <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/60">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                              isDelivered ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
                            }`}>
                              {isDelivered ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-gray-900 text-sm">{order.orderId}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                  isDelivered ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                  {isDelivered ? 'Delivered Fresh' : 'Cancelled'}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                                {order.createdAt.toLocaleDateString('en-IN', {
                                  day: 'numeric', month: 'short', year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleReorder(order.items)}
                            className="bg-emerald-800 hover:bg-emerald-900 text-amber-300 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                          >
                            <RefreshCw size={12} /> Reorder
                          </button>
                        </div>

                        {/* Order Items */}
                        <div className="p-4 sm:p-5 space-y-2.5 divide-y divide-gray-50">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-xs pt-1.5">
                              <div className="flex items-center gap-3">
                                <img src={item.img} className="w-9 h-9 rounded-xl object-cover border border-gray-100 shrink-0" alt={item.name} />
                                <div>
                                  <p className="font-extrabold text-gray-800">{item.name}</p>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase">{item.qty} x {item.unit}</p>
                                </div>
                              </div>
                              <span className="font-bold text-gray-900">{formatCurrency(item.subtotal)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Total Footer */}
                        <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Amount Paid</span>
                          <span className="text-lg font-black text-gray-900 tracking-tight">{formatCurrency(order.total)}</span>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}

      </div>
    </main>
  );
}
