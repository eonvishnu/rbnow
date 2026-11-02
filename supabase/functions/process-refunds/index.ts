import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    if (!razorpayKeyId || !razorpayKeySecret) {
      return new Response(JSON.stringify({ error: "Server configuration missing: RAZORPAY_KEY_SECRET" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // 1. SELECT PENDING REFUNDS TO PROCESS
    const { data: pendingRefunds, error: fetchErr } = await supabase
      .from("refunds")
      .select("*")
      .eq("status", "pending")
      .lt("attempt_count", 5)
      .order("created_at", { ascending: true })
      .limit(10);

    if (fetchErr) {
      throw fetchErr;
    }

    if (!pendingRefunds || pendingRefunds.length === 0) {
      return new Response(JSON.stringify({ success: true, processedCount: 0, message: "No pending refund jobs to process." }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results = [];
    const authHeader = `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`;

    // 2. PROCESS EACH PENDING REFUND JOB WITH IDEMPOTENT HEADER
    for (const refund of pendingRefunds) {
      const amountPaise = Math.round(Number(refund.amount) * 100);

      try {
        // Increment attempt count
        await supabase
          .from("refunds")
          .update({ attempt_count: refund.attempt_count + 1, updated_at: new Date().toISOString() })
          .eq("id", refund.id);

        // Call Razorpay Refund API with X-Refund-Idempotency header
        const rzpRes = await fetch(`https://api.razorpay.com/v1/payments/${refund.razorpay_payment_id}/refund`, {
          method: "POST",
          headers: {
            "Authorization": authHeader,
            "Content-Type": "application/json",
            "X-Refund-Idempotency": refund.idempotency_key,
          },
          body: JSON.stringify({
            amount: amountPaise,
            notes: {
              reason: refund.reason,
              refund_id: refund.id,
              checkout_id: refund.checkout_id || '',
            },
          }),
        });

        const rzpData = await rzpRes.json();

        if (rzpRes.ok && rzpData.id) {
          // Refund Success!
          await supabase
            .from("refunds")
            .update({
              status: "processed",
              razorpay_refund_id: rzpData.id,
              processed_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", refund.id);

          // Log in reconciliation events
          await supabase.from("payment_reconciliation_events").insert({
            payment_id: refund.payment_id,
            checkout_id: refund.checkout_id,
            event_type: "refund_processed",
            notes: `Successfully processed Razorpay refund ${rzpData.id} for ₹${refund.amount}`,
            payload: rzpData,
          });

          results.push({ id: refund.id, success: true, razorpayRefundId: rzpData.id });
        } else if (rzpRes.status === 409) {
          // 409 Conflict: Idempotency Key existing refund
          console.warn(`Razorpay 409 Conflict for refund ${refund.id}. Reconciling...`);

          await supabase
            .from("refunds")
            .update({
              status: "submitted",
              error_details: rzpData,
              updated_at: new Date().toISOString(),
            })
            .eq("id", refund.id);

          results.push({ id: refund.id, success: true, message: "Refund request submitted and awaiting confirmation." });
        } else {
          // Refund Failed
          await supabase
            .from("refunds")
            .update({
              status: refund.attempt_count >= 4 ? "failed" : "pending",
              error_details: rzpData,
              updated_at: new Date().toISOString(),
            })
            .eq("id", refund.id);

          await supabase.from("payment_reconciliation_events").insert({
            payment_id: refund.payment_id,
            checkout_id: refund.checkout_id,
            event_type: "refund_failed",
            notes: `Razorpay refund failed: ${rzpData?.error?.description || 'API Error'}`,
            payload: rzpData,
          });

          results.push({ id: refund.id, success: false, error: rzpData });
        }
      } catch (err: any) {
        console.error(`Error processing refund ${refund.id}:`, err);
        results.push({ id: refund.id, success: false, error: err.message });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      processedCount: results.length,
      results,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in process-refunds edge function:", error);
    return new Response(JSON.stringify({ error: error.message || "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
