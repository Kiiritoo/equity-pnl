(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/context/TradeContext.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COMMON_CURRENCIES",
    ()=>COMMON_CURRENCIES,
    "TIME_ZONES",
    ()=>TIME_ZONES,
    "TradeProvider",
    ()=>TradeProvider,
    "useTrades",
    ()=>useTrades
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2d$tz$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns-tz/dist/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2d$tz$2f$dist$2f$esm$2f$toZonedTime$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns-tz/dist/esm/toZonedTime/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const TradeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])();
const COMMON_CURRENCIES = [
    {
        code: 'USD',
        symbol: '$',
        name: 'US Dollar'
    },
    {
        code: 'IDR',
        symbol: 'Rp',
        name: 'Indonesian Rupiah'
    },
    {
        code: 'EUR',
        symbol: '€',
        name: 'Euro'
    },
    {
        code: 'GBP',
        symbol: '£',
        name: 'British Pound'
    },
    {
        code: 'JPY',
        symbol: '¥',
        name: 'Japanese Yen'
    },
    {
        code: 'AUD',
        symbol: 'A$',
        name: 'Australian Dollar'
    },
    {
        code: 'CAD',
        symbol: 'C$',
        name: 'Canadian Dollar'
    },
    {
        code: 'CHF',
        symbol: 'CHF',
        name: 'Swiss Franc'
    },
    {
        code: 'CNY',
        symbol: '¥',
        name: 'Chinese Yuan'
    },
    {
        code: 'NZD',
        symbol: 'NZ$',
        name: 'New Zealand Dollar'
    }
];
const TIME_ZONES = [
    {
        value: 'Asia/Jakarta',
        label: '(UTC+7) Jakarta'
    },
    {
        value: 'UTC',
        label: '(UTC+0) London / UTC'
    },
    {
        value: 'America/New_York',
        label: '(UTC-5) New York'
    },
    {
        value: 'Asia/Tokyo',
        label: '(UTC+9) Tokyo'
    },
    {
        value: 'Europe/Berlin',
        label: '(UTC+1) Berlin'
    },
    {
        value: 'Asia/Singapore',
        label: '(UTC+8) Singapore'
    },
    {
        value: 'Local',
        label: 'Local Time'
    }
];
const TradeProvider = ({ children })=>{
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [trades, setTrades] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [initialBalance, setInitialBalance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [currency, setCurrency] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('USD');
    const [timeZone, setTimeZone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('UTC');
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('light');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TradeProvider.useEffect": ()=>{
            const checkAuth = {
                "TradeProvider.useEffect.checkAuth": async ()=>{
                    try {
                        const res = await fetch('/api/auth/me');
                        if (res.ok) {
                            const data = await res.json();
                            setUser(data.user);
                            setInitialBalance(data.user.initialBalance || 0);
                            setCurrency(data.user.currency || 'USD');
                            setTimeZone(data.user.timeZone || 'UTC');
                            setTheme(data.user.theme || 'light');
                            fetchTrades();
                        } else {
                            setUser(null);
                        }
                    } catch (err) {
                        console.error('Auth check failed:', err);
                    } finally{
                        setLoading(false);
                    }
                }
            }["TradeProvider.useEffect.checkAuth"];
            checkAuth();
        }
    }["TradeProvider.useEffect"], []);
    const fetchTrades = async ()=>{
        try {
            const res = await fetch('/api/trades');
            if (res.ok) {
                const data = await res.json();
                setTrades(data.trades);
            }
        } catch (err) {
            console.error('Fetch trades failed:', err);
        }
    };
    const logout = async ()=>{
        const res = await fetch('/api/auth/logout', {
            method: 'POST'
        });
        if (res.ok) {
            setUser(null);
            router.push('/login');
        }
    };
    const formatCurrency = (amount, options = {})=>{
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                ...options
            }).format(amount);
        } catch (e) {
            return `${currency} ${amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        }
    };
    const formatDate = (date, formatStr = 'yyyy-MM-dd HH:mm')=>{
        if (!date) return '';
        const d = new Date(date);
        if (timeZone === 'Local') {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(d, formatStr);
        }
        const zonedDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2d$tz$2f$dist$2f$esm$2f$toZonedTime$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toZonedTime"])(d, timeZone);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(zonedDate, formatStr);
    };
    const updateSettings = async (settings)=>{
        try {
            const res = await fetch('/api/user/settings', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                const data = await res.json();
                if (settings.initialBalance !== undefined) setInitialBalance(data.initialBalance);
                if (settings.currency !== undefined) setCurrency(data.currency);
                if (settings.timeZone !== undefined) setTimeZone(data.timeZone);
                if (settings.theme !== undefined) setTheme(data.theme);
            }
        } catch (err) {
            console.error('Update settings failed:', err);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TradeContext.Provider, {
        value: {
            user,
            trades,
            initialBalance,
            currency,
            timeZone,
            theme,
            loading,
            error,
            logout,
            fetchTrades,
            setTrades,
            updateSettings,
            formatDate,
            formatCurrency,
            COMMON_CURRENCIES,
            TIME_ZONES
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/TradeContext.js",
        lineNumber: 133,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(TradeProvider, "19QDcuI0L3nN8EyJ99QmOIFM0zs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = TradeProvider;
const useTrades = ()=>{
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(TradeContext);
};
_s1(useTrades, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_context__.k.register(_c, "TradeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=context_TradeContext_d03ea3f5.js.map