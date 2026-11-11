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
      return new Response(JSON.stringify({ error: "Server configuration missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
    const webhookSignature = req.headers.get("x-razorpay-signature") || "";
    const rawBody = await req.text();

    if (!webhookSecret || !webhookSignature) {
      return new Response(JSON.stringify({ error: "Webhook verification is not configured." }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. MANDATORY HMAC SIGNATURE VERIFICATION
    const isValid = await verifyHmacSha256(webhookSecret, rawBody, webhookSignature);
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid webhook signature" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    const razorpayOrderId = paymentEntity?.order_id;
    const razorpayPaymentId = paymentEntity?.id;
    const eventId = payload.event_id || payload.contains?.[0] || `${event}_${razorpayPaymentId}_${Date.now()}`;

    // 2. EVENT DEDUPLICATION GUARD (webhook_events)
    const { data: existingEvent } = await supabase
      .from('webhook_events')
      .select('id')
      .eq('event_id', eventId)
      .maybeSingle();

    if (existingEvent) {
      return new Response(JSON.stringify({ success: true, message: "Webhook event already processed." }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Record webhook event in audit ledger
    try {
      await supabase.from('webhook_events').insert({
        event_id: eventId,
        event_type: event,
        payload: payload,
      });
    } catch (e) {
      console.warn("Event record notice:", e);
    }

    // 3. PROCESS CAPTURED PAYMENT
    if (event === "payment.captured" || event === "order.paid") {
      if (!razorpayOrderId || !razorpayPaymentId) {
        return new Response(JSON.stringify({ error: "Missing required Razorpay payment or order ID." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Resolve exact pre-created payment record using razorpay_order_id
      const { data: payRecord } = await supabase
        .from('payments')
        .select('*')
        .eq('razorpay_order_id', razorpayOrderId)
        .maybeSingle();

      if (!payRecord) {
        return new Response(JSON.stringify({ error: `No stored payment record found for Razorpay Order ID "${razorpayOrderId}".` }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Resolve linked checkout session
      const { data: checkout } = await supabase
        .from('checkouts')
        .select('*')
        .eq('id', payRecord.checkout_id)
        .maybeSingle();

      if (!checkout) {
        return new Response(JSON.stringify({ error: `Checkout session for payment record "${payRecord.id}" not found.` }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify amount & currency matching
      const expectedAmountPaise = Math.round(Number(checkout.grand_total) * 100);
      if (paymentEntity.amount !== expectedAmountPaise || paymentEntity.currency !== "INR") {
        return new Response(JSON.stringify({ error: `Webhook payment amount mismatch. Expected ₹${checkout.grand_total}, received ₹${paymentEntity.amount / 100}` }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Mark payment captured and record Razorpay payment ID
      await supabase
        .from('payments')
        .update({
          razorpay_payment_id: razorpayPaymentId,
          status: 'captured',
          updated_at: new Date().toISOString(),
        })
        .eq('id', payRecord.id);

      // Execute atomic order conversion RPC
      const { data: convResult, error: convErr } = await supabase.rpc('convert_checkout_to_order', {
        p_checkout_id: checkout.id,
        p_payment_id: payRecord.id,
      });

      if (convErr || (convResult && !convResult.success)) {
        console.error("Webhook Order Conversion Error:", convErr || convResult?.error);
        return new Response(JSON.stringify({ error: convErr?.message || convResult?.error || "Order conversion failed." }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({
        success: true,
        orderId: convResult?.order_id,
        orderNumber: convResult?.order_number,
        alreadyConverted: convResult?.already_converted || false,
      }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, event }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return new Response(JSON.stringify({ error: err.message || "Webhook processing failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
