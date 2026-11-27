"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Search, Plus, Trash2, X, Image as ImageIcon, Loader2, ChevronDown, Pencil, UploadCloud, Save } from 'lucide-react';
import {
  getProductCatalog,
  hasLowStock,
  LOW_STOCK_THRESHOLD,
  parseQuickVariantUpdate,
  removeProduct,
  saveVariantQuickUpdates,
  setProductAvailability,
  updateCatalogProduct,
} from '@/features/products/services/products.service';
import {
  compressProductImage,
  PRODUCT_IMAGE_MAX_SIZE_MB,
  validateProductImage,
} from '@/features/products/utils/product-image';
import type {
  AdminProduct,
  ProductCategory,
  ProductEditDraft,
  ProductVariant,
} from '@/features/products/types/product';

const PAGE_SIZE = 20;

type Tab = 'all' | 'active' | 'disabled' | 'low';

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

const priceRange = (p: AdminProduct) => {
  if (!p.variants.length) return '₹0';
  const prices = p.variants.map((v) => Number(v.price) || 0);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatCurrency(min) : `${formatCurrency(min)} – ${formatCurrency(max)}`;
};

const getProductType = (catName?: string | null) => {
  const c = (catName || '').toLowerCase();
  if (c.includes('meat') || c.includes('fish') || c.includes('chicken') || c.includes('mutton')) return 'Meat';
  if (c.includes('vegetable') || c.includes('fruit') || c.includes('veg')) return 'Vegetables';
  if (c.includes('grocery') || c.includes('dal') || c.includes('oil') || c.includes('rice')) return 'Grocery';
  return 'Delicacy';
};

const inputCls =
  'w-full min-h-11 sm:min-h-9 py-2 px-3 text-base sm:text-[13px] text-[#1a1a1a] placeholder:text-[#8a8a8a] bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.2)] outline-none focus:shadow-[0_0_0_2px_#005bd3] transition-shadow';

