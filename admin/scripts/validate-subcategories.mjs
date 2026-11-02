const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function checkSubcategories() {
  console.log('--- FETCHING ALL CATEGORIES AND SUBCATEGORIES FROM SUPABASE ---');
  const res = await fetch(`${supabaseUrl}/rest/v1/categories?select=id,name,parent_id&order=name.asc`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  const categories = await res.json();
  console.log('All Categories & Subcategories:', JSON.stringify(categories, null, 2));
}

checkSubcategories();
