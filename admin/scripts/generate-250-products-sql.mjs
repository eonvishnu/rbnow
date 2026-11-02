import fs from 'fs';

const fishImages = [
  'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80',
];

const meatImages = [
  'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80',
];

const vegImages = [
  'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
];

const grocImages = [
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
];

const fishList = [
  'Katla Fish - Gada Cut', 'Katla Fish - Peti Cut', 'Rohu Fish - Bengali Cut', 'Rohu Fish - Head Piece',
  'Padma Hilsa (Ilish) - Premium Cut', 'Padma Hilsa Whole (1.2kg)', 'Freshwater Pabda Fish',
  'Jumbo Tiger Prawns (Cleaned)', 'Medium White Prawns (Peeled)', 'Fresh Mud Crabs (Live Cut)',
  'Kolkata Bhetki Fillet (Boneless)', 'Parshe Fish Cleaned', 'Tangra Fish Fresh', 'Chital Fish Muitha Cut',
  'Koi Fish (Living)', 'Silver Pomfret Whole', 'Black Pomfret Cut', 'Fresh Salmon Fillet',
  'Tuna Fish Steak', 'Sardines Fresh Cleaned', 'Indian Mackerel (Bangda)', 'Squid Rings Cleaned',
  'Fresh Octopus Cuts', 'Lobster Whole (500g)', 'Basa Fish Fillet Boneless', 'Mahi Mahi Steak',
  'Seer Fish (Surmai) Cut', 'Anchovies (Nethili) Cleaned', 'Red Snapper Whole', 'Grouper Fish Fillet',
  'Sole Fish Fillet', 'Ribbon Fish Cut', 'Tilapia Fish Cleaned', 'Clams (Teesrye) Cleaned',
  'Mussels Fresh', 'Crab Meat Lump', 'Prawns Small (Kadiye)', 'Galda Chingri (Giant Freshwater)',
  'Bagda Chingri (Tiger Prawn)', 'Topse Fish Cleaned', 'Aar Fish Cut', 'Boal Fish Cut',
  'Bata Fish Fresh', 'Singhi Fish Live', 'Magur Fish Fresh', 'Mourala Fish (Small Fry)',
  'Shol Fish Cut', 'Lotte Fish (Bombay Duck)', 'Kokila Fish Cleaned', 'Kajuli Fish Fresh',
  'Bhakut Fish Cut', 'Vetki Fish Whole', 'Pearlspot (Karimeen)', 'Ladyfish (Kane) Cleaned',
  'Indian Salmon (Rawas) Cut', 'Milkfish Whole', 'Mullet Fish Cleaned', 'Cod Fish Fillet',
  'Haddock Fillet', 'Halibut Steak', 'Sea Bass Whole', 'Cobia Fish Steak', 'Emperor Fish Cut', 'Barracuda Steak'
];

const meatList = [
  'Fresh Chicken Curry Cut', 'Chicken Breast Boneless', 'Chicken Drumsticks (Legs)', 'Whole Chicken Cleaned',
  'Country Chicken (Nati Koli) Curry Cut', 'Chicken Lollipop Pieces', 'Chicken Keema (Mince)', 'Chicken Wings Fresh',
  'Chicken Thighs Boneless', 'Chicken Gizzard & Liver', 'Mutton Curry Cut (Goat)', 'Mutton Boneless (Goat)',
  'Mutton Keema (Goat Mince)', 'Mutton Chops & Ribs', 'Mutton Shoulder Cut', 'Mutton Nalli (Shank Marrow)',
  'Fresh Duck Meat Curry Cut', 'Fresh Quail (Bater) Whole', 'Farm Fresh White Eggs (Pack of 12)',
  'Country Hen Eggs (Pack of 6)', 'Organic Brown Eggs (Pack of 6)', 'Quail Eggs (Pack of 12)',
  'Classic Chicken Sausage (250g)', 'Chicken Smoked Salami (200g)', 'Chicken Seekh Kebab (250g)',
  'Chicken Cheese Nuggets (300g)', 'Chicken Malai Tikka (Marinated)', 'Mutton Galouti Kebab (4 Pcs)',
  'Turkey Meat Cut', 'Lamb Curry Cut', 'Lamb Chops Premium', 'Lamb Mince (Keema)',
  'Chicken Popcorn Crispy', 'Chicken Wings Hot & Spicy', 'Mutton Brain (Bheja)', 'Mutton Liver (Kaleji)',
  'Mutton Kidney (Gurda)', 'Chicken Tikka Marinated', 'Chicken Tangdi Kebab', 'Country Duck Eggs (Pack of 6)',
  'Aseel Country Chicken Cut', 'Kadapnath Black Chicken Cut', 'Chicken Skinless Whole', 'Chicken Biryani Cut',
  'Mutton Biryani Cut (Large)', 'Chicken Cold Cut Ham', 'Chicken Pepper Salami', 'Chicken Cheese Cocktail Sausages',
  'Mutton Shami Kebab', 'Chicken Reshmi Kebab', 'Chicken Tandoori Half', 'Duck Egg Golden (Pack of 6)',
  'Chicken Burger Patties', 'Mutton Burger Patties', 'Chicken Meatballs (250g)', 'Mutton Meatballs (250g)',
  'Chicken Shawarma Meat', 'Chicken Fajita Strips', 'Mutton Soup Bones'
];

