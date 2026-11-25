'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Wallet,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function extractProductId(id: string): string {
  if (!id) return '';
  if (id.length >= 36) {
    return id.substring(0, 36);
  }
  const lastDash = id.lastIndexOf('-');
  return lastDash !== -1 ? id.substring(0, lastDash) : id;
}

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function computeDeliveryFee(settings: any, subtotal: number, customerLat?: number, customerLng?: number): number {
  if (!settings) return 0;

  const mode = settings.delivery_mode;

  if (mode === 'flat_fee') {
    return Number(settings.flat_delivery_fee);
  }

  const storeLat = Number(settings.store_latitude);
  const storeLng = Number(settings.store_longitude);
  const distanceKm = (customerLat !== undefined && customerLng !== undefined && !isNaN(customerLat) && !isNaN(customerLng))
    ? calculateDistanceKm(storeLat, storeLng, customerLat, customerLng)
    : 0;

  if (mode === 'preset_rules') {
    const radius = Number(settings.preset_zone_radius_km);
    if (distanceKm <= radius) {
      const sub1 = Number(settings.preset_zone1_subtotal);
      const fee1 = Number(settings.preset_zone1_fee);
      return subtotal >= sub1 ? 0 : fee1;
    } else {
      const sub2 = Number(settings.preset_zone2_subtotal);
      const fee2 = Number(settings.preset_zone2_fee);
      return subtotal >= sub2 ? 0 : fee2;
    }
  }

  if (mode === 'distance_tiered') {
    const t1Max = Number(settings.tier1_max_km);
    const t2Max = Number(settings.tier2_max_km);
    const t3Max = Number(settings.tier3_max_km);

    if (distanceKm <= t1Max) {
      const sub = Number(settings.tier1_subtotal);
      const fee = Number(settings.tier1_fee);
      return subtotal >= sub ? 0 : fee;
    } else if (distanceKm <= t2Max) {
      const sub = Number(settings.tier2_subtotal);
      const fee = Number(settings.tier2_fee);
      return subtotal >= sub ? 0 : fee;
    } else if (distanceKm <= t3Max) {
      const sub = Number(settings.tier3_subtotal);
      const fee = Number(settings.tier3_fee);
      return subtotal >= sub ? 0 : fee;
    } else {
      const sub = Number(settings.tier4_subtotal);
      const fee = Number(settings.tier4_fee);
      return subtotal >= sub ? 0 : fee;
    }
  }

  return Number(settings.flat_delivery_fee || 0);
}

type CheckoutState =
  | 'cart_idle'
  | 'creating_order'
  | 'payment_open'
  | 'verifying_payment'
  | 'payment_abandoned'
  | 'payment_failed'
  | 'payment_pending'
  | 'order_confirmed';

