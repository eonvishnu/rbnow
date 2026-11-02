(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/website/app/components/PWARegister.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PWARegister
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function PWARegister() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PWARegister.useEffect": ()=>{
            if (("TURBOPACK compile-time value", "object") !== "undefined" && "serviceWorker" in navigator) {
                navigator.serviceWorker.register("/sw.js").then({
                    "PWARegister.useEffect": (reg)=>console.log("SW registered scope: ", reg.scope)
                }["PWARegister.useEffect"]).catch({
                    "PWARegister.useEffect": (err)=>console.error("SW registration failed: ", err)
                }["PWARegister.useEffect"]);
            }
        }
    }["PWARegister.useEffect"], []);
    return null;
}
_s(PWARegister, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = PWARegister;
var _c;
__turbopack_context__.k.register(_c, "PWARegister");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/website/app/components/PWARegister.tsx [app-client] (ecmascript, next/dynamic entry)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/website/app/components/PWARegister.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=website_app_components_PWARegister_tsx_0fz337vin6vk6._.js.map