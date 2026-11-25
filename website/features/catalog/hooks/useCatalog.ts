import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchCategoriesFromDb, fetchPreorderProductsFromDb, fetchActiveDiscountsFromDb, fetchSubCategoriesFromDb } from '../repositories/catalog.repository';
import { generateProductOptions } from '../utils/catalog.utils';
import { Category } from '../types/catalog.types';

export function useCatalog(activeCategory: string, activeSubCategory: string) {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load from localStorage on client mount (preventing SSR hydration mismatch)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cachedCat = localStorage.getItem('royal_bengal_cached_categories');
      if (cachedCat) {
        try {
          setCategories(JSON.parse(cachedCat));
        } catch (e) {}
      }

      const cacheKey = `royal_bengal_cached_products_${activeCategory}_${activeSubCategory}`;
      const cachedProd = localStorage.getItem(cacheKey);
      if (cachedProd) {
        try {
          const parsed = JSON.parse(cachedProd);
          setProducts(parsed);
          if (parsed.length > 0) {
            setLoading(false);
          }
        } catch (e) {}
      }
    }
  }, [activeCategory, activeSubCategory]);

  // Stale-While-Revalidate Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await fetchCategoriesFromDb();

        if (!error && data) {
          const parentMap: Record<string, Category> = {};
          const subMap: Record<string, string[]> = {};

          data.forEach(c => {
            if (!c.parent_id) {
              parentMap[c.id] = { id: c.id, name: c.name, subCategories: [] };
            } else {
              subMap[c.parent_id] = subMap[c.parent_id] || [];
              subMap[c.parent_id].push(c.name);
            }
          });

          Object.keys(subMap).forEach(pId => {
            if (parentMap[pId]) {
              parentMap[pId].subCategories = subMap[pId];
            }
          });

          const newCats = Object.values(parentMap);
          setCategories(newCats);
          try {
            localStorage.setItem('royal_bengal_cached_categories', JSON.stringify(newCats));
          } catch (e) {}
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Stale-While-Revalidate Products
  useEffect(() => {
    let isMounted = true;
    const cacheKey = `royal_bengal_cached_products_${activeCategory}_${activeSubCategory}`;

    const fetchProducts = async () => {
      try {
        const [{ data: preorderProds }, { data: discounts }] = await Promise.all([
          fetchPreorderProductsFromDb(),
          fetchActiveDiscountsFromDb(),
        ]);

        const activeCamp = preorderProds?.[0] ? {
          name: preorderProds[0].name,
          max_quantity: preorderProds[0].preorder_limit || 100,
          reserved_quantity: preorderProds[0].product_variants?.[0]?.preorder_reserved_qty || 0,
        } : null;

        let query = supabase.from("products").select("*, product_variants(*)");
        const catLower = activeCategory.toLowerCase();

        if (catLower !== "all" && catLower !== "featured") {
          const parentCat = categories.find(c => c.name.toLowerCase() === catLower);
          if (parentCat) {
            const { data: subCats } = await fetchSubCategoriesFromDb(parentCat.id);

            const validCatIds = [parentCat.id, ...(subCats ? subCats.map(s => s.id) : [])];

            if (activeSubCategory && activeSubCategory !== "all") {
              const targetSub = subCats?.find(s => s.name.toLowerCase() === activeSubCategory.toLowerCase());
              if (targetSub) {
                query = query.eq("category_id", targetSub.id);
              } else {
                query = query.in("category_id", validCatIds);
              }
            } else {
              query = query.in("category_id", validCatIds);
            }
          } else {
            const firstWord = catLower.split(" ")[0];
            query = query.ilike("category_name", `%${firstWord}%`);
          }
        } else if (catLower === "featured") {
          query = query.eq("is_available", true).limit(12);
        }

        const { data, error } = await query;

        if (isMounted) {
          if (!error && data) {
            const mapped = data.map(p => {
              const options = generateProductOptions(p, activeCamp ? [activeCamp] : [], discounts || []);
              const defaultOpt = options[0];
              return {
                id: p.id,
                name: p.name,
                description: p.description,
                category: p.category_name,
                price: defaultOpt?.price || p.price,
                originalPrice: defaultOpt?.originalPrice || p.original_price,
                discount: defaultOpt?.discountPercent || 0,
                img: p.image_url,
                imageUrl: p.image_url,
                unit: defaultOpt?.unit || p.unit || 'piece',
                stock: defaultOpt?.stockCount || p.stock,
                options: options,
                raw: p,
              };
            });
            setProducts(mapped);
            try {
              localStorage.setItem(cacheKey, JSON.stringify(mapped));
            } catch (e) {}
          }
        }
      } catch (error) {
        console.error("Supabase Fetch Error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [activeCategory, activeSubCategory, categories]);

  return { products, categories, loading };
}
