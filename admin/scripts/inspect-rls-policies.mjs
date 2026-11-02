const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function inspectPublicAccess() {
  console.log('--- TESTING ANONYMOUS / UNLESS RLS ACCESS ---');

  // Test 1: Try reading orders anonymously
  const ordersRes = await fetch(`${supabaseUrl}/rest/v1/orders?select=id&limit=1`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  console.log('Anon Orders Read HTTP Status:', ordersRes.status, await ordersRes.json());

  // Test 2: Try inserting into orders anonymously (Must fail or be blocked by RLS)
  const insertOrdersRes = await fetch(`${supabaseUrl}/rest/v1/orders`, {
    method: 'POST',
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ total: 100, customer_name: 'Hacker', customer_phone: '9999999999', delivery_address: {} })
  });
  console.log('Anon Orders Insert Status (Expect 401/403):', insertOrdersRes.status, await insertOrdersRes.json());
}

inspectPublicAccess();
