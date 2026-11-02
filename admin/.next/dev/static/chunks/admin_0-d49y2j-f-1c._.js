(()=>{"use strict";(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/admin/app/orders/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminOrders
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/lib/supabase.ts [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/lib/fulfillment'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/history.js [app-client] (ecmascript) <export default as History>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2d$call$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PhoneCall$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/phone-call.js [app-client] (ecmascript) <export default as PhoneCall>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/store.js [app-client] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarClock$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/calendar-clock.js [app-client] (ecmascript) <export default as CalendarClock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$orders$2f$services$2f$orders$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/admin/features/orders/services/orders.service.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$orders$2f$repositories$2f$orders$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/features/orders/repositories/orders.repository.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const DAY = 86400000;
const PAGE_SIZE = 25;
const STATUSES = [
    {
        value: 'pending',
        label: 'Pending'
    },
    {
        value: 'processing',
        label: 'Processing'
    },
    {
        value: 'out_for_delivery',
        label: 'Out for delivery'
    },
    {
        value: 'delivered',
        label: 'Delivered'
    },
    {
        value: 'cancelled',
        label: 'Cancelled'
    }
];
const STATUS_TONE = {
    pending: 'bg-[#e3e3e3] text-[#303030]',
    processing: 'bg-[#ffd6a4] text-[#5e4200]',
    out_for_delivery: 'bg-[#a4e8f2] text-[#00424d]',
    delivered: 'bg-[#cdfed4] text-[#014b40]',
    cancelled: 'bg-[#fed1d7] text-[#8e0b21]'
};
const RANGES = [
    {
        value: 'all',
        label: 'All time'
    },
    {
        value: 'today',
        label: 'Today'
    },
    {
        value: '7d',
        label: 'Last 7 days'
    },
    {
        value: '30d',
        label: 'Last 30 days'
    }
];
const SORTS = [
    {
        value: 'newest',
        label: 'Newest first'
    },
    {
        value: 'oldest',
        label: 'Oldest first'
    },
    {
        value: 'high',
        label: 'Highest total'
    },
    {
        value: 'low',
        label: 'Lowest total'
    }
];
const SOURCE_META = {
    online_web: {
        label: 'Online store',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
            size: 12
        }, void 0, false, {
            fileName: "[project]/admin/app/orders/page.tsx",
            lineNumber: 53,
            columnNumber: 46
        }, ("TURBOPACK compile-time value", void 0))
    },
    whatsapp: {
        label: 'WhatsApp',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
            size: 12
        }, void 0, false, {
            fileName: "[project]/admin/app/orders/page.tsx",
            lineNumber: 54,
            columnNumber: 40
        }, ("TURBOPACK compile-time value", void 0))
    },
    phone: {
        label: 'Phone',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2d$call$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PhoneCall$3e$__["PhoneCall"], {
            size: 12
        }, void 0, false, {
            fileName: "[project]/admin/app/orders/page.tsx",
            lineNumber: 55,
            columnNumber: 34
        }, ("TURBOPACK compile-time value", void 0))
    },
    walk_in: {
        label: 'Walk-in',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"], {
            size: 12
        }, void 0, false, {
            fileName: "[project]/admin/app/orders/page.tsx",
            lineNumber: 56,
            columnNumber: 38
        }, ("TURBOPACK compile-time value", void 0))
    }
};
const pretty = (s)=>String(s || '').replace(/_/g, ' ').replace(/^\w/, (c)=>c.toUpperCase());
const sourceLabel = (s)=>SOURCE_META[s]?.label ?? pretty(s || 'online_web');
const sourceIcon = (s)=>SOURCE_META[s]?.icon ?? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
        size: 12
    }, void 0, false, {
        fileName: "[project]/admin/app/orders/page.tsx",
        lineNumber: 61,
        columnNumber: 59
    }, ("TURBOPACK compile-time value", void 0));
