'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Loader2 } from 'lucide-react';

export default function UpsellManagerPage() {
  const [upsells, setUpsells] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [title, setTitle] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const flash = (type: 'error' | 'success', text: string) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3500);
  };

  const fetchData = async () => {
    try {
      const [upsellsRes, prodsRes] = await Promise.all([
        supabase.from('cart_upsells').select('id, title, display_order, is_active, products(name, image_url), product_variants(id, unit, price)').order('display_order'),
        supabase.from('products').select('id, name, product_variants(id, unit, price)').eq('is_available', true).order('name'),
      ]);

      if (upsellsRes.data) setUpsells(upsellsRes.data);
      if (prodsRes.data) setProducts(prodsRes.data);
      if (upsellsRes.data) setDisplayOrder(upsellsRes.data.length + 1);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddUpsell = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariantId) {
      flash('error', 'Please select a product variant.');
      return;
    }

    setLoading(true);

    try {
      let foundProductId = null;
      for (const p of products) {
        const match = (p.product_variants || []).find((v: any) => v.id === selectedVariantId);
        if (match) {
          foundProductId = p.id;
          break;
        }
      }

      const { error } = await supabase.from('cart_upsells').insert({
        product_id: foundProductId,
        variant_id: selectedVariantId,
        title: title.trim() || null,
        display_order: Number(displayOrder),
        is_active: true,
      });

      if (error) throw error;

      flash('success', 'Cart upsell added successfully.');
      setTitle('');
      setSelectedVariantId('');
      fetchData();
    } catch (err: any) {
      console.error(err);
      flash('error', err.message || 'Failed to add cart upsell.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Remove this cart upsell?')) {
      try {
        await supabase.from('cart_upsells').delete().eq('id', id);
        flash('success', 'Cart upsell removed.');
        fetchData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-6 text-xs font-sans text-[#303030]">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-[#1a1a1a]">Cart Upsells</h1>
        <p className="text-[13px] text-[#616161] mt-0.5">Manage frequently bought together items and add-ons displayed in the customer cart.</p>
      </div>

      {/* TOAST */}
      {notice && (
        <div
          role="status"
          className={`rounded-lg px-3 py-2 text-[13px] font-medium ${
            notice.type === 'error' ? 'bg-[#fed1d7] text-[#8e0b21]' : 'bg-[#cdfed4] text-[#014b40]'
          }`}
        >
          {notice.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-4">
            <h2 className="text-sm font-semibold text-[#1a1a1a]">Add upsell item</h2>

            <form onSubmit={handleAddUpsell} className="space-y-4">
              <div className="space-y-1">
                <label className="font-medium text-[#616161] block">Product &amp; variant</label>
                <select
                  required
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none cursor-pointer"
                >
                  <option value="">Select product variant</option>
                  {products.map((p) =>
                    (p.product_variants || []).map((v: any) => (
                      <option key={v.id} value={v.id}>
                        {p.name} ({v.unit}) - ₹{v.price}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#616161] block">Custom title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Frequently Bought Together"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#616161] block">Display order</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#303030] hover:bg-[#1a1a1a] text-white h-9 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={15} />}
                <span>Add upsell</span>
              </button>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#1a1a1a]">Active recommendations ({upsells.length})</h2>
            </div>

            {upsells.length === 0 ? (
              <div className="py-14 text-center text-[#616161]">
                No cart upsells configured yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {upsells.map((u) => {
                  const prod = u.products;
                  const variant = u.product_variants;
                  return (
                    <div key={u.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#fafafa] transition-colors">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod?.image_url || 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=300&q=80'}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                          alt={prod?.name || 'Product'}
                        />
                        <div>
                          <p className="font-semibold text-[#1a1a1a] text-[13px]">{prod?.name || 'Product'}</p>
                          <p className="text-xs text-[#616161]">
                            {variant?.unit || 'pack'} · ₹{variant?.price || 0}
                          </p>
                          {u.title && <span className="inline-block mt-1 bg-gray-100 text-[#303030] text-[11px] font-medium px-2 py-0.5 rounded">{u.title}</span>}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(u.id)}
                        className="p-2 text-[#8a8a8a] hover:text-[#8e0b21] hover:bg-[#fed1d7]/50 rounded-lg transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
