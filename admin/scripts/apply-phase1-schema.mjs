import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function checkOrdersColumns() {
  const res = await fetch(`${supabaseUrl}/rest/v1/orders?select=*&limit=1`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  console.log('Orders columns test:', await res.json());
}

checkOrdersColumns();
