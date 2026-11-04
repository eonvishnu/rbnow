import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

const isValidUuid = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str || '');

function extractProductId(id: string): string {
  if (!id) return '';
  if (id.length >= 36) return id.substring(0, 36);
  const lastDash = id.lastIndexOf('-');
  return lastDash !== -1 ? id.substring(0, lastDash) : id;
}

// @ts-ignore
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "Server configuration missing: SUPABASE_SERVICE_ROLE_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!razorpayKeyId || !razorpayKeySecret) {
      return new Response(JSON.stringify({ error: "Server configuration missing: RAZORPAY_KEY_SECRET" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();
    const { items, details, couponCode, userId, browserId } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "Cart items are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch active variant discounts
    const { data: activeDiscounts } = await supabase
      .from('discounts')
      .select('*, discount_variants(*)')
      .eq('is_active', true);

    let verifiedSubtotal = 0;
    const verifiedItems = [];

    // 1. STRICT CART ITEM & STRICT INTEGER QUANTITY VALIDATION
    for (const item of items) {
      const rawQtyStr = String(item.qty || item.quantity || '');
      if (!/^\d+$/.test(rawQtyStr)) {
        return new Response(JSON.stringify({
          error: `Quantity for item "${item.name || 'product'}" must be a positive integer.`
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const qty = parseInt(rawQtyStr, 10);
      if (qty < 1 || qty > 50) {
        return new Response(JSON.stringify({
          error: `Quantity for item "${item.name || 'product'}" must be between 1 and 50.`
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const itemId = item.id || '';
      const candidateVariantId = item.variant_id || (isValidUuid(itemId) ? itemId : null);
      let variant = null;

      if (candidateVariantId && isValidUuid(candidateVariantId)) {
        const { data: vData } = await supabase
          .from('product_variants')
          .select('*, products(*)')
          .eq('id', candidateVariantId)
          .single();

        if (vData) variant = vData;
      }

      if (variant) {
        // Stock Check
        if (!variant.is_available || (variant.stock !== null && variant.stock < qty)) {
          return new Response(JSON.stringify({
            error: `Item "${variant.products?.name || item.name}" (${variant.unit}) is out of stock.`
          }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        let rawPrice = Number(variant.price);
        let variantDiscountPercent = 0;
        if (activeDiscounts) {
          for (const disc of activeDiscounts) {
            const isLinked = disc.discount_variants?.some((dv: any) => dv.variant_id === variant.id);
            if (isLinked) {
              if (disc.discount_type === 'percentage') {
                variantDiscountPercent = Math.max(variantDiscountPercent, Number(disc.discount_value));
              } else {
                const flatDiscount = Number(disc.discount_value);
                const percentEquiv = Math.round((flatDiscount / rawPrice) * 100);
                variantDiscountPercent = Math.max(variantDiscountPercent, percentEquiv);
              }
            }
          }
        }

        const itemPrice = variantDiscountPercent > 0
          ? Math.round(rawPrice * (1 - (variantDiscountPercent / 100)))
          : rawPrice;

        const itemSubtotal = itemPrice * qty;
        verifiedSubtotal += itemSubtotal;

        verifiedItems.push({
          product_id: variant.product_id,
          variant_id: variant.id,
          product_name: variant.products?.name || item.name,
          variant_unit: variant.unit,
          product_image: variant.products?.image_url,
          price: itemPrice,
          quantity: qty,
          total_price: itemSubtotal,
        });
      } else {
        const candidateProductId = item.product_id || extractProductId(itemId);
        let product = null;

        if (isValidUuid(candidateProductId)) {
          const { data: pData } = await supabase
            .from('products')
            .select('*')
            .eq('id', candidateProductId)
            .single();
          if (pData) product = pData;
        }

        const itemPrice = Number(product?.price || item.price || 100);
        const itemSubtotal = itemPrice * qty;
        verifiedSubtotal += itemSubtotal;

        verifiedItems.push({
          product_id: product ? product.id : null,
          variant_id: null,
          product_name: product ? product.name : (item.name || 'Fresh Catch'),
          variant_unit: item.unit || 'pack',
          product_image: product ? product.image_url : item.img,
          price: itemPrice,
          quantity: qty,
          total_price: itemSubtotal,
        });
      }
    }

    // 2. STRICT COUPON VALIDATION WITH SAFE POSTGREST FILTERS
    let discountAmount = 0;
    if (couponCode) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .single();

      if (!coupon || !coupon.is_active) {
        return new Response(JSON.stringify({ error: `Promo code "${couponCode}" is invalid or inactive.` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
        return new Response(JSON.stringify({ error: `Promo code "${coupon.code}" has expired.` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (verifiedSubtotal < Number(coupon.min_order_amount || 0)) {
        return new Response(JSON.stringify({
          error: `Minimum order subtotal of ₹${coupon.min_order_amount} required for code "${coupon.code}".`
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (coupon.is_first_order_only && userId && isValidUuid(userId)) {
        const { count: previousOrdersCount } = await supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId);

        if (previousOrdersCount && previousOrdersCount > 0) {
          return new Response(JSON.stringify({
            error: `Promo code "${coupon.code}" is valid for first-time customer orders only.`
          }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }

      const userPhone = (details?.phone || '').trim();
      const safeUserId = (userId && isValidUuid(userId)) ? userId : '00000000-0000-0000-0000-000000000000';
      const safeBrowserId = (browserId || 'none').trim();

      let filterStr = `user_id.eq.${safeUserId}`;
      if (userPhone) filterStr += `,phone_number.eq.${userPhone}`;
      if (safeBrowserId) filterStr += `,browser_id.eq.${safeBrowserId}`;

      const { data: usage } = await supabase
        .from('coupon_usages')
        .select('id')
        .eq('coupon_id', coupon.id)
        .or(filterStr)
        .limit(1);

      if (usage && usage.length > 0) {
        return new Response(JSON.stringify({
          error: `Promo code "${coupon.code}" has already been redeemed on this account, phone, or browser.`
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (coupon.discount_type === 'percentage') {
        discountAmount = Math.floor((verifiedSubtotal * Number(coupon.discount_value)) / 100);
        if (coupon.max_discount_amount) {
          discountAmount = Math.min(discountAmount, Number(coupon.max_discount_amount));
        }
      } else {
        discountAmount = Number(coupon.discount_value);
      }
    }

    const subtotalAfterDiscount = Math.max(0, verifiedSubtotal - discountAmount);

    // 3. Dynamic Server-Side Distance & Delivery Fee Evaluation
    let deliveryFee = 0;
    let calculatedDistanceKm = 0;
    let matchedRuleId = null;
    let matchedRuleSnapshot = null;

    // Fetch live delivery settings and active rules from Supabase
    const { data: delSet } = await supabase
      .from('delivery_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    const storeLat = Number(delSet?.store_latitude ?? STORE_LAT);
    const storeLng = Number(delSet?.store_longitude ?? STORE_LNG);
    const pricingMode = delSet?.delivery_pricing_mode || 'rules';

    if (details && details.lat && details.lng) {
      calculatedDistanceKm = getDistanceFromLatLonInKm(
        storeLat,
        storeLng,
        parseFloat(details.lat),
        parseFloat(details.lng)
      );
    }

    if (pricingMode === 'always_free') {
      deliveryFee = 0;
    } else if (pricingMode === 'distance_based') {
      deliveryFee = Math.round(calculatedDistanceKm * 10);
    } else {
      // Evaluate active rules in priority order
      const { data: rulesData } = await supabase
        .from('delivery_fee_rules')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: true });

      if (rulesData && rulesData.length > 0) {
        for (const r of rulesData) {
          const minDist = Number(r.min_distance_km || 0);
          const maxDist = r.max_distance_km != null ? Number(r.max_distance_km) : Infinity;
          const minSub = Number(r.min_order_amount || 0);
          const maxSub = r.max_order_amount != null ? Number(r.max_order_amount) : Infinity;

          const matchesDistance = calculatedDistanceKm >= minDist && calculatedDistanceKm < maxDist;
          const matchesSubtotal = verifiedSubtotal >= minSub && verifiedSubtotal < maxSub;

          if (matchesDistance && matchesSubtotal) {
            // Enforce minimum checkout subtotal threshold if configured
            const minCheckoutSub = Number(r.min_checkout_subtotal || 0);
            if (verifiedSubtotal < minCheckoutSub) {
              const shortfall = minCheckoutSub - verifiedSubtotal;
              return new Response(JSON.stringify({
                error: `Minimum order requirement of ₹${minCheckoutSub} for delivery to your area. Add items worth ₹${shortfall} more.`
              }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              });
            }

            if (r.fee_type === 'free') {
              deliveryFee = 0;
            } else if (r.fee_type === 'per_km') {
              deliveryFee = Math.round(calculatedDistanceKm * Number(r.fee_amount || 0));
            } else {
              deliveryFee = Number(r.fee_amount || 0);
            }

            matchedRuleId = r.id;
            matchedRuleSnapshot = {
              rule_name: r.name,
              min_distance_km: minDist,
              max_distance_km: r.max_distance_km,
              fee_type: r.fee_type,
              fee_amount: r.fee_amount,
            };
            break;
          }
        }
      }
    }

    const orderTotal = subtotalAfterDiscount + deliveryFee;
    const customReceiptId = `DRAFT-${Date.now().toString().slice(-6)}`;
    const amountInPaise = Math.round(orderTotal * 100);

    // 4. CALL RAZORPAY API
    const authHeader = `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`;
    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: customReceiptId,
        notes: {
          store_name: "Royal Bengal",
          draft_order_id: customReceiptId,
          customer_phone: details?.phone || '',
        }
      }),
    });

    const razorpayOrder = await razorpayRes.json();

    if (!razorpayRes.ok || !razorpayOrder.id) {
      console.error("Razorpay Order Creation Failed:", razorpayOrder);
      return new Response(JSON.stringify({
        error: `Razorpay payment gateway order creation failed: ${razorpayOrder.error?.description || 'Gateway error'}`
      }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. PERSIST PENDING DRAFT ORDER IN SUPABASE WITH HISTORICAL DELIVERY SNAPSHOT
    const { data: pendingOrder, error: pendingErr } = await supabase
      .from('orders')
      .insert({
        user_id: userId || null,
        user_name: details?.name || 'Customer',
        user_email: details?.email || '',
        user_phone: details?.phone || '',
        delivery_address: details || {},
        subtotal: verifiedSubtotal,
        delivery_fee: deliveryFee,
        delivery_distance_km: Number(calculatedDistanceKm.toFixed(2)),
        delivery_rule_id: matchedRuleId,
        delivery_rule_snapshot: matchedRuleSnapshot,
        discount: discountAmount,
        total: orderTotal,
        payment_method: 'razorpay',
        payment_status: 'pending',
        status: 'pending_payment',
        razorpay_order_id: razorpayOrder.id,
        notes: `Temporary Draft Ref: ${customReceiptId}`,
      })
      .select('id')
      .single();

    if (pendingErr || !pendingOrder) {
      console.error("Pending order persistence failed:", pendingErr);
      return new Response(JSON.stringify({ error: "Failed to persist pending order in database." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lineItems = verifiedItems.map(i => ({
      order_id: pendingOrder.id,
      product_id: i.product_id,
      variant_id: i.variant_id,
      product_name: i.product_name,
      variant_unit: i.variant_unit,
      product_image: i.product_image,
      price: i.price,
      quantity: i.quantity,
      total_price: i.total_price,
    }));

    const { error: itemsErr } = await supabase.from('order_items').insert(lineItems);
    if (itemsErr) {
      console.error("Order items persistence failed:", itemsErr);
      return new Response(JSON.stringify({ error: "Failed to persist order line items." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      customReceiptId: customReceiptId,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      subtotal: verifiedSubtotal,
      deliveryFee,
      discount: discountAmount,
      total: orderTotal,
      couponId: couponCode ? (await supabase.from('coupons').select('id').eq('code', couponCode.toUpperCase()).single()).data?.id : null,
      items: verifiedItems,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in place-order edge function:", error);
    return new Response(JSON.stringify({ error: error.message || "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
