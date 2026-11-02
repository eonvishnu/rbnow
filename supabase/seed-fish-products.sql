-- SEED FISH PRODUCTS & VARIANTS INTO SUPABASE

DO $$
DECLARE
  v_cat_id uuid;
  v_p1_id uuid;
  v_p2_id uuid;
  v_p3_id uuid;
  v_p4_id uuid;
  v_p5_id uuid;
BEGIN
  -- 1. Fetch category_id for Fishes
  SELECT id INTO v_cat_id FROM public.categories WHERE name ILIKE '%fish%' LIMIT 1;

  IF v_cat_id IS NULL THEN
    INSERT INTO public.categories (name, is_active) VALUES ('Fishes', true) RETURNING id INTO v_cat_id;
  END IF;

  -- 2. Insert Katla Fish
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES (
    'Katla Fish - Gada (5kg & Above) Cut & Cleaned',
    'Fresh large Katla fish cut into curry pieces. Tender, flavorful, and rich in omega-3.',
    v_cat_id,
    'Fishes',
    'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80',
    true
  ) RETURNING id INTO v_p1_id;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_p1_id, '250g', 99, 50),
    (v_p1_id, '500g', 189, 40),
    (v_p1_id, '1 kg', 360, 25);

  -- 3. Insert Rohu Fish
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES (
    'Rohu Fish - Bengali Steak Cut',
    'Authentic freshwater Rohu fish cut into classic Bengali steaks. Freshly cleaned and ready to cook.',
    v_cat_id,
    'Fishes',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    true
  ) RETURNING id INTO v_p2_id;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_p2_id, '500g', 175, 35),
    (v_p2_id, '1 kg', 340, 30);

  -- 4. Insert Padma Hilsa (Ilish)
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES (
    'Padma Hilsa (Ilish) Fish - Whole / Cut',
    'Premium Padma River Hilsa fish with rich, authentic oil and delicate texture. A royal Bengali delicacy.',
    v_cat_id,
    'Fishes',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    true
  ) RETURNING id INTO v_p3_id;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_p3_id, '500g', 650, 15),
    (v_p3_id, '1 kg', 1250, 10);

  -- 5. Insert Tiger Prawns
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES (
    'Fresh Jumbo Tiger Prawns (Cleaned & Deveined)',
    'Juicy jumbo tiger prawns, peeled, deveined, and ready for Malai Curry or Butter Garlic fry.',
    v_cat_id,
    'Fishes',
    'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80',
    true
  ) RETURNING id INTO v_p4_id;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_p4_id, '250g', 280, 30),
    (v_p4_id, '500g', 540, 20);

  -- 6. Insert Kolkata Bhetki Fillet
  INSERT INTO public.products (name, description, category_id, category_name, image_url, is_available)
  VALUES (
    'Kolkata Bhetki Fish Fillet (Boneless)',
    'Boneless, skinless premium Kolkata Bhetki fillets. Perfect for Fish Fry, Paturi, or Fish Fingers.',
    v_cat_id,
    'Fishes',
    'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80',
    true
  ) RETURNING id INTO v_p5_id;

  INSERT INTO public.product_variants (product_id, unit, price, stock) VALUES
    (v_p5_id, '250g', 320, 25),
    (v_p5_id, '500g', 620, 15);

  RAISE NOTICE 'Successfully seeded 5 fish products with product_variants!';
END $$;
