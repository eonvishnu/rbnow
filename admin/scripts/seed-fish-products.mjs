const supabaseUrl = 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
const anonKey = 'sb_publishable_9l2rycX2witb2v5UY-UNAA_mj6qT6Dn';

async function seedFishProducts() {
  console.log('--- 1. FETCHING FISHES CATEGORY FROM SUPABASE ---');

  const catRes = await fetch(`${supabaseUrl}/rest/v1/categories?name=ilike.*fish*&select=id,name`, {
    headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
  });
  const categories = await catRes.json();
  console.log('Found Category:', categories);

  const fishCatId = categories?.[0]?.id || null;
  const fishCatName = categories?.[0]?.name || 'Fishes';

  console.log('\n--- 2. SEEDING FRESH FISH PRODUCTS ---');

  const fishProducts = [
    {
      name: 'Katla Fish - Gada (5kg & Above) Cut & Cleaned',
      description: 'Fresh large Katla fish cut into curry pieces. Tender, flavorful, and rich in omega-3.',
      category_id: fishCatId,
      category_name: fishCatName,
      image_url: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80',
      is_available: true,
      variants: [
        { unit: '250g', price: 99, stock: 50 },
        { unit: '500g', price: 189, stock: 40 },
        { unit: '1 kg', price: 360, stock: 25 },
      ]
    },
    {
      name: 'Rohu Fish - Bengali Steak Cut',
      description: 'Authentic freshwater Rohu fish cut into classic Bengali steaks. Freshly cleaned and ready to cook.',
      category_id: fishCatId,
      category_name: fishCatName,
      image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
      is_available: true,
      variants: [
        { unit: '500g', price: 175, stock: 35 },
        { unit: '1 kg', price: 340, stock: 30 },
      ]
    },
    {
      name: 'Padma Hilsa (Ilish) Fish - Whole / Cut',
      description: 'Premium Padma River Hilsa fish with rich, authentic oil and delicate texture. A royal Bengali delicacy.',
      category_id: fishCatId,
      category_name: fishCatName,
      image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
      is_available: true,
      variants: [
        { unit: '500g', price: 650, stock: 15 },
        { unit: '1 kg', price: 1250, stock: 10 },
      ]
    },
    {
      name: 'Fresh Jumbo Tiger Prawns (Cleaned & Deveined)',
      description: 'Juicy jumbo tiger prawns, peeled, deveined, and ready for Malai Curry or Butter Garlic fry.',
      category_id: fishCatId,
      category_name: fishCatName,
      image_url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80',
      is_available: true,
      variants: [
        { unit: '250g', price: 280, stock: 30 },
        { unit: '500g', price: 540, stock: 20 },
      ]
    },
    {
      name: 'Kolkata Bhetki Fish Fillet (Boneless)',
      description: 'Boneless, skinless premium Kolkata Bhetki fillets. Perfect for Fish Fry, Paturi, or Fish Fingers.',
      category_id: fishCatId,
      category_name: fishCatName,
      image_url: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80',
      is_available: true,
      variants: [
        { unit: '250g', price: 320, stock: 25 },
        { unit: '500g', price: 620, stock: 15 },
      ]
    }
  ];

  for (const item of fishProducts) {
    const { variants, ...prodData } = item;
    const pRes = await fetch(`${supabaseUrl}/rest/v1/products`, {
      method: 'POST',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(prodData)
    });

    const pData = await pRes.json();
    console.log('Inserted Product status:', pRes.status, pData);

    if (Array.isArray(pData) && pData[0]?.id) {
      const prodId = pData[0].id;
      const variantPayload = variants.map(v => ({
        product_id: prodId,
        unit: v.unit,
        price: v.price,
        stock: v.stock
      }));

      const vRes = await fetch(`${supabaseUrl}/rest/v1/product_variants`, {
        method: 'POST',
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(variantPayload)
      });

      console.log(`  -> Inserted ${variants.length} variants for ${prodData.name}: status`, vRes.status);
    }
  }
}

seedFishProducts();
