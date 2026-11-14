import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STORE_LAT = 17.35145220439656;
const STORE_LNG = 78.39103902563603;
const RAZORPAY_TIMEOUT_MS = 20000;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const isValidUuid = (value: unknown): value is string =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

const isValidCoordinateInput = (value: unknown): boolean =>
  (typeof value === "number" && Number.isFinite(value)) ||
  (typeof value === "string" &&
    value.trim() !== "" &&
    Number.isFinite(Number(value)));

const isValidRazorpayOrderId = (value: unknown): value is string =>
  typeof value === "string" && /^order_[A-Za-z0-9]+$/.test(value);

// @ts-ignore
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !serviceRoleKey || !anonKey) {
      console.error("Missing Supabase environment configuration.");
      return jsonResponse({ error: "Server configuration missing." }, 500);
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // ---------------------------------------------------------
    // 1. RESOLVE RAZORPAY CREDENTIALS
    // ---------------------------------------------------------

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
      return jsonResponse({ error: "Server configuration error." }, 500);
    }

    if (activeGw) {
      if (
        typeof activeGw.key_id !== "string" ||
        !activeGw.key_id.trim() ||
        typeof activeGw.secret_key !== "string" ||
        !activeGw.secret_key.trim()
      ) {
        console.error("Active Razorpay gateway has incomplete credentials.");
        return jsonResponse(
          { error: "Active payment gateway has incomplete credentials." },
          500,
        );
      }

      razorpayKeyId = activeGw.key_id;
      razorpayKeySecret = activeGw.secret_key;
    } else {
      razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID") || "";
      razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET") || "";
    }

    if (!razorpayKeyId || !razorpayKeySecret) {
      return jsonResponse(
        { error: "Razorpay configuration is missing." },
        500,
      );
    }

    // ---------------------------------------------------------
    // 2. STRICT AUTHENTICATION
    // ---------------------------------------------------------

    const authorization = req.headers.get("Authorization") || "";
    const bearerMatch = authorization.match(/^Bearer\s+(\S+)$/i);

    if (!bearerMatch) {
      return jsonResponse(
        { error: "Please log in to place an order." },
        401,
      );
    }

    const accessToken = bearerMatch[1];

    const authClient = createClient(supabaseUrl, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const {
      data: { user },
      error: userErr,
    } = await authClient.auth.getUser(accessToken);

    if (userErr || !user) {
      return jsonResponse(
        { error: "Invalid or expired authentication token." },
        401,
      );
    }

    const finalUserId = user.id;

    // ---------------------------------------------------------
    // 3. VALIDATE REQUEST BODY
    // ---------------------------------------------------------

    const body = await req.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonResponse({ error: "Invalid request body." }, 400);
    }

    const { items, details, couponCode, checkoutId } = body;

    if (
      checkoutId !== undefined &&
      checkoutId !== null &&
      !isValidUuid(checkoutId)
    ) {
      return jsonResponse({ error: "Invalid checkout ID." }, 400);
    }

    if (
      details !== undefined &&
      details !== null &&
      (typeof details !== "object" || Array.isArray(details))
    ) {
      return jsonResponse({ error: "Invalid delivery details." }, 400);
    }

    if (
      couponCode !== undefined &&
      couponCode !== null &&
      (typeof couponCode !== "string" || couponCode.trim().length > 100)
    ) {
      return jsonResponse({ error: "Invalid coupon code." }, 400);
    }

    let order: any = null;
    let paymentRecordId = "";
    let amountInPaise = 0;
    let customerPhone =
      typeof details?.phone === "string" ? details.phone : "";

    let verifiedSubtotal = 0;
    let deliveryFee = 0;
    let discountAmount = 0;
    let orderTotal = 0;

    const isRetry = isValidUuid(checkoutId);

    // Helper to safely fail an uncontacted or pre-Razorpay payment attempt (only if still 'created')
    const markPaymentFailedIfCreated = async (paymentId: string, desc: string) => {
      if (!isValidUuid(paymentId)) return;
      await supabase
        .from("payments")
        .update({
          status: "failed",
          failure_description: desc,
          updated_at: new Date().toISOString(),
        })
        .eq("id", paymentId)
        .eq("status", "created");
    };

    // ---------------------------------------------------------
    // 4. RETRY EXISTING PENDING ORDER
    // ---------------------------------------------------------

    if (isRetry) {
      const { data: reservation, error: resErr } = await supabase.rpc(
        "reserve_payment_attempt",
        {
          p_order_id: checkoutId,
          p_user_id: finalUserId,
        },
      );

      if (resErr) {
        console.error("Reserve payment attempt RPC error:", resErr);
        return jsonResponse(
          { error: "Unable to reserve a payment attempt. Please try again." },
          500,
        );
      }

      if (!reservation || reservation.success !== true) {
        return jsonResponse(
          {
            error:
              reservation?.error ||
              "Unable to retry payment for this order.",
          },
          400,
        );
      }

      if (
        !isValidUuid(reservation.payment_id) ||
        !Number.isSafeInteger(Number(reservation.amount)) ||
        Number(reservation.amount) <= 0
      ) {
        console.error("Invalid reserve_payment_attempt response:", reservation);
        return jsonResponse(
          { error: "Invalid payment reservation response." },
          500,
        );
      }

      paymentRecordId = reservation.payment_id;
      amountInPaise = Number(reservation.amount);

      const { data: existingOrder, error: existingOrderErr } = await supabase
        .from("orders")
        .select(
          "id, user_id, status, payment_status, currency, customer_phone, subtotal, delivery_fee, discount, total",
        )
        .eq("id", checkoutId)
        .eq("user_id", finalUserId)
        .maybeSingle();

      if (existingOrderErr || !existingOrder) {
        console.error("Retry order lookup failed:", existingOrderErr);
        await markPaymentFailedIfCreated(paymentRecordId, "Order lookup failed during retry initialization");
        return jsonResponse(
          {
            error:
              "Unable to retrieve your pending order. Please contact support.",
          },
          500,
        );
      }

      if (
        existingOrder.status !== "pending_payment" ||
        existingOrder.payment_status !== "pending"
      ) {
        console.error("Order state changed after payment reservation.");
        await markPaymentFailedIfCreated(paymentRecordId, "Order no longer eligible for payment after reservation");
        return jsonResponse(
          { error: "This order is no longer eligible for payment." },
          409,
        );
      }

      if (
        existingOrder.currency &&
        existingOrder.currency !== "INR"
      ) {
        await markPaymentFailedIfCreated(paymentRecordId, "Unsupported order currency during retry");
        return jsonResponse(
          { error: "Unsupported order currency." },
          400,
        );
      }

      order = existingOrder;

      verifiedSubtotal = Number(order.subtotal);
      deliveryFee = Number(order.delivery_fee ?? 0);
      discountAmount = Number(order.discount ?? 0);
      orderTotal = Number(order.total);

      customerPhone =
        order.customer_phone ||
        customerPhone;

      const expectedAmount = Math.round(orderTotal * 100);

      if (
        !Number.isFinite(orderTotal) ||
        orderTotal <= 0 ||
        !Number.isSafeInteger(expectedAmount) ||
        expectedAmount !== amountInPaise
      ) {
        console.error("Retry amount does not match persisted order amount.", {
          orderTotal,
          expectedAmount,
          reservedAmount: amountInPaise,
        });

        await markPaymentFailedIfCreated(paymentRecordId, "Retry amount validation failed");
        return jsonResponse(
          { error: "Order amount validation failed. Please contact support." },
          409,
        );
      }
    } else {
      // -------------------------------------------------------
      // 5. VALIDATE NEW CART
      // -------------------------------------------------------

      if (!Array.isArray(items) || items.length === 0) {
        return jsonResponse({ error: "Cart items are required." }, 400);
      }

      if (items.length > 100) {
        return jsonResponse(
          { error: "Too many items in the cart." },
          400,
        );
      }

      // Temporary duplicate-submission guard.
      const { data: recentOrders, error: recentErr } = await supabase
        .from("orders")
        .select("id, created_at")
        .eq("user_id", finalUserId)
        .eq("status", "pending_payment")
        .gte(
          "created_at",
          new Date(Date.now() - 30000).toISOString(),
        )
        .limit(1);

      if (recentErr) {
        console.error("Recent orders check failed:", recentErr);
        return jsonResponse(
          { error: "Unable to verify existing checkout. Please try again." },
          500,
        );
      }

      if (recentOrders && recentOrders.length > 0) {
        return jsonResponse(
          {
            error:
              "A checkout request is already in progress. Please wait a moment or retry your existing order.",
          },
          429,
        );
      }

      // -------------------------------------------------------
      // 6. FETCH ACTIVE DISCOUNTS
      // -------------------------------------------------------

      const { data: activeDiscounts, error: discErr } = await supabase
        .from("discounts")
        .select("*, discount_variants(*)")
        .eq("is_active", true);

      if (discErr) {
        console.error("Discounts fetch error:", discErr);
        return jsonResponse(
          { error: "Unable to verify product discounts." },
          500,
        );
      }

      // -------------------------------------------------------
      // 7. VALIDATE AND AGGREGATE VARIANT QUANTITIES
      // -------------------------------------------------------

      const aggregatedQuantities: Record<string, number> = {};

      for (const item of items) {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          return jsonResponse(
            { error: "Invalid cart item format." },
            400,
          );
        }

        const rawQty =
          item.qty !== undefined ? item.qty : item.quantity;

        const rawQtyStr =
          rawQty !== undefined && rawQty !== null
            ? String(rawQty)
            : "";

        if (!/^\d+$/.test(rawQtyStr)) {
          return jsonResponse(
            {
              error: `Quantity for item "${item.name || "product"}" must be a positive integer.`,
            },
            400,
          );
        }

        const qty = Number(rawQtyStr);

        if (!Number.isSafeInteger(qty) || qty < 1 || qty > 50) {
          return jsonResponse(
            {
              error: `Quantity for item "${item.name || "product"}" must be between 1 and 50.`,
            },
            400,
          );
        }

        const variantId = item.variant_id;

        if (!isValidUuid(variantId)) {
          return jsonResponse(
            {
              error: `Please select a valid variant for "${item.name || "product"}".`,
            },
            400,
          );
        }

        const aggregatedQty =
          (aggregatedQuantities[variantId] || 0) + qty;

        if (aggregatedQty > 50) {
          return jsonResponse(
            { error: "Maximum order quantity for a variant is 50." },
            400,
          );
        }

        aggregatedQuantities[variantId] = aggregatedQty;
      }

      // -------------------------------------------------------
      // 8. VERIFY VARIANTS, STOCK AND DATABASE PRICES
      // -------------------------------------------------------

      verifiedSubtotal = 0;
      const verifiedItems: any[] = [];

      for (const [variantId, totalQty] of Object.entries(
        aggregatedQuantities,
      )) {
        const { data: variant, error: variantErr } = await supabase
          .from("product_variants")
          .select("*, products(*)")
          .eq("id", variantId)
          .maybeSingle();

        if (variantErr) {
          console.error("Variant lookup failed:", variantErr);
          return jsonResponse(
            {
              error:
                "Unable to verify product availability. Please try again.",
            },
            500,
          );
        }

        if (!variant || !variant.products) {
          return jsonResponse(
            {
              error:
                "The selected product variant no longer exists. Please refresh your cart.",
            },
            400,
          );
        }

        const availableStock =
          variant.stock !== null && variant.stock !== undefined
            ? Number(variant.stock)
            : NaN;

        if (
          variant.is_available !== true ||
          !Number.isFinite(availableStock) ||
          availableStock < totalQty
        ) {
          const itemName = variant.products.name;

          const errMsg =
            availableStock === 0
              ? `Item "${itemName}" (${variant.unit}) is out of stock.`
              : `Only ${availableStock} left in stock for "${itemName}" (${variant.unit}). Please update your quantity.`;

          return jsonResponse({ error: errMsg }, 400);
        }

        const rawPrice = Number(variant.price);

        if (!Number.isFinite(rawPrice) || rawPrice < 0) {
          console.error("Invalid variant price:", variant.id, variant.price);
          return jsonResponse(
            { error: "Invalid product pricing configuration." },
            500,
          );
        }

        let variantDiscountPercent = 0;

        for (const disc of activeDiscounts || []) {
          const isLinked = disc.discount_variants?.some(
            (dv: any) => dv.variant_id === variant.id,
          );

          if (!isLinked) continue;

          const discVal = Number(disc.discount_value);

          if (!Number.isFinite(discVal) || discVal < 0) {
            continue;
          }

          if (disc.discount_type === "percentage") {
            const validPct = Math.min(100, Math.max(0, discVal));

            variantDiscountPercent = Math.max(
              variantDiscountPercent,
              validPct,
            );
          } else {
            const percentEquiv =
              rawPrice > 0
                ? Math.min(100, Math.round((discVal / rawPrice) * 100))
                : discVal > 0
                  ? 100
                  : 0;

            variantDiscountPercent = Math.max(
              variantDiscountPercent,
              percentEquiv,
            );
          }
        }

        if (
          !Number.isFinite(variantDiscountPercent) ||
          variantDiscountPercent < 0 ||
          variantDiscountPercent > 100
        ) {
          return jsonResponse(
            { error: "Invalid product discount configuration." },
            500,
          );
        }

        const itemPrice =
          variantDiscountPercent > 0
            ? Math.round(rawPrice * (1 - variantDiscountPercent / 100))
            : rawPrice;

        const itemSubtotal = itemPrice * totalQty;

        if (
          !Number.isFinite(itemSubtotal) ||
          !Number.isSafeInteger(Math.round(itemSubtotal * 100))
        ) {
          return jsonResponse(
            { error: "Invalid product price calculation." },
            500,
          );
        }

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

      if (
        !Number.isFinite(verifiedSubtotal) ||
        verifiedSubtotal <= 0
      ) {
        return jsonResponse(
          { error: "Invalid cart subtotal." },
          400,
        );
      }

      // -------------------------------------------------------
      // 9. VALIDATE COUPON
      // -------------------------------------------------------

      discountAmount = 0;

      const normalizedCouponCode =
        typeof couponCode === "string"
          ? couponCode.trim().toUpperCase()
          : "";

      if (normalizedCouponCode) {
        const { data: coupon, error: cErr } = await supabase
          .from("coupons")
          .select("*")
          .eq("code", normalizedCouponCode)
          .maybeSingle();

        if (cErr) {
          console.error("Coupon lookup error:", cErr);
          return jsonResponse(
            { error: "Unable to validate coupon. Please try again." },
            500,
          );
        }

        if (!coupon || !coupon.is_active) {
          return jsonResponse(
            {
              error: `Promo code "${normalizedCouponCode}" is invalid or inactive.`,
            },
            400,
          );
        }

        if (coupon.expiry_date) {
          const expiryDate = new Date(coupon.expiry_date);

          if (
            isNaN(expiryDate.getTime()) ||
            expiryDate < new Date()
          ) {
            return jsonResponse(
              { error: `Promo code "${coupon.code}" has expired.` },
              400,
            );
          }
        }

        const minOrderAmt = Number(coupon.min_order_amount || 0);

        if (
          !Number.isFinite(minOrderAmt) ||
          minOrderAmt < 0
        ) {
          return jsonResponse(
            { error: "Invalid coupon configuration." },
            500,
          );
        }

        if (verifiedSubtotal < minOrderAmt) {
          return jsonResponse(
            {
              error: `Minimum order subtotal of ₹${minOrderAmt} required for code "${coupon.code}".`,
            },
            400,
          );
        }

        if (coupon.is_first_order_only) {
          const {
            count: previousOrdersCount,
            error: oCountErr,
          } = await supabase
            .from("orders")
            .select("id", { count: "exact", head: true })
            .eq("user_id", finalUserId)
            .eq("payment_status", "paid");

          if (oCountErr) {
            console.error("Previous order lookup failed:", oCountErr);
            return jsonResponse(
              { error: "Unable to validate this coupon. Please try again." },
              500,
            );
          }

          if ((previousOrdersCount ?? 0) > 0) {
            return jsonResponse(
              {
                error: `Promo code "${coupon.code}" is valid for first-time customer orders only.`,
              },
              400,
            );
          }
        }

        const couponVal = Number(coupon.discount_value);

        if (
          !Number.isFinite(couponVal) ||
          couponVal < 0 ||
          (coupon.discount_type !== "percentage" &&
            coupon.discount_type !== "flat")
        ) {
          return jsonResponse(
            { error: "Invalid coupon configuration." },
            500,
          );
        }

        if (coupon.discount_type === "percentage") {
          if (couponVal > 100) {
            return jsonResponse(
              { error: "Invalid coupon configuration." },
              500,
            );
          }

          discountAmount = Math.floor(
            (verifiedSubtotal * couponVal) / 100,
          );

          if (
            coupon.max_discount_amount !== null &&
            coupon.max_discount_amount !== undefined
          ) {
            const maxDisc = Number(coupon.max_discount_amount);

            if (!Number.isFinite(maxDisc) || maxDisc < 0) {
              return jsonResponse(
                { error: "Invalid coupon configuration." },
                500,
              );
            }

            discountAmount = Math.min(discountAmount, maxDisc);
          }
        } else {
          discountAmount = Math.min(
            verifiedSubtotal,
            couponVal,
          );
        }
      }

      const subtotalAfterDiscount = Math.max(
        0,
        verifiedSubtotal - discountAmount,
      );

      // -------------------------------------------------------
      // 10. CALCULATE DELIVERY FEE & SERVICEABILITY CHECK
      // -------------------------------------------------------

      let calculatedDistanceKm = 0;

      const { data: delSet, error: delErr } = await supabase
        .from("delivery_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (delErr || !delSet) {
        console.error("Delivery settings fetch error:", delErr);
        return jsonResponse(
          { error: "Delivery settings are not configured." },
          500,
        );
      }

      const storeLat = Number(
        delSet.store_latitude ?? STORE_LAT,
      );

      const storeLng = Number(
        delSet.store_longitude ?? STORE_LNG,
      );

      if (
        !Number.isFinite(storeLat) ||
        !Number.isFinite(storeLng) ||
        storeLat < -90 ||
        storeLat > 90 ||
        storeLng < -180 ||
        storeLng > 180
      ) {
        console.error("Invalid store coordinates.");
        return jsonResponse(
          { error: "Server configuration error: Invalid store location." },
          500,
        );
      }

      const pricingMode = delSet.delivery_mode || "rules";

      const requiresDistance =
        Boolean(delSet.is_free_delivery_enabled) &&
        pricingMode !== "always_free" &&
        pricingMode !== "flat_fee";

      if (requiresDistance || pricingMode === 'distance_based' || pricingMode === 'preset_rules') {
        const rawLat = details?.lat;
        const rawLng = details?.lng;

        if (
          !isValidCoordinateInput(rawLat) ||
          !isValidCoordinateInput(rawLng)
        ) {
          return jsonResponse(
            { error: "Valid delivery coordinates are required." },
            400,
          );
        }

        const lat = Number(rawLat);
        const lng = Number(rawLng);

        if (
          lat < -90 ||
          lat > 90 ||
          lng < -180 ||
          lng > 180
        ) {
          return jsonResponse(
            { error: "Invalid delivery coordinates provided." },
            400,
          );
        }

        calculatedDistanceKm = getDistanceFromLatLonInKm(
          storeLat,
          storeLng,
          lat,
          lng,
        );

        const maxDistanceKm = Number(delSet.max_delivery_distance_km ?? 15.00);
        if (Number.isFinite(maxDistanceKm) && maxDistanceKm > 0 && calculatedDistanceKm > maxDistanceKm) {
          return jsonResponse(
            { error: `Sorry, delivery is not available for your location (distance exceeds maximum radius of ${maxDistanceKm} km).` },
            400,
          );
        }
      }

      if (delSet.delivery_mode === "always_free") {
        deliveryFee = 0;
      } else if (
        !delSet.is_free_delivery_enabled ||
        delSet.delivery_mode === "flat_fee"
      ) {
        deliveryFee = Number(delSet.flat_delivery_fee ?? 65);
      } else if (delSet.delivery_mode === "preset_rules") {
        const radius = Number(
          delSet.preset_zone_radius_km ?? 5,
        );

        const isZone1 = calculatedDistanceKm <= radius;

        const targetSub = isZone1
          ? Number(delSet.preset_zone1_subtotal ?? 299)
          : Number(delSet.preset_zone2_subtotal ?? 499);

        const stdFee = isZone1
          ? Number(delSet.preset_zone1_fee ?? 30)
          : Number(delSet.preset_zone2_fee ?? 30);

        deliveryFee =
          subtotalAfterDiscount >= targetSub ? 0 : stdFee;
      } else {
        const t1Max = Number(delSet.tier1_max_km ?? 5);
        const t2Max = Number(delSet.tier2_max_km ?? 10);

        let targetSub = Number(
          delSet.tier1_subtotal ?? 299,
        );

        let stdFee = Number(
          delSet.tier1_fee ?? 30,
        );

        if (
          calculatedDistanceKm > t1Max &&
          calculatedDistanceKm <= t2Max
        ) {
          targetSub = Number(
            delSet.tier2_subtotal ?? 500,
          );

          stdFee = Number(
            delSet.tier2_fee ?? 30,
          );
        } else if (calculatedDistanceKm > t2Max) {
          targetSub = Number(
            delSet.tier3_subtotal ?? 699,
          );

          stdFee = Number(
            delSet.tier3_fee ?? 30,
          );
        }

        deliveryFee =
          subtotalAfterDiscount >= targetSub ? 0 : stdFee;
      }

      if (
        !Number.isFinite(deliveryFee) ||
        deliveryFee < 0
      ) {
        console.error("Invalid delivery fee:", deliveryFee);
        return jsonResponse(
          { error: "Invalid delivery fee configuration." },
          500,
        );
      }

      orderTotal = subtotalAfterDiscount + deliveryFee;
      amountInPaise = Math.round(orderTotal * 100);

      if (
        !Number.isFinite(orderTotal) ||
        !Number.isSafeInteger(amountInPaise) ||
        amountInPaise <= 0
      ) {
        return jsonResponse(
          { error: "Invalid order amount." },
          400,
        );
      }

      // -------------------------------------------------------
      // 11. CREATE PENDING ORDER
      // -------------------------------------------------------

      const { data: newOrder, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: finalUserId,
          customer_name: details?.name || "Customer",
          customer_phone: details?.phone || "",
          delivery_address: details || {},
          subtotal: verifiedSubtotal,
          delivery_fee: deliveryFee,
          discount: discountAmount,
          total: orderTotal,
          currency: "INR",
          payment_method: "razorpay",
          payment_status: "pending",
          status: "pending_payment",
        })
        .select(
          "id, user_id, status, payment_status, currency, customer_phone, subtotal, delivery_fee, discount, total",
        )
        .single();

      if (orderErr || !newOrder) {
        console.error("Order persistence failed:", orderErr);
        return jsonResponse(
          { error: "Failed to create pending order." },
          500,
        );
      }

      order = newOrder;

      // -------------------------------------------------------
      // 12. CREATE ORDER ITEM SNAPSHOTS
      // -------------------------------------------------------

      const orderItemsPayload = verifiedItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_name: item.product_name,
        variant_unit: item.variant_unit || "pack",
        product_image: item.product_image,
        price: item.price,
        quantity: item.quantity,
        total_price: item.total_price,
      }));

      const {
        error: itemsInsertErr,
      } = await supabase
        .from("order_items")
        .insert(orderItemsPayload);

      if (itemsInsertErr) {
        console.error("Order items insert error:", itemsInsertErr);

        const { error: cancelErr } = await supabase
          .from("orders")
          .update({ status: "cancelled" })
          .eq("id", order.id)
          .eq("user_id", finalUserId)
          .eq("status", "pending_payment");

        if (cancelErr) {
          console.error("Failed to cancel incomplete order:", cancelErr);
        }

        return jsonResponse(
          { error: "Unable to save order items. Please try again." },
          500,
        );
      }
    }

    // ---------------------------------------------------------
    // 13. CREATE OR REUSE INTERNAL PAYMENT ATTEMPT
    // ---------------------------------------------------------

    if (!isRetry) {
      const { data: paymentRecord, error: payErr } = await supabase
        .from("payments")
        .insert({
          order_id: order.id,
          amount: amountInPaise,
          currency: "INR",
          status: "created",
        })
        .select("id")
        .single();

      if (payErr || !paymentRecord) {
        console.error("Payment record creation failed:", payErr);

        const { error: cancelErr } = await supabase
          .from("orders")
          .update({ status: "cancelled" })
          .eq("id", order.id)
          .eq("status", "pending_payment");

        if (cancelErr) {
          console.error("Failed to cancel order:", cancelErr);
        }

        return jsonResponse(
          { error: "Unable to initialize payment. Please try again." },
          500,
        );
      }

      paymentRecordId = paymentRecord.id;
    }

    if (!isValidUuid(paymentRecordId)) {
      console.error("Invalid internal payment record ID.");
      return jsonResponse(
        { error: "Unable to initialize payment." },
        500,
      );
    }

    const customReceiptId =
      `RB-${paymentRecordId.replace(/-/g, "")}`;

    // ---------------------------------------------------------
    // 14. CREATE RAZORPAY ORDER
    // ---------------------------------------------------------

    let razorpayOrder: any;

    const controller = new AbortController();

    const timeoutId = setTimeout(
      () => controller.abort(),
      RAZORPAY_TIMEOUT_MS,
    );

    try {
      const authHeader =
        `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`;

      const razorpayRes = await fetch(
        "https://api.razorpay.com/v1/orders",
        {
          method: "POST",
          signal: controller.signal,
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: "INR",
            receipt: customReceiptId,
            notes: {
              store_name: "Royal Bengal",
              draft_order_id: customReceiptId,
              customer_phone: customerPhone,
              order_id: order.id,
              payment_attempt_id: paymentRecordId,
            },
          }),
        },
      );

      razorpayOrder = await razorpayRes.json();

      const hasValidId = isValidRazorpayOrderId(
        razorpayOrder?.id,
      );

      const validResponse =
        razorpayRes.ok &&
        hasValidId &&
        Number(razorpayOrder.amount) === amountInPaise &&
        razorpayOrder.currency === "INR";

      if (!validResponse) {
        console.error(
          "Razorpay order creation/validation failed:",
          {
            status: razorpayRes.status,
            response: razorpayOrder,
          },
        );

        // Preserve any valid gateway order ID, even if another
        // part of the response is invalid.
        if (hasValidId) {
          const { data: preservedPayment, error: preserveErr } =
            await supabase
              .from("payments")
              .update({
                razorpay_order_id: razorpayOrder.id,
                status: "created",
                failure_description:
                  "Razorpay response validation failed - requires reconciliation",
                updated_at: new Date().toISOString(),
              })
              .eq("id", paymentRecordId)
              .select("id, razorpay_order_id")
              .maybeSingle();

          if (
            preserveErr ||
            !preservedPayment ||
            preservedPayment.razorpay_order_id !== razorpayOrder.id
          ) {
            console.error(
              "Failed to preserve Razorpay order ID:",
              preserveErr,
            );
          }
        }

        // A definite 4xx rejection without a valid Razorpay order ID
        // is safe to mark failed. The order itself remains pending.
        if (
          razorpayRes.status >= 400 &&
          razorpayRes.status < 500 &&
          !hasValidId
        ) {
          const { error: failErr } = await supabase
            .from("payments")
            .update({
              status: "failed",
              failure_description:
                razorpayOrder?.error?.description ||
                "Razorpay rejected order creation",
              updated_at: new Date().toISOString(),
            })
            .eq("id", paymentRecordId);

          if (failErr) {
            console.error(
              "Failed to record Razorpay rejection:",
              failErr,
            );
          }
        } else {
          // 5xx, malformed 2xx, or any response containing a valid
          // but unexpected gateway order ID remains unresolved.
          const { error: reconcileErr } = await supabase
            .from("payments")
            .update({
              status: "created",
              failure_description:
                "Razorpay order creation outcome unknown - requires reconciliation",
              updated_at: new Date().toISOString(),
            })
            .eq("id", paymentRecordId);

          if (reconcileErr) {
            console.error(
              "Failed to record reconciliation state:",
              reconcileErr,
            );
          }
        }

        return jsonResponse(
          {
            error:
              "Unable to confirm payment gateway order creation. Please try again later or contact support.",
          },
          502,
        );
      }
    } catch (netErr) {
      console.error("Razorpay network/timeout failure:", netErr);

      // A timeout or network error is ambiguous. Razorpay may
      // have created the order even though we received no response.
      const { error: timeoutErr } = await supabase
        .from("payments")
        .update({
          status: "created",
          failure_description:
            "Razorpay order creation outcome unknown (network/timeout) - requires reconciliation",
          updated_at: new Date().toISOString(),
        })
        .eq("id", paymentRecordId);

      if (timeoutErr) {
        console.error(
          "Failed to record timeout reconciliation state:",
          timeoutErr,
        );
      }

      return jsonResponse(
        {
          error:
            "Payment gateway response could not be confirmed. Please contact support before retrying.",
        },
        502,
      );
    } finally {
      clearTimeout(timeoutId);
    }

    // ---------------------------------------------------------
    // 15. LINK RAZORPAY ORDER ID TO PAYMENT ATTEMPT
    // ---------------------------------------------------------

    const { data: linkedPayment, error: linkErr } = await supabase
      .from("payments")
      .update({
        razorpay_order_id: razorpayOrder.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", paymentRecordId)
      .select("id, razorpay_order_id")
      .maybeSingle();

    if (
      linkErr ||
      !linkedPayment ||
      linkedPayment.razorpay_order_id !== razorpayOrder.id
    ) {
      console.error("Failed to link Razorpay order ID:", linkErr);

      const { error: linkFailErr } = await supabase
        .from("payments")
        .update({
          status: "created",
          failure_description:
            "Failed to link Razorpay order ID - requires reconciliation",
          updated_at: new Date().toISOString(),
        })
        .eq("id", paymentRecordId);

      if (linkFailErr) {
        console.error(
          "Failed to record payment linking failure:",
          linkFailErr,
        );
      }

      return jsonResponse(
        {
          error:
            "Unable to initialize payment. Please contact support if your payment was affected.",
        },
        500,
      );
    }

    // ---------------------------------------------------------
    // 16. RETURN CHECKOUT DETAILS
    // ---------------------------------------------------------

    return jsonResponse({
      success: true,
      checkoutId: order.id,
      paymentId: paymentRecordId,
      keyId: razorpayKeyId,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      subtotal: Number(order.subtotal),
      deliveryFee: Number(order.delivery_fee ?? 0),
      discount: Number(order.discount ?? 0),
      total: Number(order.total),
    });
  } catch (err: any) {
    console.error("Error in place-order Edge Function:", err);

    return jsonResponse(
      { error: "Server error. Please try again." },
      500,
    );
  }
});
