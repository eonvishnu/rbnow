"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  Plus,
  Truck,
  IndianRupee,
  FileText,
  Users,
  User,
  CheckCircle2,
  Clock,
  X,
  Save,
  Loader2,
  Building,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  createProcurementOrder,
  createProcurementSupplier,
  listProcurementWorkspace,
  markPurchaseOrderReceived,
} from '@/features/procurement/services/procurement.service';
import type {
  AdminPurchaseOrder,
  AdminSupplier,
  ProcurementProduct,
  PurchaseOrderDraftItem,
} from '@/features/procurement/types/procurement';

export default function AdminProcurementPage() {
  const [activeTab, setActiveTab] = useState<'pos' | 'suppliers' | 'margins'>('pos');
  const [suppliers, setSuppliers] = useState<AdminSupplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<AdminPurchaseOrder[]>([]);
  const [products, setProducts] = useState<ProcurementProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showPOCreator, setShowPOCreator] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // PO Form State
  const [poForm, setPoForm] = useState({
    supplierId: '',
    invoiceNumber: '',
    notes: '',
    items: [] as PurchaseOrderDraftItem[],
  });

  // Supplier Form State
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    city: 'Kolkata',
  });

  const fetchProcurementData = async () => {
    try {
      const workspace = await listProcurementWorkspace();
      setSuppliers(workspace.suppliers);
      setPurchaseOrders(workspace.purchaseOrders);
      setProducts(workspace.products);
      if (workspace.suppliers.length > 0 && !poForm.supplierId) {
        setPoForm(prev => ({ ...prev, supplierId: workspace.suppliers[0].id }));
      }
    } catch (err) {
      console.error('Error fetching procurement data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcurementData();
  }, []);

  const stats = useMemo(() => {
    const totalSpend = purchaseOrders.reduce((sum, po) => sum + Number(po.total_cost || 0), 0);
    const pendingPOs = purchaseOrders.filter(po => po.status !== 'received' && po.status !== 'cancelled').length;
    const activeSuppliers = suppliers.length;

    return { totalSpend, pendingPOs, activeSuppliers };
  }, [purchaseOrders, suppliers]);

  const handleAddPOItem = (
    variant: NonNullable<ProcurementProduct['product_variants']>[number],
    product: ProcurementProduct,
  ) => {
    const existingIdx = poForm.items.findIndex(i => i.variantId === variant.id);
    if (existingIdx > -1) {
      const updated = [...poForm.items];
      updated[existingIdx].qty += 10;
      setPoForm({ ...poForm, items: updated });
    } else {
      setPoForm({
        ...poForm,
        items: [
          ...poForm.items,
          {
            variantId: variant.id,
            productName: `${product.name} (${variant.unit})`,
            unit: variant.unit,
            qty: 10,
            costPrice: Math.round(Number(variant.price) * 0.65), // Default 35% margin cost estimation
          }
        ]
      });
    }
  };

  const handleRemovePOItem = (index: number) => {
    setPoForm({
      ...poForm,
      items: poForm.items.filter((_, i) => i !== index),
    });
  };

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      await createProcurementSupplier(supplierForm);
      alert('Supplier Added Successfully!');
      setShowSupplierModal(false);
      setSupplierForm({ name: '', contactPerson: '', phone: '', email: '', city: 'Kolkata' });
      fetchProcurementData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save supplier');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreatePO = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      await createProcurementOrder(poForm);
      alert('Purchase Order Created Successfully!');
      setShowPOCreator(false);
      setPoForm({ supplierId: suppliers[0]?.id || '', invoiceNumber: '', notes: '', items: [] });
      fetchProcurementData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create PO');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReceiveStock = async (po: AdminPurchaseOrder) => {
    if (!confirm(`Confirm stock inwarding for ${po.po_number}? This will update variant inventory in Supabase!`)) return;

    try {
      await markPurchaseOrderReceived(po);
      alert('Stock Inwarded & Inventory Updated Successfully!');
      fetchProcurementData();
    } catch (err) {
      console.error('Inwarding error:', err);
      alert('Failed to inward stock. Check the purchase order and inventory records.');
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-2">
             <h1 className="text-xl font-semibold text-[#1a1a1a]">Procurement & Vendor Invoices</h1>
             <span className="text-xs font-semibold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
               📦 Stock Inwarding & COGS
             </span>
           </div>
           <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage suppliers, purchase orders, vendor invoices, and COGS margins.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowSupplierModal(true)}
            className="bg-white hover:bg-gray-50 text-gray-800 font-medium px-4 py-2.5 rounded-lg border border-gray-200 text-xs shadow-sm transition-all"
          >
            + Add Supplier
          </button>

          <button
            onClick={() => setShowPOCreator(true)}
            className="bg-[#303030] hover:bg-[#1a1a1a] text-white font-medium px-5 py-2.5 rounded-lg shadow-sm text-xs transition-all"
          >
            <Plus size={16} className="inline mr-1" /> New Purchase Order
          </button>
        </div>
      </div>

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-emerald-700">
            <span className="text-xs font-semibold text-gray-400">Total Sourcing Spend</span>
            <IndianRupee size={18} />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">₹{stats.totalSpend}</h3>
          <p className="text-xs text-gray-400 font-medium">Sum of all Purchase Orders</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-[#616161]">
            <span className="text-xs font-semibold text-gray-400">Pending Inwardings</span>
            <Clock size={18} />
          </div>
          <h3 className="text-2xl font-semibold text-[#1a1a1a]">{stats.pendingPOs}</h3>
          <p className="text-xs text-[#616161] font-medium">POs awaiting stock arrival</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-purple-600">
            <span className="text-xs font-semibold text-gray-400">Active Suppliers</span>
            <Building size={18} />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">{stats.activeSuppliers}</h3>
          <p className="text-xs text-purple-600 font-medium">Registered Vendors & Fisheries</p>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-2">
        {[
          { id: 'pos', label: `Purchase Orders (${purchaseOrders.length})` },
          { id: 'suppliers', label: `Suppliers & Vendors (${suppliers.length})` },
          { id: 'margins', label: `COGS & Margins` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'pos' | 'suppliers' | 'margins')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === tab.id ? 'bg-[#303030] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PURCHASE ORDERS */}
      {activeTab === 'pos' && (
        <div className="space-y-4">
          {purchaseOrders.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center space-y-3">
              <Package size={40} className="text-gray-300 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900">No Purchase Orders Found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">Create a Purchase Order to inward stock from fisheries or rice mills.</p>
              <button onClick={() => setShowPOCreator(true)} className="bg-[#303030] text-white font-medium px-6 py-3 rounded-lg text-xs ">
                Create First PO
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {purchaseOrders.map((po) => {
                const isReceived = po.status === 'received';

                return (
                  <div key={po.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 hover:shadow-sm transition-all relative overflow-hidden">
                    <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 text-sm">{po.po_number}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            isReceived ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-gray-200'
                          }`}>
                            <span className="capitalize">{String(po.status).replace(/_/g, ' ')}</span>
                          </span>
                        </div>
                        <p className="text-xs font-medium text-[#1a1a1a] mt-0.5">{po.suppliers?.name || 'Supplier'}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-semibold text-gray-900 block">₹{po.total_cost}</span>
                        <span className="text-xs text-gray-400 font-medium">Inv: {po.invoice_number || 'N/A'}</span>
                      </div>
                    </div>

                    {/* PO Items */}
                    <div className="space-y-1.5 bg-gray-50 p-3 rounded-xl text-xs border border-gray-100">
                      <span className="text-[11px] font-semibold text-gray-400 ">Inwarded Line Items</span>
                      {(po.purchase_order_items || []).map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span>{item.product_variants?.products?.name} ({item.product_variants?.unit}) x{item.quantity_ordered}</span>
                          <span className="font-medium">₹{item.total_cost_price}</span>
                        </div>
                      ))}
                    </div>

                    {!isReceived && (
                      <button
                        onClick={() => handleReceiveStock(po)}
                        className="w-full bg-[#303030] hover:bg-[#1a1a1a] text-white font-semibold py-3 rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={16} /> Confirm Stock Arrival & Inward Inventory
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SUPPLIERS */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map(s => (
            <div key={s.id} className="bg-white border border-gray-200 p-5 rounded-xl space-y-2 shadow-sm">
              <h3 className="font-semibold text-base text-gray-900">{s.name}</h3>
              <p className="text-xs text-gray-600 font-medium flex items-center gap-1.5"><User size={14} className="text-[#616161]" /> {s.contact_person || 'N/A'}</p>
              <p className="text-xs text-gray-600 font-medium flex items-center gap-1.5"><Phone size={14} className="text-gray-400" /> {s.phone || 'N/A'}</p>
              <p className="text-xs text-gray-600 font-medium flex items-center gap-1.5"><MapPin size={14} className="text-gray-400" /> {s.city || 'Kolkata'}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: COGS MARGINS */}
      {activeTab === 'margins' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 ">Cost of Goods Sold (COGS) & Profit Margins</h2>
          <p className="text-xs text-gray-500">Estimates gross profit per product variant based on supplier PO cost prices.</p>

          <div className="divide-y divide-gray-100">
            {products.map(p => (
              (p.product_variants || []).map((v) => {
                const sellPrice = Number(v.price);
                const estimatedCost = Math.round(sellPrice * 0.65); // 35% estimated margin
                const profit = sellPrice - estimatedCost;

                return (
                  <div key={v.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-gray-900">{p.name} ({v.unit})</span>
                      <span className="text-xs text-gray-400 block">Retail Price: ₹{sellPrice} | Est. Cost: ₹{estimatedCost}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-semibold text-emerald-700 text-sm">₹{profit} Profit / unit</span>
                      <span className="text-[11px] font-semibold text-[#616161] block">35% Gross Margin</span>
                    </div>
                  </div>
                );
              })
            ))}
          </div>
        </div>
      )}

      {/* CREATE PO MODAL */}
      {showPOCreator && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPOCreator(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-xl p-6 space-y-5 z-10 shadow-xl max-h-[90vh] overflow-y-auto no-scrollbar">

            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="text-base font-semibold text-[#1a1a1a]">Create Purchase Order (PO)</h2>
              <button onClick={() => setShowPOCreator(false)} className="text-gray-400"><X size={20} /></button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-gray-400 block mb-1">Select Supplier / Fishery</label>
                <select
                  value={poForm.supplierId}
                  onChange={e => setPoForm({ ...poForm, supplierId: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 font-medium text-gray-900"
                >
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.city})</option>)}
                </select>
              </div>

              <div>
                <label className="font-medium text-gray-400 block mb-1">Vendor Invoice # (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. INV-PADMA-991"
                  value={poForm.invoiceNumber}
                  onChange={e => setPoForm({ ...poForm, invoiceNumber: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 font-medium"
                />
              </div>

              {/* Add Variant Selector */}
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <label className="font-medium text-gray-400 block">Add Variants to PO</label>
                <div className="max-h-40 overflow-y-auto space-y-2 no-scrollbar">
                  {products.map(p => (
                    <div key={p.id} className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-xs">
                      <span className="font-medium text-gray-900 block">{p.name}</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {(p.product_variants || []).map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => handleAddPOItem(v, p)}
                            className="bg-white border border-gray-300 text-gray-800 px-2.5 py-1 rounded-lg text-xs font-medium hover:bg-emerald-800 hover:text-white"
                          >
                            + {v.unit}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected PO Items */}
              <div className="space-y-2 pt-2">
                <label className="font-medium text-gray-400 block">Selected Items ({poForm.items.length})</label>
                {poForm.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-xs">
                    <span>{item.productName}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={e => {
                          const updated = [...poForm.items];
                          updated[idx].qty = Number(e.target.value);
                          setPoForm({ ...poForm, items: updated });
                        }}
                        className="w-14 bg-white border border-gray-300 rounded p-1 text-center font-medium"
                      />
                      <span>@ ₹</span>
                      <input
                        type="number"
                        value={item.costPrice}
                        onChange={e => {
                          const updated = [...poForm.items];
                          updated[idx].costPrice = Number(e.target.value);
                          setPoForm({ ...poForm, items: updated });
                        }}
                        className="w-16 bg-white border border-gray-300 rounded p-1 text-center font-medium"
                      />
                      <button type="button" onClick={() => handleRemovePOItem(idx)} className="text-rose-600 p-1"><X size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#303030] hover:bg-[#1a1a1a] text-white font-semibold py-4 rounded-xl text-xs shadow-sm disabled:opacity-50 mt-4"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Save & Send Purchase Order"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SUPPLIER MODAL */}
      {showSupplierModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSupplierModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-xl p-6 space-y-4 z-10 shadow-xl">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="text-base font-semibold text-[#1a1a1a]">Add Vendor / Supplier</h2>
              <button onClick={() => setShowSupplierModal(false)} className="text-gray-400"><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-gray-400 block mb-1">Company / Fishery Name</label>
                <input required type="text" placeholder="e.g. Padma Fisheries Co." value={supplierForm.name} onChange={e => setSupplierForm({...supplierForm, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 font-medium" />
              </div>
              <div>
                <label className="font-medium text-gray-400 block mb-1">Contact Person</label>
                <input type="text" placeholder="e.g. Bimal Halder" value={supplierForm.contactPerson} onChange={e => setSupplierForm({...supplierForm, contactPerson: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 font-medium" />
              </div>
              <div>
                <label className="font-medium text-gray-400 block mb-1">Phone Number</label>
                <input type="tel" placeholder="10-digit phone" value={supplierForm.phone} onChange={e => setSupplierForm({...supplierForm, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 font-medium" />
              </div>
              <div>
                <label className="font-medium text-gray-400 block mb-1">City</label>
                <input type="text" placeholder="e.g. Kolkata" value={supplierForm.city} onChange={e => setSupplierForm({...supplierForm, city: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 font-medium" />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-[#303030] text-white font-semibold py-4 rounded-xl text-xs shadow-sm mt-3">
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Save Supplier"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
