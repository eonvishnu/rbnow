-- Re-create product & product_variants tables
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

-- Insert Parent Products & Child Variants
WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Padma Hilsa (Ilish) - Whole & Cut', 'Fresh Padma River Hilsa fish known for rich oil and melting aroma.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', 1050, 1200, '500g Steaks', 30, true)
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
    VALUES ('Fresh Rohu (Rui) - Curry Cut', 'Cleaned freshwater Rohu steaks ideal for everyday light cumin & ginger macher jhol.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80', 190, 220, '500g', 45, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g', 190, 220, 45, 'ROHU-500G', true),
  ((SELECT id FROM new_prod), '1 kg', 360, 420, 60, 'ROHU-1KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Bhetki Fillet (Barramundi)', 'Premium boneless Bhetki fish fillet for Kolkata Fish Fry, Fish Kabiraji & Tikka.', 'Fresh Fish & Seafood', 'https://images.unsplash.com/photo-1535567465397-7523840f2ae9?auto=format&fit=crop&w=600&q=80', 350, 390, '250g Cubes', 30, true)
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
    VALUES ('Kolkata Sponge Roshogolla', 'Soft, spongy chana balls soaked in light cardamom syrup.', 'Authentic Mishti & Sweets', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 150, 175, '500g Can (6 pcs)', 50, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '500g Can (6 pcs)', 150, 175, 50, 'ROSOGolla-500G', true),
  ((SELECT id FROM new_prod), '1 kg Matka / Can', 280, 320, 40, 'ROSOGolla-1KG', true);

WITH new_prod AS (
    INSERT INTO public.products (name, description, category_name, image_url, price, original_price, unit, stock, is_available)
    VALUES ('Traditional Mishti Doi', 'Creamy clay matka setting sweet caramelized fermented doi.', 'Authentic Mishti & Sweets', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', 95, 110, '250g Matka', 40, true)
    RETURNING id
  )
  INSERT INTO public.product_variants (product_id, unit, price, original_price, stock, sku, is_available)
  VALUES
  ((SELECT id FROM new_prod), '250g Matka', 95, 110, 40, 'DOI-250G', true),
  ((SELECT id FROM new_prod), '500g Matka', 180, 210, 35, 'DOI-500G', true);

