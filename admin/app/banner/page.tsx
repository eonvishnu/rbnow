"use client";

import React, { useState, useEffect } from "react";
import {
  createPromoBanner,
  getBannerWorkspace,
  removePromoBanner,
} from "@/features/banners/services/banners.service";
import type { AdminBanner, BannerCategoryOption } from "@/features/banners/types/banner";

export default function BannerManager() {
  const [banners, setBanners] = useState<AdminBanner[]>([]);
  const [categories, setCategories] = useState<BannerCategoryOption[]>([]);
  
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [code, setCode] = useState("");
  const [targetCategory, setTargetCategory] = useState("");
  const [order, setOrder] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchBannersAndCategories = async () => {
    try {
      const workspace = await getBannerWorkspace();
      setCategories(workspace.categories);
      setBanners(workspace.banners);
    } catch (error) {
      console.error('Failed to load banner workspace:', error);
      alert('Could not load banners. Please try again.');
    }
  };

  useEffect(() => {
    fetchBannersAndCategories();
  }, []);

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createPromoBanner({
        title,
        imageUrl: imgUrl,
        categoryLink: targetCategory,
        order: Number(order),
      });

      setTitle("");
      setSubtitle("");
      setCode("");
      setImgUrl("");
      alert("Banner Added Successfully!");
      fetchBannersAndCategories();
    } catch (error) {
      console.error("Error adding banner:", error);
      alert("Failed to add banner.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      try {
        await removePromoBanner(id);
        fetchBannersAndCategories();
      } catch (error) {
        console.error('Failed to delete banner:', error);
        alert('Failed to delete banner.');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">📢 Manage Promo Banners</h2>

      <form onSubmit={handleAddBanner} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 ">Main Title</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Fresh Salmon"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 ">Image URL</label>
            <input 
              required
              type="text" 
              placeholder="https://..."
              value={imgUrl}
              onChange={e => setImgUrl(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
            />
            {imgUrl && <img src={imgUrl} className="h-10 w-10 mt-2 rounded-md object-cover inline-block border" alt="Preview" />}
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 ">Link to Category (Optional)</label>
            <select 
              value={targetCategory}
              onChange={e => setTargetCategory(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none bg-white"
            >
              <option value="">-- No Link --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 ">Display Order</label>
            <input 
              type="number" 
              value={order}
              onChange={e => setOrder(Number(e.target.value))}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>

        <div className="md:col-span-2 pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? "Saving..." : "+ Create Banner"}
          </button>
        </div>
      </form>

      <h3 className="text-lg font-medium text-gray-800 mb-4 border-t border-gray-100 pt-6">Existing Banners</h3>
      <div className="space-y-4">
        {banners.map((banner) => (
          <div key={banner.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-white hover:shadow-sm transition-shadow">
            <div className={`w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100`}>
              <img src={banner.image_url} alt={banner.title || ''} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{banner.title}</h4>
              {banner.link && <p className="text-xs text-gray-500 font-mono">Link: {banner.link}</p>}
            </div>

            <button
              onClick={() => handleDelete(banner.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              🗑️
            </button>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">No banners created yet.</div>
        )}
      </div>
    </div>
  );
}
