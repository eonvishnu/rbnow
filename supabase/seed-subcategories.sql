-- SEED SUBCATEGORIES INTO PUBLIC.CATEGORIES WITH PARENT_ID

DO $$
DECLARE
  v_fish_id uuid;
  v_meat_id uuid;
  v_veg_id uuid;
  v_groc_id uuid;
BEGIN
  -- 1. Fetch Root Category IDs
  SELECT id INTO v_fish_id FROM public.categories WHERE name ILIKE '%fish%' AND parent_id IS NULL LIMIT 1;
  SELECT id INTO v_meat_id FROM public.categories WHERE name ILIKE '%meat%' AND parent_id IS NULL LIMIT 1;
  SELECT id INTO v_veg_id FROM public.categories WHERE name ILIKE '%veg%' AND parent_id IS NULL LIMIT 1;
  SELECT id INTO v_groc_id FROM public.categories WHERE name ILIKE '%groc%' AND parent_id IS NULL LIMIT 1;

  -- 2. Insert Fish Subcategories
  IF v_fish_id IS NOT NULL THEN
    INSERT INTO public.categories (name, parent_id, is_active) VALUES
      ('Freshwater Fish', v_fish_id, true),
      ('Seawater Fish', v_fish_id, true),
      ('Prawns & Crabs', v_fish_id, true),
      ('Bengali Delicacies', v_fish_id, true),
      ('Exotic Catch', v_fish_id, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- 3. Insert Meat Subcategories
  IF v_meat_id IS NOT NULL THEN
    INSERT INTO public.categories (name, parent_id, is_active) VALUES
      ('Chicken', v_meat_id, true),
      ('Mutton', v_meat_id, true),
      ('Eggs', v_meat_id, true),
      ('Cold Cuts', v_meat_id, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- 4. Insert Vegetables Subcategories
  IF v_veg_id IS NOT NULL THEN
    INSERT INTO public.categories (name, parent_id, is_active) VALUES
      ('Fresh Veggies', v_veg_id, true),
      ('Leafy Greens', v_veg_id, true),
      ('Fruits', v_veg_id, true),
      ('Organic', v_veg_id, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- 5. Insert Groceries Subcategories
  IF v_groc_id IS NOT NULL THEN
    INSERT INTO public.categories (name, parent_id, is_active) VALUES
      ('Spices & Mustard', v_groc_id, true),
      ('Rice & Flour', v_groc_id, true),
      ('Oils & Ghee', v_groc_id, true),
      ('Pickles & Sauces', v_groc_id, true)
    ON CONFLICT DO NOTHING;
  END IF;

  RAISE NOTICE 'Successfully seeded subcategories with parent_id relationships!';
END $$;
