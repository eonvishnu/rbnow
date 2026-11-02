"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Plus,
  Calendar,
  PackageCheck,
  DollarSign,
  Layers,
  CheckCircle2,
  Clock,
  XCircle,
  X,
  Save,
  Loader2
} from 'lucide-react';
import {
  createPreorder,
  fulfillPreorder,
  listPreorderWorkspace,
} from '@/features/preorders/services/preorders.service';
import type { PreorderCampaign, PreorderProduct } from '@/features/preorders/types/preorder';

export default function AdminPreOrdersPage() {
  const [campaigns, setCampaigns] = useState<PreorderCampaign[]>([]);
  const [products, setProducts] = useState<PreorderProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    productId: '',
    variantId: '',
    price: 499,
    maxQuantity: 100,
    expectedDate: '',
  });

  const fetchCampaignsAndProducts = async () => {
    try {
      const workspace = await listPreorderWorkspace();
      setCampaigns(workspace.campaigns);
      setProducts(workspace.products);
      const firstProduct = workspace.products[0];
      const firstVariant = firstProduct?.product_variants?.[0];
      if (firstProduct && firstVariant) {
          setForm(prev => ({
            ...prev,
            productId: firstProduct.id,
            variantId: firstVariant.id,
            price: firstVariant.price,
          }));
      }
    } catch (error) {
      console.error('Error fetching pre-order campaigns:', error);
      alert('Could not load pre-order campaigns.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignsAndProducts();
  }, []);

  const selectedProductVariants = useMemo(() => {
    const prod = products.find((p) => p.id === form.productId);
    return prod?.product_variants || [];
  }, [products, form.productId]);

  const handleProductChange = (prodId: string) => {
    const prod = products.find((p) => p.id === prodId);
    const firstVar = prod?.product_variants?.[0];
    setForm(prev => ({
      ...prev,
      productId: prodId,
      variantId: firstVar?.id || '',
      price: firstVar ? Number(firstVar.price) : 499,
    }));
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createPreorder(form);
      alert('Pre-Order Campaign Created Successfully!');
      setIsCreating(false);
      await fetchCampaignsAndProducts();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to create pre-order campaign.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFulfillCampaign = async (campaignId: string, variantId: string, reservedQty: number) => {
    if (confirm('Stock arrived? Mark campaign as fulfilled and transfer reserved items to active stock?')) {
      try {
        await fulfillPreorder(campaignId, variantId, reservedQty);
        await fetchCampaignsAndProducts();
      } catch (error) {
        console.error('Fulfillment error:', error);
        alert('Could not fulfill the campaign and update stock.');
      }
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-2">
             <h1 className="text-xl font-semibold text-[#1a1a1a]">Pre-Order Campaigns</h1>
             <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-300">
               ✨ Harvest & Reserve
             </span>
           </div>
           <p className="text-sm text-gray-500 mt-1">Manage early reservation campaigns and stock arrival dates.</p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-[#303030] hover:bg-[#1a1a1a] text-white font-medium px-5 py-2.5 rounded-lg shadow-sm tracking-wide text-xs transition-all"
        >
          <Plus size={16} /> New Pre-Order Campaign
        </button>
      </div>

      {/* Campaign Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 p-12 text-center text-gray-400 font-medium ">
            Loading Campaigns...
          </div>
        ) : campaigns.length === 0 ? (
          <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-12 text-center space-y-3">
             <div className="w-16 h-16 bg-amber-50 rounded-xl flex items-center justify-center mx-auto text-amber-600">
               <Sparkles size={32} />
             </div>
             <h3 className="text-lg font-semibold text-gray-900 ">No Pre-Order Campaigns</h3>
             <p className="text-xs text-gray-500 max-w-sm mx-auto">Create a campaign for limited seasonal catches or early-harvest rice & sweets.</p>
             <button onClick={() => setIsCreating(true)} className="bg-[#303030] text-white px-6 py-3 rounded-lg font-medium text-xs ">
               Create First Campaign
             </button>
          </div>
        ) : (
          campaigns.map((c) => {
            const variant = c.product_variants;
            const product = variant?.products;
            const isFulfilled = c.status === 'fulfilled';
            const isActive = c.status === 'active';

            return (
              <div key={c.id} className={`bg-white border rounded-xl p-6 shadow-sm relative overflow-hidden transition-all ${isActive ? 'border-amber-300 ring-2 ring-amber-400/20' : 'border-gray-200'}`}>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      isActive ? 'bg-amber-100 text-amber-900 border-amber-300' :
                      isFulfilled ? 'bg-emerald-50 text-emerald-900 border-emerald-200' :
                      'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                      <span className="capitalize">{String(c.status).replace(/_/g, ' ')}</span>
                    </span>
                    <h3 className="text-base font-semibold text-gray-900 mt-2">{c.name}</h3>
                    <p className="text-xs font-medium text-emerald-900 mt-0.5">
                      {product?.name || 'Product'} ({variant?.unit || 'Unit'})
                    </p>
                  </div>

                  <span className="text-xl font-semibold text-[#1a1a1a]">₹{c.price}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs mb-4">
                  <div>
                    <span className="text-xs font-medium text-gray-400 block">Expected Delivery</span>
                    <span className="font-semibold text-[#1a1a1a] flex items-center gap-1 mt-0.5">
                      <Calendar size={12} className="text-[#616161]" />
                      {new Date(c.expected_available_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-400 block">Reservations</span>
                    <span className="font-semibold text-gray-900 mt-0.5 block">
                      {c.reserved_quantity} / {c.max_quantity} Reserved
                    </span>
                  </div>
                </div>

                {isActive && (
                  <button
                    onClick={() => handleFulfillCampaign(c.id, c.product_variant_id, c.reserved_quantity)}
                    className="w-full bg-[#303030] hover:bg-[#1a1a1a] text-white font-medium py-3 rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <PackageCheck size={16} /> Mark Stock Arrived & Fulfill
                  </button>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* CREATE CAMPAIGN MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCreating(false)} />

          <div className="relative w-full max-w-lg bg-white rounded-xl border border-amber-200 shadow-sm p-6 space-y-5 z-10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h2 className="text-base font-semibold text-[#1a1a1a] tracking-tight">Create Pre-Order Campaign</h2>
              <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-gray-500 block mb-1">Campaign Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Diwali Ilish Early Harvest Reserve"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 font-medium text-gray-900 outline-none focus:border-[#005bd3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-gray-500 block mb-1">Select Product</label>
                  <select
                    value={form.productId}
                    onChange={e => handleProductChange(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 font-medium text-gray-900 outline-none"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-medium text-gray-500 block mb-1">Select Variant</label>
                  <select
                    value={form.variantId}
                    onChange={e => {
                      const v = selectedProductVariants.find((variant) => variant.id === e.target.value);
                      setForm({ ...form, variantId: e.target.value, price: v ? Number(v.price) : form.price });
                    }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 font-medium text-gray-900 outline-none"
                  >
                    {selectedProductVariants.map((v) => (
                      <option key={v.id} value={v.id}>{v.unit} (Current Price: ₹{v.price})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-gray-500 block mb-1">Pre-Order Price (₹)</label>
                  <input
                    required
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 font-medium text-gray-900 outline-none"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-500 block mb-1">Pre-Order Cap (Units)</label>
                  <input
                    required
                    type="number"
                    value={form.maxQuantity}
                    onChange={e => setForm({ ...form, maxQuantity: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 font-medium text-gray-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-gray-500 block mb-1">Expected Availability Date</label>
                <input
                  required
                  type="date"
                  value={form.expectedDate}
                  onChange={e => setForm({ ...form, expectedDate: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 font-medium text-gray-900 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#303030] hover:bg-[#1a1a1a] text-white font-medium py-4 rounded-xl text-xs shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Launch Pre-Order Campaign</>}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
