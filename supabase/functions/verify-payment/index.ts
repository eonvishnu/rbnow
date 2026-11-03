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

    // 2. FETCH CHECKOUT SESSION SNAPSHOT (Stage 1)
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

    // 3. IDEMPOTENCY CHECK: If checkout already converted to order, return existing order
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

    // 4. FETCH OR UPDATE PAYMENT RECORD (Stage 2)
    let { data: paymentRecord } = await supabase
      .from('payments')
      .select('*')
      .eq('checkout_id', checkout.id)
      .eq('razorpay_order_id', razorpay_order_id)
      .maybeSingle();

    if (!paymentRecord) {
      const { data: newPay } = await supabase.from('payments').insert({
        checkout_id: checkout.id,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount: checkout.grand_total,
        currency: 'INR',
        status: 'captured',
      }).select().single();
      paymentRecord = newPay;
    } else {
      await supabase.from('payments').update({
        razorpay_payment_id,
        razorpay_signature,
        status: 'captured',
        updated_at: new Date().toISOString(),
      }).eq('id', paymentRecord.id);
    }

    // 5. ATOMIC CONVERSION TO CONFIRMED ORDER (Stage 3 via PostgreSQL RPC Procedure)
    const { data: convResult, error: convErr } = await supabase.rpc('convert_checkout_to_order', {
      p_checkout_id: checkout.id,
      p_payment_id: paymentRecord?.id,
    });

    if (convErr) {
      console.error("Atomic Conversion RPC Error:", convErr);
      throw convErr;
    }

    console.log("Atomic Conversion Result:", convResult);

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
