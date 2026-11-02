const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function testInsert() {
  // Test inserting checkout with anonKey (Will fail under RLS unless Edge Function with service_role is used)
  const res = await fetch(`${supabaseUrl}/rest/v1/checkouts`, {
    method: 'POST',
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
    body: JSON.stringify({
      customer_name: 'Test Customer',
      customer_phone: '9999999999',
      delivery_address: {},
      subtotal: 100,
      grand_total: 100,
    })
  });

  console.log('Checkout insert status:', res.status, await res.json());
}

testInsert();
