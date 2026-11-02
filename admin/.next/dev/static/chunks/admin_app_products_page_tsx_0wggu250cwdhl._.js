(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/admin/app/products/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/admin/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UploadCloud$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-upload.js [app-client] (ecmascript) <export default as UploadCloud>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const LOW_STOCK = 5;
const PAGE_SIZE = 20;
const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp'
];
const MAX_IMAGE_MB = 5;
const formatCurrency = (n)=>new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(n || 0);
const validateImage = (file)=>{
    if (!ALLOWED_TYPES.includes(file.type)) return 'Use a JPG, PNG or WebP image.';
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) return `Image must be under ${MAX_IMAGE_MB} MB.`;
    return null;
};
// Client-side resize + WebP conversion (same as the Add Product page)
const compressAndConvertToWebP = (file, maxWidth = 1000, quality = 0.82)=>new Promise((resolve)=>{
        if (!file.type.startsWith('image/')) return resolve(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event)=>{
            const img = new Image();
            img.src = event.target?.result;
            img.onload = ()=>{
                const canvas = document.createElement('canvas');
                let { width, height } = img;
                if (width > maxWidth) {
                    height = Math.round(height * maxWidth / width);
                    width = maxWidth;
                }
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob)=>{
                    if (!blob) return resolve(file);
                    const clean = file.name.substring(0, file.name.lastIndexOf('.')) || 'product';
                    resolve(new File([
                        blob
                    ], `${clean}_${Date.now()}.webp`, {
                        type: 'image/webp'
                    }));
                }, 'image/webp', quality);
            };
            img.onerror = ()=>resolve(file);
        };
        reader.onerror = ()=>resolve(file);
    });
