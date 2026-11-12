"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  createPromoBannerWithImage,
  getBannerWorkspace,
  removePromoBanner,
} from "@/features/banners/services/banners.service";
import type { AdminBanner, BannerCategoryOption } from "@/features/banners/types/banner";
import { Megaphone, Plus, Trash2, Image as ImageIcon, Link as LinkIcon, SortAsc, Loader2 } from "lucide-react";

const MAX_IMAGE_MB = 3;

export default function BannerManager() {
  const [banners, setBanners] = useState<AdminBanner[]>([]);
  const [categories, setCategories] = useState<BannerCategoryOption[]>([]);
  
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const [targetCategory, setTargetCategory] = useState("");
  const [order, setOrder] = useState(1);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBannersAndCategories = async () => {
    try {
      const workspace = await getBannerWorkspace();
      setCategories(workspace.categories);
      setBanners(workspace.banners);
      setOrder(workspace.banners.length + 1);
    } catch (error) {
      console.error('Failed to load banner workspace:', error);
      alert('Could not load banners. Please try again.');
    }
  };

  useEffect(() => {
    fetchBannersAndCategories();
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, []);

  const handlePickImage = (file: File | undefined) => {
    if (!file) return;
    const isValid = file.size <= MAX_IMAGE_MB * 1024 * 1024 &&
      ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
    if (!isValid) {
      setImageError(file.size > MAX_IMAGE_MB * 1024 * 1024 ? `Image must be under ${MAX_IMAGE_MB}MB.` : 'Use a valid JPG, PNG, or WebP image.');
      setImageFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setImageError('');
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (!imageFile) {
      setImageError('Banner image is required.');
      return;
    }

    setLoading(true);
    try {
      await createPromoBannerWithImage({
        title,
        imageFile,
        categoryLink: targetCategory,
        order: Number(order),
      });

      setTitle("");
      setImageFile(null);
      setPreviewUrl(null);
      setImageError("");
      setTargetCategory("");
      if (fileInputRef.current) fileInputRef.current.value = '';

      alert("Banner Published Successfully!");
      fetchBannersAndCategories();
    } catch (error) {
      console.error("Error adding banner:", error);
      alert("Failed to publish banner.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this promotional banner?")) {
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50/50 min-h-screen">

      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase px-3 py-1 rounded-full mb-2">
            <Megaphone size={13} /> PROMOTIONAL CAMPAIGNS
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Banner Management</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">Upload and manage hero promotional banners displayed on the customer website.</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Create Banner Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-6 flex items-center gap-2">
              <Plus size={16} className="text-emerald-600" /> Upload New Banner
            </h2>

            <form onSubmit={handleAddBanner} className="space-y-5">

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-600">Banner Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Royal Fresh Salmon Offer"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-900 outline-none focus:border-emerald-600 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-600 flex items-center gap-1">
                  <SortAsc size={13} /> Display Order
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={e => setOrder(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-900 outline-none focus:border-emerald-600 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-600 flex items-center gap-1">
                  <LinkIcon size={13} /> Link to Category (Optional)
                </label>
                <select
                  value={targetCategory}
                  onChange={e => setTargetCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-900 outline-none focus:border-emerald-600 focus:bg-white transition-all"
                >
                  <option value="">-- No Direct Link --</option>
                  {categories.map(cat => {
                    const parent = cat.parent_id ? categories.find(c => c.id === cat.parent_id) : null;
                    const displayName = parent ? `${parent.name} › ${cat.name}` : cat.name;
                    return (
                      <option key={cat.id} value={cat.name}>{displayName}</option>
                    );
                  })}
                </select>
              </div>

              {/* Image Upload Area */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-600 flex items-center gap-1">
                  <ImageIcon size={13} /> Banner Image (Max 3MB)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={e => handlePickImage(e.target.files?.[0])}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center cursor-pointer hover:border-emerald-500 bg-gray-50/50 hover:bg-emerald-50/20 transition-all group"
                >
                  {previewUrl ? (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden shadow-sm">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                        Change Image
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 space-y-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                        <ImageIcon size={20} />
                      </div>
                      <p className="text-xs font-bold text-gray-700">Click to upload banner image</p>
                      <p className="text-[10px] text-gray-400">JPG, PNG, WebP up to 3MB</p>
                    </div>
                  )}
                </div>
                {imageError && <p className="text-[11px] text-rose-600 font-semibold">{imageError}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-black text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={15} className="animate-spin" />}
                {loading ? "Uploading Banner..." : "Publish Banner"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Existing Banners List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-4">
              Active Promo Banners ({banners.length})
            </h3>

            <div className="space-y-4">
              {banners.map((banner) => (
                <div key={banner.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all">

                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-32 h-20 rounded-xl overflow-hidden shrink-0 border border-gray-200 bg-white shadow-2xs">
                      <img src={banner.image_url} alt={banner.title || ''} className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                        Order #{banner.order_index}
                      </span>
                      <h4 className="font-black text-gray-900 text-sm truncate">{banner.title}</h4>
                      {banner.link && (
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                          <LinkIcon size={12} /> Target: <strong className="text-emerald-700">{banner.link}</strong>
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="self-end sm:self-center p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-200"
                    title="Delete Banner"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {banners.length === 0 && (
                <div className="text-center py-20 text-gray-400 space-y-2">
                  <Megaphone size={36} className="mx-auto text-gray-300" />
                  <p className="font-bold uppercase tracking-wider text-xs">No active banners found.</p>
                  <p className="text-xs text-gray-400 font-medium">Use the form on the left to upload your first banner image.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
