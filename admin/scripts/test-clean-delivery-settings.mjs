const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function testCleanDeliverySettings() {
  console.log('--- 1. FETCHING CLEAN DELIVERY SETTINGS ---');
  const res = await fetch(`${supabaseUrl}/rest/v1/delivery_settings?id=eq.default`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  const data = await res.json();
  console.log('Clean Delivery Settings in Supabase DB:', data);
}

testCleanDeliverySettings();
