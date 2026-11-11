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

    if (event === "payment.captured" || event === "order.paid") {
      if (razorpayOrderId && paymentEntity?.status === "captured" && paymentEntity?.currency === "INR" && Number.isInteger(paymentEntity?.amount)) {
        // Find corresponding checkout in Supabase
        const { data: checkout } = await supabase
          .from("checkouts")
          .select("id, grand_total, status")
          .eq("status", "pending_payment")
          .single();

        if (checkout) {
          const expectedAmountPaise = Math.round(Number(checkout.grand_total) * 100);
          if (paymentEntity.amount !== expectedAmountPaise || !razorpayPaymentId) {
            return new Response(JSON.stringify({ error: "Webhook payment does not match the order amount." }), {
              status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }

          // Fetch payment record
          const { data: paymentRecord } = await supabase
            .from('payments')
            .select('id')
            .eq('checkout_id', checkout.id)
            .eq('razorpay_order_id', razorpayOrderId)
            .maybeSingle();

          if (paymentRecord) {
            await supabase.rpc('convert_checkout_to_order', {
              p_checkout_id: checkout.id,
              p_payment_id: paymentRecord.id,
            });
          }
        }
      }
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
