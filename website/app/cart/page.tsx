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

  // Dynamic Delivery Settings State
  const [deliverySettings, setDeliverySettings] = useState<any>(null);

  // Fetch Dynamic Delivery Settings from Supabase
  useEffect(() => {
    const fetchDeliverySettings = async () => {
      try {
        const { data } = await supabase
          .from('delivery_settings')
          .select('*')
          .eq('id', 'default')
          .maybeSingle();

        if (data) {
          setDeliverySettings(data);
        }
      } catch (err) {
        console.error('Error loading delivery settings:', err);
      }
    };
    fetchDeliverySettings();
  }, []);

  // Calculate Distance in KM from Dark Store Hub
  const distanceKm = useMemo(() => {
    if (!location.lat || !location.lng) return 0;
    const storeLat = 17.351452;
    const storeLng = 78.391039;
    const R = 6371;
    const dLat = (location.lat - storeLat) * (Math.PI / 180);
    const dLon = (location.lng - storeLng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(storeLat * (Math.PI / 180)) * Math.cos(location.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, [location.lat, location.lng]);

  // Dynamically Compute Delivery Fee & Free Threshold from delivery_settings
  const { deliveryFee, freeThreshold } = useMemo(() => {
    if (totalAmount === 0 || !deliverySettings) {
      return { deliveryFee: 0, freeThreshold: 499 };
    }

    if (!deliverySettings.is_free_delivery_enabled || deliverySettings.delivery_mode === 'flat_fee') {
      const flatFee = Number(deliverySettings.flat_delivery_fee || 65);
      return { deliveryFee: flatFee, freeThreshold: Infinity };
    }

    if (deliverySettings.delivery_mode === 'preset_rules') {
      const radius = Number(deliverySettings.preset_zone_radius_km || 5);
      const isZone1 = distanceKm <= radius;

      const targetSubtotal = isZone1
        ? Number(deliverySettings.preset_zone1_subtotal || 299)
        : Number(deliverySettings.preset_zone2_subtotal || 499);
      const standardFee = isZone1
        ? Number(deliverySettings.preset_zone1_fee || 30)
        : Number(deliverySettings.preset_zone2_fee || 30);

      const fee = totalAmount >= targetSubtotal ? 0 : standardFee;
      return { deliveryFee: fee, freeThreshold: targetSubtotal };
    }

    // distance_tiered mode
    const t1Max = Number(deliverySettings.tier1_max_km || 5);
    const t2Max = Number(deliverySettings.tier2_max_km || 10);

    let targetSubtotal = Number(deliverySettings.tier1_subtotal || 299);
    let standardFee = Number(deliverySettings.tier1_fee || 30);

    if (distanceKm > t1Max && distanceKm <= t2Max) {
      targetSubtotal = Number(deliverySettings.tier2_subtotal || 500);
      standardFee = Number(deliverySettings.tier2_fee || 30);
    } else if (distanceKm > t2Max) {
      targetSubtotal = Number(deliverySettings.tier3_subtotal || 699);
      standardFee = Number(deliverySettings.tier3_fee || 30);
    }

    const fee = totalAmount >= targetSubtotal ? 0 : standardFee;
    return { deliveryFee: fee, freeThreshold: targetSubtotal };
  }, [totalAmount, deliverySettings, distanceKm]);

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

  const handleAddressChangeClick = () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent('/cart')}`);
    } else {
      setIsModalOpen(true);
    }
  };

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
          email: (user.email && !user.email.endsWith('@royalbengal.internal')) ? user.email : '',
          contact: deliveryDetails.phone,
        },
        theme: { color: '#004D3B' },
        handler: async (response: any) => {
          try {
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
    <main className="min-h-screen bg-[#F5F7F6] text-[#17211D] pb-28 w-full max-w-[100vw] overflow-x-hidden selection:bg-[#FFC400] selection:text-[#004D3B]">
      
      {/* Deep Emerald Header Bar (20% Brand Accent) */}
      <div className="bg-[#004D3B] text-white p-4 sm:p-5 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <Link href="/" className="text-[#FFC400] font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:text-white transition-all">
          <ArrowLeft size={16} /> Store
        </Link>

        <div className="flex items-center gap-2">
          <Crown size={18} className="text-[#FFC400]" />
          <h1 className="text-xs sm:text-sm font-serif font-black uppercase tracking-[0.2em] text-[#FFC400]">Express Checkout</h1>
        </div>

        <div className="w-16" />
      </div>

      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">

        {/* 1. DELIVERY ADDRESS CARD (White Card with Subtle Border) */}
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
            className="bg-[#E5F5EF] hover:bg-[#D5EFE5] text-[#006B50] font-black text-[10px] uppercase px-3.5 py-2 rounded-xl border border-[#BCE2D3] tracking-wider transition-all shrink-0 flex items-center gap-1.5"
          >
            <Map size={14} /> Change Address
          </button>
        </div>
        
        {cart.length === 0 ? (
          <div className="py-20 max-w-md mx-auto text-center bg-white border border-[#E3EAE6] rounded-3xl p-8 shadow-xs">
            <div className="w-16 h-16 bg-[#E5F5EF] text-[#006B50] rounded-2xl mx-auto flex items-center justify-center mb-5">
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight mb-2 text-[#17211D]">Your Cart is Empty</h3>
            <p className="text-[#75817B] text-xs font-medium uppercase tracking-widest mb-6 leading-relaxed">
              Explore fresh Padma river fish, <br/> gourmet mutton & artisanal Bengal delicacies.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 bg-[#FFC400] hover:bg-[#F5B800] text-[#004D3B] font-black px-7 py-3.5 rounded-xl uppercase tracking-widest text-xs shadow-sm transition-all">
              Explore Menu <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-start">

            {/* Left: Itemized Cart & Promo Coupon */}
            <section className="lg:col-span-7 space-y-4">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-xs font-black text-[#75817B] uppercase tracking-[0.15em]">Selected Items ({Object.keys(groupedCart).length})</h2>
              </div>

              {/* 2. PRODUCT CARDS (Clean White Cards) */}
              {Object.values(groupedCart).map((item: any) => {
                const cleanId = extractProductId(item.id);
                const isOutOfStock = stockData[cleanId] === 0;

                return (
                  <div key={item.id} className={`p-4 rounded-2xl border bg-white transition-all flex items-center justify-between shadow-xs ${
                    isOutOfStock ? 'border-rose-300 bg-rose-50/30' : 'border-[#E3EAE6]'
                  }`}>
                    <div className="flex items-center gap-3.5">
                      <img
                        src={item.img || 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80'}
                        className={`w-14 h-14 rounded-xl object-cover border border-[#E3EAE6] ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
                        alt={item.name}
                      />
                      <div>
                        <p className={`text-xs sm:text-sm font-black ${isOutOfStock ? 'text-gray-400' : 'text-[#17211D]'}`}>{item.name}</p>
                        <p className="text-[11px] text-[#006B50] font-bold uppercase mt-0.5">₹{item.price} / {item.unit}</p>
                        {isOutOfStock && <p className="text-[10px] text-rose-600 font-black uppercase mt-1">⚠️ Out of Stock</p>}
                      </div>
                    </div>

                    {/* Quantity Controls (Selected Controls: Deep Emerald) */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-[#006B50] text-white rounded-xl h-8 overflow-hidden shadow-xs">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="px-2.5 h-full font-black text-base hover:bg-black/10 transition-colors"
                        >
                          −
                        </button>
                        <span className="text-xs font-black w-5 text-center">{item.qty}</span>
                        <button
                          onClick={() => addToCart(item, 99)}
                          className="px-2.5 h-full font-black text-base hover:bg-black/10 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          for(let i = 0; i < item.qty; i++) removeFromCart(item.id);
                        }}
                        className="p-1.5 text-[#75817B] hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                  </div>
                );
              })}

              {/* 3. COUPON SECTION (Clean White Card) */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E3EAE6] space-y-2.5 shadow-xs">
                <div className="flex items-center gap-2 text-[#004D3B] text-xs font-black uppercase tracking-wider">
                  <Tag size={15} /> Promo Code
                </div>

                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. WELCOME10)"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-[#F5F7F6] border border-[#E3EAE6] focus:border-[#006B50] rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase text-[#17211D] outline-none placeholder:text-[#75817B]"
                  />
                  <button
                    type="submit"
                    disabled={validatingCoupon}
                    className="bg-[#FFC400] hover:bg-[#F5B800] text-[#004D3B] font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-xs transition-all shrink-0 disabled:opacity-50"
                  >
                    {validatingCoupon ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
                  </button>
                </form>

                {couponMsg && (
                  <p className={`text-[11px] font-bold ${appliedCoupon ? 'text-[#006B50]' : 'text-rose-600'}`}>
                    {couponMsg}
                  </p>
                )}
              </div>

            </section>

            {/* Right: Payment Method & Bill Summary */}
            <section className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">

              {/* PAYMENT METHOD BADGE */}
              <div className="bg-white p-4 rounded-2xl border border-[#E3EAE6] flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <CreditCard size={18} className="text-[#006B50]" />
                  <div>
                    <span className="text-xs font-black text-[#17211D] uppercase block">Razorpay Online Payment</span>
                    <span className="text-[10px] font-bold text-[#75817B]">UPI, Cards, NetBanking</span>
                  </div>
                </div>
                <span className="text-[9px] font-black uppercase bg-[#E5F5EF] text-[#006B50] px-2.5 py-1 rounded-full border border-[#BCE2D3]">
                  SECURE
                </span>
              </div>

              {/* BILL SUMMARY BOX (Clean White Card with #004D3B Header & #FFC400 CTA) */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E3EAE6] space-y-4 shadow-sm relative overflow-hidden">

                <div className="flex items-center justify-between border-b border-[#E3EAE6] pb-3">
                  <h2 className="text-xs font-black text-[#004D3B] uppercase tracking-[0.15em] flex items-center gap-2">
                    <Sparkles size={14} className="text-[#FFC400]" /> Bill Summary
                  </h2>
                  <span className="text-[9px] font-black uppercase bg-[#E5F5EF] text-[#006B50] px-2.5 py-0.5 rounded-full border border-[#BCE2D3]">
                    Express Delivery
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between font-bold text-[#75817B] uppercase tracking-wider">
                    <span>Items Subtotal</span>
                    <span className="text-[#17211D] font-black text-sm">₹{totalAmount}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between font-bold text-[#006B50] uppercase tracking-wider">
                      <span>Promo Discount</span>
                      <span className="font-black text-[#006B50]">- ₹{couponDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold uppercase tracking-wider">
                    <span className="text-[#75817B]">Delivery Fee</span>
                    <span className={deliveryFee === 0 ? "text-[#006B50] font-black" : "text-[#17211D] font-black"}>
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>

                  {totalAmount > 0 && totalAmount < freeThreshold && (
                    <div className="pt-1">
                       <span className="text-[10px] font-bold text-[#006B50] bg-[#E5F5EF] px-3 py-1.5 rounded-xl border border-[#BCE2D3] block text-center">
                         Add ₹{freeThreshold - totalAmount} more for FREE Express Delivery
                       </span>
                    </div>
                  )}

                  <div className="h-px bg-[#E3EAE6] w-full my-2.5" />

                  <div className="flex justify-between items-center pt-0.5">
                    <span className="text-xs font-black text-[#004D3B] uppercase tracking-widest">Grand Total</span>
                    <span className="text-2xl font-black text-[#004D3B] tracking-tight">₹{grandTotal}</span>
                  </div>
                </div>

                {checkoutError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                {/* PRIMARY CTA BUTTON: #FFC400 GOLD */}
                <button
                  onClick={handleExpressCheckout}
                  disabled={hasStockIssues || checkingStock || isPlacingOrder}
                  className={`w-full text-center font-black py-4 rounded-xl uppercase tracking-[0.15em] text-xs transition-all flex items-center justify-center gap-2 active:scale-95 ${
                    hasStockIssues || checkingStock || isPlacingOrder
                    ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none'
                    : 'bg-[#FFC400] hover:bg-[#F5B800] text-[#004D3B] shadow-xs'
                  }`}
                >
                  {isPlacingOrder ? <Loader2 size={16} className="animate-spin" /> : <>Place Order & Pay <ArrowRight size={16} /></>}
                </button>

                <div className="p-3 rounded-xl bg-[#F5F7F6] border border-[#E3EAE6] flex items-center gap-2 text-[10px] text-[#75817B] font-bold">
                  <ShieldCheck size={15} className="text-[#006B50] shrink-0" />
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
