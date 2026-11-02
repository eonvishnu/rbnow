(()=>{"use strict";(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/admin/app/dispatch/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DeliveryDispatchPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PackageCheck$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/package-check.js [app-client] (ecmascript) <export default as PackageCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCcw$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/refresh-ccw.js [app-client] (ecmascript) <export default as RefreshCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/filter.js [app-client] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$fulfillments$2f$repositories$2f$fulfillments$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/features/fulfillments/repositories/fulfillments.repository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$staff$2f$repositories$2f$audit$2d$logs$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/features/staff/repositories/audit-logs.repository.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function DeliveryDispatchPage() {
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('pending');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [pendingItems, setPendingItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [fulfillments, setFulfillments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Search & Filters
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [filterMode, setFilterMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    // Batching State
    const [selectedUserForBatch, setSelectedUserForBatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedItemQuantities, setSelectedItemQuantities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [creatingBatch, setCreatingBatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Dispatch & Driver Assignment State
    const [driverAssignments, setDriverAssignments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [updatingDispatch, setUpdatingDispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Delivery Timeline Modal State
    const [timelineUser, setTimelineUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const loadData = async ()=>{
        setLoading(true);
        try {
            const [items, batches] = await Promise.all([
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$fulfillments$2f$repositories$2f$fulfillments$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchPendingOrderItems"])(),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$fulfillments$2f$repositories$2f$fulfillments$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchFulfillmentBatches"])()
            ]);
            setPendingItems(items);
            setFulfillments(batches);
        } catch (err) {
            console.error('Error loading dispatch data:', err);
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DeliveryDispatchPage.useEffect": ()=>{
            loadData();
        }
    }["DeliveryDispatchPage.useEffect"], []);
    // Filtered Pending Items
    const filteredItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DeliveryDispatchPage.useMemo[filteredItems]": ()=>{
            return pendingItems.filter({
                "DeliveryDispatchPage.useMemo[filteredItems]": (item)=>{
                    const q = searchQuery.toLowerCase();
                    const matchesSearch = item.product_name.toLowerCase().includes(q) || item.customer_name.toLowerCase().includes(q) || String(item.order_number || '').includes(q);
                    if (!matchesSearch) return false;
                    if (filterMode === 'ready') return item.quantity_on_hold === 0;
                    if (filterMode === 'hold') return item.quantity_on_hold > 0;
                    return true;
                }
            }["DeliveryDispatchPage.useMemo[filteredItems]"]);
        }
    }["DeliveryDispatchPage.useMemo[filteredItems]"], [
        pendingItems,
        searchQuery,
        filterMode
    ]);
    // Group pending items by customer for combined batching
    const customerGroupedPending = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DeliveryDispatchPage.useMemo[customerGroupedPending]": ()=>{
            const map = new Map();
            pendingItems.forEach({
                "DeliveryDispatchPage.useMemo[customerGroupedPending]": (item)=>{
                    if (!item.user_id || item.quantity_remaining <= 0) return;
                    if (!map.has(item.user_id)) {
                        map.set(item.user_id, {
                            customerName: item.customer_name,
                            userId: item.user_id,
                            items: []
                        });
                    }
                    map.get(item.user_id).items.push(item);
                }
            }["DeliveryDispatchPage.useMemo[customerGroupedPending]"]);
            return Array.from(map.values());
        }
    }["DeliveryDispatchPage.useMemo[customerGroupedPending]"], [
        pendingItems
    ]);
    // Handle batch selection quantity toggles
    const handleItemQuantityChange = (itemId, qty, maxQty)=>{
        const validQty = Math.max(0, Math.min(qty, maxQty));
        setSelectedItemQuantities((prev)=>({
                ...prev,
                [itemId]: validQty
            }));
    };
    // Create Combined Delivery Batch via RPC allocate_fulfillment_item
    const handleCreateDeliveryBatch = async ()=>{
        if (!selectedUserForBatch) {
            return alert('Please select a customer to create a delivery batch.');
        }
        const itemsToAllocate = Object.entries(selectedItemQuantities).filter(([_, qty])=>qty > 0);
        if (itemsToAllocate.length === 0) {
            return alert('Please select at least 1 item with quantity > 0 to include in this delivery batch.');
        }
        setCreatingBatch(true);
        try {
            // 1. Create fulfillment batch record
            const batch = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$fulfillments$2f$repositories$2f$fulfillments$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFulfillmentBatchRecord"])({
                userId: selectedUserForBatch,
                notes: 'Combined customer delivery batch created from Admin Dispatch'
            });
            // 2. Allocate each selected item using RPC allocate_fulfillment_item
            for (const [itemId, qty] of itemsToAllocate){
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$fulfillments$2f$repositories$2f$fulfillments$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allocateItemToBatch"])({
                    fulfillmentId: batch.id,
                    orderItemId: itemId,
                    quantity: qty
                });
            }
            // Log admin audit action
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$staff$2f$repositories$2f$audit$2d$logs$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logAdminAction"])({
                action: 'create_delivery_batch',
                entityType: 'fulfillments',
                entityId: batch.id,
                details: {
                    fulfillment_number: batch.fulfillment_number,
                    item_count: itemsToAllocate.length,
                    user_id: selectedUserForBatch
                }
            });
            alert(`✅ Combined delivery batch ${batch.fulfillment_number} created successfully!`);
            setSelectedItemQuantities({});
            setSelectedUserForBatch(null);
            await loadData();
            setActiveTab('dispatch');
        } catch (err) {
            console.error('Error creating delivery batch:', err);
            alert('Failed to create delivery batch: ' + (err.message || String(err)));
        } finally{
            setCreatingBatch(false);
        }
    };
    // Dispatch & Mark Out for Delivery
    const handleMarkOutForDelivery = async (batchId)=>{
        const driver = driverAssignments[batchId];
        if (!driver || !driver.name.trim() || !driver.phone.trim()) {
            return alert('Please enter driver name and contact phone number before dispatching.');
        }
        setUpdatingDispatch(batchId);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$fulfillments$2f$repositories$2f$fulfillments$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateFulfillmentDriverInfo"])({
                fulfillmentId: batchId,
                status: 'out_for_delivery',
                driverName: driver.name,
                driverPhone: driver.phone,
                notes: driver.notes
            });
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$staff$2f$repositories$2f$audit$2d$logs$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logAdminAction"])({
                action: 'dispatch_delivery_batch',
                entityType: 'fulfillments',
                entityId: batchId,
                details: {
                    driver_name: driver.name,
                    driver_phone: driver.phone
                }
            });
            alert('🚀 Delivery batch marked Out for Delivery!');
            await loadData();
            setActiveTab('active');
        } catch (err) {
            console.error('Dispatch error:', err);
            alert('Failed to update dispatch status: ' + (err.message || String(err)));
        } finally{
            setUpdatingDispatch(null);
        }
    };
    // Complete Delivery via RPC complete_fulfillment_delivery
    const handleCompleteDelivery = async (batchId)=>{
        if (!confirm('Confirm delivery for this batch? This will complete items on the original orders.')) return;
        setUpdatingDispatch(batchId);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$fulfillments$2f$repositories$2f$fulfillments$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["completeFulfillmentDeliveryRpc"])(batchId);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$staff$2f$repositories$2f$audit$2d$logs$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logAdminAction"])({
                action: 'complete_fulfillment_delivery',
                entityType: 'fulfillments',
                entityId: batchId
            });
            alert('✅ Delivery marked completed successfully!');
            await loadData();
        } catch (err) {
            console.error('Completion error:', err);
            alert('Failed to complete delivery: ' + (err.message || String(err)));
        } finally{
            setUpdatingDispatch(null);
        }
    };
    // Cancel Batch via RPC cancel_fulfillment_batch
    const handleCancelBatch = async (batchId)=>{
        const reason = prompt('Enter cancellation reason:');
        if (!reason || !reason.trim()) return;
        setUpdatingDispatch(batchId);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$fulfillments$2f$repositories$2f$fulfillments$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cancelFulfillmentBatchRpc"])(batchId, reason);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$staff$2f$repositories$2f$audit$2d$logs$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logAdminAction"])({
                action: 'cancel_fulfillment_batch',
                entityType: 'fulfillments',
                entityId: batchId,
                details: {
                    reason
                }
            });
            alert('Delivery batch cancelled and stock restored to available pool.');
            await loadData();
        } catch (err) {
            console.error('Cancel error:', err);
            alert('Failed to cancel batch: ' + (err.message || String(err)));
        } finally{
            setUpdatingDispatch(null);
        }
    };
    // KPI Counts
    const kpiPendingCount = pendingItems.reduce((sum, item)=>sum + item.quantity_remaining, 0);
    const kpiHoldCount = pendingItems.reduce((sum, item)=>sum + item.quantity_on_hold, 0);
    const kpiReadyDispatchCount = fulfillments.filter((f)=>f.status === 'preparing' || f.status === 'ready_for_dispatch').length;
    const kpiOutForDeliveryCount = fulfillments.filter((f)=>f.status === 'out_for_delivery').length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6 text-xs text-[#303030]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-xl font-semibold text-[#1a1a1a] flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"], {
                                        size: 22,
                                        className: "text-[#303030]"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 270,
                                        columnNumber: 13
                                    }, this),
                                    " Delivery & Dispatch Operations"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 269,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[#616161] text-xs mt-0.5",
                                children: "Manage partial fulfillments, combine customer order deliveries, assign drivers, and confirm dispatch."
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 272,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/dispatch/page.tsx",
                        lineNumber: 268,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: loadData,
                        disabled: loading,
                        className: "bg-[#303030] hover:bg-[#1a1a1a] text-white px-3.5 h-9 rounded-lg font-medium inline-flex items-center gap-2 transition-colors self-start sm:self-auto shrink-0 shadow-xs",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCcw$3e$__["RefreshCcw"], {
                                size: 14,
                                className: loading ? 'animate-spin' : ''
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 282,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Refresh Queue"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 283,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/dispatch/page.tsx",
                        lineNumber: 277,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/dispatch/page.tsx",
                lineNumber: 267,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-4 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center text-[#616161]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-[11px]",
                                        children: "Pending Items"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 291,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                        size: 16,
                                        className: "text-amber-500"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 292,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 290,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-2xl font-bold text-[#1a1a1a]",
                                children: kpiPendingCount
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 294,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] text-[#616161]",
                                children: "Awaiting fulfillment"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 295,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/dispatch/page.tsx",
                        lineNumber: 289,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-4 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center text-[#616161]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-[11px]",
                                        children: "Quality Holds"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 300,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                        size: 16,
                                        className: "text-rose-500"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 301,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 299,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-2xl font-bold text-[#1a1a1a]",
                                children: kpiHoldCount
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 303,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] text-[#616161]",
                                children: "Supplier inspection/restock"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 304,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/dispatch/page.tsx",
                        lineNumber: 298,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-4 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center text-[#616161]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-[11px]",
                                        children: "Ready to Dispatch"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 309,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PackageCheck$3e$__["PackageCheck"], {
                                        size: 16,
                                        className: "text-blue-500"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 310,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 308,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-2xl font-bold text-[#1a1a1a]",
                                children: kpiReadyDispatchCount
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 312,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] text-[#616161]",
                                children: "Eligible for batching"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 313,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/dispatch/page.tsx",
                        lineNumber: 307,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-4 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center text-[#616161]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-[11px]",
                                        children: "Out for Delivery"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 318,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                        size: 16,
                                        className: "text-emerald-500"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 319,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 317,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-2xl font-bold text-[#1a1a1a]",
                                children: kpiOutForDeliveryCount
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 321,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] text-[#616161]",
                                children: "Dispatched vehicles"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 322,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/dispatch/page.tsx",
                        lineNumber: 316,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/dispatch/page.tsx",
                lineNumber: 288,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white p-1.5 rounded-xl border border-gray-200 shadow-xs flex flex-wrap gap-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('pending'),
                        className: `flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'pending' ? 'bg-[#303030] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                size: 15
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 334,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Pending Items Queue"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 335,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/dispatch/page.tsx",
                        lineNumber: 328,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('batching'),
                        className: `flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'batching' ? 'bg-[#303030] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                size: 15
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 344,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Create Delivery Batch"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 345,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/dispatch/page.tsx",
                        lineNumber: 338,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('dispatch'),
                        className: `flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'dispatch' ? 'bg-[#303030] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                size: 15
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 354,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Dispatch & Driver Assignment"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 355,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/dispatch/page.tsx",
                        lineNumber: 348,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('active'),
                        className: `flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'active' ? 'bg-[#303030] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                size: 15
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 364,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Active Deliveries & Completion"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 365,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/dispatch/page.tsx",
                        lineNumber: 358,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/dispatch/page.tsx",
                lineNumber: 327,
                columnNumber: 7
            }, this),
            activeTab === 'pending' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white p-5 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-4 animate-in fade-in duration-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative flex-1 max-w-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        size: 15,
                                        className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 374,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Search order #, product, or customer...",
                                        value: searchQuery,
                                        onChange: (e)=>setSearchQuery(e.target.value),
                                        className: "w-full bg-[#f7f7f7] border border-gray-200 rounded-lg pl-9 pr-3 h-8 text-xs text-[#1a1a1a] outline-none font-medium"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 375,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 373,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$filter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                        size: 14,
                                        className: "text-gray-500"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 385,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setFilterMode('all'),
                                        className: `px-2.5 h-7 rounded-md text-[11px] font-medium transition-colors ${filterMode === 'all' ? 'bg-[#303030] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`,
                                        children: "All"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 386,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setFilterMode('ready'),
                                        className: `px-2.5 h-7 rounded-md text-[11px] font-medium transition-colors ${filterMode === 'ready' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`,
                                        children: "Ready for Dispatch"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 394,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setFilterMode('hold'),
                                        className: `px-2.5 h-7 rounded-md text-[11px] font-medium transition-colors ${filterMode === 'hold' ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`,
                                        children: "Quality Hold"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 402,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 384,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/dispatch/page.tsx",
                        lineNumber: 372,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "overflow-x-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "w-full text-left text-xs",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    className: "bg-[#f7f7f7] text-[#616161] font-semibold border-b border-gray-200",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-3 py-2.5",
                                                children: "Order & Customer"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                lineNumber: 417,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-3 py-2.5",
                                                children: "Product"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                lineNumber: 418,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-3 py-2.5 text-center",
                                                children: "Ordered"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                lineNumber: 419,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-3 py-2.5 text-center",
                                                children: "Delivered"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                lineNumber: 420,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-3 py-2.5 text-center",
                                                children: "Remaining"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                lineNumber: 421,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-3 py-2.5",
                                                children: "Fulfillment Status"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                lineNumber: 422,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 416,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/dispatch/page.tsx",
                                    lineNumber: 415,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    className: "divide-y divide-gray-100 font-medium",
                                    children: filteredItems.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            colSpan: 6,
                                            className: "py-8 text-center text-gray-400 font-normal",
                                            children: "No pending order items match filter criteria."
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/dispatch/page.tsx",
                                            lineNumber: 428,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 427,
                                        columnNumber: 19
                                    }, this) : filteredItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "hover:bg-[#fafafa] transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-bold text-[#1a1a1a] block",
                                                            children: [
                                                                "#",
                                                                item.order_number || 'N/A'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/admin/app/dispatch/page.tsx",
                                                            lineNumber: 436,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setTimelineUser({
                                                                    id: item.user_id,
                                                                    name: item.customer_name
                                                                }),
                                                            className: "text-[#014b40] hover:underline text-[11px] font-medium inline-flex items-center gap-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                                    size: 12
                                                                }, void 0, false, {
                                                                    fileName: "[project]/admin/app/dispatch/page.tsx",
                                                                    lineNumber: 441,
                                                                    columnNumber: 27
                                                                }, this),
                                                                " ",
                                                                item.customer_name
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/admin/app/dispatch/page.tsx",
                                                            lineNumber: 437,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/admin/app/dispatch/page.tsx",
                                                    lineNumber: 435,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-3 font-semibold text-[#1a1a1a]",
                                                    children: item.product_name
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/dispatch/page.tsx",
                                                    lineNumber: 445,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-3 text-center",
                                                    children: item.quantity_ordered
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/dispatch/page.tsx",
                                                    lineNumber: 449,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-3 text-center text-emerald-600 font-bold",
                                                    children: item.quantity_fulfilled
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/dispatch/page.tsx",
                                                    lineNumber: 450,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-3 text-center text-amber-600 font-bold",
                                                    children: item.quantity_remaining
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/dispatch/page.tsx",
                                                    lineNumber: 451,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-3",
                                                    children: item.quantity_on_hold > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-0.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                                        size: 12
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                                                        lineNumber: 457,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    " ",
                                                                    item.quantity_on_hold,
                                                                    " on Quality Hold"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                                lineNumber: 456,
                                                                columnNumber: 29
                                                            }, this),
                                                            item.hold_reason && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "block text-[10px] text-gray-500 italic truncate max-w-xs",
                                                                children: item.hold_reason
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                                lineNumber: 460,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                                        lineNumber: 455,
                                                        columnNumber: 27
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                size: 12
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                                lineNumber: 465,
                                                                columnNumber: 29
                                                            }, this),
                                                            " Ready for Batching"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                                        lineNumber: 464,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/dispatch/page.tsx",
                                                    lineNumber: 453,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, item.id, true, {
                                            fileName: "[project]/admin/app/dispatch/page.tsx",
                                            lineNumber: 434,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/dispatch/page.tsx",
                                    lineNumber: 425,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/admin/app/dispatch/page.tsx",
                            lineNumber: 414,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/admin/app/dispatch/page.tsx",
                        lineNumber: 413,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/dispatch/page.tsx",
                lineNumber: 371,
                columnNumber: 9
            }, this),
            activeTab === 'batching' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-5 animate-in fade-in duration-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-b border-gray-100 pb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-sm font-bold text-[#1a1a1a]",
                                children: "Combine Customer Orders into Physical Delivery Batch"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 482,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-[#616161] mt-0.5",
                                children: "Select pending items from multiple orders belonging to the same customer to dispatch together in 1 delivery batch."
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 483,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/dispatch/page.tsx",
                        lineNumber: 481,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "font-semibold text-[#1a1a1a] block",
                                children: "Select Customer with Pending Items"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 490,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3",
                                children: customerGroupedPending.map((group)=>{
                                    const isSelected = selectedUserForBatch === group.userId;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>{
                                            setSelectedUserForBatch(group.userId);
                                            setSelectedItemQuantities({});
                                        },
                                        className: `p-3.5 rounded-xl border text-left transition-all ${isSelected ? 'border-[#303030] bg-[#303030] text-white shadow-md' : 'border-gray-200 bg-white hover:border-gray-300 text-[#1a1a1a]'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "font-bold text-xs",
                                                children: group.customerName
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                lineNumber: 509,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `text-[11px] mt-1 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`,
                                                children: [
                                                    "📦 ",
                                                    group.items.length,
                                                    " pending items available"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                lineNumber: 510,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, group.userId, true, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 496,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 491,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/dispatch/page.tsx",
                        lineNumber: 489,
                        columnNumber: 11
                    }, this),
                    selectedUserForBatch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-[#fafafa] p-4 rounded-xl border border-gray-200 space-y-4 animate-in fade-in duration-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-bold text-xs text-[#1a1a1a]",
                                children: "Select Items & Quantities to Include in Today's Delivery Batch"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 522,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden bg-white",
                                children: customerGroupedPending.find((g)=>g.userId === selectedUserForBatch)?.items.map((item)=>{
                                    const currentQty = selectedItemQuantities[item.id] || 0;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-3 flex items-center justify-between gap-3 hover:bg-gray-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold text-[#1a1a1a] block",
                                                        children: [
                                                            "Order #",
                                                            item.order_number,
                                                            " • ",
                                                            item.product_name
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                                        lineNumber: 533,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[11px] text-gray-500",
                                                        children: [
                                                            "Available to deliver: ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                className: "text-amber-700",
                                                                children: item.quantity_remaining
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                                lineNumber: 537,
                                                                columnNumber: 51
                                                            }, this),
                                                            " (Ordered: ",
                                                            item.quantity_ordered,
                                                            ", Delivered: ",
                                                            item.quantity_fulfilled,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                                        lineNumber: 536,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                lineNumber: 532,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-[11px] text-gray-500 font-medium",
                                                        children: "Qty in batch:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                                        lineNumber: 542,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        min: "0",
                                                        max: item.quantity_remaining,
                                                        value: currentQty,
                                                        onChange: (e)=>handleItemQuantityChange(item.id, Number(e.target.value), item.quantity_remaining),
                                                        className: "w-16 bg-[#f7f7f7] border border-gray-200 rounded-md p-1.5 text-center text-xs font-bold text-[#1a1a1a] outline-none"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                                        lineNumber: 543,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                lineNumber: 541,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, item.id, true, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 531,
                                        columnNumber: 23
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 524,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end pt-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    disabled: creatingBatch,
                                    onClick: handleCreateDeliveryBatch,
                                    className: "bg-[#303030] hover:bg-[#1a1a1a] text-white px-5 h-9 rounded-lg text-xs font-bold inline-flex items-center gap-2 transition-colors shadow-xs",
                                    children: [
                                        creatingBatch ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                            size: 14,
                                            className: "animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/dispatch/page.tsx",
                                            lineNumber: 564,
                                            columnNumber: 36
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            size: 15
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/dispatch/page.tsx",
                                            lineNumber: 564,
                                            columnNumber: 85
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Create Combined Delivery Batch"
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/dispatch/page.tsx",
                                            lineNumber: 565,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/admin/app/dispatch/page.tsx",
                                    lineNumber: 558,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 557,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/dispatch/page.tsx",
                        lineNumber: 521,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/dispatch/page.tsx",
                lineNumber: 480,
                columnNumber: 9
            }, this),
            activeTab === 'dispatch' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-4 animate-in fade-in duration-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-b border-gray-100 pb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-sm font-bold text-[#1a1a1a]",
                                children: "Dispatch Vehicles & Assign Drivers"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 577,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-[#616161] mt-0.5",
                                children: "Assign driver details to prepared delivery batches before marking Out for Delivery."
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 578,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/dispatch/page.tsx",
                        lineNumber: 576,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: fulfillments.filter((f)=>f.status === 'preparing' || f.status === 'ready_for_dispatch').length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "py-8 text-center bg-[#f7f7f7] rounded-xl border border-gray-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-semibold text-[#1a1a1a]",
                                    children: "No batches awaiting driver assignment"
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/dispatch/page.tsx",
                                    lineNumber: 584,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-500 mt-0.5",
                                    children: "Create a delivery batch from Tab 2 to assign drivers and dispatch."
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/dispatch/page.tsx",
                                    lineNumber: 585,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/admin/app/dispatch/page.tsx",
                            lineNumber: 583,
                            columnNumber: 15
                        }, this) : fulfillments.filter((f)=>f.status === 'preparing' || f.status === 'ready_for_dispatch').map((batch)=>{
                            const driver = driverAssignments[batch.id] || {
                                name: batch.driver_name || '',
                                phone: batch.driver_phone || '',
                                notes: batch.delivery_notes || ''
                            };
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 bg-[#fafafa] border border-gray-200 rounded-xl space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center border-b border-gray-200 pb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold text-sm text-[#1a1a1a] block",
                                                        children: batch.fulfillment_number
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                                        lineNumber: 597,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[11px] text-gray-500",
                                                        children: [
                                                            "Customer: ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: batch.customer_name
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                                lineNumber: 598,
                                                                columnNumber: 81
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                                        lineNumber: 598,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                lineNumber: 596,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full",
                                                children: "Preparing Batch"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                lineNumber: 600,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 595,
                                        columnNumber: 23
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "font-medium text-gray-600 block mb-1",
                                                        children: "Driver Name"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                                        lineNumber: 607,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "e.g. Ramesh Kumar",
                                                        value: driver.name,
                                                        onChange: (e)=>setDriverAssignments((prev)=>({
                                                                    ...prev,
                                                                    [batch.id]: {
                                                                        ...driver,
                                                                        name: e.target.value
                                                                    }
                                                                })),
                                                        className: "w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold text-[#1a1a1a] outline-none"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                                        lineNumber: 608,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                lineNumber: 606,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "font-medium text-gray-600 block mb-1",
                                                        children: "Driver Phone"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                                        lineNumber: 621,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "e.g. +91 9876543210",
                                                        value: driver.phone,
                                                        onChange: (e)=>setDriverAssignments((prev)=>({
                                                                    ...prev,
                                                                    [batch.id]: {
                                                                        ...driver,
                                                                        phone: e.target.value
                                                                    }
                                                                })),
                                                        className: "w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold text-[#1a1a1a] outline-none"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                                        lineNumber: 622,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                lineNumber: 620,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "font-medium text-gray-600 block mb-1",
                                                        children: "Delivery Notes"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                                        lineNumber: 635,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "e.g. Handle with care...",
                                                        value: driver.notes,
                                                        onChange: (e)=>setDriverAssignments((prev)=>({
                                                                    ...prev,
                                                                    [batch.id]: {
                                                                        ...driver,
                                                                        notes: e.target.value
                                                                    }
                                                                })),
                                                        className: "w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-medium text-[#1a1a1a] outline-none"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                                        lineNumber: 636,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                lineNumber: 634,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 605,
                                        columnNumber: 23
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center pt-2 border-t border-gray-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[11px] text-gray-500",
                                                children: [
                                                    "Items in batch: ",
                                                    batch.fulfillment_items?.length || 0,
                                                    " line items"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                lineNumber: 650,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                disabled: updatingDispatch === batch.id,
                                                onClick: ()=>handleMarkOutForDelivery(batch.id),
                                                className: "bg-emerald-600 hover:bg-emerald-700 text-white px-4 h-8 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors",
                                                children: [
                                                    updatingDispatch === batch.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                        size: 14,
                                                        className: "animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                                        lineNumber: 660,
                                                        columnNumber: 60
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                                        lineNumber: 660,
                                                        columnNumber: 109
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Mark Out for Delivery"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                                        lineNumber: 661,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                lineNumber: 654,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 649,
                                        columnNumber: 23
                                    }, this)
                                ]
                            }, batch.id, true, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 594,
                                columnNumber: 21
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/admin/app/dispatch/page.tsx",
                        lineNumber: 581,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/dispatch/page.tsx",
                lineNumber: 575,
                columnNumber: 9
            }, this),
            activeTab === 'active' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-4 animate-in fade-in duration-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-b border-gray-100 pb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-sm font-bold text-[#1a1a1a]",
                                children: "Active Vehicles & Delivery Confirmation"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 676,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-[#616161] mt-0.5",
                                children: "Track dispatched vehicles and execute delivery completion via RPC complete_fulfillment_delivery()."
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 677,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/dispatch/page.tsx",
                        lineNumber: 675,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: fulfillments.filter((f)=>f.status === 'out_for_delivery' || f.status === 'delivered').length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "py-8 text-center bg-[#f7f7f7] rounded-xl border border-gray-200",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-semibold text-[#1a1a1a]",
                                children: "No active deliveries found"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 683,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/admin/app/dispatch/page.tsx",
                            lineNumber: 682,
                            columnNumber: 15
                        }, this) : fulfillments.filter((f)=>f.status === 'out_for_delivery' || f.status === 'delivered').map((batch)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 bg-[#fafafa] border border-gray-200 rounded-xl space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center border-b border-gray-200 pb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold text-sm text-[#1a1a1a] block",
                                                        children: batch.fulfillment_number
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                                        lineNumber: 692,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[11px] text-gray-500",
                                                        children: [
                                                            "Customer: ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: batch.customer_name
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                                lineNumber: 694,
                                                                columnNumber: 37
                                                            }, this),
                                                            " • Driver: ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: batch.driver_name || 'N/A'
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                                lineNumber: 694,
                                                                columnNumber: 91
                                                            }, this),
                                                            " (",
                                                            batch.driver_phone || 'N/A',
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                                        lineNumber: 693,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                lineNumber: 691,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `text-[10px] font-bold px-2.5 py-0.5 rounded-full ${batch.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`,
                                                children: batch.status === 'delivered' ? 'Completed & Delivered' : 'Out for Delivery'
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                lineNumber: 698,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 690,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center pt-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[11px] text-gray-500",
                                                children: [
                                                    "Dispatched: ",
                                                    new Date(batch.created_at).toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                lineNumber: 706,
                                                columnNumber: 23
                                            }, this),
                                            batch.status === 'out_for_delivery' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        disabled: updatingDispatch === batch.id,
                                                        onClick: ()=>handleCancelBatch(batch.id),
                                                        className: "bg-white border border-gray-200 hover:bg-rose-50 text-rose-600 px-3 h-8 rounded-lg text-xs font-semibold transition-colors",
                                                        children: "Cancel Batch"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                                        lineNumber: 712,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        disabled: updatingDispatch === batch.id,
                                                        onClick: ()=>handleCompleteDelivery(batch.id),
                                                        className: "bg-[#303030] hover:bg-[#1a1a1a] text-white px-4 h-8 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-xs",
                                                        children: [
                                                            updatingDispatch === batch.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                size: 14,
                                                                className: "animate-spin"
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                                lineNumber: 726,
                                                                columnNumber: 62
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                                size: 14
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                                lineNumber: 726,
                                                                columnNumber: 111
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Confirm Delivery (RPC)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                                lineNumber: 727,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                                        lineNumber: 720,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                                lineNumber: 711,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 705,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, batch.id, true, {
                                fileName: "[project]/admin/app/dispatch/page.tsx",
                                lineNumber: 689,
                                columnNumber: 19
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/admin/app/dispatch/page.tsx",
                        lineNumber: 680,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/dispatch/page.tsx",
                lineNumber: 674,
                columnNumber: 9
            }, this),
            timelineUser && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl text-xs animate-in zoom-in-95 duration-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center border-b border-gray-100 pb-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-bold text-sm text-[#1a1a1a]",
                                    children: "Customer Order & Delivery Timeline"
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/dispatch/page.tsx",
                                    lineNumber: 744,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setTimelineUser(null),
                                    className: "text-gray-400 hover:text-gray-600",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/dispatch/page.tsx",
                                        lineNumber: 746,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/dispatch/page.tsx",
                                    lineNumber: 745,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/admin/app/dispatch/page.tsx",
                            lineNumber: 743,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-bold text-[#1a1a1a]",
                                    children: timelineUser.name
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/dispatch/page.tsx",
                                    lineNumber: 751,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border-l-2 border-[#303030] pl-3 space-y-3 text-[11px]",
                                    children: pendingItems.filter((i)=>i.user_id === timelineUser.id).map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-0.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-bold text-[#1a1a1a]",
                                                    children: [
                                                        "Order #",
                                                        i.order_number,
                                                        " • ",
                                                        i.product_name
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/admin/app/dispatch/page.tsx",
                                                    lineNumber: 757,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "block text-gray-500",
                                                    children: [
                                                        "Ordered: ",
                                                        i.quantity_ordered,
                                                        " | Delivered: ",
                                                        i.quantity_fulfilled,
                                                        " | Remaining: ",
                                                        i.quantity_remaining
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/admin/app/dispatch/page.tsx",
                                                    lineNumber: 758,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, i.id, true, {
                                            fileName: "[project]/admin/app/dispatch/page.tsx",
                                            lineNumber: 756,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/dispatch/page.tsx",
                                    lineNumber: 752,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/admin/app/dispatch/page.tsx",
                            lineNumber: 750,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/admin/app/dispatch/page.tsx",
                    lineNumber: 742,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/admin/app/dispatch/page.tsx",
                lineNumber: 741,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/admin/app/dispatch/page.tsx",
        lineNumber: 264,
        columnNumber: 5
    }, this);
}
_s(DeliveryDispatchPage, "TtKUXjfoUgFoPIoi8TZp/E15l+4=");
_c = DeliveryDispatchPage;
var _c;
__turbopack_context__.k.register(_c, "DeliveryDispatchPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/admin/features/fulfillments/repositories/fulfillments.repository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "allocateItemToBatch",
    ()=>allocateItemToBatch,
    "cancelFulfillmentBatchRpc",
    ()=>cancelFulfillmentBatchRpc,
    "completeFulfillmentDeliveryRpc",
    ()=>completeFulfillmentDeliveryRpc,
    "createFulfillmentBatchRecord",
    ()=>createFulfillmentBatchRecord,
    "fetchFulfillmentBatches",
    ()=>fetchFulfillmentBatches,
    "fetchPendingOrderItems",
    ()=>fetchPendingOrderItems,
    "updateFulfillmentDriverInfo",
    ()=>updateFulfillmentDriverInfo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/lib/supabase.ts [app-client] (ecmascript)");
;
async function fetchPendingOrderItems() {
    const { data: orderItems, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('order_items').select('*, orders(id, order_number, user_id, user_name, status, created_at)').order('created_at', {
        ascending: false
    });
    if (error) {
        console.error('Error fetching pending order items:', error);
        return [];
    }
    const result = [];
    (orderItems || []).forEach((item)=>{
        const qOrdered = Number(item.quantity || 0);
        const qFulfilled = Number(item.quantity_fulfilled || 0);
        const qCancelled = Number(item.quantity_cancelled || 0);
        const qHold = Number(item.quantity_on_hold || 0);
        const qRemaining = Math.max(0, qOrdered - qFulfilled - qCancelled);
        if (qRemaining > 0 || qHold > 0) {
            result.push({
                id: item.id,
                order_id: item.order_id,
                order_number: item.orders?.order_number,
                user_id: item.orders?.user_id,
                customer_name: item.orders?.user_name || 'Customer',
                product_name: item.product_name,
                quantity_ordered: qOrdered,
                quantity_fulfilled: qFulfilled,
                quantity_cancelled: qCancelled,
                quantity_on_hold: qHold,
                quantity_remaining: qRemaining,
                hold_reason: item.hold_reason,
                created_at: item.created_at
            });
        }
    });
    return result;
}
async function fetchFulfillmentBatches() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('fulfillments').select('*, fulfillment_items(*, order_items(*, orders(order_number, user_name)))').order('created_at', {
        ascending: false
    });
    if (error) {
        console.error('Error fetching fulfillments:', error);
        return [];
    }
    return (data || []).map((f)=>({
            ...f,
            customer_name: f.fulfillment_items?.[0]?.order_items?.orders?.user_name || 'Customer'
        }));
}
async function createFulfillmentBatchRecord(input) {
    const fulNumber = `DEL-${Date.now().toString().slice(-6)}`;
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('fulfillments').insert({
        fulfillment_number: fulNumber,
        user_id: input.userId,
        status: 'preparing',
        delivery_address_snapshot: input.addressSnapshot || {},
        delivery_notes: input.notes || ''
    }).select('*').single();
    if (error) throw error;
    return data;
}
async function allocateItemToBatch(input) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('allocate_fulfillment_item', {
        p_fulfillment_id: input.fulfillmentId,
        p_order_item_id: input.orderItemId,
        p_quantity: input.quantity,
        p_hold_reason: input.holdReason || null
    });
    if (error) throw error;
    if (data && data.success === false) {
        throw new Error(data.message || 'Allocation failed');
    }
}
async function updateFulfillmentDriverInfo(input) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('fulfillments').update({
        status: input.status,
        driver_name: input.driverName,
        driver_phone: input.driverPhone,
        delivery_notes: input.notes,
        updated_at: new Date().toISOString()
    }).eq('id', input.fulfillmentId);
    if (error) throw error;
}
async function completeFulfillmentDeliveryRpc(fulfillmentId) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('complete_fulfillment_delivery', {
        p_fulfillment_id: fulfillmentId
    });
    if (error) throw error;
    if (data && data.success === false) {
        throw new Error(data.message || 'Delivery completion failed');
    }
}
async function cancelFulfillmentBatchRpc(fulfillmentId, reason) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('cancel_fulfillment_batch', {
        p_fulfillment_id: fulfillmentId,
        p_reason: reason
    });
    if (error) throw error;
    if (data && data.success === false) {
        throw new Error(data.message || 'Batch cancellation failed');
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/admin/features/staff/repositories/audit-logs.repository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "logAdminAction",
    ()=>logAdminAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/lib/supabase.ts [app-client] (ecmascript)");
;
async function logAdminAction(input) {
    try {
        const { data: sessionData } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
        const adminId = sessionData?.session?.user?.id || null;
        await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('admin_audit_logs').insert({
            admin_id: adminId,
            action: input.action,
            entity_type: input.entityType,
            entity_id: input.entityId,
            details: input.details || {},
            created_at: new Date().toISOString()
        });
    } catch (err) {
        console.warn('Error recording admin audit log:', err);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);})()

//# sourceMappingURL=admin_0d9m67frt2-9v._.js.map