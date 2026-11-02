const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function checkBuckets() {
  const res = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  console.log('Supabase Storage Buckets:', await res.json());
}

checkBuckets();
