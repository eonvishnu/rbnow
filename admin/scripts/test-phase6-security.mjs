const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function runSecurityTests() {
  console.log('====================================================');
  console.log('PHASE 6 TEST 1: SECURITY ISOLATION & RLS POLICIES');
  console.log('====================================================');

  let passedCount = 0;
  let failedCount = 0;

  // 1. Anonymous Insert Checkouts
  const res1 = await fetch(`${supabaseUrl}/rest/v1/checkouts`, {
    method: 'POST',
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_name: 'Attacker', customer_phone: '9999999999', delivery_address: {}, subtotal: 100, grand_total: 100 })
  });

  if (res1.status === 401) {
    console.log('✅ PASS 1. Anonymous Checkouts Insert Blocked (HTTP 401 RLS Violation)');
    passedCount++;
  } else {
    console.error('❌ FAIL 1. Anonymous Checkouts Insert Allowed! Status:', res1.status);
    failedCount++;
  }

  // 2. Anonymous Insert Orders
  const res2 = await fetch(`${supabaseUrl}/rest/v1/orders`, {
    method: 'POST',
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_name: 'Attacker', customer_phone: '9999999999', delivery_address: {}, subtotal: 100, total: 100 })
  });

  if (res2.status === 401) {
    console.log('✅ PASS 2. Anonymous Orders Insert Blocked (HTTP 401 RLS Violation)');
    passedCount++;
  } else {
    console.error('❌ FAIL 2. Anonymous Orders Insert Allowed! Status:', res2.status);
    failedCount++;
  }

  // 3. Anonymous Invoke Conversion RPC
  const res3 = await fetch(`${supabaseUrl}/rest/v1/rpc/convert_checkout_to_order`, {
    method: 'POST',
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_checkout_id: '00000000-0000-0000-0000-000000000000', p_payment_id: '00000000-0000-0000-0000-000000000000' })
  });

  if (res3.status === 401) {
    console.log('✅ PASS 3. Public RPC Execution Blocked (HTTP 401 Permission Denied)');
    passedCount++;
  } else {
    console.error('❌ FAIL 3. Public RPC Execution Allowed! Status:', res3.status);
    failedCount++;
  }

  // 4. Anonymous Read Webhook Ledger
  const res4 = await fetch(`${supabaseUrl}/rest/v1/payment_webhook_events?select=id&limit=1`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  const webhooksData = await res4.json();

  if (res4.status === 200 && Array.isArray(webhooksData) && webhooksData.length === 0) {
    console.log('✅ PASS 4. Anonymous Webhook Ledger Read Protected (HTTP 200 [] Empty Array)');
    passedCount++;
  } else {
    console.error('❌ FAIL 4. Anonymous Webhook Ledger Exposed! Status:', res4.status, webhooksData);
    failedCount++;
  }

  console.log(`\nSecurity Test Summary: ${passedCount} PASSED, ${failedCount} FAILED\n`);
}

runSecurityTests();