const inputCls = 'w-full min-h-11 sm:min-h-9 py-2 px-3 text-base sm:text-[13px] text-[#1a1a1a] placeholder:text-[#8a8a8a] bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.2)] outline-none focus:shadow-[0_0_0_2px_#005bd3] transition-shadow';
function ProductsPage() {
    _s();
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [filterCategory, setFilterCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('All');
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(PAGE_SIZE);
    // quick edit
    const [expandedId, setExpandedId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [drafts, setDrafts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [savingId, setSavingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [togglingId, setTogglingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // full edit drawer
    const [editing, setEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editError, setEditError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const imageInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [toast, setToast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const flash = (type, text)=>{
        setToast({
            type,
            text
        });
        setTimeout(()=>setToast(null), 3500);
    };
    const fetchProducts = async ()=>{
        const { data: prodData } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('products').select('*, product_variants(*)').order('name');
        if (prodData) {
            setProducts(prodData.map((p)=>({
                    id: p.id,
                    name: p.name || '',
                    category: p.category_name,
                    description: p.description,
                    imageUrl: p.image_url,
                    isAvailable: p.is_available !== false,
                    variants: (p.product_variants || []).slice().sort((a, b)=>Number(a.price) - Number(b.price))
                })));
        }
        const { data: catData } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('categories').select('*').order('name');
        if (catData) setCategories(catData);
        setLoading(false);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductsPage.useEffect": ()=>{
            fetchProducts();
        }
    }["ProductsPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductsPage.useEffect": ()=>{
            const onKey = {
                "ProductsPage.useEffect.onKey": (e)=>e.key === 'Escape' && !isSubmitting && closeEditor()
            }["ProductsPage.useEffect.onKey"];
            window.addEventListener('keydown', onKey);
            return ({
                "ProductsPage.useEffect": ()=>window.removeEventListener('keydown', onKey)
            })["ProductsPage.useEffect"];
        }
    }["ProductsPage.useEffect"]);
    // ---------- derived data ----------
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductsPage.useMemo[stats]": ()=>{
            let value = 0, low = 0, out = 0;
            products.forEach({
                "ProductsPage.useMemo[stats]": (p)=>p.variants.forEach({
                        "ProductsPage.useMemo[stats]": (v)=>{
                            const stock = Number(v.stock) || 0;
                            value += (Number(v.price) || 0) * stock;
                            if (stock <= 0) out++;
                            else if (stock < LOW_STOCK) low++;
                        }
                    }["ProductsPage.useMemo[stats]"])
            }["ProductsPage.useMemo[stats]"]);
            return {
                total: products.length,
                active: products.filter({
                    "ProductsPage.useMemo[stats]": (p)=>p.isAvailable
                }["ProductsPage.useMemo[stats]"]).length,
                value,
                low,
                out
            };
        }
    }["ProductsPage.useMemo[stats]"], [
        products
    ]);
    const hasLow = (p)=>p.variants.some((v)=>Number(v.stock) < LOW_STOCK);
    const tabs = [
        {
            id: 'all',
            label: 'All',
            count: products.length
        },
        {
            id: 'active',
            label: 'Active',
            count: stats.active
        },
        {
            id: 'disabled',
            label: 'Disabled',
            count: products.length - stats.active
        },
        {
            id: 'low',
            label: 'Low stock',
            count: products.filter(hasLow).length
        }
    ];
    const filtered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductsPage.useMemo[filtered]": ()=>{
            const q = searchQuery.trim().toLowerCase();
            return products.filter({
                "ProductsPage.useMemo[filtered]": (p)=>{
                    const matchesQ = !q || p.name.toLowerCase().includes(q) || String(p.category || '').toLowerCase().includes(q);
                    const matchesCat = filterCategory === 'All' || p.category === filterCategory;
                    const matchesTab = tab === 'all' ? true : tab === 'active' ? p.isAvailable : tab === 'disabled' ? !p.isAvailable : hasLow(p);
                    return matchesQ && matchesCat && matchesTab;
                }
            }["ProductsPage.useMemo[filtered]"]);
        }
    }["ProductsPage.useMemo[filtered]"], [
        products,
        searchQuery,
        filterCategory,
        tab
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductsPage.useEffect": ()=>setVisible(PAGE_SIZE)
    }["ProductsPage.useEffect"], [
        searchQuery,
        filterCategory,
        tab
    ]);
    // ---------- enable / disable ----------
    const handleToggle = async (p)=>{
        const next = !p.isAvailable;
        if (next && !p.imageUrl) return flash('error', 'Add an image before enabling this product.');
        setTogglingId(p.id);
        setProducts((prev)=>prev.map((x)=>x.id === p.id ? {
                    ...x,
                    isAvailable: next
                } : x));
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('products').update({
            is_available: next,
            updated_at: new Date().toISOString()
        }).eq('id', p.id);
        if (error) {
            setProducts((prev)=>prev.map((x)=>x.id === p.id ? {
                        ...x,
                        isAvailable: !next
                    } : x));
            flash('error', 'Could not update the product');
        } else {
            flash('success', `${p.name} ${next ? 'enabled' : 'disabled'}`);
        }
        setTogglingId(null);
    };
    // ---------- quick edit (price & stock in the list) ----------
    const draftOf = (v)=>drafts[v.id] ?? {
            price: String(v.price ?? ''),
            stock: String(v.stock ?? '')
        };
    const isDirty = (v)=>!!drafts[v.id] && (drafts[v.id].price !== String(v.price ?? '') || drafts[v.id].stock !== String(v.stock ?? ''));
    const productDirty = (p)=>p.variants.some(isDirty);
    const setDraft = (v, field, value)=>setDrafts((d)=>({
                ...d,
                [v.id]: {
                    ...draftOf(v),
                    [field]: value
                }
            }));
    const discardQuick = (p)=>setDrafts((d)=>{
            const copy = {
                ...d
            };
            p.variants.forEach((v)=>delete copy[v.id]);
            return copy;
        });
    const saveQuick = async (p)=>{
        const changed = p.variants.filter(isDirty);
        if (!changed.length) return;
        const rows = [];
        for (const v of changed){
            const d = drafts[v.id];
            const price = Number(d.price);
            const stock = Number(d.stock);
            if (d.price.trim() === '' || !isFinite(price) || price < 0) return flash('error', `Enter a valid price for ${v.unit}.`);
            if (d.stock.trim() === '' || !Number.isInteger(stock) || stock < 0) return flash('error', `Stock for ${v.unit} must be a whole number, 0 or more.`);
            rows.push({
                id: v.id,
                price,
                stock
            });
        }
        setSavingId(p.id);
        const results = await Promise.all(rows.map((r)=>__TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('product_variants').update({
                price: r.price,
                stock: r.stock,
                is_available: r.stock > 0,
                updated_at: new Date().toISOString()
            }).eq('id', r.id)));
        const failed = results.filter((r)=>r.error).length;
        // keep whatever did save in the UI
        const okIds = rows.filter((_, i)=>!results[i].error);
        setProducts((prev)=>prev.map((x)=>x.id !== p.id ? x : {
                    ...x,
                    variants: x.variants.map((v)=>{
                        const r = okIds.find((o)=>o.id === v.id);
                        return r ? {
                            ...v,
                            price: r.price,
                            stock: r.stock,
                            is_available: r.stock > 0
                        } : v;
                    })
                }));
        setDrafts((d)=>{
            const copy = {
                ...d
            };
            okIds.forEach((r)=>delete copy[r.id]);
            return copy;
        });
        if (failed) flash('error', `${failed} variant${failed > 1 ? 's' : ''} could not be saved. Please try again.`);
        else flash('success', 'Changes saved');
        setSavingId(null);
    };
    // ---------- delete ----------
    const handleDeleteProduct = async (p)=>{
        if (!confirm(`Delete "${p.name}" and all its variants? This cannot be undone. To hide it instead, disable it.`)) return;
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('products').delete().eq('id', p.id);
        if (error) {
            console.error('Delete failed:', error);
            flash('error', 'Could not delete. It may be part of past orders — disable it instead.');
        } else {
            setProducts((prev)=>prev.filter((x)=>x.id !== p.id));
            flash('success', 'Product deleted');
        }
    };
    // ---------- full edit drawer ----------
    const openEditor = (p)=>{
        setEditError('');
        setEditing({
            id: p.id,
            name: p.name,
            category: p.category || '',
            description: p.description || '',
            imageUrl: p.imageUrl || '',
            newImageFile: null,
            newImagePreview: '',
            removed: [],
            variants: p.variants.map((v)=>({
                    id: v.id,
                    unit: v.unit || '',
                    price: String(v.price ?? ''),
                    stock: String(v.stock ?? '')
                }))
        });
    };
    const closeEditor = ()=>{
        setEditing((cur)=>{
            if (cur?.newImagePreview) URL.revokeObjectURL(cur.newImagePreview);
            return null;
        });
    };
    const setEditField = (patch)=>setEditing((cur)=>({
                ...cur,
                ...patch
            }));
    const updateEditVariant = (index, field, value)=>setEditing((cur)=>{
            const variants = [
                ...cur.variants
            ];
            variants[index] = {
                ...variants[index],
                [field]: value
            };
            return {
                ...cur,
                variants
            };
        });
    const addEditVariant = ()=>setEditing((cur)=>({
                ...cur,
                variants: [
                    ...cur.variants,
                    {
                        id: `temp_${Date.now()}`,
                        unit: '',
                        price: '',
                        stock: '0'
                    }
                ]
            }));
    const removeEditVariant = (index)=>setEditing((cur)=>{
            const v = cur.variants[index];
            const isSaved = v.id && !String(v.id).startsWith('temp_');
            return {
                ...cur,
                variants: cur.variants.filter((_, i)=>i !== index),
                removed: isSaved ? [
                    ...cur.removed,
                    v.id
                ] : cur.removed
            };
        });
    const handleEditImage = async (file)=>{
        if (imageInputRef.current) imageInputRef.current.value = '';
        if (!file) return;
        const err = validateImage(file);
        if (err) return setEditError(err);
        setEditError('');
        const webp = await compressAndConvertToWebP(file);
        setEditing((cur)=>{
            if (cur?.newImagePreview) URL.revokeObjectURL(cur.newImagePreview);
            return {
                ...cur,
                newImageFile: webp,
                newImagePreview: URL.createObjectURL(webp)
            };
        });
    };
    const handleUpdateProduct = async (e)=>{
        e?.preventDefault();
        if (!editing) return;
        setEditError('');
        if (!editing.name.trim()) return setEditError('Product name is required.');
        if (!editing.category) return setEditError('Choose a category.');
        if (!editing.imageUrl && !editing.newImageFile) return setEditError('A product image is required.');
        if (editing.variants.length === 0) return setEditError('At least one variant is required.');
        const parsed = [];
        for(let i = 0; i < editing.variants.length; i++){
            const v = editing.variants[i];
            const price = Number(v.price);
            const stock = Number(v.stock);
            if (!v.unit.trim()) return setEditError(`Variant ${i + 1}: enter a unit, for example 500g.`);
            if (v.price.trim() === '' || !isFinite(price) || price < 0) return setEditError(`Variant ${i + 1}: enter a valid price.`);
            if (v.stock.trim() === '' || !Number.isInteger(stock) || stock < 0) return setEditError(`Variant ${i + 1}: stock must be a whole number, 0 or more.`);
            parsed.push({
                ...v,
                unit: v.unit.trim(),
                price,
                stock
            });
        }
        setIsSubmitting(true);
        try {
            let imageUrl = editing.imageUrl;
            if (editing.newImageFile) {
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.webp`;
                const { error: upErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].storage.from('products').upload(fileName, editing.newImageFile, {
                    contentType: 'image/webp'
                });
                if (upErr) throw upErr;
                imageUrl = __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].storage.from('products').getPublicUrl(fileName).data.publicUrl;
            }
            const matchedCat = categories.find((c)=>c.name === editing.category);
            const { error: prodErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('products').update({
                name: editing.name.trim(),
                category_name: editing.category,
                category_id: matchedCat?.id ?? null,
                description: editing.description,
                image_url: imageUrl,
                updated_at: new Date().toISOString()
            }).eq('id', editing.id);
            if (prodErr) throw prodErr;
            if (editing.removed.length) {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('product_variants').delete().in('id', editing.removed);
                if (error) throw error;
            }
            for (const v of parsed){
                const row = {
                    unit: v.unit,
                    price: v.price,
                    stock: v.stock,
                    is_available: v.stock > 0,
                    updated_at: new Date().toISOString()
                };
                const isNew = !v.id || String(v.id).startsWith('temp_');
                const { error } = isNew ? await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('product_variants').insert({
                    product_id: editing.id,
                    ...row
                }) : await __TURBOPACK__imported__module__$5b$project$5d2f$admin$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('product_variants').update(row).eq('id', v.id);
                if (error) throw error;
            }
            closeEditor();
            flash('success', 'Product saved');
            fetchProducts();
        } catch (err) {
            console.error('Update failed:', err);
            setEditError(err?.message || 'Failed to save changes');
        } finally{
            setIsSubmitting(false);
        }
    };
    const priceRange = (p)=>{
        const prices = p.variants.map((v)=>Number(v.price) || 0);
        if (!prices.length) return '—';
        const lo = Math.min(...prices), hi = Math.max(...prices);
        return lo === hi ? formatCurrency(lo) : `${formatCurrency(lo)} – ${formatCurrency(hi)}`;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-xl font-semibold text-[#1a1a1a]",
                        children: "Products"
                    }, void 0, false, {
                        fileName: "[project]/admin/app/products/page.tsx",
                        lineNumber: 386,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/products/add",
                        className: "min-h-10 sm:min-h-8 px-4 sm:px-3 inline-flex items-center gap-1.5 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-sm sm:text-[13px] font-medium text-white transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                size: 15
                            }, void 0, false, {
                                fileName: "[project]/admin/app/products/page.tsx",
                                lineNumber: 391,
                                columnNumber: 11
                            }, this),
                            " Add product"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/products/page.tsx",
                        lineNumber: 387,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/products/page.tsx",
                lineNumber: 385,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                className: "grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-200/80",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Kpi, {
                        label: "Products",
                        value: `${stats.total}`,
                        sub: `${stats.active} active`,
                        loading: loading
                    }, void 0, false, {
                        fileName: "[project]/admin/app/products/page.tsx",
                        lineNumber: 397,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Kpi, {
                        label: "Inventory value",
                        value: formatCurrency(stats.value),
                        loading: loading
                    }, void 0, false, {
                        fileName: "[project]/admin/app/products/page.tsx",
                        lineNumber: 398,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Kpi, {
                        label: "Low stock variants",
                        value: `${stats.low}`,
                        sub: `under ${LOW_STOCK} left`,
                        warn: stats.low > 0,
                        loading: loading
                    }, void 0, false, {
                        fileName: "[project]/admin/app/products/page.tsx",
                        lineNumber: 399,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Kpi, {
                        label: "Out of stock variants",
                        value: `${stats.out}`,
                        warn: stats.out > 0,
                        loading: loading
                    }, void 0, false, {
                        fileName: "[project]/admin/app/products/page.tsx",
                        lineNumber: 400,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/products/page.tsx",
                lineNumber: 396,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                className: "overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-3 sm:px-4 pt-3 space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-1 overflow-x-auto no-scrollbar",
                                children: tabs.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setTab(t.id),
                                        className: `min-h-9 py-1.5 px-3 rounded-lg text-sm sm:text-[13px] whitespace-nowrap transition-colors ${tab === t.id ? 'bg-[#303030] text-white font-medium' : 'text-[#303030] hover:bg-gray-100'}`,
                                        children: [
                                            t.label,
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: tab === t.id ? 'text-white/70' : 'text-[#8a8a8a]',
                                                children: t.count
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/products/page.tsx",
                                                lineNumber: 415,
                                                columnNumber: 27
                                            }, this)
                                        ]
                                    }, t.id, true, {
                                        fileName: "[project]/admin/app/products/page.tsx",
                                        lineNumber: 408,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/admin/app/products/page.tsx",
                                lineNumber: 406,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col sm:flex-row gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                size: 14,
                                                className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/products/page.tsx",
                                                lineNumber: 422,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                placeholder: "Search products or categories",
                                                value: searchQuery,
                                                onChange: (e)=>setSearchQuery(e.target.value),
                                                className: `${inputCls} pl-9`
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/products/page.tsx",
                                                lineNumber: 423,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/products/page.tsx",
                                        lineNumber: 421,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: filterCategory,
                                        onChange: (e)=>setFilterCategory(e.target.value),
                                        className: `${inputCls} sm:w-56 cursor-pointer`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "All",
                                                children: "All categories"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/products/page.tsx",
                                                lineNumber: 431,
                                                columnNumber: 15
                                            }, this),
                                            categories.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: c.name,
                                                    children: c.name
                                                }, c.id, false, {
                                                    fileName: "[project]/admin/app/products/page.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/products/page.tsx",
                                        lineNumber: 430,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/products/page.tsx",
                                lineNumber: 420,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/products/page.tsx",
                        lineNumber: 405,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 border-t border-gray-100 divide-y divide-gray-100",
                        children: loading ? Array.from({
                            length: 4
                        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-14 bg-gray-100 rounded-lg animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/admin/app/products/page.tsx",
                                    lineNumber: 442,
                                    columnNumber: 44
                                }, this)
                            }, i, false, {
                                fileName: "[project]/admin/app/products/page.tsx",
                                lineNumber: 442,
                                columnNumber: 15
                            }, this)) : filtered.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "py-14 text-center text-sm sm:text-[13px] text-[#616161]",
                            children: products.length === 0 ? 'No products yet. Add your first one.' : 'No products match your search or filter.'
                        }, void 0, false, {
                            fileName: "[project]/admin/app/products/page.tsx",
                            lineNumber: 445,
                            columnNumber: 13
                        }, this) : filtered.slice(0, visible).map((p)=>{
                            const open = expandedId === p.id;
                            const dirty = productDirty(p);
                            const totalStock = p.variants.reduce((s, v)=>s + (Number(v.stock) || 0), 0);
                            const allOut = p.variants.length > 0 && totalStock <= 0;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: p.isAvailable ? '' : 'bg-[#fafafa]',
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-3 sm:p-4 flex items-center gap-3 sm:gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `h-14 w-14 rounded-lg bg-[#f7f7f7] shrink-0 overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.06)] flex items-center justify-center ${p.isAvailable ? '' : 'opacity-50 grayscale'}`,
                                                children: p.imageUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: p.imageUrl,
                                                    alt: "",
                                                    className: "w-full h-full object-cover"
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/products/page.tsx",
                                                    lineNumber: 459,
                                                    columnNumber: 37
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                                    size: 20,
                                                    className: "text-[#8a8a8a]"
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/products/page.tsx",
                                                    lineNumber: 459,
                                                    columnNumber: 110
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/products/page.tsx",
                                                lineNumber: 458,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: `text-sm font-semibold truncate ${p.isAvailable ? 'text-[#1a1a1a]' : 'text-[#8a8a8a]'}`,
                                                        children: p.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/products/page.tsx",
                                                        lineNumber: 463,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1.5 flex-wrap mt-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pill, {
                                                                tone: "bg-[#f1f1f1] text-[#303030]",
                                                                children: p.category || 'General'
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/products/page.tsx",
                                                                lineNumber: 465,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pill, {
                                                                tone: p.isAvailable ? 'bg-[#cdfed4] text-[#014b40]' : 'bg-[#e3e3e3] text-[#303030]',
                                                                children: p.isAvailable ? 'Active' : 'Disabled'
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/products/page.tsx",
                                                                lineNumber: 466,
                                                                columnNumber: 25
                                                            }, this),
                                                            !p.imageUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pill, {
                                                                tone: "bg-[#ffd6a4] text-[#5e4200]",
                                                                children: "No image"
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/products/page.tsx",
                                                                lineNumber: 467,
                                                                columnNumber: 41
                                                            }, this),
                                                            allOut ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pill, {
                                                                tone: "bg-[#fed1d7] text-[#8e0b21]",
                                                                children: "Out of stock"
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/products/page.tsx",
                                                                lineNumber: 468,
                                                                columnNumber: 35
                                                            }, this) : hasLow(p) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pill, {
                                                                tone: "bg-[#ffd6a4] text-[#5e4200]",
                                                                children: "Low stock"
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/products/page.tsx",
                                                                lineNumber: 468,
                                                                columnNumber: 111
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/products/page.tsx",
                                                        lineNumber: 464,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/products/page.tsx",
                                                lineNumber: 462,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Switch, {
                                                on: p.isAvailable,
                                                disabled: togglingId === p.id,
                                                label: `${p.isAvailable ? 'Disable' : 'Enable'} ${p.name}`,
                                                onClick: ()=>handleToggle(p)
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/products/page.tsx",
                                                lineNumber: 472,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/products/page.tsx",
                                        lineNumber: 457,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-3 sm:px-4 pb-3 sm:pb-4 flex flex-wrap items-center justify-between gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm sm:text-[13px] text-[#616161]",
                                                children: [
                                                    p.variants.length,
                                                    " ",
                                                    p.variants.length === 1 ? 'variant' : 'variants',
                                                    " · ",
                                                    priceRange(p),
                                                    " · ",
                                                    totalStock,
                                                    " in stock"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/products/page.tsx",
                                                lineNumber: 477,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setExpandedId(open ? null : p.id),
                                                        className: "min-h-9 py-1.5 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50",
                                                        "aria-expanded": open,
                                                        children: [
                                                            "Quick edit ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                size: 14,
                                                                className: `transition-transform ${open ? 'rotate-180' : ''}`
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/products/page.tsx",
                                                                lineNumber: 486,
                                                                columnNumber: 36
                                                            }, this),
                                                            dirty && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "w-2 h-2 rounded-full bg-[#005bd3]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/products/page.tsx",
                                                                lineNumber: 487,
                                                                columnNumber: 35
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/products/page.tsx",
                                                        lineNumber: 481,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>openEditor(p),
                                                        className: "min-h-9 py-1.5 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                                                size: 13
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/products/page.tsx",
                                                                lineNumber: 493,
                                                                columnNumber: 25
                                                            }, this),
                                                            " Edit"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/products/page.tsx",
                                                        lineNumber: 489,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleDeleteProduct(p),
                                                        className: "p-2 rounded-lg text-[#8a8a8a] hover:text-[#8e0b21] hover:bg-[#fed1d7]/50 transition-colors",
                                                        "aria-label": `Delete ${p.name}`,
                                                        title: "Delete product",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                            size: 16
                                                        }, void 0, false, {
                                                            fileName: "[project]/admin/app/products/page.tsx",
                                                            lineNumber: 501,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/products/page.tsx",
                                                        lineNumber: 495,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/products/page.tsx",
                                                lineNumber: 480,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/products/page.tsx",
                                        lineNumber: 476,
                                        columnNumber: 19
                                    }, this),
                                    open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mx-3 sm:mx-4 mb-3 sm:mb-4 rounded-lg bg-[#f7f7f7] p-3 space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "hidden sm:grid grid-cols-[1fr_140px_120px] gap-3 px-1 text-xs font-medium text-[#616161]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Variant"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/products/page.tsx",
                                                        lineNumber: 510,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Price (₹)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/products/page.tsx",
                                                        lineNumber: 510,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Stock"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/products/page.tsx",
                                                        lineNumber: 510,
                                                        columnNumber: 67
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/products/page.tsx",
                                                lineNumber: 509,
                                                columnNumber: 23
                                            }, this),
                                            p.variants.map((v)=>{
                                                const d = draftOf(v);
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 sm:grid-cols-[1fr_140px_120px] gap-x-3 gap-y-1.5 items-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "col-span-2 sm:col-span-1 text-sm sm:text-[13px] font-semibold text-[#1a1a1a] px-1",
                                                            children: v.unit
                                                        }, void 0, false, {
                                                            fileName: "[project]/admin/app/products/page.tsx",
                                                            lineNumber: 516,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "sm:hidden text-xs text-[#616161]",
                                                                    children: "Price (₹)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/admin/app/products/page.tsx",
                                                                    lineNumber: 518,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    inputMode: "decimal",
                                                                    value: d.price,
                                                                    onChange: (e)=>setDraft(v, 'price', e.target.value),
                                                                    className: inputCls,
                                                                    "aria-label": `${v.unit} price`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/admin/app/products/page.tsx",
                                                                    lineNumber: 519,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/admin/app/products/page.tsx",
                                                            lineNumber: 517,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "sm:hidden text-xs text-[#616161]",
                                                                    children: "Stock"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/admin/app/products/page.tsx",
                                                                    lineNumber: 528,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    inputMode: "numeric",
                                                                    value: d.stock,
                                                                    onChange: (e)=>setDraft(v, 'stock', e.target.value),
                                                                    className: `${inputCls} ${Number(d.stock) < LOW_STOCK ? '!shadow-[0_0_0_1px_#e22c38]' : ''}`,
                                                                    "aria-label": `${v.unit} stock`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/admin/app/products/page.tsx",
                                                                    lineNumber: 529,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/admin/app/products/page.tsx",
                                                            lineNumber: 527,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, v.id, true, {
                                                    fileName: "[project]/admin/app/products/page.tsx",
                                                    lineNumber: 515,
                                                    columnNumber: 27
                                                }, this);
                                            }),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-end gap-2 pt-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>discardQuick(p),
                                                        disabled: !dirty || savingId === p.id,
                                                        className: "min-h-9 py-1.5 px-3 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50 disabled:opacity-40",
                                                        children: "Discard"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/products/page.tsx",
                                                        lineNumber: 541,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>saveQuick(p),
                                                        disabled: !dirty || savingId === p.id,
                                                        className: "min-h-9 py-1.5 px-4 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-sm sm:text-[13px] font-medium text-white disabled:opacity-40 inline-flex items-center gap-1.5",
                                                        children: savingId === p.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                            size: 14,
                                                            className: "animate-spin"
                                                        }, void 0, false, {
                                                            fileName: "[project]/admin/app/products/page.tsx",
                                                            lineNumber: 553,
                                                            columnNumber: 48
                                                        }, this) : 'Save'
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/products/page.tsx",
                                                        lineNumber: 548,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/products/page.tsx",
                                                lineNumber: 540,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/products/page.tsx",
                                        lineNumber: 508,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, p.id, true, {
                                fileName: "[project]/admin/app/products/page.tsx",
                                lineNumber: 455,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/admin/app/products/page.tsx",
                        lineNumber: 439,
                        columnNumber: 9
                    }, this),
                    !loading && filtered.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm sm:text-[13px] text-[#616161]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Showing ",
                                    Math.min(visible, filtered.length),
                                    " of ",
                                    filtered.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/products/page.tsx",
                                lineNumber: 566,
                                columnNumber: 13
                            }, this),
                            visible < filtered.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setVisible((v)=>v + PAGE_SIZE),
                                className: "min-h-9 py-1.5 px-3 rounded-lg bg-white font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50",
                                children: "Show more"
                            }, void 0, false, {
                                fileName: "[project]/admin/app/products/page.tsx",
                                lineNumber: 568,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/products/page.tsx",
                        lineNumber: 565,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/products/page.tsx",
                lineNumber: 404,
                columnNumber: 7
            }, this),
            editing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-[100]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 bg-black/40",
                        onClick: ()=>!isSubmitting && closeEditor()
                    }, void 0, false, {
                        fileName: "[project]/admin/app/products/page.tsx",
                        lineNumber: 579,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "fixed inset-y-0 right-0 w-full max-w-lg bg-[#f1f1f1] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-14 px-4 sm:px-5 bg-white border-b border-gray-200 flex items-center justify-between shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-sm font-semibold text-[#1a1a1a] truncate",
                                        children: "Edit product"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/products/page.tsx",
                                        lineNumber: 582,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: closeEditor,
                                        disabled: isSubmitting,
                                        className: "p-2 -mr-2 rounded-lg hover:bg-gray-100",
                                        "aria-label": "Close",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            size: 18
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/products/page.tsx",
                                            lineNumber: 583,
                                            columnNumber: 139
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/products/page.tsx",
                                        lineNumber: 583,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/products/page.tsx",
                                lineNumber: 581,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                onSubmit: handleUpdateProduct,
                                className: "flex-1 overflow-y-auto p-4 sm:p-5 space-y-4",
                                children: [
                                    editError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        role: "alert",
                                        className: "rounded-lg bg-[#fed1d7] px-3 py-2 text-sm sm:text-[13px] text-[#8e0b21]",
                                        children: editError
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/products/page.tsx",
                                        lineNumber: 587,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                                        className: "p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-sm font-semibold text-[#1a1a1a] mb-3",
                                                children: [
                                                    "Image ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[#8e0b21]",
                                                        children: "*"
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/products/page.tsx",
                                                        lineNumber: 591,
                                                        columnNumber: 81
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/products/page.tsx",
                                                lineNumber: 591,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-24 w-24 rounded-lg bg-[#f7f7f7] overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.08)] flex items-center justify-center shrink-0",
                                                        children: editing.newImagePreview || editing.imageUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: editing.newImagePreview || editing.imageUrl,
                                                            alt: "",
                                                            className: "w-full h-full object-cover"
                                                        }, void 0, false, {
                                                            fileName: "[project]/admin/app/products/page.tsx",
                                                            lineNumber: 595,
                                                            columnNumber: 23
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                                            size: 26,
                                                            className: "text-[#8a8a8a]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/admin/app/products/page.tsx",
                                                            lineNumber: 597,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/admin/app/products/page.tsx",
                                                        lineNumber: 593,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2 min-w-0",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "file",
                                                                ref: imageInputRef,
                                                                accept: "image/jpeg,image/png,image/webp",
                                                                className: "hidden",
                                                                onChange: (e)=>handleEditImage(e.target.files?.[0])
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/products/page.tsx",
                                                                lineNumber: 601,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>imageInputRef.current?.click(),
                                                                className: "min-h-10 sm:min-h-9 py-2 px-3 inline-flex items-center gap-2 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UploadCloud$3e$__["UploadCloud"], {
                                                                        size: 15
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/admin/app/products/page.tsx",
                                                                        lineNumber: 607,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    " ",
                                                                    editing.imageUrl || editing.newImageFile ? 'Change image' : 'Add image'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/admin/app/products/page.tsx",
                                                                lineNumber: 602,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-[#616161] leading-snug",
                                                                children: [
                                                                    "JPG, PNG or WebP · max ",
                                                                    MAX_IMAGE_MB,
                                                                    " MB · converted to WebP automatically"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/admin/app/products/page.tsx",
                                                                lineNumber: 609,
                                                                columnNumber: 21
                                                            }, this),
                                                            editing.newImageFile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-[#014b40]",
                                                                children: "New image will be saved when you press Save."
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/products/page.tsx",
                                                                lineNumber: 610,
                                                                columnNumber: 46
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/products/page.tsx",
                                                        lineNumber: 600,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/products/page.tsx",
                                                lineNumber: 592,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/products/page.tsx",
                                        lineNumber: 590,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                                        className: "p-4 space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-sm font-semibold text-[#1a1a1a]",
                                                children: "General"
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/products/page.tsx",
                                                lineNumber: 617,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: "Product name",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    value: editing.name,
                                                    onChange: (e)=>setEditField({
                                                            name: e.target.value
                                                        }),
                                                    className: inputCls
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/products/page.tsx",
                                                    lineNumber: 619,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/products/page.tsx",
                                                lineNumber: 618,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: "Category",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: editing.category,
                                                    onChange: (e)=>setEditField({
                                                            category: e.target.value
                                                        }),
                                                    className: `${inputCls} cursor-pointer`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            disabled: true,
                                                            children: "Select a category"
                                                        }, void 0, false, {
                                                            fileName: "[project]/admin/app/products/page.tsx",
                                                            lineNumber: 623,
                                                            columnNumber: 21
                                                        }, this),
                                                        categories.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: c.name,
                                                                children: c.name
                                                            }, c.id, false, {
                                                                fileName: "[project]/admin/app/products/page.tsx",
                                                                lineNumber: 624,
                                                                columnNumber: 44
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/admin/app/products/page.tsx",
                                                    lineNumber: 622,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/products/page.tsx",
                                                lineNumber: 621,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                label: "Description",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    rows: 3,
                                                    value: editing.description,
                                                    onChange: (e)=>setEditField({
                                                            description: e.target.value
                                                        }),
                                                    className: inputCls
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/products/page.tsx",
                                                    lineNumber: 628,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/admin/app/products/page.tsx",
                                                lineNumber: 627,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/products/page.tsx",
                                        lineNumber: 616,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                                        className: "p-4 space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-sm font-semibold text-[#1a1a1a]",
                                                        children: [
                                                            "Variants (",
                                                            editing.variants.length,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/products/page.tsx",
                                                        lineNumber: 635,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: addEditVariant,
                                                        className: "min-h-9 py-1.5 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                size: 14
                                                            }, void 0, false, {
                                                                fileName: "[project]/admin/app/products/page.tsx",
                                                                lineNumber: 641,
                                                                columnNumber: 21
                                                            }, this),
                                                            " Add variant"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/admin/app/products/page.tsx",
                                                        lineNumber: 636,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/products/page.tsx",
                                                lineNumber: 634,
                                                columnNumber: 17
                                            }, this),
                                            editing.variants.map((v, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-lg bg-[#f7f7f7] p-3 space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm sm:text-[13px] font-semibold text-[#1a1a1a]",
                                                                    children: [
                                                                        "Variant ",
                                                                        i + 1
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/admin/app/products/page.tsx",
                                                                    lineNumber: 648,
                                                                    columnNumber: 23
                                                                }, this),
                                                                editing.variants.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>removeEditVariant(i),
                                                                    className: "p-1.5 rounded-lg text-[#8a8a8a] hover:text-[#8e0b21] hover:bg-[#fed1d7]/50",
                                                                    "aria-label": `Remove variant ${i + 1}`,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                        size: 15
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/admin/app/products/page.tsx",
                                                                        lineNumber: 651,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/admin/app/products/page.tsx",
                                                                    lineNumber: 650,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/admin/app/products/page.tsx",
                                                            lineNumber: 647,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-2 gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "col-span-2",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                                        label: "Unit",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            value: v.unit,
                                                                            onChange: (e)=>updateEditVariant(i, 'unit', e.target.value),
                                                                            placeholder: "500g / 1 kg",
                                                                            className: inputCls
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/admin/app/products/page.tsx",
                                                                            lineNumber: 658,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/admin/app/products/page.tsx",
                                                                        lineNumber: 657,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/admin/app/products/page.tsx",
                                                                    lineNumber: 656,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                                    label: "Price (₹)",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        inputMode: "decimal",
                                                                        value: v.price,
                                                                        onChange: (e)=>updateEditVariant(i, 'price', e.target.value),
                                                                        className: inputCls
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/admin/app/products/page.tsx",
                                                                        lineNumber: 662,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/admin/app/products/page.tsx",
                                                                    lineNumber: 661,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                                                    label: "Stock",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        inputMode: "numeric",
                                                                        value: v.stock,
                                                                        onChange: (e)=>updateEditVariant(i, 'stock', e.target.value),
                                                                        className: inputCls
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/admin/app/products/page.tsx",
                                                                        lineNumber: 665,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/admin/app/products/page.tsx",
                                                                    lineNumber: 664,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/admin/app/products/page.tsx",
                                                            lineNumber: 655,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, v.id || i, true, {
                                                    fileName: "[project]/admin/app/products/page.tsx",
                                                    lineNumber: 646,
                                                    columnNumber: 19
                                                }, this)),
                                            editing.removed.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-[#616161]",
                                                children: [
                                                    editing.removed.length,
                                                    " variant",
                                                    editing.removed.length > 1 ? 's' : '',
                                                    " will be deleted when you press Save."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/admin/app/products/page.tsx",
                                                lineNumber: 671,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/admin/app/products/page.tsx",
                                        lineNumber: 633,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/products/page.tsx",
                                lineNumber: 586,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 bg-white border-t border-gray-200 shrink-0 flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: closeEditor,
                                        disabled: isSubmitting,
                                        className: "min-h-11 sm:min-h-10 px-4 rounded-lg bg-white text-sm sm:text-[13px] font-medium text-[#303030] shadow-[0_0_0_1px_rgba(0,0,0,0.12)] hover:bg-gray-50 disabled:opacity-50",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/products/page.tsx",
                                        lineNumber: 677,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleUpdateProduct(),
                                        disabled: isSubmitting,
                                        className: "flex-1 min-h-11 sm:min-h-10 rounded-lg bg-[#303030] hover:bg-[#1a1a1a] text-sm sm:text-[13px] font-medium text-white disabled:opacity-50 inline-flex items-center justify-center gap-2",
                                        children: isSubmitting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                            size: 16,
                                            className: "animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/admin/app/products/page.tsx",
                                            lineNumber: 685,
                                            columnNumber: 33
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                    size: 15
                                                }, void 0, false, {
                                                    fileName: "[project]/admin/app/products/page.tsx",
                                                    lineNumber: 685,
                                                    columnNumber: 84
                                                }, this),
                                                " Save changes"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/admin/app/products/page.tsx",
                                            lineNumber: 685,
                                            columnNumber: 82
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/admin/app/products/page.tsx",
                                        lineNumber: 680,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/admin/app/products/page.tsx",
                                lineNumber: 676,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/admin/app/products/page.tsx",
                        lineNumber: 580,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/products/page.tsx",
                lineNumber: 578,
                columnNumber: 9
            }, this),
            toast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                role: "status",
                className: `fixed bottom-5 left-1/2 -translate-x-1/2 z-[120] max-w-[90vw] px-4 py-2.5 rounded-lg text-sm sm:text-[13px] shadow-lg ${toast.type === 'error' ? 'bg-[#fed1d7] text-[#8e0b21]' : 'bg-[#303030] text-white'}`,
                children: toast.text
            }, void 0, false, {
                fileName: "[project]/admin/app/products/page.tsx",
                lineNumber: 694,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/admin/app/products/page.tsx",
        lineNumber: 383,
        columnNumber: 5
    }, this);
}
_s(ProductsPage, "ghnUgoZbFNTQeCS8T7nhK+A7x20=");
_c = ProductsPage;
// ---------- UI primitives ----------
function Card({ children, className = '' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/admin/app/products/page.tsx",
        lineNumber: 710,
        columnNumber: 10
    }, this);
}
_c1 = Card;
function Kpi({ label, value, sub, warn, loading }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4 sm:p-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm sm:text-[13px] text-[#616161]",
                children: label
            }, void 0, false, {
                fileName: "[project]/admin/app/products/page.tsx",
                lineNumber: 716,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-7 w-20 bg-gray-100 rounded mt-2 animate-pulse"
            }, void 0, false, {
                fileName: "[project]/admin/app/products/page.tsx",
                lineNumber: 718,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-baseline gap-2 mt-1.5 flex-wrap",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `text-[22px] font-semibold leading-none ${warn ? 'text-[#8e0b21]' : 'text-[#1a1a1a]'}`,
                        children: value
                    }, void 0, false, {
                        fileName: "[project]/admin/app/products/page.tsx",
                        lineNumber: 721,
                        columnNumber: 11
                    }, this),
                    sub && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-[#616161]",
                        children: sub
                    }, void 0, false, {
                        fileName: "[project]/admin/app/products/page.tsx",
                        lineNumber: 722,
                        columnNumber: 19
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/admin/app/products/page.tsx",
                lineNumber: 720,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/admin/app/products/page.tsx",
        lineNumber: 715,
        columnNumber: 5
    }, this);
}
_c2 = Kpi;
function Pill({ children, tone }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center px-2 h-5 rounded-full text-[11px] font-medium ${tone}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/admin/app/products/page.tsx",
        lineNumber: 730,
        columnNumber: 10
    }, this);
}
_c3 = Pill;
function Field({ label, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "block space-y-1.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm sm:text-[13px] font-medium text-[#303030]",
                children: label
            }, void 0, false, {
                fileName: "[project]/admin/app/products/page.tsx",
                lineNumber: 736,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/admin/app/products/page.tsx",
        lineNumber: 735,
        columnNumber: 5
    }, this);
}
_c4 = Field;
function Switch({ on, onClick, disabled, label }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        role: "switch",
        "aria-checked": on,
        "aria-label": label,
        title: label,
        onClick: onClick,
        disabled: disabled,
        className: `relative w-10 h-6 rounded-full shrink-0 transition-colors disabled:opacity-60 ${on ? 'bg-[#303030]' : 'bg-[#c9c9c9]'}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-4' : ''}`
        }, void 0, false, {
            fileName: "[project]/admin/app/products/page.tsx",
            lineNumber: 753,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/admin/app/products/page.tsx",
        lineNumber: 744,
        columnNumber: 5
    }, this);
}
_c5 = Switch;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "ProductsPage");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "Kpi");
__turbopack_context__.k.register(_c3, "Pill");
__turbopack_context__.k.register(_c4, "Field");
__turbopack_context__.k.register(_c5, "Switch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=admin_app_products_page_tsx_0wggu250cwdhl._.js.map