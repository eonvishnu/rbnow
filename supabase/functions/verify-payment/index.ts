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

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!razorpayKeyId || !razorpayKeySecret || !anonKey) {
      return new Response(JSON.stringify({ error: "Server configuration missing: RAZORPAY_KEY_SECRET" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authorization = req.headers.get("Authorization") || "";
    const accessToken = authorization.trim().split(/\s+/).pop() || "";
    const authClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: { user }, error: authError } = await authClient.auth.getUser(accessToken);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Sign in is required to verify this payment." }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartId,
      checkoutSessionId,
    } = body;

    // 1. MANDATORY SIGNATURE VERIFICATION (Strict Guard: Rejects missing or invalid signatures)
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

    // 2. FETCH PERSISTED PENDING ORDER FROM DATABASE (Never trust client-supplied totals)
    const { data: pendingOrder, error: fetchErr } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('razorpay_order_id', razorpay_order_id)
      .single();

    if (fetchErr || !pendingOrder) {
      return new Response(JSON.stringify({ error: `Pending order for Razorpay order ID "${razorpay_order_id}" not found.` }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (pendingOrder.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "This payment does not belong to the signed-in account." }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. IDEMPOTENCY CHECK: Return existing paid order if already processed
    if (pendingOrder.payment_status === 'paid') {
      return new Response(JSON.stringify({
        success: true,
        orderId: pendingOrder.id,
        orderNumber: pendingOrder.order_number,
        message: "Order already verified and paid."
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 4. VERIFY PAYMENT DIRECTLY WITH RAZORPAY SERVER-SIDE API
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
      const expectedAmountPaise = Math.round(Number(pendingOrder.total) * 100);
      if (rzpPay.status !== "captured" || rzpPay.currency !== "INR") {
        return new Response(JSON.stringify({ error: "Razorpay has not captured this INR payment." }), {
          status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

        if (rzpPay.order_id !== razorpay_order_id) {
          return new Response(JSON.stringify({ error: "Payment gateway order ID mismatch." }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        if (rzpPay.amount !== expectedAmountPaise) {
          return new Response(JSON.stringify({ error: `Payment amount mismatch. Expected ₹${pendingOrder.total}, received ₹${rzpPay.amount / 100}` }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
    } catch (rzpErr) {
      console.error("Razorpay API verification failed:", rzpErr);
      return new Response(JSON.stringify({ error: "Unable to verify payment with Razorpay." }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. ATOMIC DATABASE TRANSACTION (FOR UPDATE ROW LOCKING & ATOMIC STOCK DECREMENT)
    const { data: confirmResult, error: confirmErr } = await supabase
      .rpc('confirm_order_payment', {
        p_order_id: pendingOrder.id,
        p_razorpay_payment_id: razorpay_payment_id,
        p_payment_amount: pendingOrder.total,
      });

    if (confirmErr) throw confirmErr;
    if (!confirmResult?.success && !confirmResult?.stock_exception) {
      return new Response(JSON.stringify({ error: confirmResult?.error || "Payment confirmation failed." }), {
        status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (pendingOrder.coupon_id) {
      const { error: couponUseError } = await supabase.from('coupon_usages').insert({
        coupon_id: pendingOrder.coupon_id,
        user_id: pendingOrder.user_id,
        phone_number: pendingOrder.user_phone,
        browser_id: pendingOrder.browser_id,
        order_id: pendingOrder.id,
      });
      if (couponUseError) console.error("Coupon usage recording failed:", couponUseError);
    }

    // 6. Update only checkout records owned by this authenticated user.
    if (cartId) {
      await supabase.from('carts').update({ status: 'converted', updated_at: new Date().toISOString() })
        .eq('id', cartId).eq('user_id', user.id);
    }
    if (checkoutSessionId) {
      await supabase.from('checkout_sessions').update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', checkoutSessionId).eq('user_id', user.id);
    }

    return new Response(JSON.stringify({
      success: true,
      orderId: pendingOrder.id,
      orderNumber: pendingOrder.order_number,
      confirmResult,
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
