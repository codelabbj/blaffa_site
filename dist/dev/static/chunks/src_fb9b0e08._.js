(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/axios.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const API_URL = 'https://api.blaffa.net';
// Create axios instance with base URL
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null)=>{
    failedQueue.forEach((prom)=>{
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};
// Request interceptor to add auth token
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error)=>{
    return Promise.reject(error);
});
// Response interceptor to handle token refresh
api.interceptors.response.use((response)=>response, async (error)=>{
    const originalRequest = error.config;
    // If the error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
            // If we're already refreshing, add the request to the queue
            return new Promise((resolve, reject)=>{
                failedQueue.push({
                    resolve,
                    reject
                });
            }).then((token)=>{
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            }).catch((err)=>{
                return Promise.reject(err);
            });
        }
        originalRequest._retry = true;
        isRefreshing = true;
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                // No refresh token available, redirect to login
                localStorage.removeItem('accessToken');
                window.location.href = '/auth';
                return Promise.reject(error);
            }
            // Try to refresh the token
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_URL}/auth/refresh`, {
                refresh: refreshToken
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const { access, refresh: newRefresh } = response.data;
            // Update tokens in localStorage
            localStorage.setItem('accessToken', access);
            if (newRefresh) {
                localStorage.setItem('refreshToken', newRefresh);
            }
            // Update the Authorization header
            api.defaults.headers.common.Authorization = `Bearer ${access}`;
            originalRequest.headers.Authorization = `Bearer ${access}`;
            // Process the queue
            processQueue(null, access);
            // Retry the original request
            return api(originalRequest);
        } catch (refreshError) {
            // If refresh fails, clear tokens and redirect to login
            console.error('Failed to refresh token:', refreshError);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/auth';
            processQueue(refreshError);
            return Promise.reject(refreshError);
        } finally{
            isRefreshing = false;
        }
    }
    // For other errors, just reject
    return Promise.reject(error);
});
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ThemeToggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ThemeProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const ThemeToggle = ()=>{
    _s();
    const { theme, toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: toggleTheme,
        className: "flex items-center justify-center p-2 rounded-full",
        style: {
            backgroundColor: theme.mode === 'dark' ? '#374151' : '#e5e7eb'
        },
        "aria-label": `Switch to ${theme.mode === 'light' ? 'dark' : 'light'} mode`,
        children: theme.mode === 'light' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            className: "h-5 w-5",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            }, void 0, false, {
                fileName: "[project]/src/components/ThemeToggle.tsx",
                lineNumber: 20,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/ThemeToggle.tsx",
            lineNumber: 19,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            className: "h-5 w-5",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            }, void 0, false, {
                fileName: "[project]/src/components/ThemeToggle.tsx",
                lineNumber: 24,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/ThemeToggle.tsx",
            lineNumber: 23,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ThemeToggle.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ThemeToggle, "Q4eAjrIZ0CuRuhycs6byifK2KBk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = ThemeToggle;
const __TURBOPACK__default__export__ = ThemeToggle;
var _c;
__turbopack_context__.k.register(_c, "ThemeToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/DashboardHeader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"); // Removed MouseEvent import from react
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$headphones$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Headphones$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/headphones.js [app-client] (ecmascript) <export default as Headphones>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ThemeToggle.tsx [app-client] (ecmascript)");
//import LanguageToggle from './LanguageToggle';
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
//import api from '@/lib/axios';
const DashboardHeader = ()=>{
    _s();
    const [showMobileMenu, setShowMobileMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardHeader.useEffect": ()=>{
            setTimeout({
                "DashboardHeader.useEffect": ()=>{
                    setTimeout({
                        "DashboardHeader.useEffect": ()=>{}
                    }["DashboardHeader.useEffect"], 5000);
                }
            }["DashboardHeader.useEffect"], 3000);
        }
    }["DashboardHeader.useEffect"], []);
    // Close mobile menu when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardHeader.useEffect": ()=>{
            // Use the native DOM MouseEvent type
            const handleClickOutside = {
                "DashboardHeader.useEffect.handleClickOutside": (event)=>{
                    // Safely check if event.target is an Element before using closest
                    if (showMobileMenu && event.target instanceof Element && !event.target.closest('.mobile-menu-container')) {
                        setShowMobileMenu(false);
                    }
                }
            }["DashboardHeader.useEffect.handleClickOutside"];
            document.addEventListener('click', handleClickOutside);
            return ({
                "DashboardHeader.useEffect": ()=>document.removeEventListener('click', handleClickOutside)
            })["DashboardHeader.useEffect"];
        }
    }["DashboardHeader.useEffect"], [
        showMobileMenu
    ]);
    // Explicitly type the action parameter
    const handleMenuItemClick = (action)=>{
        setShowMobileMenu(false);
        if (typeof action === 'function') {
            action();
        }
    };
    // return (
    //   <>
    //     <header className=" backdrop-blur-lg border-b border-black/20 sticky top-0 z-50">
    //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //         <div className="flex items-center justify-between h-16">
    //           <div className="flex items-center space-x-4">
    //             <div className="flex items-center space-x-2">
    //               <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
    //                 <Image src="/logo.png" alt="Logo" width={50} height={50} className="rounded-full" />
    //               </div>
    //               <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
    //                 Blaffa
    //               </span>
    //             </div>
    //           </div>
    //           <div className="flex items-center space-x-4">
    //               <button
    //                 onClick={() => handleMenuItemClick(() => {
    //                   window.location.href = 'https://api.blaffa.net/download_apk';
    //                 })}
    //                 className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-800 transition-colors text-left group"
    //               >
    //                 <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
    //                   <Download size={16} className="text-blue-500" />
    //                 </div>
    //                 <span className="text-gray-400 group-hover:text-white transition-colors">
    //                   {t("Télécharger l'application")}
    //                 </span>
    //               </button>
    //             <a href='/notifications' className="relative p-2  hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
    //                 <Bell className="h-6 w-6" />
    //                 {/* {notifications.some((n) => !n.is_read) && (
    //                   <span className="absolute -top-1 -right-1 text-white text-xs px-1.5 rounded-full">
    //                     {notifications.filter((n) => !n.is_read).length}
    //                   </span>
    //                 )} */}
    //             </a>
    //             <a className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center relative group" href='/profile'>
    //               <User size={16} className="text-sm text-white font-bold group-hover:scale-110 transition-transform"/>
    //               <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75 duration-1000 hidden group-hover:block"></div>
    //             </a>
    //             <div className="w-8 h-8 "><ThemeToggle /></div>
    //           </div>
    //         </div>
    //       </div>
    //     </header>
    //   </>
    // );
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
            className: "backdrop-blur-lg border-b border-black/20 sticky top-0 z-50 overflow-x-hidden",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between h-16 w-full overflow-x-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center space-x-4 flex-shrink-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/logo.png",
                                        alt: "Logo",
                                        width: 40,
                                        height: 40,
                                        className: "rounded-full"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DashboardHeader.tsx",
                                        lineNumber: 108,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent",
                                        children: "Blaffa"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DashboardHeader.tsx",
                                        lineNumber: 109,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/DashboardHeader.tsx",
                                lineNumber: 104,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/DashboardHeader.tsx",
                            lineNumber: 103,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center space-x-2 sm:space-x-4 flex-shrink-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "/contact",
                                    className: "relative p-2 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$headphones$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Headphones$3e$__["Headphones"], {
                                        className: "h-5 w-5 sm:h-6 sm:w-6"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DashboardHeader.tsx",
                                        lineNumber: 118,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/DashboardHeader.tsx",
                                    lineNumber: 117,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "/notifications",
                                    className: "relative p-2 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                            className: "h-5 w-5 sm:h-6 sm:w-6"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/DashboardHeader.tsx",
                                            lineNumber: 123,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/DashboardHeader.tsx",
                                            lineNumber: 125,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/DashboardHeader.tsx",
                                    lineNumber: 122,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-8 h-8",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/src/components/DashboardHeader.tsx",
                                        lineNumber: 129,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/DashboardHeader.tsx",
                                    lineNumber: 128,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/DashboardHeader.tsx",
                            lineNumber: 115,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/DashboardHeader.tsx",
                    lineNumber: 102,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/DashboardHeader.tsx",
                lineNumber: 101,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/DashboardHeader.tsx",
            lineNumber: 100,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false);
};
_s(DashboardHeader, "7cD7lSwDCVPAQ1qIwBBzxZEyXrs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = DashboardHeader;
const __TURBOPACK__default__export__ = DashboardHeader;
var _c;
__turbopack_context__.k.register(_c, "DashboardHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/withdraw/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// pages/withdraw.js
__turbopack_context__.s([
    "default",
    ()=>Withdraw
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
//import Head from 'next/head';
//import axios from 'axios';
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [app-client] (ecmascript)");
// import styles from '../styles/Withdraw.module.css';
//import DashboardHeader from '@/components/DashboardHeader';
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ThemeProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/smartphone.js [app-client] (ecmascript) <export default as Smartphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-help.js [app-client] (ecmascript) <export default as HelpCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DashboardHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/DashboardHeader.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function Withdraw() {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    const [currentStep, setCurrentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('selectId');
    const [selectedPlatform, setSelectedPlatform] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [platforms, setPlatforms] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedNetwork, setSelectedNetwork] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        withdrawalCode: '',
        phoneNumber: '',
        betid: '',
        amount: ''
    });
    const [validationErrors, setValidationErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        amount: '',
        withdrawalCode: '',
        phoneNumber: ''
    });
    const [networks, setNetworks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [savedAppIds, setSavedAppIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isModalOpen, setIsModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedTransaction, setSelectedTransaction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { theme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const [selectedBetId, setSelectedBetId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // const [showInfoDropdown, setShowInfoDropdown] = useState(false);
    // Phone number management state
    const [userPhones, setUserPhones] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedPhone, setSelectedPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [phoneLoading, setPhoneLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showAddPhoneModal, setShowAddPhoneModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showEditPhoneModal, setShowEditPhoneModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [phoneToEdit, setPhoneToEdit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [newPhoneNumber, setNewPhoneNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Phone number management functions
    const fetchUserPhones = async (networkId)=>{
        const token = localStorage.getItem('accessToken');
        if (!token) return [];
        try {
            const params = networkId ? {
                network: networkId
            } : {};
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/blaffa/user-phone/', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params
            });
            if (response.status === 200) {
                return Array.isArray(response.data) ? response.data : [];
            }
            return [];
        } catch (error) {
            console.error('Error fetching user phones:', error);
            return [];
        }
    };
    const addUserPhone = async (phone, networkId)=>{
        const token = localStorage.getItem('accessToken');
        if (!token) return null;
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/blaffa/user-phone/', {
                phone: phone,
                network: networkId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 201) {
                return response.data;
            }
            return null;
        } catch (error) {
            console.error('Error adding user phone:', error);
            return null;
        }
    };
    const updateUserPhone = async (phoneId, phone)=>{
        const token = localStorage.getItem('accessToken');
        if (!token) return null;
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/blaffa/user-phone/${phoneId}/`, {
                phone: phone
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                return response.data;
            }
            return null;
        } catch (error) {
            console.error('Error updating user phone:', error);
            return null;
        }
    };
    const deleteUserPhone = async (phoneId)=>{
        const token = localStorage.getItem('accessToken');
        if (!token) return false;
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/blaffa/user-phone/${phoneId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.status === 204;
        } catch (error) {
            console.error('Error deleting user phone:', error);
            return false;
        }
    };
    const fetchPlatforms = async ()=>{
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/blaffa/app_name?operation_type=withdrawal', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                const data = response.data;
                setPlatforms(Array.isArray(data) ? data : []);
            } else {
                console.error('Failed to fetch platforms:', response.status);
                setPlatforms([]);
            }
        } catch (error) {
            console.error('Error fetching platforms:', error);
            setPlatforms([]);
        }
    };
    // Fetch networks and saved app IDs on component mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Withdraw.useEffect": ()=>{
            const fetchData = {
                "Withdraw.useEffect.fetchData": async ()=>{
                    const token = localStorage.getItem('accessToken');
                    if (!token) {
                        setError(t('You must be logged in to access this feature.'));
                        setLoading(false);
                        window.location.href = '/';
                        return;
                    }
                    try {
                        setLoading(true);
                        // Fetch all data in parallel
                        const [networksResponse, savedIdsResponse] = await Promise.all([
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/blaffa/network/?type=withdrawal', {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }),
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/blaffa/id_link', {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }),
                            fetchPlatforms() // Fetch platforms in parallel
                        ]);
                        if (networksResponse.status === 200) {
                            const networksData = networksResponse.data;
                            setNetworks(networksData);
                        }
                        if (savedIdsResponse.status === 200) {
                            const data = savedIdsResponse.data;
                            let processedData = [];
                            if (Array.isArray(data)) {
                                processedData = data;
                            } else if (data?.results) {
                                processedData = data.results;
                            } else if (data?.data) {
                                processedData = data.data;
                            }
                            setSavedAppIds(processedData);
                        }
                    } catch (err) {
                        console.error('Error fetching data:', err);
                        setError(t('Failed to load data. Please try again later.'));
                    } finally{
                        setLoading(false);
                    }
                }
            }["Withdraw.useEffect.fetchData"];
            fetchData();
        }
    }["Withdraw.useEffect"], []);
    // Auto-hide error messages after 20 seconds
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Withdraw.useEffect": ()=>{
            if (error) {
                const timer = setTimeout({
                    "Withdraw.useEffect.timer": ()=>{
                        setError('');
                    }
                }["Withdraw.useEffect.timer"], 20000); // 20 seconds
                return ({
                    "Withdraw.useEffect": ()=>clearTimeout(timer)
                })["Withdraw.useEffect"];
            }
        }
    }["Withdraw.useEffect"], [
        error
    ]);
    // Format phone number with indication from selected network
    const formatPhoneWithCountryCode = (phoneNumber)=>{
        if (!selectedNetwork?.indication || !phoneNumber) return phoneNumber;
        const indication = selectedNetwork.indication;
        // If phone already starts with +, return as-is
        if (phoneNumber.startsWith('+')) {
            return phoneNumber;
        }
        // If phone already starts with the indication, add +
        if (phoneNumber.startsWith(indication.replace('+', ''))) {
            return `+${phoneNumber}`;
        }
        // If phone already starts with indication (without +), add +
        if (phoneNumber.startsWith(indication)) {
            return phoneNumber;
        }
        // Otherwise, prepend the indication
        return `${indication}${phoneNumber}`;
    };
    // Strip indication from phone number for transaction requests
    const stripPhoneIndication = (phoneNumber)=>{
        if (!selectedNetwork?.indication || !phoneNumber) return phoneNumber;
        const indication = selectedNetwork.indication;
        // Remove + prefix from indication for comparison
        const indicationWithoutPlus = indication.replace('+', '');
        // If phone starts with +, remove the indication part
        if (phoneNumber.startsWith('+')) {
            if (phoneNumber.startsWith(indication)) {
                return phoneNumber.substring(indication.length);
            }
        }
        // If phone starts with indication without +, remove it
        if (phoneNumber.startsWith(indicationWithoutPlus)) {
            return phoneNumber.substring(indicationWithoutPlus.length);
        }
        // Return as-is if no indication found
        return phoneNumber;
    };
    // Phone management handlers
    const handlePhoneSelect = (phone)=>{
        setSelectedPhone(phone);
        setCurrentStep('manageBetId');
    };
    const handleAddPhone = async ()=>{
        if (!selectedNetwork || !newPhoneNumber.trim()) return;
        // Validate phone number length
        if (newPhoneNumber.length > 10) {
            setError(`Numéro de téléphone invalide. Le numéro ne doit pas dépasser 10 chiffres. Exemple: ${selectedNetwork.placeholder || '771234567'}`);
            return;
        }
        // Format the phone number with country code before sending to API
        const formattedPhone = newPhoneNumber.startsWith('+') ? newPhoneNumber : formatPhoneWithCountryCode(newPhoneNumber);
        const addedPhone = await addUserPhone(formattedPhone, selectedNetwork.id);
        if (addedPhone) {
            setUserPhones((prev)=>[
                    ...prev,
                    addedPhone
                ]);
            setNewPhoneNumber('');
            setShowAddPhoneModal(false);
        } else {
            setError(t('Failed to add phone number'));
        }
    };
    const handleEditPhone = async ()=>{
        if (!phoneToEdit || !newPhoneNumber.trim()) return;
        // Format the phone number with country code before sending to API
        const formattedPhone = newPhoneNumber.startsWith('+') ? newPhoneNumber : formatPhoneWithCountryCode(newPhoneNumber);
        const updatedPhone = await updateUserPhone(phoneToEdit.id, formattedPhone);
        if (updatedPhone) {
            setUserPhones((prev)=>prev.map((phone)=>phone.id === phoneToEdit.id ? updatedPhone : phone));
            setNewPhoneNumber('');
            setShowEditPhoneModal(false);
            setPhoneToEdit(null);
        } else {
            setError(t('Failed to update phone number'));
        }
    };
    const handleDeletePhone = async (phoneId)=>{
        const success = await deleteUserPhone(phoneId);
        if (success) {
            setUserPhones((prev)=>prev.filter((phone)=>phone.id !== phoneId));
            if (selectedPhone?.id === phoneId) {
                setSelectedPhone(null);
            }
        } else {
            setError(t('Failed to delete phone number'));
        }
    };
    const handlePlatformSelect = (platform)=>{
        setSelectedPlatform(platform);
        setCurrentStep('selectNetwork');
    };
    const handleNetworkSelect = async (network)=>{
        setSelectedNetwork(network);
        // Fetch user phones for this network
        setPhoneLoading(true);
        const phones = await fetchUserPhones(network.id);
        setUserPhones(phones);
        setPhoneLoading(false);
        setCurrentStep('selectPhone');
    };
    const handleInputChange = (e)=>{
        const { name, value } = e.target;
        setFormData((prev)=>({
                ...prev,
                [name]: value
            }));
        // Clear validation error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors((prev)=>({
                    ...prev,
                    [name]: ''
                }));
        }
    };
    // Validation function for amount
    const validateAmount = (amount)=>{
        if (!amount || amount.trim() === '') {
            return 'Le montant est requis';
        }
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) {
            return 'Veuillez saisir un montant valide';
        }
        if (numAmount <= 0) {
            return 'Le montant doit être supérieur à 0';
        }
        // Use API-provided limits from selected platform, fallback to defaults
        const minAmount = selectedPlatform?.minimum_withdrawal || 100;
        const maxAmount = selectedPlatform?.maximum_withdrawal || 1000000;
        if (numAmount < minAmount) {
            return `Le montant minimum est ${minAmount} FCFA`;
        }
        if (numAmount > maxAmount) {
            return `Le montant maximum est ${maxAmount} FCFA`;
        }
        return '';
    };
    // Validation function for withdrawal code
    const validateWithdrawalCode = (code)=>{
        if (!code || code.trim() === '') {
            return 'Le code de retrait est requis';
        }
        if (code.trim().length < 3) {
            return 'Le code de retrait doit contenir au moins 3 caractères';
        }
        return '';
    };
    // Validation function for phone number
    const validatePhoneNumber = (phone)=>{
        if (!phone || phone.trim() === '') {
            return 'Le numéro de téléphone est requis';
        }
        // Remove spaces and check if it's a valid phone number format
        const cleanPhone = phone.replace(/\s+/g, '');
        const phoneRegex = /^[0-9]{8,12}$/; // 8-12 digits
        if (!phoneRegex.test(cleanPhone)) {
            return 'Veuillez saisir un numéro de téléphone valide (8-12 chiffres)';
        }
        return '';
    };
    // Validate all form fields
    const validateForm = ()=>{
        // Validate that a phone number is selected
        if (!selectedPhone) {
            setError(t('Veuillez sélectionner un numéro de téléphone'));
            return false;
        }
        const errors = {
            amount: validateAmount(formData.amount),
            withdrawalCode: validateWithdrawalCode(formData.withdrawalCode),
            phoneNumber: ''
        };
        setValidationErrors(errors);
        // Return true if no errors
        return !Object.values(errors).some((error)=>error !== '');
    };
    // Calculate fee and net amount
    const calculateFeeAndNetAmount = ()=>{
        const amount = parseFloat(formData.amount) || 0;
        if (!selectedNetwork?.with_fee || !selectedNetwork?.fee_percent) {
            return {
                originalAmount: amount,
                feeAmount: 0,
                netAmount: amount
            };
        }
        const feeAmount = amount * selectedNetwork.fee_percent / 100;
        const netAmount = amount - feeAmount;
        return {
            originalAmount: amount,
            feeAmount,
            netAmount
        };
    };
    const { originalAmount, feeAmount, netAmount } = calculateFeeAndNetAmount();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        // Validate form before submission
        if (!validateForm()) {
            return;
        }
        if (!selectedPlatform || !selectedNetwork || !selectedBetId) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('Not authenticated');
            const countryCode = selectedNetwork.country_code?.toLowerCase() || 'ci'; // Default to 'ci' if not specified
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/blaffa/transaction?country_code=${countryCode}`, {
                type_trans: 'withdrawal',
                withdriwal_code: formData.withdrawalCode,
                phone_number: selectedPhone ? stripPhoneIndication(selectedPhone.phone) : '',
                network_id: selectedNetwork.id,
                app_id: selectedPlatform.id,
                user_app_id: selectedBetId,
                source: 'web',
                amount: parseFloat(formData.amount)
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const transaction = response.data;
            setSelectedTransaction({
                transaction
            });
            setIsModalOpen(true);
            setSuccess('Retrait initié avec succès !');
            // Reset form
            setCurrentStep('selectId');
            setSelectedPlatform(null);
            setSelectedNetwork(null);
            setSelectedBetId(null);
            setFormData({
                withdrawalCode: '',
                phoneNumber: '',
                betid: '',
                amount: ''
            });
            setValidationErrors({
                amount: '',
                withdrawalCode: '',
                phoneNumber: ''
            });
        } catch (err) {
            console.error('Withdrawal error:', err);
            if (err && typeof err === 'object' && 'response' in err) {
                const errorResponse = err;
                const { status, data } = errorResponse.response;
                if (status === 400 && data) {
                    const errorMessages = [];
                    // Handle field-specific errors
                    if (data.withdrawal_code) {
                        errorMessages.push(`withdrawal_code: ${Array.isArray(data.withdrawal_code) ? data.withdrawal_code[0] : data.withdrawal_code}`);
                    }
                    if (data.phone_number) {
                        errorMessages.push(`Phone: ${Array.isArray(data.phone_number) ? data.phone_number[0] : data.phone_number}`);
                    }
                    if (data.network_id) {
                        errorMessages.push(`Network: ${Array.isArray(data.network_id) ? data.network_id[0] : data.network_id}`);
                    }
                    if (data.user_app_id) {
                        errorMessages.push(`Bet ID: ${Array.isArray(data.user_app_id) ? data.user_app_id[0] : data.user_app_id}`);
                    }
                    // Add any non-field errors
                    if (data.detail) {
                        errorMessages.push(data.detail);
                    }
                    setError(errorMessages.join('\n') || 'Validation error');
                } else if (status === 401) {
                    setError('Your session has expired. Please log in again.');
                // Optionally redirect to login
                // window.location.href = '/auth';
                } else if (status === 403) {
                    setError('You do not have permission to perform this action.');
                } else if (status === 404) {
                    setError('The requested resource was not found.');
                } else if (status === 429) {
                    setError('Too many requests. Please wait a moment and try again.');
                } else if (status >= 500) {
                    setError('Server error. Please try again later.');
                } else {
                    setError(data?.detail || 'An error occurred. Please try again.');
                }
            } else if (err && typeof err === 'object' && 'request' in err) {
                // The request was made but no response was received
                setError('Network error. Please check your connection and try again.');
            } else {
                // Something happened in setting up the request
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
                setError('An error occurred while setting up the request: ' + errorMessage);
            }
        } finally{
            setLoading(false);
        }
    };
    const renderStep = ()=>{
        switch(currentStep){
            case 'selectId':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-slate-400",
                                children: t("Choisissez la plateforme de pari que vous souhaitez utiliser")
                            }, void 0, false, {
                                fileName: "[project]/src/app/withdraw/page.tsx",
                                lineNumber: 661,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/withdraw/page.tsx",
                            lineNumber: 659,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full flex justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-5xl",
                                children: platforms.map((platform)=>{
                                    const isActive = selectedPlatform?.id === platform.id;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        onClick: ()=>handlePlatformSelect(platform),
                                        className: `cursor-pointer bg-gradient-to-br ${theme.colors.s_background} border rounded-2xl shadow-md flex flex-col items-center p-6 group hover:scale-[1.03] transition-all duration-300
                        ${isActive ? 'border-blue-500 ring-2 ring-blue-400 bg-blue-50 dark:bg-blue-900/30 shadow-blue-200 dark:shadow-blue-900' : 'border-slate-600/30 hover:shadow-xl hover:border-blue-500'}`,
                                        style: {
                                            minWidth: 0,
                                            position: 'relative'
                                        },
                                        children: [
                                            isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-3 right-3 bg-blue-500 rounded-full p-1 shadow-lg",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-5 h-5 text-white",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    viewBox: "0 0 24 24",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M5 13l4 4L19 7"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                                        lineNumber: 679,
                                                        columnNumber: 29
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                    lineNumber: 678,
                                                    columnNumber: 27
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/withdraw/page.tsx",
                                                lineNumber: 677,
                                                columnNumber: 25
                                            }, this),
                                            platform.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: platform.image,
                                                alt: platform.public_name || platform.name,
                                                className: "h-14 w-14 object-contain mb-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/withdraw/page.tsx",
                                                lineNumber: 684,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "font-semibold text-lg text-center group-hover:text-blue-500 truncate w-full",
                                                children: platform.public_name || platform.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/withdraw/page.tsx",
                                                lineNumber: 690,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, platform.id, true, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 669,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/app/withdraw/page.tsx",
                                lineNumber: 665,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/withdraw/page.tsx",
                            lineNumber: 664,
                            columnNumber: 13
                        }, this),
                        platforms.length === 0 && !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center justify-center py-20 px-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold  mb-3",
                                    children: "Aucune plateforme de pari trouvée"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 701,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-slate-400 text-center max-w-md leading-relaxed",
                                    children: t("Aucune plateforme de pari n'est disponible pour le moment.")
                                }, void 0, false, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 702,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/withdraw/page.tsx",
                            lineNumber: 700,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/withdraw/page.tsx",
                    lineNumber: 658,
                    columnNumber: 11
                }, this);
            case 'selectNetwork':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-slate-400",
                                children: "Choisissez votre réseau de paiement mobile"
                            }, void 0, false, {
                                fileName: "[project]/src/app/withdraw/page.tsx",
                                lineNumber: 716,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/withdraw/page.tsx",
                            lineNumber: 714,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                            children: networks.map((network, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    onClick: ()=>handleNetworkSelect(network),
                                    className: `group relative overflow-hidden p-6 border rounded-2xl cursor-pointer text-center transition-all duration-500 hover:scale-105 hover:shadow-2xl ${selectedNetwork?.id === network.id ? 'border-blue-500 bg-gradient-to-br from-blue-600/20 to-blue-600/20 shadow-lg shadow-blue-500/20' : `border-slate-600/30 bg-gradient-to-br ${theme.colors.s_background} hover:from-slate-600/50 hover:to-slate-500/50 hover:shadow-blue-500/2`}
                  }`,
                                    style: {
                                        animation: `slideInUp 0.6s ease-out ${index * 100}ms both`
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 733,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: [
                                                network.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: network.image,
                                                    alt: network.name,
                                                    className: "h-12 mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                    lineNumber: 737,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-12 flex items-center justify-center mb-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 text-green-400 shadow-lg shadow-green-500/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"], {
                                                            className: "w-6 h-6"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                                            lineNumber: 741,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                                        lineNumber: 740,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                    lineNumber: 739,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm font-medium  group-hover:text-blue-200 transition-colors duration-300",
                                                    children: network.public_name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                    lineNumber: 745,
                                                    columnNumber: 21
                                                }, this),
                                                selectedNetwork?.id === network.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        className: "w-4 h-4 "
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                                        lineNumber: 751,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                    lineNumber: 750,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 735,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, network.id, true, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 721,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/withdraw/page.tsx",
                            lineNumber: 719,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setCurrentStep('selectId'),
                                className: "flex items-center text-slate-400 hover:text-white px-6 py-3 rounded-xl transition-all duration-300 group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 765,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 764,
                                        columnNumber: 17
                                    }, this),
                                    t("Back to Platforms")
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/withdraw/page.tsx",
                                lineNumber: 760,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/withdraw/page.tsx",
                            lineNumber: 759,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/withdraw/page.tsx",
                    lineNumber: 713,
                    columnNumber: 11
                }, this);
            case 'selectPhone':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setCurrentStep('selectNetwork'),
                                    className: "group mr-4 p-2 rounded-xl border border-slate-600/30 hover:text-blue-400 hover:from-slate-600/50 hover:to-slate-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300",
                                        viewBox: "0 0 20 20",
                                        fill: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            fillRule: "evenodd",
                                            d: "M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z",
                                            clipRule: "evenodd"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 782,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 781,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 777,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-2xl font-bold mb-1",
                                            children: t("Sélectionner un numéro de téléphone")
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 786,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-slate-400 text-sm",
                                            children: t("Choisissez ou ajoutez un numéro pour les transactions mobile money")
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 787,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 785,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/withdraw/page.tsx",
                            lineNumber: 776,
                            columnNumber: 13
                        }, this),
                        phoneLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center items-center p-20",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 794,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-500/20 animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 795,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/withdraw/page.tsx",
                                lineNumber: 793,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/withdraw/page.tsx",
                            lineNumber: 792,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: userPhones.map((phone)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            onClick: ()=>handlePhoneSelect(phone),
                                            className: `flex items-center justify-between rounded-lg px-4 py-3 cursor-pointer ${selectedPhone?.id === phone.id ? 'bg-blue-600/20 border border-blue-500' : 'bg-gradient-to-r hover:from-slate-600/50 hover:to-slate-500/50'} border border-slate-600/30 transition-all duration-300 hover:shadow-lg`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"], {
                                                            className: "w-5 h-5 text-blue-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                                            lineNumber: 812,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-mono text-sm",
                                                            children: formatPhoneWithCountryCode(phone.phone)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                                            lineNumber: 813,
                                                            columnNumber: 25
                                                        }, this),
                                                        phone.network_name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded",
                                                            children: phone.network_name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                                            lineNumber: 815,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                    lineNumber: 811,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                setPhoneToEdit(phone);
                                                                setNewPhoneNumber(phone.phone);
                                                                setShowEditPhoneModal(true);
                                                            },
                                                            className: "p-1 text-xs text-blue-600 hover:text-white bg-blue-100 hover:bg-blue-600 rounded-full transition",
                                                            title: t('Modifier'),
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "w-4 h-4",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                viewBox: "0 0 24 24",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    strokeWidth: 2,
                                                                    d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                                    lineNumber: 832,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/withdraw/page.tsx",
                                                                lineNumber: 831,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                                            lineNumber: 821,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                handleDeletePhone(phone.id);
                                                            },
                                                            className: "p-1 text-xs text-red-600 hover:text-white bg-red-100 hover:bg-red-600 rounded-full transition",
                                                            title: t('Supprimer'),
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                className: "w-4 h-4",
                                                                fill: "none",
                                                                stroke: "currentColor",
                                                                viewBox: "0 0 24 24",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    strokeWidth: 2,
                                                                    d: "M6 18L18 6M6 6l12 12"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                                    lineNumber: 844,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/withdraw/page.tsx",
                                                                lineNumber: 843,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                                            lineNumber: 835,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                    lineNumber: 820,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, phone.id, true, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 803,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 801,
                                    columnNumber: 17
                                }, this),
                                userPhones.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center py-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"], {
                                            className: "w-12 h-12 text-gray-500 mx-auto mb-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 854,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-slate-400 mb-4",
                                            children: t("Aucun numéro de téléphone enregistré pour ce réseau")
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 855,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 853,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowAddPhoneModal(true),
                                        className: "px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-5 h-5",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                    lineNumber: 866,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/withdraw/page.tsx",
                                                lineNumber: 865,
                                                columnNumber: 21
                                            }, this),
                                            t('Ajouter un numéro de téléphone')
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 861,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 860,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/withdraw/page.tsx",
                    lineNumber: 775,
                    columnNumber: 11
                }, this);
            case 'manageBetId':
                // Only show Bet IDs for the selected platform
                const platformBetIds = savedAppIds.filter((id)=>id.app_name.id === selectedPlatform?.id);
                // Function to delete a bet ID
                const handleDeleteBetId = async (id)=>{
                    const token = localStorage.getItem('accessToken');
                    if (!token) return;
                    try {
                        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/blaffa/id_link/${id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        setSavedAppIds((prev)=>prev.filter((bet)=>bet.id !== id));
                    } catch  {
                        setError(t("Erreur lors de la suppression de l'ID de pari."));
                    }
                };
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setCurrentStep('selectPhone'),
                                    className: "group mr-4 p-2 rounded-xl border border-slate-600/30 hover:text-blue-400 hover:from-slate-600/50 hover:to-slate-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300",
                                        viewBox: "0 0 20 20",
                                        fill: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            fillRule: "evenodd",
                                            d: "M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z",
                                            clipRule: "evenodd"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 900,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 899,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 895,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-slate-400 text-sm",
                                        children: t("Gérer vos IDs de pari")
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 904,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 903,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/withdraw/page.tsx",
                            lineNumber: 894,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center justify-center gap-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",
                                onClick: ()=>window.location.href = '/bet_id',
                                children: t('Ajouter un ID de pari')
                            }, void 0, false, {
                                fileName: "[project]/src/app/withdraw/page.tsx",
                                lineNumber: 908,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/withdraw/page.tsx",
                            lineNumber: 907,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "text-lg font-semibold mb-4",
                                    children: t('Vos IDs de pari enregistrés')
                                }, void 0, false, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 917,
                                    columnNumber: 15
                                }, this),
                                platformBetIds.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-gray-400",
                                    children: t('Aucun ID de pari enregistré.')
                                }, void 0, false, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 919,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: platformBetIds.map((id)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `flex items-center justify-between  rounded-lg px-4 py-2 cursor-pointer ${theme.colors.hover} transition`,
                                            onClick: ()=>{
                                                setSelectedBetId(id.link);
                                                setCurrentStep('enterDetails');
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-mono text-sm mr-2",
                                                            children: id.link
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                                            lineNumber: 932,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-gray-500",
                                                            children: [
                                                                "(",
                                                                id.app_name.public_name || id.app_name.name,
                                                                ")"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                                            lineNumber: 933,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                    lineNumber: 931,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: (e)=>{
                                                        e.stopPropagation();
                                                        handleDeleteBetId(id.id);
                                                    },
                                                    className: "ml-2 p-1 text-xs text-red-600 hover:text-white bg-red-100 hover:bg-red-600 rounded-full transition",
                                                    title: t('Supprimer'),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        className: "h-4 w-4",
                                                        fill: "none",
                                                        viewBox: "0 0 24 24",
                                                        stroke: "currentColor",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            strokeWidth: 2,
                                                            d: "M6 18L18 6M6 6l12 12"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                                            lineNumber: 941,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                                        lineNumber: 940,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                    lineNumber: 935,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, id.id, true, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 923,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 921,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/withdraw/page.tsx",
                            lineNumber: 916,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/withdraw/page.tsx",
                    lineNumber: 893,
                    columnNumber: 11
                }, this);
            case 'enterDetails':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setSelectedNetwork(null);
                                        setCurrentStep('selectNetwork');
                                    },
                                    className: "group mr-4 p-2 rounded-xl border border-slate-600/30 hover:text-blue-400 hover:from-slate-600/50 hover:to-slate-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300",
                                        viewBox: "0 0 20 20",
                                        fill: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            fillRule: "evenodd",
                                            d: "M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z",
                                            clipRule: "evenodd"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 963,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 962,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 955,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-slate-400 text-sm",
                                        children: t("Remplissez les détails de votre pari")
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 967,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 966,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/withdraw/page.tsx",
                            lineNumber: 954,
                            columnNumber: 13
                        }, this),
                        selectedPlatform && (selectedPlatform.city || selectedPlatform.street) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `bg-gradient-to-r ${theme.colors.s_background} border border-slate-600/30 rounded-xl p-4 mb-6`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-slate-400 dark:text-slate-500 text-sm",
                                                children: [
                                                    t("City"),
                                                    ":"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/withdraw/page.tsx",
                                                lineNumber: 976,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-slate-900 dark:text-white font-medium",
                                                children: selectedPlatform.city || 'N/A'
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/withdraw/page.tsx",
                                                lineNumber: 977,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 975,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-slate-400 dark:text-slate-500 text-sm",
                                                children: [
                                                    t("Street"),
                                                    ":"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/withdraw/page.tsx",
                                                lineNumber: 980,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-slate-900 dark:text-white font-medium",
                                                children: selectedPlatform.street || 'N/A'
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/withdraw/page.tsx",
                                                lineNumber: 981,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 979,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/withdraw/page.tsx",
                                lineNumber: 974,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/withdraw/page.tsx",
                            lineNumber: 973,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleSubmit,
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1",
                                            children: t("ID de pari")
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 988,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "font-mono text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900 rounded px-3 py-2",
                                            children: selectedBetId
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 989,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 987,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "amount",
                                            className: "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1",
                                            children: [
                                                t("Montant"),
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-red-500",
                                                    children: "*"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                    lineNumber: 995,
                                                    columnNumber: 34
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 994,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            id: "amount",
                                            name: "amount",
                                            value: formData.amount,
                                            onChange: handleInputChange,
                                            className: `w-full p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 ${validationErrors.amount ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500'}`,
                                            placeholder: `Saisissez le montant à retirer (${selectedPlatform?.minimum_withdrawal || 100} - ${selectedPlatform?.maximum_withdrawal || 1000000} FCFA)`,
                                            required: true,
                                            min: selectedPlatform?.minimum_withdrawal || 100,
                                            max: selectedPlatform?.maximum_withdrawal || 1000000,
                                            step: "0.01"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 997,
                                            columnNumber: 17
                                        }, this),
                                        validationErrors.amount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm text-red-500",
                                            children: validationErrors.amount
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 1014,
                                            columnNumber: 19
                                        }, this),
                                        selectedPlatform && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2 text-xs flex flex-wrap gap-2 items-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: formData.amount && Number(formData.amount) < Number(selectedPlatform.minimum_withdrawal || 100) ? 'text-red-500 font-semibold' : 'text-gray-500',
                                                    children: [
                                                        t('Minimum withdrawal'),
                                                        ": ",
                                                        selectedPlatform.minimum_withdrawal || 100,
                                                        " FCFA"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                    lineNumber: 1019,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "mx-2",
                                                    children: "|"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                    lineNumber: 1026,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: formData.amount && Number(formData.amount) > Number(selectedPlatform.maximum_withdrawal || 1000000) ? 'text-red-500 font-semibold' : 'text-gray-500',
                                                    children: [
                                                        t('Maximum withdrawal'),
                                                        ": ",
                                                        selectedPlatform.maximum_withdrawal || 1000000,
                                                        " FCFA"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                    lineNumber: 1027,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 1018,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 993,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "withdrawalCode",
                                            className: "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1",
                                            children: [
                                                t("Code de retrait"),
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-red-500",
                                                    children: "*"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                    lineNumber: 1039,
                                                    columnNumber: 42
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 1038,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            id: "withdrawalCode",
                                            name: "withdrawalCode",
                                            value: formData.withdrawalCode,
                                            onChange: handleInputChange,
                                            className: `w-full p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 ${validationErrors.withdrawalCode ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500'}`,
                                            placeholder: "Saisissez votre code de retrait",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 1041,
                                            columnNumber: 17
                                        }, this),
                                        validationErrors.withdrawalCode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm text-red-500",
                                            children: validationErrors.withdrawalCode
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 1055,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 1037,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1",
                                            children: t("Numéro de téléphone")
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 1059,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"], {
                                                    className: "w-5 h-5 text-green-600 dark:text-green-400"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                    lineNumber: 1063,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "font-mono text-green-700 dark:text-green-300 font-medium",
                                                            children: selectedPhone ? formatPhoneWithCountryCode(selectedPhone.phone) : 'Aucun numéro sélectionné'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                                            lineNumber: 1065,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs text-green-600 dark:text-green-400 mt-1",
                                                            children: selectedPhone?.network_name ? `${selectedPhone.network_name} Network` : 'Numéro de téléphone sélectionné'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                                            lineNumber: 1068,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                    lineNumber: 1064,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 1062,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 1058,
                                    columnNumber: 15
                                }, this),
                                formData.amount && selectedNetwork && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `bg-gradient-to-r ${theme.colors.s_background} border border-slate-300 dark:border-slate-600/30 rounded-xl p-4 space-y-3`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "text-sm font-medium text-slate-700 dark:text-slate-300 mb-3",
                                            children: t("Transaction Summary")
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 1078,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between items-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-slate-600 dark:text-slate-400 text-sm",
                                                            children: [
                                                                t("Amount to withdraw"),
                                                                ":"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                                            lineNumber: 1082,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-slate-900 dark:text-white font-medium",
                                                            children: [
                                                                originalAmount.toFixed(2),
                                                                " FCFA"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                                            lineNumber: 1083,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                    lineNumber: 1081,
                                                    columnNumber: 21
                                                }, this),
                                                selectedNetwork.with_fee && selectedNetwork.fee_percent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between items-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-slate-600 dark:text-slate-400 text-sm",
                                                                    children: [
                                                                        t("Fee"),
                                                                        " (",
                                                                        selectedNetwork.fee_percent,
                                                                        "%):"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                                    lineNumber: 1089,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-red-600 dark:text-red-400 font-medium",
                                                                    children: [
                                                                        "-",
                                                                        feeAmount.toFixed(2),
                                                                        " FCFA"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                                    lineNumber: 1092,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                                            lineNumber: 1088,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "border-t border-slate-300 dark:border-slate-600/30 pt-2",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between items-center",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-slate-700 dark:text-slate-300 font-medium",
                                                                        children: [
                                                                            t("You will receive"),
                                                                            ":"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                                                        lineNumber: 1097,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-green-600 dark:text-green-400 font-bold text-lg",
                                                                        children: [
                                                                            netAmount.toFixed(2),
                                                                            " FCFA"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                                                        lineNumber: 1098,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/withdraw/page.tsx",
                                                                lineNumber: 1096,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                                            lineNumber: 1095,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true),
                                                !selectedNetwork.with_fee && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "border-t border-slate-300 dark:border-slate-600/30 pt-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-slate-700 dark:text-slate-300 font-medium",
                                                                children: [
                                                                    t("You will receive"),
                                                                    ":"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/withdraw/page.tsx",
                                                                lineNumber: 1107,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-green-600 dark:text-green-400 font-bold text-lg",
                                                                children: [
                                                                    originalAmount.toFixed(2),
                                                                    " FCFA"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/withdraw/page.tsx",
                                                                lineNumber: 1108,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                                        lineNumber: 1106,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                    lineNumber: 1105,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 1080,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 1077,
                                    columnNumber: 17
                                }, this),
                                selectedPlatform?.withdrawal_link && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "text-sm font-semibold text-blue-800 dark:text-blue-200 mb-4 text-center flex items-center justify-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                    lineNumber: 1119,
                                                    columnNumber: 21
                                                }, this),
                                                t("Besoin d'aide avec votre retrait ?")
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 1118,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>window.open(selectedPlatform.withdrawal_link, '_blank'),
                                                    className: "group relative flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-4 py-3 rounded-xl border border-blue-300 dark:border-blue-600 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 text-white font-medium hover:scale-105",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$help$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"], {
                                                            className: "w-5 h-5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                                            lineNumber: 1128,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: t("Comment obtenir un code de retrait ?")
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                                            lineNumber: 1129,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                            className: "w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                                            lineNumber: 1130,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                    lineNumber: 1123,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>{
                                                        const url = selectedPlatform?.why_withdrawal_fail;
                                                        if (url) {
                                                            window.open(url, '_blank');
                                                        }
                                                    },
                                                    className: "group relative flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-4 py-3 rounded-xl border border-orange-300 dark:border-orange-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 text-white font-medium hover:scale-105",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                            className: "w-5 h-5"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                                            lineNumber: 1142,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: t("Pourquoi le retrait échoue ?")
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                                            lineNumber: 1143,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                            className: "w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                                            lineNumber: 1144,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                                    lineNumber: 1132,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 1122,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 1117,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between pt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setCurrentStep('selectPhone'),
                                            className: "px-4 py-2 text-sm text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
                                            children: [
                                                "← ",
                                                t("Back")
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 1150,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            disabled: loading,
                                            className: "px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50",
                                            children: loading ? t('Processing...') : t('Submit')
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 1157,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 1149,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/withdraw/page.tsx",
                            lineNumber: 986,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/withdraw/page.tsx",
                    lineNumber: 953,
                    columnNumber: 11
                }, this);
        }
    };
    // Get current step title
    const getCurrentStepTitle = ()=>{
        switch(currentStep){
            case 'selectId':
                return t("");
            case 'selectNetwork':
                return t("");
            case 'selectPhone':
                return t("");
            case 'manageBetId':
                return t("");
            case 'enterDetails':
                return t("");
            default:
                return "";
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-53d6791cd021ef43" + " " + `min-h-screen bg-gradient-to-br ${theme.colors.a_background} p-4`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes shimmer {
            0% { background-position: -200px 0; }
            100% { background-position: calc(200px + 100%) 0; }
          }
          
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes backdropFadeIn {
            from {
              opacity: 0;
              backdrop-filter: blur(0px);
            }
            to {
              opacity: 1;
              backdrop-filter: blur(8px);
            }
          }
          
          @keyframes flash {
            0%, 50% {
              opacity: 1;
              transform: scale(1);
            }
            25%, 75% {
              opacity: 0.7;
              transform: scale(1.05);
            }
          }
          
          .shimmer-effect {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            background-size: 200px 100%;
            animation: shimmer 2s infinite;
          }
          
          .modal-backdrop {
            animation: backdropFadeIn 0.3s ease-out;
          }
          
          .modal-content {
            animation: modalSlideIn 0.4s ease-out;
          }
          
          .flash-animation {
            animation: flash 2s infinite;
          }
        `
            }, void 0, false, {
                fileName: "[project]/src/app/withdraw/page.tsx",
                lineNumber: 1192,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-53d6791cd021ef43" + " " + "max-w-6xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DashboardHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/app/withdraw/page.tsx",
                        lineNumber: 1265,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-53d6791cd021ef43" + " " + "flex flex-col md:flex-row justify-between items-start md:items-center mb-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>window.history.back(),
                            className: "jsx-53d6791cd021ef43" + " " + `flex items-center bg-gradient-to-r ${theme.colors.s_background} hover:from-slate-600/50 hover:to-slate-500/50 px-6 py-3 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl group mt-4 md:mt-0`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    className: "jsx-53d6791cd021ef43" + " " + "h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M10 19l-7-7m0 0l7-7m-7 7h18",
                                        className: "jsx-53d6791cd021ef43"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 1277,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 1276,
                                    columnNumber: 13
                                }, this),
                                t("Back")
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/withdraw/page.tsx",
                            lineNumber: 1272,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/withdraw/page.tsx",
                        lineNumber: 1266,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-53d6791cd021ef43" + " " + "text-center mb-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "jsx-53d6791cd021ef43" + " " + "text-xl font-bold ",
                            children: getCurrentStepTitle()
                        }, void 0, false, {
                            fileName: "[project]/src/app/withdraw/page.tsx",
                            lineNumber: 1390,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/withdraw/page.tsx",
                        lineNumber: 1386,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-53d6791cd021ef43" + " " + `bg-gradient-to-r ${theme.colors.s_background}  backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-600/50 overflow-hidden`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-53d6791cd021ef43" + " " + "p-8",
                            children: [
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-53d6791cd021ef43" + " " + "mb-6 p-4 bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-600/50 text-red-300 rounded-2xl backdrop-blur-sm",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-53d6791cd021ef43" + " " + "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                className: "w-5 h-5 mr-3"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/withdraw/page.tsx",
                                                lineNumber: 1400,
                                                columnNumber: 19
                                            }, this),
                                            error
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 1399,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 1398,
                                    columnNumber: 15
                                }, this),
                                success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-53d6791cd021ef43" + " " + "mb-6 p-4 bg-gradient-to-r from-green-900/50 to-green-800/50 border border-green-600/50 text-green-300 rounded-2xl backdrop-blur-sm",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-53d6791cd021ef43" + " " + "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                className: "w-5 h-5 mr-3"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/withdraw/page.tsx",
                                                lineNumber: 1409,
                                                columnNumber: 19
                                            }, this),
                                            success
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 1408,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 1407,
                                    columnNumber: 15
                                }, this),
                                loading && !success && !error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-53d6791cd021ef43" + " " + "flex justify-center items-center p-20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-53d6791cd021ef43" + " " + "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-53d6791cd021ef43" + " " + "animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/withdraw/page.tsx",
                                                lineNumber: 1418,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-53d6791cd021ef43" + " " + "absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-500/20 animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/withdraw/page.tsx",
                                                lineNumber: 1419,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 1417,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 1416,
                                    columnNumber: 15
                                }, this) : renderStep()
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/withdraw/page.tsx",
                            lineNumber: 1395,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/withdraw/page.tsx",
                        lineNumber: 1394,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/withdraw/page.tsx",
                lineNumber: 1263,
                columnNumber: 7
            }, this),
            isModalOpen && selectedTransaction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-53d6791cd021ef43" + " " + "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-53d6791cd021ef43" + " " + `${theme.colors.background} rounded-lg shadow-xl w-full max-w-md`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-53d6791cd021ef43" + " " + "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "jsx-53d6791cd021ef43" + " " + "text-lg font-semibold mb-4",
                                children: t("Transaction Details")
                            }, void 0, false, {
                                fileName: "[project]/src/app/withdraw/page.tsx",
                                lineNumber: 1434,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-53d6791cd021ef43" + " " + "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-53d6791cd021ef43",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-53d6791cd021ef43" + " " + "font-medium",
                                                children: [
                                                    t("Status"),
                                                    ":"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/withdraw/page.tsx",
                                                lineNumber: 1436,
                                                columnNumber: 20
                                            }, this),
                                            " ",
                                            selectedTransaction.transaction.status
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 1436,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-53d6791cd021ef43",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-53d6791cd021ef43" + " " + "font-medium",
                                                children: [
                                                    t("Reference"),
                                                    ":"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/withdraw/page.tsx",
                                                lineNumber: 1437,
                                                columnNumber: 20
                                            }, this),
                                            " ",
                                            selectedTransaction.transaction.reference
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 1437,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-53d6791cd021ef43",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-53d6791cd021ef43" + " " + "font-medium",
                                                children: [
                                                    t("Date"),
                                                    ":"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/withdraw/page.tsx",
                                                lineNumber: 1438,
                                                columnNumber: 20
                                            }, this),
                                            " ",
                                            new Date(selectedTransaction.transaction.created_at).toLocaleString()
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 1438,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/withdraw/page.tsx",
                                lineNumber: 1435,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-53d6791cd021ef43" + " " + "mt-6 flex justify-end",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setIsModalOpen(false),
                                    className: "jsx-53d6791cd021ef43" + " " + "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
                                    children: t("Close")
                                }, void 0, false, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 1441,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/withdraw/page.tsx",
                                lineNumber: 1440,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/withdraw/page.tsx",
                        lineNumber: 1433,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/withdraw/page.tsx",
                    lineNumber: 1432,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/withdraw/page.tsx",
                lineNumber: 1431,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "53d6791cd021ef43",
                children: "@keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes scaleIn{0%{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}.animate-fade-in.jsx-53d6791cd021ef43{animation:.3s ease-out forwards fadeIn}.animate-scale-in.jsx-53d6791cd021ef43{animation:.3s ease-out forwards scaleIn}"
            }, void 0, false, void 0, this),
            showAddPhoneModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-53d6791cd021ef43" + " " + "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-53d6791cd021ef43" + " " + `${theme.colors.background} rounded-lg shadow-xl w-full max-w-md modal-content`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-53d6791cd021ef43" + " " + "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-53d6791cd021ef43" + " " + "flex justify-between items-center mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "jsx-53d6791cd021ef43" + " " + "text-lg font-semibold",
                                        children: t("Ajouter un numéro de téléphone")
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 1487,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowAddPhoneModal(false),
                                        className: "jsx-53d6791cd021ef43" + " " + "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            className: "jsx-53d6791cd021ef43" + " " + "w-6 h-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: "2",
                                                d: "M6 18L18 6M6 6l12 12",
                                                className: "jsx-53d6791cd021ef43"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/withdraw/page.tsx",
                                                lineNumber: 1493,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 1492,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 1488,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/withdraw/page.tsx",
                                lineNumber: 1486,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-53d6791cd021ef43" + " " + "space-y-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-53d6791cd021ef43",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "jsx-53d6791cd021ef43" + " " + "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                                            children: t("Numéro de téléphone")
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 1500,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "tel",
                                            value: newPhoneNumber,
                                            onChange: (e)=>setNewPhoneNumber(e.target.value),
                                            placeholder: selectedNetwork?.placeholder || "Entrez votre numéro",
                                            maxLength: 10,
                                            className: "jsx-53d6791cd021ef43" + " " + "w-full p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 1503,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 1499,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/withdraw/page.tsx",
                                lineNumber: 1498,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-53d6791cd021ef43" + " " + "mt-6 flex justify-end gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowAddPhoneModal(false),
                                        className: "jsx-53d6791cd021ef43" + " " + "px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200",
                                        children: t("Annuler")
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 1515,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleAddPhone,
                                        disabled: !newPhoneNumber.trim(),
                                        className: "jsx-53d6791cd021ef43" + " " + "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50",
                                        children: t("Ajouter")
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 1521,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/withdraw/page.tsx",
                                lineNumber: 1514,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/withdraw/page.tsx",
                        lineNumber: 1485,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/withdraw/page.tsx",
                    lineNumber: 1484,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/withdraw/page.tsx",
                lineNumber: 1483,
                columnNumber: 9
            }, this),
            showEditPhoneModal && phoneToEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-53d6791cd021ef43" + " " + "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-53d6791cd021ef43" + " " + `${theme.colors.background} rounded-lg shadow-xl w-full max-w-md modal-content`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-53d6791cd021ef43" + " " + "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-53d6791cd021ef43" + " " + "flex justify-between items-center mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "jsx-53d6791cd021ef43" + " " + "text-lg font-semibold",
                                        children: t("Modifier le numéro de téléphone")
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 1540,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setShowEditPhoneModal(false);
                                            setPhoneToEdit(null);
                                            setNewPhoneNumber('');
                                        },
                                        className: "jsx-53d6791cd021ef43" + " " + "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            className: "jsx-53d6791cd021ef43" + " " + "w-6 h-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: "2",
                                                d: "M6 18L18 6M6 6l12 12",
                                                className: "jsx-53d6791cd021ef43"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/withdraw/page.tsx",
                                                lineNumber: 1550,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 1549,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 1541,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/withdraw/page.tsx",
                                lineNumber: 1539,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-53d6791cd021ef43" + " " + "space-y-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-53d6791cd021ef43",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "jsx-53d6791cd021ef43" + " " + "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                                            children: t("Numéro de téléphone")
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 1557,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "tel",
                                            value: newPhoneNumber,
                                            onChange: (e)=>setNewPhoneNumber(e.target.value),
                                            placeholder: "ex: 771234567",
                                            className: "jsx-53d6791cd021ef43" + " " + "w-full p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 1560,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-53d6791cd021ef43" + " " + "text-xs text-slate-500 dark:text-slate-400 mt-1",
                                            children: t("Entrez le numéro sans le préfixe +225")
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/withdraw/page.tsx",
                                            lineNumber: 1567,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/withdraw/page.tsx",
                                    lineNumber: 1556,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/withdraw/page.tsx",
                                lineNumber: 1555,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-53d6791cd021ef43" + " " + "mt-6 flex justify-end gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setShowEditPhoneModal(false);
                                            setPhoneToEdit(null);
                                            setNewPhoneNumber('');
                                        },
                                        className: "jsx-53d6791cd021ef43" + " " + "px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200",
                                        children: t("Annuler")
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 1574,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleEditPhone,
                                        disabled: !newPhoneNumber.trim(),
                                        className: "jsx-53d6791cd021ef43" + " " + "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50",
                                        children: t("Modifier")
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/withdraw/page.tsx",
                                        lineNumber: 1584,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/withdraw/page.tsx",
                                lineNumber: 1573,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/withdraw/page.tsx",
                        lineNumber: 1538,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/withdraw/page.tsx",
                    lineNumber: 1537,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/withdraw/page.tsx",
                lineNumber: 1536,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/withdraw/page.tsx",
        lineNumber: 1190,
        columnNumber: 5
    }, this);
}
_s(Withdraw, "aPiNL6A1BRRgBnqX5pAgej/bIJ4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = Withdraw;
var _c;
__turbopack_context__.k.register(_c, "Withdraw");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_fb9b0e08._.js.map