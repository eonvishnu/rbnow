const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function checkOrdersColumns() {
  const res = await fetch(`${supabaseUrl}/rest/v1/orders?select=id,checkout_id,payment_id,customer_name,customer_phone&limit=1`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  console.log('Status:', res.status);
  console.log('Body:', await res.json());
}

checkOrdersColumns();