const FULFILL = [
    {
        value: 'pending',
        label: 'To pack'
    },
    {
        value: 'packed',
        label: 'Packed'
    },
    {
        value: 'backordered',
        label: 'Awaiting stock'
    },
    {
        value: 'delivered',
        label: 'Delivered'
    },
    {
        value: 'unavailable',
        label: 'Unavailable'
    }
];
const FULFILL_TONE = {
    pending: 'bg-[#e3e3e3] text-[#303030]',
    packed: 'bg-[#a4e8f2] text-[#00424d]',
    backordered: 'bg-[#ffd6a4] text-[#5e4200]',
    delivered: 'bg-[#cdfed4] text-[#014b40]',
    unavailable: 'bg-[#fed1d7] text-[#8e0b21]'
};
// 'YYYY-MM-DD' -> "Sat, 1 Nov" without timezone shifting the day
const fmtDay = (d)=>d ? new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    }) : '—';
const todayStr = ()=>{
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const fetchAll = async (build)=>{
    let all = [];
    for(let from = 0;; from += 1000){
        const { data, error } = await build(from, from + 999);
        if (error) throw error;
        all = all.concat(data || []);
        if (!data || data.length < 1000) break;
    }
    return all;
};
const formatCurrency = (n)=>new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(Number(n) || 0);
const fmtDate = (d)=>d ? new Date(d).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }) : '—';
const startOfDay = (t)=>{
    const d = new Date(t);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
};
const toIndianPhone = (raw)=>{
    const digits = String(raw || '').replace(/\D/g, '');
    const ten = digits.length >= 10 ? digits.slice(-10) : '';
    return /^[6-9]\d{9}$/.test(ten) ? ten : null;
};
const esc = (v)=>String(v ?? '').replace(/[&<>"']/g, (c)=>({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[c]);
const inputCls = 'w-full min-h-11 sm:min-h-9 py-2 px-3 text-base sm:text-[13px] text-[#1a1a1a] placeholder:text-[#8a8a8a] bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.2)] outline-none focus:shadow-[0_0_0_2px_#005bd3] transition-shadow';
function AdminOrders() {
    _s();
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [refreshing, setRefreshing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [range, setRange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [sourceFilter, setSourceFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [sort, setSort] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('newest');
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(PAGE_SIZE);
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [bulkBusy, setBulkBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // batches + item-level fulfillment (needs the SQL migration; silently off until then)
    const [fulfillmentReady, setFulfillmentReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [batches, setBatches] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [orderExtras, setOrderExtras] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [itemExtras, setItemExtras] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [batchFilter, setBatchFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [rescheduling, setRescheduling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [savingItemId, setSavingItemId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [splitting, setSplitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedOrderId, setSelectedOrderId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [updatingStatusId, setUpdatingStatusId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // item replacement
    const [replacingItemId, setReplacingItemId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [replacementSearch, setReplacementSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedReplacementVariant, setSelectedReplacementVariant] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [replaceReason, setReplaceReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Product unavailable - replaced with customer consent');
    const [isSwapping, setIsSwapping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [toast, setToast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const flash = (type, text)=>{
        setToast({
            type,
            text
        });
        setTimeout(()=>setToast(null), 3500);
    };
    const load = async (silent = false)=>{
        if (silent) setRefreshing(true);
        try {
            const [orderRows, productRows] = await Promise.all([
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$orders$2f$repositories$2f$orders$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listAdminOrders"])(),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$orders$2f$repositories$2f$orders$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listReplacementProducts"])()
            ]);
            setOrders(orderRows);
            setProducts(productRows);
            try {
                const [bRes, oRows, iRows] = await Promise.all([
                    __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('order_batches').select('id, name, delivery_date, status').order('delivery_date', {
                        ascending: false
                    }).limit(60),
                    fetchAll((f, t)=>__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('orders').select('id, batch_id, delivery_date').or('batch_id.not.is.null,delivery_date.not.is.null').range(f, t)),
                    fetchAll((f, t)=>__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('order_items').select('id, fulfillment_status, promised_date, fulfillment_note').or('fulfillment_status.neq.pending,promised_date.not.is.null').range(f, t))
                ]);
                if (bRes.error) throw bRes.error;
                setBatches(bRes.data || []);
                setOrderExtras(Object.fromEntries(oRows.map((r)=>[
                        r.id,
                        {
                            batch_id: r.batch_id,
                            delivery_date: r.delivery_date
                        }
                    ])));
                setItemExtras(Object.fromEntries(iRows.map((r)=>[
                        r.id,
                        {
                            fulfillment_status: r.fulfillment_status,
                            promised_date: r.promised_date,
                            fulfillment_note: r.fulfillment_note
                        }
                    ])));
                setFulfillmentReady(true);
            } catch  {
                setFulfillmentReady(false); // migration not run yet: the page works exactly as before
            }
        } catch (error) {
            console.error('Failed to load orders workspace:', error);
            flash('error', 'Could not load orders. Please try again.');
        } finally{
            setLoading(false);
            setRefreshing(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminOrders.useEffect": ()=>{
            load();
            const q = new URLSearchParams(window.location.search).get('q');
            if (q) setSearchQuery(q);
            const bq = new URLSearchParams(window.location.search).get('batch');
            if (bq) setBatchFilter(bq);
        }
    }["AdminOrders.useEffect"], []);
    const selectedOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AdminOrders.useMemo[selectedOrder]": ()=>orders.find({
                "AdminOrders.useMemo[selectedOrder]": (o)=>o.id === selectedOrderId
            }["AdminOrders.useMemo[selectedOrder]"]) || null
    }["AdminOrders.useMemo[selectedOrder]"], [
        orders,
        selectedOrderId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminOrders.useEffect": ()=>{
            const onKey = {
                "AdminOrders.useEffect.onKey": (e)=>{
                    if (e.key === 'Escape' && !isSwapping) setSelectedOrderId(null);
                }
            }["AdminOrders.useEffect.onKey"];
            window.addEventListener('keydown', onKey);
            return ({
                "AdminOrders.useEffect": ()=>window.removeEventListener('keydown', onKey)
            })["AdminOrders.useEffect"];
        }
    }["AdminOrders.useEffect"], [
        isSwapping
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminOrders.useEffect": ()=>{
            setReplacingItemId(null);
            setReplacementSearch('');
        }
    }["AdminOrders.useEffect"], [
        selectedOrderId
    ]);
    // ---------- filtering ----------
    const sources = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AdminOrders.useMemo[sources]": ()=>Array.from(new Set(orders.map({
                "AdminOrders.useMemo[sources]": (o)=>String(o.orderSource || 'online_web')
            }["AdminOrders.useMemo[sources]"])))
    }["AdminOrders.useMemo[sources]"], [
        orders
    ]);
    const base = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AdminOrders.useMemo[base]": ()=>{
            const now = Date.now();
            const today0 = startOfDay(now);
            const from = range === 'today' ? today0 : range === '7d' ? today0 - 6 * DAY : range === '30d' ? today0 - 29 * DAY : 0;
            const q = searchQuery.trim().toLowerCase();
            return orders.filter({
                "AdminOrders.useMemo[base]": (o)=>{
                    if (from && (!o.createdAt || new Date(o.createdAt).getTime() < from)) return false;
                    if (sourceFilter !== 'all' && String(o.orderSource || 'online_web') !== sourceFilter) return false;
                    if (batchFilter !== 'all') {
                        const bid = orderExtras[o.id]?.batch_id ?? null;
                        if (batchFilter === 'none' ? bid : bid !== batchFilter) return false;
                    }
                    if (!q) return true;
                    return String(o.orderId || '').toLowerCase().includes(q) || String(o.userName || '').toLowerCase().includes(q) || String(o.shipping?.name || '').toLowerCase().includes(q) || String(o.shipping?.phone || o.userPhone || '').includes(q);
                }
            }["AdminOrders.useMemo[base]"]);
        }
    }["AdminOrders.useMemo[base]"], [
        orders,
        range,
        sourceFilter,
        searchQuery,
        batchFilter,
        orderExtras
    ]);
    const counts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AdminOrders.useMemo[counts]": ()=>{
            const c = {
                all: base.length
            };
            STATUSES.forEach({
                "AdminOrders.useMemo[counts]": (s)=>c[s.value] = 0
            }["AdminOrders.useMemo[counts]"]);
            base.forEach({
                "AdminOrders.useMemo[counts]": (o)=>{
                    c[o.status] = (c[o.status] || 0) + 1;
                }
            }["AdminOrders.useMemo[counts]"]);
            return c;
        }
    }["AdminOrders.useMemo[counts]"], [
        base
    ]);
    const filtered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AdminOrders.useMemo[filtered]": ()=>{
            const list = tab === 'all' ? base : base.filter({
                "AdminOrders.useMemo[filtered]": (o)=>o.status === tab
            }["AdminOrders.useMemo[filtered]"]);
            const t = {
                "AdminOrders.useMemo[filtered].t": (o)=>o.createdAt ? new Date(o.createdAt).getTime() : 0
            }["AdminOrders.useMemo[filtered].t"];
            return [
                ...list
            ].sort({
                "AdminOrders.useMemo[filtered]": (a, b)=>sort === 'oldest' ? t(a) - t(b) : sort === 'high' ? Number(b.total) - Number(a.total) : sort === 'low' ? Number(a.total) - Number(b.total) : t(b) - t(a)
            }["AdminOrders.useMemo[filtered]"]);
        }
    }["AdminOrders.useMemo[filtered]"], [
        base,
        tab,
        sort
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminOrders.useEffect": ()=>{
            setVisible(PAGE_SIZE);
            setSelected(new Set());
        }
    }["AdminOrders.useEffect"], [
        tab,
        searchQuery,
        range,
        sourceFilter,
        sort,
        batchFilter
    ]);
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AdminOrders.useMemo[stats]": ()=>{
            const live = base.filter({
                "AdminOrders.useMemo[stats].live": (o)=>o.status !== 'cancelled'
            }["AdminOrders.useMemo[stats].live"]);
            return {
                orders: base.length,
                revenue: live.reduce({
                    "AdminOrders.useMemo[stats]": (s, o)=>s + (Number(o.total) || 0)
                }["AdminOrders.useMemo[stats]"], 0),
                awaiting: (counts.pending || 0) + (counts.processing || 0),
                delivered: counts.delivered || 0
            };
        }
    }["AdminOrders.useMemo[stats]"], [
        base,
        counts
    ]);
    const shown = filtered.slice(0, visible);
    const allShownSelected = shown.length > 0 && shown.every((o)=>selected.has(o.id));
    const toggleOne = (id)=>setSelected((prev)=>{
            const n = new Set(prev);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });
    const toggleAll = ()=>setSelected(allShownSelected ? new Set() : new Set(shown.map((o)=>o.id)));
    // ---------- status changes ----------
    const setLocalStatus = (id, status)=>setOrders((prev)=>prev.map((o)=>o.id === id ? {
                    ...o,
                    status
                } : o));
    const handleStatusChange = async (order, newStatus, itemsAlreadyChecked = false)=>{
        if (newStatus === order.status) return;
        if (newStatus === 'cancelled' && !confirm(`Cancel order #${order.orderId}?`)) return;
        const undeliveredIds = order.items.filter((i)=>![
                'delivered',
                'unavailable'
            ].includes(itemStatus(i))).map((i)=>i.id);
        if (newStatus === 'delivered' && fulfillmentReady && !itemsAlreadyChecked && undeliveredIds.length > 0) {
            if (!confirm(`${undeliveredIds.length} item${undeliveredIds.length > 1 ? 's are' : ' is'} not marked delivered yet. Mark the order and all its items as delivered?`)) return;
        }
        const prevStatus = order.status;
        setUpdatingStatusId(order.id);
        setLocalStatus(order.id, newStatus);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$orders$2f$services$2f$orders$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["changeAdminOrderStatus"])(order.id, newStatus);
            if (newStatus === 'delivered' && fulfillmentReady && undeliveredIds.length > 0) {
                const { error: itemErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('order_items').update({
                    fulfillment_status: 'delivered'
                }).in('id', undeliveredIds);
                if (!itemErr) {
                    setItemExtras((prev)=>{
                        const next = {
                            ...prev
                        };
                        undeliveredIds.forEach((id)=>{
                            next[id] = {
                                fulfillment_status: 'delivered',
                                promised_date: prev[id]?.promised_date ?? null,
                                fulfillment_note: prev[id]?.fulfillment_note ?? null
                            };
                        });
                        return next;
                    });
                }
            }
            flash('success', `Order #${order.orderId} marked ${pretty(newStatus).toLowerCase()}`);
        } catch (error) {
            console.error('Failed to update status:', error);
            setLocalStatus(order.id, prevStatus);
            flash('error', 'Failed to update order status.');
        } finally{
            setUpdatingStatusId(null);
        }
    };
    const handleBulkStatus = async (newStatus)=>{
        if (!newStatus || selected.size === 0) return;
        const ids = Array.from(selected);
        if (!confirm(`Mark ${ids.length} order${ids.length > 1 ? 's' : ''} as ${pretty(newStatus).toLowerCase()}?`)) return;
        setBulkBusy(true);
        const results = await Promise.allSettled(ids.map((id)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$orders$2f$services$2f$orders$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["changeAdminOrderStatus"])(id, newStatus)));
        const okIds = ids.filter((_, i)=>results[i].status === 'fulfilled');
        setOrders((prev)=>prev.map((o)=>okIds.includes(o.id) ? {
                    ...o,
                    status: newStatus
                } : o));
        setSelected(new Set());
        setBulkBusy(false);
        const failed = ids.length - okIds.length;
        failed ? flash('error', `${okIds.length} updated, ${failed} failed.`) : flash('success', `${okIds.length} orders updated`);
    };
    // ---------- item replacement ----------
    const replacementOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AdminOrders.useMemo[replacementOptions]": ()=>{
            const q = replacementSearch.trim().toLowerCase();
            return products.map({
                "AdminOrders.useMemo[replacementOptions]": (p)=>({
                        ...p,
                        product_variants: p.product_variants || []
                    })
            }["AdminOrders.useMemo[replacementOptions]"]).filter({
                "AdminOrders.useMemo[replacementOptions]": (p)=>p.product_variants.length > 0 && (!q || String(p.name).toLowerCase().includes(q))
            }["AdminOrders.useMemo[replacementOptions]"]);
        }
    }["AdminOrders.useMemo[replacementOptions]"], [
        products,
        replacementSearch
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminOrders.useEffect": ()=>{
            const flat = replacementOptions.flatMap({
                "AdminOrders.useEffect.flat": (p)=>p.product_variants.map({
                        "AdminOrders.useEffect.flat": (v)=>v.id
                    }["AdminOrders.useEffect.flat"])
            }["AdminOrders.useEffect.flat"]);
            if (!flat.includes(selectedReplacementVariant)) setSelectedReplacementVariant(flat[0] || '');
        }
    }["AdminOrders.useEffect"], [
        replacementOptions,
        selectedReplacementVariant
    ]);
    const handleExecuteSwapItem = async (oldItem)=>{
        if (!selectedOrder) return;
        if (!selectedReplacementVariant) return flash('error', 'Select a replacement variant.');
        setIsSwapping(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$orders$2f$services$2f$orders$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["swapAdminOrderItem"])({
                order: selectedOrder,
                item: oldItem,
                replacementVariantId: selectedReplacementVariant,
                reason: replaceReason
            });
            flash('success', 'Item replaced');
            setReplacingItemId(null);
            await load(true); // drawer stays open and shows the updated order
        } catch (error) {
            console.error(error);
            flash('error', error instanceof Error ? error.message : 'Item replacement failed');
        } finally{
            setIsSwapping(false);
        }
    };
    // ---------- export & print ----------
    const exportCsv = ()=>{
        const q = (v)=>`"${String(v ?? '').replace(/"/g, '""')}"`;
        const rows = [
            [
                'Order',
                'Date',
                'Delivery date',
                'Customer',
                'Phone',
                'Source',
                'Status',
                'Items',
                'Total'
            ],
            ...filtered.map((o)=>[
                    `#${o.orderId}`,
                    o.createdAt ? new Date(o.createdAt).toISOString() : '',
                    orderExtras[o.id]?.delivery_date || '',
                    o.shipping?.name || o.userName || '',
                    o.shipping?.phone || o.userPhone || '',
                    sourceLabel(String(o.orderSource)),
                    pretty(o.status),
                    o.items.length,
                    o.total
                ])
        ];
        const blob = new Blob([
            rows.map((r)=>r.map(q).join(',')).join('\n')
        ], {
            type: 'text/csv;charset=utf-8;'
        });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
    };
    const printOrder = (o)=>{
        const w = window.open('', '_blank', 'width=800,height=900');
        if (!w) return flash('error', 'Allow pop-ups to print.');
        const itemsSub = o.items.reduce((s, i)=>s + (Number(i.subtotal) || 0), 0);
        const extra = Number(o.total) - itemsSub;
        w.document.write(`<!doctype html><html><head><title>Order #${esc(o.orderId)}</title>
      <style>body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#303030;padding:32px;max-width:720px;margin:auto}
      h1{font-size:20px;margin:0}small,.muted{color:#616161}table{width:100%;border-collapse:collapse;margin-top:16px}
      th,td{text-align:left;padding:8px 0;border-bottom:1px solid #e3e3e3;font-size:13px}th{color:#616161;font-weight:500}
      td.r,th.r{text-align:right}.tot td{font-weight:600;border-bottom:0}.box{margin-top:16px;font-size:13px;line-height:1.5}</style></head><body>
      <h1>Royal Bengal — Order #${esc(o.orderId)}</h1>
      <small>${esc(fmtDate(o.createdAt))} · ${esc(sourceLabel(String(o.orderSource)))} · ${esc(pretty(o.status))}${orderExtras[o.id]?.delivery_date ? ` · Delivery ${esc(fmtDay(orderExtras[o.id].delivery_date))}` : ''}</small>
      <div class="box"><strong>${esc(o.shipping?.name || o.userName || 'Customer')}</strong><br>${esc(o.shipping?.phone || o.userPhone || '')}<br>
      <span class="muted">${esc([
            o.shipping?.houseNumber,
            o.shipping?.address
        ].filter(Boolean).join(', '))}<br>${esc([
            o.shipping?.city,
            o.shipping?.pincode
        ].filter(Boolean).join(' - '))}</span></div>
      <table><thead><tr><th>Item</th><th>Qty</th><th class="r">Price</th><th class="r">Amount</th></tr></thead><tbody>
      ${o.items.map((i)=>`<tr><td>${esc(i.name)} <span class="muted">(${esc(i.unit)})</span></td><td>${esc(i.qty)}</td><td class="r">₹${esc(i.price)}</td><td class="r">₹${esc(i.subtotal)}</td></tr>`).join('')}
      ${Math.abs(extra) > 0.5 ? `<tr><td colspan="3" class="muted">Delivery &amp; other</td><td class="r">₹${esc(extra)}</td></tr>` : ''}
      <tr class="tot"><td colspan="3">Total</td><td class="r">₹${esc(o.total)}</td></tr></tbody></table>
      <script>window.onload=function(){window.print()}</script></body></html>`);
        w.document.close();
    };
    const copyAddress = async (o)=>{
        const text = [
            o.shipping?.name || o.userName,
            o.shipping?.phone || o.userPhone,
            [
                o.shipping?.houseNumber,
                o.shipping?.address
            ].filter(Boolean).join(', '),
            [
                o.shipping?.city,
                o.shipping?.pincode
            ].filter(Boolean).join(' - ')
        ].filter(Boolean).join('\n');
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(()=>setCopied(false), 1800);
        } catch  {
            flash('error', 'Could not copy the address.');
        }
    };
    const customerName = (o)=>o.shipping?.name || o.userName || 'Customer';
    // ---------- batches & item fulfillment ----------
    const orderDelivery = (o)=>orderExtras[o.id]?.delivery_date || null;
    const itemStatus = (i)=>itemExtras[i.id]?.fulfillment_status || 'pending';
    const itemDate = (o, i)=>itemExtras[i.id]?.promised_date || orderDelivery(o);
    const batchName = (o)=>batches.find((b)=>b.id === orderExtras[o.id]?.batch_id)?.name || null;
    const orderFlags = (o)=>{
        const od = orderDelivery(o);
        let late = false, unavailable = false, backordered = false, delivered = 0, open = 0;
        o.items.forEach((i)=>{
            const st = itemStatus(i);
            if (st === 'backordered') backordered = true;
            if (st === 'unavailable') unavailable = true;
            else if (st === 'delivered') delivered++;
            else open++;
            const pd = itemExtras[i.id]?.promised_date;
            if (pd && od && pd > od) late = true;
        });
        return {
            late,
            unavailable,
            backordered,
            partial: delivered > 0 && open > 0
        };
    };
    const renderFlags = (o)=>{
        if (!fulfillmentReady || o.status === 'cancelled') return null;
        const f = orderFlags(o);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                f.partial && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pill, {
                    tone: "bg-[#a4e8f2] text-[#00424d]",
                    children: "Partial"
                }, void 0, false, {
                    fileName: "[project]/admin/app/orders/page.tsx",
                    lineNumber: 442,
                    columnNumber: 23
                }, this),
                f.backordered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pill, {
                    tone: "bg-[#ffd6a4] text-[#5e4200]",
                    children: "Awaiting stock"
                }, void 0, false, {
                    fileName: "[project]/admin/app/orders/page.tsx",
                    lineNumber: 443,
                    columnNumber: 27
                }, this),
                f.late && !f.backordered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pill, {
                    tone: "bg-[#ffd6a4] text-[#5e4200]",
                    children: "Late items"
                }, void 0, false, {
                    fileName: "[project]/admin/app/orders/page.tsx",
                    lineNumber: 444,
                    columnNumber: 38
                }, this),
                f.unavailable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pill, {
                    tone: "bg-[#fed1d7] text-[#8e0b21]",
                    children: "Unavailable"
                }, void 0, false, {
                    fileName: "[project]/admin/app/orders/page.tsx",
                    lineNumber: 445,
                    columnNumber: 27
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/admin/app/orders/page.tsx",
            lineNumber: 441,
            columnNumber: 7
        }, this);
    };
    const updateItem = async (item, patch)=>{
        const prev = itemExtras[item.id] || {
            fulfillment_status: 'pending',
            promised_date: null,
            fulfillment_note: null
        };
        setSavingItemId(item.id);
        setItemExtras((p)=>({
                ...p,
                [item.id]: {
                    ...prev,
                    ...patch
                }
            }));
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('order_items').update(patch).eq('id', item.id);
        setSavingItemId(null);
        if (error) {
            console.error(error);
            setItemExtras((p)=>({
                    ...p,
                    [item.id]: prev
                }));
            flash('error', 'Could not update the item.');
            return false;
        }
        return true;
    };
    const changeItemStatus = async (o, item, status)=>{
        const ok = await updateItem(item, {
            fulfillment_status: status
        });
        if (!ok || status === 'pending' || status === 'packed') return;
        const everyoneDone = o.items.every((i)=>i.id === item.id || [
                'delivered',
                'unavailable'
            ].includes(itemStatus(i)));
        const anyDelivered = status === 'delivered' || o.items.some((i)=>itemStatus(i) === 'delivered');
        if (everyoneDone && anyDelivered && o.status !== 'delivered' && o.status !== 'cancelled' && confirm('Every item is now handled. Mark the whole order as delivered?')) {
            handleStatusChange(o, 'delivered', true);
        }
    };
    const saveReschedule = async (o, item)=>{
        if (!rescheduling) return;
        if (!rescheduling.date) return flash('error', 'Pick a delivery date.');
        if (rescheduling.date < todayStr()) return flash('error', 'Pick today or a future date.');
        const od = orderDelivery(o);
        const ok = await updateItem(item, {
            promised_date: rescheduling.date === od ? null : rescheduling.date,
            fulfillment_note: rescheduling.note.trim() || null,
            ...itemStatus(item) === 'backordered' ? {
                fulfillment_status: 'pending'
            } : {}
        });
        if (ok) {
            setRescheduling(null);
            flash('success', `${item.name} moved to ${fmtDay(rescheduling.date)}`);
        }
    };
    const saveSplit = async (item)=>{
        if (!splitting) return;
        const keep = Number(splitting.keep);
        const total = Number(item.qty);
        if (!(keep > 0 && keep < total)) return flash('error', `Enter a quantity above 0 and below ${total}.`);
        if (splitting.mode === 'date' && (!splitting.date || splitting.date < todayStr())) return flash('error', 'Pick today or a future date for the rest.');
        setSavingItemId(item.id);
        const res = await splitOrderItem(item.id, keep, {
            status: splitting.mode === 'stock' ? 'backordered' : 'pending',
            promised_date: splitting.mode === 'date' ? splitting.date : null,
            note: splitting.mode === 'stock' ? 'Waiting for stock' : `Rest delivered ${fmtDay(splitting.date)}`
        });
        setSavingItemId(null);
        if (!res.ok) return flash('error', res.message);
        setSplitting(null);
        flash('success', 'Item split. The rest is tracked separately.');
        await load(true);
    };
    const upcomingBatches = (after)=>batches.filter((b)=>b.status === 'active' && b.delivery_date >= todayStr() && (!after || b.delivery_date > after)).sort((a, b)=>a.delivery_date.localeCompare(b.delivery_date)).slice(0, 3);
    const renderFulfillment = (o, item)=>{
        if (!fulfillmentReady) return null;
        const st = itemStatus(item);
        const od = orderDelivery(o);
        const d = itemDate(o, item);
        const pd = itemExtras[item.id]?.promised_date;
        const late = !!(pd && od && pd > od);
        const note = itemExtras[item.id]?.fulfillment_note;
        const locked = o.status === 'cancelled';
        const busy = savingItemId === item.id;
        const editing = rescheduling?.itemId === item.id;
        const splitEditing = splitting?.itemId === item.id;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 flex-wrap",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative inline-block",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: st,
                                    disabled: busy || locked,
                                    onChange: (e)=>changeItemStatus(o, item, e.target.value),
                                    "aria-label": `Fulfillment status for ${item.name}`,
                                    className: `appearance-none cursor-pointer outline-none min-h-8 pl-2.5 pr-7 rounded-full text-xs font-medium disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[#005bd3] ${FULFILL_TONE[st]}`,
                                    children: FULFILL.map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: f.value,
                                            children: f.label
                                        }, f.value, false, {
                                            fileName: "[project]/admin/app/orders/page.tsx",
                                            lineNumber: 536,
                                            columnNumber: 35
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/orders/page.tsx",
                                    lineNumber: 529,
                                    columnNumber: 13
                                }, this),
                                busy ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    size: 12,
                                    className: "absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin pointer-events-none"
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/orders/page.tsx",
                                    lineNumber: 538,
                                    columnNumber: 21
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                    size: 12,
                                    className: "absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-70"
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/orders/page.tsx",
                                    lineNumber: 538,
                                    columnNumber: 134
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/admin/app/orders/page.tsx",
                            lineNumber: 528,
                            columnNumber: 11
                        }, this),
                        late && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pill, {
                            tone: "bg-[#ffd6a4] text-[#5e4200]",
                            children: [
                                "Late · ",
                                fmtDay(d)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/admin/app/orders/page.tsx",
                            lineNumber: 540,
                            columnNumber: 20
                        }, this),
                        !locked && st !== 'delivered' && st !== 'unavailable' && !editing && !splitEditing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setRescheduling({
                                    itemId: item.id,
                                    date: pd || '',
                                    note: note || ''
                                }),
                            className: "text-sm sm:text-[13px] text-[#005bd3] hover:underline inline-flex items-center gap-1 min-h-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarClock$3e$__["CalendarClock"], {
                                    size: 13
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/orders/page.tsx",
                                    lineNumber: 543,
                                    columnNumber: 15
                                }, this),
                                " Reschedule"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/admin/app/orders/page.tsx",
                            lineNumber: 542,
                            columnNumber: 13
                        }, this),
                        !locked && st !== 'delivered' && st !== 'unavailable' && !editing && !splitEditing && Number(item.qty) > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setSplitting({
                                    itemId: item.id,
                                    keep: '',
                                    mode: 'stock',
                                    date: ''
                                }),
                            className: "text-sm sm:text-[13px] text-[#005bd3] hover:underline min-h-8",
                            children: "Short supply"
                        }, void 0, false, {
                            fileName: "[project]/admin/app/orders/page.tsx",
                            lineNumber: 547,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/admin/app/orders/page.tsx",
                    lineNumber: 527,
                    columnNumber: 9
                }, this),
                note && !editing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-[#616161]",
                    children: note
                }, void 0, false, {
                    fileName: "[project]/admin/app/orders/page.tsx",
                    lineNumber: 552,
                    columnNumber: 30
                }, this),
                st === 'unavailable' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-[#8e0b21]",
                    children: "Could not be supplied. Adjust the total or refund if the customer has already paid."
                }, void 0, false, {
                    fileName: "[project]/admin/app/orders/page.tsx",
                    lineNumber: 553,
                    columnNumber: 34
                }, this),
                splitEditing && splitting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg bg-[#f7f7f7] p-3 space-y-2.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm sm:text-[13px] font-semibold text-[#1a1a1a]",
                            children: [
                                "Short supply · ordered ",
                                item.qty
                            ]
                        }, void 0, true, {
                            fileName: "[project]/admin/app/orders/page.tsx",
                            lineNumber: 557,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block space-y-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm sm:text-[13px] font-medium text-[#303030]",
                                    children: "How many can you supply now?"
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/orders/page.tsx",
                                    lineNumber: 559,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    inputMode: "decimal",
                                    value: splitting.keep,
                                    onChange: (e)=>setSplitting({
                                            ...splitting,
                                            keep: e.target.value
                                        }),
                                    placeholder: `1 to ${Number(item.qty) - 1}`,
                                    className: inputCls
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/orders/page.tsx",
                                    lineNumber: 560,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/admin/app/orders/page.tsx",
                            lineNumber: 558,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm sm:text-[13px] font-medium text-[#303030]",
                                    children: "The rest"
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/orders/page.tsx",
                                    lineNumber: 563,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-1.5 flex-wrap",
                                    children: [
                                        [
                                            'stock',
                                            'Wait for stock'
                                        ],
                                        [
                                            'date',
                                            'Deliver on a date'
                                        ]
                                    ].map(([m, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setSplitting({
                                                    ...splitting,
                                                    mode: m
                                                }),
                                            className: `min-h-8 px-2.5 rounded-lg text-xs font-medium ${splitting.mode === m ? 'bg-[#303030] text-white' : 'bg-white text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]'}`,
                                            children: label
                                        }, m, false, {
                                            fileName: "[project]/admin/app/orders/page.tsx",
                                            lineNumber: 566,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/orders/page.tsx",
                                    lineNumber: 564,
                                    columnNumber: 15
                                }, this),
                                splitting.mode === 'date' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "date",
                                    min: todayStr(),
                                    value: splitting.date,
                                    onChange: (e)=>setSplitting({
                                            ...splitting,
                                            date: e.target.value
                                        }),
                                    className: inputCls
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/orders/page.tsx",
                                    lineNumber: 570,
                                    columnNumber: 45
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/admin/app/orders/page.tsx",
                            lineNumber: 562,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>saveSplit(item),
                                    disabled: busy,
                                    className: "flex-1 min-h-10 sm:min-h-9 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-sm sm:text-[13px] font-medium text-white disabled:opacity-50",
                                    children: "Split item"
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/orders/page.tsx",
                                    lineNumber: 573,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setSplitting(null),
                                    className: "min-h-10 sm:min-h-9 px-3 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/orders/page.tsx",
                                    lineNumber: 574,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/admin/app/orders/page.tsx",
                            lineNumber: 572,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/admin/app/orders/page.tsx",
                    lineNumber: 556,
                    columnNumber: 11
                }, this),
                editing && rescheduling && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg bg-[#f7f7f7] p-3 space-y-2.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm sm:text-[13px] font-semibold text-[#1a1a1a]",
                            children: "Deliver this item on"
                        }, void 0, false, {
                            fileName: "[project]/admin/app/orders/page.tsx",
                            lineNumber: 581,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-1.5",
                            children: upcomingBatches(od && od > todayStr() ? od : todayStr()).map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setRescheduling({
                                            ...rescheduling,
                                            date: b.delivery_date
                                        }),
                                    className: `min-h-8 px-2.5 rounded-lg text-xs font-medium ${rescheduling.date === b.delivery_date ? 'bg-[#303030] text-white' : 'bg-white text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]'}`,
                                    children: [
                                        b.name,
                                        " · ",
                                        fmtDay(b.delivery_date)
                                    ]
                                }, b.id, true, {
                                    fileName: "[project]/admin/app/orders/page.tsx",
                                    lineNumber: 584,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/admin/app/orders/page.tsx",
                            lineNumber: 582,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "date",
                            min: todayStr(),
                            value: rescheduling.date,
                            onChange: (e)=>setRescheduling({
                                    ...rescheduling,
                                    date: e.target.value
                                }),
                            className: inputCls
                        }, void 0, false, {
                            fileName: "[project]/admin/app/orders/page.tsx",
                            lineNumber: 590,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            value: rescheduling.note,
                            onChange: (e)=>setRescheduling({
                                    ...rescheduling,
                                    note: e.target.value
                                }),
                            placeholder: "Note (e.g. Fresh stock arrives Monday)",
                            className: inputCls
                        }, void 0, false, {
                            fileName: "[project]/admin/app/orders/page.tsx",
                            lineNumber: 591,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>saveReschedule(o, item),
                                    disabled: busy,
                                    className: "flex-1 min-h-10 sm:min-h-9 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-sm sm:text-[13px] font-medium text-white disabled:opacity-50",
                                    children: "Save date"
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/orders/page.tsx",
                                    lineNumber: 593,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setRescheduling(null),
                                    className: "min-h-10 sm:min-h-9 px-3 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/orders/page.tsx",
                                    lineNumber: 594,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/admin/app/orders/page.tsx",
                            lineNumber: 592,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/admin/app/orders/page.tsx",
                    lineNumber: 580,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/admin/app/orders/page.tsx",
            lineNumber: 526,
            columnNumber: 7
        }, this);
    };
    const sortedItems = selectedOrder ? [
        ...selectedOrder.items
    ].sort((a, b)=>String(itemDate(selectedOrder, a) || '').localeCompare(String(itemDate(selectedOrder, b) || ''))) : [];
    const multiDates = selectedOrder ? new Set(selectedOrder.items.map((i)=>itemDate(selectedOrder, i) || '')).size > 1 : false;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-xl font-semibold text-[#1a1a1a]",
                        children: "Orders"
                    }, void 0, false, {
                        fileName: "[project]/admin/app/orders/page.tsx",
                        lineNumber: 609,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>load(true),
                                disabled: refreshing,
                                className: "min-h-10 sm:min-h-8 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50 disabled:opacity-60",
                                "aria-label": "Refresh orders",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                        size: 14,
                                        className: refreshing ? 'animate-spin' : ''
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 612,
                                        columnNumber: 13
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:inline",
                                        children: "Refresh"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 612,
                                        columnNumber: 82
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/orders/page.tsx",
                                lineNumber: 611,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: exportCsv,
                                disabled: !filtered.length,
                                className: "min-h-10 sm:min-h-8 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50 disabled:opacity-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                        size: 14
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 615,
                                        columnNumber: 13
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:inline",
                                        children: "Export"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 615,
                                        columnNumber: 36
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/orders/page.tsx",
                                lineNumber: 614,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/orders/create",
                                className: "min-h-10 sm:min-h-8 px-3 sm:px-3 inline-flex items-center gap-1.5 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-sm sm:text-[13px] font-medium text-white transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        size: 15
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 618,
                                        columnNumber: 13
                                    }, this),
                                    " Create order"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/orders/page.tsx",
                                lineNumber: 617,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/orders/page.tsx",
                        lineNumber: 610,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/orders/page.tsx",
                lineNumber: 608,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                className: "grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-200/80",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Kpi, {
                        label: "Orders",
                        value: String(stats.orders),
                        loading: loading
                    }, void 0, false, {
                        fileName: "[project]/admin/app/orders/page.tsx",
                        lineNumber: 625,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Kpi, {
                        label: "Revenue",
                        value: formatCurrency(stats.revenue),
                        loading: loading
                    }, void 0, false, {
                        fileName: "[project]/admin/app/orders/page.tsx",
                        lineNumber: 626,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Kpi, {
                        label: "Awaiting action",
                        value: String(stats.awaiting),
                        warn: stats.awaiting > 0,
                        loading: loading
                    }, void 0, false, {
                        fileName: "[project]/admin/app/orders/page.tsx",
                        lineNumber: 627,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Kpi, {
                        label: "Delivered",
                        value: String(stats.delivered),
                        loading: loading
                    }, void 0, false, {
                        fileName: "[project]/admin/app/orders/page.tsx",
                        lineNumber: 628,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/orders/page.tsx",
                lineNumber: 624,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                className: "overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-3 sm:px-4 pt-3 space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-1 overflow-x-auto no-scrollbar",
                                children: [
                                    {
                                        value: 'all',
                                        label: 'All'
                                    },
                                    ...STATUSES
                                ].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setTab(t.value),
                                        className: `min-h-9 py-1.5 px-3 rounded-lg text-sm sm:text-[13px] whitespace-nowrap transition-colors ${tab === t.value ? 'bg-[#303030] text-white font-medium' : 'text-[#303030] hover:bg-gray-100'}`,
                                        children: [
                                            t.label,
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: tab === t.value ? 'text-white/70' : 'text-[#8a8a8a]',
                                                children: counts[t.value] ?? 0
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 643,
                                                columnNumber: 27
                                            }, this)
                                        ]
                                    }, t.value, true, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 636,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/admin/app/orders/page.tsx",
                                lineNumber: 634,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `grid grid-cols-2 gap-2 ${fulfillmentReady ? 'lg:grid-cols-[1fr_150px_150px_150px_170px]' : 'lg:grid-cols-[1fr_150px_150px_150px]'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative col-span-2 lg:col-span-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                size: 14,
                                                className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 650,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                placeholder: "Search order, customer or phone",
                                                value: searchQuery,
                                                onChange: (e)=>setSearchQuery(e.target.value),
                                                className: `${inputCls} pl-9`
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 651,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 649,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: range,
                                        onChange: (e)=>setRange(e.target.value),
                                        className: `${inputCls} cursor-pointer`,
                                        "aria-label": "Date range",
                                        children: RANGES.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: r.value,
                                                children: r.label
                                            }, r.value, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 654,
                                                columnNumber: 34
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 653,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: sourceFilter,
                                        onChange: (e)=>setSourceFilter(e.target.value),
                                        className: `${inputCls} cursor-pointer`,
                                        "aria-label": "Sales channel",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "all",
                                                children: "All channels"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 657,
                                                columnNumber: 15
                                            }, this),
                                            sources.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: s,
                                                    children: sourceLabel(s)
                                                }, s, false, {
                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                    lineNumber: 658,
                                                    columnNumber: 35
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 656,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: sort,
                                        onChange: (e)=>setSort(e.target.value),
                                        className: `${inputCls} cursor-pointer col-span-2 lg:col-span-1`,
                                        "aria-label": "Sort",
                                        children: SORTS.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: s.value,
                                                children: s.label
                                            }, s.value, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 661,
                                                columnNumber: 33
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 660,
                                        columnNumber: 13
                                    }, this),
                                    fulfillmentReady && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: batchFilter,
                                        onChange: (e)=>setBatchFilter(e.target.value),
                                        className: `${inputCls} cursor-pointer col-span-2 lg:col-span-1`,
                                        "aria-label": "Batch",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "all",
                                                children: "All batches"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 665,
                                                columnNumber: 17
                                            }, this),
                                            batches.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: b.id,
                                                    children: b.name
                                                }, b.id, false, {
                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                    lineNumber: 666,
                                                    columnNumber: 37
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "none",
                                                children: "No batch"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 667,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 664,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/orders/page.tsx",
                                lineNumber: 648,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/orders/page.tsx",
                        lineNumber: 633,
                        columnNumber: 9
                    }, this),
                    selected.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 mx-3 sm:mx-4 px-3 py-2 rounded-lg bg-[#f1f1f1] flex flex-wrap items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm sm:text-[13px] font-medium text-[#1a1a1a]",
                                children: [
                                    selected.size,
                                    " selected"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/orders/page.tsx",
                                lineNumber: 676,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: "",
                                        disabled: bulkBusy,
                                        onChange: (e)=>handleBulkStatus(e.target.value),
                                        className: "appearance-none min-h-9 pl-3 pr-8 rounded-lg bg-white text-sm sm:text-[13px] font-medium shadow-[0_0_0_1px_rgba(0,0,0,0.15)] cursor-pointer disabled:opacity-60",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                disabled: true,
                                                children: "Update status…"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 684,
                                                columnNumber: 17
                                            }, this),
                                            STATUSES.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: s.value,
                                                    children: s.label
                                                }, s.value, false, {
                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                    lineNumber: 685,
                                                    columnNumber: 38
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 678,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                        size: 14,
                                        className: "absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#616161]"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 687,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/orders/page.tsx",
                                lineNumber: 677,
                                columnNumber: 13
                            }, this),
                            bulkBusy && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                size: 15,
                                className: "animate-spin text-[#616161]"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/orders/page.tsx",
                                lineNumber: 689,
                                columnNumber: 26
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelected(new Set()),
                                className: "ml-auto text-sm sm:text-[13px] text-[#005bd3] hover:underline",
                                children: "Clear"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/orders/page.tsx",
                                lineNumber: 690,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/orders/page.tsx",
                        lineNumber: 675,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden md:block overflow-x-auto mt-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "w-full text-left text-[13px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "bg-[#f7f7f7] text-[#616161] border-y border-gray-200/80",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "w-10 pl-4 py-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check3, {
                                                    checked: allShownSelected,
                                                    onChange: toggleAll,
                                                    label: "Select all"
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                    lineNumber: 699,
                                                    columnNumber: 48
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 699,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "font-medium px-3 py-2",
                                                children: "Order"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 700,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "font-medium px-3 py-2",
                                                children: "Date"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 701,
                                                columnNumber: 17
                                            }, this),
                                            fulfillmentReady && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "font-medium px-3 py-2",
                                                children: "Delivery"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 702,
                                                columnNumber: 38
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "font-medium px-3 py-2",
                                                children: "Customer"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 703,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "font-medium px-3 py-2",
                                                children: "Channel"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 704,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "font-medium px-3 py-2",
                                                children: "Status"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 705,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "font-medium px-3 py-2",
                                                children: "Items"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 706,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "font-medium pl-3 pr-4 py-2 text-right",
                                                children: "Total"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 707,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 698,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/orders/page.tsx",
                                    lineNumber: 697,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    className: "divide-y divide-gray-100",
                                    children: loading ? Array.from({
                                        length: 6
                                    }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                colSpan: fulfillmentReady ? 9 : 8,
                                                className: "px-5 py-3.5",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-4 bg-gray-100 rounded animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                    lineNumber: 713,
                                                    columnNumber: 94
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 713,
                                                columnNumber: 31
                                            }, this)
                                        }, i, false, {
                                            fileName: "[project]/admin/app/orders/page.tsx",
                                            lineNumber: 713,
                                            columnNumber: 19
                                        }, this)) : shown.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            colSpan: fulfillmentReady ? 9 : 8,
                                            className: "py-14 text-center text-[#616161]",
                                            children: "No orders match this view."
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/orders/page.tsx",
                                            lineNumber: 716,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 716,
                                        columnNumber: 17
                                    }, this) : shown.map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            onClick: ()=>setSelectedOrderId(o.id),
                                            className: `cursor-pointer transition-colors ${selected.has(o.id) ? 'bg-[#f7f7f7]' : 'hover:bg-[#fafafa]'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "pl-4 py-3",
                                                    onClick: (e)=>e.stopPropagation(),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check3, {
                                                        checked: selected.has(o.id),
                                                        onChange: ()=>toggleOne(o.id),
                                                        label: `Select order ${o.orderId}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                        lineNumber: 720,
                                                        columnNumber: 84
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                    lineNumber: 720,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-3 font-semibold text-[#1a1a1a]",
                                                    children: [
                                                        "#",
                                                        o.orderId
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                    lineNumber: 721,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-3 text-[#616161] whitespace-nowrap",
                                                    children: fmtDate(o.createdAt)
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                    lineNumber: 722,
                                                    columnNumber: 21
                                                }, this),
                                                fulfillmentReady && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-3 whitespace-nowrap",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-[#303030]",
                                                            children: fmtDay(orderDelivery(o))
                                                        }, void 0, false, {
                                                            fileName: "[project]/admin/app/orders/page.tsx",
                                                            lineNumber: 725,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex gap-1 mt-0.5",
                                                            children: renderFlags(o)
                                                        }, void 0, false, {
                                                            fileName: "[project]/admin/app/orders/page.tsx",
                                                            lineNumber: 726,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                    lineNumber: 724,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-[#1a1a1a] font-medium",
                                                            children: customerName(o)
                                                        }, void 0, false, {
                                                            fileName: "[project]/admin/app/orders/page.tsx",
                                                            lineNumber: 730,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs text-[#616161]",
                                                            children: o.shipping?.phone || o.userPhone
                                                        }, void 0, false, {
                                                            fileName: "[project]/admin/app/orders/page.tsx",
                                                            lineNumber: 731,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                    lineNumber: 729,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-3 text-[#303030]",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "inline-flex items-center gap-1.5 text-[#616161]",
                                                        children: [
                                                            sourceIcon(String(o.orderSource)),
                                                            sourceLabel(String(o.orderSource))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                        lineNumber: 734,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                    lineNumber: 733,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-3",
                                                    onClick: (e)=>e.stopPropagation(),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusSelect, {
                                                        order: o,
                                                        busy: updatingStatusId === o.id,
                                                        onChange: (s)=>handleStatusChange(o, s)
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                        lineNumber: 737,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                    lineNumber: 736,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-3 py-3 text-[#616161] tabular-nums",
                                                    children: [
                                                        o.items.length,
                                                        " ",
                                                        o.items.length === 1 ? 'item' : 'items'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                    lineNumber: 739,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "pl-3 pr-4 py-3 text-right font-medium text-[#1a1a1a] tabular-nums",
                                                    children: formatCurrency(o.total)
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                    lineNumber: 740,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, o.id, true, {
                                            fileName: "[project]/admin/app/orders/page.tsx",
                                            lineNumber: 719,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/orders/page.tsx",
                                    lineNumber: 710,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/admin/app/orders/page.tsx",
                            lineNumber: 696,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/admin/app/orders/page.tsx",
                        lineNumber: 695,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "md:hidden mt-3 border-t border-gray-100 divide-y divide-gray-100",
                        children: loading ? Array.from({
                            length: 4
                        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-14 bg-gray-100 rounded-lg animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/orders/page.tsx",
                                    lineNumber: 751,
                                    columnNumber: 82
                                }, this)
                            }, i, false, {
                                fileName: "[project]/admin/app/orders/page.tsx",
                                lineNumber: 751,
                                columnNumber: 53
                            }, this)) : shown.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "py-12 text-center text-sm text-[#616161]",
                            children: "No orders match this view."
                        }, void 0, false, {
                            fileName: "[project]/admin/app/orders/page.tsx",
                            lineNumber: 753,
                            columnNumber: 13
                        }, this) : shown.map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>setSelectedOrderId(o.id),
                                className: "p-4 space-y-2.5 active:bg-[#fafafa]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start justify-between gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start gap-3 min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "pt-0.5",
                                                        onClick: (e)=>e.stopPropagation(),
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check3, {
                                                            checked: selected.has(o.id),
                                                            onChange: ()=>toggleOne(o.id),
                                                            label: `Select order ${o.orderId}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/admin/app/orders/page.tsx",
                                                            lineNumber: 759,
                                                            columnNumber: 82
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                        lineNumber: 759,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "min-w-0",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-semibold text-[#1a1a1a]",
                                                                children: [
                                                                    "#",
                                                                    o.orderId
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                                lineNumber: 761,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-[#303030] truncate",
                                                                children: customerName(o)
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                                lineNumber: 762,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-1 mt-1 flex-wrap",
                                                                children: renderFlags(o)
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                                lineNumber: 763,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                        lineNumber: 760,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 758,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-semibold text-[#1a1a1a] tabular-nums",
                                                children: formatCurrency(o.total)
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 766,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 757,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between gap-2 pl-8",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-[#616161] min-w-0 truncate",
                                                children: [
                                                    fulfillmentReady && orderDelivery(o) ? `Delivery ${fmtDay(orderDelivery(o))} · ` : '',
                                                    fmtDate(o.createdAt),
                                                    " · ",
                                                    o.items.length,
                                                    " ",
                                                    o.items.length === 1 ? 'item' : 'items'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 769,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                onClick: (e)=>e.stopPropagation(),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusSelect, {
                                                    order: o,
                                                    busy: updatingStatusId === o.id,
                                                    onChange: (s)=>handleStatusChange(o, s)
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                    lineNumber: 773,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 772,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 768,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, o.id, true, {
                                fileName: "[project]/admin/app/orders/page.tsx",
                                lineNumber: 756,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/admin/app/orders/page.tsx",
                        lineNumber: 749,
                        columnNumber: 9
                    }, this),
                    !loading && filtered.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm sm:text-[13px] text-[#616161]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Showing ",
                                    Math.min(visible, filtered.length),
                                    " of ",
                                    filtered.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/orders/page.tsx",
                                lineNumber: 783,
                                columnNumber: 13
                            }, this),
                            visible < filtered.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setVisible((v)=>v + PAGE_SIZE),
                                className: "min-h-9 py-1.5 px-3 rounded-lg bg-white font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50",
                                children: "Show more"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/orders/page.tsx",
                                lineNumber: 785,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/orders/page.tsx",
                        lineNumber: 782,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/orders/page.tsx",
                lineNumber: 632,
                columnNumber: 7
            }, this),
            selectedOrder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 bg-black/40 z-[60]",
                        onClick: ()=>!isSwapping && setSelectedOrderId(null)
                    }, void 0, false, {
                        fileName: "[project]/admin/app/orders/page.tsx",
                        lineNumber: 794,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "fixed inset-y-0 right-0 w-full max-w-xl bg-[#f1f1f1] shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-4 sm:px-5 py-3 bg-white border-b border-gray-200 flex items-start justify-between gap-3 shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 flex-wrap",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "text-base font-semibold text-[#1a1a1a]",
                                                        children: [
                                                            "#",
                                                            selectedOrder.orderId
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                        lineNumber: 799,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pill, {
                                                        tone: STATUS_TONE[selectedOrder.status] || STATUS_TONE.pending,
                                                        children: pretty(selectedOrder.status)
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                        lineNumber: 800,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 798,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-[#616161] mt-0.5 flex items-center gap-1.5",
                                                children: [
                                                    sourceIcon(String(selectedOrder.orderSource)),
                                                    " ",
                                                    sourceLabel(String(selectedOrder.orderSource)),
                                                    " · ",
                                                    fmtDate(selectedOrder.createdAt)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 802,
                                                columnNumber: 17
                                            }, this),
                                            fulfillmentReady && orderDelivery(selectedOrder) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-[#303030] mt-1 flex items-center gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarClock$3e$__["CalendarClock"], {
                                                        size: 12,
                                                        className: "text-[#616161]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                        lineNumber: 807,
                                                        columnNumber: 21
                                                    }, this),
                                                    " Delivery ",
                                                    fmtDay(orderDelivery(selectedOrder)),
                                                    batchName(selectedOrder) ? ` · ${batchName(selectedOrder)}` : ''
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 806,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 797,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSelectedOrderId(null),
                                        className: "p-2 -mr-2 rounded-lg hover:bg-gray-100",
                                        "aria-label": "Close",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            size: 18
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/orders/page.tsx",
                                            lineNumber: 811,
                                            columnNumber: 134
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 811,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/orders/page.tsx",
                                lineNumber: 796,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-[13px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                                        className: "p-4 space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-sm font-semibold text-[#1a1a1a] flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                        size: 15,
                                                        className: "text-[#616161]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                        lineNumber: 817,
                                                        columnNumber: 94
                                                    }, this),
                                                    " Customer"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 817,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-semibold text-[#1a1a1a]",
                                                        children: customerName(selectedOrder)
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                        lineNumber: 819,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[#616161] flex items-center gap-1.5 mt-0.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                                size: 13
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                                lineNumber: 820,
                                                                columnNumber: 82
                                                            }, this),
                                                            " ",
                                                            selectedOrder.shipping?.phone || selectedOrder.userPhone || '—'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                        lineNumber: 820,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 818,
                                                columnNumber: 17
                                            }, this),
                                            (()=>{
                                                const phone = selectedOrder.shipping?.phone || selectedOrder.userPhone || '';
                                                const ten = toIndianPhone(phone);
                                                return ten ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: `tel:+91${ten}`,
                                                            className: "min-h-9 py-1.5 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2d$call$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PhoneCall$3e$__["PhoneCall"], {
                                                                    size: 13
                                                                }, void 0, false, {
                                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                                    lineNumber: 827,
                                                                    columnNumber: 237
                                                                }, this),
                                                                " Call"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/admin/app/orders/page.tsx",
                                                            lineNumber: 827,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: `https://wa.me/91${ten}`,
                                                            target: "_blank",
                                                            rel: "noreferrer",
                                                            className: "min-h-9 py-1.5 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                                                    size: 13
                                                                }, void 0, false, {
                                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                                    lineNumber: 828,
                                                                    columnNumber: 279
                                                                }, this),
                                                                " WhatsApp"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/admin/app/orders/page.tsx",
                                                            lineNumber: 828,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                    lineNumber: 826,
                                                    columnNumber: 21
                                                }, this) : null;
                                            })(),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "pt-3 border-t border-gray-100 flex gap-2 items-start",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                        size: 15,
                                                        className: "text-[#616161] shrink-0 mt-0.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                        lineNumber: 833,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "flex-1 text-[#303030] leading-relaxed",
                                                        children: [
                                                            selectedOrder.shipping?.houseNumber ? `${selectedOrder.shipping.houseNumber}, ` : '',
                                                            selectedOrder.shipping?.address || 'No address on file',
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                                lineNumber: 837,
                                                                columnNumber: 21
                                                            }, this),
                                                            [
                                                                selectedOrder.shipping?.city,
                                                                selectedOrder.shipping?.pincode
                                                            ].filter(Boolean).join(' - ')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                        lineNumber: 834,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>copyAddress(selectedOrder),
                                                        className: "p-2 -m-1 rounded-lg text-[#616161] hover:bg-gray-100",
                                                        "aria-label": "Copy address",
                                                        title: "Copy address",
                                                        children: copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                            size: 15,
                                                            className: "text-[#014b40]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/admin/app/orders/page.tsx",
                                                            lineNumber: 841,
                                                            columnNumber: 31
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                            size: 15
                                                        }, void 0, false, {
                                                            fileName: "[project]/admin/app/orders/page.tsx",
                                                            lineNumber: 841,
                                                            columnNumber: 80
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                        lineNumber: 840,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 832,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 816,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                                        className: "overflow-hidden",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "px-4 py-3 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                                        size: 15,
                                                        className: "text-[#616161]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                        lineNumber: 849,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-sm font-semibold text-[#1a1a1a]",
                                                        children: [
                                                            "Items (",
                                                            selectedOrder.items.length,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                        lineNumber: 850,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 848,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "divide-y divide-gray-100 border-t border-gray-100",
                                                children: sortedItems.map((item, i)=>{
                                                    const canSwap = selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled';
                                                    const dThis = itemDate(selectedOrder, item);
                                                    const showHead = fulfillmentReady && multiDates && (i === 0 || dThis !== itemDate(selectedOrder, sortedItems[i - 1]));
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-4 space-y-3",
                                                        children: [
                                                            showHead && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs font-semibold text-[#303030] bg-[#f1f1f1] rounded-md px-2 py-1 w-fit flex items-center gap-1.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarClock$3e$__["CalendarClock"], {
                                                                        size: 12
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                                        lineNumber: 861,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    " Delivery ",
                                                                    fmtDay(dThis)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                                lineNumber: 860,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start justify-between gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "min-w-0",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "font-semibold text-[#1a1a1a]",
                                                                                children: item.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                                                lineNumber: 866,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs text-[#616161] mt-0.5",
                                                                                children: [
                                                                                    item.unit,
                                                                                    " · ",
                                                                                    formatCurrency(item.price),
                                                                                    " × ",
                                                                                    item.qty
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                                                lineNumber: 867,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                                        lineNumber: 865,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "font-medium text-[#1a1a1a] tabular-nums",
                                                                        children: formatCurrency(item.subtotal)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                                        lineNumber: 869,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                                lineNumber: 864,
                                                                columnNumber: 25
                                                            }, this),
                                                            renderFulfillment(selectedOrder, item),
                                                            replacingItemId === item.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "rounded-lg bg-[#f7f7f7] p-3 space-y-2.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "font-semibold text-[#1a1a1a]",
                                                                        children: [
                                                                            "Replace ",
                                                                            item.name
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                                        lineNumber: 876,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        value: replacementSearch,
                                                                        onChange: (e)=>setReplacementSearch(e.target.value),
                                                                        placeholder: "Search replacement product",
                                                                        className: inputCls
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                                        lineNumber: 877,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                        value: selectedReplacementVariant,
                                                                        onChange: (e)=>setSelectedReplacementVariant(e.target.value),
                                                                        className: `${inputCls} cursor-pointer`,
                                                                        children: [
                                                                            replacementOptions.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "",
                                                                                children: "No matching products"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                                                lineNumber: 879,
                                                                                columnNumber: 67
                                                                            }, this),
                                                                            replacementOptions.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("optgroup", {
                                                                                    label: p.name,
                                                                                    children: p.product_variants.map((v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                            value: v.id,
                                                                                            children: [
                                                                                                v.unit,
                                                                                                " — ₹",
                                                                                                v.price
                                                                                            ]
                                                                                        }, v.id, true, {
                                                                                            fileName: "[project]/admin/app/orders/page.tsx",
                                                                                            lineNumber: 883,
                                                                                            columnNumber: 37
                                                                                        }, this))
                                                                                }, p.id, false, {
                                                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                                                    lineNumber: 881,
                                                                                    columnNumber: 33
                                                                                }, this))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                                        lineNumber: 878,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        value: replaceReason,
                                                                        onChange: (e)=>setReplaceReason(e.target.value),
                                                                        placeholder: "Reason for replacement",
                                                                        className: inputCls
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                                        lineNumber: 888,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex gap-2 pt-0.5",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: ()=>handleExecuteSwapItem(item),
                                                                                disabled: isSwapping || !selectedReplacementVariant,
                                                                                className: "flex-1 min-h-10 sm:min-h-9 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-sm sm:text-[13px] font-medium text-white disabled:opacity-50 inline-flex items-center justify-center gap-2",
                                                                                children: isSwapping ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                                            size: 14,
                                                                                            className: "animate-spin"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/admin/app/orders/page.tsx",
                                                                                            lineNumber: 891,
                                                                                            columnNumber: 49
                                                                                        }, this),
                                                                                        " Replacing…"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                                                    lineNumber: 891,
                                                                                    columnNumber: 47
                                                                                }, this) : 'Confirm replacement'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                                                lineNumber: 890,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: ()=>setReplacingItemId(null),
                                                                                disabled: isSwapping,
                                                                                className: "min-h-10 sm:min-h-9 px-3 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50",
                                                                                children: "Cancel"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                                                lineNumber: 893,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                                        lineNumber: 889,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                                lineNumber: 875,
                                                                columnNumber: 27
                                                            }, this) : canSwap ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>setReplacingItemId(item.id),
                                                                className: "min-h-9 py-1.5 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                                        size: 13
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                                        lineNumber: 898,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    " Replace item"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                                lineNumber: 897,
                                                                columnNumber: 27
                                                            }, this) : null
                                                        ]
                                                    }, item.id || i, true, {
                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                        lineNumber: 858,
                                                        columnNumber: 23
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 852,
                                                columnNumber: 17
                                            }, this),
                                            (()=>{
                                                const sub = selectedOrder.items.reduce((s, i)=>s + (Number(i.subtotal) || 0), 0);
                                                const extra = Number(selectedOrder.total) - sub;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "border-t border-gray-100 p-4 space-y-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between text-[#616161]",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "Subtotal"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                                    lineNumber: 912,
                                                                    columnNumber: 76
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "tabular-nums",
                                                                    children: formatCurrency(sub)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                                    lineNumber: 912,
                                                                    columnNumber: 97
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/admin/app/orders/page.tsx",
                                                            lineNumber: 912,
                                                            columnNumber: 23
                                                        }, this),
                                                        Math.abs(extra) > 0.5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between text-[#616161]",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "Delivery & other"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                                    lineNumber: 913,
                                                                    columnNumber: 102
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "tabular-nums",
                                                                    children: formatCurrency(extra)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                                    lineNumber: 913,
                                                                    columnNumber: 131
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/admin/app/orders/page.tsx",
                                                            lineNumber: 913,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between font-semibold text-[#1a1a1a] text-sm pt-1.5 border-t border-gray-100",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "Total"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                                    lineNumber: 914,
                                                                    columnNumber: 130
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "tabular-nums",
                                                                    children: formatCurrency(selectedOrder.total)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                                    lineNumber: 914,
                                                                    columnNumber: 148
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/admin/app/orders/page.tsx",
                                                            lineNumber: 914,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/admin/app/orders/page.tsx",
                                                    lineNumber: 911,
                                                    columnNumber: 21
                                                }, this);
                                            })()
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 847,
                                        columnNumber: 15
                                    }, this),
                                    selectedOrder.itemChanges && selectedOrder.itemChanges.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                                        className: "p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-sm font-semibold text-[#1a1a1a] flex items-center gap-2 mb-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"], {
                                                        size: 15,
                                                        className: "text-[#616161]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                        lineNumber: 923,
                                                        columnNumber: 101
                                                    }, this),
                                                    " Item changes"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 923,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                                className: "relative border-l border-gray-200 ml-1.5 space-y-4",
                                                children: selectedOrder.itemChanges.map((ch, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        className: "pl-4 relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#303030] ring-2 ring-white"
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                                lineNumber: 927,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-medium text-[#1a1a1a]",
                                                                children: [
                                                                    pretty(ch.change_type),
                                                                    ch.reason ? ` · ${ch.reason}` : ''
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                                lineNumber: 928,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-[#616161] mt-0.5",
                                                                children: [
                                                                    "₹",
                                                                    ch.old_unit_price,
                                                                    " → ₹",
                                                                    ch.new_unit_price
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                                lineNumber: 929,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-[#8a8a8a] mt-0.5",
                                                                children: fmtDate(ch.created_at)
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                                lineNumber: 930,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, i, true, {
                                                        fileName: "[project]/admin/app/orders/page.tsx",
                                                        lineNumber: 926,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 924,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 922,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/orders/page.tsx",
                                lineNumber: 814,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 bg-white border-t border-gray-200 shrink-0 flex flex-wrap items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>printOrder(selectedOrder),
                                        className: "min-h-11 sm:min-h-9 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                                size: 14
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/orders/page.tsx",
                                                lineNumber: 941,
                                                columnNumber: 17
                                            }, this),
                                            " Print"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 940,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 min-w-[160px]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusSelect, {
                                            order: selectedOrder,
                                            busy: updatingStatusId === selectedOrder.id,
                                            onChange: (s)=>handleStatusChange(selectedOrder, s),
                                            block: true
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/orders/page.tsx",
                                            lineNumber: 944,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/orders/page.tsx",
                                        lineNumber: 943,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/orders/page.tsx",
                                lineNumber: 939,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/orders/page.tsx",
                        lineNumber: 795,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/orders/page.tsx",
                lineNumber: 793,
                columnNumber: 9
            }, this),
            toast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                role: "status",
                className: `fixed bottom-5 left-1/2 -translate-x-1/2 z-[120] max-w-[90vw] px-4 py-2.5 rounded-lg text-sm sm:text-[13px] shadow-lg ${toast.type === 'error' ? 'bg-[#fed1d7] text-[#8e0b21]' : 'bg-[#303030] text-white'}`,
                children: toast.text
            }, void 0, false, {
                fileName: "[project]/admin/app/orders/page.tsx",
                lineNumber: 953,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/admin/app/orders/page.tsx",
        lineNumber: 606,
        columnNumber: 5
    }, this);
}
_s(AdminOrders, "KsKxPJbZaXrKQVSfOg66vJ3sZoA=");
_c = AdminOrders;
// ---------- UI primitives ----------
function Card({ children, className = '' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/admin/app/orders/page.tsx",
        lineNumber: 964,
        columnNumber: 10
    }, this);
}
_c1 = Card;
function Kpi({ label, value, warn, loading }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4 sm:p-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm sm:text-[13px] text-[#616161]",
                children: label
            }, void 0, false, {
                fileName: "[project]/admin/app/orders/page.tsx",
                lineNumber: 970,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-7 w-20 bg-gray-100 rounded mt-2 animate-pulse"
            }, void 0, false, {
                fileName: "[project]/admin/app/orders/page.tsx",
                lineNumber: 971,
                columnNumber: 18
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: `text-[22px] font-semibold mt-1.5 leading-none ${warn ? 'text-[#5e4200]' : 'text-[#1a1a1a]'}`,
                children: value
            }, void 0, false, {
                fileName: "[project]/admin/app/orders/page.tsx",
                lineNumber: 971,
                columnNumber: 88
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/admin/app/orders/page.tsx",
        lineNumber: 969,
        columnNumber: 5
    }, this);
}
_c2 = Kpi;
function Pill({ children, tone }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center px-2 h-5 rounded-full text-[11px] font-medium whitespace-nowrap ${tone}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/admin/app/orders/page.tsx",
        lineNumber: 977,
        columnNumber: 10
    }, this);
}
_c3 = Pill;
function Check3({ checked, onChange, label }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: "checkbox",
        checked: checked,
        onChange: onChange,
        "aria-label": label,
        className: "w-4 h-4 rounded border-gray-300 accent-[#303030] cursor-pointer"
    }, void 0, false, {
        fileName: "[project]/admin/app/orders/page.tsx",
        lineNumber: 981,
        columnNumber: 10
    }, this);
}
_c4 = Check3;
function StatusSelect({ order, busy, onChange, block }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative ${block ? 'w-full' : 'inline-block'}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                value: order.status,
                disabled: busy,
                onChange: (e)=>onChange(e.target.value),
                "aria-label": `Status for order ${order.orderId}`,
                className: `appearance-none cursor-pointer outline-none font-medium disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[#005bd3] ${block ? `w-full min-h-11 sm:min-h-9 pl-3 pr-8 rounded-lg text-sm sm:text-[13px] shadow-[0_0_0_1px_rgba(0,0,0,0.15)] bg-white text-[#303030]` : `min-h-8 pl-2.5 pr-7 rounded-full text-xs ${STATUS_TONE[order.status] || STATUS_TONE.pending}`}`,
                children: STATUSES.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: s.value,
                        children: block ? `Status: ${s.label}` : s.label
                    }, s.value, false, {
                        fileName: "[project]/admin/app/orders/page.tsx",
                        lineNumber: 998,
                        columnNumber: 30
                    }, this))
            }, void 0, false, {
                fileName: "[project]/admin/app/orders/page.tsx",
                lineNumber: 987,
                columnNumber: 7
            }, this),
            busy ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                size: 12,
                className: "absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin pointer-events-none"
            }, void 0, false, {
                fileName: "[project]/admin/app/orders/page.tsx",
                lineNumber: 1001,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                size: block ? 14 : 12,
                className: `absolute top-1/2 -translate-y-1/2 pointer-events-none ${block ? 'right-3 text-[#616161]' : 'right-2.5 opacity-70'}`
            }, void 0, false, {
                fileName: "[project]/admin/app/orders/page.tsx",
                lineNumber: 1003,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/admin/app/orders/page.tsx",
        lineNumber: 986,
        columnNumber: 5
    }, this);
}
_c5 = StatusSelect;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "AdminOrders");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "Kpi");
__turbopack_context__.k.register(_c3, "Pill");
__turbopack_context__.k.register(_c4, "Check3");
__turbopack_context__.k.register(_c5, "StatusSelect");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/admin/features/orders/repositories/orders.repository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "listAdminOrders",
    ()=>listAdminOrders,
    "listReplacementProducts",
    ()=>listReplacementProducts,
    "replaceOrderItem",
    ()=>replaceOrderItem,
    "updateOrderStatus",
    ()=>updateOrderStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$orders$2f$schemas$2f$order$2e$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/features/orders/schemas/order.schema.ts [app-client] (ecmascript)");
