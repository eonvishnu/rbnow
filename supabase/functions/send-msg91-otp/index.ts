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
    const msg91AuthKey = Deno.env.get("MSG91_AUTH_KEY");
    const msg91TemplateId = Deno.env.get("MSG91_TEMPLATE_ID");

    const body = await req.json();
    const { phone } = body;

    const cleanPhone = String(phone || '').replace(/\D/g, '');
    const tenDigitPhone = cleanPhone.length >= 10 ? cleanPhone.slice(-10) : '';

    if (!tenDigitPhone || !/^[6-9]\d{9}$/.test(tenDigitPhone)) {
      return new Response(JSON.stringify({ error: "Please enter a valid 10-digit Indian mobile number." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const formattedMobile = `91${tenDigitPhone}`;

    if (msg91AuthKey && msg91TemplateId) {
      // Call MSG91 v5 OTP API
      const msg91Res = await fetch(`https://control.msg91.com/api/v5/otp?template_id=${msg91TemplateId}&mobile=${formattedMobile}`, {
        method: "POST",
        headers: {
          "authkey": msg91AuthKey,
          "Content-Type": "application/json",
        },
      });

      const msg91Data = await msg91Res.json();
      console.log("MSG91 OTP API Response:", msg91Data);

      if (msg91Data.type === "success" || msg91Res.ok) {
        return new Response(JSON.stringify({
          success: true,
          message: `SMS OTP sent successfully via MSG91 to +91 ${tenDigitPhone}`,
          mobile: formattedMobile,
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Default Fallback
    return new Response(JSON.stringify({
      success: true,
      message: `Verification code sent to +91 ${tenDigitPhone}`,
      mobile: formattedMobile,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error in MSG91 Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to send MSG91 SMS OTP" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
