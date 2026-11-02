"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Trash2, FolderTree, Image as ImageIcon, Loader2, Search } from 'lucide-react';
import {
  createCategoryWithImage,
  isCategoryEnabled,
  learnCategoryStatusValues,
  listCategories,
  removeCategory,
  replaceCategoryImage,
  setCategoryEnabled,
} from '@/features/categories/services/categories.service';
import type { AdminCategory } from '@/features/categories/types/category';

type Filter = 'all' | 'active' | 'disabled';

const MAX_IMAGE_MB = 2;

export default function CategoryManager() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const [newCat, setNewCat] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [imageError, setImageError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const replaceTargetRef = useRef<AdminCategory | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const flash = (type: 'error' | 'success', text: string) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3500);
  };

  const fetchCategories = async () => {
    try {
      setCategories(await listCategories());
    } catch (error) {
      console.error('Failed to load categories:', error);
      flash('error', 'Could not load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handlePickImage = (file: File | undefined) => {
    if (!file) return;
    const result = file.type && file.size <= MAX_IMAGE_MB * 1024 * 1024 &&
      ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
    if (!result) {
      setImageError(file.size > MAX_IMAGE_MB * 1024 * 1024 ? `Image must be under ${MAX_IMAGE_MB} MB.` : 'Use a JPG, PNG or WebP image.');
      setImageFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setImageError('');
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Add / change the image of an existing category
  const handleReplaceImage = async (file: File | undefined) => {
    const cat = replaceTargetRef.current;
    if (replaceInputRef.current) replaceInputRef.current.value = '';
    if (!file || !cat) return;
    setUploadingId(cat.id);
    try {
      const url = await replaceCategoryImage(cat.id, file);
      setCategories((prev) => prev.map((c) => (c.id === cat.id ? { ...c, image_url: url } : c)));
      flash('success', 'Image updated');
    } catch (e) {
      console.error('Image update failed:', e);
      flash('error', 'Could not update the image');
    } finally {
      setUploadingId(null);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    if (!imageFile) {
      setImageError('A category image is required.');
      return;
    }
    setIsUploading(true);

    try {
      await createCategoryWithImage(newCat, imageFile, parentId || null);

      setNewCat('');
      setParentId('');
      setImageFile(null);
      setPreviewUrl(null);
      setImageError('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      flash('success', 'Category added');
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      flash('error', 'Failed to add category');
    } finally {
      setIsUploading(false);
    }
  };

  // Enable / disable — updates instantly, rolls back if the save fails
  const handleToggle = async (cat: AdminCategory) => {
    const vocab = learnCategoryStatusValues(categories);
    const nextEnabled = !isCategoryEnabled(cat);
    if (nextEnabled && !cat.image_url) {
      flash('error', 'Add an image before enabling this category.');
      return;
    }
    const prevValue = cat.status;

    setTogglingId(cat.id);
    setCategories((prev) => prev.map((c) => (c.id === cat.id ? { ...c, status: nextEnabled ? vocab.on : vocab.off } : c)));

    try {
      await setCategoryEnabled(cat, nextEnabled, vocab);
      flash('success', `${cat.name} ${nextEnabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      setCategories((prev) => prev.map((c) => (c.id === cat.id ? { ...c, status: prevValue } : c)));
      console.error('Status update failed:', error);
      flash('error', error instanceof Error ? error.message : 'Could not update the category');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteCategory = async (cat: AdminCategory) => {
    if (!confirm(`Delete "${cat.name}"? This cannot be undone. To hide it instead, disable it.`)) return;
    try {
      await removeCategory(cat.id);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      flash('success', 'Category deleted');
    } catch (error) {
      console.error('Error deleting category:', error);
      flash('error', 'Failed to delete category');
    }
  };

  const counts = useMemo(
    () => ({
      all: categories.length,
      active: categories.filter(isCategoryEnabled).length,
      disabled: categories.filter((c) => !isCategoryEnabled(c)).length,
    }),
    [categories]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories.filter((c) => {
      const matchesQ = !q || String(c.name || '').toLowerCase().includes(q);
      const matchesF = filter === 'all' ? true : filter === 'active' ? isCategoryEnabled(c) : !isCategoryEnabled(c);
      return matchesQ && matchesF;
    });
  }, [categories, filter, query]);

  const tabs: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'disabled', label: 'Disabled' },
  ];

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Categories</h1>
        <p className="text-sm sm:text-[13px] text-[#616161] mt-0.5">Disabled categories and its products are hidden from the storefront.</p>
      </div>

      {/* TOAST */}
      {notice && (
        <div
          role="status"
          className={`rounded-lg px-3 py-2 text-[13px] ${
            notice.type === 'error' ? 'bg-[#fed1d7] text-[#8e0b21]' : 'bg-[#cdfed4] text-[#014b40]'
          }`}
        >
          {notice.text}
        </div>
      )}

      {/* ADD CATEGORY */}
      <Card className="p-4 max-w-3xl">
        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-[#f1f1f1] text-[#616161] shrink-0">
            <FolderTree size={16} />
          </div>

          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="New category name"
            className="flex-1 w-full min-h-11 sm:min-h-9 py-2 px-3 text-base sm:text-[13px] text-[#1a1a1a] placeholder:text-[#8a8a8a] bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.2)] outline-none focus:shadow-[0_0_0_2px_#005bd3] transition-shadow"
          />

          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="min-h-11 sm:min-h-9 py-2 px-3 text-base sm:text-[13px] text-[#1a1a1a] bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.2)] outline-none cursor-pointer"
          >
            <option value="">Root Parent Category</option>
            {categories.filter(c => !c.parent_id).map(c => (
              <option key={c.id} value={c.id}>Subcategory of {c.name}</option>
            ))}
          </select>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handlePickImage(e.target.files?.[0])}
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-none min-h-11 sm:min-h-9 py-2 px-3 inline-flex items-center justify-center gap-2 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50 whitespace-nowrap"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="" className="w-5 h-5 rounded object-cover" />
              ) : (
                <ImageIcon size={15} />
              )}
              {imageFile ? (
                <span className="truncate max-w-[110px]">{imageFile.name}</span>
              ) : (
                <span>Add image <span className="text-[#8e0b21]">*</span></span>
              )}
            </button>

            <button
              type="submit"
              disabled={!newCat.trim() || !imageFile || isUploading}
              className="flex-1 sm:flex-none min-h-11 sm:min-h-9 py-2 px-4 min-w-[90px] inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-sm sm:text-[13px] font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? <Loader2 size={15} className="animate-spin" /> : <><Plus size={15} /> Add</>}
            </button>
          </div>
        </form>
        <p className={`mt-2 text-xs sm:text-xs leading-snug ${imageError ? 'text-[#8e0b21]' : 'text-[#616161]'}`}>
          {imageError || `Image required · JPG, PNG or WebP · max ${MAX_IMAGE_MB} MB · resized to max 512 px and compressed as WebP`}
        </p>
      </Card>

      {/* hidden input used to add / change the image of an existing category */}
      <input
        type="file"
        ref={replaceInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => handleReplaceImage(e.target.files?.[0])}
      />

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`min-h-9 py-1.5 px-3 rounded-lg text-sm sm:text-[13px] whitespace-nowrap transition-colors ${
                filter === t.id ? 'bg-[#303030] text-white font-medium' : 'text-[#303030] hover:bg-black/5'
              }`}
            >
              {t.label} <span className={filter === t.id ? 'text-white/70' : 'text-[#8a8a8a]'}>{counts[t.id]}</span>
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories"
            className="w-full min-h-11 sm:min-h-8 py-2 pl-9 pr-3 text-base sm:text-[13px] bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.15)] outline-none focus:shadow-[0_0_0_2px_#005bd3]"
          />
        </div>
      </div>

      {/* GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[88px] bg-white rounded-xl animate-pulse shadow-[0_0_0_1px_rgba(0,0,0,0.06)]" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <Card className="py-14 text-center text-[13px] text-[#616161]">
          {categories.length === 0 ? 'No categories yet. Add your first one above.' : 'No categories match your filter.'}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map((cat) => {
            const on = isCategoryEnabled(cat);
            return (
              <Card key={cat.id} className="p-4 flex items-center gap-4">
                <div className={`h-14 w-14 rounded-lg bg-[#f7f7f7] flex-shrink-0 overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.06)] ${on ? '' : 'opacity-50 grayscale'}`}>
                  {cat.image_url ? (
                    <img src={cat.image_url} alt={cat.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[#8a8a8a]">
                      <ImageIcon size={20} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-semibold capitalize truncate ${on ? 'text-[#1a1a1a]' : 'text-[#8a8a8a]'}`}>{cat.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span
                      className={`inline-flex items-center px-2 h-5 rounded-full text-[11px] font-medium ${
                        on ? 'bg-[#cdfed4] text-[#014b40]' : 'bg-[#e3e3e3] text-[#303030]'
                      }`}
                    >
                      {on ? 'Active' : 'Disabled'}
                    </span>
                    {!cat.image_url && (
                      <span className="inline-flex items-center px-2 h-5 rounded-full text-[11px] font-medium bg-[#ffd6a4] text-[#5e4200]">
                        No image
                      </span>
                    )}
                    <button
                      onClick={() => {
                        replaceTargetRef.current = cat;
                        replaceInputRef.current?.click();
                      }}
                      disabled={uploadingId === cat.id}
                      className="text-[13px] font-medium text-[#005bd3] hover:underline disabled:opacity-50 py-0.5"
                    >
                      {uploadingId === cat.id ? 'Uploading…' : cat.image_url ? 'Change image' : 'Add image'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Enable / disable switch */}
                  <button
                    role="switch"
                    aria-checked={on}
                    aria-label={`${on ? 'Disable' : 'Enable'} ${cat.name}`}
                    onClick={() => handleToggle(cat)}
                    disabled={togglingId === cat.id}
                    title={on ? 'Disable category' : 'Enable category'}
                    className={`relative w-10 h-6 rounded-full transition-colors disabled:opacity-60 ${on ? 'bg-[#303030]' : 'bg-[#c9c9c9]'}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-4' : ''}`}
                    />
                  </button>

                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="p-2 rounded-lg text-[#8a8a8a] hover:text-[#8e0b21] hover:bg-[#fed1d7]/50 transition-colors"
                    title="Delete category"
                    aria-label={`Delete ${cat.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] ${className}`}>
      {children}
    </div>
  );
}