const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function inspectTableSchema() {
  console.log('Inspecting payment_gateways table schema...');

  const res = await fetch(`${supabaseUrl}/rest/v1/payment_gateways?select=*`, {
    method: 'GET',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json'
    }
  });

  if (res.ok) {
    const data = await res.json();
    console.log('✅ Query payment_gateways successful:', data);
  } else {
    console.error('Query error:', res.status, await res.text());
  }
}

inspectTableSchema();
