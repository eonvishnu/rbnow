"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  Truck,
  PackageCheck,
  AlertTriangle,
  Send,
  CheckCircle2,
  RefreshCcw,
  Search,
  Filter,
  Plus,
  X,
  User,
  MapPin,
  Clock,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import {
  fetchPendingOrderItems,
  fetchFulfillmentBatches,
  createFulfillmentBatchRecord,
  allocateItemToBatch,
  updateFulfillmentDriverInfo,
  completeFulfillmentDeliveryRpc,
  cancelFulfillmentBatchRpc,
  type PendingOrderItem,
  type FulfillmentBatchRow,
} from '@/features/fulfillments/repositories/fulfillments.repository';
import { logAdminAction } from '@/features/staff/repositories/audit-logs.repository';

export default function DeliveryDispatchPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'batching' | 'dispatch' | 'active'>('pending');
  const [loading, setLoading] = useState(true);
  const [pendingItems, setPendingItems] = useState<PendingOrderItem[]>([]);
  const [fulfillments, setFulfillments] = useState<FulfillmentBatchRow[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'ready' | 'hold'>('all');

  // Batching State
  const [selectedUserForBatch, setSelectedUserForBatch] = useState<string | null>(null);
  const [selectedItemQuantities, setSelectedItemQuantities] = useState<Record<string, number>>({});
  const [creatingBatch, setCreatingBatch] = useState(false);

  // Dispatch & Driver Assignment State
  const [driverAssignments, setDriverAssignments] = useState<Record<string, { name: string; phone: string; notes: string }>>({});
  const [updatingDispatch, setUpdatingDispatch] = useState<string | null>(null);

  // Delivery Timeline Modal State
  const [timelineUser, setTimelineUser] = useState<{ id: string; name: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [items, batches] = await Promise.all([
        fetchPendingOrderItems(),
        fetchFulfillmentBatches(),
      ]);
      setPendingItems(items);
      setFulfillments(batches);
    } catch (err) {
      console.error('Error loading dispatch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Pending Items
  const filteredItems = useMemo(() => {
    return pendingItems.filter(item => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.product_name.toLowerCase().includes(q) ||
        item.customer_name.toLowerCase().includes(q) ||
        String(item.order_number || '').includes(q);

      if (!matchesSearch) return false;

      if (filterMode === 'ready') return item.quantity_on_hold === 0;
      if (filterMode === 'hold') return item.quantity_on_hold > 0;
      return true;
    });
  }, [pendingItems, searchQuery, filterMode]);

  // Group pending items by customer for combined batching
  const customerGroupedPending = useMemo(() => {
    const map = new Map<string, { customerName: string; userId: string; items: PendingOrderItem[] }>();
    pendingItems.forEach(item => {
      if (!item.user_id || item.quantity_remaining <= 0) return;
      if (!map.has(item.user_id)) {
        map.set(item.user_id, {
          customerName: item.customer_name,
          userId: item.user_id,
          items: [],
        });
      }
      map.get(item.user_id)!.items.push(item);
    });
    return Array.from(map.values());
  }, [pendingItems]);

  // Handle batch selection quantity toggles
  const handleItemQuantityChange = (itemId: string, qty: number, maxQty: number) => {
    const validQty = Math.max(0, Math.min(qty, maxQty));
    setSelectedItemQuantities(prev => ({
      ...prev,
      [itemId]: validQty,
    }));
  };

  // Create Combined Delivery Batch via RPC allocate_fulfillment_item
  const handleCreateDeliveryBatch = async () => {
    if (!selectedUserForBatch) {
      return alert('Please select a customer to create a delivery batch.');
    }

    const itemsToAllocate = Object.entries(selectedItemQuantities).filter(([_, qty]) => qty > 0);
    if (itemsToAllocate.length === 0) {
      return alert('Please select at least 1 item with quantity > 0 to include in this delivery batch.');
    }

    setCreatingBatch(true);
    try {
      // 1. Create fulfillment batch record
      const batch = await createFulfillmentBatchRecord({
        userId: selectedUserForBatch,
        notes: 'Combined customer delivery batch created from Admin Dispatch',
      });

      // 2. Allocate each selected item using RPC allocate_fulfillment_item
      for (const [itemId, qty] of itemsToAllocate) {
        await allocateItemToBatch({
          fulfillmentId: batch.id,
          orderItemId: itemId,
          quantity: qty,
        });
      }

      // Log admin audit action
      await logAdminAction({
        action: 'create_delivery_batch',
        entityType: 'fulfillments',
        entityId: batch.id,
        details: {
          fulfillment_number: batch.fulfillment_number,
          item_count: itemsToAllocate.length,
          user_id: selectedUserForBatch,
        },
      });

      alert(`✅ Combined delivery batch ${batch.fulfillment_number} created successfully!`);
      setSelectedItemQuantities({});
      setSelectedUserForBatch(null);
      await loadData();
      setActiveTab('dispatch');
    } catch (err: any) {
      console.error('Error creating delivery batch:', err);
      alert('Failed to create delivery batch: ' + (err.message || String(err)));
    } finally {
      setCreatingBatch(false);
    }
  };

  // Dispatch & Mark Out for Delivery
  const handleMarkOutForDelivery = async (batchId: string) => {
    const driver = driverAssignments[batchId];
    if (!driver || !driver.name.trim() || !driver.phone.trim()) {
      return alert('Please enter driver name and contact phone number before dispatching.');
    }

    setUpdatingDispatch(batchId);
    try {
      await updateFulfillmentDriverInfo({
        fulfillmentId: batchId,
        status: 'out_for_delivery',
        driverName: driver.name,
        driverPhone: driver.phone,
        notes: driver.notes,
      });

      await logAdminAction({
        action: 'dispatch_delivery_batch',
        entityType: 'fulfillments',
        entityId: batchId,
        details: { driver_name: driver.name, driver_phone: driver.phone },
      });

      alert('🚀 Delivery batch marked Out for Delivery!');
      await loadData();
      setActiveTab('active');
    } catch (err: any) {
      console.error('Dispatch error:', err);
      alert('Failed to update dispatch status: ' + (err.message || String(err)));
    } finally {
      setUpdatingDispatch(null);
    }
  };

  // Complete Delivery via RPC complete_fulfillment_delivery
  const handleCompleteDelivery = async (batchId: string) => {
    if (!confirm('Confirm delivery for this batch? This will complete items on the original orders.')) return;

    setUpdatingDispatch(batchId);
    try {
      await completeFulfillmentDeliveryRpc(batchId);

      await logAdminAction({
        action: 'complete_fulfillment_delivery',
        entityType: 'fulfillments',
        entityId: batchId,
      });

      alert('✅ Delivery marked completed successfully!');
      await loadData();
    } catch (err: any) {
      console.error('Completion error:', err);
      alert('Failed to complete delivery: ' + (err.message || String(err)));
    } finally {
      setUpdatingDispatch(null);
    }
  };

  // Cancel Batch via RPC cancel_fulfillment_batch
  const handleCancelBatch = async (batchId: string) => {
    const reason = prompt('Enter cancellation reason:');
    if (!reason || !reason.trim()) return;

    setUpdatingDispatch(batchId);
    try {
      await cancelFulfillmentBatchRpc(batchId, reason);

      await logAdminAction({
        action: 'cancel_fulfillment_batch',
        entityType: 'fulfillments',
        entityId: batchId,
        details: { reason },
      });

      alert('Delivery batch cancelled and stock restored to available pool.');
      await loadData();
    } catch (err: any) {
      console.error('Cancel error:', err);
      alert('Failed to cancel batch: ' + (err.message || String(err)));
    } finally {
      setUpdatingDispatch(null);
    }
  };

  // KPI Counts
  const kpiPendingCount = pendingItems.reduce((sum, item) => sum + item.quantity_remaining, 0);
  const kpiHoldCount = pendingItems.reduce((sum, item) => sum + item.quantity_on_hold, 0);
  const kpiReadyDispatchCount = fulfillments.filter(f => f.status === 'preparing' || f.status === 'ready_for_dispatch').length;
  const kpiOutForDeliveryCount = fulfillments.filter(f => f.status === 'out_for_delivery').length;

  return (
    <div className="space-y-6 text-xs text-[#303030]">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1a1a1a] flex items-center gap-2">
            <Truck size={22} className="text-[#303030]" /> Delivery & Dispatch Operations
          </h1>
          <p className="text-[#616161] text-xs mt-0.5">
            Manage partial fulfillments, combine customer order deliveries, assign drivers, and confirm dispatch.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="bg-[#303030] hover:bg-[#1a1a1a] text-white px-3.5 h-9 rounded-lg font-medium inline-flex items-center gap-2 transition-colors self-start sm:self-auto shrink-0 shadow-xs"
        >
          <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* DASHBOARD OVERVIEW KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-1">
          <div className="flex justify-between items-center text-[#616161]">
            <span className="font-medium text-[11px]">Pending Items</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-[#1a1a1a]">{kpiPendingCount}</p>
          <p className="text-[10px] text-[#616161]">Awaiting fulfillment</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-1">
          <div className="flex justify-between items-center text-[#616161]">
            <span className="font-medium text-[11px]">Quality Holds</span>
            <AlertTriangle size={16} className="text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-[#1a1a1a]">{kpiHoldCount}</p>
          <p className="text-[10px] text-[#616161]">Supplier inspection/restock</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-1">
          <div className="flex justify-between items-center text-[#616161]">
            <span className="font-medium text-[11px]">Ready to Dispatch</span>
            <PackageCheck size={16} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-[#1a1a1a]">{kpiReadyDispatchCount}</p>
          <p className="text-[10px] text-[#616161]">Eligible for batching</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-1">
          <div className="flex justify-between items-center text-[#616161]">
            <span className="font-medium text-[11px]">Out for Delivery</span>
            <Send size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-[#1a1a1a]">{kpiOutForDeliveryCount}</p>
          <p className="text-[10px] text-[#616161]">Dispatched vehicles</p>
        </div>
      </div>

      {/* DISPATCH SEGMENTED TAB NAVIGATION */}
      <div className="bg-white p-1.5 rounded-xl border border-gray-200 shadow-xs flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
            activeTab === 'pending' ? 'bg-[#303030] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Clock size={15} />
          <span>Pending Items Queue</span>
        </button>

        <button
          onClick={() => setActiveTab('batching')}
          className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
            activeTab === 'batching' ? 'bg-[#303030] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Plus size={15} />
          <span>Create Delivery Batch</span>
        </button>

        <button
          onClick={() => setActiveTab('dispatch')}
          className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
            activeTab === 'dispatch' ? 'bg-[#303030] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Send size={15} />
          <span>Dispatch & Driver Assignment</span>
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
            activeTab === 'active' ? 'bg-[#303030] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <CheckCircle2 size={15} />
          <span>Active Deliveries & Completion</span>
        </button>
      </div>

      {/* TAB 1: PENDING ITEMS QUEUE */}
      {activeTab === 'pending' && (
        <div className="bg-white p-5 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search order #, product, or customer..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg pl-9 pr-3 h-8 text-xs text-[#1a1a1a] outline-none font-medium"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter size={14} className="text-gray-500" />
              <button
                onClick={() => setFilterMode('all')}
                className={`px-2.5 h-7 rounded-md text-[11px] font-medium transition-colors ${
                  filterMode === 'all' ? 'bg-[#303030] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterMode('ready')}
                className={`px-2.5 h-7 rounded-md text-[11px] font-medium transition-colors ${
                  filterMode === 'ready' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Ready for Dispatch
              </button>
              <button
                onClick={() => setFilterMode('hold')}
                className={`px-2.5 h-7 rounded-md text-[11px] font-medium transition-colors ${
                  filterMode === 'hold' ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Quality Hold
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7f7f7] text-[#616161] font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2.5">Order & Customer</th>
                  <th className="px-3 py-2.5">Product</th>
                  <th className="px-3 py-2.5 text-center">Ordered</th>
                  <th className="px-3 py-2.5 text-center">Delivered</th>
                  <th className="px-3 py-2.5 text-center">Remaining</th>
                  <th className="px-3 py-2.5">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400 font-normal">
                      No pending order items match filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#fafafa] transition-colors">
                      <td className="px-3 py-3">
                        <span className="font-bold text-[#1a1a1a] block">#{item.order_number || 'N/A'}</span>
                        <button
                          onClick={() => setTimelineUser({ id: item.user_id, name: item.customer_name })}
                          className="text-[#014b40] hover:underline text-[11px] font-medium inline-flex items-center gap-1"
                        >
                          <User size={12} /> {item.customer_name}
                        </button>
                      </td>

                      <td className="px-3 py-3 font-semibold text-[#1a1a1a]">
                        {item.product_name}
                      </td>

                      <td className="px-3 py-3 text-center">{item.quantity_ordered}</td>
                      <td className="px-3 py-3 text-center text-emerald-600 font-bold">{item.quantity_fulfilled}</td>
                      <td className="px-3 py-3 text-center text-amber-600 font-bold">{item.quantity_remaining}</td>

                      <td className="px-3 py-3">
                        {item.quantity_on_hold > 0 ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              <AlertTriangle size={12} /> {item.quantity_on_hold} on Quality Hold
                            </span>
                            {item.hold_reason && (
                              <span className="block text-[10px] text-gray-500 italic truncate max-w-xs">{item.hold_reason}</span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 size={12} /> Ready for Batching
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CREATE COMBINED DELIVERY BATCH */}
      {activeTab === 'batching' && (
        <div className="bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-5 animate-in fade-in duration-200">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-[#1a1a1a]">Combine Customer Orders into Physical Delivery Batch</h2>
            <p className="text-xs text-[#616161] mt-0.5">
              Select pending items from multiple orders belonging to the same customer to dispatch together in 1 delivery batch.
            </p>
          </div>

          {/* CUSTOMER SELECTOR */}
          <div className="space-y-3">
            <label className="font-semibold text-[#1a1a1a] block">Select Customer with Pending Items</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {customerGroupedPending.map(group => {
                const isSelected = selectedUserForBatch === group.userId;

                return (
                  <button
                    key={group.userId}
                    type="button"
                    onClick={() => {
                      setSelectedUserForBatch(group.userId);
                      setSelectedItemQuantities({});
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#303030] bg-[#303030] text-white shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-[#1a1a1a]'
                    }`}
                  >
                    <div className="font-bold text-xs">{group.customerName}</div>
                    <div className={`text-[11px] mt-1 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                      📦 {group.items.length} pending items available
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ITEM ALLOCATION SELECTOR */}
          {selectedUserForBatch && (
            <div className="bg-[#fafafa] p-4 rounded-xl border border-gray-200 space-y-4 animate-in fade-in duration-200">
              <h3 className="font-bold text-xs text-[#1a1a1a]">Select Items & Quantities to Include in Today's Delivery Batch</h3>

              <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden bg-white">
                {customerGroupedPending
                  .find(g => g.userId === selectedUserForBatch)
                  ?.items.map(item => {
                    const currentQty = selectedItemQuantities[item.id] || 0;

                    return (
                      <div key={item.id} className="p-3 flex items-center justify-between gap-3 hover:bg-gray-50">
                        <div>
                          <span className="font-bold text-[#1a1a1a] block">
                            Order #{item.order_number} &bull; {item.product_name}
                          </span>
                          <span className="text-[11px] text-gray-500">
                            Available to deliver: <strong className="text-amber-700">{item.quantity_remaining}</strong> (Ordered: {item.quantity_ordered}, Delivered: {item.quantity_fulfilled})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-[11px] text-gray-500 font-medium">Qty in batch:</label>
                          <input
                            type="number"
                            min="0"
                            max={item.quantity_remaining}
                            value={currentQty}
                            onChange={e => handleItemQuantityChange(item.id, Number(e.target.value), item.quantity_remaining)}
                            className="w-16 bg-[#f7f7f7] border border-gray-200 rounded-md p-1.5 text-center text-xs font-bold text-[#1a1a1a] outline-none"
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={creatingBatch}
                  onClick={handleCreateDeliveryBatch}
                  className="bg-[#303030] hover:bg-[#1a1a1a] text-white px-5 h-9 rounded-lg text-xs font-bold inline-flex items-center gap-2 transition-colors shadow-xs"
                >
                  {creatingBatch ? <Loader2 size={14} className="animate-spin" /> : <Plus size={15} />}
                  <span>Create Combined Delivery Batch</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DISPATCH & DRIVER ASSIGNMENT */}
      {activeTab === 'dispatch' && (
        <div className="bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-4 animate-in fade-in duration-200">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-[#1a1a1a]">Dispatch Vehicles & Assign Drivers</h2>
            <p className="text-xs text-[#616161] mt-0.5">Assign driver details to prepared delivery batches before marking Out for Delivery.</p>
          </div>

          <div className="space-y-4">
            {fulfillments.filter(f => f.status === 'preparing' || f.status === 'ready_for_dispatch').length === 0 ? (
              <div className="py-8 text-center bg-[#f7f7f7] rounded-xl border border-gray-200">
                <p className="font-semibold text-[#1a1a1a]">No batches awaiting driver assignment</p>
                <p className="text-xs text-gray-500 mt-0.5">Create a delivery batch from Tab 2 to assign drivers and dispatch.</p>
              </div>
            ) : (
              fulfillments
                .filter(f => f.status === 'preparing' || f.status === 'ready_for_dispatch')
                .map(batch => {
                  const driver = driverAssignments[batch.id] || { name: batch.driver_name || '', phone: batch.driver_phone || '', notes: batch.delivery_notes || '' };

                  return (
                    <div key={batch.id} className="p-4 bg-[#fafafa] border border-gray-200 rounded-xl space-y-3">
                      <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                        <div>
                          <span className="font-bold text-sm text-[#1a1a1a] block">{batch.fulfillment_number}</span>
                          <span className="text-[11px] text-gray-500">Customer: <strong>{batch.customer_name}</strong></span>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          Preparing Batch
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-medium text-gray-600 block mb-1">Driver Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Ramesh Kumar"
                            value={driver.name}
                            onChange={e => setDriverAssignments(prev => ({
                              ...prev,
                              [batch.id]: { ...driver, name: e.target.value }
                            }))}
                            className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold text-[#1a1a1a] outline-none"
                          />
                        </div>

                        <div>
                          <label className="font-medium text-gray-600 block mb-1">Driver Phone</label>
                          <input
                            type="text"
                            placeholder="e.g. +91 9876543210"
                            value={driver.phone}
                            onChange={e => setDriverAssignments(prev => ({
                              ...prev,
                              [batch.id]: { ...driver, phone: e.target.value }
                            }))}
                            className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold text-[#1a1a1a] outline-none"
                          />
                        </div>

                        <div>
                          <label className="font-medium text-gray-600 block mb-1">Delivery Notes</label>
                          <input
                            type="text"
                            placeholder="e.g. Handle with care..."
                            value={driver.notes}
                            onChange={e => setDriverAssignments(prev => ({
                              ...prev,
                              [batch.id]: { ...driver, notes: e.target.value }
                            }))}
                            className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-medium text-[#1a1a1a] outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-[11px] text-gray-500">
                          Items in batch: {batch.fulfillment_items?.length || 0} line items
                        </span>

                        <button
                          type="button"
                          disabled={updatingDispatch === batch.id}
                          onClick={() => handleMarkOutForDelivery(batch.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 h-8 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                        >
                          {updatingDispatch === batch.id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                          <span>Mark Out for Delivery</span>
                        </button>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {/* TAB 4: ACTIVE DELIVERIES & COMPLETION */}
      {activeTab === 'active' && (
        <div className="bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-4 animate-in fade-in duration-200">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-[#1a1a1a]">Active Vehicles & Delivery Confirmation</h2>
            <p className="text-xs text-[#616161] mt-0.5">Track dispatched vehicles and execute delivery completion via RPC complete_fulfillment_delivery().</p>
          </div>

          <div className="space-y-4">
            {fulfillments.filter(f => f.status === 'out_for_delivery' || f.status === 'delivered').length === 0 ? (
              <div className="py-8 text-center bg-[#f7f7f7] rounded-xl border border-gray-200">
                <p className="font-semibold text-[#1a1a1a]">No active deliveries found</p>
              </div>
            ) : (
              fulfillments
                .filter(f => f.status === 'out_for_delivery' || f.status === 'delivered')
                .map(batch => (
                  <div key={batch.id} className="p-4 bg-[#fafafa] border border-gray-200 rounded-xl space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <div>
                        <span className="font-bold text-sm text-[#1a1a1a] block">{batch.fulfillment_number}</span>
                        <span className="text-[11px] text-gray-500">
                          Customer: <strong>{batch.customer_name}</strong> &bull; Driver: <strong>{batch.driver_name || 'N/A'}</strong> ({batch.driver_phone || 'N/A'})
                        </span>
                      </div>

                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        batch.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {batch.status === 'delivered' ? 'Completed & Delivered' : 'Out for Delivery'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-[11px] text-gray-500">
                        Dispatched: {new Date(batch.created_at).toLocaleString()}
                      </span>

                      {batch.status === 'out_for_delivery' && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={updatingDispatch === batch.id}
                            onClick={() => handleCancelBatch(batch.id)}
                            className="bg-white border border-gray-200 hover:bg-rose-50 text-rose-600 px-3 h-8 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Cancel Batch
                          </button>
                          <button
                            type="button"
                            disabled={updatingDispatch === batch.id}
                            onClick={() => handleCompleteDelivery(batch.id)}
                            className="bg-[#303030] hover:bg-[#1a1a1a] text-white px-4 h-8 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            {updatingDispatch === batch.id ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                            <span>Confirm Delivery (RPC)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* CUSTOMER TIMELINE MODAL */}
      {timelineUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl text-xs animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-sm text-[#1a1a1a]">Customer Order & Delivery Timeline</h3>
              <button onClick={() => setTimelineUser(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-[#1a1a1a]">{timelineUser.name}</p>
              <div className="border-l-2 border-[#303030] pl-3 space-y-3 text-[11px]">
                {pendingItems
                  .filter(i => i.user_id === timelineUser.id)
                  .map(i => (
                    <div key={i.id} className="space-y-0.5">
                      <span className="font-bold text-[#1a1a1a]">Order #{i.order_number} &bull; {i.product_name}</span>
                      <span className="block text-gray-500">
                        Ordered: {i.quantity_ordered} | Delivered: {i.quantity_fulfilled} | Remaining: {i.quantity_remaining}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