const vegList = [
  'Fresh Hybrid Tomatoes', 'Desi Local Tomatoes', 'Red Onions Fresh', 'White Onions',
  'New Crop Potatoes', 'Jyoti Potatoes', 'Garlic Whole Desi', 'Peeled Garlic Cloves',
  'Fresh Ginger (Adrak)', 'Green Chillies Spicy', 'Fresh Cauliflower', 'Green Cabbage',
  'Purple Cabbage', 'Brinjal (Baingan) Purple', 'Brinjal Green Long', 'Fresh Lady Finger (Okra)',
  'Palak (Spinach) Bunch', 'Fresh Coriander Bunch', 'Fresh Mint (Pudina) Bunch', 'Methi (Fenugreek) Bunch',
  'Ridge Gourd (Turai)', 'Bottle Gourd (Lauki)', 'Bitter Gourd (Karela)', 'Fresh Cucumber (Kheera)',
  'Green Capsicum', 'Red Bell Pepper', 'Yellow Bell Pepper', 'Fresh Orange Carrots',
  'Fresh Beetroot', 'Sweet Potatoes (Shakarkand)', 'Fresh Green Peas (Matar)', 'Raw Papaya',
  'Raw Banana (Kacha Kela)', 'Drumsticks (Sajna Danta)', 'Pointed Gourd (Parwal)', 'Ivy Gourd (Tindora)',
  'Snake Gourd (Chichinda)', 'Colocasia (Arbi / Kochu)', 'Elephant Foot Yam (Ool)', 'Raw Mango (Kacha Aam)',
  'Fresh Lemon (Nimboo)', 'Sweet Corn Cobs', 'Baby Corn Fresh', 'Button Mushrooms (Pack)',
  'Broccoli Fresh', 'Zucchini Green', 'Zucchini Yellow', 'Spring Onion Bunch',
  'Alphonso Mangoes (1kg)', 'Banganapalli Mangoes', 'Dasheri Mangoes', 'Robusta Bananas (1 Dozen)',
  'Yelakki Bananas (1 Dozen)', 'Red Delicious Apples (4 Pcs)', 'Green Apples (4 Pcs)', 'Nagpur Oranges (1kg)',
  'Green Grapes Seedless', 'Black Grapes Seedless', 'Pomegranate (Anar 1kg)', 'Papaya Sweet Fresh',
  'Watermelon Whole (2.5kg)', 'Muskmelon Whole', 'Guava Sweet Pink', 'Pineapple Whole'
];

const grocList = [
  'Gobindobhog Rice Premium (1kg)', 'Basmati Rice Royal Long Grain (5kg)', 'Sona Masoori Rice (5kg)',
  'Kachi Ghani Mustard Oil (1L)', 'Pure Cow Ghee (500ml)', 'Yellow Mustard Seeds (200g)',
  'Black Mustard Seeds (200g)', 'Panch Phoron Whole Spice (100g)', 'Turmeric Powder (200g)',
  'Kashmiri Red Chilli Powder (200g)', 'Cumin Seeds (Jeera 200g)', 'Coriander Powder (200g)',
  'Shahi Garam Masala (100g)', 'White Posto (Poppy Seeds 100g)', 'Kasundi Mustard Paste (250g)',
  'Sweet Mango Pickle (400g)', 'Spicy Green Chilli Pickle (400g)', 'Kolkata Chanachur Mix (500g)',
  'Muri Puffed Rice (500g)', 'Nolen Gur Date Palm Jaggery (500g)', 'Chakki Fresh Atta (5kg)',
  'Refined Maida (1kg)', 'Roasted Suji / Rava (1kg)', 'Unpolished Chana Dal (1kg)',
  'Unpolished Toor / Arhar Dal (1kg)', 'Unpolished Moong Dal (1kg)', 'Unpolished Masoor Dal (1kg)',
  'Rajma Jammu Red (1kg)', 'Kabuli Chana Large (1kg)', 'Black Chickpeas (Kala Chana 1kg)',
  'Green Moong Whole (1kg)', 'Urad Dal Whole (1kg)', 'Soya Chunks Premium (200g)',
  'Jaggery Powder Organic (500g)', 'Rock Salt (Sendha Namak 1kg)', 'Tata Iodized Salt (1kg)',
  'Tea Powder Premium CTC (500g)', 'Darjeeling Black Tea Leaves (250g)', 'Filter Coffee Powder (250g)',
  'Poha / Flat Rice Thick (500g)', 'Sabudana Large (500g)', 'Sevaiya Vermicelli (200g)',
  'Baking Soda (100g)', 'Baking Powder (100g)', 'Tamarind Whole (250g)', 'Dry Red Chillies Whole (200g)',
  'Black Pepper Whole (100g)', 'Green Cardamom (Elaichi 50g)', 'Black Cardamom (50g)', 'Cinnamon Sticks (100g)',
  'Cloves Whole (50g)', 'Star Anise Whole (50g)', 'Bay Leaves (Tejpatta 50g)', 'Nutmeg Whole (2 Pcs)',
  'Mace (Javitri 25g)', 'Asafoetida (Hing 50g)', 'Fenugreek Seeds (Methi 200g)', 'Fennel Seeds (Saunf 200g)',
  'Sesame Seeds White (200g)', 'Flax Seeds Organic (200g)'
];

