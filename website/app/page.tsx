"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useCart } from "../context/CartProvider";
import { Header } from "./components/Header";
import { CategoryNav } from "./components/CategoryNav";
import { ProductCard } from "./components/ProductCard";
import { PreorderCarousel } from "./components/PreorderCarousel";
import { CartBar } from "./components/CartBar";
import { ProductModal } from "./components/ProductModal";

interface SubCategory {
  name: string;
  subSubCategories: string[];
}

interface Category {
  id: string;
  name: string;
  subCategories: (string | SubCategory)[];
}

function generateProductOptions(p: any, activeCampaigns: any[], activeDiscounts: any[]) {
  if (p.product_variants && Array.isArray(p.product_variants) && p.product_variants.length > 0) {
    return p.product_variants.map((v: any) => {
      const activeCamp = activeCampaigns.find((c: any) => c.product_variant_id === v.id);

      // Check variant-specific discount
      let variantDiscountPercent = 0;
      if (activeDiscounts && Array.isArray(activeDiscounts)) {
        for (const disc of activeDiscounts) {
          const isLinked = disc.discount_variants?.some((dv: any) => dv.variant_id === v.id);
          if (isLinked) {
            if (disc.discount_type === 'percentage') {
              variantDiscountPercent = Math.max(variantDiscountPercent, Number(disc.discount_value));
            } else {
              const flatDiscount = Number(disc.discount_value);
              const percentEquiv = Math.round((flatDiscount / Number(v.price)) * 100);
              variantDiscountPercent = Math.max(variantDiscountPercent, percentEquiv);
            }
          }
        }
      }

      const rawPrice = activeCamp ? Number(activeCamp.price) : Number(v.price);
      const hasVariantDiscount = variantDiscountPercent > 0;
      const finalPrice = hasVariantDiscount
        ? Math.round(rawPrice * (1 - (variantDiscountPercent / 100)))
        : rawPrice;

      return {
        id: v.id,
        unit: v.unit,
        price: finalPrice,
        originalPrice: hasVariantDiscount ? rawPrice : (v.original_price ? Number(v.original_price) : undefined),
        discountPercent: variantDiscountPercent,
        stockCount: activeCamp ? (activeCamp.max_quantity - activeCamp.reserved_quantity) : Number(v.stock),
        sku: v.sku,
        preorderCampaign: activeCamp || null,
      };
    });
  }

  const basePrice = Number(p.price) || 100;
  const baseStock = Number(p.stock) || 30;
  const unitStr = (p.unit || '').toLowerCase().trim();

  if (unitStr.includes('500g') || unitStr.includes('500 g')) {
    return [
      { id: `${p.id}-250g`, unit: '250g', price: Math.round(basePrice * 0.55), stockCount: Math.floor(baseStock * 1.2) },
      { id: `${p.id}-500g`, unit: '500g', price: basePrice, stockCount: baseStock },
      { id: `${p.id}-1kg`, unit: '1 kg', price: Math.round(basePrice * 1.9), stockCount: Math.floor(baseStock * 0.8) }
    ];
  }

  return [
    { id: `${p.id}-default`, unit: p.unit || '1 Pack', price: basePrice, stockCount: baseStock }
  ];
}

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeCategoryTitle, setActiveCategoryTitle] = useState("All Delicacies");
  
  const [activeSubCategory, setActiveSubCategory] = useState("all");
  const [activeSubSubCategory, setActiveSubSubCategory] = useState("all");

  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectionMap, setSelectionMap] = useState<Record<string, number>>({});
  
  const { cart, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name", { ascending: true });

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

          setCategories(Object.values(parentMap));
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setActiveSubCategory("all");
    setActiveSubSubCategory("all");
  }, [activeCategory]);

  useEffect(() => {
    setActiveSubSubCategory("all");
  }, [activeSubCategory]);

  const currentSubCategories = useMemo(() => {
    const catLower = activeCategory.toLowerCase();
    if (catLower === "all" || catLower === "featured") return [];
    
    const cat = categories.find(c => c.name.toLowerCase() === catLower);
    return cat?.subCategories || [];
  }, [activeCategory, categories]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // 1. Fetch active preorder campaigns
        const { data: campaigns } = await supabase
          .from("preorder_campaigns")
          .select("*")
          .eq("status", "active");

        // 2. Fetch active variant-specific discounts
        const { data: discounts } = await supabase
          .from("discounts")
          .select("*, discount_variants(*)")
          .eq("is_active", true);

        let query = supabase.from("products").select("*, product_variants(*)");
        const catLower = activeCategory.toLowerCase();

        if (catLower !== "all" && catLower !== "featured") {
          const firstWord = catLower.split(" ")[0];
          query = query.ilike("category_name", `%${firstWord}%`);
        }

        const { data, error } = await query;
        if (!error && data) {
          setProducts(data.map(p => {
            const options = generateProductOptions(p, campaigns || [], discounts || []);
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
            };
          }));
        }
      } catch (error) {
        console.error("Supabase Fetch Error:", error);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [activeCategory, activeSubCategory, activeSubSubCategory]);

  return (
    <main className="min-h-screen bg-gray-50 pb-32 transition-colors duration-300 w-full max-w-[100vw] overflow-x-clip">
      
      <Header 
        activeCategory={activeCategory} 
        onCategoryChange={(id: string, name: string) => {
             setActiveCategory(name);
             setActiveCategoryTitle(name);
        }}
      />

      {/* TOP STICKY CATEGORY CIRCLES BAR */}
      <CategoryNav
        activeCategory={activeCategory}
        onCategoryChange={(id: string, name: string) => {
             setActiveCategory(name); 
             setActiveCategoryTitle(name);
        }}
      />

      {/* STICKY SUBCATEGORIES FILTER BAR MATCHING SCREENSHOT */}
      {currentSubCategories.length > 0 && (
        <div className="sticky top-[86px] z-20 bg-[#00382b] py-2.5 px-3.5 border-b border-[#002a20] shadow-md">
          <div className="max-w-7xl mx-auto flex gap-2.5 overflow-x-auto no-scrollbar items-center">
            <button
              onClick={() => setActiveSubCategory("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                activeSubCategory === "all"
                  ? "bg-[#ffc400] text-[#00382b] shadow-sm"
                  : "bg-[#004d3b] text-emerald-100 border border-[#005a45] hover:bg-[#005a45]"
              }`}
            >
              ALL
            </button>
            {currentSubCategories.map((sub) => {
              const name = typeof sub === 'string' ? sub : sub.name;
              const isActive = activeSubCategory.toLowerCase() === name.toLowerCase();
              return (
                <button
                  key={name}
                  onClick={() => setActiveSubCategory(name)}
                  className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#ffc400] text-[#00382b] shadow-sm"
                      : "bg-[#004d3b] text-emerald-100 border border-[#005a45] hover:bg-[#005a45]"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* PRODUCTS CONTAINER */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 pt-5 space-y-6">

        {/* PREORDER CAROUSEL */}
        <PreorderCarousel />

        {/* CATEGORY TITLE BAR */}
        <div className="flex justify-between items-center border-b border-gray-200/80 pb-3">
           <div>
             <h2 className="text-base sm:text-lg font-black uppercase text-emerald-950 tracking-tight flex items-center gap-2">
               <span>{activeCategoryTitle}</span>
               <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
                 {products.length} Items
               </span>
             </h2>
             <p className="text-[11px] text-gray-500 font-medium mt-0.5">Fresh daily catches & authentic Bengal delicacies.</p>
           </div>
        </div>

        {/* PRODUCTS GRID */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm animate-pulse h-64 flex flex-col justify-between">
                <div className="w-full h-32 bg-gray-100 rounded-2xl" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-8 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-3 shadow-sm">
             <div className="w-16 h-16 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto">
               🍽️
             </div>
             <h3 className="text-base font-black text-gray-900 uppercase">No Items in {activeCategoryTitle}</h3>
             <p className="text-xs text-gray-400 font-medium max-w-sm mx-auto">Try selecting another category circle above or search for fresh catches.</p>
             <button onClick={() => { setActiveCategory("all"); setActiveCategoryTitle("All Delicacies"); }} className="bg-emerald-800 text-amber-300 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider">
               View All Items
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {products.map(product => {
              const selectedOptIdx = selectionMap[product.id] || 0;
              const currentOpt = product.options?.[selectedOptIdx] || product.options?.[0];
              const cartItemId = currentOpt?.id || `${product.id}-${selectedOptIdx}`;

              const itemQuantity = cart.filter((i: any) => i.id === cartItemId).length;

              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  category={product.category}
                  price={currentOpt?.price || product.price}
                  originalPrice={currentOpt?.originalPrice || product.originalPrice}
                  discountPercent={currentOpt?.discountPercent || product.discount}
                  img={product.img || product.imageUrl}
                  options={product.options}
                  selectedOptionIndex={selectedOptIdx}
                  quantity={itemQuantity}
                  stockCount={currentOpt?.stockCount ?? product.stock}
                  preorderCampaign={currentOpt?.preorderCampaign || null}
                  onSelectOption={(idx: number) => {
                    setSelectionMap(prev => ({ ...prev, [product.id]: idx }));
                  }}
                  onAddToCart={() => {
                    addToCart({
                      id: cartItemId,
                      product_id: product.id,
                      name: product.name,
                      price: currentOpt?.price || product.price,
                      unit: currentOpt?.unit || 'pack',
                      img: product.img || product.imageUrl,
                    }, currentOpt?.stockCount ?? 99);
                  }}
                  onRemoveFromCart={() => {
                    removeFromCart(cartItemId);
                  }}
                  onOpenModal={() => setSelectedProduct(product)}
                />
              );
            })}
          </div>
        )}

      </div>

      {/* QUICK VIEW MODAL */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct}
          selectedOptionIndex={selectionMap[selectedProduct.id] || 0}
          onSelectOption={(idx: number) => {
            setSelectionMap(prev => ({ ...prev, [selectedProduct.id]: idx }));
          }}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* FLOATING CART BAR */}
      <CartBar />

    </main>
  );
}
