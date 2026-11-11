const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function testFetch() {
  console.log('--- TESTING SUPABASE PRODUCT & CATEGORY QUERIES ---');

  // 1. Fetch Categories
  const catRes = await fetch(`${supabaseUrl}/rest/v1/categories?select=*&order=name.asc`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  const cats = await catRes.json();
  console.log('Categories Count:', cats.length);
  console.log('Sample Category:', cats[0]);

  // 2. Fetch Products
  const prodRes = await fetch(`${supabaseUrl}/rest/v1/products?select=*,product_variants(*)&order=name.asc`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  const prods = await prodRes.json();
  console.log('Products Count:', prods.length);
  console.log('Sample Product:', prods[0]);
}

testFetch();