function escapeSql(str) {
  return str.replace(/'/g, "''");
}

let sql = `-- SEED 250 PRODUCTS & VARIANTS ATOMICALLY IN SUPABASE

DO $$
DECLARE
  v_cat_fish uuid;
  v_cat_meat uuid;
  v_cat_veg uuid;
  v_cat_groc uuid;
  v_pid uuid;
BEGIN
  -- 1. Get Root Category IDs
  SELECT id INTO v_cat_fish FROM public.categories WHERE name ILIKE '%fish%' AND parent_id IS NULL LIMIT 1;
  SELECT id INTO v_cat_meat FROM public.categories WHERE name ILIKE '%meat%' AND parent_id IS NULL LIMIT 1;
  SELECT id INTO v_cat_veg FROM public.categories WHERE name ILIKE '%veg%' AND parent_id IS NULL LIMIT 1;
  SELECT id INTO v_cat_groc FROM public.categories WHERE name ILIKE '%groc%' AND parent_id IS NULL LIMIT 1;

  IF v_cat_fish IS NULL THEN INSERT INTO public.categories (name) VALUES ('Fishes') RETURNING id INTO v_cat_fish; END IF;
  IF v_cat_meat IS NULL THEN INSERT INTO public.categories (name) VALUES ('Meat, Chicken & Eggs') RETURNING id INTO v_cat_meat; END IF;
  IF v_cat_veg IS NULL THEN INSERT INTO public.categories (name) VALUES ('Vegetables & Fruits') RETURNING id INTO v_cat_veg; END IF;
  IF v_cat_groc IS NULL THEN INSERT INTO public.categories (name) VALUES ('Groceries') RETURNING id INTO v_cat_groc; END IF;

`;

let prodIndex = 1;

// 1. FISHES
fishList.forEach((name, i) => {
  const img = fishImages[i % fishImages.length];
  const desc = escapeSql(`Fresh boutique catch: ${name}. Sourced daily and delivered under express cold chain.`);
  const escName = escapeSql(name);

  sql += `
  -- Product ${prodIndex++}: ${escName}
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('${escName}', '${desc}', v_cat_fish, 'Fishes', '${img}', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', ${120 + (i * 7) % 300}, ${30 + (i * 3) % 40}),
    (v_pid, '500g', ${220 + (i * 13) % 500}, ${25 + (i * 2) % 30}),
    (v_pid, '1 kg', ${420 + (i * 23) % 900}, ${15 + i % 20});
`;
});

// 2. MEAT
meatList.forEach((name, i) => {
  const img = meatImages[i % meatImages.length];
  const desc = escapeSql(`Fresh farm-raised premium meat: ${name}. Cleaned, portioned, and hygienically packed.`);
  const escName = escapeSql(name);

  sql += `
  -- Product ${prodIndex++}: ${escName}
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('${escName}', '${desc}', v_cat_meat, 'Meat, Chicken & Eggs', '${img}', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', ${140 + (i * 11) % 400}, ${40 + (i * 2) % 30}),
    (v_pid, '1 kg', ${260 + (i * 19) % 700}, ${20 + i % 25});
`;
});

// 3. VEGETABLES & FRUITS
vegList.forEach((name, i) => {
  const img = vegImages[i % vegImages.length];
  const desc = escapeSql(`Farm-fresh, hand-picked produce: ${name}. Naturally grown and delivered fresh.`);
  const escName = escapeSql(name);

  sql += `
  -- Product ${prodIndex++}: ${escName}
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('${escName}', '${desc}', v_cat_veg, 'Vegetables & Fruits', '${img}', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', ${30 + (i * 5) % 120}, ${50 + (i * 4) % 50}),
    (v_pid, '1 kg', ${55 + (i * 9) % 220}, ${30 + (i * 2) % 40});
`;
});

// 4. GROCERIES
grocList.forEach((name, i) => {
  const img = grocImages[i % grocImages.length];
  const desc = escapeSql(`Authentic pantry staple: ${name}. Premium quality sourcing for traditional cooking.`);
  const escName = escapeSql(name);

  sql += `
  -- Product ${prodIndex++}: ${escName}
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('${escName}', '${desc}', v_cat_groc, 'Groceries', '${img}', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', ${60 + (i * 8) % 300}, ${60 + (i * 3) % 40}),
    (v_pid, '1 kg', ${110 + (i * 15) % 550}, ${40 + (i * 2) % 30});
`;
});

sql += `
  RAISE NOTICE 'Successfully seeded 250 products with multi-unit variants!';
END $$;
`;

fs.writeFileSync('/home/vishnu/ecom/supabase/seed-250-products.sql', sql);
console.log('✅ Generated supabase/seed-250-products.sql with 250 products!');
