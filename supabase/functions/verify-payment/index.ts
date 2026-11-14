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
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !serviceRoleKey || !anonKey) {
      return new Response(JSON.stringify({ error: "Server configuration missing." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. STRICT BEARER TOKEN AUTHENTICATION
    const authorization = req.headers.get("Authorization") || "";
    const bearerMatch = authorization.match(/^Bearer\s+(\S+)$/i);

    if (!bearerMatch) {
      return new Response(JSON.stringify({ error: "Authentication token required." }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const accessToken = bearerMatch[1];
    const authClient = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: { user }, error: userErr } = await authClient.auth.getUser(accessToken);
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Invalid or expired authentication token." }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const verifiedUserId = user.id;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Fail-safe credential resolution
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
      return new Response(JSON.stringify({ error: "Server configuration error." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (activeGw) {
      if (!activeGw.key_id || !activeGw.secret_key) {
        return new Response(JSON.stringify({ error: "Active payment gateway has incomplete credentials." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      razorpayKeyId = activeGw.key_id;
      razorpayKeySecret = activeGw.secret_key;
    } else {
      razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID") || "";
      razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET") || "";
    }

    if (!razorpayKeyId || !razorpayKeySecret) {
      return new Response(JSON.stringify({ error: "Razorpay configuration is missing." }), {
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

    // STRICT FORMAT VALIDATION FOR RAZORPAY IDS & SIGNATURE
    if (
      typeof razorpay_order_id !== "string" ||
      !/^order_[A-Za-z0-9]+$/.test(razorpay_order_id) ||
      typeof razorpay_payment_id !== "string" ||
      !/^pay_[A-Za-z0-9]+$/.test(razorpay_payment_id) ||
      typeof razorpay_signature !== "string" ||
      !/^[a-fA-F0-9]{64}$/.test(razorpay_signature)
    ) {
      return new Response(JSON.stringify({ error: "Invalid Razorpay payment details." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // MANDATORY SIGNATURE VERIFICATION
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const isValidSignature = await verifyHmacSha256(razorpayKeySecret, payload, razorpay_signature);
    if (!isValidSignature) {
      return new Response(JSON.stringify({ error: "Invalid payment signature. Verification failed." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // AUTHORITATIVE ORDER LOOKUP (Enforcing user_id ownership)
    const targetOrderId = checkoutId || checkoutSessionId;
    let order = null;

    if (targetOrderId) {
      const { data: oData, error: oErr } = await supabase
        .from('orders')
        .select('id, user_id, order_number, total, status, payment_status, razorpay_payment_id, fulfillment_exception')
        .eq('id', targetOrderId)
        .eq('user_id', verifiedUserId)
        .maybeSingle();

      if (oErr) {
        console.error("Order lookup error:", oErr);
        return new Response(JSON.stringify({ error: "Server error: Database query failed." }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!oData) {
        const { data: anyOrder } = await supabase
          .from('orders')
          .select('id, user_id')
          .eq('id', targetOrderId)
          .maybeSingle();

        if (anyOrder && anyOrder.user_id !== verifiedUserId) {
          return new Response(JSON.stringify({ error: "Access denied. Order belongs to another user." }), {
            status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ error: `Order for ID "${targetOrderId}" not found.` }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // 3. HANDLE payCheck DATABASE QUERY ERROR
      const { data: payCheck, error: payCheckErr } = await supabase
        .from('payments')
        .select('razorpay_order_id')
        .eq('order_id', oData.id)
        .eq('razorpay_order_id', razorpay_order_id)
        .maybeSingle();

      if (payCheckErr) {
        console.error("Payment check error:", payCheckErr);
        return new Response(JSON.stringify({ error: "Server error: Database query failed." }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!payCheck) {
        return new Response(JSON.stringify({ error: "Razorpay order ID is not linked to this order." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      order = oData;
    } else {
      const { data: payRec, error: payRecErr } = await supabase
        .from('payments')
        .select('order_id')
        .eq('razorpay_order_id', razorpay_order_id)
        .maybeSingle();

      if (payRecErr) {
        console.error("Payment lookup error:", payRecErr);
        return new Response(JSON.stringify({ error: "Server error: Database query failed." }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (payRec?.order_id) {
        const { data: oData, error: oErr2 } = await supabase
          .from('orders')
          .select('id, user_id, order_number, total, status, payment_status, razorpay_payment_id, fulfillment_exception')
          .eq('id', payRec.order_id)
          .eq('user_id', verifiedUserId)
          .maybeSingle();

        if (oErr2) {
          console.error("Order lookup error:", oErr2);
          return new Response(JSON.stringify({ error: "Server error: Database query failed." }), {
            status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (!oData) {
          const { data: anyOrder } = await supabase
            .from('orders')
            .select('id, user_id')
            .eq('id', payRec.order_id)
            .maybeSingle();

          if (anyOrder && anyOrder.user_id !== verifiedUserId) {
            return new Response(JSON.stringify({ error: "Access denied. Order belongs to another user." }), {
              status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }

        order = oData;
      }
    }

    if (!order) {
      return new Response(JSON.stringify({ error: `Order for Razorpay Order ID "${razorpay_order_id}" not found.` }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // FETCH PAYMENT RECORD WITH STRICT VALIDATION
    const { data: paymentRecord, error: payErr } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', order.id)
      .eq('razorpay_order_id', razorpay_order_id)
      .maybeSingle();

    if (payErr) {
      console.error("Payment record lookup error:", payErr);
      return new Response(JSON.stringify({ error: "Server error: Database query failed." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!paymentRecord) {
      return new Response(JSON.stringify({ error: "Razorpay order ID is not linked to this order." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const expectedAmountPaise = Number(paymentRecord.amount);
    if (!Number.isSafeInteger(expectedAmountPaise) || expectedAmountPaise <= 0) {
      return new Response(JSON.stringify({ error: "Invalid payment amount stored for this order." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DIRECT RAZORPAY API PAYMENT VERIFICATION
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

    // CONFIRM ORDER & DEDUCT INVENTORY (via atomic confirm_order_payment RPC)
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
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
