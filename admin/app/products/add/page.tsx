"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, ArrowLeft, Image as ImageIcon, Save, CheckCircle, Plus, Trash2, Loader2, X, Sparkles } from 'lucide-react';
import {
  createCatalogProduct,
  getProductCategories,
} from '@/features/products/services/products.service';
import { compressProductImage } from '@/features/products/utils/product-image';
import type {
  ProductCategory,
  ProductDraft,
  ProductVariantInput,
} from '@/features/products/types/product';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dbCategories, setDbCategories] = useState<ProductCategory[]>([]);

  const [product, setProduct] = useState<ProductDraft>({
    name: '',
    category: '',
    description: '',
  });

  const [variants, setVariants] = useState<ProductVariantInput[]>([
    { unit: '500g', price: 250, stock: 20 },
    { unit: '1 kg', price: 480, stock: 30 }
  ]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const categories = await getProductCategories();
        setDbCategories(categories);
        if (categories.length > 0) {
          setProduct((prev) => ({ ...prev, category: categories[0].name }));
        }
      } catch (error) {
        console.error('Failed to load product categories:', error);
        alert('Could not load categories. Please try again.');
      }
    };
    fetchCats();
  }, []);

  useEffect(() => () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    try {
      const webpFile = await compressProductImage(file);
      setImageFile(webpFile);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(webpFile));
    } catch (err) {
      console.error('Image compression error:', err);
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } finally {
      setCompressing(false);
    }
  };

  const addVariantField = () => {
    setVariants([...variants, { unit: '1 Pack', price: 100, stock: 20 }]);
  };

  const removeVariantField = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariantField = <K extends keyof ProductVariantInput>(
    index: number,
    field: K,
    value: ProductVariantInput[K],
  ) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createCatalogProduct({ ...product, variants, imageFile }, dbCategories);

      alert("Product & WebP Image Uploaded Successfully!");
      router.push('/products');
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error: " + (error instanceof Error ? error.message : "Failed to create product"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase"
        >
          <ArrowLeft size={16} /> Back to Products
        </button>
        <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">Add New Product & Variants</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* GENERAL PRODUCT INFO */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-emerald-950">1. Product Info</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Product Name</label>
              <input
                required
                type="text"
                placeholder="e.g. Padma Hilsa (Ilish) Whole"
                value={product.name}
                onChange={e => setProduct({...product, name: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Category</label>
              <select
                value={product.category}
                onChange={e => setProduct({...product, category: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 outline-none focus:border-amber-400"
              >
                {dbCategories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Fresh catch details, origin, culinary notes..."
              value={product.description}
              onChange={e => setProduct({...product, description: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-900 outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* WEBP COMPRESSED IMAGE UPLOAD */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-black uppercase tracking-wider text-emerald-950">2. Product Image (Auto WebP Optimization)</h2>
            <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
              <Sparkles size={10} /> WebP Compressed
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="h-28 w-28 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 relative">
              {compressing ? (
                <div className="text-center space-y-1 p-2">
                  <Loader2 size={20} className="animate-spin text-amber-500 mx-auto" />
                  <span className="text-[8px] font-bold uppercase text-gray-400 block">Compressing to WebP...</span>
                </div>
              ) : imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="text-gray-300" size={32} />
              )}
            </div>

            <div className="space-y-2 flex-1">
              <label className="cursor-pointer bg-emerald-800 hover:bg-emerald-900 text-amber-300 text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-2 uppercase tracking-wide transition-all">
                <UploadCloud size={16} /> Select Photo
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              </label>
              <p className="text-[10px] text-gray-400 font-medium">Selected image is automatically resized and converted to **optimized WebP format** for lightning-fast loading.</p>
            </div>
          </div>
        </div>

        {/* RELATIONAL VARIANTS MANAGER */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-emerald-950">3. Portion & Weight Variants</h2>
              <p className="text-[10px] text-gray-400">Add options like 250g, 500g, 1 kg with prices and stock levels.</p>
            </div>
            <button
              type="button"
              onClick={addVariantField}
              className="flex items-center gap-1 text-[10px] font-black uppercase bg-emerald-800 text-amber-300 px-3 py-1.5 rounded-xl hover:bg-emerald-900 transition-all"
            >
              <Plus size={12} /> Add Variant
            </button>
          </div>

          <div className="space-y-3">
            {variants.map((v, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3 relative">
                <div className="flex-1 w-full sm:w-auto">
                  <label className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">Unit Portion</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 500g / 1 kg"
                    value={v.unit}
                    onChange={e => updateVariantField(idx, 'unit', e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2 font-bold text-xs"
                  />
                </div>

                <div className="w-full sm:w-28">
                  <label className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">Price (₹)</label>
                  <input
                    required
                    type="number"
                    value={v.price}
                    onChange={e => updateVariantField(idx, 'price', Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2 font-bold text-xs"
                  />
                </div>

                <div className="w-full sm:w-24">
                  <label className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">Stock</label>
                  <input
                    required
                    type="number"
                    value={v.stock}
                    onChange={e => updateVariantField(idx, 'stock', Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-xl p-2 font-bold text-xs"
                  />
                </div>

                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariantField(idx)}
                    className="text-rose-600 hover:text-rose-800 p-2 sm:mt-4"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading || compressing}
          className="w-full bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 transition-all"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Save Product & Optimized WebP Image</>}
        </button>

      </form>
    </div>
  );
}
