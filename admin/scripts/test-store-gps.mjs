const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function testStoreGpsQuery() {
  console.log('--- TESTING FIXED STORE GPS SELECT QUERY ---');

  const res = await fetch(`${supabaseUrl}/rest/v1/store_settings?select=store_latitude,store_longitude&id=eq.default`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });

  console.log('HTTP Status Code:', res.status);
  const data = await res.json();
  console.log('Store GPS Data:', data);
}

testStoreGpsQuery();
