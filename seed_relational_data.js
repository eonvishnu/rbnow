const fs = require('fs');

const categories = [
  { name: 'Fresh Fish & Seafood', image_url: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', order_index: 1 },
  { name: 'Mutton & Poultry', image_url: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', order_index: 2 },
  { name: 'Bengali Groceries', image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', order_index: 3 },
  { name: 'Authentic Mishti & Sweets', image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', order_index: 4 },
  { name: 'Pickles & Kasundi', image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', order_index: 5 },
  { name: 'Traditional Badi & Snacks', image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', order_index: 6 },
];

const products = [
  // --- FRESH FISH & SEAFOOD ---
  {
    name: 'Padma Hilsa (Ilish) - Whole & Cut',
    description: 'Fresh Padma River Hilsa fish known for rich oil and melting aroma.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g Steaks', price: 1050, original_price: 1200, stock: 30, sku: 'ILISH-500G' },
      { unit: '1 kg Whole', price: 1850, original_price: 2100, stock: 25, sku: 'ILISH-1KG' },
      { unit: '1.5 kg Whole', price: 2800, original_price: 3100, stock: 15, sku: 'ILISH-1.5KG' }
    ]
  },
  {
    name: 'Fresh Katla Fish Steaks',
    description: 'Freshwater Katla fish large steaks cut for traditional Bengali Macher Jhol.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g', price: 250, original_price: 290, stock: 40, sku: 'KATLA-500G' },
      { unit: '1 kg', price: 480, original_price: 550, stock: 50, sku: 'KATLA-1KG' }
    ]
  },
  {
    name: 'Fresh Rohu (Rui) - Curry Cut',
    description: 'Cleaned freshwater Rohu steaks ideal for everyday light cumin & ginger macher jhol.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g', price: 190, original_price: 220, stock: 45, sku: 'ROHU-500G' },
      { unit: '1 kg', price: 360, original_price: 420, stock: 60, sku: 'ROHU-1KG' }
    ]
  },
  {
    name: 'Bhetki Fillet (Barramundi)',
    description: 'Premium boneless Bhetki fish fillet for Kolkata Fish Fry, Fish Kabiraji & Tikka.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1535567465397-7523840f2ae9?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g Cubes', price: 350, original_price: 390, stock: 30, sku: 'BHETKI-250G' },
      { unit: '500g Fillet', price: 680, original_price: 750, stock: 35, sku: 'BHETKI-500G' },
      { unit: '1 kg Fillet', price: 1300, original_price: 1450, stock: 20, sku: 'BHETKI-1KG' }
    ]
  },
  {
    name: 'Golda Chingri (Giant Freshwater Prawns)',
    description: 'Large Jumbo Golda Chingri with juicy head fat for Chingri Malaikari.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g Medium', price: 680, original_price: 750, stock: 25, sku: 'GOLDA-500G' },
      { unit: '500g Jumbo', price: 920, original_price: 1050, stock: 20, sku: 'GOLDA-JUMBO' }
    ]
  },
  {
    name: 'Bagda Chingri (Tiger Prawns)',
    description: 'Deveined Tiger Prawns perfect for Bhapa Chingri, Prawn Roast, or Prawn Tempura.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1559742811-822863c46f43?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g', price: 330, original_price: 370, stock: 35, sku: 'BAGDA-250G' },
      { unit: '500g', price: 640, original_price: 720, stock: 25, sku: 'BAGDA-500G' }
    ]
  },
  {
    name: 'Fresh Pabda Maach (Butter Catfish)',
    description: 'Sweet, soft & delicate Pabda fish for Pabda Shorshe Jhal or Borir Jhol.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g', price: 270, original_price: 310, stock: 25, sku: 'PABDA-250G' },
      { unit: '500g', price: 520, original_price: 600, stock: 30, sku: 'PABDA-500G' }
    ]
  },

  // --- MUTTON & POULTRY ---
  {
    name: 'Bengal Khasi Mutton (Goat Meat)',
    description: 'Tender Bengal Goat Meat (Riwaj Khasi Mutton) for Kosha Mangsho.',
    category_name: 'Mutton & Poultry',
    image_url: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g Curry Cut', price: 460, original_price: 520, stock: 40, sku: 'MUTTON-500G' },
      { unit: '1 kg Curry Cut', price: 880, original_price: 980, stock: 35, sku: 'MUTTON-1KG' },
      { unit: '500g Nalli & Shank', price: 490, original_price: 550, stock: 25, sku: 'MUTTON-NALLI' }
    ]
  },
  {
    name: 'Desi Murgi (Country Chicken)',
    description: 'Free-range organic Country Chicken cut with bones for rich Murgir Jhol.',
    category_name: 'Mutton & Poultry',
    image_url: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g', price: 220, original_price: 250, stock: 30, sku: 'DESICHK-500G' },
      { unit: '1 kg', price: 420, original_price: 480, stock: 30, sku: 'DESICHK-1KG' }
    ]
  },
  {
    name: 'Fresh Broiler Chicken (Skinless)',
    description: 'Tender chicken cut into medium curry pieces for Murgir Jhol and Roast.',
    category_name: 'Mutton & Poultry',
    image_url: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g', price: 130, original_price: 150, stock: 60, sku: 'CHK-500G' },
      { unit: '1 kg', price: 240, original_price: 280, stock: 50, sku: 'CHK-1KG' }
    ]
  },

  // --- BENGALI GROCERIES ---
  {
    name: 'Gobindobhog Rice (Special Aromatic)',
    description: 'Aromatic short-grain Gobindobhog rice essential for Khichuri & Payesh.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g', price: 70, original_price: 80, stock: 80, sku: 'GOBINDO-500G' },
      { unit: '1 kg', price: 130, original_price: 150, stock: 100, sku: 'GOBINDO-1KG' },
      { unit: '5 kg Pack', price: 620, original_price: 720, stock: 40, sku: 'GOBINDO-5KG' }
    ]
  },
  {
    name: 'Fortune Kachi Ghani Pure Mustard Oil',
    description: 'Cold-pressed Mustard Oil for authentic fish & meat cooking.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500ml Bottle', price: 98, original_price: 110, stock: 70, sku: 'MUSTARD-500ML' },
      { unit: '1 Litre Bottle', price: 185, original_price: 210, stock: 80, sku: 'MUSTARD-1L' }
    ]
  },
  {
    name: 'Jharna Pure Cow Ghee',
    description: 'Authentic Jharna Ghee with granular texture and divine fragrance.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '200ml Jar', price: 210, original_price: 235, stock: 50, sku: 'JHARNA-200ML' },
      { unit: '500ml Jar', price: 490, original_price: 540, stock: 60, sku: 'JHARNA-500ML' }
    ]
  },

  // --- SWEETS & MISHTI ---
  {
    name: 'Kolkata Sponge Roshogolla',
    description: 'Soft, spongy chana balls soaked in light cardamom syrup.',
    category_name: 'Authentic Mishti & Sweets',
    image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g Can (6 pcs)', price: 150, original_price: 175, stock: 50, sku: 'ROSOGolla-500G' },
      { unit: '1 kg Matka / Can', price: 280, original_price: 320, stock: 40, sku: 'ROSOGolla-1KG' }
    ]
  },
  {
    name: 'Traditional Mishti Doi',
    description: 'Creamy clay matka setting sweet caramelized fermented doi.',
    category_name: 'Authentic Mishti & Sweets',
    image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g Matka', price: 95, original_price: 110, stock: 40, sku: 'DOI-250G' },
      { unit: '500g Matka', price: 180, original_price: 210, stock: 35, sku: 'DOI-500G' }
    ]
  }
];

