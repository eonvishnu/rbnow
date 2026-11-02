(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/admin/app/batches/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BatchesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$context$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/context/AuthProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarClock$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/calendar-clock.js [app-client] (ecmascript) <export default as CalendarClock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/clipboard-list.js [app-client] (ecmascript) <export default as ClipboardList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const PHASE_TONE = {
    scheduled: 'bg-[#e3e3e3] text-[#303030]',
    open: 'bg-[#cdfed4] text-[#014b40]',
    closed: 'bg-[#ffd6a4] text-[#5e4200]',
    completed: 'bg-[#a4e8f2] text-[#00424d]',
    cancelled: 'bg-[#fed1d7] text-[#8e0b21]'
};
const PHASE_LABEL = {
    scheduled: 'Scheduled',
    open: 'Accepting orders',
    closed: 'Ordering closed',
    completed: 'Completed',
    cancelled: 'Cancelled'
};
const formatCurrency = (n)=>new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(Number(n) || 0);
const fmtDateTime = (iso)=>new Date(iso).toLocaleString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
// 'YYYY-MM-DD' -> readable, without timezone shifting the day
const fmtDay = (d)=>new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
const pad = (n)=>String(n).padStart(2, '0');
const toDateInput = (d)=>`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toLocalInput = (iso)=>{
    const d = new Date(iso);
    return `${toDateInput(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const atTime = (base, dayOffset, h, m = 0)=>{
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + dayOffset, h, m);
    return d;
};
const phaseOf = (b)=>{
    if (b.status === 'cancelled') return 'cancelled';
    if (b.status === 'completed') return 'completed';
    const now = Date.now();
    if (now < new Date(b.orders_open_at).getTime()) return 'scheduled';
    if (b.closed_early || now > new Date(b.orders_close_at).getTime()) return 'closed';
    return 'open';
};
const esc = (v)=>String(v ?? '').replace(/[&<>"']/g, (c)=>({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[c]);
const inputCls = 'w-full min-h-11 sm:min-h-9 py-2 px-3 text-base sm:text-[13px] text-[#1a1a1a] placeholder:text-[#8a8a8a] bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.2)] outline-none focus:shadow-[0_0_0_2px_#005bd3] transition-shadow';
const emptyForm = ()=>{
    const now = new Date();
    return {
        id: '',
        name: '',
        nameEdited: false,
        opens: toLocalInput(atTime(now, 0, 18)),
        closes: toLocalInput(atTime(now, 1, 8)),
        delivery: toDateInput(atTime(now, 1, 0)),
        notes: ''
    };
};
function BatchesPage() {
    _s();
    const { userData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$context$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const canEdit = [
        'super_admin',
        'admin',
        'operations_staff'
    ].includes(userData?.role || '');
    const [batches, setBatches] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [setupNeeded, setSetupNeeded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('active');
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [formError, setFormError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [busyId, setBusyId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pickBatch, setPickBatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [, setTick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [toast, setToast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const flash = (type, text)=>{
        setToast({
            type,
            text
        });
        setTimeout(()=>setToast(null), 3500);
    };
    const load = async ()=>{
        const { data: bData, error: bErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('order_batches').select('*').order('delivery_date', {
            ascending: false
        }).limit(60);
        if (bErr) {
            if (bErr.code === '42P01' || /order_batches/i.test(bErr.message || '')) setSetupNeeded(true);
            else flash('error', 'Could not load batches.');
            setLoading(false);
            return;
        }
        setBatches(bData || []);
        const ids = (bData || []).map((b)=>b.id);
        if (ids.length) {
            const { data: oData } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('orders').select('id, batch_id, status, total, order_items(product_name, variant_unit, quantity, fulfillment_status, promised_date)').in('batch_id', ids);
            setOrders(oData || []);
        } else {
            setOrders([]);
        }
        setLoading(false);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BatchesPage.useEffect": ()=>{
            load();
            const t = setInterval({
                "BatchesPage.useEffect.t": ()=>setTick({
                        "BatchesPage.useEffect.t": (n)=>n + 1
                    }["BatchesPage.useEffect.t"])
            }["BatchesPage.useEffect.t"], 30000); // keep Open / Closed labels fresh
            return ({
                "BatchesPage.useEffect": ()=>clearInterval(t)
            })["BatchesPage.useEffect"];
        }
    }["BatchesPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BatchesPage.useEffect": ()=>{
            const onKey = {
                "BatchesPage.useEffect.onKey": (e)=>{
                    if (e.key === 'Escape' && !saving) {
                        setForm(null);
                        setPickBatch(null);
                    }
                }
            }["BatchesPage.useEffect.onKey"];
            window.addEventListener('keydown', onKey);
            return ({
                "BatchesPage.useEffect": ()=>window.removeEventListener('keydown', onKey)
            })["BatchesPage.useEffect"];
        }
    }["BatchesPage.useEffect"], [
        saving
    ]);
    // ---------- per-batch numbers ----------
    const statsByBatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BatchesPage.useMemo[statsByBatch]": ()=>{
            const map = {};
            batches.forEach({
                "BatchesPage.useMemo[statsByBatch]": (b)=>map[b.id] = {
                        orders: 0,
                        revenue: 0,
                        items: 0,
                        delivered: 0,
                        late: 0,
                        unavailable: 0
                    }
            }["BatchesPage.useMemo[statsByBatch]"]);
            orders.forEach({
                "BatchesPage.useMemo[statsByBatch]": (o)=>{
                    const s = map[o.batch_id];
                    if (!s || o.status === 'cancelled') return;
                    const b = batches.find({
                        "BatchesPage.useMemo[statsByBatch].b": (x)=>x.id === o.batch_id
                    }["BatchesPage.useMemo[statsByBatch].b"]);
                    s.orders += 1;
                    s.revenue += Number(o.total) || 0;
                    (o.order_items || []).forEach({
                        "BatchesPage.useMemo[statsByBatch]": (i)=>{
                            if (i.fulfillment_status === 'unavailable') {
                                s.unavailable += 1;
                                return;
                            }
                            s.items += 1;
                            if (i.fulfillment_status === 'delivered') s.delivered += 1;
                            if (i.promised_date && b && i.promised_date > b.delivery_date) s.late += 1;
                        }
                    }["BatchesPage.useMemo[statsByBatch]"]);
                }
            }["BatchesPage.useMemo[statsByBatch]"]);
            return map;
        }
    }["BatchesPage.useMemo[statsByBatch]"], [
        batches,
        orders
    ]);
    const openBatch = batches.find((b)=>phaseOf(b) === 'open');
    const shownBatches = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BatchesPage.useMemo[shownBatches]": ()=>{
            const list = batches.filter({
                "BatchesPage.useMemo[shownBatches].list": (b)=>{
                    const p = phaseOf(b);
                    return tab === 'active' ? [
                        'scheduled',
                        'open',
                        'closed'
                    ].includes(p) : tab === 'completed' ? p === 'completed' : p === 'cancelled';
                }
            }["BatchesPage.useMemo[shownBatches].list"]);
            return tab === 'active' ? [
                ...list
            ].sort({
                "BatchesPage.useMemo[shownBatches]": (a, b)=>a.delivery_date.localeCompare(b.delivery_date)
            }["BatchesPage.useMemo[shownBatches]"]) : list;
        }
    }["BatchesPage.useMemo[shownBatches]"], [
        batches,
        tab
    ]);
    const tabCount = (t)=>batches.filter((b)=>{
            const p = phaseOf(b);
            return t === 'active' ? [
                'scheduled',
                'open',
                'closed'
            ].includes(p) : t === 'completed' ? p === 'completed' : p === 'cancelled';
        }).length;
    // ---------- create / edit ----------
    const suggestName = (delivery)=>delivery ? `Delivery ${new Date(`${delivery}T00:00:00`).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short'
        })}` : '';
    const openCreate = ()=>{
        const f = emptyForm();
        f.name = suggestName(f.delivery);
        setFormError('');
        setForm(f);
    };
    const openEdit = (b)=>{
        setFormError('');
        setForm({
            id: b.id,
            name: b.name,
            nameEdited: true,
            opens: toLocalInput(b.orders_open_at),
            closes: toLocalInput(b.orders_close_at),
            delivery: b.delivery_date,
            notes: b.notes || ''
        });
    };
    const applyPreset = (kind)=>{
        const now = new Date();
        setForm((f)=>{
            if (!f) return f;
            const delivery = toDateInput(atTime(now, kind === 'morning' ? 1 : 2, 0));
            return {
                ...f,
                opens: toLocalInput(atTime(now, 0, 18)),
                closes: toLocalInput(kind === 'morning' ? atTime(now, 1, 8) : atTime(now, 1, 18)),
                delivery,
                name: f.nameEdited ? f.name : suggestName(delivery)
            };
        });
    };
    const saveForm = async (e)=>{
        e.preventDefault();
        if (!form) return;
        setFormError('');
        if (!form.name.trim()) return setFormError('Give the batch a name.');
        if (!form.opens || !form.closes || !form.delivery) return setFormError('Fill in all dates.');
        const opens = new Date(form.opens);
        const closes = new Date(form.closes);
        if (closes <= opens) return setFormError('Ordering must close after it opens.');
        if (form.delivery < toDateInput(closes)) return setFormError('Delivery date cannot be before ordering closes.');
        setSaving(true);
        try {
            const row = {
                name: form.name.trim(),
                orders_open_at: opens.toISOString(),
                orders_close_at: closes.toISOString(),
                delivery_date: form.delivery,
                notes: form.notes.trim() || null
            };
            if (form.id) {
                const prev = batches.find((b)=>b.id === form.id);
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('order_batches').update(row).eq('id', form.id);
                if (error) throw error;
                if (prev && prev.delivery_date !== form.delivery) {
                    // orders in this batch follow the new delivery date (items with their own promised date keep it)
                    const { error: oErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('orders').update({
                        delivery_date: form.delivery
                    }).eq('batch_id', form.id);
                    if (oErr) throw oErr;
                }
                flash('success', 'Batch updated');
            } else {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('order_batches').insert(row);
                if (error) throw error;
                flash('success', 'Batch created');
            }
            setForm(null);
            await load();
        } catch (err) {
            console.error(err);
            setFormError(err?.message || 'Could not save the batch.');
        } finally{
            setSaving(false);
        }
    };
    // ---------- batch actions ----------
    const patchBatch = async (b, patch, okText)=>{
        setBusyId(b.id);
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('order_batches').update(patch).eq('id', b.id);
        setBusyId(null);
        if (error) return flash('error', 'Could not update the batch.');
        setBatches((prev)=>prev.map((x)=>x.id === b.id ? {
                    ...x,
                    ...patch
                } : x));
        flash('success', okText);
    };
    const closeOrdering = (b)=>{
        if (!confirm(`Close ordering for "${b.name}" now? New orders will no longer join this batch.`)) return;
        patchBatch(b, {
            closed_early: true
        }, 'Ordering closed');
    };
    const reopenOrdering = (b)=>patchBatch(b, {
            closed_early: false
        }, 'Ordering reopened');
    const completeBatch = (b)=>{
        const s = statsByBatch[b.id];
        const open = s ? s.items - s.delivered : 0;
        const msg = open > 0 ? `${open} item${open > 1 ? 's are' : ' is'} not delivered yet. Mark "${b.name}" completed anyway?` : `Mark "${b.name}" as completed?`;
        if (!confirm(msg)) return;
        patchBatch(b, {
            status: 'completed'
        }, 'Batch completed');
    };
    const cancelBatch = (b)=>{
        if (!confirm(`Cancel "${b.name}"? Its orders stay as they are.`)) return;
        patchBatch(b, {
            status: 'cancelled'
        }, 'Batch cancelled');
    };
    const deleteBatch = async (b)=>{
        if ((statsByBatch[b.id]?.orders || 0) > 0) return flash('error', 'This batch has orders. Cancel it instead.');
        if (!confirm(`Delete "${b.name}"?`)) return;
        setBusyId(b.id);
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('order_batches').delete().eq('id', b.id);
        setBusyId(null);
        if (error) return flash('error', 'Could not delete the batch.');
        setBatches((prev)=>prev.filter((x)=>x.id !== b.id));
        flash('success', 'Batch deleted');
    };
    // ---------- pick list ----------
    const pickList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BatchesPage.useMemo[pickList]": ()=>{
            if (!pickBatch) return [];
            const map = new Map();
            orders.filter({
                "BatchesPage.useMemo[pickList]": (o)=>o.batch_id === pickBatch.id && o.status !== 'cancelled'
            }["BatchesPage.useMemo[pickList]"]).forEach({
                "BatchesPage.useMemo[pickList]": (o)=>{
                    (o.order_items || []).forEach({
                        "BatchesPage.useMemo[pickList]": (i)=>{
                            if (i.fulfillment_status === 'delivered' || i.fulfillment_status === 'unavailable') return;
                            // items pushed to a later date are not part of this batch's packing run
                            if (i.promised_date && i.promised_date > pickBatch.delivery_date) return;
                            const key = `${i.product_name}__${i.variant_unit}`;
                            const cur = map.get(key) || {
                                name: i.product_name,
                                unit: i.variant_unit,
                                qty: 0,
                                orders: 0
                            };
                            cur.qty += Number(i.quantity) || 0;
                            cur.orders += 1;
                            map.set(key, cur);
                        }
                    }["BatchesPage.useMemo[pickList]"]);
                }
            }["BatchesPage.useMemo[pickList]"]);
            return Array.from(map.values()).sort({
                "BatchesPage.useMemo[pickList]": (a, b)=>a.name.localeCompare(b.name)
            }["BatchesPage.useMemo[pickList]"]);
        }
    }["BatchesPage.useMemo[pickList]"], [
        pickBatch,
        orders
    ]);
    const copyPickList = async ()=>{
        const text = `${pickBatch.name} — ${fmtDay(pickBatch.delivery_date)}\n` + pickList.map((p)=>`${p.name} (${p.unit}) × ${p.qty}`).join('\n');
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(()=>setCopied(false), 1800);
        } catch  {
            flash('error', 'Could not copy.');
        }
    };
    const printPickList = ()=>{
        const w = window.open('', '_blank', 'width=800,height=900');
        if (!w) return flash('error', 'Allow pop-ups to print.');
        w.document.write(`<!doctype html><html><head><title>Pick list</title>
      <style>body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#303030;padding:32px;max-width:720px;margin:auto}
      h1{font-size:20px;margin:0}small{color:#616161}table{width:100%;border-collapse:collapse;margin-top:16px}
      th,td{text-align:left;padding:8px 0;border-bottom:1px solid #e3e3e3;font-size:14px}th{color:#616161;font-weight:500}
      td.r,th.r{text-align:right}</style></head><body>
      <h1>Pick list — ${esc(pickBatch.name)}</h1><small>Delivery ${esc(fmtDay(pickBatch.delivery_date))}</small>
      <table><thead><tr><th>Product</th><th>Unit</th><th class="r">Qty</th><th class="r">Orders</th></tr></thead><tbody>
      ${pickList.map((p)=>`<tr><td>${esc(p.name)}</td><td>${esc(p.unit)}</td><td class="r"><strong>${esc(p.qty)}</strong></td><td class="r">${esc(p.orders)}</td></tr>`).join('')}
      </tbody></table><script>window.onload=function(){window.print()}</script></body></html>`);
        w.document.close();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-769aa10d7aa48d61" + " " + "space-y-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-769aa10d7aa48d61" + " " + "flex items-center justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-769aa10d7aa48d61",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "jsx-769aa10d7aa48d61" + " " + "text-xl font-semibold text-[#1a1a1a]",
                                children: "Batches"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/batches/page.tsx",
                                lineNumber: 348,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-769aa10d7aa48d61" + " " + "text-sm sm:text-[13px] text-[#616161] mt-0.5",
                                children: "Each batch is an ordering window with one delivery date."
                            }, void 0, false, {
                                fileName: "[project]/admin/app/batches/page.tsx",
                                lineNumber: 349,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/batches/page.tsx",
                        lineNumber: 347,
                        columnNumber: 9
                    }, this),
                    canEdit && !setupNeeded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: openCreate,
                        className: "jsx-769aa10d7aa48d61" + " " + "min-h-10 sm:min-h-8 px-3 inline-flex items-center gap-1.5 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-sm sm:text-[13px] font-medium text-white shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                size: 15
                            }, void 0, false, {
                                fileName: "[project]/admin/app/batches/page.tsx",
                                lineNumber: 353,
                                columnNumber: 13
                            }, this),
                            " Create batch"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/batches/page.tsx",
                        lineNumber: 352,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/batches/page.tsx",
                lineNumber: 346,
                columnNumber: 7
            }, this),
            setupNeeded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                className: "p-4 border-l-4 !border-l-[#ffd6a4]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-769aa10d7aa48d61" + " " + "flex gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                            size: 18,
                            className: "text-[#5e4200] shrink-0 mt-0.5"
                        }, void 0, false, {
                            fileName: "[project]/admin/app/batches/page.tsx",
                            lineNumber: 362,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-769aa10d7aa48d61" + " " + "text-sm sm:text-[13px] space-y-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "jsx-769aa10d7aa48d61" + " " + "font-semibold text-[#1a1a1a]",
                                    children: "One-time database setup needed"
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/batches/page.tsx",
                                    lineNumber: 364,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "jsx-769aa10d7aa48d61" + " " + "text-[#616161]",
                                    children: [
                                        "Run the file ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                            className: "jsx-769aa10d7aa48d61" + " " + "bg-[#f7f7f7] px-1.5 py-0.5 rounded",
                                            children: "001_order_batches.sql"
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/batches/page.tsx",
                                            lineNumber: 365,
                                            columnNumber: 58
                                        }, this),
                                        " in the Supabase SQL editor, then refresh this page."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/admin/app/batches/page.tsx",
                                    lineNumber: 365,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/admin/app/batches/page.tsx",
                            lineNumber: 363,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/admin/app/batches/page.tsx",
                    lineNumber: 361,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/admin/app/batches/page.tsx",
                lineNumber: 360,
                columnNumber: 9
            }, this),
            !setupNeeded && !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                className: "p-4 flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "jsx-769aa10d7aa48d61" + " " + `w-2.5 h-2.5 rounded-full shrink-0 ${openBatch ? 'bg-emerald-500' : 'bg-[#c9c9c9]'}`
                    }, void 0, false, {
                        fileName: "[project]/admin/app/batches/page.tsx",
                        lineNumber: 374,
                        columnNumber: 11
                    }, this),
                    openBatch ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "jsx-769aa10d7aa48d61" + " " + "text-sm sm:text-[13px] text-[#303030]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-769aa10d7aa48d61" + " " + "font-semibold text-[#1a1a1a]",
                                children: openBatch.name
                            }, void 0, false, {
                                fileName: "[project]/admin/app/batches/page.tsx",
                                lineNumber: 377,
                                columnNumber: 15
                            }, this),
                            " is accepting orders until ",
                            fmtDateTime(openBatch.orders_close_at),
                            ". Delivery on ",
                            fmtDay(openBatch.delivery_date),
                            "."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/batches/page.tsx",
                        lineNumber: 376,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "jsx-769aa10d7aa48d61" + " " + "text-sm sm:text-[13px] text-[#616161]",
                        children: "No batch is accepting orders right now. New orders won't get a delivery date until one opens."
                    }, void 0, false, {
                        fileName: "[project]/admin/app/batches/page.tsx",
                        lineNumber: 380,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/batches/page.tsx",
                lineNumber: 373,
                columnNumber: 9
            }, this),
            !setupNeeded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-769aa10d7aa48d61" + " " + "flex gap-1 overflow-x-auto no-scrollbar",
                children: [
                    [
                        'active',
                        'Active'
                    ],
                    [
                        'completed',
                        'Completed'
                    ],
                    [
                        'cancelled',
                        'Cancelled'
                    ]
                ].map(([id, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setTab(id),
                        className: "jsx-769aa10d7aa48d61" + " " + `min-h-9 py-1.5 px-3 rounded-lg text-sm sm:text-[13px] whitespace-nowrap transition-colors ${tab === id ? 'bg-[#303030] text-white font-medium' : 'text-[#303030] hover:bg-black/5'}`,
                        children: [
                            label,
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-769aa10d7aa48d61" + " " + ((tab === id ? 'text-white/70' : 'text-[#8a8a8a]') || ""),
                                children: tabCount(id)
                            }, void 0, false, {
                                fileName: "[project]/admin/app/batches/page.tsx",
                                lineNumber: 390,
                                columnNumber: 23
                            }, this)
                        ]
                    }, id, true, {
                        fileName: "[project]/admin/app/batches/page.tsx",
                        lineNumber: 389,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/admin/app/batches/page.tsx",
                lineNumber: 387,
                columnNumber: 9
            }, this),
            !setupNeeded && (loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-769aa10d7aa48d61" + " " + "grid grid-cols-1 lg:grid-cols-2 gap-4",
                children: Array.from({
                    length: 2
                }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-769aa10d7aa48d61" + " " + "h-56 bg-white rounded-xl animate-pulse shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
                    }, i, false, {
                        fileName: "[project]/admin/app/batches/page.tsx",
                        lineNumber: 399,
                        columnNumber: 52
                    }, this))
            }, void 0, false, {
                fileName: "[project]/admin/app/batches/page.tsx",
                lineNumber: 398,
                columnNumber: 9
            }, this) : shownBatches.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                className: "py-14 px-6 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarClock$3e$__["CalendarClock"], {
                        size: 28,
                        className: "mx-auto text-[#8a8a8a]"
                    }, void 0, false, {
                        fileName: "[project]/admin/app/batches/page.tsx",
                        lineNumber: 403,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "jsx-769aa10d7aa48d61" + " " + "mt-3 text-sm sm:text-[13px] text-[#616161]",
                        children: tab === 'active' ? 'No active batches. Create one to start taking orders for a delivery day.' : 'Nothing here yet.'
                    }, void 0, false, {
                        fileName: "[project]/admin/app/batches/page.tsx",
                        lineNumber: 404,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/batches/page.tsx",
                lineNumber: 402,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-769aa10d7aa48d61" + " " + "grid grid-cols-1 lg:grid-cols-2 gap-4",
                children: shownBatches.map((b)=>{
                    const phase = phaseOf(b);
                    const s = statsByBatch[b.id] || {
                        orders: 0,
                        revenue: 0,
                        items: 0,
                        delivered: 0,
                        late: 0,
                        unavailable: 0
                    };
                    const pct = s.items ? Math.round(s.delivered / s.items * 100) : 0;
                    const live = phase === 'scheduled' || phase === 'open' || phase === 'closed';
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                        className: "p-4 sm:p-5 space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-769aa10d7aa48d61" + " " + "flex items-start justify-between gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-769aa10d7aa48d61" + " " + "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "jsx-769aa10d7aa48d61" + " " + "text-base font-semibold text-[#1a1a1a] truncate",
                                                children: b.name
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 419,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-769aa10d7aa48d61" + " " + "text-sm sm:text-[13px] text-[#616161] mt-0.5",
                                                children: [
                                                    "Delivery · ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-769aa10d7aa48d61" + " " + "text-[#1a1a1a] font-medium",
                                                        children: fmtDay(b.delivery_date)
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/batches/page.tsx",
                                                        lineNumber: 420,
                                                        columnNumber: 92
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 420,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 418,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pill, {
                                        tone: PHASE_TONE[phase],
                                        children: PHASE_LABEL[phase]
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 422,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/batches/page.tsx",
                                lineNumber: 417,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-769aa10d7aa48d61" + " " + "rounded-lg bg-[#f7f7f7] px-3 py-2.5 text-sm sm:text-[13px] text-[#303030] flex items-center gap-2 flex-wrap",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-769aa10d7aa48d61",
                                        children: fmtDateTime(b.orders_open_at)
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 426,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                        size: 13,
                                        className: "text-[#8a8a8a]"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 427,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-769aa10d7aa48d61",
                                        children: b.closed_early ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "jsx-769aa10d7aa48d61",
                                            children: "Closed early"
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/batches/page.tsx",
                                            lineNumber: 428,
                                            columnNumber: 43
                                        }, this) : fmtDateTime(b.orders_close_at)
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 428,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/batches/page.tsx",
                                lineNumber: 425,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-769aa10d7aa48d61" + " " + "grid grid-cols-3 divide-x divide-gray-200/80 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stat, {
                                        label: "Orders",
                                        value: String(s.orders)
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 432,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stat, {
                                        label: "Revenue",
                                        value: formatCurrency(s.revenue)
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 433,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stat, {
                                        label: "Items",
                                        value: String(s.items)
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 434,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/batches/page.tsx",
                                lineNumber: 431,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-769aa10d7aa48d61",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-769aa10d7aa48d61" + " " + "flex justify-between text-xs text-[#616161] mb-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-769aa10d7aa48d61",
                                                children: [
                                                    s.delivered,
                                                    " of ",
                                                    s.items,
                                                    " items delivered"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 439,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-769aa10d7aa48d61",
                                                children: [
                                                    pct,
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 440,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 438,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-769aa10d7aa48d61" + " " + "h-1.5 bg-gray-100 rounded-full overflow-hidden",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: `${pct}%`
                                            },
                                            className: "jsx-769aa10d7aa48d61" + " " + "h-full bg-[#303030] rounded-full"
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/batches/page.tsx",
                                            lineNumber: 442,
                                            columnNumber: 83
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 442,
                                        columnNumber: 19
                                    }, this),
                                    (s.late > 0 || s.unavailable > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-769aa10d7aa48d61" + " " + "flex gap-1.5 mt-2 flex-wrap",
                                        children: [
                                            s.late > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pill, {
                                                tone: "bg-[#ffd6a4] text-[#5e4200]",
                                                children: [
                                                    s.late,
                                                    " late item",
                                                    s.late > 1 ? 's' : ''
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 445,
                                                columnNumber: 38
                                            }, this),
                                            s.unavailable > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pill, {
                                                tone: "bg-[#fed1d7] text-[#8e0b21]",
                                                children: [
                                                    s.unavailable,
                                                    " unavailable"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 446,
                                                columnNumber: 45
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 444,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/batches/page.tsx",
                                lineNumber: 437,
                                columnNumber: 17
                            }, this),
                            b.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-769aa10d7aa48d61" + " " + "text-sm sm:text-[13px] text-[#616161]",
                                children: b.notes
                            }, void 0, false, {
                                fileName: "[project]/admin/app/batches/page.tsx",
                                lineNumber: 451,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-769aa10d7aa48d61" + " " + "flex flex-wrap items-center gap-2 pt-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setPickBatch(b),
                                        className: "jsx-769aa10d7aa48d61" + " " + "btn-secondary",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"], {
                                                size: 14
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 454,
                                                columnNumber: 85
                                            }, this),
                                            " Pick list"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 454,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/orders?batch=${b.id}`,
                                        className: "btn-secondary",
                                        children: "View orders"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 455,
                                        columnNumber: 19
                                    }, this),
                                    canEdit && live && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            phase === 'open' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                disabled: busyId === b.id,
                                                onClick: ()=>closeOrdering(b),
                                                className: "jsx-769aa10d7aa48d61" + " " + "btn-secondary",
                                                children: "Close ordering"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 458,
                                                columnNumber: 44
                                            }, this),
                                            b.closed_early && new Date(b.orders_close_at).getTime() > Date.now() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                disabled: busyId === b.id,
                                                onClick: ()=>reopenOrdering(b),
                                                className: "jsx-769aa10d7aa48d61" + " " + "btn-secondary",
                                                children: "Reopen"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 459,
                                                columnNumber: 96
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>openEdit(b),
                                                className: "jsx-769aa10d7aa48d61" + " " + "btn-secondary",
                                                children: "Edit"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 460,
                                                columnNumber: 23
                                            }, this),
                                            phase !== 'scheduled' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                disabled: busyId === b.id,
                                                onClick: ()=>completeBatch(b),
                                                className: "jsx-769aa10d7aa48d61" + " " + "btn-primary",
                                                children: "Mark completed"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 461,
                                                columnNumber: 49
                                            }, this),
                                            phase === 'scheduled' && s.orders === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                disabled: busyId === b.id,
                                                onClick: ()=>deleteBatch(b),
                                                className: "jsx-769aa10d7aa48d61" + " " + "text-sm sm:text-[13px] font-medium text-[#8e0b21] px-2 min-h-9 hover:underline",
                                                children: "Delete"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 462,
                                                columnNumber: 67
                                            }, this),
                                            phase !== 'scheduled' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                disabled: busyId === b.id,
                                                onClick: ()=>cancelBatch(b),
                                                className: "jsx-769aa10d7aa48d61" + " " + "text-sm sm:text-[13px] font-medium text-[#8e0b21] px-2 min-h-9 hover:underline",
                                                children: "Cancel batch"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 463,
                                                columnNumber: 49
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 457,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/batches/page.tsx",
                                lineNumber: 453,
                                columnNumber: 17
                            }, this)
                        ]
                    }, b.id, true, {
                        fileName: "[project]/admin/app/batches/page.tsx",
                        lineNumber: 416,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/admin/app/batches/page.tsx",
                lineNumber: 409,
                columnNumber: 9
            }, this)),
            form && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-769aa10d7aa48d61" + " " + "relative z-[100]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: ()=>!saving && setForm(null),
                        className: "jsx-769aa10d7aa48d61" + " " + "fixed inset-0 bg-black/40"
                    }, void 0, false, {
                        fileName: "[project]/admin/app/batches/page.tsx",
                        lineNumber: 476,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "jsx-769aa10d7aa48d61" + " " + "fixed inset-y-0 right-0 w-full max-w-md bg-[#f1f1f1] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-769aa10d7aa48d61" + " " + "h-14 px-4 sm:px-5 bg-white border-b border-gray-200 flex items-center justify-between shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-769aa10d7aa48d61" + " " + "text-sm font-semibold text-[#1a1a1a]",
                                        children: form.id ? 'Edit batch' : 'Create batch'
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 479,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setForm(null),
                                        disabled: saving,
                                        "aria-label": "Close",
                                        className: "jsx-769aa10d7aa48d61" + " " + "p-2 -mr-2 rounded-lg hover:bg-gray-100",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            size: 18
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/batches/page.tsx",
                                            lineNumber: 480,
                                            columnNumber: 141
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 480,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/batches/page.tsx",
                                lineNumber: 478,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                onSubmit: saveForm,
                                className: "jsx-769aa10d7aa48d61" + " " + "flex-1 overflow-y-auto p-4 sm:p-5 space-y-4",
                                children: [
                                    formError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        role: "alert",
                                        className: "jsx-769aa10d7aa48d61" + " " + "rounded-lg bg-[#fed1d7] px-3 py-2 text-sm sm:text-[13px] text-[#8e0b21]",
                                        children: formError
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 484,
                                        columnNumber: 29
                                    }, this),
                                    !form.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                                        className: "p-4 space-y-2.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-769aa10d7aa48d61" + " " + "text-sm font-semibold text-[#1a1a1a]",
                                                children: "Quick start"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 488,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>applyPreset('morning'),
                                                className: "jsx-769aa10d7aa48d61" + " " + "w-full text-left rounded-lg bg-[#f7f7f7] hover:bg-[#f1f1f1] p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-769aa10d7aa48d61" + " " + "text-sm sm:text-[13px] font-medium text-[#1a1a1a]",
                                                        children: "Evening to morning"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/batches/page.tsx",
                                                        lineNumber: 490,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-769aa10d7aa48d61" + " " + "text-xs text-[#616161] mt-0.5",
                                                        children: "Orders 6 pm today → 8 am tomorrow. Delivery tomorrow."
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/batches/page.tsx",
                                                        lineNumber: 491,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 489,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>applyPreset('evening'),
                                                className: "jsx-769aa10d7aa48d61" + " " + "w-full text-left rounded-lg bg-[#f7f7f7] hover:bg-[#f1f1f1] p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-769aa10d7aa48d61" + " " + "text-sm sm:text-[13px] font-medium text-[#1a1a1a]",
                                                        children: "Evening to evening"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/batches/page.tsx",
                                                        lineNumber: 494,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-769aa10d7aa48d61" + " " + "text-xs text-[#616161] mt-0.5",
                                                        children: "Orders 6 pm today → 6 pm tomorrow. Delivery day after tomorrow."
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/batches/page.tsx",
                                                        lineNumber: 495,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 493,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 487,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                                        className: "p-4 space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: "Batch name",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    value: form.name,
                                                    onChange: (e)=>setForm({
                                                            ...form,
                                                            name: e.target.value,
                                                            nameEdited: true
                                                        }),
                                                    placeholder: "e.g. Delivery 2 Nov",
                                                    className: "jsx-769aa10d7aa48d61" + " " + (inputCls || "")
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/batches/page.tsx",
                                                    lineNumber: 502,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 501,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: "Ordering opens",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "datetime-local",
                                                    value: form.opens,
                                                    onChange: (e)=>setForm({
                                                            ...form,
                                                            opens: e.target.value
                                                        }),
                                                    className: "jsx-769aa10d7aa48d61" + " " + (inputCls || "")
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/batches/page.tsx",
                                                    lineNumber: 505,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 504,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: "Ordering closes",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "datetime-local",
                                                    value: form.closes,
                                                    onChange: (e)=>setForm({
                                                            ...form,
                                                            closes: e.target.value
                                                        }),
                                                    className: "jsx-769aa10d7aa48d61" + " " + (inputCls || "")
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/batches/page.tsx",
                                                    lineNumber: 508,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 507,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: "Delivery date",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "date",
                                                    value: form.delivery,
                                                    onChange: (e)=>setForm({
                                                            ...form,
                                                            delivery: e.target.value,
                                                            name: form.nameEdited ? form.name : suggestName(e.target.value)
                                                        }),
                                                    className: "jsx-769aa10d7aa48d61" + " " + (inputCls || "")
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/batches/page.tsx",
                                                    lineNumber: 511,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 510,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-769aa10d7aa48d61" + " " + "text-xs text-[#616161]",
                                                children: "Customers only see the delivery date, not a time."
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 518,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: "Notes (optional)",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    rows: 2,
                                                    value: form.notes,
                                                    onChange: (e)=>setForm({
                                                            ...form,
                                                            notes: e.target.value
                                                        }),
                                                    className: "jsx-769aa10d7aa48d61" + " " + (inputCls || "")
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/batches/page.tsx",
                                                    lineNumber: 520,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 519,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 500,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/batches/page.tsx",
                                lineNumber: 483,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-769aa10d7aa48d61" + " " + "p-4 bg-white border-t border-gray-200 shrink-0 flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setForm(null),
                                        disabled: saving,
                                        className: "jsx-769aa10d7aa48d61" + " " + "btn-secondary min-h-11 sm:min-h-10",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 526,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: (e)=>saveForm(e),
                                        disabled: saving,
                                        className: "jsx-769aa10d7aa48d61" + " " + "flex-1 min-h-11 sm:min-h-10 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-sm sm:text-[13px] font-medium text-white disabled:opacity-50 inline-flex items-center justify-center gap-2",
                                        children: saving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                            size: 16,
                                            className: "animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/batches/page.tsx",
                                            lineNumber: 528,
                                            columnNumber: 27
                                        }, this) : form.id ? 'Save changes' : 'Create batch'
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 527,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/batches/page.tsx",
                                lineNumber: 525,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/batches/page.tsx",
                        lineNumber: 477,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/batches/page.tsx",
                lineNumber: 475,
                columnNumber: 9
            }, this),
            pickBatch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-769aa10d7aa48d61" + " " + "relative z-[100]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: ()=>setPickBatch(null),
                        className: "jsx-769aa10d7aa48d61" + " " + "fixed inset-0 bg-black/40"
                    }, void 0, false, {
                        fileName: "[project]/admin/app/batches/page.tsx",
                        lineNumber: 538,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "jsx-769aa10d7aa48d61" + " " + "fixed inset-y-0 right-0 w-full max-w-md bg-[#f1f1f1] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-769aa10d7aa48d61" + " " + "px-4 sm:px-5 py-3 bg-white border-b border-gray-200 flex items-start justify-between shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-769aa10d7aa48d61",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "jsx-769aa10d7aa48d61" + " " + "text-sm font-semibold text-[#1a1a1a]",
                                                children: "Pick list"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 542,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-769aa10d7aa48d61" + " " + "text-xs text-[#616161]",
                                                children: [
                                                    pickBatch.name,
                                                    " · ",
                                                    fmtDay(pickBatch.delivery_date)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 543,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 541,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setPickBatch(null),
                                        "aria-label": "Close",
                                        className: "jsx-769aa10d7aa48d61" + " " + "p-2 -mr-2 rounded-lg hover:bg-gray-100",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            size: 18
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/batches/page.tsx",
                                            lineNumber: 545,
                                            columnNumber: 128
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 545,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/batches/page.tsx",
                                lineNumber: 540,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-769aa10d7aa48d61" + " " + "flex-1 overflow-y-auto p-4 sm:p-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                                        className: "overflow-hidden",
                                        children: pickList.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-769aa10d7aa48d61" + " " + "py-12 px-6 text-center text-sm sm:text-[13px] text-[#616161]",
                                            children: "Nothing left to pack for this batch."
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/batches/page.tsx",
                                            lineNumber: 551,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                            className: "jsx-769aa10d7aa48d61" + " " + "w-full text-sm sm:text-[13px]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                    className: "jsx-769aa10d7aa48d61",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "jsx-769aa10d7aa48d61" + " " + "bg-[#f7f7f7] text-[#616161] border-b border-gray-200/80 text-left",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "jsx-769aa10d7aa48d61" + " " + "font-medium px-4 py-2",
                                                                children: "Product"
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                                lineNumber: 556,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "jsx-769aa10d7aa48d61" + " " + "font-medium px-2 py-2 text-right",
                                                                children: "Qty"
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                                lineNumber: 557,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                className: "jsx-769aa10d7aa48d61" + " " + "font-medium px-4 py-2 text-right",
                                                                children: "Orders"
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                                lineNumber: 558,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/batches/page.tsx",
                                                        lineNumber: 555,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/batches/page.tsx",
                                                    lineNumber: 554,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                    className: "jsx-769aa10d7aa48d61" + " " + "divide-y divide-gray-100",
                                                    children: pickList.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            className: "jsx-769aa10d7aa48d61",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "jsx-769aa10d7aa48d61" + " " + "px-4 py-2.5",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-769aa10d7aa48d61" + " " + "font-medium text-[#1a1a1a]",
                                                                            children: p.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/admin/app/batches/page.tsx",
                                                                            lineNumber: 564,
                                                                            columnNumber: 55
                                                                        }, this),
                                                                        " ",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-769aa10d7aa48d61" + " " + "text-[#616161]",
                                                                            children: [
                                                                                "(",
                                                                                p.unit,
                                                                                ")"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/admin/app/batches/page.tsx",
                                                                            lineNumber: 564,
                                                                            columnNumber: 116
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/admin/app/batches/page.tsx",
                                                                    lineNumber: 564,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "jsx-769aa10d7aa48d61" + " " + "px-2 py-2.5 text-right font-semibold text-[#1a1a1a] tabular-nums",
                                                                    children: p.qty
                                                                }, void 0, false, {
                                                                    fileName: "[project]/admin/app/batches/page.tsx",
                                                                    lineNumber: 565,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    className: "jsx-769aa10d7aa48d61" + " " + "px-4 py-2.5 text-right text-[#616161] tabular-nums",
                                                                    children: p.orders
                                                                }, void 0, false, {
                                                                    fileName: "[project]/admin/app/batches/page.tsx",
                                                                    lineNumber: 566,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, `${p.name}${p.unit}`, true, {
                                                            fileName: "[project]/admin/app/batches/page.tsx",
                                                            lineNumber: 563,
                                                            columnNumber: 25
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/batches/page.tsx",
                                                    lineNumber: 561,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/admin/app/batches/page.tsx",
                                            lineNumber: 553,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 549,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-769aa10d7aa48d61" + " " + "text-xs text-[#616161] mt-3",
                                        children: "Counts items that are still pending or packed. Delivered, unavailable and rescheduled items are left out."
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 573,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/batches/page.tsx",
                                lineNumber: 548,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-769aa10d7aa48d61" + " " + "p-4 bg-white border-t border-gray-200 shrink-0 flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: copyPickList,
                                        disabled: !pickList.length,
                                        className: "jsx-769aa10d7aa48d61" + " " + "btn-secondary min-h-11 sm:min-h-10 flex-1",
                                        children: [
                                            copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                size: 14
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 577,
                                                columnNumber: 138
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                size: 14
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 577,
                                                columnNumber: 160
                                            }, this),
                                            " ",
                                            copied ? 'Copied' : 'Copy'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 577,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: printPickList,
                                        disabled: !pickList.length,
                                        className: "jsx-769aa10d7aa48d61" + " " + "btn-primary min-h-11 sm:min-h-10 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                                size: 14
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/batches/page.tsx",
                                                lineNumber: 578,
                                                columnNumber: 127
                                            }, this),
                                            " Print"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/batches/page.tsx",
                                        lineNumber: 578,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/batches/page.tsx",
                                lineNumber: 576,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/batches/page.tsx",
                        lineNumber: 539,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/batches/page.tsx",
                lineNumber: 537,
                columnNumber: 9
            }, this),
            toast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                role: "status",
                className: "jsx-769aa10d7aa48d61" + " " + `fixed bottom-5 left-1/2 -translate-x-1/2 z-[120] max-w-[90vw] px-4 py-2.5 rounded-lg text-sm sm:text-[13px] shadow-lg ${toast.type === 'error' ? 'bg-[#fed1d7] text-[#8e0b21]' : 'bg-[#303030] text-white'}`,
                children: toast.text
            }, void 0, false, {
                fileName: "[project]/admin/app/batches/page.tsx",
                lineNumber: 586,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "769aa10d7aa48d61",
                children: ".btn-secondary{color:#303030;background:#fff;border-radius:8px;justify-content:center;align-items:center;gap:6px;min-height:36px;padding:6px 12px;font-size:13px;font-weight:500;display:inline-flex;box-shadow:0 0 0 1px #0000001f}.btn-secondary:hover{background:#f7f7f7}.btn-secondary:disabled{opacity:.5}.btn-primary{color:#fff;background:#303030;border-radius:8px;justify-content:center;align-items:center;gap:6px;min-height:36px;padding:6px 14px;font-size:13px;font-weight:500;display:inline-flex}.btn-primary:hover{background:#1a1a1a}.btn-primary:disabled{opacity:.5}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/admin/app/batches/page.tsx",
        lineNumber: 344,
        columnNumber: 5
    }, this);
}
_s(BatchesPage, "fJ0lbNO67ZSUPW6rGlhfdQ68G60=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$context$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = BatchesPage;
function Card({ children, className = '' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/admin/app/batches/page.tsx",
        lineNumber: 604,
        columnNumber: 10
    }, this);
}
_c1 = Card;
function Pill({ children, tone }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center px-2 h-5 rounded-full text-[11px] font-medium whitespace-nowrap ${tone}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/admin/app/batches/page.tsx",
        lineNumber: 607,
        columnNumber: 10
    }, this);
}
_c2 = Pill;
function Stat({ label, value }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "px-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-[#616161]",
                children: label
            }, void 0, false, {
                fileName: "[project]/admin/app/batches/page.tsx",
                lineNumber: 612,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-base font-semibold text-[#1a1a1a] mt-0.5 tabular-nums",
                children: value
            }, void 0, false, {
                fileName: "[project]/admin/app/batches/page.tsx",
                lineNumber: 613,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/admin/app/batches/page.tsx",
        lineNumber: 611,
        columnNumber: 5
    }, this);
}
_c3 = Stat;
function Field({ label, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "block space-y-1.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm sm:text-[13px] font-medium text-[#303030]",
                children: label
            }, void 0, false, {
                fileName: "[project]/admin/app/batches/page.tsx",
                lineNumber: 620,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/admin/app/batches/page.tsx",
        lineNumber: 619,
        columnNumber: 5
    }, this);
}
_c4 = Field;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "BatchesPage");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "Pill");
__turbopack_context__.k.register(_c3, "Stat");
__turbopack_context__.k.register(_c4, "Field");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=admin_app_batches_page_tsx_1bdtr5rj0qyd5._.js.map