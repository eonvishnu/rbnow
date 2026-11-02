const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function testProductsQuery() {
  console.log('--- TESTING FIXED PRODUCTS SELECT QUERY ---');

  const res = await fetch(`${supabaseUrl}/rest/v1/products?select=id,name,description,category_name,category_id,image_url,is_available,product_variants(id,product_id,unit,price,original_price,stock,is_available)&is_available=eq.true`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });

  console.log('HTTP Status Code:', res.status);
  const data = await res.json();
  console.log('Products Count:', Array.isArray(data) ? data.length : 0);
  console.log('Sample Product:', Array.isArray(data) ? data[0] : data);
}

testProductsQuery();
