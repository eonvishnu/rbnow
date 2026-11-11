"use client";

import React, { useState, useEffect } from 'react';
import { Trash2, Tag, Calendar, Plus, Loader2, ToggleLeft, ToggleRight, CheckCircle2, AlertCircle, Percent, DollarSign } from 'lucide-react';
import {
  createDiscountForVariant,
  createPromoCoupon,
  deletePromoCoupon,
  deleteVariantDiscount,
  listPromotionWorkspace,
  togglePromoCoupon,
} from '@/features/promotions/services/promotions.service';
import type {
  AdminCoupon,
  DiscountProduct,
  VariantDiscount,
} from '@/features/promotions/types/promotion';

export default function AdminCouponsPage() {
  const [activeTab, setActiveTab] = useState<'coupons' | 'discounts'>('coupons');

  // Promo Coupons State
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Variant Discounts State
  const [discounts, setDiscounts] = useState<VariantDiscount[]>([]);
  const [products, setProducts] = useState<DiscountProduct[]>([]);
  const [discountForm, setDiscountForm] = useState({
    name: '',
    type: 'percentage' as 'percentage' | 'fixed_amount',
    value: 15,
    selectedVariantId: '',
  });

  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'fixed' | 'percentage',
    value: '',
    minOrderValue: '',
    maxDiscount: '',
    isFirstOrderOnly: false,
    expiryDate: ''
  });

  const fetchCouponsAndDiscounts = async () => {
    try {
      const workspace = await listPromotionWorkspace();
      setCoupons(workspace.coupons);
      setDiscounts(workspace.discounts);
      setProducts(workspace.products);
      const firstVariant = workspace.products[0]?.product_variants?.[0];
      if (firstVariant) {
          setDiscountForm(prev => ({
            ...prev,
            selectedVariantId: firstVariant.id,
          }));
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCouponsAndDiscounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createPromoCoupon(formData);
      alert("Coupon Created Successfully!");
      setFormData({ code: '', type: 'percentage', value: '', minOrderValue: '', maxDiscount: '', isFirstOrderOnly: false, expiryDate: '' });
      fetchCouponsAndDiscounts();
    } catch (error) {
      alert("Error creating coupon: " + (error instanceof Error ? error.message : 'Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateVariantDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createDiscountForVariant(discountForm);
      alert('Variant Discount Created Successfully!');
      setDiscountForm(prev => ({ ...prev, name: '' }));
      fetchCouponsAndDiscounts();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to save variant discount.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await togglePromoCoupon(id, currentStatus);
      fetchCouponsAndDiscounts();
    } catch (error) {
      console.error(error);
      alert('Failed to update coupon status.');
    }
  };

  const deleteCoupon = async (id: string) => {
    if(!window.confirm("Delete this coupon permanently?")) return;
    try {
      await deletePromoCoupon(id);
      setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error(error);
      alert('Failed to delete coupon.');
    }
  };

  const deleteDiscount = async (id: string) => {
    if(!window.confirm("Delete this variant discount?")) return;
    try {
      await deleteVariantDiscount(id);
      fetchCouponsAndDiscounts();
    } catch (error) {
      console.error(error);
      alert('Failed to delete variant discount.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">Promotions & Discounts</h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">Manage promo codes and variant-specific price sales</p>
          </div>

          <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm self-start">
            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'coupons' ? 'bg-[#303030] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Promo Codes
            </button>
            <button
              onClick={() => setActiveTab('discounts')}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'discounts' ? 'bg-[#303030] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Variant Discounts
            </button>
          </div>
        </div>

        {activeTab === 'coupons' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-8">
                <h2 className="text-sm font-semibold text-[#1a1a1a] mb-6 flex items-center gap-2">
                  <Plus size={18} className="text-[#616161]" /> Create Promo Code
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Coupon Code</label>
                    <input 
                      type="text"
                      value={formData.code}
                      onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      placeholder="e.g. WELCOME50"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-semibold outline-none focus:border-[#005bd3]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Type</label>
                      <select
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value === 'fixed' ? 'fixed' : 'percentage'})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-medium outline-none"
                      >
                        <option value="percentage">Percent (%)</option>
                        <option value="fixed">Flat (₹)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Value</label>
                      <input
                        type="number"
                        value={formData.value}
                        onChange={e => setFormData({...formData, value: e.target.value})}
                        placeholder={formData.type === 'percentage' ? "10" : "100"}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-semibold outline-none focus:border-[#005bd3]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Min Order Value (₹)</label>
                      <input
                        type="number"
                        value={formData.minOrderValue}
                        onChange={e => setFormData({...formData, minOrderValue: e.target.value})}
                        placeholder="e.g. 299"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-semibold outline-none focus:border-[#005bd3]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Max Discount Cap (₹)</label>
                      <input
                        type="number"
                        value={formData.maxDiscount}
                        onChange={e => setFormData({...formData, maxDiscount: e.target.value})}
                        placeholder="e.g. 150 (Optional)"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-semibold outline-none focus:border-[#005bd3]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="isFirstOrderOnly"
                      checked={formData.isFirstOrderOnly}
                      onChange={e => setFormData({ ...formData, isFirstOrderOnly: e.target.checked })}
                      className="w-4 h-4 rounded text-[#004d3b] focus:ring-[#004d3b] border-gray-300 cursor-pointer"
                    />
                    <label htmlFor="isFirstOrderOnly" className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
                      First Order Only (Valid on 1st purchase)
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#303030] text-white font-semibold py-4 rounded-xl text-xs hover:bg-[#1a1a1a] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : "Save Promo Code"}
                  </button>
                </form>
              </div>
            </section>

            <section className="lg:col-span-2 space-y-4">
              {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="animate-spin text-gray-300" size={32} /></div>
              ) : coupons.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-200">
                  <Tag className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-400 font-medium text-xs">No active promo codes</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coupons.map((coupon) => (
                    <div key={coupon.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-xs bg-emerald-50 text-emerald-900 px-3 py-1 rounded-lg border border-amber-200">{coupon.code}</span>
                        <button onClick={() => deleteCoupon(coupon.id)} className="text-gray-300 hover:text-rose-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="text-2xl font-semibold text-gray-900">
                        {coupon.type === 'fixed' ? `₹${coupon.value}` : `${coupon.value}%`} <span className="text-xs text-gray-400 font-medium ">OFF</span>
                      </div>
                      <div className="text-xs text-gray-500 font-medium space-y-0.5 pt-1 border-t border-gray-100">
                        {coupon.minOrderValue > 0 && <p>Min Order Value: <strong className="text-gray-800">₹{coupon.minOrderValue}</strong></p>}
                        {coupon.maxDiscount && <p>Max Discount Cap: <strong className="text-gray-800">₹{coupon.maxDiscount}</strong></p>}
                        {coupon.isFirstOrderOnly && <p className="text-[#006b50] font-bold flex items-center gap-1">👑 First Order Only</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-8">
                <h2 className="text-sm font-semibold text-[#1a1a1a] mb-6 flex items-center gap-2">
                  <Plus size={18} className="text-[#616161]" /> Create Variant Discount
                </h2>

                <form onSubmit={handleCreateVariantDiscount} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Offer Title</label>
                    <input 
                      type="text"
                      value={discountForm.name}
                      onChange={e => setDiscountForm({ ...discountForm, name: e.target.value })}
                      placeholder="e.g. 1kg Rice Festive 15% OFF"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 font-medium text-gray-900 outline-none focus:border-[#005bd3]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Target Product Variant</label>
                    <select
                      value={discountForm.selectedVariantId}
                      onChange={e => setDiscountForm({ ...discountForm, selectedVariantId: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 font-medium text-gray-900 outline-none"
                    >
                      {products.map(p => (
                        (p.product_variants || []).map((v) => (
                          <option key={v.id} value={v.id}>
                            {p.name} ({v.unit}) — Regular ₹{v.price}
                          </option>
                        ))
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Discount Type</label>
                      <select
                        value={discountForm.type}
                        onChange={e => setDiscountForm({ ...discountForm, type: e.target.value === 'fixed_amount' ? 'fixed_amount' : 'percentage' })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 font-medium outline-none"
                      >
                        <option value="percentage">Percent (%)</option>
                        <option value="fixed_amount">Flat (₹)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Discount Value</label>
                      <input
                        type="number"
                        value={discountForm.value}
                        onChange={e => setDiscountForm({ ...discountForm, value: Number(e.target.value) })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 font-semibold text-gray-900 outline-none focus:border-[#005bd3]"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#303030] text-white font-semibold py-4 rounded-xl text-xs hover:bg-[#1a1a1a] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : "Save Variant Discount"}
                  </button>
                </form>
              </div>
            </section>

            <section className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {discounts.map((disc) => (
                  <div key={disc.id} className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm relative space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-gray-900">{disc.name}</span>
                      <button onClick={() => deleteDiscount(disc.id)} className="text-gray-300 hover:text-rose-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-2xl font-semibold text-[#1a1a1a]">
                      {disc.discount_type === 'percentage' ? `${disc.discount_value}% OFF` : `₹${disc.discount_value} OFF`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

      </div>
    </main>
  );
}
