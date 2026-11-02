const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function testCategoryHierarchy() {
  console.log('--- TESTING SELF-REFERENTIAL CATEGORY HIERARCHY ---');

  const res = await fetch(`${supabaseUrl}/rest/v1/categories?select=id,name,parent_id,is_active`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });

  const categories = await res.json();
  console.log('Categories in DB:', categories);
}

testCategoryHierarchy();
