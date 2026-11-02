-- Reset products and variants
DELETE FROM public.order_items;
DELETE FROM public.product_variants;
DELETE FROM public.products;
DELETE FROM public.categories;

-- Insert Categories
INSERT INTO public.categories (name, image_url, order_index) VALUES ('Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', 1) ON CONFLICT DO NOTHING;
INSERT INTO public.categories (name, image_url, order_index) VALUES ('Mutton & Poultry', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', 2) ON CONFLICT DO NOTHING;
INSERT INTO public.categories (name, image_url, order_index) VALUES ('Bengali Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', 3) ON CONFLICT DO NOTHING;
INSERT INTO public.categories (name, image_url, order_index) VALUES ('Authentic Mishti & Sweets', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 4) ON CONFLICT DO NOTHING;
INSERT INTO public.categories (name, image_url, order_index) VALUES ('Pickles & Kasundi', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', 5) ON CONFLICT DO NOTHING;
INSERT INTO public.categories (name, image_url, order_index) VALUES ('Traditional Badi & Snacks', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', 6) ON CONFLICT DO NOTHING;

-- Insert All 100 Parent Products & Child Variants
WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Padma Hilsa (Ilish) Whole & Cut', 'Fresh Padma River Hilsa fish known for rich oil and melting aroma.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', 1050, 1200, '500g Steaks', 30, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g Steaks', 1050, 1200, 30, 'ILISH-500G', true),
  ((SELECT id FROM new_prod), '1 kg Whole', 1850, 2100, 25, 'ILISH-1KG', true),
  ((SELECT id FROM new_prod), '1.5 kg Whole', 2800, 3100, 15, 'ILISH-1.5KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Fresh Katla Fish Steaks', 'Freshwater Katla fish large steaks cut for traditional Bengali Macher Jhol.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', 250, 290, '500g', 40, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g', 250, 290, 40, 'KATLA-500G', true),
  ((SELECT id FROM new_prod), '1 kg', 480, 550, 50, 'KATLA-1KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Fresh Rohu (Rui) Curry Cut', 'Cleaned freshwater Rohu steaks ideal for everyday light cumin & ginger macher jhol.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80', 190, 220, '500g', 45, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g', 190, 220, 45, 'ROHU-500G', true),
  ((SELECT id FROM new_prod), '1 kg', 360, 420, 60, 'ROHU-1KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Bhetki Fillet (Barramundi) Boneless', 'Premium boneless Bhetki fish fillet for Kolkata Fish Fry, Fish Kabiraji & Tikka.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1535567465397-7523840f2ae9?auto=format&fit=crop&w=600&q=80', 350, 390, '250g Cubes', 30, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g Cubes', 350, 390, 30, 'BHETKI-250G', true),
  ((SELECT id FROM new_prod), '500g Fillet', 680, 750, 35, 'BHETKI-500G', true),
  ((SELECT id FROM new_prod), '1 kg Fillet', 1300, 1450, 20, 'BHETKI-1KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Golda Chingri (Giant Freshwater Prawns)', 'Large Jumbo Golda Chingri with juicy head fat for Chingri Malaikari.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', 680, 750, '500g Medium', 25, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g Medium', 680, 750, 25, 'GOLDA-500G', true),
  ((SELECT id FROM new_prod), '500g Jumbo', 920, 1050, 20, 'GOLDA-JUMBO', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Bagda Chingri (Tiger Prawns)', 'Deveined Tiger Prawns perfect for Bhapa Chingri, Prawn Roast, or Prawn Tempura.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1559742811-822863c46f43?auto=format&fit=crop&w=600&q=80', 330, 370, '250g', 35, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g', 330, 370, 35, 'BAGDA-250G', true),
  ((SELECT id FROM new_prod), '500g', 640, 720, 25, 'BAGDA-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Fresh Pabda Maach (Butter Catfish)', 'Sweet, soft & delicate Pabda fish for Pabda Shorshe Jhal or Borir Jhol.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', 270, 310, '250g', 25, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g', 270, 310, 25, 'PABDA-250G', true),
  ((SELECT id FROM new_prod), '500g', 520, 600, 30, 'PABDA-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Parshe Maach Whole Cleaned', 'Freshwater Parshe fish cleaned and washed for Parshe Jhal with mustard seeds.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', 250, 280, '250g', 30, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g', 250, 280, 30, 'PARSHE-250G', true),
  ((SELECT id FROM new_prod), '500g', 490, 550, 25, 'PARSHE-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Tangra Maach Medium', 'Whole Tangra fish cleaned for traditional Bengali Tangra Macher Jhal.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', 230, 270, '250g', 30, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g', 230, 270, 30, 'TANGRA-250G', true),
  ((SELECT id FROM new_prod), '500g', 450, 520, 30, 'TANGRA-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Chital Peti & Muitha Cut', 'Exquisite Chital Peti cut with rich fat layer for Chital Macher Muitha or Peti Jhol.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', 460, 510, '250g', 20, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g', 460, 510, 20, 'CHITAL-250G', true),
  ((SELECT id FROM new_prod), '500g', 890, 980, 15, 'CHITAL-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Koi Maach (Climbing Perch)', 'Fresh live Koi fish cleaned for Tel Koi or Koi Macher Jhol.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80', 300, 340, '250g', 25, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g', 300, 340, 25, 'KOI-250G', true),
  ((SELECT id FROM new_prod), '500g', 580, 650, 20, 'KOI-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Bata Maach Cleaned', 'Small, tasty Bata fish cleaned for daily mustard jhol or kalojira jhol.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', 170, 200, '250g', 35, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g', 170, 200, 35, 'BATA-250G', true),
  ((SELECT id FROM new_prod), '500g', 320, 380, 35, 'BATA-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Mourala Maach Minnow', 'Delicate Mourala fish for Mourala Macher Bati Charchari.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', 380, 450, '250g', 20, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g', 380, 450, 20, 'MOURALA-250G', true),
  ((SELECT id FROM new_prod), '500g', 720, 850, 15, 'MOURALA-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Boal Maach Steaks', 'Freshwater Boal catfish steaks cut for spicy tomato-mustard jhol.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', 550, 620, '500g', 20, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g', 550, 620, 20, 'BOAL-500G', true),
  ((SELECT id FROM new_prod), '1 kg', 1050, 1180, 15, 'BOAL-1KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Gurjali Maach (Indian Salmon)', 'Firm, boneless slices of Indian Salmon for pan frying and light curries.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1535567465397-7523840f2ae9?auto=format&fit=crop&w=600&q=80', 390, 440, '250g', 20, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g', 390, 440, 20, 'GURJALI-250G', true),
  ((SELECT id FROM new_prod), '500g', 750, 850, 18, 'GURJALI-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('White Pomfret Cleaned', 'Premium White Pomfret cleaned for Rava Fry, Tandoori or Bengali Pomfret Jhal.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80', 360, 410, '250g', 25, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g', 360, 410, 25, 'POMFRET-250G', true),
  ((SELECT id FROM new_prod), '500g (3-4 pcs)', 690, 780, 25, 'POMFRET-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Desi Magur Maach', 'Nutritious & light Desi Magur fish cleaned for stew with raw banana.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', 320, 360, '250g', 20, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g', 320, 360, 20, 'MAGUR-250G', true),
  ((SELECT id FROM new_prod), '500g', 620, 700, 15, 'MAGUR-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Aar Maach Steaks', 'Soft & boneless Aar fish steaks for Aar Macher Kalia.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', 340, 380, '250g', 25, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g', 340, 380, 25, 'AAR-250G', true),
  ((SELECT id FROM new_prod), '500g', 650, 720, 22, 'AAR-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Fresh Mud Crab (Kankra)', 'Sea Mud Crab with hard shell & juicy meat for Bengali Kankra Jhol.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', 580, 650, '500g', 15, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g', 580, 650, 15, 'CRAB-500G', true),
  ((SELECT id FROM new_prod), '1 kg', 1100, 1250, 10, 'CRAB-1KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Loitta Maach (Bombay Duck)', 'Soft & melt-in-mouth Loitta fish for Loitta Shutki / Loitta Macher Jhuro.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', 150, 180, '250g', 35, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g', 150, 180, 35, 'LOITTA-250G', true),
  ((SELECT id FROM new_prod), '500g', 280, 340, 30, 'LOITTA-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Shol Maach Curry Cut', 'Fresh Shol fish cut into curry pieces for Shol Kopia or Aam Shol.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', 250, 290, '250g', 25, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g', 250, 290, 25, 'SHOL-250G', true),
  ((SELECT id FROM new_prod), '500g', 480, 550, 20, 'SHOL-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Topshe Maach (Mango Fish)', 'Crispy frying favourite Topshe fish cleaned for Topshe Fry with Kasundi.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80', 280, 320, '250g', 22, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g', 280, 320, 22, 'TOPSHE-250G', true),
  ((SELECT id FROM new_prod), '500g', 540, 600, 18, 'TOPSHE-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Nona Ilish (Salted Hilsa)', 'Traditionally preserved salted Hilsa for Nona Ilish Bhorta with mustard oil & chillies.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', 650, 750, '250g', 15, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g', 650, 750, 15, 'NONAILISH-250G', true),
  ((SELECT id FROM new_prod), '500g', 1250, 1400, 10, 'NONAILISH-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Chingri Shutki (Dried Shrimps)', 'Sun-dried small shrimp for Bengali Shutki Bhorta & Charchari.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1559742811-822863c46f43?auto=format&fit=crop&w=600&q=80', 240, 290, '200g', 40, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '200g', 240, 290, 40, 'CHINGRISHUTKI-200G', true),
  ((SELECT id FROM new_prod), '500g', 550, 650, 25, 'CHINGRISHUTKI-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Loitta Shutki (Dried Bombay Duck)', 'Dried Loitta fish for spicy Kolkata shutki bhuna.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', 220, 260, '200g', 35, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '200g', 220, 260, 35, 'LOITTASHUTKI-200G', true),
  ((SELECT id FROM new_prod), '500g', 500, 600, 20, 'LOITTASHUTKI-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Bengal Khasi Mutton (Goat Meat)', 'Tender Bengal Goat Meat (Riwaj Khasi Mutton) for Kosha Mangsho.', 'Mutton & Poultry', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', 460, 520, '500g Curry Cut', 40, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g Curry Cut', 460, 520, 40, 'MUTTON-500G', true),
  ((SELECT id FROM new_prod), '1 kg Curry Cut', 880, 980, 35, 'MUTTON-1KG', true),
  ((SELECT id FROM new_prod), '500g Nalli & Shank', 490, 550, 25, 'MUTTON-NALLI', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Mutton Boneless Lean', 'Trimmed boneless goat meat for Mutton Keema, Pasanda, or Mutton Seekh Kebab.', 'Mutton & Poultry', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', 580, 650, '500g', 20, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g', 580, 650, 20, 'MUTTON-BONELESS-500G', true),
  ((SELECT id FROM new_prod), '1 kg', 1120, 1250, 15, 'MUTTON-BONELESS-1KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Mutton Mince (Keema)', 'Freshly ground goat meat mince for Mutton Cutlet, Ghugni or Keema Matar.', 'Mutton & Poultry', 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80', 270, 310, '250g', 30, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g', 270, 310, 30, 'KEEMA-250G', true),
  ((SELECT id FROM new_prod), '500g', 520, 580, 25, 'KEEMA-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Mutton Ribs & Chops (Chaap Cuts)', 'Flattened ribs & chops ideal for Kolkata style Mutton Chaap.', 'Mutton & Poultry', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', 510, 570, '500g', 18, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g', 510, 570, 18, 'CHAAP-500G', true),
  ((SELECT id FROM new_prod), '1 kg', 980, 1100, 15, 'CHAAP-1KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Desi Murgi (Country Chicken)', 'Free-range organic Country Chicken cut with bones for rich Murgir Jhol.', 'Mutton & Poultry', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', 220, 250, '500g', 30, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g', 220, 250, 30, 'DESICHK-500G', true),
  ((SELECT id FROM new_prod), '1 kg', 420, 480, 30, 'DESICHK-1KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Fresh Broiler Chicken (Skinless)', 'Tender chicken cut into medium curry pieces for Murgir Jhol and Roast.', 'Mutton & Poultry', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', 130, 150, '500g', 60, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g', 130, 150, 60, 'CHK-500G', true),
  ((SELECT id FROM new_prod), '1 kg', 240, 280, 50, 'CHK-1KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Chicken Boneless Breast Fillets', 'Lean, skinless chicken breast fillets for Chicken Tikka, Rolls & Stir Fry.', 'Mutton & Poultry', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80', 110, 130, '250g', 50, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g', 110, 130, 50, 'CHKBREAST-250G', true),
  ((SELECT id FROM new_prod), '500g', 210, 250, 45, 'CHKBREAST-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Chicken Drumsticks (Legs)', 'Juicy chicken leg drumsticks for Tandoori Chicken & Tangdi Kebab.', 'Mutton & Poultry', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', 190, 230, '500g (4-5 pcs)', 40, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g (4-5 pcs)', 190, 230, 40, 'DRUM-500G', true),
  ((SELECT id FROM new_prod), '1 kg', 360, 430, 30, 'DRUM-1KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Chicken Mince (Keema)', 'Ground chicken breast for Chicken Momos, Cutlets & Burgers.', 'Mutton & Poultry', 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80', 95, 115, '250g', 40, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g', 95, 115, 40, 'CHKKEEMA-250G', true),
  ((SELECT id FROM new_prod), '500g', 180, 220, 30, 'CHKKEEMA-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Duck Meat (Hnahsh)', 'Fresh duck meat cleaned and cut for traditional Assamese / Bengali Duck Curry.', 'Mutton & Poultry', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', 320, 360, '500g', 15, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g', 320, 360, 15, 'DUCK-500G', true),
  ((SELECT id FROM new_prod), '1 kg', 620, 700, 12, 'DUCK-1KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Quail Meat (Koyel Pakhi)', 'Whole cleaned Quail birds for Koyel Pakhi Kosha.', 'Mutton & Poultry', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', 340, 400, '2 Birds (350g)', 15, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '2 Birds (350g)', 340, 400, 15, 'QUAIL-2PCS', true),
  ((SELECT id FROM new_prod), '4 Birds (700g)', 650, 760, 10, 'QUAIL-4PCS', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Chicken Wings Crispy Cut', 'Juicy chicken wings for BBQ or spicy Bengali fried chicken.', 'Mutton & Poultry', 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80', 160, 200, '500g', 35, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g', 160, 200, 35, 'WINGS-500G', true),
  ((SELECT id FROM new_prod), '1 kg', 300, 380, 25, 'WINGS-1KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Mutton Brain (Mogoj)', 'Goat brain for Mutton Mogoj Fry or Mogoj Bhuna.', 'Mutton & Poultry', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', 280, 320, '2 Sets', 10, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '2 Sets', 280, 320, 10, 'MOGOJ-2PCS', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Mutton Liver (Kolija) & Kidney', 'Fresh goat liver & kidney cut for Mutton Kolija Bhuna.', 'Mutton & Poultry', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', 170, 200, '250g', 20, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g', 170, 200, 20, 'KOLIJA-250G', true),
  ((SELECT id FROM new_prod), '500g', 320, 370, 15, 'KOLIJA-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Broiler Chicken Lollipop', 'French trimmed chicken winglets for Crispy Chicken Lollipop.', 'Mutton & Poultry', 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80', 220, 260, '500g (10-12 pcs)', 30, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g (10-12 pcs)', 220, 260, 30, 'LOLLIPOP-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Gobindobhog Rice (Special Aromatic)', 'Aromatic short-grain Gobindobhog rice essential for Khichuri & Payesh.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 70, 80, '500g', 80, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g', 70, 80, 80, 'GOBINDO-500G', true),
  ((SELECT id FROM new_prod), '1 kg', 130, 150, 100, 'GOBINDO-1KG', true),
  ((SELECT id FROM new_prod), '5 kg Pack', 620, 720, 40, 'GOBINDO-5KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Fortune Kachi Ghani Pure Mustard Oil', 'Cold-pressed Mustard Oil for authentic fish & meat cooking.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', 98, 110, '500ml Bottle', 70, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500ml Bottle', 98, 110, 70, 'MUSTARD-500ML', true),
  ((SELECT id FROM new_prod), '1 Litre Bottle', 185, 210, 80, 'MUSTARD-1L', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Jharna Pure Cow Ghee', 'Authentic Jharna Ghee with granular texture and divine fragrance.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=600&q=80', 210, 235, '200ml Jar', 50, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '200ml Jar', 210, 235, 50, 'JHARNA-200ML', true),
  ((SELECT id FROM new_prod), '500ml Jar', 490, 540, 60, 'JHARNA-500ML', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('White Posto (Poppy Seeds)', 'Pure white Poppy Seeds for Alu Posto, Posto Murgi & Posto Bora.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', 215, 245, '100g Pack', 50, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '100g Pack', 215, 245, 50, 'POSTO-100G', true),
  ((SELECT id FROM new_prod), '200g Pack', 420, 480, 40, 'POSTO-200G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Radhuni Spice (Wild Celery Seed)', 'Essential spice for authentic Bengali Panch Phoron and Shukto.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', 85, 100, '100g Pack', 50, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '100g Pack', 85, 100, 50, 'RADHUNI-100G', true),
  ((SELECT id FROM new_prod), '250g Pack', 195, 230, 35, 'RADHUNI-250G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Panch Phoron (Bengali 5-Spice)', 'Classic blend of Radhuni, Cumin, Mustard, Fennel & Fenugreek seeds.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', 35, 45, '100g Pack', 70, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '100g Pack', 35, 45, 70, 'PANCHPHORON-100G', true),
  ((SELECT id FROM new_prod), '200g Pack', 65, 80, 65, 'PANCHPHORON-200G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Mukhorochak Chanachur Tok Jhal', 'Iconic Kolkata spicy and sweet evening snack chanachur.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', 50, 60, '150g Pack', 80, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '150g Pack', 50, 60, 80, 'MUKHO-150G', true),
  ((SELECT id FROM new_prod), '300g Pack', 95, 110, 75, 'MUKHO-300G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Kolkata Biryani Meetha Attar', 'Aromatic Biryani essence for genuine Kolkata Mughlai Mutton Biryani flavor.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80', 120, 140, '25ml Bottle', 30, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '25ml Bottle', 120, 140, 30, 'ATTAR-25ML', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Sona Moong Dal Roasted', 'Golden roasted Moong Dal for Bhaja Moonger Dal with Fish Head (Muri Ghonto).', 'Bengali Groceries', 'https://images.unsplash.com/photo-1585992227540-7048c161c92e?auto=format&fit=crop&w=600&q=80', 75, 90, '500g', 60, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g', 75, 90, 60, 'MOONG-500G', true),
  ((SELECT id FROM new_prod), '1 kg', 140, 165, 50, 'MOONG-1KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Biulir Dal Split', 'Split skinless Urad Dal for traditional Bengali Biulir Dal & Aloo Posto combo.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1585992227540-7048c161c92e?auto=format&fit=crop&w=600&q=80', 85, 100, '500g', 50, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g', 85, 100, 50, 'BIULI-500G', true),
  ((SELECT id FROM new_prod), '1 kg', 160, 185, 45, 'BIULI-1KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Cholar Dal (Chana Dal)', 'Premium Chana Dal for Bengali Cholar Dal with Narkel (Coconut) & Luchi.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1585992227540-7048c161c92e?auto=format&fit=crop&w=600&q=80', 60, 70, '500g', 70, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g', 60, 70, 70, 'CHOLAR-500G', true),
  ((SELECT id FROM new_prod), '1 kg', 110, 130, 60, 'CHOLAR-1KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Minikit Parboiled Rice', 'Long grain, light and non-sticky Bengali boiled rice.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 72, 85, '1 kg', 120, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '1 kg', 72, 85, 120, 'MINIKIT-1KG', true),
  ((SELECT id FROM new_prod), '5 kg Pack', 345, 410, 50, 'MINIKIT-5KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Kalo Nun Rice Black Pearl', 'Rare aromatic heirloom rice from North Bengal for special Pulao.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 95, 110, '500g', 30, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g', 95, 110, 30, 'KALONUN-500G', true),
  ((SELECT id FROM new_prod), '1 kg', 180, 210, 25, 'KALONUN-1KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Yellow Mustard Seeds (Shorshe)', 'Cleaned yellow mustard seeds for Shorshe Bata paste.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', 70, 85, '250g Pack', 50, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g Pack', 70, 85, 50, 'YELLOWSHORSHE-250G', true),
  ((SELECT id FROM new_prod), '500g Pack', 130, 160, 40, 'YELLOWSHORSHE-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Black Mustard Seeds (Rai)', 'Pungent dark mustard seeds for tempering.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', 60, 75, '250g Pack', 50, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g Pack', 60, 75, 50, 'BLACKSHORSHE-250G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Bhaja Masala Roasted Powder', 'Handmade roasted spice blend for Chutney, Phuchka & Alur Dom.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', 90, 110, '150g Jar', 40, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '150g Jar', 90, 110, 40, 'BHAJA-150G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Shukto Masala Mix', 'Pre-mixed traditional spice blend for bitter gourmand Shukto gravy.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', 80, 95, '100g Pack', 35, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '100g Pack', 80, 95, 35, 'SHUKTO-100G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Tejpata (Indian Bay Leaves)', 'Fragrant dried bay leaves essential for meat and curries.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', 45, 60, '100g Pack', 60, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '100g Pack', 45, 60, 60, 'TEJPATA-100G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Gorom Masala Whole Spice', 'Whole Cardamom, Clove & Cinnamon stick blend for rich gravy.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', 150, 180, '100g Pack', 45, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '100g Pack', 150, 180, 45, 'GOROM-100G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Muri (Kolkata Puffed Rice)', 'Light and crunchy Bengali puffed rice for Jhalmuri and Telebhaja.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', 55, 70, '500g Pack', 80, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g Pack', 55, 70, 80, 'MURI-500G', true),
  ((SELECT id FROM new_prod), '1 kg Pack', 100, 130, 60, 'MURI-1KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Chira (Flattened Rice Thick)', 'Thick flattened rice for Dahi Chira & evening breakfast.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 60, 75, '500g Pack', 70, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g Pack', 60, 75, 70, 'CHIRA-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Amsotto (Mango Bar)', 'Sweet and tangy dried mango leather for Chutney and Payesh.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', 140, 165, '200g Pack', 35, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '200g Pack', 140, 165, 35, 'AMSOTTO-200G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Khejurer Gur (Date Palm Jaggery Block)', 'Pure winter Khejur Gur block for Payesh and Pithe.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 120, 140, '250g Block', 40, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g Block', 120, 140, 40, 'GUR-250G', true),
  ((SELECT id FROM new_prod), '500g Block', 220, 260, 30, 'GUR-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Nolen Gur Liquid Syrup', 'Fragrant liquid Nolen Gur syrup for drizzling over Roshogolla & ice cream.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 150, 175, '250ml Bottle', 35, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250ml Bottle', 150, 175, 35, 'NOLENGUR-250ML', true),
  ((SELECT id FROM new_prod), '500ml Bottle', 280, 320, 25, 'NOLENGUR-500ML', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Fresh Chana Cottage Cheese', 'Fresh homemade soft Chana for Sandesh, Rosogolla, or Chanar Dalna.', 'Bengali Groceries', 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=600&q=80', 100, 120, '250g Pack', 30, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g Pack', 100, 120, 30, 'CHANA-250G', true),
  ((SELECT id FROM new_prod), '500g Pack', 190, 220, 20, 'CHANA-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Kolkata Sponge Roshogolla', 'Soft, spongy chana balls soaked in light cardamom syrup.', 'Authentic Mishti & Sweets', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 150, 175, '500g Can', 50, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g Can', 150, 175, 50, 'ROSOGolla-500G', true),
  ((SELECT id FROM new_prod), '1 kg Matka', 280, 320, 40, 'ROSOGolla-1KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Nolen Gur Roshogolla', 'Winter special Rosogolla soaked in aromatic Date Palm Jaggery syrup.', 'Authentic Mishti & Sweets', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 180, 210, '500g Can', 40, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g Can', 180, 210, 40, 'NOLENROSO-500G', true),
  ((SELECT id FROM new_prod), '1 kg Can', 340, 390, 30, 'NOLENROSO-1KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Traditional Mishti Doi', 'Creamy clay matka setting sweet caramelized fermented doi.', 'Authentic Mishti & Sweets', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 95, 110, '250g Clay Pot', 40, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g Clay Pot', 95, 110, 40, 'DOI-250G', true),
  ((SELECT id FROM new_prod), '500g Clay Pot', 180, 210, 35, 'DOI-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Gulab Jamun / Pantua', 'Golden fried chana & khoya dumplings soaked in rose syrup.', 'Authentic Mishti & Sweets', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 135, 160, '250g Pack', 35, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g Pack', 135, 160, 35, 'PANTUA-250G', true),
  ((SELECT id FROM new_prod), '500g Pack', 260, 300, 30, 'PANTUA-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Rajbhog (Kesar Stuffed Rosogolla)', 'Jumbo Rosogolla stuffed with dry fruits and saffron.', 'Authentic Mishti & Sweets', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 320, 360, '500g (6 pcs)', 25, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g (6 pcs)', 320, 360, 25, 'RAJBHOG-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Nolen Gur Sandesh', 'Fresh cottage cheese sweets flavoured with rich Nolen Gur.', 'Authentic Mishti & Sweets', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 290, 340, '250g Box', 20, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g Box', 290, 340, 20, 'NOLENSANDESH-250G', true),
  ((SELECT id FROM new_prod), '500g Box', 560, 650, 15, 'NOLENSANDESH-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Kanchagolla Sandesh', 'Soft & melt-in-mouth unbaked fresh chana sandesh.', 'Authentic Mishti & Sweets', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 270, 310, '250g Box', 20, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g Box', 270, 310, 20, 'KANCHA-250G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Sitabhog & Mihidana Combo', 'Authentic Burdwan special sweet vermicelli and tiny sweet pearls.', 'Authentic Mishti & Sweets', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 310, 350, '400g Box', 18, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '400g Box', 310, 350, 18, 'BURDWAN-400G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Langcha Shaktigarh', 'Elongated deep fried chana sweets soaked in thick cardamom syrup.', 'Authentic Mishti & Sweets', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 135, 160, '250g Pack', 25, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g Pack', 135, 160, 25, 'LANGCHA-250G', true),
  ((SELECT id FROM new_prod), '500g Pack', 260, 300, 22, 'LANGCHA-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Kheer Kadam', 'Double layered sweet with a mini Rosogolla inside a khoya shell.', 'Authentic Mishti & Sweets', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 300, 340, '300g Box', 20, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '300g Box', 300, 340, 20, 'KHEERKADAM-300G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Malpua Ghee Fried', 'Fluffy aniseed flavoured pancakes fried in ghee & dipped in syrup.', 'Authentic Mishti & Sweets', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 240, 280, '6 pcs Pack', 15, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '6 pcs Pack', 240, 280, 15, 'MALPUA-6PCS', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Patishapta Pithe', 'Delicate crepes stuffed with kheer & coconut jaggery mixture.', 'Authentic Mishti & Sweets', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 280, 320, '6 pcs Pack', 12, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '6 pcs Pack', 280, 320, 12, 'PATISHAPTA-6PCS', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Chana Payesh Kheer', 'Rich condensed milk payesh studded with mini chana dumplings.', 'Authentic Mishti & Sweets', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 250, 290, '400g Tub', 15, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '400g Tub', 250, 290, 15, 'CHANAPAYESH-400G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Chamcham Oval Sweet', 'Traditional saffron & pistachio garnished juicy sweet.', 'Authentic Mishti & Sweets', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 270, 310, '500g Box', 20, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g Box', 270, 310, 20, 'CHAMCHAM-500G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Shor Bhaja Krishnanagar', 'Layered milk cream fried sweet soaked in sugar syrup.', 'Authentic Mishti & Sweets', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 360, 410, '300g Box', 10, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '300g Box', 360, 410, 10, 'SHORBHAJA-300G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Aam Kasundi Green Mango Sauce', 'Sharp, pungent mustard sauce blended with green mangoes for fish & snacks.', 'Pickles & Kasundi', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', 160, 190, '350g Glass Jar', 50, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '350g Glass Jar', 160, 190, 50, 'AAMKASUNDI-350G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Traditional Mustard Kasundi Dip', 'Classic Kolkata mustard dip for chops, cutlets, and Bhetki fry.', 'Pickles & Kasundi', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', 140, 170, '350g Glass Jar', 60, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '350g Glass Jar', 140, 170, 60, 'KASUNDI-350G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Aam Tel Achar Pickle', 'Raw mango slices preserved in pure mustard oil and roasted spices.', 'Pickles & Kasundi', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', 180, 210, '400g Jar', 40, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '400g Jar', 180, 210, 40, 'AAMTEL-400G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Boroi Achar Dried Jujube', 'Sweet and sour dried jujube plum pickle with jaggery and chilli.', 'Pickles & Kasundi', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', 150, 180, '300g Jar', 30, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '300g Jar', 150, 180, 30, 'BOROI-300G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Jalpai Achar Olive Pickle', 'Tangy Indian wild olive pickle steeped in roasted panch phoron.', 'Pickles & Kasundi', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', 170, 200, '350g Jar', 25, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '350g Jar', 170, 200, 25, 'JALPAI-350G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Tetul Achar Tamarind Pickle', 'Rich dark tamarind pickle cooked with Date Jaggery and Bhaja Masala.', 'Pickles & Kasundi', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', 160, 190, '300g Jar', 35, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '300g Jar', 160, 190, 35, 'TETUL-300G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Amra Achar Hog Plum', 'Spicy hog plum pickle in mustard oil broth.', 'Pickles & Kasundi', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', 165, 195, '350g Jar', 20, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '350g Jar', 165, 195, 20, 'AMRA-350G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Tomato Khejur Amsotto Chutney', 'Ready-to-eat sweet tomato chutney cooked with dates and mango leather.', 'Pickles & Kasundi', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', 190, 220, '350g Jar', 30, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '350g Jar', 190, 220, 30, 'TOMATOCHUTNEY-350G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Kancha Aam Sweet Chutney', 'Golden sweet green mango preserve with cardamom.', 'Pickles & Kasundi', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', 175, 205, '350g Jar', 25, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '350g Jar', 175, 205, 25, 'KANCHAAAM-350G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Lanka Shorshe Chilli Pickle', 'Fiery green chillies stuffed with mustard paste and spices.', 'Pickles & Kasundi', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', 150, 180, '300g Jar', 35, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '300g Jar', 150, 180, 35, 'LANKA-300G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Goyna Badi Midnapore Art', 'Traditional ornamentally shaped lentil crisps fried in ghee.', 'Traditional Badi & Snacks', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', 180, 220, '150g Box', 25, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '150g Box', 180, 220, 25, 'GOYNA-150G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Kumro Badi Pumpkin Seed', 'Lentil dumplings prepared with pumpkin pulp for Macher Jhol and Lau Ghonto.', 'Traditional Badi & Snacks', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', 110, 130, '250g Pack', 45, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g Pack', 110, 130, 45, 'KUMROBADI-250G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Biulir Daler Masala Badi', 'Spiced urad dal sun-dried dumplings with hing and black pepper.', 'Traditional Badi & Snacks', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', 120, 145, '250g Pack', 40, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g Pack', 120, 145, 40, 'BIULIBADI-250G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Dhokar Dalna Ready Mix', 'Pre-seasoned lentil cake batter mix for quick Dhokar Dalna curry.', 'Traditional Badi & Snacks', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', 95, 115, '200g Pack', 35, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '200g Pack', 95, 115, 35, 'DHOKA-200G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Cleaned Thor Banana Stem', 'Freshly chopped banana stem packed for Thor Ghonto.', 'Traditional Badi & Snacks', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', 75, 90, '400g Pack', 20, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '400g Pack', 75, 90, 20, 'THOR-400G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Cleaned Mocha Banana Flower', 'Pre-cleaned and chopped banana flower for Mocha Ghonto or Mocha Chop.', 'Traditional Badi & Snacks', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', 85, 100, '400g Pack', 20, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '400g Pack', 85, 100, 20, 'MOCHA-400G', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Kolkata Bhetki Fish Fry Cutlets', 'Marinated Bhetki fillets coated in breadcrumbs, ready to deep fry.', 'Traditional Badi & Snacks', 'https://images.unsplash.com/photo-1535567465397-7523840f2ae9?auto=format&fit=crop&w=600&q=80', 360, 420, '4 pcs Frozen Pack', 30, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '4 pcs Frozen Pack', 360, 420, 30, 'FISHFRY-4PCS', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Fish Kabiraji Patties', 'Spiced fish patties for egg-net Kabiraji fry.', 'Traditional Badi & Snacks', 'https://images.unsplash.com/photo-1535567465397-7523840f2ae9?auto=format&fit=crop&w=600&q=80', 320, 380, '4 pcs Pack', 25, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '4 pcs Pack', 320, 380, 25, 'KABIRAJI-4PCS', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Chingri Chop Patties', 'Minced prawn and potato spiced croquettes ready to fry.', 'Traditional Badi & Snacks', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', 280, 330, '6 pcs Pack', 25, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '6 pcs Pack', 280, 330, 25, 'CHINGRICHOP-6PCS', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Beguni & Chop Batter Mix', 'Crispy gram flour (besan) spice mix for Kolkata Telebhaja.', 'Traditional Badi & Snacks', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', 65, 80, '250g Pack', 50, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g Pack', 65, 80, 50, 'BEGUNI-250G', true);

