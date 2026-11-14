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

// @ts-ignore
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "Server configuration missing." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Fail-safe credential resolution
    let razorpayKeyId = "";
    let razorpayKeySecret = "";

    const { data: activeGw, error: gwErr } = await supabase
      .from("payment_gateways")
      .select("key_id, secret_key")
      .eq("is_active", true)
      .eq("provider", "razorpay")
      .maybeSingle();

    if (gwErr) {
      console.error("Failed to fetch active payment gateway:", gwErr);
      return new Response(JSON.stringify({ error: "Server configuration error." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (activeGw) {
      if (!activeGw.key_id || !activeGw.secret_key) {
        return new Response(JSON.stringify({ error: "Active payment gateway has incomplete credentials." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      razorpayKeyId = activeGw.key_id;
      razorpayKeySecret = activeGw.secret_key;
    } else {
      razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID") || "";
      razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET") || "";
    }

    if (!razorpayKeyId || !razorpayKeySecret) {
      return new Response(JSON.stringify({ error: "Razorpay configuration is missing." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

    // 1. DERIVE VERIFIED AUTHENTICATED USER ID EXCLUSIVELY FROM JWT BEARER TOKEN
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
    const finalUserId = verifiedUserId || null;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "Cart items are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Temporary double-click guard with explicit database error check
    if (finalUserId) {
      const { data: recentOrders, error: recentErr } = await supabase
        .from('orders')
        .select('id, created_at')
        .eq('user_id', finalUserId)
        .eq('status', 'pending_payment')
        .gte('created_at', new Date(Date.now() - 30000).toISOString())
        .limit(1);

      if (recentErr) {
        console.error("Recent orders check failed:", recentErr);
        return new Response(JSON.stringify({ error: "Server error: Database query failed." }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (recentOrders && recentOrders.length > 0) {
        return new Response(JSON.stringify({ error: "A checkout request is already in progress. Please wait a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Fetch active variant discounts with strict error check
    const { data: activeDiscounts, error: discErr } = await supabase
      .from('discounts')
      .select('*, discount_variants(*)')
      .eq('is_active', true);

    if (discErr) {
      console.error("Discounts fetch error:", discErr);
      return new Response(JSON.stringify({ error: "Server error: Database query failed." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Aggregate quantities by variant_id with malformed item validation
    const aggregatedQuantities: Record<string, number> = {};
    for (const item of items) {
      if (!item || typeof item !== 'object') {
        return new Response(JSON.stringify({ error: "Invalid cart item format." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const rawQty = item.qty !== undefined ? item.qty : item.quantity;
      const rawQtyStr = String(rawQty !== undefined && rawQty !== null ? rawQty : '');
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

      const candidateVariantId = item.variant_id;
      if (typeof candidateVariantId !== "string" || !isValidUuid(candidateVariantId)) {
        return new Response(JSON.stringify({
          error: `Please select a valid variant for "${item.name || 'product'}".`
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      aggregatedQuantities[candidateVariantId] = (aggregatedQuantities[candidateVariantId] || 0) + qty;
    }

    let verifiedSubtotal = 0;
    const verifiedItems = [];

    // 2. STRICT DATABASE VARIANT VALIDATION & AGGREGATED STOCK CHECK
    for (const [variantId, totalQty] of Object.entries(aggregatedQuantities)) {
      const { data: variant, error: variantErr } = await supabase
        .from('product_variants')
        .select('*, products(*)')
        .eq('id', variantId)
        .maybeSingle();

      if (variantErr) {
        console.error("Variant lookup failed:", variantErr);
        return new Response(JSON.stringify({ error: "Unable to verify product availability. Please try again." }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!variant || !variant.products) {
        return new Response(JSON.stringify({
          error: `The selected product variant no longer exists. Please refresh your cart.`
        }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const availableStock = variant.stock !== null ? Number(variant.stock) : NaN;
      if (variant.is_available !== true || !Number.isFinite(availableStock) || availableStock < totalQty) {
        const itemName = variant.products.name;
        const errMsg = availableStock === 0
          ? `Item "${itemName}" (${variant.unit}) is out of stock.`
          : `Only ${availableStock} left in stock for "${itemName}" (${variant.unit}). Please update your quantity.`;

        return new Response(JSON.stringify({ error: errMsg }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const rawPrice = Number(variant.price);
      if (!Number.isFinite(rawPrice) || rawPrice < 0) {
        throw new Error(`Invalid price configured for variant "${variant.unit}".`);
      }

      let variantDiscountPercent = 0;
      if (activeDiscounts) {
        for (const disc of activeDiscounts) {
          const isLinked = disc.discount_variants?.some((dv: any) => dv.variant_id === variant.id);
          if (isLinked) {
            const discVal = Number(disc.discount_value);
            if (!Number.isFinite(discVal) || discVal < 0) continue;

            if (disc.discount_type === 'percentage') {
              const validPct = Math.min(100, Math.max(0, discVal));
              variantDiscountPercent = Math.max(variantDiscountPercent, validPct);
            } else {
              const flatDiscount = Number(disc.discount_value);
              const percentEquiv = rawPrice > 0
                ? Math.min(100, Math.round((flatDiscount / rawPrice) * 100))
                : (flatDiscount > 0 ? 100 : 0);
              variantDiscountPercent = Math.max(variantDiscountPercent, percentEquiv);
            }
          }
        }
      }

      if (!Number.isFinite(variantDiscountPercent) || variantDiscountPercent < 0 || variantDiscountPercent > 100) {
        throw new Error(`Invalid discount configured for variant "${variant.unit}".`);
      }

      const itemPrice = variantDiscountPercent > 0
        ? Math.round(rawPrice * (1 - variantDiscountPercent / 100))
        : rawPrice;

      const itemSubtotal = itemPrice * totalQty;
      verifiedSubtotal += itemSubtotal;

      verifiedItems.push({
        product_id: variant.product_id,
        variant_id: variant.id,
        product_name: variant.products.name,
        variant_unit: variant.unit,
        product_image: variant.products.image_url,
        price: itemPrice,
        quantity: totalQty,
        total_price: itemSubtotal,
      });
    }

    // 3. STRICT COUPON VALIDATION WITH ERROR CHECKS & BOUNDS
    let discountAmount = 0;
    if (couponCode) {
      const { data: coupon, error: cErr } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .maybeSingle();

      if (cErr) {
        console.error("Coupon lookup error:", cErr);
        return new Response(JSON.stringify({ error: "Server error: Database query failed." }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!coupon || !coupon.is_active) {
        return new Response(JSON.stringify({ error: `Promo code "${couponCode}" is invalid or inactive.` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (coupon.expiry_date) {
        const expiryDate = new Date(coupon.expiry_date);
        if (isNaN(expiryDate.getTime())) {
          return new Response(JSON.stringify({ error: "Invalid coupon configuration." }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (expiryDate < new Date()) {
          return new Response(JSON.stringify({ error: `Promo code "${coupon.code}" has expired.` }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }

      const minOrderAmt = Number(coupon.min_order_amount || 0);
      if (!Number.isFinite(minOrderAmt) || minOrderAmt < 0) {
        return new Response(JSON.stringify({ error: "Invalid coupon configuration." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (verifiedSubtotal < minOrderAmt) {
        return new Response(JSON.stringify({
          error: `Minimum order subtotal of ₹${minOrderAmt} required for code "${coupon.code}".`
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (coupon.is_first_order_only) {
        if (!finalUserId) {
          return new Response(JSON.stringify({
            error: `Promo code "${coupon.code}" is valid for registered customer orders only. Please log in.`
          }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { count: previousOrdersCount, error: oCountErr } = await supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', finalUserId)
          .eq('payment_status', 'paid');

        if (oCountErr) {
          console.error("Previous order lookup failed:", oCountErr);
          return new Response(JSON.stringify({ error: "Unable to validate this coupon. Please try again." }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if ((previousOrdersCount ?? 0) > 0) {
          return new Response(JSON.stringify({
            error: `Promo code "${coupon.code}" is valid for first-time customer orders only.`
          }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }

      const couponVal = Number(coupon.discount_value);
      if (!Number.isFinite(couponVal) || couponVal < 0 || (coupon.discount_type !== 'percentage' && coupon.discount_type !== 'flat')) {
        return new Response(JSON.stringify({ error: "Invalid coupon configuration." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (coupon.discount_type === 'percentage') {
        if (couponVal < 0 || couponVal > 100) {
          return new Response(JSON.stringify({ error: "Invalid coupon configuration." }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        discountAmount = Math.floor((verifiedSubtotal * couponVal) / 100);
        if (coupon.max_discount_amount !== null && coupon.max_discount_amount !== undefined) {
          const maxDisc = Number(coupon.max_discount_amount);
          if (!Number.isFinite(maxDisc) || maxDisc < 0) {
            return new Response(JSON.stringify({ error: "Invalid coupon configuration." }), {
              status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          discountAmount = Math.min(discountAmount, maxDisc);
        }
      } else {
        discountAmount = Math.min(verifiedSubtotal, couponVal);
      }
    }

    const subtotalAfterDiscount = Math.max(0, verifiedSubtotal - discountAmount);

    // 4. DYNAMIC DISTANCE & DELIVERY FEE EVALUATION WITH STORE & CUSTOMER COORDINATE VALIDATION
    let deliveryFee = 0;
    let calculatedDistanceKm = 0;

    const { data: delSet, error: delErr } = await supabase
      .from('delivery_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (delErr || !delSet) {
      console.error("Delivery settings fetch error:", delErr);
      return new Response(JSON.stringify({ error: "Server error: Delivery settings are not configured." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const storeLat = Number(delSet.store_latitude ?? STORE_LAT);
    const storeLng = Number(delSet.store_longitude ?? STORE_LNG);

    if (!Number.isFinite(storeLat) || !Number.isFinite(storeLng) || storeLat < -90 || storeLat > 90 || storeLng < -180 || storeLng > 180) {
      console.error("Invalid store coordinates in delivery_settings");
      return new Response(JSON.stringify({ error: "Server configuration error: Invalid store location." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pricingMode = delSet.delivery_mode || 'rules';
    const requiresDistance = Boolean(delSet.is_free_delivery_enabled) && pricingMode !== 'always_free' && pricingMode !== 'flat_fee';

    if (requiresDistance) {
      const rawLat = details?.lat;
      const rawLng = details?.lng;

      const validCoordinateInput = (value: unknown): boolean =>
        (typeof value === "number" && Number.isFinite(value)) ||
        (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value)));

      if (!validCoordinateInput(rawLat) || !validCoordinateInput(rawLng)) {
        return new Response(JSON.stringify({ error: "Valid delivery coordinates are required." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const lat = Number(rawLat);
      const lng = Number(rawLng);

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng) ||
        lat < -90 || lat > 90 ||
        lng < -180 || lng > 180
      ) {
        return new Response(JSON.stringify({ error: "Invalid delivery coordinates provided." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      calculatedDistanceKm = getDistanceFromLatLonInKm(storeLat, storeLng, lat, lng);
    }

    if (delSet) {
      if (delSet.delivery_mode === 'always_free') {
        deliveryFee = 0;
      } else if (!delSet.is_free_delivery_enabled || delSet.delivery_mode === 'flat_fee') {
        deliveryFee = Number(delSet.flat_delivery_fee || 65);
      } else if (delSet.delivery_mode === 'preset_rules') {
        const radius = Number(delSet.preset_zone_radius_km || 5);
        const isZone1 = calculatedDistanceKm <= radius;
        const targetSub = isZone1
          ? Number(delSet.preset_zone1_subtotal || 299)
          : Number(delSet.preset_zone2_subtotal || 499);
        const stdFee = isZone1
          ? Number(delSet.preset_zone1_fee || 30)
          : Number(delSet.preset_zone2_fee || 30);

        deliveryFee = subtotalAfterDiscount >= targetSub ? 0 : stdFee;
      } else {
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
    const amountInPaise = Math.round(orderTotal * 100);

    if (!Number.isSafeInteger(amountInPaise) || amountInPaise <= 0) {
      return new Response(JSON.stringify({ error: "Invalid order amount." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. STAGE 1: PERSIST PENDING ORDER IN SUPABASE FIRST
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        user_id: finalUserId,
        customer_name: details?.name || 'Customer',
        customer_phone: details?.phone || '',
        delivery_address: details || {},
        subtotal: verifiedSubtotal,
        delivery_fee: deliveryFee,
        discount: discountAmount,
        total: orderTotal,
        payment_status: 'pending',
        status: 'pending_payment',
      })
      .select('id')
      .single();

    if (orderErr || !order) {
      console.error("Order persistence failed:", orderErr);
      return new Response(JSON.stringify({ error: "Failed to create pending order in database." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const orderItemsPayload = verifiedItems.map(i => ({
      order_id: order.id,
      product_id: i.product_id,
      variant_id: i.variant_id,
      product_name: i.product_name,
      variant_unit: i.variant_unit || 'pack',
      price: i.price,
      quantity: i.quantity,
      total_price: i.total_price,
    }));

    const { error: itemsInsertErr } = await supabase.from('order_items').insert(orderItemsPayload);
    if (itemsInsertErr) {
      console.error("Order items insert error:", itemsInsertErr);
      await supabase.from('orders').update({ status: 'cancelled' }).eq('id', order.id);
      throw itemsInsertErr;
    }

    // 6. CREATE INTERNAL PAYMENT ATTEMPT BEFORE CALLING RAZORPAY
    const { data: paymentRecord, error: payErr } = await supabase
      .from('payments')
      .insert({
        order_id: order.id,
        amount: amountInPaise,
        currency: 'INR',
        status: 'created',
      })
      .select('id')
      .single();

    if (payErr || !paymentRecord) {
      console.error("Payment record creation failed:", payErr);
      await supabase.from('orders').update({ status: 'cancelled' }).eq('id', order.id);
      return new Response(JSON.stringify({ error: "Unable to initialize payment. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customReceiptId = `RB-${order.id}`;

    // 7. CREATE RAZORPAY ORDER WITH RECONCILIATION-SAFE TIMEOUT & AMBIGUOUS 2xx/5xx HANDLING
    let razorpayOrder: any;
    try {
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
            order_id: order.id,
          }
        }),
      });

      razorpayOrder = await razorpayRes.json();

      if (
        !razorpayRes.ok ||
        !razorpayOrder?.id ||
        Number(razorpayOrder.amount) !== amountInPaise ||
        razorpayOrder.currency !== 'INR'
      ) {
        console.error("Razorpay order creation/validation failed:", razorpayOrder);

        const hasValidId = typeof razorpayOrder?.id === "string" && /^order_[A-Za-z0-9]+$/.test(razorpayOrder.id);

        if (hasValidId) {
          const { data: preservedPayment, error: preserveErr } = await supabase
            .from('payments')
            .update({
              razorpay_order_id: razorpayOrder.id,
              status: 'created',
              failure_description: 'Razorpay response validation failed - requires reconciliation',
              updated_at: new Date().toISOString(),
            })
            .eq('id', paymentRecord.id)
            .select('id, razorpay_order_id')
            .maybeSingle();

          if (
            preserveErr ||
            !preservedPayment ||
            preservedPayment.razorpay_order_id !== razorpayOrder.id
          ) {
            console.error("Failed to preserve Razorpay order ID:", preserveErr);
          }
        }

        if (razorpayRes.status >= 400 && razorpayRes.status < 500) {
          if (!hasValidId) {
            const { error: failErr } = await supabase
              .from('payments')
              .update({
                status: 'failed',
                failure_description:
                  razorpayOrder?.error?.description || 'Razorpay rejected order creation',
                updated_at: new Date().toISOString(),
              })
              .eq('id', paymentRecord.id);

            if (failErr) {
              console.error("Failed to record Razorpay rejection:", failErr);
            }

            const { error: cancelErr } = await supabase
              .from('orders')
              .update({ status: 'cancelled' })
              .eq('id', order.id);

            if (cancelErr) {
              console.error("Failed to cancel rejected order:", cancelErr);
            }
          }

          return new Response(JSON.stringify({ error: "Unable to initialize payment. Please try again." }), {
            status: 502,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else {
          // Ambiguous outcome (5xx or malformed 2xx): preserve created status for reconciliation.
          const { error: reconcileErr } = await supabase
            .from('payments')
            .update({
              status: 'created',
              failure_description:
                'Razorpay order creation outcome unknown - requires reconciliation',
              updated_at: new Date().toISOString(),
            })
            .eq('id', paymentRecord.id);

          if (reconcileErr) {
            console.error("Failed to record reconciliation state:", reconcileErr);
          }

          return new Response(JSON.stringify({ error: "Payment gateway temporary error. Please try again." }), {
            status: 502,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    } catch (netErr) {
      console.error("Razorpay network failure:", netErr);

      // Keep payment attempt as created and order as pending_payment for reconciliation (ambiguous timeout)
      const { error: timeoutErr } = await supabase.from('payments').update({
        status: 'created',
        failure_description: 'Razorpay order creation outcome unknown (network timeout) - requires reconciliation',
        updated_at: new Date().toISOString(),
      }).eq('id', paymentRecord.id);

      if (timeoutErr) {
        console.error("Failed to record network timeout reconciliation state:", timeoutErr);
      }

      return new Response(JSON.stringify({ error: "Payment gateway network error. Please try again." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 8. LINK RAZORPAY ORDER ID TO THE EXISTING PAYMENT ATTEMPT WITH STRICT VALIDATION
    const { data: linkedPayment, error: linkErr } = await supabase
      .from('payments')
      .update({
        razorpay_order_id: razorpayOrder.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentRecord.id)
      .select('id, razorpay_order_id')
      .maybeSingle();

    if (linkErr || !linkedPayment || linkedPayment.razorpay_order_id !== razorpayOrder.id) {
      console.error("Failed to link Razorpay order ID:", linkErr);

      const { error: linkFailErr } = await supabase.from('payments').update({
        status: 'created',
        failure_description: 'Failed to link Razorpay order ID - requires reconciliation',
        updated_at: new Date().toISOString(),
      }).eq('id', paymentRecord.id);

      if (linkFailErr) {
        console.error("Failed to update payment failure description:", linkFailErr);
      }

      return new Response(JSON.stringify({ error: "Unable to initialize payment. Please contact support if your payment was affected." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      checkoutId: order.id,
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

  } catch (err: any) {
    console.error("Error in place-order edge function:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
