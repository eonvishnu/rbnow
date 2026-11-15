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

function deg2rad(deg: number) { return deg * (Math.PI / 180); }

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const isValidUuid = (value: unknown): value is string =>
  typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

const isValidCoordinateInput = (value: unknown): boolean =>
  (typeof value === "number" && Number.isFinite(value)) ||
  (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value)));

const isValidRazorpayOrderId = (value: unknown): value is string =>
  typeof value === "string" && /^order_[A-Za-z0-9]+$/.test(value);

// Shared server-side reconciliation routine used by both action: 'abandon' and checkoutId retry
async function reconcileOrderPayments(
  supabase: any,
  orderId: string,
  razorpayKeyId: string,
  razorpayKeySecret: string
): Promise<{ safeToProceed: boolean; error?: string }> {
  const { data: paymentsList, error: payFetchErr } = await supabase
    .from("payments")
    .select("*")
    .eq("order_id", orderId);

  if (payFetchErr) {
    return { safeToProceed: false, error: "Database error during payment reconciliation." };
  }

  if (!paymentsList || paymentsList.length === 0) {
    return { safeToProceed: true };
  }

  const authHeader = `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`;

  for (const pay of paymentsList) {
    if (pay.status === 'captured' || pay.status === 'authorized') {
      return { safeToProceed: false, error: "Order has active or captured payment attempts." };
    }

    if (pay.razorpay_order_id && isValidRazorpayOrderId(pay.razorpay_order_id)) {
      try {
        const rzpOrderRes = await fetch(`https://api.razorpay.com/v1/orders/${pay.razorpay_order_id}`, {
          method: "GET",
          headers: { Authorization: authHeader, "Content-Type": "application/json" },
        });

        if (!rzpOrderRes.ok) {
          return { safeToProceed: false, error: "Unable to verify payment gateway status. Please try again." };
        }

        const rzpOrdData = await rzpOrderRes.json();
        const rzpPaymentsRes = await fetch(`https://api.razorpay.com/v1/orders/${pay.razorpay_order_id}/payments`, {
          method: "GET",
          headers: { Authorization: authHeader, "Content-Type": "application/json" },
        });

        if (!rzpPaymentsRes.ok) {
          return { safeToProceed: false, error: "Unable to verify gateway payment transactions. Please try again." };
        }

        const rzpPayData = await rzpPaymentsRes.json();
        const rzpPaymentsList = rzpPayData.items || [];

        const allFailed = rzpPaymentsList.length > 0 && rzpPaymentsList.every((p: any) => p.status === 'failed');
        const zeroAttempts = rzpOrdData.attempts === 0 && rzpPaymentsList.length === 0;

        if (zeroAttempts || allFailed) {
          if (pay.status === 'created') {
            const { data: updatedPay, error: failUpdErr } = await supabase
              .from("payments")
              .update({ status: "failed", failure_description: "Reconciled as failed", updated_at: new Date().toISOString() })
              .eq("id", pay.id)
              .eq("status", "created")
              .select("id")
              .maybeSingle();

            if (failUpdErr || !updatedPay) {
              return { safeToProceed: false, error: "Failed to update reconciled payment state." };
            }
          }
        } else {
          return { safeToProceed: false, error: "Previous payment attempt has active gateway status. Cannot proceed." };
        }
      } catch (recErr) {
        return { safeToProceed: false, error: "Payment gateway communication error." };
      }
    }
  }

  return { safeToProceed: true };
}

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
      auth: { persistSession: false, autoRefreshToken: false },
    });

    let razorpayKeyId = "";
    let razorpayKeySecret = "";

    const { data: activeGw, error: gwErr } = await supabase
      .from("payment_gateways")
      .select("key_id")
      .eq("is_active", true)
      .eq("provider", "razorpay")
      .maybeSingle();

    if (gwErr) {
      console.error("Failed to fetch active payment gateway:", gwErr);
      return jsonResponse({ error: "Server configuration error." }, 500);
    }

    if (activeGw?.key_id) {
      razorpayKeyId = activeGw.key_id;
    } else {
      razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID") || "";
    }
    razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET") || "";

    if (!razorpayKeyId || !razorpayKeySecret) {
      return jsonResponse({ error: "Razorpay configuration is missing." }, 500);
    }

    const authorization = req.headers.get("Authorization") || "";
    const bearerMatch = authorization.match(/^Bearer\s+(\S+)$/i);

    if (!bearerMatch) {
      return jsonResponse({ error: "Please log in to place an order." }, 401);
    }

    const accessToken = bearerMatch[1];
    const authClient = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: { user }, error: userErr } = await authClient.auth.getUser(accessToken);
    if (userErr || !user) {
      return jsonResponse({ error: "Invalid or expired authentication token." }, 401);
    }

    const finalUserId = user.id;
    const body = await req.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonResponse({ error: "Invalid request body." }, 400);
    }

    const { items, details, couponCode, checkoutId, action } = body;

    if (checkoutId !== undefined && checkoutId !== null && !isValidUuid(checkoutId)) {
      return jsonResponse({ error: "Invalid checkout ID." }, 400);
    }

    // SERVER-SIDE ABANDON ACTION WITH SHARED RECONCILIATION
    if (action === 'abandon' && checkoutId && isValidUuid(checkoutId)) {
      const { data: existingOrder, error: exOrderErr } = await supabase
        .from("orders")
        .select("id, user_id, status, payment_status")
        .eq("id", checkoutId)
        .eq("user_id", finalUserId)
        .maybeSingle();

      if (exOrderErr || !existingOrder) {
        return jsonResponse({ error: "Pending order not found or unauthorized." }, 404);
      }

      if (existingOrder.status !== 'pending_payment' || existingOrder.payment_status !== 'pending') {
        return jsonResponse({ error: "Order cannot be abandoned in its current state." }, 400);
      }

      const recon = await reconcileOrderPayments(supabase, checkoutId, razorpayKeyId, razorpayKeySecret);
      if (!recon.safeToProceed) {
        return jsonResponse({ error: recon.error || "Cannot abandon order while payment attempts are active or unresolved." }, 400);
      }

      const { data: abResult, error: abErr } = await supabase.rpc('abandon_pending_order', {
        p_order_id: checkoutId,
        p_user_id: finalUserId,
      });

      if (abErr || !abResult?.success) {
        return jsonResponse({ error: abErr?.message || abResult?.error || "Failed to abandon pending order." }, 400);
      }
      return jsonResponse({ success: true, abandoned: true });
    }

    let order: any = null;
    let paymentRecordId = "";
    let amountInPaise = 0;
    let customerPhone = typeof details?.phone === "string" ? details.phone : "";
    let verifiedSubtotal = 0;
    let deliveryFee = 0;
    let discountAmount = 0;
    let orderTotal = 0;

    const isRetry = isValidUuid(checkoutId);

    const markPaymentFailedIfCreated = async (paymentId: string, desc: string) => {
      if (!isValidUuid(paymentId)) return;
      await supabase
        .from("payments")
        .update({ status: "failed", failure_description: desc, updated_at: new Date().toISOString() })
        .eq("id", paymentId)
        .eq("status", "created");
    };

    if (isRetry) {
      const recon = await reconcileOrderPayments(supabase, checkoutId, razorpayKeyId, razorpayKeySecret);
      if (!recon.safeToProceed) {
        return jsonResponse({ error: recon.error || "Order payment reconciliation failed." }, 400);
      }

      const { data: reservation, error: resErr } = await supabase.rpc("reserve_payment_attempt", {
        p_order_id: checkoutId,
        p_user_id: finalUserId,
      });

      if (resErr || !reservation?.success) {
        return jsonResponse({ error: reservation?.error || "Unable to reserve payment attempt for retry." }, 400);
      }

      paymentRecordId = reservation.payment_id;
      amountInPaise = Number(reservation.amount);

      const { data: existingOrder, error: existingOrderErr } = await supabase
        .from("orders")
        .select("*")
        .eq("id", checkoutId)
        .eq("user_id", finalUserId)
        .maybeSingle();

      if (existingOrderErr || !existingOrder) {
        await markPaymentFailedIfCreated(paymentRecordId, "Order lookup failed during retry initialization");
        return jsonResponse({ error: "Unable to retrieve your pending order. Please contact support." }, 500);
      }

      if (existingOrder.status !== "pending_payment" || existingOrder.payment_status !== "pending") {
        await markPaymentFailedIfCreated(paymentRecordId, "Order no longer eligible for payment after reservation");
        return jsonResponse({ error: "This order is no longer eligible for payment." }, 409);
      }

      if (existingOrder.currency && existingOrder.currency !== "INR") {
        await markPaymentFailedIfCreated(paymentRecordId, "Unsupported order currency during retry");
        return jsonResponse({ error: "Unsupported order currency." }, 400);
      }

      order = existingOrder;
      verifiedSubtotal = Number(order.subtotal);
      deliveryFee = Number(order.delivery_fee ?? 0);
      discountAmount = Number(order.discount ?? 0);
      orderTotal = Number(order.total);
      customerPhone = order.customer_phone || details?.phone || '';

      const expectedAmount = Math.round(orderTotal * 100);
      if (!Number.isFinite(orderTotal) || orderTotal <= 0 || !Number.isSafeInteger(expectedAmount) || expectedAmount !== amountInPaise) {
        await markPaymentFailedIfCreated(paymentRecordId, "Retry amount validation failed");
        return jsonResponse({ error: "Order amount validation failed. Please contact support." }, 409);
      }
    } else {
      // Normal order creation logic with cart validation, discount, delivery fee, and atomic create_pending_order RPC
      if (!Array.isArray(items) || items.length === 0) {
        return jsonResponse({ error: "Cart items are required." }, 400);
      }

      // [Cart items validation, stock check, coupon validation, delivery fee calculation...]
      // ...
      const subtotalAfterDiscount = Math.max(0, verifiedSubtotal - discountAmount);
      orderTotal = subtotalAfterDiscount + deliveryFee;
      amountInPaise = Math.round(orderTotal * 100);

      // Concurrency-safe new order creation using atomic create_pending_order RPC
      const { data: orderRes, error: orderRpcErr } = await supabase.rpc('create_pending_order', {
        p_user_id: finalUserId,
        p_customer_name: details?.name || "Customer",
        p_customer_phone: details?.phone || "",
        p_delivery_address: details || {},
        p_subtotal: verifiedSubtotal,
        p_delivery_fee: deliveryFee,
        p_discount: discountAmount,
        p_total: orderTotal,
      });

      if (orderRpcErr || !orderRes?.success) {
        return jsonResponse({ error: orderRpcErr?.message || orderRes?.error || "Failed to create pending order." }, 400);
      }
      order = orderRes.order;

      // Insert order items snapshot
      // ...
    }

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
        await supabase.from("orders").update({ status: "cancelled" }).eq("id", order.id).eq("status", "pending_payment");
        return jsonResponse({ error: "Unable to initialize payment. Please try again." }, 500);
      }
      paymentRecordId = paymentRecord.id;
    }

    const customReceiptId = `RB-${paymentRecordId.replace(/-/g, '')}`;

    // Razorpay order creation and linking logic ...
    // [Razorpay fetch, timeout handling, error preservation]

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
    return jsonResponse({ error: "Server error. Please try again." }, 500);
  }
});
