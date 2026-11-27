"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useCart } from "../context/CartProvider";
import { Header } from "./components/Header";
import { CategoryNav } from "./components/CategoryNav";
import { ProductCard } from "./components/ProductCard";
import { PreorderCarousel } from "./components/PreorderCarousel";
import { BannerCarousel } from "./components/BannerCarousel";
import { CartBar } from "./components/CartBar";
import { ProductModal } from "./components/ProductModal";
import { useCatalog } from "@/features/catalog/hooks/useCatalog";
import { SubCategory } from "@/features/catalog/types/catalog.types";
import { fetchSubCategoriesFromDb } from "@/features/catalog/repositories/catalog.repository";
import Link from "next/link";
import { useStore } from "./components/StoreGuard";
import { Lock, Package, Headphones } from "lucide-react";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeCategoryTitle, setActiveCategoryTitle] = useState("All Delicacies");
  const [activeSubCategory, setActiveSubCategory] = useState("all");
  const [activeSubSubCategory, setActiveSubSubCategory] = useState("all");

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectionMap, setSelectionMap] = useState<Record<string, number>>({});
  
  const { cart, addToCart, removeFromCart } = useCart();
  const { isOpen: isStoreOpen, message: storeClosedMsg } = useStore();
  const activeSubBtnRef = useRef<HTMLButtonElement>(null);

  const { products, categories, loading } = useCatalog(activeCategory, activeSubCategory);
  const [currentSubCategories, setCurrentSubCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p: any) =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  useEffect(() => {
    if (activeSubBtnRef.current) {
      activeSubBtnRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeSubCategory]);

  useEffect(() => {
    setActiveSubSubCategory("all");
  }, [activeCategory]);

  useEffect(() => {
    const loadSubCats = async () => {
      const catLower = activeCategory.toLowerCase();
      if (catLower === "all" || catLower === "featured") {
        setCurrentSubCategories([]);
        return;
      }

      const parentCat = categories.find(c => c.name.toLowerCase() === catLower);
      if (parentCat) {
        const { data } = await fetchSubCategoriesFromDb(parentCat.id);
        if (data) {
          setCurrentSubCategories(data.map((s: any) => s.name));
          return;
        }
      }
      setCurrentSubCategories([]);
    };

    loadSubCats();
  }, [activeCategory, categories]);

  const handleCategoryChange = (id: string, name: string) => {
    setActiveCategory(name);
    setActiveCategoryTitle(name);
    setActiveSubCategory("all");
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-32 transition-colors duration-300 w-full max-w-[100vw] overflow-x-clip">
      
      {/* Top Header */}
      <Header
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {!isStoreOpen ? (
        <div className="max-w-lg mx-auto p-8 sm:p-12 mt-16 bg-[#FFF9E8] border-2 border-amber-400 rounded-[36px] text-center space-y-6 shadow-2xl relative overflow-hidden m-4 sm:mx-auto">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

          <div className="w-20 h-20 bg-rose-100 text-rose-800 rounded-full border-2 border-rose-300 flex items-center justify-center mx-auto shadow-md relative animate-pulse">
            <Lock size={32} />
          </div>

          <div className="space-y-2">
            <span className="bg-amber-400 text-emerald-950 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest inline-block shadow-xs">
              Operating Hours Notice
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-emerald-950 uppercase tracking-tight">
              We Are Closed Right Now
            </h2>
            <p className="text-xs sm:text-sm text-emerald-900/80 font-medium leading-relaxed max-w-sm mx-auto">
              {storeClosedMsg || "Our store is currently closed for fresh daily orders and deliveries. Please check back later during operating hours."}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/orders"
              className="bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Package size={15} /> Check Past Orders
            </Link>
            <a
              href="https://wa.me/916304076069"
              target="_blank"
              rel="noreferrer"
              className="bg-white hover:bg-amber-50 text-emerald-950 border border-amber-300 font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-widest shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Headphones size={15} /> Contact Support
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Banner Carousel (Top Hero) */}
          <BannerCarousel
            onSelectCategory={(catName: string) => {
              setActiveCategory(catName);
              setActiveCategoryTitle(catName);
              setActiveSubCategory("all");
            }}
          />

          {/* Top Sticky Category Circles Bar */}
          <CategoryNav
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* Sticky Subcategories Filter Bar */}
          {currentSubCategories.length > 0 && (
            <div className="sticky top-[110px] z-25 bg-[#00382b] py-2.5 px-3.5 border-b border-[#002a20] shadow-md">
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
                {currentSubCategories.map((sub: string | SubCategory, index: number) => {
                  const subName = typeof sub === "string" ? sub : sub.name;
                  const isActive = activeSubCategory.toLowerCase() === subName.toLowerCase();
                  return (
                    <button
                      ref={isActive ? activeSubBtnRef : null}
                      key={index}
                      onClick={() => setActiveSubCategory(subName)}
                      className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-[#ffc400] text-[#00382b] shadow-sm"
                          : "bg-[#004d3b] text-emerald-100 border border-[#005a45] hover:bg-[#005a45]"
                      }`}
                    >
                      {subName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

      {/* Products Container */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 pt-5 space-y-6">

        {/* Pre-Orders Carousel (Visible on 'All' view) */}
        {activeCategory.toLowerCase() === 'all' && <PreorderCarousel />}

        {/* Category Title Bar */}
        <div className="flex justify-between items-center border-b border-gray-200/80 pb-3">
           <div>
             <h2 className="text-base sm:text-lg font-black uppercase text-emerald-950 tracking-tight flex items-center gap-2">
               <span>{activeSubCategory !== "all" ? `${activeCategoryTitle} › ${activeSubCategory}` : activeCategoryTitle}</span>
               <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full" suppressHydrationWarning>
                 {filteredProducts.length} Items
               </span>
             </h2>
             <p className="text-[11px] text-gray-500 font-medium mt-0.5">Fresh daily catches & authentic Bengal delicacies.</p>
           </div>
        </div>

        {/* Products Grid */}
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
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-3 shadow-sm">
             <div className="w-16 h-16 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto">
               🍽️
             </div>
             <h3 className="text-base font-black text-gray-900 uppercase">No Items Found {searchQuery ? `for "${searchQuery}"` : `in ${activeCategoryTitle}`}</h3>
             <p className="text-xs text-gray-400 font-medium max-w-sm mx-auto">Try searching for another cut or selecting another category above.</p>
             <button onClick={() => { setSearchQuery(""); setActiveCategory("all"); setActiveCategoryTitle("All Delicacies"); setActiveSubCategory("all"); }} className="bg-emerald-800 text-amber-300 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider">
               View All Items
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredProducts.map((product: any) => {
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
        </>
      )}

      {/* Product Customization Modal */}
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

      {/* Persistent Bottom Cart Bar */}
      <CartBar />

    </main>
  );
}
