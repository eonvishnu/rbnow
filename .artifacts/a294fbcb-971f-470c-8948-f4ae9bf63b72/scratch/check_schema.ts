import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = process.env.SUPABASE_URL || "https://xsdkpbvvbjzvchlsdizi.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

const supabase = createClient("https://xsdkpbvvbjzvchlsdizi.supabase.co", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "");

async function main() {
  const { data, error } = await supabase.rpc('claim_webhook_event', {
    p_event_id: 'test_event_' + Date.now(),
    p_event_type: 'test.event',
    p_payload: { test: true }
  });
  console.log("Claim result:", data, error);
}

main();
