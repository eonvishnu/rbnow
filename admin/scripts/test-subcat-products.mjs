const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function testSubcatProducts() {
  console.log('--- TESTING SUBCATEGORY PRODUCTS QUERY ---');

  // 1. Fetch categories tree
  const catRes = await fetch(`${supabaseUrl}/rest/v1/categories?select=id,name,parent_id`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  const categories = await catRes.json();
  console.log('Categories:', categories);

  // 2. Fetch products
  const prodRes = await fetch(`${supabaseUrl}/rest/v1/products?select=id,name,category_id,category_name`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  const products = await prodRes.json();
  console.log('Products:', products);
}

testSubcatProducts();
