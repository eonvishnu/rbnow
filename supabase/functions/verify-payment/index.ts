import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function calculateHmacSha256Hex(secret: string, body: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  return Array.from(new Uint8Array(signatureBuffer))
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

    // 2. FETCH CHECKOUT SESSION SNAPSHOT
    const targetCheckoutId = checkoutId || checkoutSessionId;
    let checkout = null;

    if (targetCheckoutId) {
      const { data: cData } = await supabase
        .from('checkouts')
        .select('*, checkout_items(*)')
        .eq('id', targetCheckoutId)
        .maybeSingle();
      checkout = cData;
    }

    if (!checkout && razorpay_order_id) {
      const { data: payRec } = await supabase
        .from('payments')
        .select('checkout_id')
        .eq('razorpay_order_id', razorpay_order_id)
        .maybeSingle();

      if (payRec?.checkout_id) {
        const { data: cData } = await supabase
          .from('checkouts')
          .select('*, checkout_items(*)')
          .eq('id', payRec.checkout_id)
          .maybeSingle();
        checkout = cData;
      }
    }

    if (!checkout) {
      return new Response(JSON.stringify({ error: `Checkout session for Razorpay Order ID "${razorpay_order_id}" not found.` }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. STRICT PAYMENT-TO-CHECKOUT BINDING CHECK:
    // Verify that 'payments' table ALREADY has a pre-created record linking checkout_id & razorpay_order_id
    const { data: paymentRecord } = await supabase
      .from('payments')
      .select('*')
      .eq('checkout_id', checkout.id)
      .eq('razorpay_order_id', razorpay_order_id)
      .maybeSingle();

    if (!paymentRecord) {
      return new Response(JSON.stringify({ error: "Razorpay order ID is not linked to this checkout session." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 4. IDEMPOTENCY CHECK: If checkout already converted to order, return existing order
    if (checkout.status === 'converted') {
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('*')
        .eq('checkout_id', checkout.id)
        .maybeSingle();

      return new Response(JSON.stringify({
        success: true,
        orderId: existingOrder?.id,
        orderNumber: existingOrder ? `RB-${existingOrder.order_number}` : 'RB-101',
        message: "Checkout already converted to order."
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. DIRECT RAZORPAY SERVER-TO-SERVER PAYMENT API VERIFICATION
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
      const expectedAmountPaise = Math.round(Number(checkout.grand_total) * 100);

      if (rzpPay.status !== "captured" || rzpPay.currency !== "INR") {
        return new Response(JSON.stringify({ error: "Razorpay has not captured this INR payment." }), {
          status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (rzpPay.order_id !== razorpay_order_id || rzpPay.order_id !== paymentRecord.razorpay_order_id) {
        return new Response(JSON.stringify({ error: "Payment gateway order ID mismatch." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      if (rzpPay.amount !== expectedAmountPaise) {
        return new Response(JSON.stringify({ error: `Payment amount mismatch. Expected ₹${checkout.grand_total}, received ₹${rzpPay.amount / 100}` }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    } catch (rzpErr) {
      console.error("Razorpay API verification failed:", rzpErr);
      return new Response(JSON.stringify({ error: "Unable to verify payment with Razorpay." }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update payment record to captured
    await supabase.from('payments').update({
      razorpay_payment_id,
      razorpay_signature,
      status: 'captured',
      updated_at: new Date().toISOString(),
    }).eq('id', paymentRecord.id);

    // 6. ATOMIC CONVERSION TO CONFIRMED ORDER (Stage 3 via PostgreSQL RPC Procedure)
    const { data: convResult, error: convErr } = await supabase.rpc('convert_checkout_to_order', {
      p_checkout_id: checkout.id,
      p_payment_id: paymentRecord.id,
    });

    if (convErr) {
      console.error("Atomic Conversion RPC Error:", convErr);
      throw convErr;
    }

    return new Response(JSON.stringify({
      success: true,
      orderId: convResult?.order_id,
      orderNumber: convResult?.order_number ? `RB-${convResult.order_number}` : 'RB-101',
      alreadyConverted: convResult?.already_converted || false,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error in verify-payment edge function:", error);
    return new Response(JSON.stringify({ error: error.message || "Payment verification failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
