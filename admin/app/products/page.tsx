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

const inputCls =
  'w-full min-h-11 sm:min-h-9 py-2 px-3 text-base sm:text-[13px] text-[#1a1a1a] placeholder:text-[#8a8a8a] bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.2)] outline-none focus:shadow-[0_0_0_2px_#005bd3] transition-shadow';

export default function ProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<Tab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
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

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQ = !q || p.name.toLowerCase().includes(q) || String(p.category || '').toLowerCase().includes(q);
      const matchesCat = filterCategory === 'All' || p.category === filterCategory;
      const matchesTab = tab === 'all' ? true : tab === 'active' ? p.isAvailable : tab === 'disabled' ? !p.isAvailable : hasLowStock(p);
      return matchesQ && matchesCat && matchesTab;
    });
  }, [products, searchQuery, filterCategory, tab]);

  useEffect(() => setVisible(PAGE_SIZE), [searchQuery, filterCategory, tab]);

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
      newImageFile: null as File | null,
      newImagePreview: '' as string,
      removed: [] as string[],
      variants: p.variants.map((v) => ({ id: v.id, unit: v.unit || '', price: String(v.price ?? ''), stock: String(v.stock ?? '') })),
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
        removed: isSaved ? [...cur.removed, v.id] : cur.removed, // deleted only when you press Save
      };
    });

  const handleEditImage = async (file: File | undefined) => {
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (!file) return;
    const err = validateProductImage(file);
    if (err) return setEditError(err);
    setEditError('');
    const webp = await compressProductImage(file);
    setEditing((cur) => {
      if (!cur) return cur;
      if (cur?.newImagePreview) URL.revokeObjectURL(cur.newImagePreview);
      return { ...cur, newImageFile: webp, newImagePreview: URL.createObjectURL(webp) };
    });
  };

  const handleUpdateProduct = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!editing) return;
    setEditError('');

    setIsSubmitting(true);
    try {
      await updateCatalogProduct(editing, categories);
      closeEditor();
      flash('success', 'Product saved');
      fetchProducts();
    } catch (error) {
      console.error('Update failed:', error);
      setEditError(error instanceof Error ? error.message : 'Failed to save changes');
    } finally {
      setIsSubmitting(false);
    }
  };

  const priceRange = (p: AdminProduct) => {
    const prices = p.variants.map((v) => Number(v.price) || 0);
    if (!prices.length) return '—';
    const lo = Math.min(...prices), hi = Math.max(...prices);
    return lo === hi ? formatCurrency(lo) : `${formatCurrency(lo)} – ${formatCurrency(hi)}`;
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
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={`${inputCls} sm:w-56 cursor-pointer`}>
              <option value="All">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 border-t border-gray-100 divide-y divide-gray-100">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4"><div className="h-14 bg-gray-100 rounded-lg animate-pulse" /></div>
            ))
          ) : filtered.length === 0 ? (
            <p className="py-14 text-center text-sm sm:text-[13px] text-[#616161]">
              {products.length === 0 ? 'No products yet. Add your first one.' : 'No products match your search or filter.'}
            </p>
          ) : (
            filtered.slice(0, visible).map((p) => {
              const open = expandedId === p.id;
              const dirty = productDirty(p);
              const totalStock = p.variants.reduce((s, v) => s + (Number(v.stock) || 0), 0);
              const allOut = p.variants.length > 0 && totalStock <= 0;
              return (
                <div key={p.id} className={p.isAvailable ? '' : 'bg-[#fafafa]'}>
                  {/* main row */}
                  <div className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                    <div className={`h-14 w-14 rounded-lg bg-[#f7f7f7] shrink-0 overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.06)] flex items-center justify-center ${p.isAvailable ? '' : 'opacity-50 grayscale'}`}>
                      {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-[#8a8a8a]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-semibold truncate ${p.isAvailable ? 'text-[#1a1a1a]' : 'text-[#8a8a8a]'}`}>{p.name}</h3>
                      <div className="flex items-center gap-1.5 flex-wrap mt-1">
                        <Pill tone="bg-[#f1f1f1] text-[#303030]">{p.category || 'General'}</Pill>
                        <Pill tone={p.isAvailable ? 'bg-[#cdfed4] text-[#014b40]' : 'bg-[#e3e3e3] text-[#303030]'}>{p.isAvailable ? 'Active' : 'Disabled'}</Pill>
                        {!p.imageUrl && <Pill tone="bg-[#ffd6a4] text-[#5e4200]">No image</Pill>}
                        {allOut ? <Pill tone="bg-[#fed1d7] text-[#8e0b21]">Out of stock</Pill> : hasLowStock(p) && <Pill tone="bg-[#ffd6a4] text-[#5e4200]">Low stock</Pill>}
                      </div>
                    </div>

                    <Switch on={p.isAvailable} disabled={togglingId === p.id} label={`${p.isAvailable ? 'Disable' : 'Enable'} ${p.name}`} onClick={() => handleToggle(p)} />
                  </div>

                  {/* summary + actions */}
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm sm:text-[13px] text-[#616161]">
                      {p.variants.length} {p.variants.length === 1 ? 'variant' : 'variants'} · {priceRange(p)} · {totalStock} in stock
                    </p>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setExpandedId(open ? null : p.id)}
                        className="min-h-9 py-1.5 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50"
                        aria-expanded={open}
                      >
                        Quick edit <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                        {dirty && <span className="w-2 h-2 rounded-full bg-[#005bd3]" />}
                      </button>
                      <button
                        onClick={() => openEditor(p)}
                        className="min-h-9 py-1.5 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50"
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p)}
                        className="p-2 rounded-lg text-[#8a8a8a] hover:text-[#8e0b21] hover:bg-[#fed1d7]/50 transition-colors"
                        aria-label={`Delete ${p.name}`}
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* quick edit panel */}
                  {open && (
                    <div className="mx-3 sm:mx-4 mb-3 sm:mb-4 rounded-lg bg-[#f7f7f7] p-3 space-y-3">
                      <div className="hidden sm:grid grid-cols-[1fr_140px_120px] gap-3 px-1 text-xs font-medium text-[#616161]">
                        <span>Variant</span><span>Price (₹)</span><span>Stock</span>
                      </div>
                      {p.variants.map((v) => {
                        const d = draftOf(v);
                        return (
                          <div key={v.id} className="grid grid-cols-2 sm:grid-cols-[1fr_140px_120px] gap-x-3 gap-y-1.5 items-center">
                            <span className="col-span-2 sm:col-span-1 text-sm sm:text-[13px] font-semibold text-[#1a1a1a] px-1">{v.unit}</span>
                            <label className="block">
                              <span className="sm:hidden text-xs text-[#616161]">Price (₹)</span>
                              <input
                                inputMode="decimal"
                                value={d.price}
                                onChange={(e) => setDraft(v, 'price', e.target.value)}
                                className={inputCls}
                                aria-label={`${v.unit} price`}
                              />
                            </label>
                            <label className="block">
                              <span className="sm:hidden text-xs text-[#616161]">Stock</span>
                              <input
                                inputMode="numeric"
                                value={d.stock}
                                onChange={(e) => setDraft(v, 'stock', e.target.value)}
                                className={`${inputCls} ${Number(d.stock) < LOW_STOCK_THRESHOLD ? '!shadow-[0_0_0_1px_#e22c38]' : ''}`}
                                aria-label={`${v.unit} stock`}
                              />
                            </label>
                          </div>
                        );
                      })}
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => discardQuick(p)}
                          disabled={!dirty || savingId === p.id}
                          className="min-h-9 py-1.5 px-3 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50 disabled:opacity-40"
                        >
                          Discard
                        </button>
                        <button
                          onClick={() => saveQuick(p)}
                          disabled={!dirty || savingId === p.id}
                          className="min-h-9 py-1.5 px-4 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-sm sm:text-[13px] font-medium text-white disabled:opacity-40 inline-flex items-center gap-1.5"
                        >
                          {savingId === p.id ? <Loader2 size={14} className="animate-spin" /> : 'Save'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
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
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`relative w-10 h-6 rounded-full shrink-0 transition-colors disabled:opacity-60 ${on ? 'bg-[#303030]' : 'bg-[#c9c9c9]'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-4' : ''}`} />
    </button>
  );
}