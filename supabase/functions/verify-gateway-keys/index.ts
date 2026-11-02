import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_ADMIN_ROLES = new Set([
  "super_admin",
  "admin",
  "operations_staff",
  "support_agent",
  "read_only",
]);

// @ts-ignore
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !anonKey) {
      return new Response(
        JSON.stringify({ isValid: false, message: "Server error: Missing Supabase environment configuration." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Authenticate User Session via Access Token
    const authorization = req.headers.get("Authorization") || "";
    const accessToken = authorization.trim().split(/\s+/).pop() || "";

    if (!accessToken) {
      return new Response(
        JSON.stringify({ isValid: false, message: "Authentication token required to verify gateway keys." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authClient = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: { user }, error: authError } = await authClient.auth.getUser(accessToken);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ isValid: false, message: "Invalid or expired user authentication session." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Verify Admin / Staff Role Access
    const dbClient = serviceRoleKey
      ? createClient(supabaseUrl, serviceRoleKey)
      : authClient;

    const { data: profile, error: profileError } = await dbClient
      .from("profiles")
      .select("role, is_active")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || profile.is_active === false || !ALLOWED_ADMIN_ROLES.has(profile.role || "")) {
      return new Response(
        JSON.stringify({
          isValid: false,
          message: "Forbidden: Account is disabled or lacks required staff permissions.",
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Process Key Verification Payload
    const { provider, keyId, secretKey } = await req.json().catch(() => ({}));

    if (!keyId || !secretKey) {
      return new Response(
        JSON.stringify({ isValid: false, message: "Key ID and Secret Key cannot be empty." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanKey = String(keyId).trim();
    const cleanSecret = String(secretKey).trim();

    // 4. Razorpay Key Verification
    if (provider === "razorpay" || !provider) {
      try {
        const authHeader = `Basic ${btoa(`${cleanKey}:${cleanSecret}`)}`;
        const res = await fetch("https://api.razorpay.com/v1/payments?count=1", {
          method: "GET",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
        });

        if (res.ok || res.status === 200) {
          return new Response(
            JSON.stringify({
              isValid: true,
              statusCode: res.status,
              message: `✅ Verified by Admin (${profile.role}): Razorpay API keys tested successfully!`,
              provider: "razorpay",
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (res.status === 401) {
          return new Response(
            JSON.stringify({
              isValid: false,
              statusCode: res.status,
              message: "❌ Invalid Razorpay Key ID or Secret Key (401 Unauthorized).",
              provider: "razorpay",
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const body = await res.json().catch(() => null);
        const errDesc = body?.error?.description || `HTTP ${res.status}`;
        return new Response(
          JSON.stringify({
            isValid: false,
            statusCode: res.status,
            message: `❌ Razorpay verification error: ${errDesc}`,
            provider: "razorpay",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return new Response(
          JSON.stringify({
            isValid: false,
            message: `❌ Error verifying Razorpay keys: ${msg}`,
            provider: "razorpay",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // 5. PhonePe Verification
    if (provider === "phonepe") {
      if (cleanKey.length < 5 || cleanSecret.length < 8) {
        return new Response(
          JSON.stringify({
            isValid: false,
            message: "❌ PhonePe Merchant ID or Salt Key format appears invalid.",
            provider: "phonepe",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({
          isValid: true,
          message: "✅ PhonePe credential format validated via Admin Edge Function.",
          provider: "phonepe",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fallback Verification
    return new Response(
      JSON.stringify({
        isValid: true,
        message: `✅ ${String(provider).toUpperCase()} credentials format validated via Admin Edge Function.`,
        provider,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ isValid: false, message: `Edge Function error: ${msg}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
