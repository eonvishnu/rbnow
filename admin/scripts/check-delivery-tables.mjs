const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function checkDeliveryTables() {
  console.log('--- 1. INSPECTING public.delivery_settings ---');
  const res1 = await fetch(`${supabaseUrl}/rest/v1/delivery_settings?select=*`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  console.log('delivery_settings:', await res1.json());

  console.log('\n--- 2. INSPECTING public.delivery_fee_rules ---');
  const res2 = await fetch(`${supabaseUrl}/rest/v1/delivery_fee_rules?select=*&order=priority.asc`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  console.log('delivery_fee_rules:', await res2.json());
}

checkDeliveryTables();
