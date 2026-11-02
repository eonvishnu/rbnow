const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function testPhase5() {
  console.log('--- TESTING PHASE 5 TABLES & EDGE FUNCTION ---');

  const refundsRes = await fetch(`${supabaseUrl}/rest/v1/refunds?select=id,status&limit=1`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  console.log('1. Refunds Table Status:', refundsRes.status);

  const reconRes = await fetch(`${supabaseUrl}/rest/v1/payment_reconciliation_events?select=id,event_type&limit=1`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  console.log('2. Reconciliation Events Table Status:', reconRes.status);
}

testPhase5();
