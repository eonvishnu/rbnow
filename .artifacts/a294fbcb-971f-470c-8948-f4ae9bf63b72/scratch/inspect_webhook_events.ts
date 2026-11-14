import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://xsdkpbvvbjzvchlsdizi.supabase.co";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function main() {
  const { data, error } = await supabase.rpc('claim_webhook_event', {
    p_event_id: 'inspect_test_' + Date.now(),
    p_event_type: 'test.inspect',
    p_payload: { inspect: true }
  });
  console.log("Inspection RPC result:", { data, error });
}

main();
