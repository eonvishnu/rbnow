const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function checkAndSanitize() {
  console.log('Querying payment_gateway_credentials table...');

  // 1. SELECT ALL ROWS
  const selRes = await fetch(`${supabaseUrl}/rest/v1/payment_gateway_credentials?select=*`, {
    method: 'GET',
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json'
    }
  });

  const selData = await selRes.json();
  console.log('Existing payment_gateway_credentials rows:', selData);

  // 2. UPDATE ALL ROWS TO NULL OUT SECRET_KEY AND WEBHOOK_SECRET
  if (Array.isArray(selData) && selData.length > 0) {
    const updRes = await fetch(`${supabaseUrl}/rest/v1/payment_gateway_credentials?id=neq.00000000-0000-0000-0000-000000000000`, {
      method: 'PATCH',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        secret_key: null,
        webhook_secret: null,
        updated_at: new Date().toISOString()
      })
    });

    const updData = await updRes.json();
    console.log('Updated sanitized rows:', updData);
  }
}

checkAndSanitize();
