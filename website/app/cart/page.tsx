"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from "@/lib/supabase";
import { useCart } from '@/context/CartProvider';
import { useAuth } from '@/context/AuthProvider';
import { useLocation } from '@/context/LocationContext';
import { useRouter } from 'next/navigation';
import { getOrCreateBrowserId } from '@/lib/browserId';
import Link from 'next/link';
import {
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Truck,
  ShieldCheck,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Crown,
  MapPin,
  Map,
  Tag,
  CreditCard,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Wallet
} from 'lucide-react';

function extractProductId(id: string): string {
  if (!id) return '';
  if (id.length >= 36) {
    return id.substring(0, 36);
  }
  const lastDash = id.lastIndexOf('-');
  return lastDash !== -1 ? id.substring(0, lastDash) : id;
}

export default function CartPage() {
  const { cart, addToCart, removeFromCart, clearCart, totalAmount } = useCart();
  const { user, userData, loading: authLoading } = useAuth();
  const { location, setIsModalOpen } = useLocation();
  const router = useRouter();
  
  const [stockData, setStockData] = useState<Record<string, number>>({});
  const [checkingStock, setCheckingStock] = useState(true);

  // Dynamic Store Settings
  const [storeSettings, setStoreSettings] = useState({
    freeDeliveryThreshold: 700,
    minOrderAmount: 0,
  });

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Payment Placement State
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Fetch Dynamic Store Settings from Supabase
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase.from('store_settings').select('*').eq('id', 'default').single();
        if (data) {
          setStoreSettings({
            freeDeliveryThreshold: Number(data.free_delivery_threshold || 700),
            minOrderAmount: Number(data.min_order_amount || 0),
          });
        }
      } catch (err) {
        console.error('Error loading store settings:', err);
      }
    };
    fetchSettings();
  }, []);

  // Dynamically load Razorpay SDK Script
  useEffect(() => {
    const scriptId = 'razorpay-checkout-js';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const freeThreshold = storeSettings.freeDeliveryThreshold;

  const deliveryFee = useMemo(() => {
    if (totalAmount === 0) return 0;
    if (totalAmount >= freeThreshold) return 0;
    if (totalAmount >= freeThreshold - 100) return 25;
    if (totalAmount >= freeThreshold - 200) return 45;
    return 65;
  }, [totalAmount, freeThreshold]);

  const subtotalAfterCoupon = Math.max(0, totalAmount - couponDiscount);
  const grandTotal = subtotalAfterCoupon + deliveryFee;

  const groupedCart = useMemo(() => {
    return cart.reduce((acc: any, item: any) => {
      acc[item.id] = acc[item.id] || { ...item, qty: 0 };
      acc[item.id].qty += 1;
      return acc;
    }, {});
  }, [cart]);

  useEffect(() => {
    const fetchStock = async () => {
      if (cart.length === 0) {
        setCheckingStock(false);
        return;
      }
      const uniqueCleanIds = [...new Set(cart.map((item: any) => extractProductId(item.id)))];
      const stockMap: Record<string, number> = {};

      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, is_available")
          .in("id", uniqueCleanIds);

        if (!error && data) {
          data.forEach(p => {
            stockMap[p.id] = p.is_available ? 999 : 0;
          });
        }
        setStockData(stockMap);
      } catch (err) {
        console.error("Stock check failed:", err);
      } finally {
        setCheckingStock(false);
      }
    };
    fetchStock();
  }, [cart.length]);

  const hasStockIssues = useMemo(() => {
    return Object.values(groupedCart).some((item: any) => {
      const cleanId = extractProductId(item.id);
      const stock = stockData[cleanId];
      return stock !== undefined && stock === 0;
    });
  }, [groupedCart, stockData]);

  // Handle Address Change Click (Prompt Login if Unauthenticated)
  const handleAddressChangeClick = () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent('/cart')}`);
    } else {
      setIsModalOpen(true);
    }
  };

  // Handle Promo Coupon Validation
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setValidatingCoupon(true);
    setCouponMsg('');
    setCheckoutError('');

    try {
      const codeKey = couponCode.trim().toUpperCase();
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', codeKey)
        .single();

      if (error || !coupon || !coupon.is_active) {
        setCouponMsg('Invalid or expired promo code.');
        setAppliedCoupon(null);
        setCouponDiscount(0);
        return;
      }

      if (totalAmount < Number(coupon.min_order_amount || 0)) {
        setCouponMsg(`Minimum order amount of ₹${coupon.min_order_amount} required for code ${codeKey}.`);
        setAppliedCoupon(null);
        setCouponDiscount(0);
        return;
      }

      // Calculate Coupon Discount
      let calcDiscount = 0;
      if (coupon.discount_type === 'percentage') {
        calcDiscount = Math.floor((totalAmount * Number(coupon.discount_value)) / 100);
        if (coupon.max_discount_amount) {
          calcDiscount = Math.min(calcDiscount, Number(coupon.max_discount_amount));
        }
      } else {
        calcDiscount = Number(coupon.discount_value);
      }

      setAppliedCoupon(coupon);
      setCouponDiscount(calcDiscount);
      setCouponMsg(`Promo code "${codeKey}" applied! You saved ₹${calcDiscount}.`);
    } catch (err) {
      console.error(err);
      setCouponMsg('Failed to validate promo code.');
    } finally {
      setValidatingCoupon(false);
    }
  };

  // 1-TAP EXPRESS CHECKOUT & RAZORPAY PAYMENT
  const handleExpressCheckout = async () => {
    if (authLoading || hasStockIssues) return;
    setCheckoutError('');

    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent('/cart')}`);
      return;
    }

    setIsPlacingOrder(true);
    try {
      const browserId = getOrCreateBrowserId();
      const payloadItems = Object.values(groupedCart).map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        unit: item.unit,
        qty: item.qty,
      }));

      const deliveryDetails = {
        name: userData?.display_name || user.email || 'Customer',
        phone: (userData?.phone_number || '').trim() || '7893274753',
        lat: location.lat,
        lng: location.lng,
        area: location.area || 'Madhapur',
        city: location.city || 'Hyderabad',
        pincode: location.pincode || '500081',
        houseNo: location.houseNumber || '',
        address: location.address || `${location.area || 'Madhapur'}, ${location.city || 'Hyderabad'}`,
      };

      // 1. Invoke Supabase Edge Function: place-order
      const { data, error: edgeError } = await supabase.functions.invoke('place-order', {
        body: {
          items: payloadItems,
          details: deliveryDetails,
          couponCode: appliedCoupon ? appliedCoupon.code : null,
          userId: user.id,
          browserId: browserId,
        }
      });

      if (edgeError || !data || data.error) {
        throw new Error((data && data.error) || (edgeError && edgeError.message) || 'Failed to place order');
      }

      if (!data.keyId || !data.razorpayOrderId) {
        throw new Error("Invalid payment initialization response from server.");
      }

      // 2. Launch Razorpay Payment Gateway
      if (!(window as any).Razorpay) {
        throw new Error('Razorpay payment gateway script not loaded. Please refresh.');
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: 'INR',
        name: 'Royal Bengal',
        description: 'Gourmet Express Delivery',
        order_id: data.razorpayOrderId,
        prefill: {
          name: deliveryDetails.name,
          email: user.email,
          contact: deliveryDetails.phone,
        },
        theme: { color: '#022c22' },
        handler: async (response: any) => {
          try {
            // Verify Payment Signature via Edge Function
            const { data: vData, error: vErr } = await supabase.functions.invoke('verify-payment', {
              body: {
                checkoutId: data.checkoutId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            });

            if (!vErr && vData && vData.success) {
              clearCart();
              router.push('/orders');
            } else {
              alert('Payment verification failed: ' + ((vData && vData.error) || 'Signature error'));
            }
          } catch (err: any) {
            console.error(err);
            alert('Payment verification error: ' + err.message);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      console.error(err);
      setCheckoutError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#022c22] text-white pb-28 selection:bg-amber-400 selection:text-emerald-950 w-full max-w-[100vw] overflow-x-hidden">
      
      {/* Header Container */}
      <div className="p-4 sm:p-6 border-b border-amber-400/30 flex items-center justify-between sticky top-0 bg-[#022c22]/95 backdrop-blur-md z-40">
        <Link href="/" className="text-amber-300 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:text-white transition-all">
          <ArrowLeft size={16} /> Back
        </Link>

        <div className="flex items-center gap-2">
          <Crown size={18} className="text-amber-400" />
          <h1 className="text-xs sm:text-sm font-serif font-black uppercase tracking-[0.25em] text-amber-300">Royal Express Checkout</h1>
        </div>

        <div className="w-16" />
      </div>

      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">

        {/* TOP ACTIVE DELIVERY ADDRESS CARD */}
        <div className="p-4 sm:p-5 rounded-[28px] bg-emerald-900/80 border-2 border-amber-400/80 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black shrink-0 shadow-md">
              <MapPin size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-full">
                  {location.label || 'HOME'}
                </span>
                <span className="text-xs font-black uppercase text-amber-300">Delivering To</span>
              </div>
              <p className="text-xs text-emerald-100 font-bold truncate max-w-[280px] sm:max-w-md mt-0.5">
                {location.address || `${location.area || 'Madhapur'}, ${location.city || 'Hyderabad'}`}
              </p>
            </div>
          </div>

          <button
            onClick={handleAddressChangeClick}
            className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-[10px] uppercase px-4 py-2.5 rounded-xl tracking-wider shadow-md transition-all active:scale-95 shrink-0 flex items-center gap-1.5"
          >
            <Map size={14} /> Change / Add Address
          </button>
        </div>
        
        {cart.length === 0 ? (
          <div className="py-20 max-w-md mx-auto text-center border-2 border-amber-400/50 bg-emerald-900/60 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-sm">
            <div className="w-20 h-20 bg-amber-400 text-emerald-950 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <ShoppingBag size={40} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-white">Your Royal Cart is Empty</h3>
            <p className="text-emerald-200 text-xs font-medium uppercase tracking-widest mb-8 leading-relaxed">
              Explore our fresh Padma river fish, <br/> gourmet mutton & artisanal Bengal delicacies.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black px-8 py-4 rounded-2xl uppercase tracking-[0.2em] text-xs shadow-xl active:scale-95 transition-all">
              Explore Menu <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

            {/* Left: Itemized Cart & Promo Coupon */}
            <section className="lg:col-span-7 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xs font-black text-amber-300/80 uppercase tracking-[0.2em]">Selected Items ({Object.keys(groupedCart).length})</h2>
              </div>

              {Object.values(groupedCart).map((item: any) => {
                const cleanId = extractProductId(item.id);
                const isOutOfStock = stockData[cleanId] === 0;

                return (
                  <div key={item.id} className={`relative p-4 rounded-[24px] border transition-all duration-300 flex items-center justify-between shadow-lg ${
                    isOutOfStock ? 'bg-rose-950/80 border-rose-500' : 'bg-emerald-900/60 border-amber-400/40 hover:border-amber-400'
                  }`}>
                    <div className="flex items-center gap-3.5 sm:gap-4">
                      <div className="relative shrink-0">
                        <img
                          src={item.img || 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80'}
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-amber-400/30 ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
                          alt={item.name}
                        />
                      </div>
                      <div>
                        <p className={`text-xs sm:text-sm font-black ${isOutOfStock ? 'text-gray-400' : 'text-white'}`}>{item.name}</p>
                        <p className="text-[11px] text-amber-300 font-bold uppercase mt-0.5">₹{item.price} / {item.unit}</p>
                        {isOutOfStock && <p className="text-[10px] text-rose-400 font-black uppercase mt-1 animate-pulse">⚠️ Out of Stock</p>}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-emerald-950 text-amber-300 rounded-xl h-9 border border-amber-400/40 shadow-sm">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="px-3 h-full font-black text-lg hover:bg-white/10 transition-colors"
                        >
                          −
                        </button>
                        <span className="text-xs font-black w-5 text-center text-white">{item.qty}</span>
                        <button
                          onClick={() => addToCart(item, 99)}
                          className="px-3 h-full font-black text-lg hover:bg-white/10 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          for(let i = 0; i < item.qty; i++) removeFromCart(item.id);
                        }}
                        className="p-2 text-emerald-300 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                  </div>
                );
              })}

              {/* PROMO COUPON ACCORDION BOX */}
              <div className="bg-emerald-900/60 p-5 rounded-[24px] border border-amber-400/40 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider">
                  <Tag size={16} /> Have a Promo Code?
                </div>

                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon (e.g. WELCOME10)"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-emerald-950 border border-amber-400/40 rounded-xl px-4 py-2.5 text-xs font-black uppercase text-amber-300 outline-none placeholder:text-gray-500"
                  />
                  <button
                    type="submit"
                    disabled={validatingCoupon}
                    className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all shrink-0 disabled:opacity-50"
                  >
                    {validatingCoupon ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
                  </button>
                </form>

                {couponMsg && (
                  <p className={`text-[11px] font-bold ${appliedCoupon ? 'text-amber-300' : 'text-rose-400'}`}>
                    {couponMsg}
                  </p>
                )}
              </div>

            </section>

            {/* Right: Payment Method & Bill Summary Section */}
            <section className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">

              {/* PAYMENT METHOD BADGE */}
              <div className="bg-emerald-900/80 p-4 rounded-[28px] border-2 border-amber-400/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CreditCard size={18} className="text-amber-400" />
                  <div>
                    <span className="text-xs font-black text-amber-300 uppercase block">Razorpay Online Payment</span>
                    <span className="text-[9px] font-bold text-emerald-200">GPay, PhonePe, Cards, NetBanking</span>
                  </div>
                </div>
                <span className="text-[9px] font-black uppercase bg-amber-400 text-emerald-950 px-2.5 py-1 rounded-full shadow-xs">
                  SECURE
                </span>
              </div>

              {/* BILL SUMMARY BOX */}
              <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-emerald-900 p-6 sm:p-8 rounded-[32px] border-2 border-amber-400/80 space-y-5 shadow-2xl relative overflow-hidden">

                <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
                  <h2 className="text-xs font-black text-amber-300 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Sparkles size={14} /> Bill Summary
                  </h2>
                  <span className="text-[10px] font-black uppercase bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-full">
                    Gourmet Delivery
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between font-bold text-emerald-200 uppercase tracking-wider">
                    <span>Items Subtotal</span>
                    <span className="text-white font-black text-sm">₹{totalAmount}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between font-bold text-amber-300 uppercase tracking-wider">
                      <span>Promo Discount</span>
                      <span className="font-black text-amber-300">- ₹{couponDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold uppercase tracking-wider">
                    <span className="text-emerald-200">Express Delivery Fee</span>
                    <span className={deliveryFee === 0 ? "text-amber-300 font-black" : "text-white font-black"}>
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>

                  {totalAmount > 0 && totalAmount < freeThreshold && (
                    <div className="pt-1">
                       <span className="text-[10px] font-extrabold text-amber-300 bg-emerald-900/90 px-3 py-1.5 rounded-xl border border-amber-400/30 block text-center">
                         Add ₹{freeThreshold - totalAmount} more for FREE Express Delivery
                       </span>
                    </div>
                  )}

                  <div className="h-px bg-emerald-800/80 w-full my-3" />

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-[0.2em]">Grand Total</span>
                    <span className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">₹{grandTotal}</span>
                  </div>
                </div>

                {checkoutError && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500 text-rose-300 text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                <button
                  onClick={handleExpressCheckout}
                  disabled={hasStockIssues || checkingStock || isPlacingOrder}
                  className={`w-full text-center font-black py-5 rounded-2xl shadow-xl uppercase tracking-[0.2em] text-xs transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 ${
                    hasStockIssues || checkingStock || isPlacingOrder
                    ? 'bg-emerald-950/60 text-gray-500 border border-emerald-800 cursor-not-allowed shadow-none'
                    : 'bg-amber-400 hover:bg-amber-300 text-emerald-950 border border-amber-300 shadow-amber-400/20'
                  }`}
                >
                  {isPlacingOrder ? <Loader2 size={16} className="animate-spin" /> : <>⚡ Place Order & Pay <ArrowRight size={16} /></>}
                </button>

                <div className="p-3 rounded-2xl bg-emerald-900/60 border border-emerald-800 flex items-center gap-2.5 text-[10px] text-emerald-200 font-bold">
                  <ShieldCheck size={16} className="text-amber-400 shrink-0" />
                  <span>Insulated temperature packaging on all fresh catches.</span>
                </div>

              </div>
            </section>

          </div>
        )}
      </div>
    </main>
  );
}
