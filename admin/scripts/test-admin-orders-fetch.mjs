const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function testAdminOrdersFetch() {
  console.log('--- TESTING ADMIN ORDERS & PAYMENTS JOIN FETCH ---');

  const res = await fetch(`${supabaseUrl}/rest/v1/orders?select=*,order_items(*),payments(*)&order=created_at.desc`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });

  console.log('HTTP Status Code:', res.status);
  const data = await res.json();
  console.log('Orders Count:', Array.isArray(data) ? data.length : 0);
  console.log('Sample Order with Joined Payments:', Array.isArray(data) ? data[0] : data);
}

testAdminOrdersFetch();
