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

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    let razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    let secretRef = "RAZORPAY_KEY_SECRET";

    const { data: activeGw } = await supabase
      .from("payment_gateways")
      .select("key_id, secret_reference")
      .eq("is_active", true)
      .eq("provider", "razorpay")
      .maybeSingle();

    if (activeGw?.key_id) {
      razorpayKeyId = activeGw.key_id;
    }
    if (activeGw?.secret_reference) {
      secretRef = activeGw.secret_reference;
    }

    const razorpayKeySecret = Deno.env.get(secretRef) || Deno.env.get("RAZORPAY_KEY_SECRET");

    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

    if (!razorpayKeyId || !razorpayKeySecret) {
      return new Response(JSON.stringify({ error: "Server configuration missing: RAZORPAY_KEY_SECRET" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. DERIVE VERIFIED AUTHENTICATED USER ID EXCLUSIVELY FROM JWT BEARER TOKEN (STRICT ZERO-TRUST ENFORCEMENT)
    const authorization = req.headers.get("Authorization") || "";
    const accessToken = authorization.trim().split(/\s+/).pop() || "";
    let verifiedUserId: string | null = null;

    if (accessToken && anonKey) {
      const authClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
      const { data: { user } } = await authClient.auth.getUser(accessToken);
      if (user) {
        verifiedUserId = user.id;
      }
    }

    const body = await req.json();
    const { items, details, couponCode, browserId } = body;

    // Strict Enforcement: user_id is set ONLY if cryptographically verified via JWT bearer session
    const finalUserId = verifiedUserId || null;

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

    // 2. STRICT DATABASE ITEM & PRICE VALIDATION (ZERO CLIENT PRICE FALLBACK)
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
        const availableStock = variant.stock !== null ? Number(variant.stock) : 999;
        if (!variant.is_available || availableStock < qty) {
          const itemName = variant.products?.name || item.name;
          const errMsg = availableStock === 0
            ? `Item "${itemName}" (${variant.unit}) is out of stock.`
            : `Only ${availableStock} left in stock for "${itemName}" (${variant.unit}). Please update your quantity.`;

          return new Response(JSON.stringify({ error: errMsg }), {
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

        // STRICT GUARD: If neither variant nor product exists in DB, REJECT IT!
        if (!product) {
          return new Response(JSON.stringify({
            error: `Product or variant "${item.name || itemId}" does not exist in catalog.`
          }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const availableStock = product.stock !== null ? Number(product.stock) : 999;
        if (!product.is_available || availableStock < qty) {
          const errMsg = availableStock === 0
            ? `Item "${product.name}" is out of stock.`
            : `Only ${availableStock} left in stock for "${product.name}". Please update your quantity.`;

          return new Response(JSON.stringify({ error: errMsg }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const itemPrice = Number(product.price || 100);
        const itemSubtotal = itemPrice * qty;
        verifiedSubtotal += itemSubtotal;

        verifiedItems.push({
          product_id: product.id,
          variant_id: null,
          product_name: product.name,
          variant_unit: item.unit || 'pack',
          product_image: product.image_url,
          price: itemPrice,
          quantity: qty,
          total_price: itemSubtotal,
        });
      }
    }

    // 3. STRICT COUPON VALIDATION
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

      if (coupon.is_first_order_only && finalUserId) {
        const { count: previousOrdersCount } = await supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', finalUserId);

        if (previousOrdersCount && previousOrdersCount > 0) {
          return new Response(JSON.stringify({
            error: `Promo code "${coupon.code}" is valid for first-time customer orders only.`
          }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
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

    // 4. DYNAMIC DISTANCE & DELIVERY FEE EVALUATION
    let deliveryFee = 0;
    let calculatedDistanceKm = 0;

    const { data: delSet } = await supabase
      .from('delivery_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    const storeLat = Number(delSet?.store_latitude ?? STORE_LAT);
    const storeLng = Number(delSet?.store_longitude ?? STORE_LNG);

    if (details && details.lat && details.lng) {
      calculatedDistanceKm = getDistanceFromLatLonInKm(
        storeLat,
        storeLng,
        parseFloat(details.lat),
        parseFloat(details.lng)
      );
    }

    if (delSet) {
      if (!delSet.is_free_delivery_enabled || delSet.delivery_mode === 'flat_fee') {
        deliveryFee = Number(delSet.flat_delivery_fee || 65);
      } else if (delSet.delivery_mode === 'preset_rules') {
        const radius = Number(delSet.preset_zone_radius_km || 5);
        const isZone1 = calculatedDistanceKm <= radius;
        const targetSub = isZone1 ? Number(delSet.preset_zone1_subtotal || 299) : Number(delSet.preset_zone2_subtotal || 499);
        const stdFee = isZone1 ? Number(delSet.preset_zone1_fee || 30) : Number(delSet.preset_zone2_fee || 30);
        deliveryFee = subtotalAfterDiscount >= targetSub ? 0 : stdFee;
      } else {
        // distance_tiered
        const t1Max = Number(delSet.tier1_max_km || 5);
        const t2Max = Number(delSet.tier2_max_km || 10);
        let targetSub = Number(delSet.tier1_subtotal || 299);
        let stdFee = Number(delSet.tier1_fee || 30);

        if (calculatedDistanceKm > t1Max && calculatedDistanceKm <= t2Max) {
          targetSub = Number(delSet.tier2_subtotal || 500);
          stdFee = Number(delSet.tier2_fee || 30);
        } else if (calculatedDistanceKm > t2Max) {
          targetSub = Number(delSet.tier3_subtotal || 699);
          stdFee = Number(delSet.tier3_fee || 30);
        }

        deliveryFee = subtotalAfterDiscount >= targetSub ? 0 : stdFee;
      }
    }

    const orderTotal = subtotalAfterDiscount + deliveryFee;
    const customReceiptId = `DRAFT-${Date.now().toString().slice(-6)}`;
    const amountInPaise = Math.round(orderTotal * 100);

    // 5. CALL RAZORPAY API TO GENERATE LOCKED ORDER ID
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

    // 6. STAGE 1: PERSIST CHECKOUT INTENTION SNAPSHOT IN SUPABASE
    const { data: checkout, error: checkoutErr } = await supabase
      .from('checkouts')
      .insert({
        user_id: finalUserId,
        customer_name: details?.name || 'Customer',
        customer_phone: details?.phone || '',
        delivery_address: details || {},
        subtotal: verifiedSubtotal,
        delivery_fee: deliveryFee,
        discount: discountAmount,
        grand_total: orderTotal,
        currency: 'INR',
        status: 'pending_payment',
      })
      .select('id')
      .single();

    if (checkoutErr || !checkout) {
      console.error("Checkout persistence failed:", checkoutErr);
      return new Response(JSON.stringify({ error: "Failed to persist checkout intention in database." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const checkoutItemsPayload = verifiedItems.map(i => ({
      checkout_id: checkout.id,
      product_id: String(i.product_id || i.variant_id || ''),
      variant_id: String(i.variant_id || i.product_id || ''),
      product_name: i.product_name,
      variant_unit: i.variant_unit || 'pack',
      unit_price: i.price,
      quantity: i.quantity,
      line_total: i.total_price,
    }));

    const { error: itemsInsertErr } = await supabase.from('checkout_items').insert(checkoutItemsPayload);
    if (itemsInsertErr) {
      console.error("Checkout items insert error:", itemsInsertErr);
      throw itemsInsertErr;
    }

    // 7. STAGE 2: PERSIST INITIAL PAYMENT ATTEMPT RECORD LINKING CHECKOUT ID & RAZORPAY ORDER ID
    const { data: paymentRecord, error: payErr } = await supabase
      .from('payments')
      .insert({
        checkout_id: checkout.id,
        razorpay_order_id: razorpayOrder.id,
        amount: orderTotal,
        currency: 'INR',
        status: 'created',
      })
      .select('id')
      .single();

    if (payErr) {
      console.error("Initial payment record persistence failed:", payErr);
    }

    return new Response(JSON.stringify({
      success: true,
      checkoutId: checkout.id,
      paymentId: paymentRecord?.id,
      keyId: razorpayKeyId,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      subtotal: verifiedSubtotal,
      deliveryFee,
      discount: discountAmount,
      total: orderTotal,
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