export default function CartPage() {
  const router = useRouter();
  const { cart, addToCart, removeFromCart, clearCart, removePurchasedItems } = useCart();
  const { user, userData, loading: authLoading } = useAuth();
  const { location, setIsModalOpen } = useLocation();

  const [checkoutState, setCheckoutState] = useState<CheckoutState>('cart_idle');
  const [checkoutError, setCheckoutError] = useState('');
  const [paymentResultMessage, setPaymentResultMessage] = useState('');

  // Cart Upsells State (Powered by public.cart_upsells table IDs)
  const [recommended, setRecommended] = useState<any[]>([]);
  const upsellScrollRef = useRef<HTMLDivElement>(null);

  const scrollUpsells = (direction: 'left' | 'right') => {
    if (upsellScrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      upsellScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Delivery Settings State from public.delivery_settings
  const [deliverySettings, setDeliverySettings] = useState<any>(null);

  // Fetch Delivery Settings from Supabase public.delivery_settings table
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

  // Stock & Preorder Meta Validation State
  const [stockData, setStockData] = useState<Record<string, number>>({});
  const [productMetaMap, setProductMetaMap] = useState<Record<string, any>>({});
  const [checkingStock, setCheckingStock] = useState(true);
  const [stockFetchError, setStockFetchError] = useState(false);

  const checkoutInProgressRef = useRef(false);
  const paymentVerificationInProgressRef = useRef(false);

  const totalAmount = useMemo(() => {
    return cart.reduce((sum: number, item: any) => sum + (item.price || 0), 0);
  }, [cart]);

  // Dynamic Delivery Fee calculated directly from public.delivery_settings and customer distance
  const deliveryFee = useMemo(() => {
    return computeDeliveryFee(deliverySettings, totalAmount, location.lat, location.lng);
  }, [deliverySettings, totalAmount, location.lat, location.lng]);

  const grandTotal = Math.max(0, totalAmount - couponDiscount + deliveryFee);

  const groupedCart = useMemo(() => {
    return cart.reduce((acc: any, item: any) => {
      acc[item.id] = acc[item.id] || { ...item, qty: 0 };
      acc[item.id].qty += 1;
      return acc;
    }, {});
  }, [cart]);

  // Current cart fingerprint including delivery address and coupon identity
  const currentCartFingerprint = useMemo(() => {
    const itemsArray = Object.values(groupedCart).map((i: any) => ({
      product_id: extractProductId(i.id),
      variant_id: i.id,
      quantity: i.qty,
      price: i.price,
      total_price: i.price * i.qty,
    })).sort((a, b) => a.variant_id.localeCompare(b.variant_id));
    return JSON.stringify({
      items: itemsArray,
      subtotal: totalAmount,
      total: grandTotal,
      address: { lat: location.lat, lng: location.lng, address: location.address },
      coupon: appliedCoupon?.code || null,
    });
  }, [groupedCart, totalAmount, grandTotal, location.lat, location.lng, location.address, appliedCoupon]);

  // Revalidate or clear coupon when cart total changes below minimum threshold
  useEffect(() => {
    if (appliedCoupon && totalAmount < Number(appliedCoupon.min_order_amount || 0)) {
      setAppliedCoupon(null);
      setCouponDiscount(0);
      setCouponMsg('Applied promo code removed because cart subtotal dropped below minimum required amount.');
    }
  }, [totalAmount, appliedCoupon]);

  // Fetch Cart Upsells using public.cart_upsells table IDs and matching home page product data
  useEffect(() => {
    const fetchUpsells = async () => {
      try {
        const { data: upsellsData, error: upsellsErr } = await supabase
          .from('cart_upsells')
          .select('product_id, variant_id, title, display_order')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (!upsellsErr && upsellsData && upsellsData.length > 0) {
          const productIds = [...new Set(upsellsData.map((u: any) => u.product_id).filter(Boolean))];

          const { data: prodData } = await supabase
            .from('products')
            .select('*, product_variants(*)')
            .in('id', productIds);

          if (prodData) {
            const prodMap: Record<string, any> = {};
            prodData.forEach((p: any) => {
              prodMap[p.id] = p;
            });
            const mapped = upsellsData.map((u: any) => {
              const p = prodMap[u.product_id];
              if (!p) return null;
              const v = (p.product_variants || []).find((pv: any) => pv.id === u.variant_id) || p.product_variants?.[0];
              const variantId = v?.id || u.variant_id || p.id;
              const price = v?.price || p.price || 0;
              const stock = v?.stock ?? p.stock ?? 20;

              return {
                id: variantId,
                product_id: p.id,
                name: p.name,
                price: Number(price),
                originalPrice: v?.original_price ? Number(v.original_price) : undefined,
                discount: 0,
                unit: v?.unit || p.unit || 'pack',
                img: p.image_url,
                imageUrl: p.image_url,
                variantId: variantId,
                stock: Number(stock),
                options: (p.product_variants || []).map((pv: any) => ({
                  id: pv.id,
                  unit: pv.unit,
                  price: Number(pv.price),
                  originalPrice: pv.original_price ? Number(pv.original_price) : undefined,
                  stockCount: Number(pv.stock || 0),
                  sku: pv.sku,
                })),
                raw: p,
              };
            }).filter(Boolean);

            setRecommended(mapped);
            return;
          }
        }

        // Fallback to cached products if cart_upsells is empty
        const cached = localStorage.getItem('royal_bengal_cached_products');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRecommended(parsed.slice(0, 8));
            return;
          }
        }
      } catch (err) {
        console.error('Error loading cart upsells:', err);
      }
    };
    fetchUpsells();
  }, []);

  // Stock & Preorder Meta fetching with stale-request protection and error handling
  useEffect(() => {
    let isCancelled = false;
    const fetchStock = async () => {
      if (cart.length === 0) {
        setCheckingStock(false);
        return;
      }
      const variantIds = [...new Set(cart.map((item: any) => item.id))];
      const stockMap: Record<string, number> = {};
      const productIdSet = new Set<string>();

      cart.forEach((item: any) => {
        if (item.product_id) productIdSet.add(item.product_id);
      });

      try {
        const { data: variantData } = await supabase
          .from("product_variants")
          .select("id, product_id, stock")
          .in("id", variantIds);

        if (variantData) {
          variantData.forEach(v => {
            stockMap[v.id] = Number(v.stock) || 0;
            if (v.product_id) {
              stockMap[v.product_id] = Number(v.stock) || 0;
              productIdSet.add(v.product_id);
            }
          });
        }

        const productIdsArr = [...productIdSet];
        if (productIdsArr.length > 0) {
          const { data: prodMeta } = await supabase
            .from("products")
            .select("id, sale_mode, expected_dispatch_date")
            .in("id", productIdsArr);

          const metaMap: Record<string, any> = {};
          if (prodMeta) {
            prodMeta.forEach(p => {
              metaMap[p.id] = {
                sale_mode: p.sale_mode,
                expected_dispatch_date: p.expected_dispatch_date,
              };
            });
          }
          setProductMetaMap(metaMap);
        }
        setStockData(stockMap);
      } catch (err) {
        console.error("Stock check failed:", err);
      } finally {
        setCheckingStock(false);
      }
    };
    fetchStock();
  }, [cart]);

  // Fail closed on loading, fetch errors, or missing stock results for current cart variants
  const hasStockIssues = useMemo(() => {
    if (checkingStock || stockFetchError) return true;
    const variantIds = Object.keys(groupedCart);
    return variantIds.some((id) => {
      const stock = stockData[id];
      if (stock === undefined) return true; // Fail closed if variant stock not returned
      const item = (groupedCart as any)[id];
      return stock === 0 || item.qty > stock;
    });
  }, [groupedCart, stockData, checkingStock, stockFetchError]);

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
        .eq('is_active', true)
        .maybeSingle();

      if (error || !coupon) {
        setCouponMsg('Invalid or expired promo code.');
        setAppliedCoupon(null);
        setCouponDiscount(0);
        return;
      }

      if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
        setCouponMsg('This promo code has expired.');
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

      // Clamp discount to subtotal
      calcDiscount = Math.min(calcDiscount, totalAmount);

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

  // Helper to update specific checkout record state in session history array
  const updateCheckoutHistoryState = (checkoutId: string, newState: string) => {
    if (!user || !checkoutId) return;
    const checkoutHistoryKey = `royal_bengal_checkout_history_${user.id}`;
    try {
      const rawHistory = window.sessionStorage.getItem(checkoutHistoryKey);
      if (rawHistory) {
        let history = JSON.parse(rawHistory);
        history = history.map((rec: any) => {
          if (rec.checkoutId === checkoutId) {
            return { ...rec, paymentState: newState };
          }
          return rec;
        });
        window.sessionStorage.setItem(checkoutHistoryKey, JSON.stringify(history));
      }
    } catch (e) {
      console.warn('Could not update checkout history record state:', e);
    }
  };

  const handleExpressCheckout = async () => {
    if (checkoutInProgressRef.current || authLoading || hasStockIssues) return;
    setCheckoutError('');

    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent('/cart')}`);
      return;
    }

    const rawPhone = (userData?.phone_number || '').trim();
    const cleanPhone = rawPhone.replace(/\D/g, '');
    const tenDigitPhone = cleanPhone.length >= 10 ? cleanPhone.slice(-10) : cleanPhone;
    if (!/^[6-9]\d{9}$/.test(tenDigitPhone)) {
      setCheckoutError('Please provide a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9 in your profile before checking out.');
      checkoutInProgressRef.current = false;
      setCheckoutState('cart_idle');
      return;
    }

    // Strict coordinate validation: original values must be present and numeric, reject (0,0) as a pair, validate geographic range
    const rawLat = location.lat;
    const rawLng = location.lng;
    if (rawLat === undefined || rawLat === null || rawLng === undefined || rawLng === null) {
      setCheckoutError('Please select a verified delivery location on the map.');
      setIsModalOpen(true);
      checkoutInProgressRef.current = false;
      setCheckoutState('cart_idle');
      return;
    }

    const lat = Number(rawLat);
    const lng = Number(rawLng);
    const isZeroPair = lat === 0 && lng === 0;
    const isValidLat = Number.isFinite(lat) && lat >= -90 && lat <= 90;
    const isValidLng = Number.isFinite(lng) && lng >= -180 && lng <= 180;

    const trimmedCity = (location.city || '').trim();
    const trimmedPincode = (location.pincode || '').trim();
    const isValidPincode = /^\d{6}$/.test(trimmedPincode);

    if (!isValidLat || !isValidLng || isZeroPair || !location.address || location.address.trim() === '' || !trimmedCity || !isValidPincode) {
      setCheckoutError('Please select a verified delivery location on the map with valid coordinates, city, and a valid 6-digit PIN code.');
      setIsModalOpen(true);
      checkoutInProgressRef.current = false;
      setCheckoutState('cart_idle');
      return;
    }

    if (!location.houseNumber || location.houseNumber.trim() === '') {
      setCheckoutError('Please add your House / Flat / Block No. to your delivery address before placing your order.');
      setIsModalOpen(true);
      checkoutInProgressRef.current = false;
      setCheckoutState('cart_idle');
      return;
    }

    checkoutInProgressRef.current = true;
    setCheckoutState('creating_order');
    const checkoutHistoryKey = `royal_bengal_checkout_history_${user.id}`;

    try {
      const browserId = getOrCreateBrowserId();
      const payloadItems = Object.values(groupedCart).map((item: any) => ({
        product_id: extractProductId(item.id),
        variant_id: item.id,
        product_name: item.name,
        variant_unit: item.unit || 'pack',
        product_image: item.img || '',
        price: item.price,
        quantity: item.qty,
        total_price: item.price * item.qty,
      }));

      const deliveryDetails = {
        name: userData?.display_name || user.email || 'Customer',
        phone: tenDigitPhone,
        lat,
        lng,
        area: location.area || '',
        city: trimmedCity,
        pincode: trimmedPincode,
        houseNo: location.houseNumber || '',
        address: location.address,
      };

      const requestBody = {
        items: payloadItems,
        details: deliveryDetails,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        userId: user.id,
        browserId,
      };

      let accessToken = null;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        accessToken = session?.access_token;
      } catch (e) {}

      if (!accessToken && typeof window !== 'undefined') {
        const storedAuth = localStorage.getItem('royal_bengal_access_token');
        if (storedAuth) accessToken = storedAuth;
        else {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.includes('auth-token')) {
              try {
                const val = JSON.parse(localStorage.getItem(key) || '');
                if (val?.access_token) {
                  accessToken = val.access_token;
                  break;
                }
              } catch (e) {}
            }
          }
        }
      }

      if (!accessToken || typeof accessToken !== 'string' || accessToken === 'undefined' || accessToken === 'null' || accessToken.length < 20) {
        setCheckoutError('Your session has expired. Please log in again to place your order.');
        setCheckoutState('cart_idle');
        checkoutInProgressRef.current = false;
        router.push(`/login?redirect=${encodeURIComponent('/cart')}`);
        return;
      }

      const supabaseUrl = (supabase as any).supabaseUrl || 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (supabase as any).supabaseKey || '';

      const res = await fetch(`${supabaseUrl}/functions/v1/place-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'apikey': supabaseAnonKey,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json().catch(() => ({}));
      const edgeError = !res.ok ? new Error(data?.error || `HTTP error ${res.status}`) : null;

      if (edgeError || !data?.success || !data?.checkoutId || !data?.razorpayOrderId) {
        // Check if backend returned a trustworthy pre-creation validation failure
        const errCode = data?.code || '';
        const errMsg = data?.error || edgeError?.message || '';
        const isPreCreationRejection = errCode === 'VALIDATION_ERROR' || errMsg.includes('cart') || errMsg.includes('stock') || errMsg.includes('coupon');

        if (isPreCreationRejection) {
          setCheckoutError(errMsg || 'Checkout request failed store validation.');
          setCheckoutState('cart_idle');
        } else {
          // Ambiguous response: preserve uncertain state
          setCheckoutError('Checkout initialization encountered an ambiguous response. Please check your order status.');
          setCheckoutState('payment_pending');
        }
        checkoutInProgressRef.current = false;
        return;
      }

      // Store structured checkout record with isolated snapshot
      let checkoutHistory: Array<any> = [];
      try {
        const rawHistory = window.sessionStorage.getItem(checkoutHistoryKey);
        if (rawHistory) checkoutHistory = JSON.parse(rawHistory);
      } catch (storageErr) {
        console.warn('Could not read checkout history:', storageErr);
      }

      const checkoutRecord = {
        checkoutId: data.checkoutId,
        razorpayOrderId: data.razorpayOrderId,
        cartFingerprint: currentCartFingerprint,
        purchasedSnapshot: payloadItems.map(pi => ({ id: pi.variant_id, qty: pi.quantity })),
        createdAt: new Date().toISOString(),
        paymentState: 'created',
      };

      checkoutHistory.push(checkoutRecord);
      try {
        window.sessionStorage.setItem(checkoutHistoryKey, JSON.stringify(checkoutHistory));
        window.sessionStorage.setItem(`royal_bengal_purchased_snapshot_${data.checkoutId}`, JSON.stringify(payloadItems));
      } catch (storageErr) {
        console.warn('Could not save checkout snapshot:', storageErr);
      }

      if (!(window as any).Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load Razorpay SDK. Please check your connection.'));
          document.body.appendChild(script);
        });
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: 'INR',
        name: 'The Royal Bengal Fresh',
        description: 'Gourmet Order Payment',
        order_id: data.razorpayOrderId,
        prefill: {
          contact: deliveryDetails.phone,
          email: user.email || '',
        },
        theme: { color: '#004D3B' },
        modal: {
          ondismiss: () => {
            if (paymentVerificationInProgressRef.current) return;
            updateCheckoutHistoryState(data.checkoutId, 'abandoned');
            setCheckoutState('payment_abandoned');
            setPaymentResultMessage('Payment was dismissed. Your cart is safe. You can modify your items or place a new order.');
            checkoutInProgressRef.current = false;
          },
        },
        handler: async (response: any) => {
          if (paymentVerificationInProgressRef.current) return;
          paymentVerificationInProgressRef.current = true;
          setCheckoutState('verifying_payment');
          setCheckoutError('');

          try {
            const { data: verifySessionData } = await supabase.auth.getSession();
            const verifyAccessToken = verifySessionData?.session?.access_token;
            const verifyHeaders: Record<string, string> = {};
            if (verifyAccessToken) {
              verifyHeaders['Authorization'] = `Bearer ${verifyAccessToken}`;
            }

            const { data: vData, error: vErr } = await supabase.functions.invoke('verify-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                checkoutId: data.checkoutId,
              },
              headers: verifyHeaders,
            });

            if (!vErr && vData?.success) {
              updateCheckoutHistoryState(data.checkoutId, 'confirmed');
              let purchasedItems: Array<{ id: string; qty: number }> = [];
              try {
                const rawSnap = window.sessionStorage.getItem(`royal_bengal_purchased_snapshot_${data.checkoutId}`);
                if (rawSnap) {
                  const parsed = JSON.parse(rawSnap);
                  purchasedItems = parsed.map((pi: any) => ({
                    id: pi.variant_id || pi.id,
                    qty: pi.quantity || pi.qty || 1,
                  }));
                }
              } catch (e) {}

              try {
                window.sessionStorage.removeItem(`royal_bengal_purchased_snapshot_${data.checkoutId}`);
              } catch (storageErr) {}

              if (purchasedItems.length > 0) {
                removePurchasedItems(purchasedItems);
              } else {
                setPaymentResultMessage('Order confirmed successfully, but purchased items snapshot was missing. Please verify your cart.');
              }
              setCheckoutState('order_confirmed');
              router.push('/orders');
            } else if (!vErr && (vData?.stockException === true || vData?.duplicatePayment === true)) {
              updateCheckoutHistoryState(data.checkoutId, 'pending_review');
              setPaymentResultMessage(vData.error || 'Your payment requires staff review. Please check your orders page.');
              setCheckoutState('payment_pending');
            } else {
              updateCheckoutHistoryState(data.checkoutId, 'unresolved');
              const message = (vData && vData.error) || (vErr && vErr.message) || 'Payment confirmation is still pending.';
              setPaymentResultMessage(`${message} Do not pay again until you check your order status.`);
              setCheckoutState('payment_pending');
            }
          } catch (err: any) {
            console.error(err);
            updateCheckoutHistoryState(data.checkoutId, 'error');
            const message = err?.message || 'Payment confirmation could not be completed.';
            setPaymentResultMessage(`${message} Do not pay again until you check your order status.`);
            setCheckoutState('payment_pending');
          } finally {
            paymentVerificationInProgressRef.current = false;
            checkoutInProgressRef.current = false;
          }
        },
      };

      setCheckoutState('payment_open');
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        if (paymentVerificationInProgressRef.current) return;
        updateCheckoutHistoryState(data.checkoutId, 'failed');
        const description = response?.error?.description || 'Your payment was declined.';
        setPaymentResultMessage(`${description} Your cart is safe. You can retry payment or modify your items.`);
        setCheckoutState('payment_failed');
        checkoutInProgressRef.current = false;
      });
      rzp.open();
    } catch (err: any) {
      console.error(err);
      setCheckoutError(err.message || 'Checkout initialization failed. Please check your connection.');
      setCheckoutState('payment_pending');
      checkoutInProgressRef.current = false;
    }
  };

  const isCartDisabled = checkoutState === 'creating_order' || checkoutState === 'payment_open' || checkoutState === 'verifying_payment' || checkoutState === 'payment_pending';

  return (
    <main className="min-h-screen bg-[#F5F7F6] text-[#17211D] pb-28 w-full max-w-[100vw] overflow-x-hidden selection:bg-[#FFC400] selection:text-[#004D3B]">

      {/* Header Container */}
      <div className="bg-white border-b border-[#E3EAE6] p-4 sm:p-5 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <Link href="/" className="text-[#004D3B] font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:text-[#006B50] transition-all">
          <ArrowLeft size={16} /> Store
        </Link>

        <div className="flex items-center gap-2">
          <Crown size={18} className="text-[#FFC400]" />
          <h1 className="text-xs sm:text-sm font-serif font-black uppercase tracking-[0.2em] text-[#004D3B]">Checkout</h1>
        </div>

        <div className="w-16" />
      </div>

      {/* Full-screen Verification State when Razorpay reports success */}
      {checkoutState === 'verifying_payment' && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-6 text-[#17211D]">
          <div className="max-w-md w-full text-center space-y-6">
            <Loader2 className="animate-spin text-[#004D3B] mx-auto" size={48} />
            <div className="space-y-2">
              <h2 className="text-lg font-serif font-black text-[#17211D]">Verifying your payment...</h2>
              <p className="text-xs text-[#75817B] font-medium">Please wait while we securely confirm your payment. Do not close this page.</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">

        {/* Dedicated Payment Result Section (Modal Dismissal / Failure) */}
        {(checkoutState === 'payment_abandoned' || checkoutState === 'payment_failed') && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3EAE6] space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FFF9C4] text-[#F57F17] rounded-full flex items-center justify-center shrink-0">
                <AlertCircle size={24} />
              </div>
              <div>
                <h2 className="text-base font-serif font-black text-[#17211D]">
                  {checkoutState === 'payment_abandoned' ? 'Payment was dismissed' : 'Payment was declined'}
                </h2>
                <p className="text-xs text-[#75817B] font-medium mt-0.5">Your cart is safe. You can retry payment or modify your items.</p>
              </div>
            </div>

            {paymentResultMessage && (
              <div className="p-3 bg-[#FFFDE7] border border-[#FFF59D] rounded-xl text-xs font-bold text-[#F57F17]">
                {paymentResultMessage}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleExpressCheckout}
                className="flex-1 bg-[#FFC400] hover:bg-[#F2AC00] text-[#004D3B] font-black text-xs uppercase py-3.5 rounded-2xl tracking-widest shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw size={16} /> Retry Payment
              </button>
              <button
                onClick={() => setCheckoutState('cart_idle')}
                className="flex-1 bg-[#E5F5EF] hover:bg-[#D5EFE5] text-[#006B50] font-black text-[11px] uppercase py-3.5 rounded-2xl border border-[#BCE2D3] tracking-wider transition-all cursor-pointer"
              >
                Back to Cart
              </button>
            </div>
          </div>
        )}

        {checkoutState === 'payment_pending' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3EAE6] space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FFF9C4] text-[#F57F17] rounded-full flex items-center justify-center shrink-0">
                <AlertCircle size={24} />
              </div>
              <div>
                <h2 className="text-base font-serif font-black text-[#17211D]">Payment status is uncertain / pending</h2>
                <p className="text-xs text-[#75817B] font-medium mt-0.5">Your cart is safe. Please check your order status before attempting another payment.</p>
              </div>
            </div>

            {paymentResultMessage && (
              <div className="p-3 bg-[#FFFDE7] border border-[#FFF59D] rounded-xl text-xs font-bold text-[#F57F17]">
                {paymentResultMessage}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/orders"
                className="flex-1 bg-[#FFC400] hover:bg-[#F5B800] text-[#004D3B] font-black text-xs uppercase py-3.5 rounded-2xl tracking-widest shadow-sm transition-all flex items-center justify-center gap-2 text-center"
              >
                <CreditCard size={16} /> Check Order Status
              </Link>
            </div>
          </div>
        )}

        {/* TOP ACTIVE DELIVERY ADDRESS CARD */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E3EAE6] text-[#17211D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#E5F5EF] text-[#006B50] flex items-center justify-center shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-[#75817B] tracking-wider">Delivering to</p>
              <p className="text-xs font-bold text-[#17211D] mt-0.5">
                {location.address ? `${location.area || ''}, ${location.city || 'Hyderabad'}` : 'Select delivery location'}
              </p>
            </div>
          </div>
          <button
            onClick={handleAddressChangeClick}
            className="px-4 py-2 rounded-xl bg-[#F5F7F6] hover:bg-[#E3EAE6] text-[#004D3B] text-xs font-bold uppercase tracking-wider transition-all border border-[#E3EAE6] cursor-pointer"
          >
            Change Address
          </button>
        </div>

        {/* CART ITEMS & RECOMMENDED CAROUSEL */}
        <div className="space-y-5">
          {/* CART ITEMS LIST */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E3EAE6] shadow-sm space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#004D3B] flex items-center gap-2">
              <ShoppingBag size={16} /> SELECTED ITEMS ({Object.keys(groupedCart).length})
            </h2>

            <div className="divide-y divide-[#E3EAE6]">
              {Object.values(groupedCart).map((item: any) => {
                const cleanId = extractProductId(item.id);
                const stock = stockData[item.id] !== undefined
                  ? stockData[item.id]
                  : (stockData[cleanId] !== undefined
                    ? stockData[cleanId]
                    : (checkingStock ? 999 : 0));
                const isOutOfStock = !checkingStock && stock === 0;
                const isOverStock = !checkingStock && item.qty > stock;
                const actualProductId = item.product_id || cleanId;
                const meta = productMetaMap[actualProductId] || productMetaMap[cleanId] || {};
                const expectedDate = item.expectedDispatchDate || meta.expected_dispatch_date || item.raw?.expected_dispatch_date;

                return (
                  <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        className="w-14 h-14 rounded-xl object-cover border border-[#E3EAE6] shrink-0"
                        alt={item.name}
                        src={item.img || 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80'}
                      />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-black text-[#17211D] leading-snug">{item.name}</p>
                        <p className="text-[11px] text-[#006B50] font-bold uppercase mt-0.5 whitespace-nowrap">₹{item.price} / {item.unit || '250 GM - GROSS WT'}</p>
                        {expectedDate && (
                          <p className="text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-1 w-fit flex items-center gap-1">
                            <Sparkles size={11} /> Delivery: {new Date(expectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        )}
                        {(isOutOfStock || isOverStock) && (
                          <p className="text-[10px] font-bold text-[#D32F2F] mt-0.5">
                            {isOutOfStock ? 'Sold out' : `Only ${stock} left in stock`}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-[#006B50] text-white rounded-xl h-8 overflow-hidden shadow-xs">
                        <button
                          disabled={isCartDisabled}
                          onClick={() => removeFromCart(item.id)}
                          className="px-2.5 h-full font-black text-base hover:bg-black/10 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          −
                        </button>
                        <span className="text-xs font-black w-5 text-center">{item.qty}</span>
                        <button
                          disabled={isCartDisabled || item.qty >= stock}
                          onClick={() => addToCart(item, stock)}
                          className="px-2.5 h-full font-black text-base hover:bg-black/10 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                      <button
                        disabled={isCartDisabled}
                        onClick={() => {
                          for (let i = 0; i < item.qty; i++) {
                            removeFromCart(item.id);
                          }
                        }}
                        className="w-8 h-8 rounded-xl bg-[#FFF2F2] text-[#D32F2F] hover:bg-[#FFE5E5] flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
                        title="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RECOMMENDED PRODUCTS CAROUSEL (Compact & Scrollable with Desktop Navigation Arrows) */}
          {recommended.length > 0 && (
            <div className="space-y-2.5 w-full overflow-hidden">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#004D3B] flex items-center gap-2">
                  <Sparkles size={15} className="text-[#FFC400]" /> You May Also Like
                </h3>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => scrollUpsells('left')}
                    className="w-7 h-7 rounded-full bg-[#E5F5EF] hover:bg-[#D5EFE5] text-[#004D3B] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => scrollUpsells('right')}
                    className="w-7 h-7 rounded-full bg-[#E5F5EF] hover:bg-[#D5EFE5] text-[#004D3B] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
              <div ref={upsellScrollRef} className="w-full overflow-x-auto overflow-y-hidden no-scrollbar flex gap-3 pb-2 px-1 touch-auto">
                {recommended.map((p, idx) => {
                  const variantId = p.variantId || p.id;
                  const itemQuantity = cart.filter((i: any) => i.id === variantId).length;
                  const stock = stockData[variantId] !== undefined
                    ? stockData[variantId]
                    : (checkingStock ? 999 : (p.stock ?? 20));
                  const isSoldOut = !checkingStock && stock === 0;

                  return (
                    <div key={`${variantId}-${idx}`} className="w-[140px] sm:w-[160px] min-w-[140px] sm:min-w-[160px] shrink-0 snap-start bg-[#F5F7F6] rounded-2xl border border-[#E3EAE6] p-2.5 shadow-2xs flex flex-col group">
                      <div className="relative h-20 w-full bg-white rounded-xl overflow-hidden mb-1.5 border border-[#E3EAE6] flex items-center justify-center">
                        <img src={p.img || p.imageUrl || 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <h4 className="text-[11px] font-bold text-[#17211D] truncate">{p.name}</h4>
                      <p className="text-[10px] text-[#75817B] font-medium uppercase mb-2">{p.unit || 'pack'} · ₹{p.price}</p>

                      <div className="mt-auto pt-1">
                        {itemQuantity > 0 ? (
                          <div className="flex items-center bg-[#004D3B] text-[#FFC400] rounded-xl h-7 overflow-hidden shadow-2xs">
                            <button
                              onClick={() => removeFromCart(variantId)}
                              className="px-2 h-full font-black text-xs hover:bg-black/10 transition-colors cursor-pointer"
                            >
                              −
                            </button>
                            <span className="px-1 text-[11px] font-black flex-1 text-center text-white">{itemQuantity}</span>
                            <button
                              onClick={() => addToCart({
                                id: variantId,
                                product_id: p.product_id || p.id,
                                name: p.name,
                                price: Number(p.price),
                                unit: p.unit,
                                img: p.img || p.imageUrl,
                              }, stock)}
                              disabled={itemQuantity >= stock}
                              className="px-2 h-full font-black text-xs hover:bg-black/10 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            disabled={isSoldOut}
                            onClick={() => addToCart({
                              id: variantId,
                              product_id: p.product_id || p.id,
                              name: p.name,
                              price: Number(p.price),
                              unit: p.unit,
                              img: p.img || p.imageUrl,
                            }, stock)}
                            className="w-full bg-[#004D3B] hover:bg-[#00382B] text-[#FFC400] py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-2xs flex items-center justify-center gap-1"
                          >
                            {isSoldOut ? 'Sold Out' : 'Add'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Visible Checkout Error Banner */}
        {checkoutError && (
          <div className="p-4 bg-[#FFF2F2] border border-[#FFCDD2] rounded-2xl flex items-center gap-3 text-xs font-bold text-[#D32F2F] shadow-sm animate-in fade-in">
            <AlertCircle size={20} className="shrink-0" />
            <span>{checkoutError}</span>
          </div>
        )}

        {/* COUPON & BILLING SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Coupon Input */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E3EAE6] shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#004D3B] flex items-center gap-2">
              <Tag size={15} /> Apply Coupon
            </h3>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="ENTER PROMO CODE"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 bg-[#F5F7F6] border border-[#E3EAE6] rounded-2xl px-4 py-3 text-xs font-bold text-[#17211D] outline-none focus:border-[#004D3B]"
              />
              <button
                type="submit"
                disabled={validatingCoupon || !couponCode.trim()}
                className="bg-[#004D3B] hover:bg-[#00382B] text-[#FFC400] font-black px-5 py-3 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {validatingCoupon ? <Loader2 size={15} className="animate-spin" /> : 'Apply'}
              </button>
            </form>
            {couponMsg && (
              <p className={`text-xs font-bold ${appliedCoupon ? 'text-[#006B50]' : 'text-[#D32F2F]'}`}>
                {couponMsg}
              </p>
            )}
          </div>

          {/* Bill Details */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E3EAE6] shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#004D3B] flex items-center gap-2">
              <CreditCard size={15} /> Bill Details
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#75817B]">
                <span>Items Subtotal</span>
                <span className="font-bold text-[#17211D]">₹{totalAmount}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-[#006B50]">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span className="font-bold">- ₹{couponDiscount}</span>
                </div>
              )}

              <div className="flex justify-between text-[#75817B]">
                <span>Delivery Fee</span>
                <span className="font-bold text-[#17211D]">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>

              <div className="pt-2 border-t border-[#E3EAE6] flex justify-between text-sm sm:text-base font-black text-[#004D3B]">
                <span>Grand Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <button
              disabled={isCartDisabled || cart.length === 0 || hasStockIssues}
              onClick={handleExpressCheckout}
              className="w-full bg-[#FFC400] hover:bg-F2AC00 text-[#004D3B] font-black py-4 rounded-2xl uppercase text-xs tracking-[0.2em] transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer border border-[#E9A900]"
            >
              {checkoutState === 'creating_order' ? (
                <>
                  <Loader2 size={17} className="animate-spin" /> Preparing Checkout...
                </>
              ) : checkoutState === 'payment_open' ? (
                <>
                  <Loader2 size={17} className="animate-spin" /> Complete Payment...
                </>
              ) : hasStockIssues ? (
                'Resolve Stock Issues to Checkout'
              ) : (
                'Place Order & Pay'
              )}
            </button>
          </div>

        </div>

      </div>

    </main>
  );
}
