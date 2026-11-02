const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function checkStatuses() {
  const res = await fetch(`${supabaseUrl}/rest/v1/payments?select=status&limit=100`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  const data = await res.json();
  const statuses = [...new Set(data.map(p => p.status))];
  console.log('Distinct status values in public.payments:', statuses);
}

checkStatuses();
