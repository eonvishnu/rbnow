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
  // --- FRESH FISH & SEAFOOD (25) ---
  {
    name: 'Padma Hilsa (Ilish) Whole & Cut',
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
    name: 'Fresh Rohu (Rui) Curry Cut',
    description: 'Cleaned freshwater Rohu steaks ideal for everyday light cumin & ginger macher jhol.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g', price: 190, original_price: 220, stock: 45, sku: 'ROHU-500G' },
      { unit: '1 kg', price: 360, original_price: 420, stock: 60, sku: 'ROHU-1KG' }
    ]
  },
  {
    name: 'Bhetki Fillet (Barramundi) Boneless',
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
  {
    name: 'Parshe Maach Whole Cleaned',
    description: 'Freshwater Parshe fish cleaned and washed for Parshe Jhal with mustard seeds.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g', price: 250, original_price: 280, stock: 30, sku: 'PARSHE-250G' },
      { unit: '500g', price: 490, original_price: 550, stock: 25, sku: 'PARSHE-500G' }
    ]
  },
  {
    name: 'Tangra Maach Medium',
    description: 'Whole Tangra fish cleaned for traditional Bengali Tangra Macher Jhal.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g', price: 230, original_price: 270, stock: 30, sku: 'TANGRA-250G' },
      { unit: '500g', price: 450, original_price: 520, stock: 30, sku: 'TANGRA-500G' }
    ]
  },
  {
    name: 'Chital Peti & Muitha Cut',
    description: 'Exquisite Chital Peti cut with rich fat layer for Chital Macher Muitha or Peti Jhol.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g', price: 460, original_price: 510, stock: 20, sku: 'CHITAL-250G' },
      { unit: '500g', price: 890, original_price: 980, stock: 15, sku: 'CHITAL-500G' }
    ]
  },
  {
    name: 'Koi Maach (Climbing Perch)',
    description: 'Fresh live Koi fish cleaned for Tel Koi or Koi Macher Jhol.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g', price: 300, original_price: 340, stock: 25, sku: 'KOI-250G' },
      { unit: '500g', price: 580, original_price: 650, stock: 20, sku: 'KOI-500G' }
    ]
  },
  {
    name: 'Bata Maach Cleaned',
    description: 'Small, tasty Bata fish cleaned for daily mustard jhol or kalojira jhol.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g', price: 170, original_price: 200, stock: 35, sku: 'BATA-250G' },
      { unit: '500g', price: 320, original_price: 380, stock: 35, sku: 'BATA-500G' }
    ]
  },
  {
    name: 'Mourala Maach Minnow',
    description: 'Delicate Mourala fish for Mourala Macher Bati Charchari.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g', price: 380, original_price: 450, stock: 20, sku: 'MOURALA-250G' },
      { unit: '500g', price: 720, original_price: 850, stock: 15, sku: 'MOURALA-500G' }
    ]
  },
  {
    name: 'Boal Maach Steaks',
    description: 'Freshwater Boal catfish steaks cut for spicy tomato-mustard jhol.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g', price: 550, original_price: 620, stock: 20, sku: 'BOAL-500G' },
      { unit: '1 kg', price: 1050, original_price: 1180, stock: 15, sku: 'BOAL-1KG' }
    ]
  },
  {
    name: 'Gurjali Maach (Indian Salmon)',
    description: 'Firm, boneless slices of Indian Salmon for pan frying and light curries.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1535567465397-7523840f2ae9?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g', price: 390, original_price: 440, stock: 20, sku: 'GURJALI-250G' },
      { unit: '500g', price: 750, original_price: 850, stock: 18, sku: 'GURJALI-500G' }
    ]
  },
  {
    name: 'White Pomfret Cleaned',
    description: 'Premium White Pomfret cleaned for Rava Fry, Tandoori or Bengali Pomfret Jhal.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g', price: 360, original_price: 410, stock: 25, sku: 'POMFRET-250G' },
      { unit: '500g (3-4 pcs)', price: 690, original_price: 780, stock: 25, sku: 'POMFRET-500G' }
    ]
  },
  {
    name: 'Desi Magur Maach',
    description: 'Nutritious & light Desi Magur fish cleaned for stew with raw banana.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g', price: 320, original_price: 360, stock: 20, sku: 'MAGUR-250G' },
      { unit: '500g', price: 620, original_price: 700, stock: 15, sku: 'MAGUR-500G' }
    ]
  },
  {
    name: 'Aar Maach Steaks',
    description: 'Soft & boneless Aar fish steaks for Aar Macher Kalia.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g', price: 340, original_price: 380, stock: 25, sku: 'AAR-250G' },
      { unit: '500g', price: 650, original_price: 720, stock: 22, sku: 'AAR-500G' }
    ]
  },
  {
    name: 'Fresh Mud Crab (Kankra)',
    description: 'Sea Mud Crab with hard shell & juicy meat for Bengali Kankra Jhol.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g', price: 580, original_price: 650, stock: 15, sku: 'CRAB-500G' },
      { unit: '1 kg', price: 1100, original_price: 1250, stock: 10, sku: 'CRAB-1KG' }
    ]
  },
  {
    name: 'Loitta Maach (Bombay Duck)',
    description: 'Soft & melt-in-mouth Loitta fish for Loitta Shutki / Loitta Macher Jhuro.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g', price: 150, original_price: 180, stock: 35, sku: 'LOITTA-250G' },
      { unit: '500g', price: 280, original_price: 340, stock: 30, sku: 'LOITTA-500G' }
    ]
  },
  {
    name: 'Shol Maach Curry Cut',
    description: 'Fresh Shol fish cut into curry pieces for Shol Kopia or Aam Shol.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g', price: 250, original_price: 290, stock: 25, sku: 'SHOL-250G' },
      { unit: '500g', price: 480, original_price: 550, stock: 20, sku: 'SHOL-500G' }
    ]
  },
  {
    name: 'Topshe Maach (Mango Fish)',
    description: 'Crispy frying favourite Topshe fish cleaned for Topshe Fry with Kasundi.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g', price: 280, original_price: 320, stock: 22, sku: 'TOPSHE-250G' },
      { unit: '500g', price: 540, original_price: 600, stock: 18, sku: 'TOPSHE-500G' }
    ]
  },
  {
    name: 'Nona Ilish (Salted Hilsa)',
    description: 'Traditionally preserved salted Hilsa for Nona Ilish Bhorta with mustard oil & chillies.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g', price: 650, original_price: 750, stock: 15, sku: 'NONAILISH-250G' },
      { unit: '500g', price: 1250, original_price: 1400, stock: 10, sku: 'NONAILISH-500G' }
    ]
  },
  {
    name: 'Chingri Shutki (Dried Shrimps)',
    description: 'Sun-dried small shrimp for Bengali Shutki Bhorta & Charchari.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1559742811-822863c46f43?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '200g', price: 240, original_price: 290, stock: 40, sku: 'CHINGRISHUTKI-200G' },
      { unit: '500g', price: 550, original_price: 650, stock: 25, sku: 'CHINGRISHUTKI-500G' }
    ]
  },
  {
    name: 'Loitta Shutki (Dried Bombay Duck)',
    description: 'Dried Loitta fish for spicy Kolkata shutki bhuna.',
    category_name: 'Fresh Fish & Seafood',
    image_url: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '200g', price: 220, original_price: 260, stock: 35, sku: 'LOITTASHUTKI-200G' },
      { unit: '500g', price: 500, original_price: 600, stock: 20, sku: 'LOITTASHUTKI-500G' }
    ]
  },

  // --- MUTTON & POULTRY (15) ---
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
    name: 'Mutton Boneless Lean',
    description: 'Trimmed boneless goat meat for Mutton Keema, Pasanda, or Mutton Seekh Kebab.',
    category_name: 'Mutton & Poultry',
    image_url: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g', price: 580, original_price: 650, stock: 20, sku: 'MUTTON-BONELESS-500G' },
      { unit: '1 kg', price: 1120, original_price: 1250, stock: 15, sku: 'MUTTON-BONELESS-1KG' }
    ]
  },
  {
    name: 'Mutton Mince (Keema)',
    description: 'Freshly ground goat meat mince for Mutton Cutlet, Ghugni or Keema Matar.',
    category_name: 'Mutton & Poultry',
    image_url: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g', price: 270, original_price: 310, stock: 30, sku: 'KEEMA-250G' },
      { unit: '500g', price: 520, original_price: 580, stock: 25, sku: 'KEEMA-500G' }
    ]
  },
  {
    name: 'Mutton Ribs & Chops (Chaap Cuts)',
    description: 'Flattened ribs & chops ideal for Kolkata style Mutton Chaap.',
    category_name: 'Mutton & Poultry',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g', price: 510, original_price: 570, stock: 18, sku: 'CHAAP-500G' },
      { unit: '1 kg', price: 980, original_price: 1100, stock: 15, sku: 'CHAAP-1KG' }
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
  {
    name: 'Chicken Boneless Breast Fillets',
    description: 'Lean, skinless chicken breast fillets for Chicken Tikka, Rolls & Stir Fry.',
    category_name: 'Mutton & Poultry',
    image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g', price: 110, original_price: 130, stock: 50, sku: 'CHKBREAST-250G' },
      { unit: '500g', price: 210, original_price: 250, stock: 45, sku: 'CHKBREAST-500G' }
    ]
  },
  {
    name: 'Chicken Drumsticks (Legs)',
    description: 'Juicy chicken leg drumsticks for Tandoori Chicken & Tangdi Kebab.',
    category_name: 'Mutton & Poultry',
    image_url: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g (4-5 pcs)', price: 190, original_price: 230, stock: 40, sku: 'DRUM-500G' },
      { unit: '1 kg', price: 360, original_price: 430, stock: 30, sku: 'DRUM-1KG' }
    ]
  },
  {
    name: 'Chicken Mince (Keema)',
    description: 'Ground chicken breast for Chicken Momos, Cutlets & Burgers.',
    category_name: 'Mutton & Poultry',
    image_url: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g', price: 95, original_price: 115, stock: 40, sku: 'CHKKEEMA-250G' },
      { unit: '500g', price: 180, original_price: 220, stock: 30, sku: 'CHKKEEMA-500G' }
    ]
  },
  {
    name: 'Duck Meat (Hnahsh)',
    description: 'Fresh duck meat cleaned and cut for traditional Assamese / Bengali Duck Curry.',
    category_name: 'Mutton & Poultry',
    image_url: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g', price: 320, original_price: 360, stock: 15, sku: 'DUCK-500G' },
      { unit: '1 kg', price: 620, original_price: 700, stock: 12, sku: 'DUCK-1KG' }
    ]
  },
  {
    name: 'Quail Meat (Koyel Pakhi)',
    description: 'Whole cleaned Quail birds for Koyel Pakhi Kosha.',
    category_name: 'Mutton & Poultry',
    image_url: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '2 Birds (350g)', price: 340, original_price: 400, stock: 15, sku: 'QUAIL-2PCS' },
      { unit: '4 Birds (700g)', price: 650, original_price: 760, stock: 10, sku: 'QUAIL-4PCS' }
    ]
  },
  {
    name: 'Chicken Wings Crispy Cut',
    description: 'Juicy chicken wings for BBQ or spicy Bengali fried chicken.',
    category_name: 'Mutton & Poultry',
    image_url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g', price: 160, original_price: 200, stock: 35, sku: 'WINGS-500G' },
      { unit: '1 kg', price: 300, original_price: 380, stock: 25, sku: 'WINGS-1KG' }
    ]
  },
  {
    name: 'Mutton Brain (Mogoj)',
    description: 'Goat brain for Mutton Mogoj Fry or Mogoj Bhuna.',
    category_name: 'Mutton & Poultry',
    image_url: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '2 Sets', price: 280, original_price: 320, stock: 10, sku: 'MOGOJ-2PCS' }
    ]
  },
  {
    name: 'Mutton Liver (Kolija) & Kidney',
    description: 'Fresh goat liver & kidney cut for Mutton Kolija Bhuna.',
    category_name: 'Mutton & Poultry',
    image_url: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g', price: 170, original_price: 200, stock: 20, sku: 'KOLIJA-250G' },
      { unit: '500g', price: 320, original_price: 370, stock: 15, sku: 'KOLIJA-500G' }
    ]
  },
  {
    name: 'Broiler Chicken Lollipop',
    description: 'French trimmed chicken winglets for Crispy Chicken Lollipop.',
    category_name: 'Mutton & Poultry',
    image_url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g (10-12 pcs)', price: 220, original_price: 260, stock: 30, sku: 'LOLLIPOP-500G' }
    ]
  },

  // --- BENGALI GROCERIES (25) ---
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
  {
    name: 'White Posto (Poppy Seeds)',
    description: 'Pure white Poppy Seeds for Alu Posto, Posto Murgi & Posto Bora.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '100g Pack', price: 215, original_price: 245, stock: 50, sku: 'POSTO-100G' },
      { unit: '200g Pack', price: 420, original_price: 480, stock: 40, sku: 'POSTO-200G' }
    ]
  },
  {
    name: 'Radhuni Spice (Wild Celery Seed)',
    description: 'Essential spice for authentic Bengali Panch Phoron and Shukto.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '100g Pack', price: 85, original_price: 100, stock: 50, sku: 'RADHUNI-100G' },
      { unit: '250g Pack', price: 195, original_price: 230, stock: 35, sku: 'RADHUNI-250G' }
    ]
  },
  {
    name: 'Panch Phoron (Bengali 5-Spice)',
    description: 'Classic blend of Radhuni, Cumin, Mustard, Fennel & Fenugreek seeds.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '100g Pack', price: 35, original_price: 45, stock: 70, sku: 'PANCHPHORON-100G' },
      { unit: '200g Pack', price: 65, original_price: 80, stock: 65, sku: 'PANCHPHORON-200G' }
    ]
  },
  {
    name: 'Mukhorochak Chanachur Tok Jhal',
    description: 'Iconic Kolkata spicy and sweet evening snack chanachur.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '150g Pack', price: 50, original_price: 60, stock: 80, sku: 'MUKHO-150G' },
      { unit: '300g Pack', price: 95, original_price: 110, stock: 75, sku: 'MUKHO-300G' }
    ]
  },
  {
    name: 'Kolkata Biryani Meetha Attar',
    description: 'Aromatic Biryani essence for genuine Kolkata Mughlai Mutton Biryani flavor.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '25ml Bottle', price: 120, original_price: 140, stock: 30, sku: 'ATTAR-25ML' }
    ]
  },
  {
    name: 'Sona Moong Dal Roasted',
    description: 'Golden roasted Moong Dal for Bhaja Moonger Dal with Fish Head (Muri Ghonto).',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1585992227540-7048c161c92e?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g', price: 75, original_price: 90, stock: 60, sku: 'MOONG-500G' },
      { unit: '1 kg', price: 140, original_price: 165, stock: 50, sku: 'MOONG-1KG' }
    ]
  },
  {
    name: 'Biulir Dal Split',
    description: 'Split skinless Urad Dal for traditional Bengali Biulir Dal & Aloo Posto combo.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1585992227540-7048c161c92e?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g', price: 85, original_price: 100, stock: 50, sku: 'BIULI-500G' },
      { unit: '1 kg', price: 160, original_price: 185, stock: 45, sku: 'BIULI-1KG' }
    ]
  },
  {
    name: 'Cholar Dal (Chana Dal)',
    description: 'Premium Chana Dal for Bengali Cholar Dal with Narkel (Coconut) & Luchi.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1585992227540-7048c161c92e?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g', price: 60, original_price: 70, stock: 70, sku: 'CHOLAR-500G' },
      { unit: '1 kg', price: 110, original_price: 130, stock: 60, sku: 'CHOLAR-1KG' }
    ]
  },
  {
    name: 'Minikit Parboiled Rice',
    description: 'Long grain, light and non-sticky Bengali boiled rice.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '1 kg', price: 72, original_price: 85, stock: 120, sku: 'MINIKIT-1KG' },
      { unit: '5 kg Pack', price: 345, original_price: 410, stock: 50, sku: 'MINIKIT-5KG' }
    ]
  },
  {
    name: 'Kalo Nun Rice Black Pearl',
    description: 'Rare aromatic heirloom rice from North Bengal for special Pulao.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g', price: 95, original_price: 110, stock: 30, sku: 'KALONUN-500G' },
      { unit: '1 kg', price: 180, original_price: 210, stock: 25, sku: 'KALONUN-1KG' }
    ]
  },
  {
    name: 'Yellow Mustard Seeds (Shorshe)',
    description: 'Cleaned yellow mustard seeds for Shorshe Bata paste.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g Pack', price: 70, original_price: 85, stock: 50, sku: 'YELLOWSHORSHE-250G' },
      { unit: '500g Pack', price: 130, original_price: 160, stock: 40, sku: 'YELLOWSHORSHE-500G' }
    ]
  },
  {
    name: 'Black Mustard Seeds (Rai)',
    description: 'Pungent dark mustard seeds for tempering.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g Pack', price: 60, original_price: 75, stock: 50, sku: 'BLACKSHORSHE-250G' }
    ]
  },
  {
    name: 'Bhaja Masala Roasted Powder',
    description: 'Handmade roasted spice blend for Chutney, Phuchka & Alur Dom.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '150g Jar', price: 90, original_price: 110, stock: 40, sku: 'BHAJA-150G' }
    ]
  },
  {
    name: 'Shukto Masala Mix',
    description: 'Pre-mixed traditional spice blend for bitter gourmand Shukto gravy.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '100g Pack', price: 80, original_price: 95, stock: 35, sku: 'SHUKTO-100G' }
    ]
  },
  {
    name: 'Tejpata (Indian Bay Leaves)',
    description: 'Fragrant dried bay leaves essential for meat and curries.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '100g Pack', price: 45, original_price: 60, stock: 60, sku: 'TEJPATA-100G' }
    ]
  },
  {
    name: 'Gorom Masala Whole Spice',
    description: 'Whole Cardamom, Clove & Cinnamon stick blend for rich gravy.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '100g Pack', price: 150, original_price: 180, stock: 45, sku: 'GOROM-100G' }
    ]
  },
  {
    name: 'Muri (Kolkata Puffed Rice)',
    description: 'Light and crunchy Bengali puffed rice for Jhalmuri and Telebhaja.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g Pack', price: 55, original_price: 70, stock: 80, sku: 'MURI-500G' },
      { unit: '1 kg Pack', price: 100, original_price: 130, stock: 60, sku: 'MURI-1KG' }
    ]
  },
  {
    name: 'Chira (Flattened Rice Thick)',
    description: 'Thick flattened rice for Dahi Chira & evening breakfast.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g Pack', price: 60, original_price: 75, stock: 70, sku: 'CHIRA-500G' }
    ]
  },
  {
    name: 'Amsotto (Mango Bar)',
    description: 'Sweet and tangy dried mango leather for Chutney and Payesh.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '200g Pack', price: 140, original_price: 165, stock: 35, sku: 'AMSOTTO-200G' }
    ]
  },
  {
    name: 'Khejurer Gur (Date Palm Jaggery Block)',
    description: 'Pure winter Khejur Gur block for Payesh and Pithe.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g Block', price: 120, original_price: 140, stock: 40, sku: 'GUR-250G' },
      { unit: '500g Block', price: 220, original_price: 260, stock: 30, sku: 'GUR-500G' }
    ]
  },
  {
    name: 'Nolen Gur Liquid Syrup',
    description: 'Fragrant liquid Nolen Gur syrup for drizzling over Roshogolla & ice cream.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250ml Bottle', price: 150, original_price: 175, stock: 35, sku: 'NOLENGUR-250ML' },
      { unit: '500ml Bottle', price: 280, original_price: 320, stock: 25, sku: 'NOLENGUR-500ML' }
    ]
  },
  {
    name: 'Fresh Chana Cottage Cheese',
    description: 'Fresh homemade soft Chana for Sandesh, Rosogolla, or Chanar Dalna.',
    category_name: 'Bengali Groceries',
    image_url: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g Pack', price: 100, original_price: 120, stock: 30, sku: 'CHANA-250G' },
      { unit: '500g Pack', price: 190, original_price: 220, stock: 20, sku: 'CHANA-500G' }
    ]
  },

  // --- AUTHENTIC MISHTI & SWEETS (15) ---
  {
    name: 'Kolkata Sponge Roshogolla',
    description: 'Soft, spongy chana balls soaked in light cardamom syrup.',
    category_name: 'Authentic Mishti & Sweets',
    image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g Can', price: 150, original_price: 175, stock: 50, sku: 'ROSOGolla-500G' },
      { unit: '1 kg Matka', price: 280, original_price: 320, stock: 40, sku: 'ROSOGolla-1KG' }
    ]
  },
  {
    name: 'Nolen Gur Roshogolla',
    description: 'Winter special Rosogolla soaked in aromatic Date Palm Jaggery syrup.',
    category_name: 'Authentic Mishti & Sweets',
    image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g Can', price: 180, original_price: 210, stock: 40, sku: 'NOLENROSO-500G' },
      { unit: '1 kg Can', price: 340, original_price: 390, stock: 30, sku: 'NOLENROSO-1KG' }
    ]
  },
  {
    name: 'Traditional Mishti Doi',
    description: 'Creamy clay matka setting sweet caramelized fermented doi.',
    category_name: 'Authentic Mishti & Sweets',
    image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g Clay Pot', price: 95, original_price: 110, stock: 40, sku: 'DOI-250G' },
      { unit: '500g Clay Pot', price: 180, original_price: 210, stock: 35, sku: 'DOI-500G' }
    ]
  },
  {
    name: 'Gulab Jamun / Pantua',
    description: 'Golden fried chana & khoya dumplings soaked in rose syrup.',
    category_name: 'Authentic Mishti & Sweets',
    image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g Pack', price: 135, original_price: 160, stock: 35, sku: 'PANTUA-250G' },
      { unit: '500g Pack', price: 260, original_price: 300, stock: 30, sku: 'PANTUA-500G' }
    ]
  },
  {
    name: 'Rajbhog (Kesar Stuffed Rosogolla)',
    description: 'Jumbo Rosogolla stuffed with dry fruits and saffron.',
    category_name: 'Authentic Mishti & Sweets',
    image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g (6 pcs)', price: 320, original_price: 360, stock: 25, sku: 'RAJBHOG-500G' }
    ]
  },
  {
    name: 'Nolen Gur Sandesh',
    description: 'Fresh cottage cheese sweets flavoured with rich Nolen Gur.',
    category_name: 'Authentic Mishti & Sweets',
    image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g Box', price: 290, original_price: 340, stock: 20, sku: 'NOLENSANDESH-250G' },
      { unit: '500g Box', price: 560, original_price: 650, stock: 15, sku: 'NOLENSANDESH-500G' }
    ]
  },
  {
    name: 'Kanchagolla Sandesh',
    description: 'Soft & melt-in-mouth unbaked fresh chana sandesh.',
    category_name: 'Authentic Mishti & Sweets',
    image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g Box', price: 270, original_price: 310, stock: 20, sku: 'KANCHA-250G' }
    ]
  },
  {
    name: 'Sitabhog & Mihidana Combo',
    description: 'Authentic Burdwan special sweet vermicelli and tiny sweet pearls.',
    category_name: 'Authentic Mishti & Sweets',
    image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '400g Box', price: 310, original_price: 350, stock: 18, sku: 'BURDWAN-400G' }
    ]
  },
  {
    name: 'Langcha Shaktigarh',
    description: 'Elongated deep fried chana sweets soaked in thick cardamom syrup.',
    category_name: 'Authentic Mishti & Sweets',
    image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g Pack', price: 135, original_price: 160, stock: 25, sku: 'LANGCHA-250G' },
      { unit: '500g Pack', price: 260, original_price: 300, stock: 22, sku: 'LANGCHA-500G' }
    ]
  },
  {
    name: 'Kheer Kadam',
    description: 'Double layered sweet with a mini Rosogolla inside a khoya shell.',
    category_name: 'Authentic Mishti & Sweets',
    image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '300g Box', price: 300, original_price: 340, stock: 20, sku: 'KHEERKADAM-300G' }
    ]
  },
  {
    name: 'Malpua Ghee Fried',
    description: 'Fluffy aniseed flavoured pancakes fried in ghee & dipped in syrup.',
    category_name: 'Authentic Mishti & Sweets',
    image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '6 pcs Pack', price: 240, original_price: 280, stock: 15, sku: 'MALPUA-6PCS' }
    ]
  },
  {
    name: 'Patishapta Pithe',
    description: 'Delicate crepes stuffed with kheer & coconut jaggery mixture.',
    category_name: 'Authentic Mishti & Sweets',
    image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '6 pcs Pack', price: 280, original_price: 320, stock: 12, sku: 'PATISHAPTA-6PCS' }
    ]
  },
  {
    name: 'Chana Payesh Kheer',
    description: 'Rich condensed milk payesh studded with mini chana dumplings.',
    category_name: 'Authentic Mishti & Sweets',
    image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '400g Tub', price: 250, original_price: 290, stock: 15, sku: 'CHANAPAYESH-400G' }
    ]
  },
  {
    name: 'Chamcham Oval Sweet',
    description: 'Traditional saffron & pistachio garnished juicy sweet.',
    category_name: 'Authentic Mishti & Sweets',
    image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '500g Box', price: 270, original_price: 310, stock: 20, sku: 'CHAMCHAM-500G' }
    ]
  },
  {
    name: 'Shor Bhaja Krishnanagar',
    description: 'Layered milk cream fried sweet soaked in sugar syrup.',
    category_name: 'Authentic Mishti & Sweets',
    image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '300g Box', price: 360, original_price: 410, stock: 10, sku: 'SHORBHAJA-300G' }
    ]
  },

  // --- PICKLES & KASUNDI (10) ---
  {
    name: 'Aam Kasundi Green Mango Sauce',
    description: 'Sharp, pungent mustard sauce blended with green mangoes for fish & snacks.',
    category_name: 'Pickles & Kasundi',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '350g Glass Jar', price: 160, original_price: 190, stock: 50, sku: 'AAMKASUNDI-350G' }
    ]
  },
  {
    name: 'Traditional Mustard Kasundi Dip',
    description: 'Classic Kolkata mustard dip for chops, cutlets, and Bhetki fry.',
    category_name: 'Pickles & Kasundi',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '350g Glass Jar', price: 140, original_price: 170, stock: 60, sku: 'KASUNDI-350G' }
    ]
  },
  {
    name: 'Aam Tel Achar Pickle',
    description: 'Raw mango slices preserved in pure mustard oil and roasted spices.',
    category_name: 'Pickles & Kasundi',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '400g Jar', price: 180, original_price: 210, stock: 40, sku: 'AAMTEL-400G' }
    ]
  },
  {
    name: 'Boroi Achar Dried Jujube',
    description: 'Sweet and sour dried jujube plum pickle with jaggery and chilli.',
    category_name: 'Pickles & Kasundi',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '300g Jar', price: 150, original_price: 180, stock: 30, sku: 'BOROI-300G' }
    ]
  },
  {
    name: 'Jalpai Achar Olive Pickle',
    description: 'Tangy Indian wild olive pickle steeped in roasted panch phoron.',
    category_name: 'Pickles & Kasundi',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '350g Jar', price: 170, original_price: 200, stock: 25, sku: 'JALPAI-350G' }
    ]
  },
  {
    name: 'Tetul Achar Tamarind Pickle',
    description: 'Rich dark tamarind pickle cooked with Date Jaggery and Bhaja Masala.',
    category_name: 'Pickles & Kasundi',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '300g Jar', price: 160, original_price: 190, stock: 35, sku: 'TETUL-300G' }
    ]
  },
  {
    name: 'Amra Achar Hog Plum',
    description: 'Spicy hog plum pickle in mustard oil broth.',
    category_name: 'Pickles & Kasundi',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '350g Jar', price: 165, original_price: 195, stock: 20, sku: 'AMRA-350G' }
    ]
  },
  {
    name: 'Tomato Khejur Amsotto Chutney',
    description: 'Ready-to-eat sweet tomato chutney cooked with dates and mango leather.',
    category_name: 'Pickles & Kasundi',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '350g Jar', price: 190, original_price: 220, stock: 30, sku: 'TOMATOCHUTNEY-350G' }
    ]
  },
  {
    name: 'Kancha Aam Sweet Chutney',
    description: 'Golden sweet green mango preserve with cardamom.',
    category_name: 'Pickles & Kasundi',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '350g Jar', price: 175, original_price: 205, stock: 25, sku: 'KANCHAAAM-350G' }
    ]
  },
  {
    name: 'Lanka Shorshe Chilli Pickle',
    description: 'Fiery green chillies stuffed with mustard paste and spices.',
    category_name: 'Pickles & Kasundi',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '300g Jar', price: 150, original_price: 180, stock: 35, sku: 'LANKA-300G' }
    ]
  },

  // --- TRADITIONAL BADI & SNACKS (10) ---
  {
    name: 'Goyna Badi Midnapore Art',
    description: 'Traditional ornamentally shaped lentil crisps fried in ghee.',
    category_name: 'Traditional Badi & Snacks',
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '150g Box', price: 180, original_price: 220, stock: 25, sku: 'GOYNA-150G' }
    ]
  },
  {
    name: 'Kumro Badi Pumpkin Seed',
    description: 'Lentil dumplings prepared with pumpkin pulp for Macher Jhol and Lau Ghonto.',
    category_name: 'Traditional Badi & Snacks',
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g Pack', price: 110, original_price: 130, stock: 45, sku: 'KUMROBADI-250G' }
    ]
  },
  {
    name: 'Biulir Daler Masala Badi',
    description: 'Spiced urad dal sun-dried dumplings with hing and black pepper.',
    category_name: 'Traditional Badi & Snacks',
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g Pack', price: 120, original_price: 145, stock: 40, sku: 'BIULIBADI-250G' }
    ]
  },
  {
    name: 'Dhokar Dalna Ready Mix',
    description: 'Pre-seasoned lentil cake batter mix for quick Dhokar Dalna curry.',
    category_name: 'Traditional Badi & Snacks',
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '200g Pack', price: 95, original_price: 115, stock: 35, sku: 'DHOKA-200G' }
    ]
  },
  {
    name: 'Cleaned Thor Banana Stem',
    description: 'Freshly chopped banana stem packed for Thor Ghonto.',
    category_name: 'Traditional Badi & Snacks',
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '400g Pack', price: 75, original_price: 90, stock: 20, sku: 'THOR-400G' }
    ]
  },
  {
    name: 'Cleaned Mocha Banana Flower',
    description: 'Pre-cleaned and chopped banana flower for Mocha Ghonto or Mocha Chop.',
    category_name: 'Traditional Badi & Snacks',
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '400g Pack', price: 85, original_price: 100, stock: 20, sku: 'MOCHA-400G' }
    ]
  },
  {
    name: 'Kolkata Bhetki Fish Fry Cutlets',
    description: 'Marinated Bhetki fillets coated in breadcrumbs, ready to deep fry.',
    category_name: 'Traditional Badi & Snacks',
    image_url: 'https://images.unsplash.com/photo-1535567465397-7523840f2ae9?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '4 pcs Frozen Pack', price: 360, original_price: 420, stock: 30, sku: 'FISHFRY-4PCS' }
    ]
  },
  {
    name: 'Fish Kabiraji Patties',
    description: 'Spiced fish patties for egg-net Kabiraji fry.',
    category_name: 'Traditional Badi & Snacks',
    image_url: 'https://images.unsplash.com/photo-1535567465397-7523840f2ae9?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '4 pcs Pack', price: 320, original_price: 380, stock: 25, sku: 'KABIRAJI-4PCS' }
    ]
  },
  {
    name: 'Chingri Chop Patties',
    description: 'Minced prawn and potato spiced croquettes ready to fry.',
    category_name: 'Traditional Badi & Snacks',
    image_url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '6 pcs Pack', price: 280, original_price: 330, stock: 25, sku: 'CHINGRICHOP-6PCS' }
    ]
  },
  {
    name: 'Beguni & Chop Batter Mix',
    description: 'Crispy gram flour (besan) spice mix for Kolkata Telebhaja.',
    category_name: 'Traditional Badi & Snacks',
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    variants: [
      { unit: '250g Pack', price: 65, original_price: 80, stock: 50, sku: 'BEGUNI-250G' }
    ]
  }
];

function escapeSql(str) {
  if (!str) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

let sql = `-- Reset products and variants
DELETE FROM public.order_items;
DELETE FROM public.product_variants;
DELETE FROM public.products;
DELETE FROM public.categories;

-- Insert Categories
`;

categories.forEach(c => {
  sql += `INSERT INTO public.categories (name, image_url, order_index) VALUES (${escapeSql(c.name)}, ${escapeSql(c.image_url)}, ${c.order_index}) ON CONFLICT DO NOTHING;\n`;
});

sql += `\n-- Insert All 100 Parent Products & Child Variants\n`;

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

fs.writeFileSync('seed_100_relational.sql', sql);
console.log(`Generated seed_100_relational.sql with ${categories.length} categories and ${products.length} parent products.`);
