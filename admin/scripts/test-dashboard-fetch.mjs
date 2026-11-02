const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function testDashboardFetch() {
  console.log('--- TESTING DASHBOARD FUNNEL & ORDERS FETCH ---');

  const [ordersRes, checkoutsRes, cartsRes] = await Promise.all([
    fetch(`${supabaseUrl}/rest/v1/orders?select=id,order_number,total,status,order_source,created_at,customer_name,customer_phone,delivery_address,order_items(quantity)&limit=5`, {
      headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
    }),
    fetch(`${supabaseUrl}/rest/v1/checkouts?select=id,status&limit=5`, {
      headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
    }),
    fetch(`${supabaseUrl}/rest/v1/carts?select=id,status&limit=5`, {
      headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
    })
  ]);

  console.log('Orders status:', ordersRes.status);
  console.log('Checkouts status:', checkoutsRes.status);
  console.log('Carts status:', cartsRes.status);
}

testDashboardFetch();
