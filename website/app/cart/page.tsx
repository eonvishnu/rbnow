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
  MapPin, Map, Tag, Check, AlertCircle, Loader2, ArrowRight, RefreshCw, X
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
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal: rawCartSubtotal } = useCart();
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
        theme: { color: '#004D3B' },
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
    <main className="min-h-screen bg-[#F5F7F6] text-[#17211D] pb-28 w-full max-w-[100vw] overflow-x-hidden selection:bg-[#FFC400] selection:text-[#004D3B]">

      {/* Deep Emerald Header Bar (20% Brand Accent) */}
      <div className="bg-[#004D3B] text-white p-4 sm:p-5 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <Link href="/" className="text-[#FFC400] font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:text-white transition-all">
          <ArrowLeft size={16} /> Store
        </Link>

        <div className="flex items-center gap-2">
          <Crown size={18} className="text-[#FFC400]" />
          <h1 className="text-xs sm:text-sm font-serif font-black uppercase tracking-[0.2em] text-[#FFC400]">Checkout</h1>
        </div>

        <div className="w-16" />
      </div>

      {/* Background Dimming / Cart Blocking Overlay when Razorpay Checkout is Open */}
      {isPlacingOrder && paymentState === 'idle' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center text-white p-6">
          <div className="bg-[#004D3B] border border-[#006B50] rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <Loader2 className="animate-spin text-[#FFC400] mx-auto" size={40} />
            <h3 className="font-serif font-black text-sm uppercase tracking-widest text-[#FFC400]">Payment in Progress</h3>
            <p className="text-xs text-[#E5F5EF] font-medium leading-relaxed">Please complete payment in the secure Razorpay window. Cart modifications are locked while payment is active.</p>
          </div>
        </div>
      )}

      {/* Full-screen Loading State During Payment Verification */}
      {paymentState === 'verifying' && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6">
            <Loader2 className="animate-spin text-[#004D3B] mx-auto" size={48} />
            <div className="space-y-2">
              <h2 className="text-lg font-serif font-black text-[#17211D]">Verifying Your Payment…</h2>
              <p className="text-xs text-[#75817B] font-medium">Please wait while we confirm your payment and secure your order. Do not close this window.</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">

        {paymentState === 'failed' ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E3EAE6] text-center space-y-6 shadow-sm max-w-lg mx-auto my-12">
            <div className="w-16 h-16 bg-[#FFF2F2] text-[#D32F2F] rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-serif font-black text-[#17211D]">Payment Not Completed</h2>
              <p className="text-xs text-[#75817B] font-medium leading-relaxed">
                {paymentResultMessage || 'No successful payment confirmation has been received for this checkout attempt.'}
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <button
                onClick={handleExpressCheckout}
                disabled={isPlacingOrder}
                className="w-full bg-[#004D3B] hover:bg-[#00382B] text-white font-black text-xs uppercase py-3.5 rounded-2xl tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
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
                className="w-full bg-[#E5F5EF] hover:bg-[#D5EFE5] text-[#006B50] font-black text-[11px] uppercase py-3.5 rounded-2xl border border-[#BCE2D3] tracking-widest transition-all cursor-pointer"
              >
                Back to Cart / Modify Cart
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* DELIVERY ADDRESS CARD */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E3EAE6] text-[#17211D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#E5F5EF] text-[#006B50] flex items-center justify-center font-black shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-[#E5F5EF] text-[#006B50] px-2.5 py-0.5 rounded-full border border-[#BCE2D3]">
                      {location.label || 'HOME'}
                    </span>
                    <span className="text-xs font-black uppercase text-[#004D3B]">Delivering To</span>
                  </div>
                  <p className="text-xs text-[#17211D] font-bold truncate max-w-[280px] sm:max-w-md mt-0.5">
                    {location.address || `${location.area || 'Madhapur'}, ${location.city || 'Hyderabad'}`}
                  </p>
                </div>
              </div>

              <button
                onClick={handleAddressChangeClick}
                className="bg-[#E5F5EF] hover:bg-[#D5EFE5] text-[#006B50] font-black text-[10px] uppercase px-3.5 py-2 rounded-xl border border-[#BCE2D3] tracking-wider transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <Map size={14} /> Change Address
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-[#E3EAE6] text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 bg-[#E5F5EF] text-[#006B50] rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="font-serif font-black text-lg text-[#17211D]">Your cart is empty</h3>
                <p className="text-xs text-[#75817B]">Add fresh groceries and gourmet items to start your checkout.</p>
                <Link href="/" className="inline-block bg-[#004D3B] text-white font-black text-xs uppercase px-6 py-3 rounded-2xl tracking-widest hover:bg-[#00382B] transition-all shadow-md mt-2">
                  Explore Store
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* ITEMS LIST */}
                <div className="lg:col-span-7 space-y-3">
                  <h2 className="text-xs font-black text-[#75817B] uppercase tracking-[0.15em] px-1">Selected Items ({Object.values(groupedCart).length})</h2>

                  <div className="bg-white rounded-2xl border border-[#E3EAE6] divide-y divide-[#E3EAE6] shadow-xs overflow-hidden">
                    {Object.values(groupedCart).map((item: any, idx: number, arr: any[]) => {
                      const cleanId = extractProductId(item.id);
                      const stockCount = stockData[item.id] !== undefined ? stockData[item.id] : (stockData[cleanId] !== undefined ? stockData[cleanId] : 99);
                      const isOutOfStock = stockCount === 0;
                      const isOverStock = item.qty > stockCount;

                      return (
                        <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-14 h-14 rounded-xl bg-[#F5F7F6] border border-[#E3EAE6] flex items-center justify-center shrink-0 overflow-hidden relative">
                              {item.image_url ? (
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <ShoppingBag size={20} className="text-[#75817B]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-black text-[#17211D] truncate">{item.name}</h4>
                              <p className="text-[10px] font-bold text-[#75817B] mt-0.5">{item.unit || 'Standard Pack'}</p>
                              <p className="text-xs font-black text-[#004D3B] mt-1">₹{item.price * item.qty}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="flex items-center bg-[#F5F7F6] border border-[#E3EAE6] rounded-xl overflow-hidden shadow-2xs">
                              <button
                                onClick={() => updateQuantity(item.id, item.qty - 1)}
                                className="w-8 h-8 flex items-center justify-center text-[#75817B] hover:bg-[#E3EAE6] hover:text-[#17211D] transition-all cursor-pointer"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center text-xs font-black text-[#17211D]">{item.qty}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.qty + 1)}
                                className="w-8 h-8 flex items-center justify-center text-[#75817B] hover:bg-[#E3EAE6] hover:text-[#17211D] transition-all cursor-pointer"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="w-8 h-8 rounded-xl bg-[#FFF2F2] text-[#D32F2F] hover:bg-[#FFE5E5] flex items-center justify-center transition-all cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* BILLING & CHECKOUT SUMMARY */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-white rounded-2xl border border-[#E3EAE6] p-5 shadow-xs space-y-4 sticky top-24">
                    <h3 className="text-xs font-black text-[#75817B] uppercase tracking-[0.15em]">Bill Details</h3>

                    {/* Promo Code Box */}
                    <form onSubmit={handleApplyCoupon} className="space-y-2">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#75817B]" />
                          <input
                            type="text"
                            placeholder="Promo Code"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            className="w-full bg-[#F5F7F6] border border-[#E3EAE6] rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-[#17211D] uppercase tracking-wider outline-none focus:border-[#004D3B] transition-all"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={validatingCoupon || !couponInput.trim()}
                          className="bg-[#E5F5EF] hover:bg-[#D5EFE5] text-[#006B50] font-black text-[11px] uppercase px-4 py-2.5 rounded-xl border border-[#BCE2D3] tracking-wider transition-all cursor-pointer disabled:opacity-50"
                        >
                          {validatingCoupon ? <Loader2 className="animate-spin" size={14} /> : 'Apply'}
                        </button>
                      </div>
                      {couponMsg && (
                        <p className={`text-[11px] font-bold px-1 ${appliedCoupon ? 'text-[#006B50]' : 'text-[#D32F2F]'}`}>
                          {couponMsg}
                        </p>
                      )}
                    </form>

                    <div className="space-y-2.5 pt-2 border-t border-[#E3EAE6] text-xs font-medium text-[#75817B]">
                      <div className="flex justify-between">
                        <span>Items Subtotal</span>
                        <span className="font-bold text-[#17211D]">₹{rawCartSubtotal}</span>
                      </div>
                      {couponDiscount > 0 && (
                        <div className="flex justify-between text-[#006B50]">
                          <span>Discount</span>
                          <span className="font-bold">-₹{couponDiscount}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span className="font-bold text-[#17211D]">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-[#E3EAE6] text-sm font-black text-[#17211D]">
                        <span>To Pay</span>
                        <span className="text-[#004D3B] text-base">₹{finalTotal}</span>
                      </div>
                    </div>

                    {checkoutError && (
                      <div className="p-3 bg-[#FFF2F2] border border-[#FFCDD2] rounded-xl text-xs font-bold text-[#D32F2F]">
                        {checkoutError}
                      </div>
                    )}

                    <button
                      onClick={handleExpressCheckout}
                      disabled={isPlacingOrder || hasStockIssues || checkingStock}
                      className="w-full bg-[#004D3B] hover:bg-[#00382B] text-white font-black text-xs uppercase py-4 rounded-2xl tracking-[0.2em] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isPlacingOrder ? (
                        <><Loader2 className="animate-spin" size={16} /> Initializing Secure Checkout...</>
                      ) : (
                        <><ShoppingBag size={16} /> Proceed to Pay (₹{finalTotal}) <ArrowRight size={16} /></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}
