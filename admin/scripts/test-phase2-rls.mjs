const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function testPhase2RLS() {
  console.log('--- TESTING PHASE 2 RLS POLICIES SECURITY ---');

  // Test 1: Anonymous Read Checkouts (Expect empty array 200 or 401)
  const anonCheckouts = await fetch(`${supabaseUrl}/rest/v1/checkouts?select=id&limit=1`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  console.log('1. Anonymous Checkouts Read:', anonCheckouts.status, await anonCheckouts.json());

  // Test 2: Anonymous Insert Checkouts (Expect 401 Blocked)
  const anonInsertCheckouts = await fetch(`${supabaseUrl}/rest/v1/checkouts`, {
    method: 'POST',
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_name: 'Attacker', customer_phone: '9999999999', delivery_address: {}, subtotal: 100, grand_total: 100 })
  });
  console.log('2. Anonymous Checkouts Insert (Expect 401 Blocked):', anonInsertCheckouts.status, await anonInsertCheckouts.json());

  // Test 3: Anonymous Insert Orders (Expect 401 Blocked)
  const anonInsertOrders = await fetch(`${supabaseUrl}/rest/v1/orders`, {
    method: 'POST',
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_name: 'Attacker', customer_phone: '9999999999', delivery_address: {}, subtotal: 100, total: 100 })
  });
  console.log('3. Anonymous Orders Insert (Expect 401 Blocked):', anonInsertOrders.status, await anonInsertOrders.json());

  // Test 4: Anonymous Read Webhook Events (Expect empty array 200 or 401)
  const anonWebhooks = await fetch(`${supabaseUrl}/rest/v1/payment_webhook_events?select=id&limit=1`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  console.log('4. Anonymous Webhook Events Read:', anonWebhooks.status, await anonWebhooks.json());
}

testPhase2RLS();
