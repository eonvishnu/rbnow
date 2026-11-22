import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { JWT } from "npm:google-auth-library@9";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function getAccessToken(serviceAccount: { client_email: string; private_key: string; project_id: string }) {
  const client = new JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
  });
  const res = await client.authorize();
  return { accessToken: res.access_token, projectId: serviceAccount.project_id };
}

// @ts-ignore
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const serviceAccountJson = Deno.env.get("FIREBASE_SERVICE_ACCOUNT");

    if (!serviceAccountJson) {
      return new Response(JSON.stringify({ error: "FIREBASE_SERVICE_ACCOUNT secret is not configured in Supabase." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceAccount = JSON.parse(serviceAccountJson);
    const { accessToken, projectId } = await getAccessToken(serviceAccount);

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { title, body, userId, imageUrl, route } = await req.json();

    if (!title || !body) {
      return new Response(JSON.stringify({ error: "Title and body are required." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let query = supabase.from("device_tokens").select("token");
    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data: tokens, error: tokenErr } = await query;
    if (tokenErr) throw tokenErr;

    const deviceTokens = (tokens || []).map((t: any) => t.token).filter(Boolean);

    if (deviceTokens.length === 0) {
      return new Response(JSON.stringify({ success: true, sentCount: 0, message: "No device tokens found." }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let successCount = 0;
    const fcmUrl = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;

    for (const token of deviceTokens) {
      const message = {
        message: {
          token: token,
          notification: {
            title: title,
            body: body,
            ...(imageUrl ? { image: imageUrl } : {}),
          },
          data: {
            route: route || "home",
          },
          android: {
            priority: "HIGH",
            notification: {
              sound: "default",
              ...(imageUrl ? { image: imageUrl } : {}),
            },
          },
          apns: {
            payload: {
              aps: {
                sound: "default",
                "mutable-content": 1,
              },
            },
            fcm_options: {
              ...(imageUrl ? { image: imageUrl } : {}),
            },
          },
        },
      };

      try {
        const fcmRes = await fetch(fcmUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        });

        if (fcmRes.ok) {
          successCount++;
        } else {
          const errBody = await fcmRes.text();
          console.error(`FCM send failed for token ${token.slice(0, 10)}...:`, errBody);
          if (fcmRes.status === 404 || fcmRes.status === 410 || errBody.includes("UNREGISTERED") || errBody.includes("INVALID_ARGUMENT")) {
            await supabase.from("device_tokens").delete().eq("token", token);
          }
        }
      } catch (err) {
        console.error(`FCM fetch error for token:`, err);
      }
    }

    return new Response(JSON.stringify({ success: true, sentCount: successCount, totalTokens: deviceTokens.length, message: "Notifications broadcasted successfully!" }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Error sending push notifications:", err);
    return new Response(JSON.stringify({ error: err.message || "Failed to send push notifications." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
