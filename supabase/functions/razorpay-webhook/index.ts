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

function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function verifyHmacSha256(secret: string, body: string, signature: string): Promise<boolean> {
  if (!signature || !secret || !body) return false;
  try {
    const expectedSignature = await calculateHmacSha256Hex(secret, body);
    return constantTimeEquals(expectedSignature.toLowerCase(), signature.trim().toLowerCase());
  } catch {
    return false;
  }
}

// @ts-ignore
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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

    // 1. MANDATORY HMAC SIGNATURE VERIFICATION (Constant-time)
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
    const paymentAmount = paymentEntity?.amount;

    // Enforce official Razorpay x-razorpay-event-id header for deduplication
    const webhookEventId = req.headers.get("x-razorpay-event-id") || req.headers.get("X-Razorpay-Event-Id");

    if (!webhookEventId || webhookEventId.trim() === '') {
      return new Response(JSON.stringify({ error: "Missing required x-razorpay-event-id header for webhook event deduplication." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 2. ATOMIC EVENT CLAIMING GUARD VIA RPC (Returns fencing lease_token UUID or null)
    const { data: leaseToken, error: claimErr } = await supabase.rpc('claim_webhook_event', {
      p_event_id: webhookEventId,
      p_event_type: event,
      p_payload: payload,
    });

    if (claimErr) {
      console.error("Atomic event claim RPC error:", claimErr);
      return new Response(JSON.stringify({ error: "Database error during event claim." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!leaseToken) {
      return new Response(JSON.stringify({ success: true, message: "Webhook event already processed or locked." }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. PROCESS CAPTURED PAYMENT / ORDER PAID
    if (event === "payment.captured" || event === "order.paid") {
      if (!razorpayOrderId || !razorpayPaymentId || paymentAmount === undefined) {
        await supabase.from('webhook_events').update({ status: 'failed', error_message: "Missing Razorpay order/payment ID or amount" }).eq('event_id', webhookEventId).eq('lease_token', leaseToken);
        return new Response(JSON.stringify({ error: "Missing required Razorpay payment/order ID or amount." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Resolve exact pre-created payment record using razorpay_order_id with strict error check
      const { data: payRecord, error: payErr } = await supabase
        .from('payments')
        .select('*')
        .eq('razorpay_order_id', razorpayOrderId)
        .maybeSingle();

      if (payErr) {
        console.error("Payment lookup error:", payErr);
        await supabase.from('webhook_events').update({ status: 'failed', error_message: "Payment query failed" }).eq('event_id', webhookEventId).eq('lease_token', leaseToken);
        return new Response(JSON.stringify({ error: "Database query failed." }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!payRecord) {
        await supabase.from('webhook_events').update({ status: 'failed', error_message: "Payment record not found" }).eq('event_id', webhookEventId).eq('lease_token', leaseToken);
        return new Response(JSON.stringify({ error: `No stored payment record found for Razorpay Order ID "${razorpayOrderId}".` }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Resolve linked order with strict error check
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .select('*')
        .eq('id', payRecord.order_id)
        .maybeSingle();

      if (orderErr) {
        console.error("Order lookup error:", orderErr);
        await supabase.from('webhook_events').update({ status: 'failed', error_message: "Order query failed" }).eq('event_id', webhookEventId).eq('lease_token', leaseToken);
        return new Response(JSON.stringify({ error: "Database query failed." }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!order) {
        await supabase.from('webhook_events').update({ status: 'failed', error_message: "Order not found" }).eq('event_id', webhookEventId).eq('lease_token', leaseToken);
        return new Response(JSON.stringify({ error: `Order for payment record "${payRecord.id}" not found.` }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify amount & currency matching against stored payment record
      if (Number(paymentEntity.amount) !== Number(payRecord.amount) || paymentEntity.currency !== payRecord.currency) {
        await supabase.from('webhook_events').update({ status: 'failed', error_message: "Payment amount/currency mismatch" }).eq('event_id', webhookEventId).eq('lease_token', leaseToken);
        return new Response(JSON.stringify({ error: "Webhook payment amount or currency mismatch." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // AUTHORITATIVE STATE TRANSITION: Delegate entirely to confirm_order_payment RPC
      const { data: confirmation, error: confErr } = await supabase.rpc('confirm_order_payment', {
        p_order_id: order.id,
        p_razorpay_order_id: razorpayOrderId,
        p_razorpay_payment_id: razorpayPaymentId,
        p_payment_amount: Number(paymentEntity.amount),
      });

      if (confErr) {
        console.error("Webhook Order Confirmation Error:", confErr);
        await supabase.from('webhook_events').update({ status: 'failed', error_message: confErr.message }).eq('event_id', webhookEventId).eq('lease_token', leaseToken);
        return new Response(JSON.stringify({ error: confErr.message }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!confirmation || confirmation.success !== true) {
        const errorMsg = confirmation?.error || "Order confirmation failed.";
        const isStockException = confirmation?.stock_exception === true;
        const isDuplicatePayment = confirmation?.duplicate_payment === true;

        if (isStockException || isDuplicatePayment) {
          await supabase.from('webhook_events').update({ status: 'processed', error_message: errorMsg }).eq('event_id', webhookEventId).eq('lease_token', leaseToken);

          return new Response(JSON.stringify({
            success: false,
            stockException: isStockException,
            duplicatePayment: isDuplicatePayment,
            error: errorMsg,
          }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        await supabase.from('webhook_events').update({ status: 'failed', error_message: errorMsg }).eq('event_id', webhookEventId).eq('lease_token', leaseToken);

        return new Response(JSON.stringify({
          success: false,
          error: errorMsg,
        }), {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Mark webhook event successfully processed (Fenced by lease_token)
      const { error: ledgerUpdErr } = await supabase
        .from('webhook_events')
        .update({ status: 'processed', error_message: null })
        .eq('event_id', webhookEventId)
        .eq('lease_token', leaseToken);

      if (ledgerUpdErr) {
        console.error("Webhook ledger update failed (stale fencing token):", ledgerUpdErr);
      }

      return new Response(JSON.stringify({
        success: true,
        orderId: confirmation.order_id,
        orderNumber: confirmation.order_number,
        alreadyPaid: confirmation.already_paid || false,
      }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 4. PROCESS PAYMENT FAILED
    if (event === "payment.failed") {
      if (razorpayOrderId) {
        const { data: payRec, error: payErr } = await supabase
          .from('payments')
          .select('id, status')
          .eq('razorpay_order_id', razorpayOrderId)
          .maybeSingle();

        if (payErr) {
          console.error("Payment lookup error for failure event:", payErr);
          await supabase.from('webhook_events').update({ status: 'failed', error_message: "Payment lookup failed" }).eq('event_id', webhookEventId).eq('lease_token', leaseToken);
          return new Response(JSON.stringify({ error: "Database query failed." }), {
            status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (payRec && payRec.status === 'created') {
          const { error: failUpdErr } = await supabase
            .from('payments')
            .update({
              status: 'failed',
              failure_code: paymentEntity?.error_code,
              failure_description: paymentEntity?.error_description,
              updated_at: new Date().toISOString(),
            })
            .eq('id', payRec.id)
            .eq('status', 'created');

          if (failUpdErr) {
            console.error("Failed to update payment failure status:", failUpdErr);
            await supabase.from('webhook_events').update({ status: 'failed', error_message: "Payment update failed" }).eq('event_id', webhookEventId).eq('lease_token', leaseToken);
            return new Response(JSON.stringify({ error: "Database update failed." }), {
              status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }
      }

      const { error: failLedgerErr } = await supabase.from('webhook_events').update({ status: 'processed' }).eq('event_id', webhookEventId).eq('lease_token', leaseToken);
      if (failLedgerErr) {
        console.error("Failed to mark webhook event as processed:", failLedgerErr);
      }

      return new Response(JSON.stringify({ success: true, event: "payment.failed processed" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Default event acknowledgment (Fenced by lease_token)
    await supabase
      .from('webhook_events')
      .update({ status: 'processed' })
      .eq('event_id', webhookEventId)
      .eq('lease_token', leaseToken);

    return new Response(JSON.stringify({ success: true, event }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
