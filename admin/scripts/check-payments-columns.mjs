const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function checkPaymentsCols() {
  const res = await fetch(`${supabaseUrl}/rest/v1/payments?select=*&limit=1`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  console.log('Status:', res.status, await res.json());
}

checkPaymentsCols();
