(()=>{"use strict";(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/admin/app/settings/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StoreSettingsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/admin/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$services$2f$store$2d$settings$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/features/settings/services/store-settings.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$repositories$2f$payment$2d$gateways$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/features/settings/repositories/payment-gateways.repository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$services$2f$gateway$2d$verification$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/features/settings/services/gateway-verification.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$repositories$2f$delivery$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/features/settings/repositories/delivery.repository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/store.js [app-client] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$toggle$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleLeft$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/toggle-left.js [app-client] (ecmascript) <export default as ToggleLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$toggle$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleRight$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/toggle-right.js [app-client] (ecmascript) <export default as ToggleRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/credit-card.js [app-client] (ecmascript) <export default as CreditCard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-client] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as Layers>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function extractErrorMessage(err) {
    if (!err) return 'Unknown error';
    if (err instanceof Error) return err.message;
    if (typeof err === 'object') {
        const obj = err;
        if (typeof obj.message === 'string' && obj.message) return obj.message;
        if (typeof obj.error_description === 'string' && obj.error_description) return obj.error_description;
        if (typeof obj.details === 'string' && obj.details) return obj.details;
        if (typeof obj.hint === 'string' && obj.hint) return `${obj.message || 'Error'} (${obj.hint})`;
        try {
            const str = JSON.stringify(err);
            if (str !== '{}') return str;
        } catch  {
        // ignore
        }
    }
    return String(err);
}
const SETTINGS_TABS = [
    {
        id: 'payments',
        label: 'Payment gateway',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"]
    },
    {
        id: 'store',
        label: 'Store status & GPS',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"]
    },
    {
        id: 'delivery',
        label: 'Delivery & shipping',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"]
    }
];
const DEFAULT_GATEWAY_ROSTER = [
    {
        id: 'razorpay',
        name: 'Razorpay',
        code: 'RP',
        description: "India's leading payment gateway.",
        tags: [
            'UPI',
            'Cards',
            'Net Banking'
        ],
        status: 'not_connected',
        keyId: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        secretKey: '',
        webhookSecret: ''
    },
    {
        id: 'phonepe',
        name: 'PhonePe PG',
        code: 'PP',
        description: 'Fast UPI-first checkout.',
        tags: [
            'UPI',
            'Cards',
            'Wallets'
        ],
        status: 'coming_soon',
        keyId: '',
        secretKey: '',
        webhookSecret: ''
    },
    {
        id: 'cashfree',
        name: 'Cashfree',
        code: 'CF',
        description: 'Reliable settlements.',
        tags: [
            'UPI',
            'Cards',
            'Net Banking'
        ],
        status: 'coming_soon',
        keyId: '',
        secretKey: '',
        webhookSecret: ''
    },
    {
        id: 'paytm',
        name: 'Paytm Business',
        code: 'PT',
        description: 'Widely recognised checkout.',
        tags: [
            'UPI',
            'Wallets'
        ],
        status: 'coming_soon',
        keyId: '',
        secretKey: '',
        webhookSecret: ''
    }
];
function StoreSettingsPage() {
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('payments');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Store General Info & Location
    const [isStoreOpen, setIsStoreOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [storeName, setStoreName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Royal Bengal');
    const [storeAddress, setStoreAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Madhapur, Hyderabad');
    const [storeLatitude, setStoreLatitude] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(17.351452);
    const [storeLongitude, setStoreLongitude] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(78.391039);
    // Payment Gateways Roster
    const [gateways, setGateways] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activeConnectedId, setActiveConnectedId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('razorpay');
    const [showConfigModal, setShowConfigModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editKeys, setEditKeys] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        keyId: '',
        secretKey: '',
        webhookSecret: ''
    });
    const [showSecret, setShowSecret] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [copiedWebhook, setCopiedWebhook] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [savingSettings, setSavingSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Modal Visual Feedback & Progress State
    const [syncStatus, setSyncStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [syncStepMessage, setSyncStepMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [syncErrorMsg, setSyncErrorMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [syncSuccessMsg, setSyncSuccessMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [modalSetAsActive, setModalSetAsActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Payment Receipts & Toggles
    const [allowPartialPayments, setAllowPartialPayments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sendWhatsappReceipt, setSendWhatsappReceipt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [sendEmailReceipt, setSendEmailReceipt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [enableCod, setEnableCod] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Test Connection Amount
    const [testAmount, setTestAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('10');
    const [testingConnection, setTestingConnection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Delivery Settings & Rule Engine State (Preserving User Presets)
    const [deliverySettings, setDeliverySettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        storeLatitude: 17.351452,
        storeLongitude: 78.391039,
        deliveryPricingMode: 'rules'
    });
    const [deliveryRules, setDeliveryRules] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [savingDeliverySettings, setSavingDeliverySettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Delivery Pricing Presets & Editable Fields
    const [isFreeDeliveryEnabled, setIsFreeDeliveryEnabled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [deliveryMode, setDeliveryMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('preset_rules');
    const [flatDeliveryFee, setFlatDeliveryFee] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(30);
    // Preset 2-Zone Values (Editable)
    const [presetZoneRadius, setPresetZoneRadius] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(5);
    const [presetZone1Subtotal, setPresetZone1Subtotal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(299);
    const [presetZone1Fee, setPresetZone1Fee] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(30);
    const [presetZone2Subtotal, setPresetZone2Subtotal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(499);
    const [presetZone2Fee, setPresetZone2Fee] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(30);
    // Distance Tiered 3-Zone Values (Editable)
    const [tier1Km, setTier1Km] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(5);
    const [tier1Subtotal, setTier1Subtotal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(299);
    const [tier1Fee, setTier1Fee] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(30);
    const [tier2Km, setTier2Km] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(10);
    const [tier2Subtotal, setTier2Subtotal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(500);
    const [tier2Fee, setTier2Fee] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(30);
    const [tier3Subtotal, setTier3Subtotal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(699);
    const [tier3Fee, setTier3Fee] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(30);
    // Fetch Live Settings & Gateways from Supabase
    const fetchAllSettings = async ()=>{
        setLoading(true);
        try {
            // 1. Fetch Store Settings
            try {
                const storeData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$services$2f$store$2d$settings$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAdminStoreSettings"])();
                setIsStoreOpen(storeData.isStoreOpen);
                setStoreName(storeData.storeName);
                setStoreAddress(storeData.storeAddress);
                if (storeData.latitude) setStoreLatitude(storeData.latitude);
                if (storeData.longitude) setStoreLongitude(storeData.longitude);
            } catch (error) {
                console.error('Error fetching store settings:', error);
            }
            // 2. Fetch Payment Gateways
            const gwData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$repositories$2f$payment$2d$gateways$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchPaymentGatewaysWithCredentials"])();
            const gwMap = new Map();
            if (Array.isArray(gwData)) {
                gwData.forEach((g)=>{
                    const pId = (g.provider || g.id).toLowerCase();
                    gwMap.set(pId, g);
                });
            }
            let activeFound = false;
            const mergedGateways = DEFAULT_GATEWAY_ROSTER.map((defaultGw)=>{
                const dbGw = gwMap.get(defaultGw.id);
                if (!dbGw) {
                    return defaultGw;
                }
                const keyId = dbGw.key_id || defaultGw.keyId;
                const isConnected = Boolean(dbGw.is_active && keyId);
                if (isConnected) {
                    setActiveConnectedId(defaultGw.id);
                    activeFound = true;
                }
                const isComingSoon = defaultGw.status === 'coming_soon' && !isConnected;
                return {
                    ...defaultGw,
                    name: dbGw.display_name || defaultGw.name,
                    status: isConnected ? 'connected' : isComingSoon ? 'coming_soon' : 'not_connected',
                    keyId: keyId
                };
            });
            if (!activeFound) {
                setActiveConnectedId('');
            }
            setGateways(mergedGateways);
            // 3. Fetch Delivery Settings & Dynamic Rules Engine
            try {
                const [dSet, dRules] = await Promise.all([
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$repositories$2f$delivery$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchDeliverySettingsRow"])(),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$repositories$2f$delivery$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchDeliveryFeeRulesList"])()
                ]);
                setDeliverySettings(dSet);
                setDeliveryRules(dRules);
            } catch (err) {
                console.warn('Error fetching delivery settings or rules:', err);
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StoreSettingsPage.useEffect": ()=>{
            fetchAllSettings();
        }
    }["StoreSettingsPage.useEffect"], []);
    const handleSaveStoreSettings = async ()=>{
        setSavingSettings(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$services$2f$store$2d$settings$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveAdminStoreSettings"])({
                isStoreOpen,
                storeName,
                storeAddress,
                latitude: storeLatitude,
                longitude: storeLongitude
            });
            alert("✅ Store Settings & Location saved live to Supabase PostgreSQL!");
            await fetchAllSettings();
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "Failed to save settings");
        } finally{
            setSavingSettings(false);
        }
    };
    const handleSaveDeliveryConfiguration = async ()=>{
        setSavingDeliverySettings(true);
        try {
            // 1. Save main delivery_settings row
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$repositories$2f$delivery$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveDeliverySettingsRow"])({
                ...deliverySettings,
                deliveryPricingMode: !isFreeDeliveryEnabled ? 'distance_based' : 'rules'
            });
            // 2. Generate non-overlapping rule list based on admin inputs
            const generatedRules = [];
            if (!isFreeDeliveryEnabled) {
                // Flat Fee Mode
                generatedRules.push({
                    name: `Flat delivery fee (₹${flatDeliveryFee})`,
                    minDistanceKm: 0,
                    maxDistanceKm: null,
                    minOrderAmount: 0,
                    maxOrderAmount: null,
                    minCheckoutSubtotal: 0,
                    feeType: 'fixed',
                    feeAmount: flatDeliveryFee,
                    priority: 1,
                    isActive: true
                });
            } else if (deliveryMode === 'preset_rules') {
                // Mode A: 2-Zone Preset Rules
                const safeRadius = Math.max(1, presetZoneRadius);
                // Zone 1 Free Tier
                generatedRules.push({
                    name: `Free delivery within ${safeRadius} km (orders > ₹${presetZone1Subtotal})`,
                    minDistanceKm: 0,
                    maxDistanceKm: safeRadius,
                    minOrderAmount: presetZone1Subtotal,
                    maxOrderAmount: null,
                    minCheckoutSubtotal: 0,
                    feeType: 'free',
                    feeAmount: 0,
                    priority: 1,
                    isActive: true
                });
                // Zone 1 Standard Fee
                generatedRules.push({
                    name: `Standard fee within ${safeRadius} km (orders <= ₹${presetZone1Subtotal})`,
                    minDistanceKm: 0,
                    maxDistanceKm: safeRadius,
                    minOrderAmount: 0,
                    maxOrderAmount: presetZone1Subtotal,
                    minCheckoutSubtotal: 0,
                    feeType: 'fixed',
                    feeAmount: presetZone1Fee,
                    priority: 2,
                    isActive: true
                });
                // Zone 2 Free Tier
                generatedRules.push({
                    name: `Free delivery beyond ${safeRadius} km (orders > ₹${presetZone2Subtotal})`,
                    minDistanceKm: safeRadius,
                    maxDistanceKm: null,
                    minOrderAmount: presetZone2Subtotal,
                    maxOrderAmount: null,
                    minCheckoutSubtotal: 0,
                    feeType: 'free',
                    feeAmount: 0,
                    priority: 3,
                    isActive: true
                });
                // Zone 2 Standard Fee
                generatedRules.push({
                    name: `Standard fee beyond ${safeRadius} km (orders <= ₹${presetZone2Subtotal})`,
                    minDistanceKm: safeRadius,
                    maxDistanceKm: null,
                    minOrderAmount: 0,
                    maxOrderAmount: presetZone2Subtotal,
                    minCheckoutSubtotal: 0,
                    feeType: 'fixed',
                    feeAmount: presetZone2Fee,
                    priority: 4,
                    isActive: true
                });
            } else {
                // Mode B: Distance-Tiered 3-Zone Rules
                const safeTier1 = Math.max(1, tier1Km);
                const safeTier2 = Math.max(safeTier1 + 1, tier2Km);
                // Tier 1 (0 to safeTier1 km)
                generatedRules.push({
                    name: `Free delivery within ${safeTier1} km (orders > ₹${tier1Subtotal})`,
                    minDistanceKm: 0,
                    maxDistanceKm: safeTier1,
                    minOrderAmount: tier1Subtotal,
                    maxOrderAmount: null,
                    minCheckoutSubtotal: 0,
                    feeType: 'free',
                    feeAmount: 0,
                    priority: 1,
                    isActive: true
                });
                generatedRules.push({
                    name: `Standard fee within ${safeTier1} km (orders <= ₹${tier1Subtotal})`,
                    minDistanceKm: 0,
                    maxDistanceKm: safeTier1,
                    minOrderAmount: 0,
                    maxOrderAmount: tier1Subtotal,
                    minCheckoutSubtotal: 0,
                    feeType: 'fixed',
                    feeAmount: tier1Fee,
                    priority: 2,
                    isActive: true
                });
                // Tier 2 (safeTier1 to safeTier2 km)
                generatedRules.push({
                    name: `Free delivery ${safeTier1}-${safeTier2} km (orders > ₹${tier2Subtotal})`,
                    minDistanceKm: safeTier1,
                    maxDistanceKm: safeTier2,
                    minOrderAmount: tier2Subtotal,
                    maxOrderAmount: null,
                    minCheckoutSubtotal: 0,
                    feeType: 'free',
                    feeAmount: 0,
                    priority: 3,
                    isActive: true
                });
                generatedRules.push({
                    name: `Standard fee ${safeTier1}-${safeTier2} km (orders <= ₹${tier2Subtotal})`,
                    minDistanceKm: safeTier1,
                    maxDistanceKm: safeTier2,
                    minOrderAmount: 0,
                    maxOrderAmount: tier2Subtotal,
                    minCheckoutSubtotal: 0,
                    feeType: 'fixed',
                    feeAmount: tier2Fee,
                    priority: 4,
                    isActive: true
                });
                // Tier 3 (Beyond safeTier2 km)
                generatedRules.push({
                    name: `Free delivery beyond ${safeTier2} km (orders > ₹${tier3Subtotal})`,
                    minDistanceKm: safeTier2,
                    maxDistanceKm: null,
                    minOrderAmount: tier3Subtotal,
                    maxOrderAmount: null,
                    minCheckoutSubtotal: 0,
                    feeType: 'free',
                    feeAmount: 0,
                    priority: 5,
                    isActive: true
                });
                generatedRules.push({
                    name: `Standard fee beyond ${safeTier2} km (orders <= ₹${tier3Subtotal})`,
                    minDistanceKm: safeTier2,
                    maxDistanceKm: null,
                    minOrderAmount: 0,
                    maxOrderAmount: tier3Subtotal,
                    minCheckoutSubtotal: 0,
                    feeType: 'fixed',
                    feeAmount: tier3Fee,
                    priority: 6,
                    isActive: true
                });
            }
            // Replace existing rules with generated non-overlapping rules
            const existing = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$repositories$2f$delivery$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchDeliveryFeeRulesList"])();
            for (const oldRule of existing){
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$repositories$2f$delivery$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteDeliveryFeeRuleRecord"])(oldRule.id);
            }
            for (const newRule of generatedRules){
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$repositories$2f$delivery$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["upsertDeliveryFeeRuleRecord"])(newRule);
            }
            alert('✅ Delivery rules & pricing updated live on Supabase!');
            setDeliveryRules(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$repositories$2f$delivery$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchDeliveryFeeRulesList"])());
        } catch (err) {
            console.error('Error saving delivery configuration:', err);
            alert('Failed to save delivery rules: ' + extractErrorMessage(err));
        } finally{
            setSavingDeliverySettings(false);
        }
    };
    const activeConnectedGw = gateways.find((g)=>g.id === activeConnectedId && g.status === 'connected');
    const webhookUrl = `${(("TURBOPACK compile-time value", "https://xsdkpbvvbjzvchlsdizi.supabase.co") || 'https://xsdkpbvvbjzvchlsdizi.supabase.co').replace(/\/$/, '')}/functions/v1/razorpay-webhook`;
    const handleCopyWebhook = ()=>{
        navigator.clipboard.writeText(webhookUrl);
        setCopiedWebhook(true);
        setTimeout(()=>setCopiedWebhook(false), 2000);
    };
    const handleOpenConnectModal = (gw)=>{
        setEditKeys({
            keyId: gw.keyId,
            secretKey: gw.secretKey,
            webhookSecret: gw.webhookSecret
        });
        setModalSetAsActive(gw.id === activeConnectedId || !activeConnectedId);
        setSyncStatus('idle');
        setSyncStepMessage('');
        setSyncErrorMsg('');
        setSyncSuccessMsg('');
        setShowConfigModal(gw.id);
    };
    const handleActivateGateway = async (gwId)=>{
        const gw = gateways.find((g)=>g.id === gwId);
        if (!gw) return;
        if (!gw.keyId) {
            return handleOpenConnectModal(gw);
        }
        try {
            setLoading(true);
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$repositories$2f$payment$2d$gateways$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["savePaymentGatewayRecord"])({
                gatewayId: gw.id,
                displayName: gw.name,
                keyId: gw.keyId,
                secretKey: gw.secretKey,
                webhookSecret: gw.webhookSecret,
                makeActive: true
            });
            if (res.success) {
                setActiveConnectedId(gw.id);
                alert(`✅ ${gw.name} is now the active payment gateway for customer checkout!`);
                await fetchAllSettings();
            } else {
                setActiveConnectedId(gw.id);
                setGateways((prev)=>prev.map((g)=>({
                            ...g,
                            status: g.id === gw.id ? 'connected' : g.status === 'connected' ? 'not_connected' : g.status
                        })));
                alert(`Updated active payment gateway to ${gw.name}.`);
            }
        } catch (err) {
            console.error('Error activating gateway:', err);
            alert('Failed to activate gateway.');
        } finally{
            setLoading(false);
        }
    };
    const handleSaveGatewayConnection = async (gwId)=>{
        if (!editKeys.keyId.trim() || !editKeys.secretKey.trim()) {
            setSyncStatus('error');
            setSyncErrorMsg("Please enter both Key ID and Secret Key.");
            return;
        }
        const gwName = gateways.find((g)=>g.id === gwId)?.name || gwId.toUpperCase();
        // 1. Verify keys against provider REST API via Edge Function
        setSyncStatus('verifying');
        setSyncErrorMsg('');
        setSyncSuccessMsg('');
        setSyncStepMessage(`Testing API credentials with ${gwName} via Supabase Edge Function...`);
        try {
            const verification = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$services$2f$gateway$2d$verification$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["verifyGatewayCredentials"])({
                provider: gwId,
                keyId: editKeys.keyId,
                secretKey: editKeys.secretKey
            });
            if (!verification.isValid) {
                setSyncStatus('error');
                setSyncErrorMsg(verification.message || `Failed to verify credentials with ${gwName}.`);
                return;
            }
            // 2. Persist gateway record and credentials in Supabase
            setSyncStatus('saving');
            setSyncStepMessage(`Validation passed! Saving ${gwName} credentials securely to Supabase...`);
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$repositories$2f$payment$2d$gateways$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["savePaymentGatewayRecord"])({
                gatewayId: gwId,
                displayName: gwName,
                keyId: editKeys.keyId,
                secretKey: editKeys.secretKey,
                webhookSecret: editKeys.webhookSecret,
                makeActive: modalSetAsActive
            });
            if (result.success) {
                setSyncStatus('success');
                setSyncSuccessMsg(modalSetAsActive ? `✅ Connected & set ${gwName} as active checkout gateway!` : `✅ Successfully saved ${gwName} credentials (Configured & Ready).`);
                if (modalSetAsActive) {
                    setActiveConnectedId(gwId);
                }
                await fetchAllSettings();
                setTimeout(()=>{
                    setShowConfigModal(null);
                    setSyncStatus('idle');
                }, 1800);
            } else {
                console.warn('Save gateway connection error:', result.error);
                // Fallback state update
                setGateways((prev)=>prev.map((g)=>{
                        if (g.id === gwId) {
                            return {
                                ...g,
                                status: 'connected',
                                keyId: editKeys.keyId,
                                secretKey: editKeys.secretKey,
                                webhookSecret: editKeys.webhookSecret
                            };
                        }
                        return {
                            ...g,
                            status: g.status === 'connected' ? 'not_connected' : g.status
                        };
                    }));
                if (modalSetAsActive) {
                    setActiveConnectedId(gwId);
                }
                setSyncStatus('success');
                setSyncSuccessMsg(`✅ Key Verification Passed! Configured locally (${result.error || 'Database note'})`);
                setTimeout(()=>{
                    setShowConfigModal(null);
                    setSyncStatus('idle');
                }, 2200);
            }
        } catch (err) {
            console.error('Save gateway connection exception:', err);
            setSyncStatus('error');
            setSyncErrorMsg(extractErrorMessage(err));
        }
    };
    const handleRunConnectionTest = async ()=>{
        if (!activeConnectedGw || !activeConnectedGw.keyId) {
            return alert("Connect a payment gateway before running a connection test.");
        }
        setTestingConnection(true);
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$services$2f$gateway$2d$verification$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["verifyGatewayCredentials"])({
                provider: activeConnectedGw.id,
                keyId: activeConnectedGw.keyId,
                secretKey: activeConnectedGw.secretKey
            });
            alert(result.message);
        } catch (err) {
            console.error('Connection test error:', err);
            alert(`Connection Test Error: ${extractErrorMessage(err)}`);
        } finally{
            setTestingConnection(false);
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "py-20 text-center space-y-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    size: 24,
                    className: "animate-spin text-[#303030] mx-auto"
                }, void 0, false, {
                    fileName: "[project]/admin/app/settings/page.tsx",
                    lineNumber: 629,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs font-medium text-[#616161]",
                    children: "Loading live store settings from Supabase..."
                }, void 0, false, {
                    fileName: "[project]/admin/app/settings/page.tsx",
                    lineNumber: 630,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/admin/app/settings/page.tsx",
            lineNumber: 628,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6 max-w-4xl mx-auto text-xs font-sans text-[#303030]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-1",
                children: SETTINGS_TABS.map((tab)=>{
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab(tab.id),
                        className: `flex-1 min-w-[150px] px-3.5 h-9 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 ${isActive ? 'bg-[#303030] text-white font-semibold shadow-xs' : 'text-[#616161] hover:text-[#1a1a1a] hover:bg-[#f7f7f7]'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                size: 15
                            }, void 0, false, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 654,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: tab.label
                            }, void 0, false, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 655,
                                columnNumber: 15
                            }, this)
                        ]
                    }, tab.id, true, {
                        fileName: "[project]/admin/app/settings/page.tsx",
                        lineNumber: 645,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/admin/app/settings/page.tsx",
                lineNumber: 639,
                columnNumber: 7
            }, this),
            activeTab === 'payments' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-5 animate-in fade-in duration-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-[#1a1a1a] text-white p-6 rounded-xl shadow-sm space-y-1 relative overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[11px] font-semibold text-gray-400 uppercase tracking-wider block",
                                children: "↔ Finance & Collections"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 667,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-xl font-bold text-white tracking-tight",
                                        children: "Payment Gateway"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 669,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `inline-flex items-center px-2.5 h-6 rounded-full text-xs font-medium ${activeConnectedGw ? 'bg-[#cdfed4] text-[#014b40]' : 'bg-[#ffd6a4] text-[#5e4200]'}`,
                                        children: [
                                            "● ",
                                            activeConnectedGw ? 'Connected' : 'Not connected'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 670,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 668,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-300",
                                children: "Manage online payments and instant checkout for your store."
                            }, void 0, false, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 676,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/settings/page.tsx",
                        lineNumber: 666,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white p-5 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[11px] font-medium text-[#616161] block",
                                                children: "Provider"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 683,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-semibold text-[#1a1a1a]",
                                                children: activeConnectedGw ? activeConnectedGw.name : 'Not connected'
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 684,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 682,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-9 h-9 rounded-lg bg-[#f7f7f7] text-[#303030] flex items-center justify-center border border-gray-200",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                            size: 18
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/settings/page.tsx",
                                            lineNumber: 689,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 688,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 681,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white p-5 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[11px] font-medium text-[#616161] block",
                                                children: "Status"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 695,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-semibold text-[#1a1a1a]",
                                                children: activeConnectedGw ? 'Verified & Active' : 'Not connected'
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 696,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 694,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-9 h-9 rounded-lg bg-[#f7f7f7] text-[#303030] flex items-center justify-center border border-gray-200",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                            size: 18
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/settings/page.tsx",
                                            lineNumber: 701,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 700,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 693,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/settings/page.tsx",
                        lineNumber: 680,
                        columnNumber: 11
                    }, this),
                    !activeConnectedGw ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-8 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] text-center space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-10 h-10 rounded-full bg-[#f7f7f7] text-[#616161] flex items-center justify-center mx-auto border border-gray-200",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/settings/page.tsx",
                                    lineNumber: 710,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 709,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold text-[#1a1a1a]",
                                children: "No gateway connected"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 712,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-[#616161] max-w-sm mx-auto",
                                children: "Connect a provider below to start accepting online payments from customers."
                            }, void 0, false, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 713,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/settings/page.tsx",
                        lineNumber: 708,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-5 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[11px] font-medium text-[#616161] block",
                                        children: "Connected Gateway"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 718,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-semibold text-[#1a1a1a]",
                                        children: [
                                            activeConnectedGw.name,
                                            " (",
                                            activeConnectedGw.keyId || 'Live Key',
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 719,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[11px] text-[#014b40] font-medium",
                                        children: "Keys synced to Supabase PostgreSQL & Vault"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 720,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 717,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>handleOpenConnectModal(activeConnectedGw),
                                className: "bg-[#303030] hover:bg-[#1a1a1a] text-white px-3.5 h-8 rounded-lg text-xs font-medium transition-colors shrink-0",
                                children: "Configure keys"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 723,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/settings/page.tsx",
                        lineNumber: 716,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-sm font-semibold text-[#1a1a1a]",
                                            children: "Payment providers"
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/settings/page.tsx",
                                            lineNumber: 737,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-[#616161]",
                                            children: "Configure your payment gateways. Only 1 payment gateway is active for storefront checkout at a time."
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/settings/page.tsx",
                                            lineNumber: 738,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/admin/app/settings/page.tsx",
                                    lineNumber: 736,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 735,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                                children: gateways.map((gw)=>{
                                    const isActiveGateway = gw.id === activeConnectedId && gw.status === 'connected';
                                    const isHasKeys = Boolean(gw.keyId);
                                    const isComingSoon = gw.status === 'coming_soon';
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `bg-white p-5 rounded-xl transition-all flex flex-col justify-between space-y-4 ${isActiveGateway ? 'shadow-[0_0_0_2px_#10b981,0_2px_4px_rgba(0,0,0,0.06)]' : 'shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "w-10 h-10 rounded-lg bg-[#1a1a1a] text-white flex items-center justify-center font-bold text-xs",
                                                                        children: gw.code
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                                        lineNumber: 760,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                                className: "font-semibold text-[#1a1a1a] text-xs",
                                                                                children: gw.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                                                lineNumber: 764,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[10px] text-[#616161]",
                                                                                children: isActiveGateway ? 'Active Checkout Provider' : isHasKeys ? 'Configured (Inactive)' : isComingSoon ? 'Coming Soon' : 'Not Connected'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                                                lineNumber: 765,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                                        lineNumber: 763,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                                lineNumber: 759,
                                                                columnNumber: 25
                                                            }, this),
                                                            isActiveGateway ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#cdfed4] text-[#014b40] border border-emerald-300 shrink-0",
                                                                children: "● Active"
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                                lineNumber: 772,
                                                                columnNumber: 27
                                                            }, this) : isHasKeys ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600 shrink-0",
                                                                children: "Ready"
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                                lineNumber: 776,
                                                                columnNumber: 27
                                                            }, this) : null
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 758,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-[#616161] leading-relaxed",
                                                        children: gw.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 782,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-wrap gap-1.5 pt-1",
                                                        children: gw.tags.map((tag, tIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "bg-[#f7f7f7] border border-gray-200 text-[#616161] px-2 py-0.5 rounded text-[10px] font-medium",
                                                                children: tag
                                                            }, tIdx, false, {
                                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                                lineNumber: 786,
                                                                columnNumber: 27
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 784,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 757,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2 pt-1",
                                                children: isComingSoon ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    disabled: true,
                                                    className: "w-full bg-[#f7f7f7] border border-gray-200 text-[#8a8a8a] h-9 rounded-lg text-xs font-medium cursor-not-allowed",
                                                    children: "Coming soon"
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/settings/page.tsx",
                                                    lineNumber: 795,
                                                    columnNumber: 25
                                                }, this) : isActiveGateway ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>handleOpenConnectModal(gw),
                                                    className: "w-full h-9 rounded-lg text-xs font-medium border border-gray-200 bg-[#f7f7f7] text-[#1a1a1a] hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                                            size: 13
                                                        }, void 0, false, {
                                                            fileName: "[project]/admin/app/settings/page.tsx",
                                                            lineNumber: 804,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Configure keys"
                                                        }, void 0, false, {
                                                            fileName: "[project]/admin/app/settings/page.tsx",
                                                            lineNumber: 805,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/admin/app/settings/page.tsx",
                                                    lineNumber: 799,
                                                    columnNumber: 25
                                                }, this) : isHasKeys ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>handleOpenConnectModal(gw),
                                                            className: "flex-1 h-9 rounded-lg text-xs font-medium border border-gray-200 bg-white text-[#303030] hover:bg-gray-50 transition-colors",
                                                            children: "Configure"
                                                        }, void 0, false, {
                                                            fileName: "[project]/admin/app/settings/page.tsx",
                                                            lineNumber: 809,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>handleActivateGateway(gw.id),
                                                            className: "flex-1 h-9 rounded-lg text-xs font-semibold bg-[#303030] hover:bg-[#1a1a1a] text-white transition-colors",
                                                            children: "Set as Active"
                                                        }, void 0, false, {
                                                            fileName: "[project]/admin/app/settings/page.tsx",
                                                            lineNumber: 816,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/admin/app/settings/page.tsx",
                                                    lineNumber: 808,
                                                    columnNumber: 25
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>handleOpenConnectModal(gw),
                                                    className: "w-full h-9 rounded-lg text-xs font-medium border border-transparent bg-[#303030] hover:bg-[#1a1a1a] text-white transition-colors inline-flex items-center justify-center gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                            size: 14
                                                        }, void 0, false, {
                                                            fileName: "[project]/admin/app/settings/page.tsx",
                                                            lineNumber: 830,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Configure & Connect"
                                                        }, void 0, false, {
                                                            fileName: "[project]/admin/app/settings/page.tsx",
                                                            lineNumber: 831,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/admin/app/settings/page.tsx",
                                                    lineNumber: 825,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 793,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, gw.id, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 749,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 742,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/settings/page.tsx",
                        lineNumber: 734,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-sm font-semibold text-[#1a1a1a]",
                                        children: "Gateway health"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 844,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-[#616161]",
                                        children: "Is your payment gateway working correctly right now?"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 845,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 843,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "divide-y divide-gray-100 text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "py-2.5 flex justify-between items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[#303030]",
                                                children: "Connection status"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 850,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `inline-flex items-center px-2 h-5 rounded-full text-[11px] font-medium ${activeConnectedGw ? 'bg-[#cdfed4] text-[#014b40]' : 'bg-[#fed1d7] text-[#8e0b21]'}`,
                                                children: [
                                                    "● ",
                                                    activeConnectedGw ? 'Connected' : 'Not connected'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 851,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 849,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "py-2.5 flex justify-between items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[#303030]",
                                                children: "API verification"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 859,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[#616161] font-medium",
                                                children: activeConnectedGw ? '● Validated' : '—'
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 860,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 858,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "py-2.5 flex justify-between items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[#303030]",
                                                children: "Webhook status"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 864,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[#616161] font-medium",
                                                children: activeConnectedGw ? '● Active' : '—'
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 865,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 863,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "py-2.5 flex justify-between items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[#303030]",
                                                children: "Last webhook received"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 869,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[#8a8a8a]",
                                                children: "Recently"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 870,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 868,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "py-2.5 flex justify-between items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[#303030]",
                                                children: "Settlement cycle"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 874,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[#616161] font-medium",
                                                children: "T+1"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 875,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 873,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 848,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/settings/page.tsx",
                        lineNumber: 842,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-sm font-semibold text-[#1a1a1a]",
                                        children: "Payment collection settings"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 883,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-[#616161]",
                                        children: "Control how payments and receipts behave."
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 884,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 882,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3 divide-y divide-gray-100 text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pt-2 flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold text-[#1a1a1a] block",
                                                        children: "Allow partial payments"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 890,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[#616161]",
                                                        children: "Customers can pay a deposit, instead of the full amount."
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 891,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 889,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setAllowPartialPayments(!allowPartialPayments),
                                                className: `flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium border transition-colors ${allowPartialPayments ? 'bg-[#cdfed4] text-[#014b40] border-emerald-200' : 'bg-[#e3e3e3] text-[#303030] border-gray-200'}`,
                                                children: allowPartialPayments ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$toggle$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleRight$3e$__["ToggleRight"], {
                                                    size: 18
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/settings/page.tsx",
                                                    lineNumber: 900,
                                                    columnNumber: 43
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$toggle$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleLeft$3e$__["ToggleLeft"], {
                                                    size: 18
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/settings/page.tsx",
                                                    lineNumber: 900,
                                                    columnNumber: 71
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 893,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 888,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pt-3 flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold text-[#1a1a1a] block",
                                                        children: "Send WhatsApp receipt"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 906,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[#616161]",
                                                        children: "Share the receipt with customers over WhatsApp after payment."
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 907,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 905,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setSendWhatsappReceipt(!sendWhatsappReceipt),
                                                className: `flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium border transition-colors ${sendWhatsappReceipt ? 'bg-[#cdfed4] text-[#014b40] border-emerald-200' : 'bg-[#e3e3e3] text-[#303030] border-gray-200'}`,
                                                children: sendWhatsappReceipt ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$toggle$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleRight$3e$__["ToggleRight"], {
                                                    size: 18
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/settings/page.tsx",
                                                    lineNumber: 916,
                                                    columnNumber: 42
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$toggle$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleLeft$3e$__["ToggleLeft"], {
                                                    size: 18
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/settings/page.tsx",
                                                    lineNumber: 916,
                                                    columnNumber: 70
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 909,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 904,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pt-3 flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold text-[#1a1a1a] block",
                                                        children: "Send email receipt"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 922,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[#616161]",
                                                        children: "Email a copy of the receipt to registered customer email."
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 923,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 921,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setSendEmailReceipt(!sendEmailReceipt),
                                                className: `flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium border transition-colors ${sendEmailReceipt ? 'bg-[#cdfed4] text-[#014b40] border-emerald-200' : 'bg-[#e3e3e3] text-[#303030] border-gray-200'}`,
                                                children: sendEmailReceipt ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$toggle$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleRight$3e$__["ToggleRight"], {
                                                    size: 18
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/settings/page.tsx",
                                                    lineNumber: 932,
                                                    columnNumber: 39
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$toggle$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleLeft$3e$__["ToggleLeft"], {
                                                    size: 18
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/settings/page.tsx",
                                                    lineNumber: 932,
                                                    columnNumber: 67
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 925,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 920,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 887,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/settings/page.tsx",
                        lineNumber: 881,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-sm font-semibold text-[#1a1a1a]",
                                                children: "Webhook"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 942,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-[#616161]",
                                                children: "Your provider uses this URL to notify Royal Bengal of captured payments."
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 943,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 941,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-flex items-center px-2 h-5 rounded-full text-[10px] font-medium bg-[#cdfed4] text-[#014b40]",
                                        children: "Active"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 945,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 940,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "font-medium text-[#616161] block mb-1",
                                        children: "Webhook URL"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 951,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                readOnly: true,
                                                type: "text",
                                                value: webhookUrl,
                                                className: "flex-1 bg-[#f7f7f7] border border-gray-200 rounded-lg px-3 h-9 text-xs text-[#1a1a1a] outline-none font-mono"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 953,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: handleCopyWebhook,
                                                className: "bg-[#303030] hover:bg-[#1a1a1a] text-white px-3.5 h-9 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors shrink-0",
                                                children: [
                                                    copiedWebhook ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 964,
                                                        columnNumber: 36
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 964,
                                                        columnNumber: 58
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: copiedWebhook ? 'Copied' : 'Copy'
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 965,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 959,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 952,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 950,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/settings/page.tsx",
                        lineNumber: 939,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-sm font-semibold text-[#1a1a1a]",
                                        children: "Connection test"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 974,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-[#616161]",
                                        children: "Verify your gateway integration is wired correctly — this doesn't move real money."
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 975,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 973,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "font-medium text-[#616161] block mb-1",
                                                children: "Test amount (₹)"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 980,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                value: testAmount,
                                                onChange: (e)=>setTestAmount(e.target.value),
                                                className: "w-full bg-[#f7f7f7] border border-gray-200 rounded-lg px-3 h-9 text-xs text-[#1a1a1a] outline-none font-semibold"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 981,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 979,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        disabled: testingConnection || !activeConnectedGw,
                                        onClick: handleRunConnectionTest,
                                        className: "bg-[#303030] hover:bg-[#1a1a1a] text-white px-4 h-9 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors shrink-0 disabled:opacity-50 sm:self-end",
                                        children: [
                                            testingConnection ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                size: 14,
                                                className: "animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 995,
                                                columnNumber: 38
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                size: 15
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 995,
                                                columnNumber: 87
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Run connection test"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 996,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 989,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 978,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/settings/page.tsx",
                        lineNumber: 972,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/settings/page.tsx",
                lineNumber: 663,
                columnNumber: 9
            }, this),
            activeTab === 'store' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-5 animate-in fade-in duration-200 text-xs",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between border-b border-gray-100 pb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-sm font-semibold text-[#1a1a1a]",
                                        children: "Store open / closed status"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1011,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-[#616161] mt-0.5",
                                        children: "Master toggle controlling whether the customer storefront accepts live orders."
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1012,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 1010,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setIsStoreOpen(!isStoreOpen),
                                className: `flex items-center gap-2 px-3.5 h-9 rounded-lg text-xs font-medium border transition-colors ${isStoreOpen ? 'bg-[#cdfed4] text-[#014b40] border-emerald-200' : 'bg-[#fed1d7] text-[#8e0b21] border-rose-200'}`,
                                children: [
                                    isStoreOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$toggle$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleRight$3e$__["ToggleRight"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1024,
                                        columnNumber: 30
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$toggle$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleLeft$3e$__["ToggleLeft"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1024,
                                        columnNumber: 58
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: isStoreOpen ? 'Store open' : 'Store closed'
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1025,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 1015,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/settings/page.tsx",
                        lineNumber: 1009,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "font-medium text-[#616161] block mb-1",
                                        children: "Store name"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1032,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: storeName,
                                        onChange: (e)=>setStoreName(e.target.value),
                                        className: "w-full bg-[#f7f7f7] border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1033,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 1031,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "font-medium text-[#616161] block mb-1",
                                        children: "Store address / hub"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1042,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: storeAddress,
                                        onChange: (e)=>setStoreAddress(e.target.value),
                                        className: "w-full bg-[#f7f7f7] border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1043,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 1041,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/settings/page.tsx",
                        lineNumber: 1030,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-3 border-t border-gray-100 space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-xs font-semibold text-[#1a1a1a]",
                                        children: "Dark store hub GPS location"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1055,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[11px] text-[#616161]",
                                        children: "Used for Haversine distance calculations from store hub to customer map pin."
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1056,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 1054,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "font-medium text-[#616161] block mb-1",
                                                children: "Store latitude"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1061,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                step: "0.000001",
                                                value: storeLatitude,
                                                onChange: (e)=>setStoreLatitude(Number(e.target.value)),
                                                className: "w-full bg-[#f7f7f7] border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1062,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1060,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "font-medium text-[#616161] block mb-1",
                                                children: "Store longitude"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1072,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                step: "0.000001",
                                                value: storeLongitude,
                                                onChange: (e)=>setStoreLongitude(Number(e.target.value)),
                                                className: "w-full bg-[#f7f7f7] border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1073,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1071,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 1059,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/settings/page.tsx",
                        lineNumber: 1053,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-3 flex justify-end",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            disabled: savingSettings,
                            onClick: handleSaveStoreSettings,
                            className: "bg-[#303030] hover:bg-[#1a1a1a] text-white px-5 h-9 rounded-lg text-xs font-medium inline-flex items-center gap-2 transition-colors shadow-xs",
                            children: [
                                savingSettings ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    size: 14,
                                    className: "animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/settings/page.tsx",
                                    lineNumber: 1091,
                                    columnNumber: 33
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                    size: 15
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/settings/page.tsx",
                                    lineNumber: 1091,
                                    columnNumber: 82
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Save store settings to Supabase"
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/settings/page.tsx",
                                    lineNumber: 1092,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/admin/app/settings/page.tsx",
                            lineNumber: 1085,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/admin/app/settings/page.tsx",
                        lineNumber: 1084,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/settings/page.tsx",
                lineNumber: 1006,
                columnNumber: 9
            }, this),
            activeTab === 'delivery' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-5 animate-in fade-in duration-200 text-xs",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border-b border-gray-100 pb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-sm font-semibold text-[#1a1a1a]",
                                        children: "Store delivery pricing & free delivery options"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1106,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-[#616161]",
                                        children: "Configure free delivery thresholds, distance brackets, or flat delivery fee mode."
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1107,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 1105,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between bg-[#f7f7f7] p-3 rounded-xl border border-gray-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold text-[#1a1a1a] block text-xs",
                                                        children: "Free delivery options"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1114,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[#616161] text-[11px]",
                                                        children: "When turned ON, free delivery is offered on qualifying orders. When OFF, a flat delivery fee applies."
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1115,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1113,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setIsFreeDeliveryEnabled(!isFreeDeliveryEnabled),
                                                className: `flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium border transition-colors ${isFreeDeliveryEnabled ? 'bg-[#cdfed4] text-[#014b40] border-emerald-200' : 'bg-[#e3e3e3] text-[#303030] border-gray-200'}`,
                                                children: [
                                                    isFreeDeliveryEnabled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$toggle$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleRight$3e$__["ToggleRight"], {
                                                        size: 18
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1125,
                                                        columnNumber: 44
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$toggle$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleLeft$3e$__["ToggleLeft"], {
                                                        size: 18
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1125,
                                                        columnNumber: 72
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: isFreeDeliveryEnabled ? 'Free delivery ON' : 'Free delivery OFF'
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1126,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1118,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1112,
                                        columnNumber: 15
                                    }, this),
                                    isFreeDeliveryEnabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2 pt-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "font-medium text-[#616161] block",
                                                children: "Select free delivery rule structure"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1133,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setDeliveryMode('preset_rules'),
                                                        className: `p-3.5 rounded-xl border text-left transition-all ${deliveryMode === 'preset_rules' ? 'border-[#303030] bg-[#303030] text-white shadow-xs font-semibold' : 'border-gray-200 bg-white text-[#303030] hover:bg-gray-50 font-medium'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "font-bold text-xs",
                                                                children: "Standard 2-Zone Radius Rules"
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                                lineNumber: 1144,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: `text-[11px] mt-0.5 leading-relaxed ${deliveryMode === 'preset_rules' ? 'text-gray-300' : 'text-[#616161]'}`,
                                                                children: "Free delivery within 5 km for orders above ₹299 (else ₹30 fee); Free delivery beyond 5 km for orders above ₹499 (else ₹30 fee)."
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                                lineNumber: 1145,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1135,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setDeliveryMode('distance_tiered'),
                                                        className: `p-3.5 rounded-xl border text-left transition-all ${deliveryMode === 'distance_tiered' ? 'border-[#303030] bg-[#303030] text-white shadow-xs font-semibold' : 'border-gray-200 bg-white text-[#303030] hover:bg-gray-50 font-medium'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "font-bold text-xs",
                                                                children: "Distance-Based 3-Tier Rules"
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                                lineNumber: 1159,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: `text-[11px] mt-0.5 leading-relaxed ${deliveryMode === 'distance_tiered' ? 'text-gray-300' : 'text-[#616161]'}`,
                                                                children: "Tier 1 (0-5km): Free above ₹299; Tier 2 (5-10km): Free above ₹500; Tier 3 (10km+): Free above ₹699 (else ₹30 fee)."
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                                lineNumber: 1160,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1150,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1134,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1132,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 1111,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/settings/page.tsx",
                        lineNumber: 1104,
                        columnNumber: 11
                    }, this),
                    !isFreeDeliveryEnabled ? /* FLAT FEE MODE CARD */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-sm font-semibold text-[#1a1a1a]",
                                        children: "Flat delivery fee configuration"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1175,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-[#616161]",
                                        children: "Free delivery is turned OFF. A fixed delivery charge will apply to all orders."
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1176,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 1174,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "max-w-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "font-medium text-[#616161] block mb-1",
                                        children: "Flat delivery fee (₹)"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1180,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        value: flatDeliveryFee,
                                        onChange: (e)=>setFlatDeliveryFee(Number(e.target.value)),
                                        className: "w-full bg-[#f7f7f7] border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none font-semibold text-base"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1181,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 1179,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-[#616161] bg-[#f7f7f7] p-3 rounded-lg border border-gray-200",
                                children: [
                                    "📌 ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-[#1a1a1a]",
                                        children: "Active Rule:"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1190,
                                        columnNumber: 20
                                    }, this),
                                    " A flat delivery fee of ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-bold text-[#1a1a1a]",
                                        children: [
                                            "₹",
                                            flatDeliveryFee
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1190,
                                        columnNumber: 108
                                    }, this),
                                    " is charged on all customer orders regardless of distance or order value."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 1189,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/settings/page.tsx",
                        lineNumber: 1173,
                        columnNumber: 13
                    }, this) : deliveryMode === 'preset_rules' ? /* MODE A: STANDARD 2-ZONE PRESET RULES */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border-b border-gray-100 pb-3 flex justify-between items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-sm font-semibold text-[#1a1a1a]",
                                                children: "Standard 2-zone radius rules (Editable & Non-Overlapping)"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1198,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-[#616161]",
                                                children: "Edit radius and order subtotal thresholds below. Boundaries automatically adjust so no rules overlap."
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1199,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1197,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bg-[#cdfed4] text-[#014b40] px-2.5 py-1 rounded-full text-[10px] font-semibold",
                                        children: "Non-Overlapping"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1201,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 1196,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "max-w-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "font-medium text-[#616161] block mb-1",
                                        children: "Free delivery radius threshold (KM)"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1208,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        step: "0.5",
                                        value: presetZoneRadius,
                                        onChange: (e)=>setPresetZoneRadius(Math.max(1, Number(e.target.value))),
                                        className: "w-full bg-[#f7f7f7] border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none font-bold"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1209,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 1207,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#fafafa] p-4 rounded-xl border border-gray-200 space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold text-xs text-[#1a1a1a]",
                                                        children: [
                                                            "Zone 1 (Within ",
                                                            presetZoneRadius,
                                                            " km)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1222,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] font-medium bg-white px-2 py-0.5 rounded border text-gray-600",
                                                        children: [
                                                            "0 - ",
                                                            presetZoneRadius,
                                                            " km"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1223,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1221,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "font-medium text-[#616161] block mb-1",
                                                        children: "Free delivery order subtotal threshold (₹)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1229,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: presetZone1Subtotal,
                                                        onChange: (e)=>setPresetZone1Subtotal(Number(e.target.value)),
                                                        className: "w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none font-semibold"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1230,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1228,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "font-medium text-[#616161] block mb-1",
                                                        children: [
                                                            "Delivery fee below ₹",
                                                            presetZone1Subtotal,
                                                            " (₹)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1239,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: presetZone1Fee,
                                                        onChange: (e)=>setPresetZone1Fee(Number(e.target.value)),
                                                        className: "w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none font-semibold"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1240,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1238,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1220,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#fafafa] p-4 rounded-xl border border-gray-200 space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold text-xs text-[#1a1a1a]",
                                                        children: [
                                                            "Zone 2 (Beyond ",
                                                            presetZoneRadius,
                                                            " km)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1252,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] font-medium bg-white px-2 py-0.5 rounded border text-gray-600",
                                                        children: [
                                                            presetZoneRadius,
                                                            " km+"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1253,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1251,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "font-medium text-[#616161] block mb-1",
                                                        children: "Free delivery order subtotal threshold (₹)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1259,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: presetZone2Subtotal,
                                                        onChange: (e)=>setPresetZone2Subtotal(Number(e.target.value)),
                                                        className: "w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none font-semibold"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1260,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1258,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "font-medium text-[#616161] block mb-1",
                                                        children: [
                                                            "Delivery fee below ₹",
                                                            presetZone2Subtotal,
                                                            " (₹)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1269,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: presetZone2Fee,
                                                        onChange: (e)=>setPresetZone2Fee(Number(e.target.value)),
                                                        className: "w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none font-semibold"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1270,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1268,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1250,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 1218,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/settings/page.tsx",
                        lineNumber: 1195,
                        columnNumber: 13
                    }, this) : /* MODE B: DISTANCE-BASED 3-TIER RULES */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border-b border-gray-100 pb-3 flex justify-between items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-sm font-semibold text-[#1a1a1a]",
                                                children: "Distance-based 3-tier rules (Editable & Non-Overlapping)"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1285,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-[#616161]",
                                                children: "Tier boundaries automatically adjust so adjacent distance ranges stay perfectly seamless."
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1286,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1284,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bg-[#cdfed4] text-[#014b40] px-2.5 py-1 rounded-full text-[10px] font-semibold",
                                        children: "3 Distance Tiers"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1288,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 1283,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#fafafa] p-4 rounded-xl border border-gray-200 space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold text-xs text-[#1a1a1a]",
                                                        children: [
                                                            "Tier 1 (Within ",
                                                            tier1Km,
                                                            " km)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1297,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] font-medium bg-white px-2 py-0.5 rounded border text-gray-600",
                                                        children: [
                                                            "0 - ",
                                                            tier1Km,
                                                            " km"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1298,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1296,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "font-medium text-[#616161] block mb-1",
                                                        children: "Tier 1 max distance (KM)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1304,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: tier1Km,
                                                        onChange: (e)=>setTier1Km(Math.max(1, Number(e.target.value))),
                                                        className: "w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1a1a1a] outline-none font-bold"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1305,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1303,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "font-medium text-[#616161] block mb-1",
                                                        children: "Free delivery subtotal (₹)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1314,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: tier1Subtotal,
                                                        onChange: (e)=>setTier1Subtotal(Number(e.target.value)),
                                                        className: "w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1a1a1a] outline-none font-semibold"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1315,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1313,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "font-medium text-[#616161] block mb-1",
                                                        children: "Fee below subtotal (₹)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1324,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: tier1Fee,
                                                        onChange: (e)=>setTier1Fee(Number(e.target.value)),
                                                        className: "w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1a1a1a] outline-none font-semibold"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1325,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1323,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1295,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#fafafa] p-4 rounded-xl border border-gray-200 space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold text-xs text-[#1a1a1a]",
                                                        children: [
                                                            "Tier 2 (",
                                                            tier1Km,
                                                            " - ",
                                                            Math.max(tier1Km + 1, tier2Km),
                                                            " km)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1337,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] font-medium bg-white px-2 py-0.5 rounded border text-gray-600",
                                                        children: [
                                                            tier1Km,
                                                            " - ",
                                                            Math.max(tier1Km + 1, tier2Km),
                                                            " km"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1338,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1336,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "font-medium text-[#616161] block mb-1",
                                                        children: "Tier 2 max distance (KM)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1344,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: tier2Km,
                                                        onChange: (e)=>setTier2Km(Math.max(tier1Km + 1, Number(e.target.value))),
                                                        className: "w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1a1a1a] outline-none font-bold"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1345,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1343,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "font-medium text-[#616161] block mb-1",
                                                        children: "Free delivery subtotal (₹)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1354,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: tier2Subtotal,
                                                        onChange: (e)=>setTier2Subtotal(Number(e.target.value)),
                                                        className: "w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1a1a1a] outline-none font-semibold"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1355,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1353,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "font-medium text-[#616161] block mb-1",
                                                        children: "Fee below subtotal (₹)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1364,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: tier2Fee,
                                                        onChange: (e)=>setTier2Fee(Number(e.target.value)),
                                                        className: "w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1a1a1a] outline-none font-semibold"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1365,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1363,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1335,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[#fafafa] p-4 rounded-xl border border-gray-200 space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold text-xs text-[#1a1a1a]",
                                                        children: [
                                                            "Tier 3 (Beyond ",
                                                            Math.max(tier1Km + 1, tier2Km),
                                                            " km)"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1377,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] font-medium bg-white px-2 py-0.5 rounded border text-gray-600",
                                                        children: [
                                                            Math.max(tier1Km + 1, tier2Km),
                                                            " km+"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1378,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1376,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "pt-8",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "font-medium text-[#616161] block mb-1",
                                                        children: "Free delivery subtotal (₹)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1384,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: tier3Subtotal,
                                                        onChange: (e)=>setTier3Subtotal(Number(e.target.value)),
                                                        className: "w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1a1a1a] outline-none font-semibold"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1385,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1383,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "font-medium text-[#616161] block mb-1",
                                                        children: "Fee below subtotal (₹)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1394,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: tier3Fee,
                                                        onChange: (e)=>setTier3Fee(Number(e.target.value)),
                                                        className: "w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1a1a1a] outline-none font-semibold"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1395,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1393,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1375,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 1293,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/settings/page.tsx",
                        lineNumber: 1282,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-5 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] flex justify-between items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-[#616161]",
                                children: "Saves pricing structure & non-overlapping rules directly to Supabase PostgreSQL."
                            }, void 0, false, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 1409,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                disabled: savingDeliverySettings,
                                onClick: handleSaveDeliveryConfiguration,
                                className: "bg-[#303030] hover:bg-[#1a1a1a] text-white px-5 h-9 rounded-lg text-xs font-semibold inline-flex items-center gap-2 transition-colors shadow-xs shrink-0",
                                children: [
                                    savingDeliverySettings ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        size: 14,
                                        className: "animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1419,
                                        columnNumber: 41
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                        size: 15
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1419,
                                        columnNumber: 90
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Save Delivery Rules & Pricing"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1420,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/settings/page.tsx",
                                lineNumber: 1413,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/settings/page.tsx",
                        lineNumber: 1408,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/settings/page.tsx",
                lineNumber: 1101,
                columnNumber: 9
            }, this),
            showConfigModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl text-xs animate-in zoom-in-95 duration-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center border-b border-gray-100 pb-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-semibold text-[#1a1a1a] text-sm",
                                    children: [
                                        "Configure ",
                                        showConfigModal.toUpperCase(),
                                        " Credentials"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/admin/app/settings/page.tsx",
                                    lineNumber: 1432,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    disabled: syncStatus === 'verifying' || syncStatus === 'saving',
                                    onClick: ()=>setShowConfigModal(null),
                                    className: "text-gray-400 hover:text-gray-600 disabled:opacity-40",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/settings/page.tsx",
                                        lineNumber: 1438,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/settings/page.tsx",
                                    lineNumber: 1433,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/admin/app/settings/page.tsx",
                            lineNumber: 1431,
                            columnNumber: 13
                        }, this),
                        (syncStatus === 'verifying' || syncStatus === 'saving') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-[#f7f7f7] border border-gray-200 rounded-lg p-3 space-y-1.5 animate-pulse",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 text-xs font-semibold text-[#1a1a1a]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                            size: 16,
                                            className: "animate-spin text-[#303030]"
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/settings/page.tsx",
                                            lineNumber: 1446,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: syncStatus === 'verifying' ? 'Validating API Keys...' : 'Saving Credentials...'
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/settings/page.tsx",
                                            lineNumber: 1447,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/admin/app/settings/page.tsx",
                                    lineNumber: 1445,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[11px] text-[#616161] leading-relaxed",
                                    children: syncStepMessage
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/settings/page.tsx",
                                    lineNumber: 1449,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/admin/app/settings/page.tsx",
                            lineNumber: 1444,
                            columnNumber: 15
                        }, this),
                        syncStatus === 'success' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-[#cdfed4] border border-emerald-300 text-[#014b40] rounded-lg p-3 space-y-1 animate-in fade-in duration-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 font-semibold text-xs",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/settings/page.tsx",
                                            lineNumber: 1457,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Validation & Sync Successful"
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/settings/page.tsx",
                                            lineNumber: 1458,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/admin/app/settings/page.tsx",
                                    lineNumber: 1456,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[11px] leading-relaxed",
                                    children: syncSuccessMsg
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/settings/page.tsx",
                                    lineNumber: 1460,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/admin/app/settings/page.tsx",
                            lineNumber: 1455,
                            columnNumber: 15
                        }, this),
                        syncStatus === 'error' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-[#fed1d7] border border-rose-300 text-[#8e0b21] rounded-lg p-3 space-y-1 animate-in fade-in duration-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 font-semibold text-xs",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/settings/page.tsx",
                                            lineNumber: 1468,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Verification Failed"
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/settings/page.tsx",
                                            lineNumber: 1469,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/admin/app/settings/page.tsx",
                                    lineNumber: 1467,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[11px] leading-relaxed",
                                    children: syncErrorMsg
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/settings/page.tsx",
                                    lineNumber: 1471,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/admin/app/settings/page.tsx",
                            lineNumber: 1466,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: (e)=>{
                                e.preventDefault();
                                handleSaveGatewayConnection(showConfigModal);
                            },
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "font-medium text-[#616161] block mb-1",
                                            children: "Publishable Key ID (Client-Safe)"
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/settings/page.tsx",
                                            lineNumber: 1477,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            required: true,
                                            disabled: syncStatus === 'verifying' || syncStatus === 'saving' || syncStatus === 'success',
                                            type: "text",
                                            value: editKeys.keyId,
                                            onChange: (e)=>setEditKeys({
                                                    ...editKeys,
                                                    keyId: e.target.value
                                                }),
                                            className: "w-full bg-[#f7f7f7] border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none font-medium disabled:opacity-60",
                                            placeholder: "Key ID (e.g. rzp_test_...)"
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/settings/page.tsx",
                                            lineNumber: 1478,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/admin/app/settings/page.tsx",
                                    lineNumber: 1476,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "font-medium text-[#616161] block mb-1",
                                            children: "Secret Key (Verified via Supabase Edge Function & Secrets)"
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/settings/page.tsx",
                                            lineNumber: 1490,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    required: true,
                                                    disabled: syncStatus === 'verifying' || syncStatus === 'saving' || syncStatus === 'success',
                                                    type: showSecret ? "text" : "password",
                                                    value: editKeys.secretKey,
                                                    onChange: (e)=>setEditKeys({
                                                            ...editKeys,
                                                            secretKey: e.target.value
                                                        }),
                                                    className: "w-full bg-[#f7f7f7] border border-gray-200 rounded-lg pl-2.5 pr-9 py-2.5 text-xs text-[#1a1a1a] outline-none font-medium disabled:opacity-60",
                                                    placeholder: "Secret Key..."
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/settings/page.tsx",
                                                    lineNumber: 1492,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    disabled: syncStatus === 'verifying' || syncStatus === 'saving',
                                                    onClick: ()=>setShowSecret(!showSecret),
                                                    className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-40",
                                                    children: showSecret ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                        size: 15
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1507,
                                                        columnNumber: 35
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                        size: 15
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1507,
                                                        columnNumber: 58
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/settings/page.tsx",
                                                    lineNumber: 1501,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/admin/app/settings/page.tsx",
                                            lineNumber: 1491,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/admin/app/settings/page.tsx",
                                    lineNumber: 1489,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "font-medium text-[#616161] block mb-1",
                                            children: "Webhook Secret"
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/settings/page.tsx",
                                            lineNumber: 1513,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            disabled: syncStatus === 'verifying' || syncStatus === 'saving' || syncStatus === 'success',
                                            type: "password",
                                            value: editKeys.webhookSecret,
                                            onChange: (e)=>setEditKeys({
                                                    ...editKeys,
                                                    webhookSecret: e.target.value
                                                }),
                                            className: "w-full bg-[#f7f7f7] border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none font-medium disabled:opacity-60",
                                            placeholder: "Webhook Signing Secret..."
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/settings/page.tsx",
                                            lineNumber: 1514,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/admin/app/settings/page.tsx",
                                    lineNumber: 1512,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pt-1 flex items-center justify-between bg-[#f7f7f7] p-2.5 rounded-lg border border-gray-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold text-[#1a1a1a] block text-xs",
                                                    children: "Set as active checkout gateway"
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/settings/page.tsx",
                                                    lineNumber: 1526,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] text-[#616161]",
                                                    children: "Activates this gateway for storefront checkout"
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/settings/page.tsx",
                                                    lineNumber: 1527,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/admin/app/settings/page.tsx",
                                            lineNumber: 1525,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            disabled: syncStatus === 'verifying' || syncStatus === 'saving' || syncStatus === 'success',
                                            onClick: ()=>setModalSetAsActive(!modalSetAsActive),
                                            className: `flex items-center gap-1.5 px-2.5 h-7 rounded text-xs font-medium border transition-colors ${modalSetAsActive ? 'bg-[#cdfed4] text-[#014b40] border-emerald-300' : 'bg-white text-gray-600 border-gray-300'}`,
                                            children: [
                                                modalSetAsActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$toggle$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleRight$3e$__["ToggleRight"], {
                                                    size: 18
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/settings/page.tsx",
                                                    lineNumber: 1537,
                                                    columnNumber: 39
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$toggle$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ToggleLeft$3e$__["ToggleLeft"], {
                                                    size: 18
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/settings/page.tsx",
                                                    lineNumber: 1537,
                                                    columnNumber: 67
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: modalSetAsActive ? 'Active' : 'Inactive'
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/settings/page.tsx",
                                                    lineNumber: 1538,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/admin/app/settings/page.tsx",
                                            lineNumber: 1529,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/admin/app/settings/page.tsx",
                                    lineNumber: 1524,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2 pt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            disabled: syncStatus === 'verifying' || syncStatus === 'saving',
                                            onClick: ()=>setShowConfigModal(null),
                                            className: "flex-1 py-2.5 border border-gray-200 rounded-lg font-medium text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-50",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/settings/page.tsx",
                                            lineNumber: 1543,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            disabled: syncStatus === 'verifying' || syncStatus === 'saving' || syncStatus === 'success',
                                            className: "flex-1 py-2.5 bg-[#303030] hover:bg-[#1a1a1a] text-white font-medium rounded-lg text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5",
                                            children: syncStatus === 'verifying' || syncStatus === 'saving' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                        size: 14,
                                                        className: "animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1558,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: syncStatus === 'verifying' ? 'Verifying...' : 'Syncing...'
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1559,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1557,
                                                columnNumber: 21
                                            }, this) : syncStatus === 'success' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1563,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Connected"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/settings/page.tsx",
                                                        lineNumber: 1564,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1562,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Connect & Sync"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/settings/page.tsx",
                                                lineNumber: 1567,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/settings/page.tsx",
                                            lineNumber: 1551,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/admin/app/settings/page.tsx",
                                    lineNumber: 1542,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/admin/app/settings/page.tsx",
                            lineNumber: 1475,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/admin/app/settings/page.tsx",
                    lineNumber: 1430,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/admin/app/settings/page.tsx",
                lineNumber: 1429,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/admin/app/settings/page.tsx",
        lineNumber: 636,
        columnNumber: 5
    }, this);
}
_s(StoreSettingsPage, "at9w6Vy6FpUjXQT0vL3ItutA+7s=");
_c = StoreSettingsPage;
var _c;
__turbopack_context__.k.register(_c, "StoreSettingsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/admin/features/settings/repositories/delivery.repository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteDeliveryFeeRuleRecord",
    ()=>deleteDeliveryFeeRuleRecord,
    "fetchDeliveryFeeRulesList",
    ()=>fetchDeliveryFeeRulesList,
    "fetchDeliverySettingsRow",
    ()=>fetchDeliverySettingsRow,
    "saveDeliverySettingsRow",
    ()=>saveDeliverySettingsRow,
    "upsertDeliveryFeeRuleRecord",
    ()=>upsertDeliveryFeeRuleRecord
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/lib/supabase.ts [app-client] (ecmascript)");
;
async function fetchDeliverySettingsRow() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('delivery_settings').select('*').limit(1).maybeSingle();
    if (error) {
        console.warn('Error fetching delivery_settings:', error.message);
    }
    return {
        id: data?.id,
        storeLatitude: Number(data?.store_latitude ?? 17.351452),
        storeLongitude: Number(data?.store_longitude ?? 78.391039),
        deliveryPricingMode: data?.delivery_pricing_mode || 'rules'
    };
}
async function saveDeliverySettingsRow(input) {
    const payload = {
        store_latitude: input.storeLatitude,
        store_longitude: input.storeLongitude,
        delivery_pricing_mode: input.deliveryPricingMode,
        updated_at: new Date().toISOString()
    };
    if (input.id) {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('delivery_settings').update(payload).eq('id', input.id);
        if (error) throw error;
    } else {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('delivery_settings').upsert(payload);
        if (error) throw error;
    }
}
async function fetchDeliveryFeeRulesList() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('delivery_fee_rules').select('*').order('priority', {
        ascending: true
    });
    if (error) {
        console.warn('Error fetching delivery_fee_rules:', error.message);
        return [];
    }
    return (data || []).map((r)=>({
            id: r.id,
            name: r.name,
            minDistanceKm: Number(r.min_distance_km || 0),
            maxDistanceKm: r.max_distance_km != null ? Number(r.max_distance_km) : null,
            minOrderAmount: Number(r.min_order_amount || 0),
            maxOrderAmount: r.max_order_amount != null ? Number(r.max_order_amount) : null,
            minCheckoutSubtotal: Number(r.min_checkout_subtotal || 0),
            feeType: r.fee_type || 'free',
            feeAmount: Number(r.fee_amount || 0),
            priority: Number(r.priority || 1),
            isActive: Boolean(r.is_active ?? true)
        }));
}
async function upsertDeliveryFeeRuleRecord(rule) {
    const payload = {
        name: rule.name,
        min_distance_km: rule.minDistanceKm ?? 0,
        max_distance_km: rule.maxDistanceKm,
        min_order_amount: rule.minOrderAmount ?? 0,
        max_order_amount: rule.maxOrderAmount,
        min_checkout_subtotal: rule.minCheckoutSubtotal ?? 0,
        fee_type: rule.feeType || 'free',
        fee_amount: rule.feeAmount ?? 0,
        priority: rule.priority ?? 1,
        is_active: rule.isActive ?? true,
        updated_at: new Date().toISOString()
    };
    if (rule.id) {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('delivery_fee_rules').update(payload).eq('id', rule.id);
        if (error) throw error;
    } else {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('delivery_fee_rules').insert(payload);
        if (error) throw error;
    }
}
async function deleteDeliveryFeeRuleRecord(ruleId) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('delivery_fee_rules').delete().eq('id', ruleId);
    if (error) throw error;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/admin/features/settings/repositories/payment-gateways.repository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchPaymentGatewaysWithCredentials",
    ()=>fetchPaymentGatewaysWithCredentials,
    "savePaymentGatewayRecord",
    ()=>savePaymentGatewayRecord
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/lib/supabase.ts [app-client] (ecmascript)");
;
async function fetchPaymentGatewaysWithCredentials() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('payment_gateways').select('*');
    if (error) {
        console.warn('Error fetching payment gateways from Supabase:', error.message);
        return [];
    }
    return data || [];
}
async function savePaymentGatewayRecord(input) {
    try {
        const providerCode = input.gatewayId.toLowerCase();
        const providerUpper = providerCode.toUpperCase();
        const shouldMakeActive = input.makeActive !== false;
        // 1. If making active, deactivate all existing active gateways first
        if (shouldMakeActive) {
            const { error: deactErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('payment_gateways').update({
                is_active: false
            }).eq('is_active', true);
            if (deactErr) {
                console.warn('Notice deactivating active gateways:', deactErr.message);
            }
        }
        // 2. Locate existing gateway row by provider
        const { data: existingRows } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('payment_gateways').select('id, provider, is_active').eq('provider', providerCode);
        let targetGwId = existingRows?.[0]?.id;
        const gatewayPayload = {
            provider: providerCode,
            display_name: input.displayName,
            key_id: input.keyId,
            secret_reference: `${providerUpper}_KEY_SECRET`,
            webhook_secret_reference: `${providerUpper}_WEBHOOK_SECRET`,
            verification_status: input.verificationStatus || 'verified',
            last_verified_at: new Date().toISOString(),
            is_active: shouldMakeActive ? true : Boolean(existingRows?.[0]?.is_active),
            environment: 'test',
            updated_at: new Date().toISOString()
        };
        if (targetGwId) {
            // Update existing single row
            const { error: updErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('payment_gateways').update(gatewayPayload).eq('id', targetGwId);
            if (updErr) throw updErr;
        } else {
            // Insert new single row
            const { error: insErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('payment_gateways').insert(gatewayPayload);
            if (insErr) {
                // Fallback with explicit id = providerCode if primary key is text
                const { error: insIdErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('payment_gateways').insert({
                    ...gatewayPayload,
                    id: providerCode
                });
                if (insIdErr) throw insIdErr;
            }
        }
        return {
            success: true
        };
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('savePaymentGatewayRecord exception:', msg);
        return {
            success: false,
            error: msg
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/admin/features/settings/repositories/store-settings.repository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchStoreSettingsRow",
    ()=>fetchStoreSettingsRow,
    "upsertStoreSettingsRow",
    ()=>upsertStoreSettingsRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/lib/supabase.ts [app-client] (ecmascript)");
;
async function fetchStoreSettingsRow() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('store_settings').select('is_store_open, store_name, store_address, store_latitude, store_longitude').eq('id', 'default').single();
    if (error) throw error;
    return data;
}
async function upsertStoreSettingsRow(input) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('store_settings').upsert({
        id: 'default',
        is_store_open: input.isStoreOpen,
        store_name: input.storeName,
        store_address: input.storeAddress,
        store_latitude: input.latitude,
        store_longitude: input.longitude,
        updated_at: new Date().toISOString()
    });
    if (error) throw error;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/admin/features/settings/schemas/store-settings.schema.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "saveStoreSettingsSchema",
    ()=>saveStoreSettingsSchema,
    "storeSettingsRowSchema",
    ()=>storeSettingsRowSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z .object>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z .boolean>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z .string>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$coerce$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z .coerce>");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__ = __turbopack_context__.i("[project]/admin/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z .number>");
;
const storeSettingsRowSchema = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    is_store_open: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean().nullable(),
    store_name: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().nullable(),
    store_address: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().nullable(),
    store_latitude: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$coerce$3e$__["z"].coerce.number().nullable(),
    store_longitude: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$coerce$3e$__["z"].coerce.number().nullable()
});
const saveStoreSettingsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    isStoreOpen: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean(),
    storeName: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
    storeAddress: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string(),
    latitude: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().finite(),
    longitude: __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().finite()
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/admin/features/settings/services/gateway-verification.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "verifyGatewayCredentials",
    ()=>verifyGatewayCredentials
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/admin/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/lib/supabase.ts [app-client] (ecmascript)");
;
async function verifyGatewayCredentials(input) {
    const { provider, keyId, secretKey } = input;
    if (!keyId.trim() || !secretKey.trim()) {
        return {
            isValid: false,
            message: 'Key ID and Secret Key cannot be empty.',
            provider
        };
    }
    // 1. Authenticate user session before invoking function
    const { data: sessionData } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
    const token = sessionData?.session?.access_token;
    if (!token) {
        return {
            isValid: false,
            message: '🔒 Authentication required: Please sign in as an admin to verify payment gateway keys.',
            provider
        };
    }
    const supabaseUrl = ("TURBOPACK compile-time value", "https://xsdkpbvvbjzvchlsdizi.supabase.co") || 'https://xsdkpbvvbjzvchlsdizi.supabase.co';
    const edgeFunctionUrl = `${supabaseUrl.replace(/\/$/, '')}/functions/v1/verify-gateway-keys`;
    try {
        const res = await fetch(edgeFunctionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                provider,
                keyId: keyId.trim(),
                secretKey: secretKey.trim()
            })
        });
        if (res.ok) {
            const result = await res.json();
            return result;
        }
        const errJson = await res.json().catch(()=>null);
        if (errJson && typeof errJson.message === 'string') {
            return {
                isValid: Boolean(errJson.isValid),
                message: errJson.message,
                provider
            };
        }
    } catch (err) {
        console.warn('Edge Function verification network issue:', err);
    }
    return {
        isValid: false,
        message: '❌ Could not verify payment gateway keys via server Edge Function.',
        provider
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/admin/features/settings/services/store-settings.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAdminStoreSettings",
    ()=>getAdminStoreSettings,
    "saveAdminStoreSettings",
    ()=>saveAdminStoreSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$repositories$2f$store$2d$settings$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/features/settings/repositories/store-settings.repository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$schemas$2f$store$2d$settings$2e$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/features/settings/schemas/store-settings.schema.ts [app-client] (ecmascript)");
;
;
async function getAdminStoreSettings() {
    const row = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$schemas$2f$store$2d$settings$2e$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storeSettingsRowSchema"].parse(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$repositories$2f$store$2d$settings$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchStoreSettingsRow"])());
    return {
        isStoreOpen: row.is_store_open ?? true,
        storeName: row.store_name || 'Royal Bengal',
        storeAddress: row.store_address || 'Madhapur, Hyderabad',
        latitude: row.store_latitude,
        longitude: row.store_longitude
    };
}
async function saveAdminStoreSettings(input) {
    const validatedInput = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$schemas$2f$store$2d$settings$2e$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveStoreSettingsSchema"].parse(input);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$features$2f$settings$2f$repositories$2f$store$2d$settings$2e$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["upsertStoreSettingsRow"])(validatedInput);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);})()

//# sourceMappingURL=admin_0jj9fvlvt6mkd._.js.map