'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Sparkles, Plus, Trash2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function UpsellManagerPage() {
  const [upsells, setUpsells] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [title, setTitle] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ success: boolean; text: string } | null>(null);

  const fetchData = async () => {
    try {
      const [upsellsRes, prodsRes] = await Promise.all([
        supabase.from('cart_upsells').select('id, title, display_order, is_active, products(name, image_url), product_variants(id, unit, price)').order('display_order'),
        supabase.from('products').select('id, name, product_variants(id, unit, price)').order('name'),
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
      setMsg({ success: false, text: 'Please select a product variant.' });
      return;
    }

    setLoading(true);
    setMsg(null);

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

      setMsg({ success: true, text: 'Cart upsell added successfully!' });
      setTitle('');
      setSelectedVariantId('');
      fetchData();
    } catch (err: any) {
      console.error(err);
      setMsg({ success: false, text: err.message || 'Failed to add cart upsell.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this cart upsell?')) {
      try {
        await supabase.from('cart_upsells').delete().eq('id', id);
        fetchData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50/50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase px-3 py-1 rounded-full mb-2">
            <Sparkles size={13} /> CART CONVERSION & UPSELLS
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Cart Upsell Recommendations</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">Configure frequently bought together items and add-ons displayed in the customer cart.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-6 flex items-center gap-2">
              <Plus size={16} className="text-emerald-600" /> Add Upsell Item
            </h2>

            <form onSubmit={handleAddUpsell} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-600">Select Product Variant</label>
                <select
                  required
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-900 outline-none focus:border-emerald-600 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="">-- Choose Product & Variant --</option>
                  {products.map((p) =>
                    (p.product_variants || []).map((v: any) => (
                      <option key={v.id} value={v.id}>
                        {p.name} ({v.unit}) - ₹{v.price}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-600">Custom Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Frequently Bought Together"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-900 outline-none focus:border-emerald-600 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-600">Display Order</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-900 outline-none focus:border-emerald-600 focus:bg-white transition-all"
                />
              </div>

              {msg && (
                <div className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${msg.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                  {msg.success ? <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> : <AlertCircle size={16} className="text-rose-600 shrink-0" />}
                  <span>{msg.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                <span>Save Upsell Item</span>
              </button>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-900">Active Cart Recommendations ({upsells.length})</h2>
            </div>

            {upsells.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-xs font-bold uppercase tracking-wider">
                No active cart upsells configured yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {upsells.map((u) => {
                  const prod = u.products;
                  const variant = u.product_variants;
                  return (
                    <div key={u.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={prod?.image_url || 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=300&q=80'}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                          alt={prod?.name || 'Product'}
                        />
                        <div>
                          <p className="text-sm font-black text-gray-900">{prod?.name || 'Product'}</p>
                          <p className="text-xs text-emerald-700 font-bold">
                            {variant?.unit || 'pack'} · ₹{variant?.price || 0}
                          </p>
                          {u.title && <span className="inline-block mt-1 bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-md">{u.title}</span>}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(u.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                        title="Remove Upsell"
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