;
;
async function listAdminOrders() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('orders').select('*, order_items(*), order_status_history(*), order_item_changes(*)').order('created_at', {
        ascending: false
    });
    if (error) throw error;
    return __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$orders$2f$schemas$2f$order$2e$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminOrderRowSchema"].array().parse(data).map((order)=>({
            id: order.id,
            orderId: `RB-${order.order_number || order.id.slice(0, 6).toUpperCase()}`,
            createdAt: order.created_at,
            status: order.status || 'pending',
            orderSource: order.order_source || 'online_web',
            total: order.total,
            subtotal: order.subtotal,
            deliveryFee: order.delivery_fee || 0,
            discount: order.discount || 0,
            shipping: order.delivery_address,
            userPhone: order.user_phone,
            userName: order.user_name,
            itemChanges: order.order_item_changes || [],
            items: (order.order_items || []).map((item)=>({
                    id: item.id,
                    productId: item.product_id,
                    variantId: item.variant_id,
                    name: item.product_name,
                    qty: item.quantity,
                    price: item.price,
                    subtotal: item.total_price,
                    unit: item.variant_unit || 'pack'
                }))
        }));
}
async function listReplacementProducts() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('products').select('id, name, product_variants(id, unit, price)').order('name');
    if (error) throw error;
    return __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$orders$2f$schemas$2f$order$2e$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["replacementProductSchema"].array().parse(data);
}
async function updateOrderStatus(orderId, status) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('orders').update({
        status,
        updated_at: new Date().toISOString()
    }).eq('id', orderId);
    if (error) throw error;
    const { error: historyError } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('order_status_history').insert({
        order_id: orderId,
        status,
        notes: `Order status updated to ${status} by Admin`
    });
    if (historyError) throw historyError;
}
async function replaceOrderItem(input) {
    const { data: replacement, error: variantError } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('product_variants').select('*, products(*)').eq('id', input.replacementVariantId).single();
    if (variantError) throw variantError;
    if (!replacement) throw new Error('Replacement variant not found');
    const newPrice = Number(replacement.price);
    const newSubtotal = newPrice * input.item.qty;
    const subtotalDiff = newSubtotal - input.item.subtotal;
    const updatedSubtotal = input.orderSubtotal + subtotalDiff;
    const updatedTotal = Math.max(0, updatedSubtotal - input.orderDiscount + input.deliveryFee);
    const { error: itemError } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('order_items').update({
        product_id: replacement.product_id,
        variant_id: replacement.id,
        product_name: replacement.products?.name || 'Replacement Item',
        variant_unit: replacement.unit,
        product_image: replacement.products?.image_url,
        price: newPrice,
        total_price: newSubtotal
    }).eq('id', input.item.id);
    if (itemError) throw itemError;
    const { error: orderError } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('orders').update({
        subtotal: updatedSubtotal,
        total: updatedTotal,
        updated_at: new Date().toISOString()
    }).eq('id', input.orderId);
    if (orderError) throw orderError;
    const { error: auditError } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('order_item_changes').insert({
        order_id: input.orderId,
        order_item_id: input.item.id,
        change_type: 'replace',
        old_product_id: input.item.productId,
        old_variant_id: input.item.variantId,
        old_quantity: input.item.qty,
        old_unit_price: input.item.price,
        new_product_id: replacement.product_id,
        new_variant_id: replacement.id,
        new_quantity: input.item.qty,
        new_unit_price: newPrice,
        reason: input.reason
    });
    if (auditError) throw auditError;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/admin/features/orders/schemas/order.schema.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adminOrderRowSchema",
    ()=>adminOrderRowSchema,
    "manualOrderInputSchema",
    ()=>manualOrderInputSchema,
    "manualOrderProductSchema",
    ()=>manualOrderProductSchema,
    "replacementProductSchema",
    ()=>replacementProductSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z .object>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z .string>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z .array>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$coerce$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z .coerce>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$union$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z .union>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z .number>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z .enum>");
;
const manualOrderProductSchema = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
    image_url: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().nullable(),
    product_variants: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
        unit: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
        price: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$coerce$3e$__["z"].coerce.number()
    })).nullable()
});
const adminOrderRowSchema = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
    order_number: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$union$3e$__["z"].union([
        __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number(),
        __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string()
    ]).nullable(),
    created_at: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().nullable(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().nullable(),
    order_source: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().nullable(),
    total: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$coerce$3e$__["z"].coerce.number(),
    subtotal: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$coerce$3e$__["z"].coerce.number(),
    delivery_fee: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$coerce$3e$__["z"].coerce.number().nullable(),
    discount: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$coerce$3e$__["z"].coerce.number().nullable(),
    delivery_address: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        name: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().nullable().optional(),
        phone: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().nullable().optional(),
        houseNumber: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().nullable().optional(),
        address: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().nullable().optional(),
        city: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().nullable().optional(),
        pincode: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().nullable().optional()
    }).nullable(),
    user_phone: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().nullable(),
    user_name: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().nullable(),
    order_items: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
        product_id: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().nullable(),
        variant_id: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().nullable(),
        product_name: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
        quantity: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$coerce$3e$__["z"].coerce.number(),
        price: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$coerce$3e$__["z"].coerce.number(),
        total_price: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$coerce$3e$__["z"].coerce.number(),
        variant_unit: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().nullable()
    })).nullable(),
    order_item_changes: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        change_type: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
        reason: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().nullable(),
        old_unit_price: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$coerce$3e$__["z"].coerce.number(),
        new_unit_price: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$coerce$3e$__["z"].coerce.number(),
        created_at: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string()
    })).nullable()
});
const replacementProductSchema = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
    product_variants: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
        unit: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
        price: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$coerce$3e$__["z"].coerce.number()
    })).nullable()
});
const manualOrderInputSchema = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    customer: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        name: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(1, 'Customer Name is required.'),
        phone: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(1, 'Phone Number is required.'),
        houseNo: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
        area: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
        city: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
        pincode: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
        source: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum([
            'whatsapp',
            'phone',
            'walk_in',
            'admin'
        ]),
        paymentMethod: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum([
            'cod',
            'upi',
            'paid'
        ])
    }),
    items: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        variantId: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().min(1),
        productId: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().min(1),
        name: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(1),
        unit: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
        price: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().finite().min(0),
        qty: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().int().positive(),
        img: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string()
    })).min(1, 'Please add at least one item to the order.'),
    deliveryFee: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().finite().min(0),
    manualDiscount: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().finite().min(0),
    subtotal: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().finite().min(0),
    total: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().finite().min(0)
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/admin/features/orders/services/orders.service.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "changeAdminOrderStatus",
    ()=>changeAdminOrderStatus,
    "swapAdminOrderItem",
    ()=>swapAdminOrderItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$orders$2f$repositories$2f$orders$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/features/orders/repositories/orders.repository.ts [app-client] (ecmascript)");
;
;
async function changeAdminOrderStatus(orderId, status) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$orders$2f$repositories$2f$orders$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateOrderStatus"])(orderId, status);
}
async function swapAdminOrderItem(input) {
    if (!input.replacementVariantId) throw new Error('Select replacement variant.');
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$orders$2f$repositories$2f$orders$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["replaceOrderItem"])({
        orderId: input.order.id,
        orderSubtotal: input.order.subtotal,
        orderDiscount: input.order.discount,
        deliveryFee: input.order.deliveryFee,
        item: input.item,
        replacementVariantId: input.replacementVariantId,
        reason: input.reason
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);})()

//# sourceMappingURL=admin_0-d49y2j-f-1c._.js.map