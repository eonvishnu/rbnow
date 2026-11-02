-- SEED 250 PRODUCTS & VARIANTS ATOMICALLY IN SUPABASE

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


  -- Product 1: Katla Fish - Gada Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Katla Fish - Gada Cut', 'Fresh boutique catch: Katla Fish - Gada Cut. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 120, 30),
    (v_pid, '500g', 220, 25),
    (v_pid, '1 kg', 420, 15);

  -- Product 2: Katla Fish - Peti Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Katla Fish - Peti Cut', 'Fresh boutique catch: Katla Fish - Peti Cut. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 127, 33),
    (v_pid, '500g', 233, 27),
    (v_pid, '1 kg', 443, 16);

  -- Product 3: Rohu Fish - Bengali Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Rohu Fish - Bengali Cut', 'Fresh boutique catch: Rohu Fish - Bengali Cut. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 134, 36),
    (v_pid, '500g', 246, 29),
    (v_pid, '1 kg', 466, 17);

  -- Product 4: Rohu Fish - Head Piece
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Rohu Fish - Head Piece', 'Fresh boutique catch: Rohu Fish - Head Piece. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 141, 39),
    (v_pid, '500g', 259, 31),
    (v_pid, '1 kg', 489, 18);

  -- Product 5: Padma Hilsa (Ilish) - Premium Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Padma Hilsa (Ilish) - Premium Cut', 'Fresh boutique catch: Padma Hilsa (Ilish) - Premium Cut. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 148, 42),
    (v_pid, '500g', 272, 33),
    (v_pid, '1 kg', 512, 19);

  -- Product 6: Padma Hilsa Whole (1.2kg)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Padma Hilsa Whole (1.2kg)', 'Fresh boutique catch: Padma Hilsa Whole (1.2kg). Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 155, 45),
    (v_pid, '500g', 285, 35),
    (v_pid, '1 kg', 535, 20);

  -- Product 7: Freshwater Pabda Fish
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Freshwater Pabda Fish', 'Fresh boutique catch: Freshwater Pabda Fish. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 162, 48),
    (v_pid, '500g', 298, 37),
    (v_pid, '1 kg', 558, 21);

  -- Product 8: Jumbo Tiger Prawns (Cleaned)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Jumbo Tiger Prawns (Cleaned)', 'Fresh boutique catch: Jumbo Tiger Prawns (Cleaned). Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 169, 51),
    (v_pid, '500g', 311, 39),
    (v_pid, '1 kg', 581, 22);

  -- Product 9: Medium White Prawns (Peeled)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Medium White Prawns (Peeled)', 'Fresh boutique catch: Medium White Prawns (Peeled). Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 176, 54),
    (v_pid, '500g', 324, 41),
    (v_pid, '1 kg', 604, 23);

  -- Product 10: Fresh Mud Crabs (Live Cut)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Fresh Mud Crabs (Live Cut)', 'Fresh boutique catch: Fresh Mud Crabs (Live Cut). Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 183, 57),
    (v_pid, '500g', 337, 43),
    (v_pid, '1 kg', 627, 24);

  -- Product 11: Kolkata Bhetki Fillet (Boneless)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Kolkata Bhetki Fillet (Boneless)', 'Fresh boutique catch: Kolkata Bhetki Fillet (Boneless). Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 190, 60),
    (v_pid, '500g', 350, 45),
    (v_pid, '1 kg', 650, 25);

  -- Product 12: Parshe Fish Cleaned
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Parshe Fish Cleaned', 'Fresh boutique catch: Parshe Fish Cleaned. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 197, 63),
    (v_pid, '500g', 363, 47),
    (v_pid, '1 kg', 673, 26);

  -- Product 13: Tangra Fish Fresh
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Tangra Fish Fresh', 'Fresh boutique catch: Tangra Fish Fresh. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 204, 66),
    (v_pid, '500g', 376, 49),
    (v_pid, '1 kg', 696, 27);

  -- Product 14: Chital Fish Muitha Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chital Fish Muitha Cut', 'Fresh boutique catch: Chital Fish Muitha Cut. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 211, 69),
    (v_pid, '500g', 389, 51),
    (v_pid, '1 kg', 719, 28);

  -- Product 15: Koi Fish (Living)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Koi Fish (Living)', 'Fresh boutique catch: Koi Fish (Living). Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 218, 32),
    (v_pid, '500g', 402, 53),
    (v_pid, '1 kg', 742, 29);

  -- Product 16: Silver Pomfret Whole
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Silver Pomfret Whole', 'Fresh boutique catch: Silver Pomfret Whole. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 225, 35),
    (v_pid, '500g', 415, 25),
    (v_pid, '1 kg', 765, 30);

  -- Product 17: Black Pomfret Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Black Pomfret Cut', 'Fresh boutique catch: Black Pomfret Cut. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 232, 38),
    (v_pid, '500g', 428, 27),
    (v_pid, '1 kg', 788, 31);

  -- Product 18: Fresh Salmon Fillet
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Fresh Salmon Fillet', 'Fresh boutique catch: Fresh Salmon Fillet. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 239, 41),
    (v_pid, '500g', 441, 29),
    (v_pid, '1 kg', 811, 32);

  -- Product 19: Tuna Fish Steak
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Tuna Fish Steak', 'Fresh boutique catch: Tuna Fish Steak. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 246, 44),
    (v_pid, '500g', 454, 31),
    (v_pid, '1 kg', 834, 33);

  -- Product 20: Sardines Fresh Cleaned
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Sardines Fresh Cleaned', 'Fresh boutique catch: Sardines Fresh Cleaned. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 253, 47),
    (v_pid, '500g', 467, 33),
    (v_pid, '1 kg', 857, 34);

  -- Product 21: Indian Mackerel (Bangda)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Indian Mackerel (Bangda)', 'Fresh boutique catch: Indian Mackerel (Bangda). Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 260, 50),
    (v_pid, '500g', 480, 35),
    (v_pid, '1 kg', 880, 15);

  -- Product 22: Squid Rings Cleaned
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Squid Rings Cleaned', 'Fresh boutique catch: Squid Rings Cleaned. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 267, 53),
    (v_pid, '500g', 493, 37),
    (v_pid, '1 kg', 903, 16);

  -- Product 23: Fresh Octopus Cuts
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Fresh Octopus Cuts', 'Fresh boutique catch: Fresh Octopus Cuts. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 274, 56),
    (v_pid, '500g', 506, 39),
    (v_pid, '1 kg', 926, 17);

  -- Product 24: Lobster Whole (500g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Lobster Whole (500g)', 'Fresh boutique catch: Lobster Whole (500g). Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 281, 59),
    (v_pid, '500g', 519, 41),
    (v_pid, '1 kg', 949, 18);

  -- Product 25: Basa Fish Fillet Boneless
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Basa Fish Fillet Boneless', 'Fresh boutique catch: Basa Fish Fillet Boneless. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 288, 62),
    (v_pid, '500g', 532, 43),
    (v_pid, '1 kg', 972, 19);

  -- Product 26: Mahi Mahi Steak
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Mahi Mahi Steak', 'Fresh boutique catch: Mahi Mahi Steak. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 295, 65),
    (v_pid, '500g', 545, 45),
    (v_pid, '1 kg', 995, 20);

  -- Product 27: Seer Fish (Surmai) Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Seer Fish (Surmai) Cut', 'Fresh boutique catch: Seer Fish (Surmai) Cut. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 302, 68),
    (v_pid, '500g', 558, 47),
    (v_pid, '1 kg', 1018, 21);

  -- Product 28: Anchovies (Nethili) Cleaned
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Anchovies (Nethili) Cleaned', 'Fresh boutique catch: Anchovies (Nethili) Cleaned. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 309, 31),
    (v_pid, '500g', 571, 49),
    (v_pid, '1 kg', 1041, 22);

  -- Product 29: Red Snapper Whole
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Red Snapper Whole', 'Fresh boutique catch: Red Snapper Whole. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 316, 34),
    (v_pid, '500g', 584, 51),
    (v_pid, '1 kg', 1064, 23);

  -- Product 30: Grouper Fish Fillet
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Grouper Fish Fillet', 'Fresh boutique catch: Grouper Fish Fillet. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 323, 37),
    (v_pid, '500g', 597, 53),
    (v_pid, '1 kg', 1087, 24);

  -- Product 31: Sole Fish Fillet
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Sole Fish Fillet', 'Fresh boutique catch: Sole Fish Fillet. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 330, 40),
    (v_pid, '500g', 610, 25),
    (v_pid, '1 kg', 1110, 25);

  -- Product 32: Ribbon Fish Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Ribbon Fish Cut', 'Fresh boutique catch: Ribbon Fish Cut. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 337, 43),
    (v_pid, '500g', 623, 27),
    (v_pid, '1 kg', 1133, 26);

  -- Product 33: Tilapia Fish Cleaned
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Tilapia Fish Cleaned', 'Fresh boutique catch: Tilapia Fish Cleaned. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 344, 46),
    (v_pid, '500g', 636, 29),
    (v_pid, '1 kg', 1156, 27);

  -- Product 34: Clams (Teesrye) Cleaned
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Clams (Teesrye) Cleaned', 'Fresh boutique catch: Clams (Teesrye) Cleaned. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 351, 49),
    (v_pid, '500g', 649, 31),
    (v_pid, '1 kg', 1179, 28);

  -- Product 35: Mussels Fresh
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Mussels Fresh', 'Fresh boutique catch: Mussels Fresh. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 358, 52),
    (v_pid, '500g', 662, 33),
    (v_pid, '1 kg', 1202, 29);

  -- Product 36: Crab Meat Lump
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Crab Meat Lump', 'Fresh boutique catch: Crab Meat Lump. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 365, 55),
    (v_pid, '500g', 675, 35),
    (v_pid, '1 kg', 1225, 30);

  -- Product 37: Prawns Small (Kadiye)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Prawns Small (Kadiye)', 'Fresh boutique catch: Prawns Small (Kadiye). Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 372, 58),
    (v_pid, '500g', 688, 37),
    (v_pid, '1 kg', 1248, 31);

  -- Product 38: Galda Chingri (Giant Freshwater)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Galda Chingri (Giant Freshwater)', 'Fresh boutique catch: Galda Chingri (Giant Freshwater). Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 379, 61),
    (v_pid, '500g', 701, 39),
    (v_pid, '1 kg', 1271, 32);

  -- Product 39: Bagda Chingri (Tiger Prawn)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Bagda Chingri (Tiger Prawn)', 'Fresh boutique catch: Bagda Chingri (Tiger Prawn). Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 386, 64),
    (v_pid, '500g', 714, 41),
    (v_pid, '1 kg', 1294, 33);

  -- Product 40: Topse Fish Cleaned
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Topse Fish Cleaned', 'Fresh boutique catch: Topse Fish Cleaned. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 393, 67),
    (v_pid, '500g', 227, 43),
    (v_pid, '1 kg', 1317, 34);

  -- Product 41: Aar Fish Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Aar Fish Cut', 'Fresh boutique catch: Aar Fish Cut. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 400, 30),
    (v_pid, '500g', 240, 45),
    (v_pid, '1 kg', 440, 15);

  -- Product 42: Boal Fish Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Boal Fish Cut', 'Fresh boutique catch: Boal Fish Cut. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 407, 33),
    (v_pid, '500g', 253, 47),
    (v_pid, '1 kg', 463, 16);

  -- Product 43: Bata Fish Fresh
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Bata Fish Fresh', 'Fresh boutique catch: Bata Fish Fresh. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 414, 36),
    (v_pid, '500g', 266, 49),
    (v_pid, '1 kg', 486, 17);

  -- Product 44: Singhi Fish Live
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Singhi Fish Live', 'Fresh boutique catch: Singhi Fish Live. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 121, 39),
    (v_pid, '500g', 279, 51),
    (v_pid, '1 kg', 509, 18);

  -- Product 45: Magur Fish Fresh
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Magur Fish Fresh', 'Fresh boutique catch: Magur Fish Fresh. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 128, 42),
    (v_pid, '500g', 292, 53),
    (v_pid, '1 kg', 532, 19);

  -- Product 46: Mourala Fish (Small Fry)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Mourala Fish (Small Fry)', 'Fresh boutique catch: Mourala Fish (Small Fry). Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 135, 45),
    (v_pid, '500g', 305, 25),
    (v_pid, '1 kg', 555, 20);

  -- Product 47: Shol Fish Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Shol Fish Cut', 'Fresh boutique catch: Shol Fish Cut. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 142, 48),
    (v_pid, '500g', 318, 27),
    (v_pid, '1 kg', 578, 21);

  -- Product 48: Lotte Fish (Bombay Duck)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Lotte Fish (Bombay Duck)', 'Fresh boutique catch: Lotte Fish (Bombay Duck). Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 149, 51),
    (v_pid, '500g', 331, 29),
    (v_pid, '1 kg', 601, 22);

  -- Product 49: Kokila Fish Cleaned
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Kokila Fish Cleaned', 'Fresh boutique catch: Kokila Fish Cleaned. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 156, 54),
    (v_pid, '500g', 344, 31),
    (v_pid, '1 kg', 624, 23);

  -- Product 50: Kajuli Fish Fresh
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Kajuli Fish Fresh', 'Fresh boutique catch: Kajuli Fish Fresh. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 163, 57),
    (v_pid, '500g', 357, 33),
    (v_pid, '1 kg', 647, 24);

  -- Product 51: Bhakut Fish Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Bhakut Fish Cut', 'Fresh boutique catch: Bhakut Fish Cut. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 170, 60),
    (v_pid, '500g', 370, 35),
    (v_pid, '1 kg', 670, 25);

  -- Product 52: Vetki Fish Whole
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Vetki Fish Whole', 'Fresh boutique catch: Vetki Fish Whole. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 177, 63),
    (v_pid, '500g', 383, 37),
    (v_pid, '1 kg', 693, 26);

  -- Product 53: Pearlspot (Karimeen)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Pearlspot (Karimeen)', 'Fresh boutique catch: Pearlspot (Karimeen). Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 184, 66),
    (v_pid, '500g', 396, 39),
    (v_pid, '1 kg', 716, 27);

  -- Product 54: Ladyfish (Kane) Cleaned
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Ladyfish (Kane) Cleaned', 'Fresh boutique catch: Ladyfish (Kane) Cleaned. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 191, 69),
    (v_pid, '500g', 409, 41),
    (v_pid, '1 kg', 739, 28);

  -- Product 55: Indian Salmon (Rawas) Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Indian Salmon (Rawas) Cut', 'Fresh boutique catch: Indian Salmon (Rawas) Cut. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 198, 32),
    (v_pid, '500g', 422, 43),
    (v_pid, '1 kg', 762, 29);

  -- Product 56: Milkfish Whole
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Milkfish Whole', 'Fresh boutique catch: Milkfish Whole. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 205, 35),
    (v_pid, '500g', 435, 45),
    (v_pid, '1 kg', 785, 30);

  -- Product 57: Mullet Fish Cleaned
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Mullet Fish Cleaned', 'Fresh boutique catch: Mullet Fish Cleaned. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 212, 38),
    (v_pid, '500g', 448, 47),
    (v_pid, '1 kg', 808, 31);

  -- Product 58: Cod Fish Fillet
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Cod Fish Fillet', 'Fresh boutique catch: Cod Fish Fillet. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 219, 41),
    (v_pid, '500g', 461, 49),
    (v_pid, '1 kg', 831, 32);

  -- Product 59: Haddock Fillet
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Haddock Fillet', 'Fresh boutique catch: Haddock Fillet. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 226, 44),
    (v_pid, '500g', 474, 51),
    (v_pid, '1 kg', 854, 33);

  -- Product 60: Halibut Steak
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Halibut Steak', 'Fresh boutique catch: Halibut Steak. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 233, 47),
    (v_pid, '500g', 487, 53),
    (v_pid, '1 kg', 877, 34);

  -- Product 61: Sea Bass Whole
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Sea Bass Whole', 'Fresh boutique catch: Sea Bass Whole. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 240, 50),
    (v_pid, '500g', 500, 25),
    (v_pid, '1 kg', 900, 15);

  -- Product 62: Cobia Fish Steak
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Cobia Fish Steak', 'Fresh boutique catch: Cobia Fish Steak. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 247, 53),
    (v_pid, '500g', 513, 27),
    (v_pid, '1 kg', 923, 16);

  -- Product 63: Emperor Fish Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Emperor Fish Cut', 'Fresh boutique catch: Emperor Fish Cut. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 254, 56),
    (v_pid, '500g', 526, 29),
    (v_pid, '1 kg', 946, 17);

  -- Product 64: Barracuda Steak
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Barracuda Steak', 'Fresh boutique catch: Barracuda Steak. Sourced daily and delivered under express cold chain.', v_cat_fish, 'Fishes', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '250g', 261, 59),
    (v_pid, '500g', 539, 31),
    (v_pid, '1 kg', 969, 18);

  -- Product 65: Fresh Chicken Curry Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Fresh Chicken Curry Cut', 'Fresh farm-raised premium meat: Fresh Chicken Curry Cut. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 140, 40),
    (v_pid, '1 kg', 260, 20);

  -- Product 66: Chicken Breast Boneless
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Breast Boneless', 'Fresh farm-raised premium meat: Chicken Breast Boneless. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 151, 42),
    (v_pid, '1 kg', 279, 21);

  -- Product 67: Chicken Drumsticks (Legs)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Drumsticks (Legs)', 'Fresh farm-raised premium meat: Chicken Drumsticks (Legs). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 162, 44),
    (v_pid, '1 kg', 298, 22);

  -- Product 68: Whole Chicken Cleaned
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Whole Chicken Cleaned', 'Fresh farm-raised premium meat: Whole Chicken Cleaned. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 173, 46),
    (v_pid, '1 kg', 317, 23);

  -- Product 69: Country Chicken (Nati Koli) Curry Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Country Chicken (Nati Koli) Curry Cut', 'Fresh farm-raised premium meat: Country Chicken (Nati Koli) Curry Cut. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 184, 48),
    (v_pid, '1 kg', 336, 24);

  -- Product 70: Chicken Lollipop Pieces
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Lollipop Pieces', 'Fresh farm-raised premium meat: Chicken Lollipop Pieces. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 195, 50),
    (v_pid, '1 kg', 355, 25);

  -- Product 71: Chicken Keema (Mince)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Keema (Mince)', 'Fresh farm-raised premium meat: Chicken Keema (Mince). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 206, 52),
    (v_pid, '1 kg', 374, 26);

  -- Product 72: Chicken Wings Fresh
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Wings Fresh', 'Fresh farm-raised premium meat: Chicken Wings Fresh. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 217, 54),
    (v_pid, '1 kg', 393, 27);

  -- Product 73: Chicken Thighs Boneless
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Thighs Boneless', 'Fresh farm-raised premium meat: Chicken Thighs Boneless. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 228, 56),
    (v_pid, '1 kg', 412, 28);

  -- Product 74: Chicken Gizzard & Liver
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Gizzard & Liver', 'Fresh farm-raised premium meat: Chicken Gizzard & Liver. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 239, 58),
    (v_pid, '1 kg', 431, 29);

  -- Product 75: Mutton Curry Cut (Goat)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Mutton Curry Cut (Goat)', 'Fresh farm-raised premium meat: Mutton Curry Cut (Goat). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 250, 60),
    (v_pid, '1 kg', 450, 30);

  -- Product 76: Mutton Boneless (Goat)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Mutton Boneless (Goat)', 'Fresh farm-raised premium meat: Mutton Boneless (Goat). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 261, 62),
    (v_pid, '1 kg', 469, 31);

  -- Product 77: Mutton Keema (Goat Mince)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Mutton Keema (Goat Mince)', 'Fresh farm-raised premium meat: Mutton Keema (Goat Mince). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 272, 64),
    (v_pid, '1 kg', 488, 32);

  -- Product 78: Mutton Chops & Ribs
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Mutton Chops & Ribs', 'Fresh farm-raised premium meat: Mutton Chops & Ribs. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 283, 66),
    (v_pid, '1 kg', 507, 33);

  -- Product 79: Mutton Shoulder Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Mutton Shoulder Cut', 'Fresh farm-raised premium meat: Mutton Shoulder Cut. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 294, 68),
    (v_pid, '1 kg', 526, 34);

  -- Product 80: Mutton Nalli (Shank Marrow)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Mutton Nalli (Shank Marrow)', 'Fresh farm-raised premium meat: Mutton Nalli (Shank Marrow). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 305, 40),
    (v_pid, '1 kg', 545, 35);

  -- Product 81: Fresh Duck Meat Curry Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Fresh Duck Meat Curry Cut', 'Fresh farm-raised premium meat: Fresh Duck Meat Curry Cut. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 316, 42),
    (v_pid, '1 kg', 564, 36);

  -- Product 82: Fresh Quail (Bater) Whole
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Fresh Quail (Bater) Whole', 'Fresh farm-raised premium meat: Fresh Quail (Bater) Whole. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 327, 44),
    (v_pid, '1 kg', 583, 37);

  -- Product 83: Farm Fresh White Eggs (Pack of 12)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Farm Fresh White Eggs (Pack of 12)', 'Fresh farm-raised premium meat: Farm Fresh White Eggs (Pack of 12). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 338, 46),
    (v_pid, '1 kg', 602, 38);

  -- Product 84: Country Hen Eggs (Pack of 6)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Country Hen Eggs (Pack of 6)', 'Fresh farm-raised premium meat: Country Hen Eggs (Pack of 6). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 349, 48),
    (v_pid, '1 kg', 621, 39);

  -- Product 85: Organic Brown Eggs (Pack of 6)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Organic Brown Eggs (Pack of 6)', 'Fresh farm-raised premium meat: Organic Brown Eggs (Pack of 6). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 360, 50),
    (v_pid, '1 kg', 640, 40);

  -- Product 86: Quail Eggs (Pack of 12)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Quail Eggs (Pack of 12)', 'Fresh farm-raised premium meat: Quail Eggs (Pack of 12). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 371, 52),
    (v_pid, '1 kg', 659, 41);

  -- Product 87: Classic Chicken Sausage (250g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Classic Chicken Sausage (250g)', 'Fresh farm-raised premium meat: Classic Chicken Sausage (250g). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 382, 54),
    (v_pid, '1 kg', 678, 42);

  -- Product 88: Chicken Smoked Salami (200g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Smoked Salami (200g)', 'Fresh farm-raised premium meat: Chicken Smoked Salami (200g). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 393, 56),
    (v_pid, '1 kg', 697, 43);

  -- Product 89: Chicken Seekh Kebab (250g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Seekh Kebab (250g)', 'Fresh farm-raised premium meat: Chicken Seekh Kebab (250g). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 404, 58),
    (v_pid, '1 kg', 716, 44);

  -- Product 90: Chicken Cheese Nuggets (300g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Cheese Nuggets (300g)', 'Fresh farm-raised premium meat: Chicken Cheese Nuggets (300g). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 415, 60),
    (v_pid, '1 kg', 735, 20);

  -- Product 91: Chicken Malai Tikka (Marinated)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Malai Tikka (Marinated)', 'Fresh farm-raised premium meat: Chicken Malai Tikka (Marinated). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 426, 62),
    (v_pid, '1 kg', 754, 21);

  -- Product 92: Mutton Galouti Kebab (4 Pcs)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Mutton Galouti Kebab (4 Pcs)', 'Fresh farm-raised premium meat: Mutton Galouti Kebab (4 Pcs). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 437, 64),
    (v_pid, '1 kg', 773, 22);

  -- Product 93: Turkey Meat Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Turkey Meat Cut', 'Fresh farm-raised premium meat: Turkey Meat Cut. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 448, 66),
    (v_pid, '1 kg', 792, 23);

  -- Product 94: Lamb Curry Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Lamb Curry Cut', 'Fresh farm-raised premium meat: Lamb Curry Cut. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 459, 68),
    (v_pid, '1 kg', 811, 24);

  -- Product 95: Lamb Chops Premium
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Lamb Chops Premium', 'Fresh farm-raised premium meat: Lamb Chops Premium. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 470, 40),
    (v_pid, '1 kg', 830, 25);

  -- Product 96: Lamb Mince (Keema)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Lamb Mince (Keema)', 'Fresh farm-raised premium meat: Lamb Mince (Keema). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 481, 42),
    (v_pid, '1 kg', 849, 26);

  -- Product 97: Chicken Popcorn Crispy
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Popcorn Crispy', 'Fresh farm-raised premium meat: Chicken Popcorn Crispy. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 492, 44),
    (v_pid, '1 kg', 868, 27);

  -- Product 98: Chicken Wings Hot & Spicy
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Wings Hot & Spicy', 'Fresh farm-raised premium meat: Chicken Wings Hot & Spicy. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 503, 46),
    (v_pid, '1 kg', 887, 28);

  -- Product 99: Mutton Brain (Bheja)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Mutton Brain (Bheja)', 'Fresh farm-raised premium meat: Mutton Brain (Bheja). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 514, 48),
    (v_pid, '1 kg', 906, 29);

  -- Product 100: Mutton Liver (Kaleji)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Mutton Liver (Kaleji)', 'Fresh farm-raised premium meat: Mutton Liver (Kaleji). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 525, 50),
    (v_pid, '1 kg', 925, 30);

  -- Product 101: Mutton Kidney (Gurda)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Mutton Kidney (Gurda)', 'Fresh farm-raised premium meat: Mutton Kidney (Gurda). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 536, 52),
    (v_pid, '1 kg', 944, 31);

  -- Product 102: Chicken Tikka Marinated
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Tikka Marinated', 'Fresh farm-raised premium meat: Chicken Tikka Marinated. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 147, 54),
    (v_pid, '1 kg', 263, 32);

  -- Product 103: Chicken Tangdi Kebab
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Tangdi Kebab', 'Fresh farm-raised premium meat: Chicken Tangdi Kebab. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 158, 56),
    (v_pid, '1 kg', 282, 33);

  -- Product 104: Country Duck Eggs (Pack of 6)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Country Duck Eggs (Pack of 6)', 'Fresh farm-raised premium meat: Country Duck Eggs (Pack of 6). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 169, 58),
    (v_pid, '1 kg', 301, 34);

  -- Product 105: Aseel Country Chicken Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Aseel Country Chicken Cut', 'Fresh farm-raised premium meat: Aseel Country Chicken Cut. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 180, 60),
    (v_pid, '1 kg', 320, 35);

  -- Product 106: Kadapnath Black Chicken Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Kadapnath Black Chicken Cut', 'Fresh farm-raised premium meat: Kadapnath Black Chicken Cut. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 191, 62),
    (v_pid, '1 kg', 339, 36);

  -- Product 107: Chicken Skinless Whole
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Skinless Whole', 'Fresh farm-raised premium meat: Chicken Skinless Whole. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 202, 64),
    (v_pid, '1 kg', 358, 37);

  -- Product 108: Chicken Biryani Cut
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Biryani Cut', 'Fresh farm-raised premium meat: Chicken Biryani Cut. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 213, 66),
    (v_pid, '1 kg', 377, 38);

  -- Product 109: Mutton Biryani Cut (Large)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Mutton Biryani Cut (Large)', 'Fresh farm-raised premium meat: Mutton Biryani Cut (Large). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 224, 68),
    (v_pid, '1 kg', 396, 39);

  -- Product 110: Chicken Cold Cut Ham
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Cold Cut Ham', 'Fresh farm-raised premium meat: Chicken Cold Cut Ham. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 235, 40),
    (v_pid, '1 kg', 415, 40);

  -- Product 111: Chicken Pepper Salami
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Pepper Salami', 'Fresh farm-raised premium meat: Chicken Pepper Salami. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 246, 42),
    (v_pid, '1 kg', 434, 41);

  -- Product 112: Chicken Cheese Cocktail Sausages
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Cheese Cocktail Sausages', 'Fresh farm-raised premium meat: Chicken Cheese Cocktail Sausages. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 257, 44),
    (v_pid, '1 kg', 453, 42);

  -- Product 113: Mutton Shami Kebab
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Mutton Shami Kebab', 'Fresh farm-raised premium meat: Mutton Shami Kebab. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 268, 46),
    (v_pid, '1 kg', 472, 43);

  -- Product 114: Chicken Reshmi Kebab
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Reshmi Kebab', 'Fresh farm-raised premium meat: Chicken Reshmi Kebab. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 279, 48),
    (v_pid, '1 kg', 491, 44);

  -- Product 115: Chicken Tandoori Half
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Tandoori Half', 'Fresh farm-raised premium meat: Chicken Tandoori Half. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 290, 50),
    (v_pid, '1 kg', 510, 20);

  -- Product 116: Duck Egg Golden (Pack of 6)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Duck Egg Golden (Pack of 6)', 'Fresh farm-raised premium meat: Duck Egg Golden (Pack of 6). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 301, 52),
    (v_pid, '1 kg', 529, 21);

  -- Product 117: Chicken Burger Patties
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Burger Patties', 'Fresh farm-raised premium meat: Chicken Burger Patties. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 312, 54),
    (v_pid, '1 kg', 548, 22);

  -- Product 118: Mutton Burger Patties
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Mutton Burger Patties', 'Fresh farm-raised premium meat: Mutton Burger Patties. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 323, 56),
    (v_pid, '1 kg', 567, 23);

  -- Product 119: Chicken Meatballs (250g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Meatballs (250g)', 'Fresh farm-raised premium meat: Chicken Meatballs (250g). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 334, 58),
    (v_pid, '1 kg', 586, 24);

  -- Product 120: Mutton Meatballs (250g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Mutton Meatballs (250g)', 'Fresh farm-raised premium meat: Mutton Meatballs (250g). Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 345, 60),
    (v_pid, '1 kg', 605, 25);

  -- Product 121: Chicken Shawarma Meat
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Shawarma Meat', 'Fresh farm-raised premium meat: Chicken Shawarma Meat. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 356, 62),
    (v_pid, '1 kg', 624, 26);

  -- Product 122: Chicken Fajita Strips
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chicken Fajita Strips', 'Fresh farm-raised premium meat: Chicken Fajita Strips. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 367, 64),
    (v_pid, '1 kg', 643, 27);

  -- Product 123: Mutton Soup Bones
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Mutton Soup Bones', 'Fresh farm-raised premium meat: Mutton Soup Bones. Cleaned, portioned, and hygienically packed.', v_cat_meat, 'Meat, Chicken & Eggs', 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 378, 66),
    (v_pid, '1 kg', 662, 28);

  -- Product 124: Fresh Hybrid Tomatoes
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Fresh Hybrid Tomatoes', 'Farm-fresh, hand-picked produce: Fresh Hybrid Tomatoes. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 30, 50),
    (v_pid, '1 kg', 55, 30);

  -- Product 125: Desi Local Tomatoes
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Desi Local Tomatoes', 'Farm-fresh, hand-picked produce: Desi Local Tomatoes. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 35, 54),
    (v_pid, '1 kg', 64, 32);

  -- Product 126: Red Onions Fresh
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Red Onions Fresh', 'Farm-fresh, hand-picked produce: Red Onions Fresh. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 40, 58),
    (v_pid, '1 kg', 73, 34);

  -- Product 127: White Onions
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('White Onions', 'Farm-fresh, hand-picked produce: White Onions. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 45, 62),
    (v_pid, '1 kg', 82, 36);

  -- Product 128: New Crop Potatoes
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('New Crop Potatoes', 'Farm-fresh, hand-picked produce: New Crop Potatoes. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 50, 66),
    (v_pid, '1 kg', 91, 38);

  -- Product 129: Jyoti Potatoes
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Jyoti Potatoes', 'Farm-fresh, hand-picked produce: Jyoti Potatoes. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 55, 70),
    (v_pid, '1 kg', 100, 40);

  -- Product 130: Garlic Whole Desi
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Garlic Whole Desi', 'Farm-fresh, hand-picked produce: Garlic Whole Desi. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 60, 74),
    (v_pid, '1 kg', 109, 42);

  -- Product 131: Peeled Garlic Cloves
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Peeled Garlic Cloves', 'Farm-fresh, hand-picked produce: Peeled Garlic Cloves. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 65, 78),
    (v_pid, '1 kg', 118, 44);

  -- Product 132: Fresh Ginger (Adrak)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Fresh Ginger (Adrak)', 'Farm-fresh, hand-picked produce: Fresh Ginger (Adrak). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 70, 82),
    (v_pid, '1 kg', 127, 46);

  -- Product 133: Green Chillies Spicy
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Green Chillies Spicy', 'Farm-fresh, hand-picked produce: Green Chillies Spicy. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 75, 86),
    (v_pid, '1 kg', 136, 48);

  -- Product 134: Fresh Cauliflower
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Fresh Cauliflower', 'Farm-fresh, hand-picked produce: Fresh Cauliflower. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 80, 90),
    (v_pid, '1 kg', 145, 50);

  -- Product 135: Green Cabbage
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Green Cabbage', 'Farm-fresh, hand-picked produce: Green Cabbage. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 85, 94),
    (v_pid, '1 kg', 154, 52);

  -- Product 136: Purple Cabbage
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Purple Cabbage', 'Farm-fresh, hand-picked produce: Purple Cabbage. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 90, 98),
    (v_pid, '1 kg', 163, 54);

  -- Product 137: Brinjal (Baingan) Purple
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Brinjal (Baingan) Purple', 'Farm-fresh, hand-picked produce: Brinjal (Baingan) Purple. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 95, 52),
    (v_pid, '1 kg', 172, 56);

  -- Product 138: Brinjal Green Long
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Brinjal Green Long', 'Farm-fresh, hand-picked produce: Brinjal Green Long. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 100, 56),
    (v_pid, '1 kg', 181, 58);

  -- Product 139: Fresh Lady Finger (Okra)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Fresh Lady Finger (Okra)', 'Farm-fresh, hand-picked produce: Fresh Lady Finger (Okra). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 105, 60),
    (v_pid, '1 kg', 190, 60);

  -- Product 140: Palak (Spinach) Bunch
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Palak (Spinach) Bunch', 'Farm-fresh, hand-picked produce: Palak (Spinach) Bunch. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 110, 64),
    (v_pid, '1 kg', 199, 62);

  -- Product 141: Fresh Coriander Bunch
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Fresh Coriander Bunch', 'Farm-fresh, hand-picked produce: Fresh Coriander Bunch. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 115, 68),
    (v_pid, '1 kg', 208, 64);

  -- Product 142: Fresh Mint (Pudina) Bunch
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Fresh Mint (Pudina) Bunch', 'Farm-fresh, hand-picked produce: Fresh Mint (Pudina) Bunch. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 120, 72),
    (v_pid, '1 kg', 217, 66);

  -- Product 143: Methi (Fenugreek) Bunch
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Methi (Fenugreek) Bunch', 'Farm-fresh, hand-picked produce: Methi (Fenugreek) Bunch. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 125, 76),
    (v_pid, '1 kg', 226, 68);

  -- Product 144: Ridge Gourd (Turai)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Ridge Gourd (Turai)', 'Farm-fresh, hand-picked produce: Ridge Gourd (Turai). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 130, 80),
    (v_pid, '1 kg', 235, 30);

  -- Product 145: Bottle Gourd (Lauki)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Bottle Gourd (Lauki)', 'Farm-fresh, hand-picked produce: Bottle Gourd (Lauki). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 135, 84),
    (v_pid, '1 kg', 244, 32);

  -- Product 146: Bitter Gourd (Karela)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Bitter Gourd (Karela)', 'Farm-fresh, hand-picked produce: Bitter Gourd (Karela). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 140, 88),
    (v_pid, '1 kg', 253, 34);

  -- Product 147: Fresh Cucumber (Kheera)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Fresh Cucumber (Kheera)', 'Farm-fresh, hand-picked produce: Fresh Cucumber (Kheera). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 145, 92),
    (v_pid, '1 kg', 262, 36);

  -- Product 148: Green Capsicum
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Green Capsicum', 'Farm-fresh, hand-picked produce: Green Capsicum. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 30, 96),
    (v_pid, '1 kg', 271, 38);

  -- Product 149: Red Bell Pepper
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Red Bell Pepper', 'Farm-fresh, hand-picked produce: Red Bell Pepper. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 35, 50),
    (v_pid, '1 kg', 60, 40);

  -- Product 150: Yellow Bell Pepper
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Yellow Bell Pepper', 'Farm-fresh, hand-picked produce: Yellow Bell Pepper. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 40, 54),
    (v_pid, '1 kg', 69, 42);

  -- Product 151: Fresh Orange Carrots
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Fresh Orange Carrots', 'Farm-fresh, hand-picked produce: Fresh Orange Carrots. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 45, 58),
    (v_pid, '1 kg', 78, 44);

  -- Product 152: Fresh Beetroot
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Fresh Beetroot', 'Farm-fresh, hand-picked produce: Fresh Beetroot. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 50, 62),
    (v_pid, '1 kg', 87, 46);

  -- Product 153: Sweet Potatoes (Shakarkand)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Sweet Potatoes (Shakarkand)', 'Farm-fresh, hand-picked produce: Sweet Potatoes (Shakarkand). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 55, 66),
    (v_pid, '1 kg', 96, 48);

  -- Product 154: Fresh Green Peas (Matar)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Fresh Green Peas (Matar)', 'Farm-fresh, hand-picked produce: Fresh Green Peas (Matar). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 60, 70),
    (v_pid, '1 kg', 105, 50);

  -- Product 155: Raw Papaya
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Raw Papaya', 'Farm-fresh, hand-picked produce: Raw Papaya. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 65, 74),
    (v_pid, '1 kg', 114, 52);

  -- Product 156: Raw Banana (Kacha Kela)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Raw Banana (Kacha Kela)', 'Farm-fresh, hand-picked produce: Raw Banana (Kacha Kela). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 70, 78),
    (v_pid, '1 kg', 123, 54);

  -- Product 157: Drumsticks (Sajna Danta)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Drumsticks (Sajna Danta)', 'Farm-fresh, hand-picked produce: Drumsticks (Sajna Danta). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 75, 82),
    (v_pid, '1 kg', 132, 56);

  -- Product 158: Pointed Gourd (Parwal)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Pointed Gourd (Parwal)', 'Farm-fresh, hand-picked produce: Pointed Gourd (Parwal). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 80, 86),
    (v_pid, '1 kg', 141, 58);

  -- Product 159: Ivy Gourd (Tindora)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Ivy Gourd (Tindora)', 'Farm-fresh, hand-picked produce: Ivy Gourd (Tindora). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 85, 90),
    (v_pid, '1 kg', 150, 60);

  -- Product 160: Snake Gourd (Chichinda)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Snake Gourd (Chichinda)', 'Farm-fresh, hand-picked produce: Snake Gourd (Chichinda). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 90, 94),
    (v_pid, '1 kg', 159, 62);

  -- Product 161: Colocasia (Arbi / Kochu)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Colocasia (Arbi / Kochu)', 'Farm-fresh, hand-picked produce: Colocasia (Arbi / Kochu). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 95, 98),
    (v_pid, '1 kg', 168, 64);

  -- Product 162: Elephant Foot Yam (Ool)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Elephant Foot Yam (Ool)', 'Farm-fresh, hand-picked produce: Elephant Foot Yam (Ool). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 100, 52),
    (v_pid, '1 kg', 177, 66);

  -- Product 163: Raw Mango (Kacha Aam)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Raw Mango (Kacha Aam)', 'Farm-fresh, hand-picked produce: Raw Mango (Kacha Aam). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 105, 56),
    (v_pid, '1 kg', 186, 68);

  -- Product 164: Fresh Lemon (Nimboo)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Fresh Lemon (Nimboo)', 'Farm-fresh, hand-picked produce: Fresh Lemon (Nimboo). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 110, 60),
    (v_pid, '1 kg', 195, 30);

  -- Product 165: Sweet Corn Cobs
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Sweet Corn Cobs', 'Farm-fresh, hand-picked produce: Sweet Corn Cobs. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 115, 64),
    (v_pid, '1 kg', 204, 32);

  -- Product 166: Baby Corn Fresh
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Baby Corn Fresh', 'Farm-fresh, hand-picked produce: Baby Corn Fresh. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 120, 68),
    (v_pid, '1 kg', 213, 34);

  -- Product 167: Button Mushrooms (Pack)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Button Mushrooms (Pack)', 'Farm-fresh, hand-picked produce: Button Mushrooms (Pack). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 125, 72),
    (v_pid, '1 kg', 222, 36);

  -- Product 168: Broccoli Fresh
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Broccoli Fresh', 'Farm-fresh, hand-picked produce: Broccoli Fresh. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 130, 76),
    (v_pid, '1 kg', 231, 38);

  -- Product 169: Zucchini Green
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Zucchini Green', 'Farm-fresh, hand-picked produce: Zucchini Green. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 135, 80),
    (v_pid, '1 kg', 240, 40);

  -- Product 170: Zucchini Yellow
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Zucchini Yellow', 'Farm-fresh, hand-picked produce: Zucchini Yellow. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 140, 84),
    (v_pid, '1 kg', 249, 42);

  -- Product 171: Spring Onion Bunch
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Spring Onion Bunch', 'Farm-fresh, hand-picked produce: Spring Onion Bunch. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 145, 88),
    (v_pid, '1 kg', 258, 44);

  -- Product 172: Alphonso Mangoes (1kg)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Alphonso Mangoes (1kg)', 'Farm-fresh, hand-picked produce: Alphonso Mangoes (1kg). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 30, 92),
    (v_pid, '1 kg', 267, 46);

  -- Product 173: Banganapalli Mangoes
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Banganapalli Mangoes', 'Farm-fresh, hand-picked produce: Banganapalli Mangoes. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 35, 96),
    (v_pid, '1 kg', 56, 48);

  -- Product 174: Dasheri Mangoes
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Dasheri Mangoes', 'Farm-fresh, hand-picked produce: Dasheri Mangoes. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 40, 50),
    (v_pid, '1 kg', 65, 50);

  -- Product 175: Robusta Bananas (1 Dozen)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Robusta Bananas (1 Dozen)', 'Farm-fresh, hand-picked produce: Robusta Bananas (1 Dozen). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 45, 54),
    (v_pid, '1 kg', 74, 52);

  -- Product 176: Yelakki Bananas (1 Dozen)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Yelakki Bananas (1 Dozen)', 'Farm-fresh, hand-picked produce: Yelakki Bananas (1 Dozen). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 50, 58),
    (v_pid, '1 kg', 83, 54);

  -- Product 177: Red Delicious Apples (4 Pcs)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Red Delicious Apples (4 Pcs)', 'Farm-fresh, hand-picked produce: Red Delicious Apples (4 Pcs). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 55, 62),
    (v_pid, '1 kg', 92, 56);

  -- Product 178: Green Apples (4 Pcs)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Green Apples (4 Pcs)', 'Farm-fresh, hand-picked produce: Green Apples (4 Pcs). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 60, 66),
    (v_pid, '1 kg', 101, 58);

  -- Product 179: Nagpur Oranges (1kg)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Nagpur Oranges (1kg)', 'Farm-fresh, hand-picked produce: Nagpur Oranges (1kg). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 65, 70),
    (v_pid, '1 kg', 110, 60);

  -- Product 180: Green Grapes Seedless
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Green Grapes Seedless', 'Farm-fresh, hand-picked produce: Green Grapes Seedless. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 70, 74),
    (v_pid, '1 kg', 119, 62);

  -- Product 181: Black Grapes Seedless
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Black Grapes Seedless', 'Farm-fresh, hand-picked produce: Black Grapes Seedless. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 75, 78),
    (v_pid, '1 kg', 128, 64);

  -- Product 182: Pomegranate (Anar 1kg)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Pomegranate (Anar 1kg)', 'Farm-fresh, hand-picked produce: Pomegranate (Anar 1kg). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 80, 82),
    (v_pid, '1 kg', 137, 66);

  -- Product 183: Papaya Sweet Fresh
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Papaya Sweet Fresh', 'Farm-fresh, hand-picked produce: Papaya Sweet Fresh. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 85, 86),
    (v_pid, '1 kg', 146, 68);

  -- Product 184: Watermelon Whole (2.5kg)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Watermelon Whole (2.5kg)', 'Farm-fresh, hand-picked produce: Watermelon Whole (2.5kg). Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 90, 90),
    (v_pid, '1 kg', 155, 30);

  -- Product 185: Muskmelon Whole
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Muskmelon Whole', 'Farm-fresh, hand-picked produce: Muskmelon Whole. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 95, 94),
    (v_pid, '1 kg', 164, 32);

  -- Product 186: Guava Sweet Pink
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Guava Sweet Pink', 'Farm-fresh, hand-picked produce: Guava Sweet Pink. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 100, 98),
    (v_pid, '1 kg', 173, 34);

  -- Product 187: Pineapple Whole
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Pineapple Whole', 'Farm-fresh, hand-picked produce: Pineapple Whole. Naturally grown and delivered fresh.', v_cat_veg, 'Vegetables & Fruits', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 105, 52),
    (v_pid, '1 kg', 182, 36);

  -- Product 188: Gobindobhog Rice Premium (1kg)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Gobindobhog Rice Premium (1kg)', 'Authentic pantry staple: Gobindobhog Rice Premium (1kg). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 60, 60),
    (v_pid, '1 kg', 110, 40);

  -- Product 189: Basmati Rice Royal Long Grain (5kg)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Basmati Rice Royal Long Grain (5kg)', 'Authentic pantry staple: Basmati Rice Royal Long Grain (5kg). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 68, 63),
    (v_pid, '1 kg', 125, 42);

  -- Product 190: Sona Masoori Rice (5kg)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Sona Masoori Rice (5kg)', 'Authentic pantry staple: Sona Masoori Rice (5kg). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 76, 66),
    (v_pid, '1 kg', 140, 44);

  -- Product 191: Kachi Ghani Mustard Oil (1L)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Kachi Ghani Mustard Oil (1L)', 'Authentic pantry staple: Kachi Ghani Mustard Oil (1L). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 84, 69),
    (v_pid, '1 kg', 155, 46);

  -- Product 192: Pure Cow Ghee (500ml)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Pure Cow Ghee (500ml)', 'Authentic pantry staple: Pure Cow Ghee (500ml). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 92, 72),
    (v_pid, '1 kg', 170, 48);

  -- Product 193: Yellow Mustard Seeds (200g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Yellow Mustard Seeds (200g)', 'Authentic pantry staple: Yellow Mustard Seeds (200g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 100, 75),
    (v_pid, '1 kg', 185, 50);

  -- Product 194: Black Mustard Seeds (200g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Black Mustard Seeds (200g)', 'Authentic pantry staple: Black Mustard Seeds (200g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 108, 78),
    (v_pid, '1 kg', 200, 52);

  -- Product 195: Panch Phoron Whole Spice (100g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Panch Phoron Whole Spice (100g)', 'Authentic pantry staple: Panch Phoron Whole Spice (100g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 116, 81),
    (v_pid, '1 kg', 215, 54);

  -- Product 196: Turmeric Powder (200g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Turmeric Powder (200g)', 'Authentic pantry staple: Turmeric Powder (200g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 124, 84),
    (v_pid, '1 kg', 230, 56);

  -- Product 197: Kashmiri Red Chilli Powder (200g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Kashmiri Red Chilli Powder (200g)', 'Authentic pantry staple: Kashmiri Red Chilli Powder (200g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 132, 87),
    (v_pid, '1 kg', 245, 58);

  -- Product 198: Cumin Seeds (Jeera 200g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Cumin Seeds (Jeera 200g)', 'Authentic pantry staple: Cumin Seeds (Jeera 200g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 140, 90),
    (v_pid, '1 kg', 260, 60);

  -- Product 199: Coriander Powder (200g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Coriander Powder (200g)', 'Authentic pantry staple: Coriander Powder (200g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 148, 93),
    (v_pid, '1 kg', 275, 62);

  -- Product 200: Shahi Garam Masala (100g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Shahi Garam Masala (100g)', 'Authentic pantry staple: Shahi Garam Masala (100g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 156, 96),
    (v_pid, '1 kg', 290, 64);

  -- Product 201: White Posto (Poppy Seeds 100g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('White Posto (Poppy Seeds 100g)', 'Authentic pantry staple: White Posto (Poppy Seeds 100g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 164, 99),
    (v_pid, '1 kg', 305, 66);

  -- Product 202: Kasundi Mustard Paste (250g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Kasundi Mustard Paste (250g)', 'Authentic pantry staple: Kasundi Mustard Paste (250g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 172, 62),
    (v_pid, '1 kg', 320, 68);

  -- Product 203: Sweet Mango Pickle (400g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Sweet Mango Pickle (400g)', 'Authentic pantry staple: Sweet Mango Pickle (400g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 180, 65),
    (v_pid, '1 kg', 335, 40);

  -- Product 204: Spicy Green Chilli Pickle (400g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Spicy Green Chilli Pickle (400g)', 'Authentic pantry staple: Spicy Green Chilli Pickle (400g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 188, 68),
    (v_pid, '1 kg', 350, 42);

  -- Product 205: Kolkata Chanachur Mix (500g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Kolkata Chanachur Mix (500g)', 'Authentic pantry staple: Kolkata Chanachur Mix (500g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 196, 71),
    (v_pid, '1 kg', 365, 44);

  -- Product 206: Muri Puffed Rice (500g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Muri Puffed Rice (500g)', 'Authentic pantry staple: Muri Puffed Rice (500g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 204, 74),
    (v_pid, '1 kg', 380, 46);

  -- Product 207: Nolen Gur Date Palm Jaggery (500g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Nolen Gur Date Palm Jaggery (500g)', 'Authentic pantry staple: Nolen Gur Date Palm Jaggery (500g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 212, 77),
    (v_pid, '1 kg', 395, 48);

  -- Product 208: Chakki Fresh Atta (5kg)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Chakki Fresh Atta (5kg)', 'Authentic pantry staple: Chakki Fresh Atta (5kg). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 220, 80),
    (v_pid, '1 kg', 410, 50);

  -- Product 209: Refined Maida (1kg)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Refined Maida (1kg)', 'Authentic pantry staple: Refined Maida (1kg). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 228, 83),
    (v_pid, '1 kg', 425, 52);

  -- Product 210: Roasted Suji / Rava (1kg)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Roasted Suji / Rava (1kg)', 'Authentic pantry staple: Roasted Suji / Rava (1kg). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 236, 86),
    (v_pid, '1 kg', 440, 54);

  -- Product 211: Unpolished Chana Dal (1kg)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Unpolished Chana Dal (1kg)', 'Authentic pantry staple: Unpolished Chana Dal (1kg). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 244, 89),
    (v_pid, '1 kg', 455, 56);

  -- Product 212: Unpolished Toor / Arhar Dal (1kg)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Unpolished Toor / Arhar Dal (1kg)', 'Authentic pantry staple: Unpolished Toor / Arhar Dal (1kg). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 252, 92),
    (v_pid, '1 kg', 470, 58);

  -- Product 213: Unpolished Moong Dal (1kg)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Unpolished Moong Dal (1kg)', 'Authentic pantry staple: Unpolished Moong Dal (1kg). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 260, 95),
    (v_pid, '1 kg', 485, 60);

  -- Product 214: Unpolished Masoor Dal (1kg)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Unpolished Masoor Dal (1kg)', 'Authentic pantry staple: Unpolished Masoor Dal (1kg). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 268, 98),
    (v_pid, '1 kg', 500, 62);

  -- Product 215: Rajma Jammu Red (1kg)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Rajma Jammu Red (1kg)', 'Authentic pantry staple: Rajma Jammu Red (1kg). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 276, 61),
    (v_pid, '1 kg', 515, 64);

  -- Product 216: Kabuli Chana Large (1kg)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Kabuli Chana Large (1kg)', 'Authentic pantry staple: Kabuli Chana Large (1kg). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 284, 64),
    (v_pid, '1 kg', 530, 66);

  -- Product 217: Black Chickpeas (Kala Chana 1kg)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Black Chickpeas (Kala Chana 1kg)', 'Authentic pantry staple: Black Chickpeas (Kala Chana 1kg). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 292, 67),
    (v_pid, '1 kg', 545, 68);

  -- Product 218: Green Moong Whole (1kg)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Green Moong Whole (1kg)', 'Authentic pantry staple: Green Moong Whole (1kg). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 300, 70),
    (v_pid, '1 kg', 560, 40);

  -- Product 219: Urad Dal Whole (1kg)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Urad Dal Whole (1kg)', 'Authentic pantry staple: Urad Dal Whole (1kg). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 308, 73),
    (v_pid, '1 kg', 575, 42);

  -- Product 220: Soya Chunks Premium (200g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Soya Chunks Premium (200g)', 'Authentic pantry staple: Soya Chunks Premium (200g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 316, 76),
    (v_pid, '1 kg', 590, 44);

  -- Product 221: Jaggery Powder Organic (500g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Jaggery Powder Organic (500g)', 'Authentic pantry staple: Jaggery Powder Organic (500g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 324, 79),
    (v_pid, '1 kg', 605, 46);

  -- Product 222: Rock Salt (Sendha Namak 1kg)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Rock Salt (Sendha Namak 1kg)', 'Authentic pantry staple: Rock Salt (Sendha Namak 1kg). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 332, 82),
    (v_pid, '1 kg', 620, 48);

  -- Product 223: Tata Iodized Salt (1kg)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Tata Iodized Salt (1kg)', 'Authentic pantry staple: Tata Iodized Salt (1kg). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 340, 85),
    (v_pid, '1 kg', 635, 50);

  -- Product 224: Tea Powder Premium CTC (500g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Tea Powder Premium CTC (500g)', 'Authentic pantry staple: Tea Powder Premium CTC (500g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 348, 88),
    (v_pid, '1 kg', 650, 52);

  -- Product 225: Darjeeling Black Tea Leaves (250g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Darjeeling Black Tea Leaves (250g)', 'Authentic pantry staple: Darjeeling Black Tea Leaves (250g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 356, 91),
    (v_pid, '1 kg', 115, 54);

  -- Product 226: Filter Coffee Powder (250g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Filter Coffee Powder (250g)', 'Authentic pantry staple: Filter Coffee Powder (250g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 64, 94),
    (v_pid, '1 kg', 130, 56);

  -- Product 227: Poha / Flat Rice Thick (500g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Poha / Flat Rice Thick (500g)', 'Authentic pantry staple: Poha / Flat Rice Thick (500g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 72, 97),
    (v_pid, '1 kg', 145, 58);

  -- Product 228: Sabudana Large (500g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Sabudana Large (500g)', 'Authentic pantry staple: Sabudana Large (500g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 80, 60),
    (v_pid, '1 kg', 160, 60);

  -- Product 229: Sevaiya Vermicelli (200g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Sevaiya Vermicelli (200g)', 'Authentic pantry staple: Sevaiya Vermicelli (200g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 88, 63),
    (v_pid, '1 kg', 175, 62);

  -- Product 230: Baking Soda (100g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Baking Soda (100g)', 'Authentic pantry staple: Baking Soda (100g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 96, 66),
    (v_pid, '1 kg', 190, 64);

  -- Product 231: Baking Powder (100g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Baking Powder (100g)', 'Authentic pantry staple: Baking Powder (100g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 104, 69),
    (v_pid, '1 kg', 205, 66);

  -- Product 232: Tamarind Whole (250g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Tamarind Whole (250g)', 'Authentic pantry staple: Tamarind Whole (250g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 112, 72),
    (v_pid, '1 kg', 220, 68);

  -- Product 233: Dry Red Chillies Whole (200g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Dry Red Chillies Whole (200g)', 'Authentic pantry staple: Dry Red Chillies Whole (200g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 120, 75),
    (v_pid, '1 kg', 235, 40);

  -- Product 234: Black Pepper Whole (100g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Black Pepper Whole (100g)', 'Authentic pantry staple: Black Pepper Whole (100g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 128, 78),
    (v_pid, '1 kg', 250, 42);

  -- Product 235: Green Cardamom (Elaichi 50g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Green Cardamom (Elaichi 50g)', 'Authentic pantry staple: Green Cardamom (Elaichi 50g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 136, 81),
    (v_pid, '1 kg', 265, 44);

  -- Product 236: Black Cardamom (50g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Black Cardamom (50g)', 'Authentic pantry staple: Black Cardamom (50g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 144, 84),
    (v_pid, '1 kg', 280, 46);

  -- Product 237: Cinnamon Sticks (100g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Cinnamon Sticks (100g)', 'Authentic pantry staple: Cinnamon Sticks (100g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 152, 87),
    (v_pid, '1 kg', 295, 48);

  -- Product 238: Cloves Whole (50g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Cloves Whole (50g)', 'Authentic pantry staple: Cloves Whole (50g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 160, 90),
    (v_pid, '1 kg', 310, 50);

  -- Product 239: Star Anise Whole (50g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Star Anise Whole (50g)', 'Authentic pantry staple: Star Anise Whole (50g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 168, 93),
    (v_pid, '1 kg', 325, 52);

  -- Product 240: Bay Leaves (Tejpatta 50g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Bay Leaves (Tejpatta 50g)', 'Authentic pantry staple: Bay Leaves (Tejpatta 50g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 176, 96),
    (v_pid, '1 kg', 340, 54);

  -- Product 241: Nutmeg Whole (2 Pcs)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Nutmeg Whole (2 Pcs)', 'Authentic pantry staple: Nutmeg Whole (2 Pcs). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 184, 99),
    (v_pid, '1 kg', 355, 56);

  -- Product 242: Mace (Javitri 25g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Mace (Javitri 25g)', 'Authentic pantry staple: Mace (Javitri 25g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 192, 62),
    (v_pid, '1 kg', 370, 58);

  -- Product 243: Asafoetida (Hing 50g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Asafoetida (Hing 50g)', 'Authentic pantry staple: Asafoetida (Hing 50g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 200, 65),
    (v_pid, '1 kg', 385, 60);

  -- Product 244: Fenugreek Seeds (Methi 200g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Fenugreek Seeds (Methi 200g)', 'Authentic pantry staple: Fenugreek Seeds (Methi 200g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 208, 68),
    (v_pid, '1 kg', 400, 62);

  -- Product 245: Fennel Seeds (Saunf 200g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Fennel Seeds (Saunf 200g)', 'Authentic pantry staple: Fennel Seeds (Saunf 200g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 216, 71),
    (v_pid, '1 kg', 415, 64);

  -- Product 246: Sesame Seeds White (200g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Sesame Seeds White (200g)', 'Authentic pantry staple: Sesame Seeds White (200g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 224, 74),
    (v_pid, '1 kg', 430, 66);

  -- Product 247: Flax Seeds Organic (200g)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES ('Flax Seeds Organic (200g)', 'Authentic pantry staple: Flax Seeds Organic (200g). Premium quality sourcing for traditional cooking.', v_cat_groc, 'Groceries', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', true)
  RETURNING id INTO v_pid;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_pid, '500g', 232, 77),
    (v_pid, '1 kg', 445, 68);

  RAISE NOTICE 'Successfully seeded 250 products with multi-unit variants!';
END $$;
