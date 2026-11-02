const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function testRPC() {
  console.log('--- TESTING ATOMIC CONVERSION RPC ACCESS PERMISSIONS ---');

  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/convert_checkout_to_order`, {
    method: 'POST',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      p_checkout_id: '00000000-0000-0000-0000-000000000000',
      p_payment_id: '00000000-0000-0000-0000-000000000000'
    })
  });

  console.log('Public RPC Invocation HTTP Status (Expect 401 / 403 Forbidden):', res.status);
  const data = await res.json();
  console.log('Response Body:', data);
}

testRPC();
