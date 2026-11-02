"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  User,
  Phone,
  MapPin,
  ShoppingBag,
  MessageSquare,
  PhoneCall,
  Store,
  ArrowLeft,
  Save,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { createAssistedOrder, listManualOrderProducts } from '@/features/orders/services/manual-orders.service';
import type {
  ManualOrderCustomer,
  ManualOrderItem,
  ManualOrderProduct,
} from '@/features/orders/types/order';

export default function CreateManualOrderPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<ManualOrderProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [customer, setCustomer] = useState<ManualOrderCustomer>({
    name: '',
    phone: '',
    houseNo: '',
    area: '',
    city: 'Hyderabad',
    pincode: '500081',
    source: 'whatsapp' as 'whatsapp' | 'phone' | 'walk_in' | 'admin',
    paymentMethod: 'cod' as 'cod' | 'upi' | 'paid',
  });

  const [selectedItems, setSelectedItems] = useState<ManualOrderItem[]>([]);
  const [deliveryFee, setDeliveryFee] = useState(40);
  const [manualDiscount, setManualDiscount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProducts(await listManualOrderProducts());
      } catch (err) {
        console.error('Error fetching products for manual order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddItem = (
    variant: NonNullable<ManualOrderProduct['product_variants']>[number],
    product: ManualOrderProduct,
  ) => {
    const existingIdx = selectedItems.findIndex(i => i.variantId === variant.id);
    if (existingIdx > -1) {
      const updated = [...selectedItems];
      updated[existingIdx].qty += 1;
      setSelectedItems(updated);
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          variantId: variant.id,
          productId: product.id,
          name: product.name,
          unit: variant.unit,
          price: Number(variant.price),
          qty: 1,
          img: product.image_url || 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80',
        }
      ]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleQtyChange = (index: number, delta: number) => {
    const updated = [...selectedItems];
    const newQty = updated[index].qty + delta;
    if (newQty <= 0) {
      handleRemoveItem(index);
    } else {
      updated[index].qty = newQty;
      setSelectedItems(updated);
    }
  };

  const handlePriceOverride = (index: number, newPrice: number) => {
    const updated = [...selectedItems];
    updated[index].price = Math.max(0, newPrice);
    setSelectedItems(updated);
  };

  const totals = useMemo(() => {
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const total = Math.max(0, subtotal - manualDiscount + deliveryFee);
    return { subtotal, total };
  }, [selectedItems, manualDiscount, deliveryFee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createAssistedOrder({
        customer,
        items: selectedItems,
        createdBy: user?.id,
        deliveryFee,
        manualDiscount,
      });

      alert('Manual Order Created Successfully!');
      router.push('/orders');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to create manual order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-[#1a1a1a]">Create Assisted / Manual Order</h1>
            <p className="text-xs text-gray-500 font-medium">For WhatsApp, Phone Call & Walk-in customers</p>
          </div>
        </div>

        <button
          form="manual-order-form"
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 bg-[#303030] hover:bg-[#1a1a1a] text-white font-semibold px-6 py-3 rounded-xl shadow-sm text-xs transition-all disabled:opacity-50"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle2 size={16} /> Create Order</>}
        </button>
      </div>

      <form id="manual-order-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Customer & Items */}
        <div className="lg:col-span-7 space-y-6">

          {/* Order Channel & Customer Info */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-xs font-semibold text-[#1a1a1a] flex items-center gap-2 border-b border-gray-100 pb-3">
              <User size={16} className="text-[#616161]" /> Customer & Channel Details
            </h2>

            {/* Channel Selection */}
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-2">Order Source / Channel</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                  { id: 'phone', label: 'Phone Call', icon: PhoneCall },
                  { id: 'walk_in', label: 'Walk-in', icon: Store },
                  { id: 'admin', label: 'Admin Direct', icon: User },
                ].map((ch) => {
                  const Icon = ch.icon;
                  const isSelected = customer.source === ch.id;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setCustomer({ ...customer, source: ch.id as ManualOrderCustomer['source'] })}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        isSelected
                          ? 'bg-[#303030] text-white border-[#303030] font-medium shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-xs font-semibold ">{ch.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Customer Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Rahul Kumar"
                  value={customer.name}
                  onChange={e => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-medium outline-none focus:border-[#005bd3]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Phone Number</label>
                <input
                  required
                  type="tel"
                  maxLength={10}
                  placeholder="10-digit mobile"
                  value={customer.phone}
                  onChange={e => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, '') })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-medium outline-none focus:border-[#005bd3]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Flat / Building Name</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 402, Sunshine Heights"
                  value={customer.houseNo}
                  onChange={e => setCustomer({ ...customer, houseNo: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-medium outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Street / Area</label>
                <input
                  type="text"
                  placeholder="e.g. Madhapur"
                  value={customer.area}
                  onChange={e => setCustomer({ ...customer, area: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-medium outline-none"
                />
              </div>
            </div>
          </div>

          {/* Product Variant Picker */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-xs font-semibold text-[#1a1a1a] flex items-center gap-2 border-b border-gray-100 pb-3">
              <ShoppingBag size={16} className="text-[#616161]" /> Select Product Variants
            </h2>

            <div className="max-h-80 overflow-y-auto no-scrollbar space-y-3">
              {loading ? (
                <div className="text-center py-8 text-gray-400 font-medium text-xs">Loading Catalog...</div>
              ) : products.map((prod) => (
                <div key={prod.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                  <span className="font-semibold text-xs text-gray-900">{prod.name}</span>
                  <div className="flex flex-wrap gap-2">
                    {(prod.product_variants || []).map((variant) => (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => handleAddItem(variant, prod)}
                        className="bg-white hover:bg-emerald-800 hover:text-white text-gray-800 border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shadow-2xs"
                      >
                        <Plus size={12} /> {variant.unit} — ₹{variant.price}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Item List */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm space-y-6 sticky top-6">
            <h2 className="text-xs font-semibold text-[#1a1a1a] border-b border-gray-100 pb-3">
              Order Basket ({selectedItems.length} items)
            </h2>

            <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
              {selectedItems.length === 0 ? (
                <p className="text-center py-8 text-gray-400 font-medium text-xs">No items added to basket yet.</p>
              ) : selectedItems.map((item, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-amber-600 font-medium ">{item.unit}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Override Unit Price */}
                    <div className="w-16">
                      <input
                        type="number"
                        value={item.price}
                        onChange={e => handlePriceOverride(i, Number(e.target.value))}
                        className="w-full bg-white border border-gray-300 rounded-lg p-1 text-center text-xs font-semibold"
                      />
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center bg-[#303030] text-white rounded-lg h-7 px-1">
                      <button type="button" onClick={() => handleQtyChange(i, -1)} className="px-2 font-semibold text-sm">−</button>
                      <span className="w-4 text-center font-semibold text-xs text-white">{item.qty}</span>
                      <button type="button" onClick={() => handleQtyChange(i, 1)} className="px-2 font-semibold text-sm">+</button>
                    </div>

                    <button type="button" onClick={() => handleRemoveItem(i)} className="text-rose-600 p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations & Discounts */}
            <div className="space-y-3 pt-3 border-t border-gray-100 text-xs">
              <div className="flex justify-between font-medium text-gray-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900">₹{totals.subtotal}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Manual Adjustment / Disc ₹</span>
                <input
                  type="number"
                  value={manualDiscount}
                  onChange={e => setManualDiscount(Number(e.target.value))}
                  className="w-20 bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-right font-semibold text-xs"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Delivery Fee ₹</span>
                <input
                  type="number"
                  value={deliveryFee}
                  onChange={e => setDeliveryFee(Number(e.target.value))}
                  className="w-20 bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-right font-semibold text-xs"
                />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-sm font-semibold text-[#1a1a1a]">Payable Total</span>
                <span className="text-xl font-semibold text-[#1a1a1a]">₹{totals.total}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-gray-400 block">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cod', label: 'COD' },
                  { id: 'upi', label: 'UPI' },
                  { id: 'paid', label: 'Already Paid' },
                ].map(pm => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setCustomer({ ...customer, paymentMethod: pm.id as ManualOrderCustomer['paymentMethod'] })}
                    className={`py-2 rounded-lg text-xs font-semibold border ${
                      customer.paymentMethod === pm.id
                        ? 'bg-[#303030] text-white border-[#303030] shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
}