export default function ProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<Tab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterParentCatId, setFilterParentCatId] = useState('All');
  const [filterSubCatName, setFilterSubCatName] = useState('All');
  const [visible, setVisible] = useState(PAGE_SIZE);

  // quick edit
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { price: string; stock: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // full edit drawer
  const [editing, setEditing] = useState<ProductEditDraft | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editError, setEditError] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const flash = (type: 'error' | 'success', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProducts = async () => {
    try {
      const catalog = await getProductCatalog();
      setProducts(catalog.products);
      setCategories(catalog.categories);
    } catch (error) {
      console.error('Failed to load product catalog:', error);
      flash('error', 'Could not load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !isSubmitting && closeEditor();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // ---------- derived data ----------
  const stats = useMemo(() => {
    let value = 0, low = 0, out = 0;
    products.forEach((p) =>
      p.variants.forEach((v) => {
        const stock = Number(v.stock) || 0;
        value += (Number(v.price) || 0) * stock;
        if (stock <= 0) out++;
        else if (stock < LOW_STOCK_THRESHOLD) low++;
      })
    );
    return { total: products.length, active: products.filter((p) => p.isAvailable).length, value, low, out };
  }, [products]);

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: products.length },
    { id: 'active', label: 'Active', count: stats.active },
    { id: 'disabled', label: 'Disabled', count: products.length - stats.active },
    { id: 'low', label: 'Low stock', count: products.filter(hasLowStock).length },
  ];

  const parentCategories = useMemo(() => {
    return categories.filter((c: any) => !c.parent_id);
  }, [categories]);

  const availableSubcategories = useMemo(() => {
    if (filterParentCatId === 'All') return [];
    return categories.filter((c: any) => c.parent_id === filterParentCatId);
  }, [categories, filterParentCatId]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQ = !q || p.name.toLowerCase().includes(q) || String(p.category || '').toLowerCase().includes(q);

      let matchesCat = true;
      if (filterSubCatName !== 'All') {
        matchesCat = p.category === filterSubCatName;
      } else if (filterParentCatId !== 'All') {
        const parentCat = categories.find((c: any) => c.id === filterParentCatId);
        const subCatNames = categories.filter((c: any) => c.parent_id === filterParentCatId).map((c: any) => c.name);
        matchesCat = p.category === parentCat?.name || subCatNames.includes(p.category);
      }

      const matchesTab = tab === 'all' ? true : tab === 'active' ? p.isAvailable : tab === 'disabled' ? !p.isAvailable : hasLowStock(p);
      return matchesQ && matchesCat && matchesTab;
    });
  }, [products, searchQuery, filterParentCatId, filterSubCatName, tab, categories]);

  useEffect(() => setVisible(PAGE_SIZE), [searchQuery, filterParentCatId, filterSubCatName, tab]);

  // ---------- enable / disable ----------
  const handleToggle = async (p: AdminProduct) => {
    const next = !p.isAvailable;
    if (next && !p.imageUrl) return flash('error', 'Add an image before enabling this product.');
    setTogglingId(p.id);
    setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, isAvailable: next } : x)));
    try {
      await setProductAvailability(p, next);
      flash('success', `${p.name} ${next ? 'enabled' : 'disabled'}`);
    } catch (error) {
      setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, isAvailable: !next } : x)));
      console.error('Product availability update failed:', error);
      flash('error', error instanceof Error ? error.message : 'Could not update the product');
    } finally {
      setTogglingId(null);
    }
  };

  // ---------- quick edit (price & stock in the list) ----------
  const draftOf = (v: ProductVariant) => drafts[v.id] ?? { price: String(v.price ?? ''), stock: String(v.stock ?? '') };
  const isDirty = (v: ProductVariant) => !!drafts[v.id] && (drafts[v.id].price !== String(v.price ?? '') || drafts[v.id].stock !== String(v.stock ?? ''));
  const productDirty = (p: AdminProduct) => p.variants.some(isDirty);

  const setDraft = (v: ProductVariant, field: 'price' | 'stock', value: string) =>
    setDrafts((d) => ({ ...d, [v.id]: { ...draftOf(v), [field]: value } }));

  const discardQuick = (p: AdminProduct) =>
    setDrafts((d) => {
      const copy = { ...d };
      p.variants.forEach((v) => delete copy[v.id]);
      return copy;
    });

  const saveQuick = async (p: AdminProduct) => {
    const changed = p.variants.filter(isDirty);
    if (!changed.length) return;

    const rows = [];
    for (const v of changed) {
      const d = drafts[v.id];
      const result = parseQuickVariantUpdate({ id: v.id, ...d });
      if (!result.success) return flash('error', `${result.error.issues[0]?.message || 'Enter valid price and stock.'} (${v.unit})`);
      rows.push(result.data);
    }

    setSavingId(p.id);
    try {
      const result = await saveVariantQuickUpdates(rows);
      const okIds = rows.filter((row) => result.succeededIds.includes(row.id));

      setProducts((prev) =>
        prev.map((x) =>
          x.id !== p.id
            ? x
            : { ...x, variants: x.variants.map((v) => {
                const updated = okIds.find((row) => row.id === v.id);
                return updated ? { ...v, price: updated.price, stock: updated.stock, is_available: updated.stock > 0 } : v;
              }) }
        )
      );
      setDrafts((d) => {
        const copy = { ...d };
        okIds.forEach((row) => delete copy[row.id]);
        return copy;
      });

      if (result.failedCount) flash('error', `${result.failedCount} variant${result.failedCount > 1 ? 's' : ''} could not be saved. Please try again.`);
      else flash('success', 'Changes saved');
    } catch (error) {
      console.error('Quick product update failed:', error);
      flash('error', 'Could not save product changes.');
    } finally {
      setSavingId(null);
    }
  };

  // ---------- delete ----------
  const handleDeleteProduct = async (p: AdminProduct) => {
    if (!confirm(`Delete "${p.name}" and all its variants? This cannot be undone. To hide it instead, disable it.`)) return;
    try {
      await removeProduct(p.id);
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
      flash('success', 'Product deleted');
    } catch (error) {
      console.error('Delete failed:', error);
      flash('error', 'Could not delete. It may be part of past orders — disable it instead.');
    }
  };

  // ---------- full edit drawer ----------
  const openEditor = (p: AdminProduct) => {
    setEditError('');
    setEditing({
      id: p.id,
      name: p.name,
      category: p.category || '',
      description: p.description || '',
      imageUrl: p.imageUrl || '',
      sale_mode: p.sale_mode || 'regular',
      expected_dispatch_date: p.expected_dispatch_date || '',
      preorder_limit: p.preorder_limit !== null && p.preorder_limit !== undefined ? String(p.preorder_limit) : '',
      preorder_description: p.preorder_description || '',
      newImageFile: null as File | null,
      newImagePreview: '' as string,
      removed: [] as string[],
      variants: p.variants.map((v) => ({
        id: v.id,
        unit: v.unit || '',
        price: String(v.price ?? ''),
        stock: String(v.stock ?? ''),
      })),
    });
  };

  const closeEditor = () => {
    setEditing((cur) => {
      if (cur?.newImagePreview) URL.revokeObjectURL(cur.newImagePreview);
      return null;
    });
  };

  const setEditField = (patch: Partial<ProductEditDraft>) =>
    setEditing((cur) => cur ? { ...cur, ...patch } : cur);

  const updateEditVariant = (index: number, field: 'unit' | 'price' | 'stock', value: string) =>
    setEditing((cur) => {
      if (!cur) return cur;
      const variants = [...cur.variants];
      variants[index] = { ...variants[index], [field]: value };
      return { ...cur, variants };
    });

  const addEditVariant = () =>
    setEditing((cur) => cur ? { ...cur, variants: [...cur.variants, { id: `temp_${Date.now()}`, unit: '', price: '', stock: '0' }] } : cur);

  const removeEditVariant = (index: number) =>
    setEditing((cur) => {
      if (!cur) return cur;
      const v = cur.variants[index];
      const isSaved = v.id && !String(v.id).startsWith('temp_');
      return {
        ...cur,
        variants: cur.variants.filter((_, i) => i !== index),
        removed: isSaved ? [...cur.removed, String(v.id)] : cur.removed,
      };
    });

  const handleEditImage = (file?: File) => {
    if (!file) return;
    compressProductImage(file)
      .then((webp) => {
        setEditing((cur) => {
          if (!cur) return cur;
          if (cur.newImagePreview) URL.revokeObjectURL(cur.newImagePreview);
          return { ...cur, newImageFile: webp, newImagePreview: URL.createObjectURL(webp) };
        });
      })
      .catch((err) => {
        console.error('Image compression error:', err);
        setEditing((cur) => {
          if (!cur) return cur;
          if (cur.newImagePreview) URL.revokeObjectURL(cur.newImagePreview);
          return { ...cur, newImageFile: file, newImagePreview: URL.createObjectURL(file) };
        });
      });
  };

  const handleUpdateProduct = async () => {
    if (!editing) return;
    if (!editing.name.trim()) return setEditError('Product name is required.');
    if (!editing.variants.length) return setEditError('At least one variant is required.');

    setIsSubmitting(true);
    setEditError('');
    try {
      await updateCatalogProduct(editing, categories);
      flash('success', 'Product updated successfully');
      closeEditor();
      fetchProducts();
    } catch (error) {
      console.error('Update failed:', error);
      setEditError(error instanceof Error ? error.message : 'Could not save product changes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Products</h1>
        <Link
          href="/products/add"
          className="min-h-10 sm:min-h-8 px-4 sm:px-3 inline-flex items-center gap-1.5 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-sm sm:text-[13px] font-medium text-white transition-colors"
        >
          <Plus size={15} /> Add product
        </Link>
      </div>

      {/* KPI STRIP */}
      <Card className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-200/80">
        <Kpi label="Products" value={`${stats.total}`} sub={`${stats.active} active`} loading={loading} />
        <Kpi label="Inventory value" value={formatCurrency(stats.value)} loading={loading} />
        <Kpi label="Low stock variants" value={`${stats.low}`} sub={`under ${LOW_STOCK_THRESHOLD} left`} warn={stats.low > 0} loading={loading} />
        <Kpi label="Out of stock variants" value={`${stats.out}`} warn={stats.out > 0} loading={loading} />
      </Card>

      {/* LIST CARD */}
      <Card className="overflow-hidden">
        <div className="px-3 sm:px-4 pt-3 space-y-3">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`min-h-9 py-1.5 px-3 rounded-lg text-sm sm:text-[13px] whitespace-nowrap transition-colors ${
                  tab === t.id ? 'bg-[#303030] text-white font-medium' : 'text-[#303030] hover:bg-gray-100'
                }`}
              >
                {t.label} <span className={tab === t.id ? 'text-white/70' : 'text-[#8a8a8a]'}>{t.count}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]" />
              <input
                placeholder="Search products or categories"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${inputCls} pl-9`}
              />
            </div>

            {/* Parent Category Filter */}
            <select
              value={filterParentCatId}
              onChange={(e) => {
                setFilterParentCatId(e.target.value);
                setFilterSubCatName('All');
              }}
              className={`${inputCls} sm:w-44 cursor-pointer`}
            >
              <option value="All">All parent categories</option>
              {parentCategories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Subcategory Filter (Cascading) */}
            <select
              value={filterSubCatName}
              onChange={(e) => setFilterSubCatName(e.target.value)}
              disabled={filterParentCatId === 'All' || availableSubcategories.length === 0}
              className={`${inputCls} sm:w-44 cursor-pointer disabled:opacity-50`}
            >
              <option value="All">All subcategories</option>
              {availableSubcategories.map((sub: any) => (
                <option key={sub.id} value={sub.name}>{sub.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs sm:text-[12.5px] tabular-nums">
            <thead>
              <tr className="bg-[#f7faf8] text-[#64736c] border-y border-gray-200/80 font-medium">
                <th className="py-2.5 pl-4 pr-2 w-8"><span className="sr-only">Select</span></th>
                <th className="px-3 py-2.5 font-semibold">Product</th>
                <th className="px-3 py-2.5 font-semibold">Status</th>
                <th className="px-3 py-2.5 font-semibold">Inventory</th>
                <th className="px-3 py-2.5 font-semibold">Category</th>
                <th className="px-3 py-2.5 font-semibold">Channels</th>
                <th className="px-3 py-2.5 font-semibold">Product type</th>
                <th className="px-3 py-2.5 font-semibold pr-4">Vendor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr><td colSpan={8} className="p-8 text-center text-gray-400">Loading products...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="p-12 text-center text-gray-500">No products match your search or filter.</td></tr>
              ) : (
                filtered.slice(0, visible).map((p) => {
                  const totalStock = p.variants.reduce((s, v) => s + (Number(v.stock) || 0), 0);
                  const allOut = p.variants.length > 0 && totalStock <= 0;
                  const prodType = getProductType(p.category);
                  return (
                    <tr key={p.id} className={`hover:bg-gray-50/80 transition-colors group ${p.isAvailable ? '' : 'bg-[#fafafa]'}`}>
                      <td className="py-2.5 pl-4 pr-2">
                        <input type="checkbox" className="rounded border-gray-300 text-[#006B50] focus:ring-[#006B50] cursor-pointer" />
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-[#f7f7f7] shrink-0 overflow-hidden border border-gray-200 flex items-center justify-center">
                            {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-gray-400" />}
                          </div>
                          <div className="min-w-0">
                            <button onClick={() => openEditor(p)} className="font-semibold text-gray-900 hover:text-[#006B50] text-left cursor-pointer truncate max-w-xs block">
                              {p.name}
                            </button>
                            <p className="text-[11px] text-gray-400">{p.variants.length} variant{p.variants.length === 1 ? '' : 's'} · {priceRange(p)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.isAvailable ? 'bg-[#cdfed4] text-[#014b40]' : 'bg-gray-100 text-gray-600'}`}>
                          {p.isAvailable ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-gray-700">
                        {allOut ? <span className="text-rose-600 font-bold">0 in stock</span> : `${totalStock} in stock`}
                      </td>
                      <td className="px-3 py-2.5 text-gray-600">{p.category || 'Uncategorized'}</td>
                      <td className="px-3 py-2.5 text-gray-600">2</td>
                      <td className="px-3 py-2.5 text-gray-600">{prodType}</td>
                      <td className="px-3 py-2.5 text-gray-600 pr-4">Royal Bengal</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm sm:text-[13px] text-[#616161]">
            <span>Showing {Math.min(visible, filtered.length)} of {filtered.length}</span>
            {visible < filtered.length && (
              <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="min-h-9 py-1.5 px-3 rounded-lg bg-white font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50">
                Show more
              </button>
            )}
          </div>
        )}
      </Card>

      {/* EDIT DRAWER */}
      {editing && (
        <div className="relative z-[100]">
          <div className="fixed inset-0 bg-black/40" onClick={() => !isSubmitting && closeEditor()} />
          <aside className="fixed inset-y-0 right-0 w-full max-w-lg bg-[#f1f1f1] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="h-14 px-4 sm:px-5 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
              <h2 className="text-sm font-semibold text-[#1a1a1a] truncate">Edit product</h2>
              <button onClick={closeEditor} disabled={isSubmitting} className="p-2 -mr-2 rounded-lg hover:bg-gray-100" aria-label="Close"><X size={18} /></button>
            </div>

            <form onSubmit={handleUpdateProduct} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {editError && <p role="alert" className="rounded-lg bg-[#fed1d7] px-3 py-2 text-sm sm:text-[13px] text-[#8e0b21]">{editError}</p>}

              {/* image */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-[#1a1a1a] mb-3">Image <span className="text-[#8e0b21]">*</span></h3>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 rounded-lg bg-[#f7f7f7] overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.08)] flex items-center justify-center shrink-0">
                    {editing.newImagePreview || editing.imageUrl ? (
                      <img src={editing.newImagePreview || editing.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={26} className="text-[#8a8a8a]" />
                    )}
                  </div>
                  <div className="space-y-2 min-w-0">
                    <input type="file" ref={imageInputRef} accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleEditImage(e.target.files?.[0])} />
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="min-h-10 sm:min-h-9 py-2 px-3 inline-flex items-center gap-2 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50"
                    >
                      <UploadCloud size={15} /> {editing.imageUrl || editing.newImageFile ? 'Change image' : 'Add image'}
                    </button>
                    <p className="text-xs text-[#616161] leading-snug">JPG, PNG or WebP · max {PRODUCT_IMAGE_MAX_SIZE_MB} MB · converted to WebP automatically</p>
                    {editing.newImageFile && <p className="text-xs text-[#014b40]">New image will be saved when you press Save.</p>}
                  </div>
                </div>
              </Card>

              {/* general */}
              <Card className="p-4 space-y-3">
                <h3 className="text-sm font-semibold text-[#1a1a1a]">General</h3>
                <Field label="Product name">
                  <input value={editing.name} onChange={(e) => setEditField({ name: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Category">
                  <select value={editing.category} onChange={(e) => setEditField({ category: e.target.value })} className={`${inputCls} cursor-pointer`}>
                    <option value="" disabled>Select a category</option>
                    {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </Field>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <span className="text-sm font-semibold text-[#1a1a1a] block">Pre-Order / Presale Mode</span>
                    <span className="text-xs text-[#616161]">Enable if customers are reserving a future catch/harvest item.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editing.sale_mode === 'preorder'}
                      onChange={(e) => setEditField({ sale_mode: e.target.checked ? 'preorder' : 'regular' })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#014b40]"></div>
                  </label>
                </div>

                {editing.sale_mode === 'preorder' && (
                  <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200 space-y-3 animate-in fade-in duration-200">
                    <Field label="Expected Dispatch Date">
                      <input type="date" value={editing.expected_dispatch_date} onChange={(e) => setEditField({ expected_dispatch_date: e.target.value })} className={inputCls} />
                    </Field>
                    <Field label="Pre-order Notice / Harvesting Details">
                      <input type="text" value={editing.preorder_description} onChange={(e) => setEditField({ preorder_description: e.target.value })} placeholder="e.g. Harvested fresh from Padma River on dispatch morning" className={inputCls} />
                    </Field>
                  </div>
                )}

                <Field label="Description">
                  <textarea rows={3} value={editing.description} onChange={(e) => setEditField({ description: e.target.value })} className={inputCls} />
                </Field>
              </Card>

              {/* variants */}
              <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[#1a1a1a]">Variants ({editing.variants.length})</h3>
                  <button
                    type="button"
                    onClick={addEditVariant}
                    className="min-h-9 py-1.5 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50"
                  >
                    <Plus size={14} /> Add variant
                  </button>
                </div>

                {editing.variants.map((v, i) => (
                  <div key={v.id || i} className="rounded-lg bg-[#f7f7f7] p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-[13px] font-semibold text-[#1a1a1a]">Variant {i + 1}</span>
                      {editing.variants.length > 1 && (
                        <button type="button" onClick={() => removeEditVariant(i)} className="p-1.5 rounded-lg text-[#8a8a8a] hover:text-[#8e0b21] hover:bg-[#fed1d7]/50" aria-label={`Remove variant ${i + 1}`}>
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <Field label="Unit">
                          <input value={v.unit} onChange={(e) => updateEditVariant(i, 'unit', e.target.value)} placeholder="500g / 1 kg" className={inputCls} />
                        </Field>
                      </div>
                      <Field label="Price (₹)">
                        <input inputMode="decimal" value={v.price} onChange={(e) => updateEditVariant(i, 'price', e.target.value)} className={inputCls} />
                      </Field>
                      <Field label="Stock">
                        <input inputMode="numeric" value={v.stock} onChange={(e) => updateEditVariant(i, 'stock', e.target.value)} className={inputCls} />
                      </Field>
                    </div>
                  </div>
                ))}
                {editing.removed.length > 0 && (
                  <p className="text-xs text-[#616161]">{editing.removed.length} variant{editing.removed.length > 1 ? 's' : ''} will be deleted when you press Save.</p>
                )}
              </Card>
            </form>

            <div className="p-4 bg-white border-t border-gray-200 shrink-0 flex gap-2">
              <button type="button" onClick={closeEditor} disabled={isSubmitting} className="min-h-11 sm:min-h-10 px-4 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50 disabled:opacity-50">
                Cancel
              </button>
              <button
                onClick={() => handleUpdateProduct()}
                disabled={isSubmitting}
                className="flex-1 min-h-11 sm:min-h-10 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-sm sm:text-[13px] font-medium text-white disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <><Save size={15} /> Save changes</>}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[120] max-w-[90vw] px-4 py-2.5 rounded-lg text-sm sm:text-[13px] shadow-lg ${
            toast.type === 'error' ? 'bg-[#fed1d7] text-[#8e0b21]' : 'bg-[#303030] text-white'
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}

// ---------- UI primitives ----------

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] ${className}`}>{children}</div>;
}

function Kpi({ label, value, sub, warn, loading }: { label: string; value: string; sub?: string; warn?: boolean; loading: boolean }) {
  return (
    <div className="p-4 sm:p-5">
      <p className="text-sm sm:text-[13px] text-[#616161]">{label}</p>
      {loading ? (
        <div className="h-7 w-20 bg-gray-100 rounded mt-2 animate-pulse" />
      ) : (
        <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
          <span className={`text-[22px] font-semibold leading-none ${warn ? 'text-[#8e0b21]' : 'text-[#1a1a1a]'}`}>{value}</span>
          {sub && <span className="text-xs text-[#616161]">{sub}</span>}
        </div>
      )}
    </div>
  );
}

function Pill({ children, tone }: { children: React.ReactNode; tone: string }) {
  return <span className={`inline-flex items-center px-2 h-5 rounded-full text-[11px] font-medium ${tone}`}>{children}</span>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm sm:text-[13px] font-medium text-[#303030]">{label}</span>
      {children}
    </label>
  );
}

function Switch({ on, onClick, disabled, label }: { on: boolean; onClick: () => void; disabled?: boolean; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
        on ? 'bg-[#014b40]' : 'bg-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-250 ease-in-out ${
          on ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