function escapeSql(str) {
  if (!str) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

let sql = `-- Re-create product & product_variants tables
DELETE FROM public.order_items;
DELETE FROM public.product_variants;
DELETE FROM public.products;
DELETE FROM public.categories;

-- Insert Categories
`;

categories.forEach(c => {
  sql += `INSERT INTO public.categories (name, image_url, order_index) VALUES (${escapeSql(c.name)}, ${escapeSql(c.image_url)}, ${c.order_index}) ON CONFLICT DO NOTHING;\n`;
});

sql += `\n-- Insert Parent Products & Child Variants\n`;

products.forEach(p => {
  const firstVariant = p.variants[0];
  sql += `WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES (${escapeSql(p.name)}, ${escapeSql(p.description)}, ${escapeSql(p.category_name)}, ${escapeSql(p.image_url)}, ${firstVariant.price}, ${firstVariant.original_price}, ${escapeSql(firstVariant.unit)}, ${firstVariant.stock}, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES\n`;

  const variantValues = p.variants.map(v =>
    `  ((SELECT id FROM new_prod), ${escapeSql(v.unit)}, ${v.price}, ${v.original_price}, ${v.stock}, ${escapeSql(v.sku)}, true)`
  ).join(',\n');

  sql += variantValues + ';\n\n';
});

fs.writeFileSync('seed_relational_data.sql', sql);
console.log(`Generated seed_relational_data.sql with ${categories.length} categories and ${products.length} parent products.`);
