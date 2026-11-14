import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function calculateHmacSha256Hex(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyHmacSha256(secret: string, body: string, signature: string): Promise<boolean> {
  if (!signature || !secret || !body) return false;
  const expectedSignature = await calculateHmacSha256Hex(secret, body);
  return expectedSignature.toLowerCase() === signature.trim().toLowerCase();
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
    let razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    const { data: activeGw } = await supabase
      .from("payment_gateways")
      .select("key_id, secret_key")
      .eq("is_active", true)
      .eq("provider", "razorpay")
      .maybeSingle();

    if (activeGw?.key_id) {
      razorpayKeyId = activeGw.key_id;
    }
    if (activeGw?.secret_key) {
      razorpayKeySecret = activeGw.secret_key;
    }

    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!razorpayKeyId || !razorpayKeySecret || !anonKey) {
      return new Response(JSON.stringify({ error: "Server configuration missing: RAZORPAY_KEY_SECRET" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      checkoutId,
      checkoutSessionId,
    } = body;

    // 1. MANDATORY SIGNATURE VERIFICATION
    if (!razorpay_signature || !razorpay_order_id || !razorpay_payment_id) {
      return new Response(JSON.stringify({ error: "Missing required Razorpay payment signature or IDs" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const isValidSignature = await verifyHmacSha256(razorpayKeySecret, payload, razorpay_signature);
    if (!isValidSignature) {
      return new Response(JSON.stringify({ error: "Invalid payment signature. Verification failed." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. FETCH PENDING ORDER
    const targetOrderId = checkoutId || checkoutSessionId;
    let order = null;

    if (targetOrderId) {
      const { data: oData } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', targetOrderId)
        .maybeSingle();
      order = oData;
    }

    if (!order && razorpay_order_id) {
      const { data: payRec } = await supabase
        .from('payments')
        .select('order_id')
        .eq('razorpay_order_id', razorpay_order_id)
        .maybeSingle();

      if (payRec?.order_id) {
        const { data: oData } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('id', payRec.order_id)
          .maybeSingle();
        order = oData;
      }
    }

    if (!order) {
      return new Response(JSON.stringify({ error: `Order for Razorpay Order ID "${razorpay_order_id}" not found.` }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. FETCH PAYMENT RECORD
    const { data: paymentRecord } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', order.id)
      .eq('razorpay_order_id', razorpay_order_id)
      .maybeSingle();

    if (!paymentRecord) {
      return new Response(JSON.stringify({ error: "Razorpay order ID is not linked to this order." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 4. DIRECT RAZORPAY API PAYMENT VERIFICATION
    let expectedAmountPaise = Number(paymentRecord.amount);
    try {
      const authHeader = `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`;
      const rzpPayRes = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
        method: "GET",
        headers: { "Authorization": authHeader, "Content-Type": "application/json" },
      });

      if (!rzpPayRes.ok) {
        return new Response(JSON.stringify({ error: "Unable to verify payment with Razorpay." }), {
          status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const rzpPay = await rzpPayRes.json();
      if (
        rzpPay.id !== razorpay_payment_id ||
        rzpPay.order_id !== razorpay_order_id
      ) {
        return new Response(JSON.stringify({
          error: "Payment does not belong to this Razorpay order."
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const orderAmountPaise = Math.round(Number(order.total) * 100);

      if (
        !Number.isSafeInteger(expectedAmountPaise) ||
        expectedAmountPaise !== orderAmountPaise ||
        rzpPay.amount !== expectedAmountPaise
      ) {
        return new Response(JSON.stringify({
          error: "Payment amount mismatch."
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (rzpPay.status !== "captured" || rzpPay.currency !== "INR") {
        return new Response(JSON.stringify({ error: "Razorpay has not captured this INR payment." }), {
          status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch (rzpErr) {
      console.error("Razorpay API verification failed:", rzpErr);
      return new Response(JSON.stringify({ error: "Unable to verify payment with Razorpay." }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. CONFIRM ORDER & DEDUCT INVENTORY (via atomic confirm_order_payment RPC)
    const { data: confirmation, error: confirmationError } = await supabase.rpc('confirm_order_payment', {
      p_order_id: order.id,
      p_razorpay_order_id: razorpay_order_id,
      p_razorpay_payment_id: razorpay_payment_id,
      p_payment_amount: expectedAmountPaise,
    });

    if (confirmationError) {
      console.error("Order confirmation RPC failed:", confirmationError);
      return new Response(JSON.stringify({
        success: false,
        paymentCaptured: true,
        error: "Payment received, but order confirmation is pending. Please contact support if this persists."
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!confirmation?.success) {
      return new Response(JSON.stringify({
        success: false,
        paymentCaptured: true,
        stockException: confirmation?.stock_exception || false,
        error: confirmation?.error || "Order confirmation failed."
      }), {
        status: confirmation?.stock_exception ? 200 : 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      orderId: confirmation.order_id,
      orderNumber: confirmation.order_number
        ? `RB-${confirmation.order_number}`
        : null,
      message: "Payment verified and order confirmed successfully!"
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("Error in verify-payment edge function:", err);
    return new Response(JSON.stringify({ error: err.message || "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
