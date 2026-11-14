'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartProvider';
import { useAuth } from '@/context/AuthProvider';
import { useLocation } from '@/context/LocationContext';
import { supabase } from '@/lib/supabase';
import {
  ShoppingBag, Trash2, Plus, Minus, ArrowLeft, Crown,
  MapPin, Map, Tag, Check, AlertCircle, Loader2, ArrowRight, RefreshCw, X, Sparkles, CreditCard, ShieldCheck
} from 'lucide-react';

const STORE_LAT = 17.35145220439656;
const STORE_LNG = 78.39103902563603;

function deg2rad(deg: number) { return deg * (Math.PI / 180); }

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function extractProductId(id: string): string {
  if (!id) return '';
  return id.includes('_') ? id.split('_')[0] : id;
}

function getOrCreateBrowserId(): string {
  if (typeof window === 'undefined') return 'server_browser';
  try {
    let bid = window.localStorage.getItem('rb_browser_id');
    if (!bid) {
      bid = 'browser_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      window.localStorage.setItem('rb_browser_id', bid);
    }
    return bid;
  } catch (e) {
    return 'fallback_browser';
  }
}

function loadRazorpaySDK(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart, totalAmount: rawCartSubtotal } = useCart();
  const { user, userData, authLoading } = useAuth();
  const { location, setIsModalOpen } = useLocation();

  const [stockData, setStockData] = useState<Record<string, number>>({});
  const [checkingStock, setCheckingStock] = useState(true);
  const [deliverySettings, setDeliverySettings] = useState<any>(null);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [paymentState, setPaymentState] = useState<'idle' | 'verifying' | 'failed'>('idle');
  const [paymentResultMessage, setPaymentResultMessage] = useState('');

  const checkoutInProgressRef = useRef(false);
  const paymentVerificationInProgressRef = useRef(false);

  const groupedCart = useMemo(() => {
    return cart.reduce((acc: Record<string, any>, item: any) => {
      acc[item.id] = acc[item.id] || { ...item, qty: 0 };
      acc[item.id].qty += (item.qty || 1);
      return acc;
    }, {});
  }, [cart]);

  useEffect(() => {
    const fetchStockAndSettings = async () => {
      try {
        const { data: delSet } = await supabase
          .from('delivery_settings')
          .select('*')
          .limit(1)
          .maybeSingle();
        if (delSet) setDeliverySettings(delSet);

        if (cart.length === 0) {
          setCheckingStock(false);
          return;
        }

        const variantIds = [...new Set(cart.map((item: any) => item.id))];
        const uniqueCleanIds = [...new Set(cart.map((item: any) => extractProductId(item.id)))];
        const stockMap: Record<string, number> = {};

        const { data: variantData } = await supabase
          .from('product_variants')
          .select('id, stock')
          .in('id', variantIds);

        if (variantData) {
          variantData.forEach(v => {
            stockMap[v.id] = Number(v.stock) || 0;
          });
        }

        const { data: prodData } = await supabase
          .from('products')
          .select('id, stock')
          .in('id', uniqueCleanIds);

        if (prodData) {
          prodData.forEach(p => {
            if (stockMap[p.id] === undefined) {
              stockMap[p.id] = Number(p.stock) || 0;
            }
          });
        }

        setStockData(stockMap);
      } catch (err) {
        console.error("Stock check failed:", err);
      } finally {
        setCheckingStock(false);
      }
    };
    fetchStockAndSettings();
  }, [cart]);

  const hasStockIssues = useMemo(() => {
    return Object.values(groupedCart).some((item: any) => {
      const cleanId = extractProductId(item.id);
      const stock = stockData[item.id] !== undefined ? stockData[item.id] : (stockData[cleanId] !== undefined ? stockData[cleanId] : 0);
      return stock === 0 || item.qty > stock;
    });
  }, [groupedCart, stockData]);

  const handleAddressChangeClick = () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent('/cart')}`);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setValidatingCoupon(true);
    setCouponMsg('');

    try {
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponInput.trim().toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

      if (error || !coupon) {
        setCouponMsg('Invalid or expired promo code.');
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setValidatingCoupon(false);
        return;
      }

      if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
        setCouponMsg('This promo code has expired.');
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setValidatingCoupon(false);
        return;
      }

      if (rawCartSubtotal < Number(coupon.min_order_amount || 0)) {
        setCouponMsg(`Minimum order of ₹${coupon.min_order_amount} required for this code.`);
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setValidatingCoupon(false);
        return;
      }

      let calcDiscount = 0;
      if (coupon.discount_type === 'percentage') {
        calcDiscount = Math.floor((rawCartSubtotal * Number(coupon.discount_value)) / 100);
        if (coupon.max_discount_amount) {
          calcDiscount = Math.min(calcDiscount, Number(coupon.max_discount_amount));
        }
      } else {
        calcDiscount = Number(coupon.discount_value);
      }

      setAppliedCoupon(coupon);
      setCouponDiscount(calcDiscount);
      setCouponMsg(`Promo code "${coupon.code}" applied! You saved ₹${calcDiscount}.`);
    } catch (err) {
      console.error(err);
      setCouponMsg('Failed to validate promo code.');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleExpressCheckout = async () => {
    if (checkoutInProgressRef.current || authLoading || hasStockIssues) return;
    setCheckoutError('');

    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent('/cart')}`);
      return;
    }

    if (!location.lat || !location.lng) {
      setCheckoutError('Please select your delivery location first.');
      setIsModalOpen(true);
      return;
    }

    checkoutInProgressRef.current = true;
    setIsPlacingOrder(true);
    setPaymentState('idle');
    let modalOpened = false;
    const pendingCheckoutKey = `royal_bengal_checkout_${user.id}`;

    try {
      const browserId = getOrCreateBrowserId();
      const payloadItems = Object.values(groupedCart).map((item: any) => ({
        variant_id: item.id,
        qty: item.qty,
      }));

      const deliveryDetails = {
        name: userData?.display_name || 'Customer',
        phone: (userData?.phone_number || '').trim() || '7893274753',
        lat: location.lat,
        lng: location.lng,
        area: location.area || 'Madhapur',
        city: location.city || 'Hyderabad',
        pincode: location.pincode || '500081',
        houseNo: location.houseNumber || '',
        address: location.address || `${location.area || 'Madhapur'}, ${location.city || 'Hyderabad'}`,
      };

      let storedCheckoutId: string | null = null;
      try {
        storedCheckoutId = window.sessionStorage.getItem(pendingCheckoutKey);
      } catch (storageErr) {
        console.warn('Could not read pending checkout from session storage:', storageErr);
      }

      const requestBody = storedCheckoutId
        ? { checkoutId: storedCheckoutId }
        : {
            items: payloadItems,
            details: deliveryDetails,
            couponCode: appliedCoupon ? appliedCoupon.code : null,
            userId: user.id,
            browserId,
          };

      const { data, error: edgeError } = await supabase.functions.invoke('place-order', {
        body: requestBody,
      });

      if (data?.checkoutId) {
        try {
          window.sessionStorage.setItem(pendingCheckoutKey, data.checkoutId);
        } catch (storageErr) {
          console.warn('Could not save pending checkout ID:', storageErr);
        }
      }

      if (data?.success === true && data?.paymentConfirmed === true) {
        try {
          window.sessionStorage.removeItem(pendingCheckoutKey);
        } catch (storageErr) {
          console.warn('Could not clear confirmed checkout ID:', storageErr);
        }
        clearCart();
        router.push('/orders');
        return;
      }

      if (edgeError || !data || data.error) {
        let errorBody: any = data || null;
        if (edgeError?.context && typeof edgeError.context.json === 'function') {
          try {
            const parsedBody = await edgeError.context.json();
            if (parsedBody && typeof parsedBody === 'object') {
              errorBody = parsedBody;
              if (parsedBody.checkoutId) {
                try {
                  window.sessionStorage.setItem(pendingCheckoutKey, parsedBody.checkoutId);
                } catch (storageErr) {
                  console.warn('Could not save recovered checkout ID:', storageErr);
                }
              }
            }
          } catch (e) {}
        }

        const serverMsg = errorBody?.error || edgeError?.message;
        throw new Error(serverMsg || 'Unable to process checkout. Please try again.');
      }

      if (!data.keyId || !data.razorpayOrderId || !data.checkoutId) {
        throw new Error('Invalid payment initialization response from server.');
      }

      const isLoaded = await loadRazorpaySDK();
      if (!isLoaded || !(window as any).Razorpay) {
        throw new Error('Could not load Razorpay payment gateway. Please check your connection and try again.');
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
          email: (user.email && !user.email.endsWith('@royalbengal.internal')) ? user.email : '',
          contact: deliveryDetails.phone,
        },
        theme: { color: '#022c22' },
        modal: {
          ondismiss: () => {
            if (!paymentVerificationInProgressRef.current) {
              setIsPlacingOrder(false);
              checkoutInProgressRef.current = false;
              setPaymentResultMessage('Payment was not completed. No successful payment confirmation has been received for this checkout attempt.');
              setPaymentState('failed');
            }
          },
        },
        handler: async (response: any) => {
          paymentVerificationInProgressRef.current = true;
          setPaymentState('verifying');
          try {
            const { data: vData, error: vErr } = await supabase.functions.invoke('verify-payment', {
              body: {
                checkoutId: data.checkoutId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            });

            if (!vErr && vData?.success === true) {
              try {
                window.sessionStorage.removeItem(pendingCheckoutKey);
              } catch (storageErr) {
                console.warn('Could not clear confirmed checkout ID:', storageErr);
              }
              clearCart();
              router.push('/orders');
            } else if (!vErr && (vData?.stockException === true || vData?.duplicatePayment === true)) {
              try {
                window.sessionStorage.removeItem(pendingCheckoutKey);
              } catch (storageErr) {
                console.warn('Could not clear reconciled checkout ID:', storageErr);
              }
              clearCart();
              setPaymentResultMessage(vData.error || 'Your payment was received, but the order needs staff review.');
              setPaymentState('failed');
            } else {
              const message = (vData && vData.error) || (vErr && vErr.message) || 'Payment confirmation is still pending.';
              setPaymentResultMessage(`${message} Do not pay again until you check your order status.`);
              setPaymentState('failed');
            }
          } catch (err: any) {
            console.error(err);
            const message = err?.message || 'Payment confirmation could not be completed.';
            setPaymentResultMessage(`${message} Do not pay again until you check your order status.`);
            setPaymentState('failed');
          } finally {
            paymentVerificationInProgressRef.current = false;
            setIsPlacingOrder(false);
            checkoutInProgressRef.current = false;
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        const description = response?.error?.description || 'Your payment was declined.';
        setPaymentResultMessage(description);
        setPaymentState('failed');
      });
      rzp.open();
      modalOpened = true;
    } catch (err: any) {
      console.error(err);
      setCheckoutError(err.message || 'Checkout failed. Please try again.');
      setIsPlacingOrder(false);
      checkoutInProgressRef.current = false;
    } finally {
      if (!modalOpened && paymentState === 'idle') {
        setIsPlacingOrder(false);
        checkoutInProgressRef.current = false;
      }
    }
  };

  const calculatedDistanceKm = useMemo(() => {
    if (!location.lat || !location.lng || !deliverySettings) return 0;
    const storeLat = Number(deliverySettings.store_latitude ?? STORE_LAT);
    const storeLng = Number(deliverySettings.store_longitude ?? STORE_LNG);
    return getDistanceFromLatLonInKm(storeLat, storeLng, location.lat, location.lng);
  }, [location, deliverySettings]);

  const freeThreshold = useMemo(() => {
    if (!deliverySettings) return 700;
    if (deliverySettings.delivery_mode === 'preset_rules') {
      return Number(deliverySettings.preset_zone1_subtotal ?? 299);
    }
    return Number(deliverySettings.tier1_subtotal ?? 299);
  }, [deliverySettings]);

  const deliveryFee = useMemo(() => {
    if (!deliverySettings) return 65;
    if (deliverySettings.delivery_mode === 'always_free') return 0;
    if (!deliverySettings.is_free_delivery_enabled || deliverySettings.delivery_mode === 'flat_fee') {
      return Number(deliverySettings.flat_delivery_fee ?? 65);
    }
    if (deliverySettings.delivery_mode === 'preset_rules') {
      const radius = Number(deliverySettings.preset_zone_radius_km ?? 5);
      const isZone1 = calculatedDistanceKm <= radius;
      const targetSub = isZone1 ? Number(deliverySettings.preset_zone1_subtotal ?? 299) : Number(deliverySettings.preset_zone2_subtotal ?? 499);
      const stdFee = isZone1 ? Number(deliverySettings.preset_zone1_fee ?? 30) : Number(deliverySettings.preset_zone2_fee ?? 30);
      return rawCartSubtotal >= targetSub ? 0 : stdFee;
    }
    const t1Max = Number(deliverySettings.tier1_max_km ?? 5);
    const t2Max = Number(deliverySettings.tier2_max_km ?? 10);
    let targetSub = Number(deliverySettings.tier1_subtotal ?? 299);
    let stdFee = Number(deliverySettings.tier1_fee ?? 30);
    if (calculatedDistanceKm > t1Max && calculatedDistanceKm <= t2Max) {
      targetSub = Number(deliverySettings.tier2_subtotal ?? 500);
      stdFee = Number(deliverySettings.tier2_fee ?? 30);
    } else if (calculatedDistanceKm > t2Max) {
      targetSub = Number(deliverySettings.tier3_subtotal ?? 699);
      stdFee = Number(deliverySettings.tier3_fee ?? 30);
    }
    return rawCartSubtotal >= targetSub ? 0 : stdFee;
  }, [calculatedDistanceKm, deliverySettings, rawCartSubtotal]);

  const finalTotal = Math.max(0, rawCartSubtotal - couponDiscount) + deliveryFee;

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

      {/* Background Dimming / Cart Blocking Overlay when Razorpay Checkout is Open */}
      {isPlacingOrder && paymentState === 'idle' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center text-white p-6">
          <div className="bg-[#022c22] border-2 border-amber-400/80 rounded-[28px] p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <Loader2 className="animate-spin text-amber-400 mx-auto" size={40} />
            <h3 className="font-serif font-black text-sm uppercase tracking-widest text-amber-300">Payment in Progress</h3>
            <p className="text-xs text-emerald-100 font-medium leading-relaxed">Please complete payment in the secure Razorpay window. Cart modifications are locked while payment is active.</p>
          </div>
        </div>
      )}

      {/* Full-screen Loading State During Payment Verification */}
      {paymentState === 'verifying' && (
        <div className="fixed inset-0 bg-[#022c22] z-50 flex items-center justify-center p-6 text-white">
          <div className="max-w-md w-full text-center space-y-6">
            <Loader2 className="animate-spin text-amber-400 mx-auto" size={48} />
            <div className="space-y-2">
              <h2 className="text-lg font-serif font-black text-amber-300">Verifying Your Payment…</h2>
              <p className="text-xs text-emerald-100 font-medium">Please wait while we confirm your payment and secure your order. Do not close this window.</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">

        {paymentState === 'failed' ? (
          <div className="bg-emerald-900/80 border-2 border-amber-400/80 rounded-[32px] p-8 sm:p-12 text-center space-y-6 shadow-2xl max-w-lg mx-auto my-12 backdrop-blur-md">
            <div className="w-16 h-16 bg-rose-950 text-rose-400 border border-rose-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <AlertCircle size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-serif font-black text-amber-300 uppercase tracking-wider">Payment Not Completed</h2>
              <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                {paymentResultMessage || 'No successful payment confirmation has been received for this checkout attempt.'}
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <button
                onClick={handleExpressCheckout}
                disabled={isPlacingOrder}
                className="w-full bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs uppercase py-4 rounded-2xl tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isPlacingOrder ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />} Retry Payment
              </button>
              <button
                onClick={() => {
                  setPaymentState('idle');
                  setPaymentResultMessage('');
                  setIsPlacingOrder(false);
                  checkoutInProgressRef.current = false;
                }}
                className="w-full bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-black text-[11px] uppercase py-4 rounded-2xl border border-amber-400/40 tracking-[0.2em] transition-all cursor-pointer"
              >
                Back to Cart / Modify Cart
              </button>
            </div>
          </div>
        ) : (
          <>
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
                className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-[10px] uppercase px-4 py-2.5 rounded-xl tracking-wider shadow-md transition-all active:scale-95 shrink-0 flex items-center gap-1.5 cursor-pointer"
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
                              className="px-3 h-full font-black text-lg hover:bg-white/10 transition-colors cursor-pointer"
                            >
                              −
                            </button>
                            <span className="text-xs font-black w-5 text-center text-white">{item.qty}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.qty + 1)}
                              className="px-3 h-full font-black text-lg hover:bg-white/10 transition-colors cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-emerald-300 hover:text-rose-400 transition-colors cursor-pointer"
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
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 bg-emerald-950 border border-amber-400/40 rounded-xl px-4 py-2.5 text-xs font-black uppercase text-amber-300 outline-none placeholder:text-gray-500"
                      />
                      <button
                        type="submit"
                        disabled={validatingCoupon}
                        className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all shrink-0 disabled:opacity-50 cursor-pointer"
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
                        <span className="text-white font-black text-sm">₹{rawCartSubtotal}</span>
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
                          {deliveryFee === 0 ? "FREE" : `₹{deliveryFee}`}
                        </span>
                      </div>

                      {rawCartSubtotal > 0 && rawCartSubtotal < freeThreshold && (
                        <div className="pt-1">
                           <span className="text-[10px] font-extrabold text-amber-300 bg-emerald-900/90 px-3 py-1.5 rounded-xl border border-amber-400/30 block text-center">
                             Add ₹{freeThreshold - rawCartSubtotal} more for FREE Express Delivery
                           </span>
                        </div>
                      )}

                      <div className="h-px bg-emerald-800/80 w-full my-3" />

                      <div className="flex justify-between items-center pt-1">
                        <span className="text-xs font-black text-amber-300 uppercase tracking-[0.2em]">Grand Total</span>
                        <span className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">₹{finalTotal}</span>
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
                      className={`w-full text-center font-black py-5 rounded-2xl shadow-xl uppercase tracking-[0.2em] text-xs transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 cursor-pointer ${
                        hasStockIssues || checkingStock || isPlacingOrder
                        ? 'bg-emerald-950/60 text-gray-500 border border-emerald-800 cursor-not-allowed shadow-none'
                        : 'bg-amber-400 hover:bg-amber-300 text-emerald-950 border border-amber-300 shadow-amber-400/20'
                      }`}
                    >
                      {isPlacingOrder ? <Loader2 size={16} className="animate-spin" /> : <>⚡ Place Order & Pay (₹{finalTotal}) <ArrowRight size={16} /></>}
                    </button>

                    <div className="p-3 rounded-2xl bg-emerald-900/60 border border-emerald-800 flex items-center gap-2.5 text-[10px] text-emerald-200 font-bold">
                      <ShieldCheck size={16} className="text-amber-400 shrink-0" />
                      <span>Insulated temperature packaging on all fresh catches.</span>
                    </div>

                  </div>
                </section>

              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
