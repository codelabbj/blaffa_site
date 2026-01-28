module.exports = [
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/src/lib/axios.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
;
const API_URL = 'https://api.blaffa.net';
// Create axios instance with base URL
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
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
                window.location.href = '/login';
                return Promise.reject(error);
            }
            // Try to refresh the token
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`${API_URL}/auth/refresh`, {
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
            window.location.href = '/login';
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
}),
"[project]/src/app/deposit/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Deposits
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
//import Head from 'next/head';
//import axios from 'axios';
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [app-ssr] (ecmascript)");
//import styles from '../styles/Deposits.module.css';
//import { ClipboardIcon } from 'lucide-react'; // Make sure to install this package
//import { Transaction } from 'mongodb';
//import DashboardHeader from '@/components/DashboardHeader';
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ThemeProvider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$WebSocketContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/WebSocketContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-ssr] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/smartphone.js [app-ssr] (ecmascript) <export default as Smartphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-ssr] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-ssr] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
// interface ApiError extends Error {
//   response?: {
//     status: number;
//     data: {
//       [key: string]: string | string[] | undefined;
//       detail?: string;
//     };
//   };
// }
// interface ErrorResponse {
//   data?: {
//     [key: string]: string[] | string | undefined;
//     detail?: string;
//     message?: string;
//   };
//   status?: number;
// }
function isAxiosError(error) {
    return typeof error === 'object' && error !== null && 'response' in error;
}
function Deposits() {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])();
    const [currentStep, setCurrentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('selectId');
    const [selectedPlatform, setSelectedPlatform] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [platforms, setPlatforms] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedNetwork, setSelectedNetwork] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        amount: '',
        phoneNumber: '',
        betid: '',
        otp_code: ''
    });
    const [validationErrors, setValidationErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        amount: '',
        phoneNumber: '',
        otp_code: ''
    });
    const [networks, setNetworks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [savedAppIds, setSavedAppIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]); // Used in manageBetId and other steps
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [isModalOpen, setIsModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedTransaction, setSelectedTransaction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [transactionLink, setTransactionLink] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const { theme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    const { addMessageHandler } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$WebSocketContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWebSocket"])();
    const [selectedBetId, setSelectedBetId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showMoovModal, setShowMoovModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [moovUssdCode, setMoovUssdCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [moovMerchantPhone, setMoovMerchantPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [showOrangeModal, setShowOrangeModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [orangeUssdCode, setOrangeUssdCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [orangeMerchantPhone, setOrangeMerchantPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [orangeTransactionLink, setOrangeTransactionLink] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Phone number management state
    const [userPhones, setUserPhones] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedPhone, setSelectedPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [phoneLoading, setPhoneLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // const [showAddPhoneModal, setShowAddPhoneModal] = useState(false); // Removed
    const [showEditPhoneModal, setShowEditPhoneModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [phoneToEdit, setPhoneToEdit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [newPhoneNumber, setNewPhoneNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleTransactionLink = (data)=>{
            if (data.type === 'transaction_link' && data.data) {
                setTransactionLink(data.data); // Save the link for the modal button
            }
        };
        const removeHandler = addMessageHandler(handleTransactionLink);
        return ()=>removeHandler();
    }, [
        addMessageHandler
    ]);
    // Auto-hide error messages after 20 seconds
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (error) {
            const timer = setTimeout(()=>{
                setError('');
            }, 20000); // 20 seconds
            return ()=>clearTimeout(timer);
        }
    }, [
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
    // Fetch networks and saved app IDs on component mount
    const fetchPlatforms = async ()=>{
        // Public fetch - no token required
        try {
            // Use axios directly or api instance without auth header for this request if possible
            // Or just let api instance handle it (if no token in localStorage, no header added usually)
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('/blaffa/app_name?operation_type=deposit');
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
    // ... (UserPhones functions unchanged) ...
    // Fetch networks and saved app IDs on component mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchData = async ()=>{
            const token = localStorage.getItem('accessToken');
            // We allow loading the page without token now to see platforms
            // specific user data (networks, saved IDs) will only be fetched if token exists
            try {
                setLoading(true);
                const promises = [
                    fetchPlatforms()
                ];
                if (token) {
                    promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('/blaffa/network/?type=deposit', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }).then((res)=>setNetworks(res.data)));
                    promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('/blaffa/id_link', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }).then((res)=>{
                        const data = res.data;
                        let processedData = [];
                        if (Array.isArray(data)) processedData = data;
                        else if (data?.results) processedData = data.results;
                        else if (data?.data) processedData = data.data;
                        setSavedAppIds(processedData);
                    }));
                }
                await Promise.allSettled(promises);
            } catch (err) {
                console.error('Error fetching data:', err);
            // Don't show critical error if just public load
            } finally{
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    const handlePlatformSelect = (platform)=>{
        const token = localStorage.getItem('accessToken');
        if (!token) {
            window.location.href = '/login';
            return;
        }
        setSelectedPlatform(platform);
        setCurrentStep('manageBetId');
    };
    // Fetch user phones for a specific network
    const fetchUserPhones = async (networkId)=>{
        const token = localStorage.getItem('accessToken');
        if (!token) return [];
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('/blaffa/user-phone/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    network: networkId
                }
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
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post('/blaffa/user-phone/', {
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
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].patch(`/blaffa/user-phone/${phoneId}/`, {
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
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].delete(`/blaffa/user-phone/${phoneId}/`, {
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
    const handleNetworkSelect = async (network)=>{
        setSelectedNetwork(network);
        // Fetch user phones for this network
        setPhoneLoading(true);
        const phones = await fetchUserPhones(network.id);
        setUserPhones(phones);
        setPhoneLoading(false);
        setCurrentStep('selectPhone');
    };
    // Save new bet ID
    const saveBetId = async (betId)=>{
        if (!selectedPlatform || !betId) return;
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post('/blaffa/id_link', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    app_name: selectedPlatform.id,
                    link: betId
                })
            });
            if (response.status === 201) {
                const newIdLink = response.data;
                setSavedAppIds((prev)=>[
                        ...prev,
                        newIdLink
                    ]);
            }
        } catch (error) {
            console.error('Error saving bet ID:', error);
        }
    };
    // Phone management handlers
    const handlePhoneSelect = (phone)=>{
        setSelectedPhone(phone);
        setCurrentStep('enterDetails');
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
            return true;
        } else {
            setError(t('Failed to add phone number'));
            return false;
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
    // Get network-specific minimum amount
    const getNetworkMinAmount = ()=>{
        if (selectedNetwork?.name?.toLowerCase() === 'moov') {
            return 505; // Moov minimum is 505 FCFA
        } else if (selectedNetwork?.name?.toLowerCase() === 'orange') {
            return 100; // Orange minimum is 100 FCFA
        } else {
            // Use platform-level minimum for other networks
            return selectedPlatform?.minimum_deposit || parseFloat(selectedPlatform?.minimun_deposit || '100');
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
        // Network-specific minimum amounts
        let minAmount;
        if (selectedNetwork?.name?.toLowerCase() === 'moov') {
            minAmount = 505; // Moov minimum is 505 FCFA
        } else if (selectedNetwork?.name?.toLowerCase() === 'orange') {
            minAmount = 100; // Orange minimum is 100 FCFA
        } else {
            // Use platform-level minimum for other networks
            minAmount = selectedPlatform?.minimum_deposit || parseFloat(selectedPlatform?.minimun_deposit || '100');
        }
        const maxAmount = selectedPlatform?.maximum_deposit || parseFloat(selectedPlatform?.max_deposit || '1000000');
        if (numAmount < minAmount) {
            return `Le montant minimum est ${minAmount} FCFA`;
        }
        if (numAmount > maxAmount) {
            return `Le montant maximum est ${maxAmount} FCFA`;
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
    // Validation function for OTP code
    const validateOtpCode = (otp)=>{
        if (selectedNetwork?.otp_required) {
            if (!otp || otp.trim() === '') {
                return 'Le code OTP est requis';
            }
            if (otp.trim().length < 4) {
                return 'Le code OTP doit contenir au moins 4 caractères';
            }
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
            phoneNumber: '',
            otp_code: validateOtpCode(formData.otp_code)
        };
        setValidationErrors(errors);
        // Return true if no errors
        return !Object.values(errors).some((error)=>error !== '');
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        // Validate form before submission
        if (!validateForm()) {
            return;
        }
        if (!selectedPlatform || !selectedNetwork) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('Not authenticated');
            // Get the country code from the selected network
            const countryCode = selectedNetwork.country_code?.toLowerCase(); // Default to 'ci' if not specified
            const transactionData = {
                type_trans: 'deposit',
                amount: formData.amount,
                app_id: selectedPlatform.id,
                network_id: selectedNetwork.id,
                phone_number: selectedPhone ? stripPhoneIndication(selectedPhone.phone) : '',
                user_app_id: selectedBetId,
                source: 'web'
            };
            // Calculate net_payable_amount for USSD networks (Moov and Orange with connect API)
            if (shouldTriggerMoovRedirect(selectedNetwork) || shouldTriggerOrangeRedirect(selectedNetwork)) {
                const amount = parseFloat(formData.amount);
                const netPayableAmount = amount * 0.01; // 1% of the amount
                transactionData.net_payable_amount = netPayableAmount;
            }
            // const response = await api.post(`/blaffa/transaction?country_code=${countryCode}`, {
            //   type_trans: 'deposit',
            //   amount: formData.amount,
            //   phone_number: formData.phoneNumber,
            //   network_id: selectedNetwork.id,
            //   app_id: selectedPlatform.id,
            //   user_app_id: formData.betid
            // }, {
            //   headers: { Authorization: `Bearer ${token}` }
            // });
            // Add OTP to payload if required
            if (selectedNetwork.otp_required && formData.otp_code) {
                transactionData.otp_code = formData.otp_code;
            }
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`/blaffa/transaction?country_code=${countryCode}`, transactionData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const transaction = response.data;
            setSelectedTransaction({
                transaction
            });
            // Check if Moov redirection should be triggered
            if (shouldTriggerMoovRedirect(selectedNetwork)) {
                const amount = parseFloat(formData.amount);
                const countryCode = selectedNetwork.country_code;
                await handleMoovRedirect(amount, countryCode);
            } else if (shouldTriggerOrangeRedirect(selectedNetwork)) {
                const amount = parseFloat(formData.amount);
                const countryCode = selectedNetwork.country_code;
                // Check if payment_by_link is enabled in the network response
                if (selectedNetwork.payment_by_link === true) {
                    // If payment_by_link is true, check if transaction_link exists
                    if (transaction.transaction_link) {
                        // Show modal with transaction link instead of USSD
                        setOrangeTransactionLink(transaction.transaction_link);
                        setShowOrangeModal(true);
                    } else {
                        // If payment_by_link is true but no link, show USSD modal
                        await handleOrangeRedirect(amount, countryCode);
                    }
                } else {
                    // If payment_by_link is false or not present, use USSD dialing
                    await handleOrangeRedirect(amount, countryCode);
                }
            } else {
                setIsModalOpen(true);
            }
            setSuccess('Transaction initiée avec succès !');
            // Reset form
            setCurrentStep('selectId');
            setSelectedPlatform(null);
            setSelectedNetwork(null);
            setFormData({
                amount: '',
                phoneNumber: '',
                betid: '',
                otp_code: ''
            });
            setValidationErrors({
                amount: '',
                phoneNumber: '',
                otp_code: ''
            });
        } catch (error) {
            console.error('Transaction error:', error);
            //     if (
            //       typeof err === 'object' &&
            //       err !== null &&
            //       'response' in err &&
            //       typeof (err as { response?: unknown }).response === 'object'
            //     ) {
            //       const response = (err as { response?: { data?: { detail?: string } } }).response;
            //       setError(response?.data?.detail || 'Failed to process transaction');
            //     } else {
            //       setError('Failed to process transaction');
            //     }
            //   } finally {
            //     setLoading(false);
            //   }
            // };
            if (typeof error === 'string') {
                setError(error);
            } else if (error && typeof error === 'object' && 'response' in error) {
                const { status, data } = error.response || {};
                // Handle the error response
                if (status === 400 && data) {
                    const errorMessages = [];
                    if (data.amount) {
                        errorMessages.push(`Amount: ${Array.isArray(data.amount) ? data.amount[0] : data.amount}`);
                    }
                    // Add more field checks as needed
                    setError(errorMessages.length > 0 ? errorMessages.join('\n') : data.detail || 'Validation error');
                } else {
                    setError(data?.detail || 'An error occurred');
                }
            } else {
                setError('An unexpected error occurred');
            }
            if (isAxiosError(error) && error.response) {
                const { status, data } = error.response;
                // Handle field-specific validation errors
                if (status === 400 && data) {
                    const errorMessages = [];
                    // Check for field errors
                    if (data.amount) {
                        errorMessages.push(`Amount: ${Array.isArray(data.amount) ? data.amount[0] : data.amount}`);
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
                    // Check for non-field errors
                    if (data.detail) {
                        errorMessages.push(data.detail);
                    }
                    // If no specific errors found, use a generic message
                    if (errorMessages.length === 0) {
                        errorMessages.push(t('Invalid data. Please check your input.'));
                    }
                    setError(errorMessages.join('\n'));
                } else if (status === 401) {
                    setError(t('Your session has expired. Please log in again.'));
                // Optionally redirect to login
                // window.location.href = '/auth';
                } else if (status === 403) {
                    setError(t('You do not have permission to perform this action.'));
                } else if (status === 404) {
                    setError(t('The requested resource was not found.'));
                } else if (status === 429) {
                    setError(t('Too many requests. Please wait a moment and try again.'));
                } else if (status >= 500) {
                    setError(t('Server error. Please try again later.'));
                } else {
                    setError(t('An error occurred. Please try again.'));
                }
            // } else if ((error as ApiError).response) {
            //   // The request was made but no response was received
            //   setError(t('Network error. Please check your connection and try again.'));
            } else {
                // Something happened in setting up the request
                setError(t('An error occurred while setting up the request.'));
            }
        } finally{
            setLoading(false);
        }
    };
    const closeTransactionDetails = ()=>{
        setIsModalOpen(false);
        setSelectedTransaction(null);
        setTransactionLink(null); // Reset link when closing modal
    };
    // Fetch settings to get merchant phone number
    const fetchSettings = async (networkName, countryCode)=>{
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) return null;
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('/blaffa/setting/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                const settingsData = response.data;
                const settings = Array.isArray(settingsData) ? settingsData[0] : settingsData;
                if (!settings) return null;
                // Handle different networks
                if (networkName?.toLowerCase() === 'moov') {
                    if (countryCode?.toLowerCase() === 'bf') {
                        return settings.bf_moov_marchand_phone || settings.moov_marchand_phone || null;
                    } else if (countryCode?.toLowerCase() === 'ci') {
                        return settings.ci_moov_marchand_phone || settings.moov_marchand_phone || null;
                    }
                    return settings.moov_marchand_phone || null;
                } else if (networkName?.toLowerCase() === 'orange') {
                    if (countryCode?.toLowerCase() === 'bf') {
                        return settings.bf_orange_marchand_phone || null;
                    } else if (countryCode?.toLowerCase() === 'ci') {
                        return settings.ci_orange_marchand_phone || null;
                    }
                    return settings.orange_marchand_phone || null;
                }
                // Default fallback
                return settings.moov_marchand_phone || null;
            }
            return null;
        } catch (error) {
            console.error('Error fetching settings:', error);
            return null;
        }
    };
    // Check if Moov redirection should be triggered
    const shouldTriggerMoovRedirect = (network)=>{
        if (!network) return false;
        const isMoov = network.name?.toLowerCase() === 'moov';
        const hasConnectApi = network.deposit_api?.toLowerCase() === 'connect';
        return isMoov && hasConnectApi;
    };
    // Check if Orange redirection should be triggered
    const shouldTriggerOrangeRedirect = (network)=>{
        if (!network) return false;
        const isOrange = network.name?.toLowerCase() === 'orange';
        const hasConnectApi = network.deposit_api?.toLowerCase() === 'connect';
        return isOrange && hasConnectApi;
    };
    // Generate USSD code
    const generateUssdCode = (merchantPhone, amount)=>{
        const ussdAmount = Math.floor(amount * 0.99); // 99% of the transaction amount
        return `*155*2*1*${merchantPhone}*${ussdAmount}#`;
    };
    // Generate Orange USSD code
    const generateOrangeUssdCode = (merchantPhone, amount)=>{
        return `*144*2*1*${merchantPhone}*${amount}#`;
    };
    // Attempt automatic dialer redirect
    const attemptDialerRedirect = (ussdCode)=>{
        try {
            const link = document.createElement('a');
            link.href = `tel:${ussdCode}`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            setTimeout(()=>{
                document.body.removeChild(link);
            }, 100);
        } catch (error) {
            console.error('Error attempting dialer redirect:', error);
        }
    };
    // Handle Moov redirection flow
    const handleMoovRedirect = async (amount, countryCode)=>{
        const merchantPhone = await fetchSettings('moov', countryCode);
        if (!merchantPhone) {
            console.warn('Moov merchant phone not found in settings');
            return;
        }
        const ussdCode = generateUssdCode(merchantPhone, amount);
        setMoovUssdCode(ussdCode);
        setMoovMerchantPhone(merchantPhone);
        // Attempt automatic redirect
        attemptDialerRedirect(ussdCode);
        // Always show modal as fallback
        setShowMoovModal(true);
    };
    // Handle Orange redirection flow
    const handleOrangeRedirect = async (amount, countryCode)=>{
        const merchantPhone = await fetchSettings('orange', countryCode);
        if (!merchantPhone) {
            console.warn('Orange merchant phone not found in settings');
            return;
        }
        const ussdCode = generateOrangeUssdCode(merchantPhone, amount);
        setOrangeUssdCode(ussdCode);
        setOrangeMerchantPhone(merchantPhone);
        // Attempt automatic dialer redirect
        attemptDialerRedirect(ussdCode);
        // Always show modal as fallback
        setShowOrangeModal(true);
    };
    // Close Moov modal and redirect to dashboard
    const closeMoovModal = ()=>{
        setShowMoovModal(false);
        // Redirect to dashboard after 2 seconds
        setTimeout(()=>{
            window.location.href = '/dashboard';
        }, 2000);
    };
    // Close Orange modal and redirect to dashboard
    const closeOrangeModal = ()=>{
        setShowOrangeModal(false);
        setOrangeTransactionLink(null);
        // Redirect to dashboard after 2 seconds
        setTimeout(()=>{
            window.location.href = '/dashboard';
        }, 2000);
    };
    // Copy USSD code to clipboard
    const copyUssdCode = async ()=>{
        try {
            await navigator.clipboard.writeText(moovUssdCode);
            setCopied(true);
            setTimeout(()=>setCopied(false), 2000);
        } catch (error) {
            console.error('Error copying USSD code:', error);
        }
    };
    // Copy Orange USSD code to clipboard
    const copyOrangeUssdCode = async ()=>{
        try {
            await navigator.clipboard.writeText(orangeUssdCode);
            setCopied(true);
            setTimeout(()=>setCopied(false), 2000);
        } catch (error) {
            console.error('Error copying Orange USSD code:', error);
        }
    };
    const renderStep = ()=>{
        switch(currentStep){
            case 'selectId':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: `text-xl font-bold ${theme.colors.text} mb-2`,
                                children: "1. Sélectionnez votre plateforme"
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1017,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1016,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full flex justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 md:grid-cols-2 gap-4 w-full max-w-lg",
                                children: platforms.map((platform)=>{
                                    const isActive = selectedPlatform?.id === platform.id;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        onClick: ()=>handlePlatformSelect(platform),
                                        className: `cursor-pointer ${theme.colors.a_background} border rounded-2xl flex flex-col items-center p-6 transition-all duration-300
                        ${isActive ? 'border-blue-500 ring-1 ring-blue-500' : `${theme.mode === 'dark' ? 'border-slate-700' : 'border-slate-200'} hover:border-blue-300`}`,
                                        children: [
                                            platform.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-20 w-20 flex items-center justify-center mb-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: platform.image,
                                                    alt: platform.public_name || platform.name,
                                                    className: "h-16 w-16 object-contain"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1033,
                                                    columnNumber: 27
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1032,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `font-medium text-base text-center uppercase tracking-wider ${theme.colors.text}`,
                                                children: platform.public_name || platform.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1040,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, platform.id, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1025,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1021,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1020,
                            columnNumber: 13
                        }, this),
                        platforms.length === 0 && !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center justify-center py-20 px-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `${theme.colors.d_text} opacity-40 text-center`,
                                children: t("Aucune plateforme disponible")
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1051,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1050,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/deposit/page.tsx",
                    lineNumber: 1015,
                    columnNumber: 11
                }, this);
            case 'manageBetId':
                const platformBetIds = savedAppIds.filter((id)=>id.app_name.id === selectedPlatform?.id);
                const handleDeleteBetId = async (id)=>{
                    const token = localStorage.getItem('accessToken');
                    if (!token) return;
                    try {
                        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].delete(`/blaffa/id_link/${id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        setSavedAppIds((prev)=>prev.filter((bet)=>bet.id !== id));
                    } catch  {
                        setError(t("Erreur lors de la suppression de l'ID"));
                    }
                };
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: `text-xl font-bold ${theme.colors.text} mb-2`,
                                children: [
                                    "2. Choisissez ou créez votre ID pour ",
                                    selectedPlatform?.public_name || selectedPlatform?.name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1073,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1072,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: platformBetIds.map((id)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    onClick: ()=>{
                                        setSelectedBetId(id.link);
                                        setCurrentStep('selectNetwork');
                                    },
                                    className: `flex items-center justify-between ${theme.colors.a_background} border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-slate-200'} rounded-2xl px-6 py-5 cursor-pointer hover:border-blue-300 transition-all`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-6",
                                            children: [
                                                selectedPlatform?.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `${theme.mode === 'dark' ? 'bg-slate-700' : 'bg-slate-50'} p-2 rounded-lg`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: selectedPlatform.image,
                                                        alt: "",
                                                        className: "w-10 h-10 object-contain"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/deposit/page.tsx",
                                                        lineNumber: 1089,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1088,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `text-xl font-bold tracking-wider ${theme.colors.text}`,
                                                    children: id.link
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1092,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1086,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: (e)=>{
                                                e.stopPropagation();
                                                handleDeleteBetId(id.id);
                                            },
                                            className: "p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                xmlns: "http://www.w3.org/2000/svg",
                                                className: "h-7 w-7",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1099,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1098,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1094,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, id.id, true, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1078,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1076,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pt-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    const platformName = selectedPlatform?.public_name || selectedPlatform?.name || '';
                                    const platformId = selectedPlatform?.id || '';
                                    window.location.href = `/bet_id?origin=deposit&platform=${encodeURIComponent(platformName)}&platform_id=${platformId}`;
                                },
                                className: "w-full py-4 border border-[#002d72] dark:border-blue-400 rounded-2xl flex items-center justify-center gap-3 text-[#002d72] dark:text-blue-400 font-bold text-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        size: 24,
                                        strokeWidth: 2.5
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1115,
                                        columnNumber: 17
                                    }, this),
                                    "Créer un nouvel ID"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1107,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1106,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center pt-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setCurrentStep('selectId'),
                                className: `${theme.colors.d_text} opacity-60 flex items-center gap-2 hover:opacity-100 transition-opacity`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-5 w-5",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1126,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1125,
                                        columnNumber: 17
                                    }, this),
                                    t("Retour aux plateformes")
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1121,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1120,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/deposit/page.tsx",
                    lineNumber: 1071,
                    columnNumber: 11
                }, this);
            case 'selectNetwork':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: `text-xl font-bold ${theme.colors.text} mb-2`,
                                children: "3. Sélectionnez votre réseau"
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1137,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1136,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: networks.map((network)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    onClick: ()=>handleNetworkSelect(network),
                                    className: `flex items-center gap-4 p-4 ${theme.colors.a_background} border rounded-2xl cursor-pointer transition-all ${selectedNetwork?.id === network.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : `${theme.mode === 'dark' ? 'border-gray-700' : 'border-gray-200'} hover:border-gray-300`}`,
                                    children: [
                                        network.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-14 h-14 flex items-center justify-center flex-shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: network.image,
                                                alt: network.name,
                                                className: "w-12 h-12 object-contain"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1152,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1151,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `w-14 h-14 ${theme.mode === 'dark' ? 'bg-slate-800' : 'bg-gray-100'} rounded-lg flex items-center justify-center flex-shrink-0`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"], {
                                                className: `w-6 h-6 ${theme.colors.d_text} opacity-40`
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1156,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1155,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `text-lg font-medium ${theme.colors.text}`,
                                            children: network.public_name || network.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1159,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, network.id, true, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1142,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1140,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pt-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    if (selectedNetwork) {
                                        handleNetworkSelect(selectedNetwork);
                                    }
                                },
                                disabled: !selectedNetwork,
                                className: `w-full py-4 rounded-2xl font-bold text-lg transition-all ${selectedNetwork ? 'bg-gray-400 hover:bg-gray-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`,
                                children: "Suivant"
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1167,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1166,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center pt-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setCurrentStep('manageBetId'),
                                className: `${theme.colors.d_text} opacity-60 flex items-center gap-2 hover:opacity-100 transition-opacity`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-5 w-5",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1189,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1188,
                                        columnNumber: 17
                                    }, this),
                                    t("Retour")
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1184,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1183,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/deposit/page.tsx",
                    lineNumber: 1135,
                    columnNumber: 11
                }, this);
            case 'selectPhone':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: `text-xl font-bold ${theme.colors.text} mb-2`,
                                children: [
                                    "4. Choisissez ou enregistrez votre numéro ",
                                    selectedNetwork?.public_name || selectedNetwork?.name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1201,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1200,
                            columnNumber: 13
                        }, this),
                        phoneLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center py-20",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1208,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1207,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3",
                                    children: userPhones.map((phone)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            onClick: ()=>handlePhoneSelect(phone),
                                            className: `flex items-center justify-between ${theme.colors.a_background} border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-slate-200'} rounded-2xl px-4 py-4 cursor-pointer hover:border-blue-300 transition-all`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0`,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"], {
                                                                className: "w-6 h-6 text-white"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                                lineNumber: 1221,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/deposit/page.tsx",
                                                            lineNumber: 1220,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-lg font-medium ${theme.colors.text}`,
                                                            children: formatPhoneWithCountryCode(phone.phone)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/deposit/page.tsx",
                                                            lineNumber: 1223,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1219,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: (e)=>{
                                                        e.stopPropagation();
                                                        handleDeletePhone(phone.id);
                                                    },
                                                    className: "p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        className: "h-6 w-6",
                                                        fill: "none",
                                                        viewBox: "0 0 24 24",
                                                        stroke: "currentColor",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            strokeWidth: 2,
                                                            d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/deposit/page.tsx",
                                                            lineNumber: 1235,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/deposit/page.tsx",
                                                        lineNumber: 1234,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1227,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, phone.id, true, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1214,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1212,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pt-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setCurrentStep('addPhone'),
                                        className: `w-full py-4 border-2 border-[#1e4a8e] text-[#1e4a8e] dark:border-blue-400 dark:text-blue-400 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                size: 24,
                                                strokeWidth: 2.5
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1247,
                                                columnNumber: 21
                                            }, this),
                                            "Ajouter un numéro"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1243,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1242,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-center pt-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setCurrentStep('selectNetwork'),
                                        className: `${theme.colors.d_text} opacity-60 flex items-center gap-2 hover:opacity-100 transition-opacity`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                xmlns: "http://www.w3.org/2000/svg",
                                                className: "h-5 w-5",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1258,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1257,
                                                columnNumber: 21
                                            }, this),
                                            t("Retour")
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1253,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1252,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/deposit/page.tsx",
                    lineNumber: 1199,
                    columnNumber: 11
                }, this);
            case 'addPhone':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `min-h-screen ${theme.colors.a_background}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4 mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setCurrentStep('selectPhone'),
                                    className: `p-1 ${theme.colors.hover} rounded-full transition-colors`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        size: 28,
                                        className: theme.colors.text
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1277,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1273,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: `text-xl font-bold ${theme.colors.text}`,
                                    children: "Dépôt - Numéro de télé..."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1279,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1272,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: `text-lg font-bold ${theme.colors.text} mb-2`,
                                children: [
                                    "4. Choisissez ou enregistrez votre numéro ",
                                    selectedNetwork?.public_name || selectedNetwork?.name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1286,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1285,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: `block text-lg font-bold ${theme.colors.text} mb-2 px-1`,
                                            children: "Nouveau numéro"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1293,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "tel",
                                            value: newPhoneNumber,
                                            onChange: (e)=>setNewPhoneNumber(e.target.value),
                                            placeholder: "Entrez votre numéro",
                                            className: `w-full h-14 px-4 rounded-xl border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-gray-300'} ${theme.colors.a_background} text-lg ${theme.colors.text} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400`
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1296,
                                            columnNumber: 17
                                        }, this),
                                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-red-500 text-sm mt-2 px-1",
                                            children: error
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1303,
                                            columnNumber: 27
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1292,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-4 pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setCurrentStep('selectPhone'),
                                            className: `flex-1 h-14 border-2 border-[#1e4a8e] text-[#1e4a8e] dark:border-blue-400 dark:text-blue-400 font-bold text-lg rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors`,
                                            children: "Annuler"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1307,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: async ()=>{
                                                const success = await handleAddPhone();
                                                if (success) {
                                                    setCurrentStep('selectPhone');
                                                }
                                            },
                                            disabled: !newPhoneNumber,
                                            className: `flex-1 h-14 bg-[#1a4384] text-white font-bold text-lg rounded-2xl shadow-lg hover:bg-[#15386b] transition-all disabled:opacity-50 disabled:cursor-not-allowed`,
                                            style: {
                                                backgroundColor: theme.mode === 'dark' ? theme.colors.primary : '#1a4384'
                                            },
                                            children: loading ? '...' : 'Enregistrer'
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1313,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1306,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1291,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/deposit/page.tsx",
                    lineNumber: 1270,
                    columnNumber: 11
                }, this);
            case 'enterDetails':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `min-h-screen ${theme.colors.a_background}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4 mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setCurrentStep('selectPhone'),
                                    className: "p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        size: 28,
                                        className: "text-gray-900 dark:text-gray-100"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1340,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1336,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: `text-xl font-bold ${theme.colors.text}`,
                                    children: "Dépôt - Informations"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1342,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1335,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: `text-lg font-bold ${theme.colors.text} mb-2`,
                                children: "5. Confirmer le paiement"
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1349,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1348,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleSubmit,
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: `block text-base ${theme.colors.d_text} opacity-70 mb-2`,
                                            children: "Montant (F CFA)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1357,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            name: "amount",
                                            value: formData.amount,
                                            onChange: handleInputChange,
                                            className: "w-full h-14 px-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                                            placeholder: "Entrez le montant",
                                            required: true,
                                            min: getNetworkMinAmount(),
                                            max: selectedPlatform?.maximum_deposit || selectedPlatform?.max_deposit || 1000000,
                                            step: "1"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1360,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `mt-2 text-sm ${theme.colors.d_text} opacity-50`,
                                            children: [
                                                getNetworkMinAmount(),
                                                " F - ",
                                                selectedPlatform?.maximum_deposit || selectedPlatform?.max_deposit || 300000,
                                                " F"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1373,
                                            columnNumber: 17
                                        }, this),
                                        validationErrors.amount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-2 text-sm text-red-500",
                                            children: validationErrors.amount
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1377,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1356,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: `block text-base ${theme.colors.d_text} opacity-70 mb-2`,
                                            children: "Numéro de téléphone"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1383,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `flex items-center gap-2 px-4 py-3 ${theme.colors.a_background} border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-slate-300'} rounded-xl`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-2xl",
                                                            children: "🇨🇮"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/deposit/page.tsx",
                                                            lineNumber: 1389,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-lg font-medium ${theme.colors.text}`,
                                                            children: selectedNetwork?.indication || '+225'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/deposit/page.tsx",
                                                            lineNumber: 1390,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1388,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `flex-1 flex items-center px-4 py-3 ${theme.colors.a_background} border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-slate-300'} rounded-xl`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `text-lg ${theme.colors.text}`,
                                                        children: selectedPhone ? selectedPhone.phone.replace(/^\+?225/, '') : ''
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/deposit/page.tsx",
                                                        lineNumber: 1396,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1395,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1386,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1382,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `p-4 ${theme.mode === 'dark' ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-xl`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-shrink-0 mt-0.5",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: `w-5 h-5 ${theme.mode === 'dark' ? 'text-blue-400' : 'text-blue-600'}`,
                                                    fill: "currentColor",
                                                    viewBox: "0 0 20 20",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        fillRule: "evenodd",
                                                        d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
                                                        clipRule: "evenodd"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/deposit/page.tsx",
                                                        lineNumber: 1408,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1407,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1406,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: `text-sm ${theme.mode === 'dark' ? 'text-blue-300' : 'text-blue-700'} uppercase font-medium`,
                                                children: "Le numéro que vous écrivez doit être le même que vous allez utiliser pour faire le paiement."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1411,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1405,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1404,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-orange-500 dark:text-orange-400 italic",
                                        children: "Dès que vous payez, vérifier votre compte de pari, ne lancez pas une 2e fois."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1419,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1418,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pt-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: loading || !formData.amount || !selectedPhone,
                                        className: `w-full h-14 text-white font-bold text-lg rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`,
                                        style: {
                                            backgroundColor: theme.mode === 'dark' ? theme.colors.primary : '#1a4384'
                                        },
                                        children: loading ? 'Traitement...' : 'Dépôt'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1426,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1425,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1354,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/deposit/page.tsx",
                    lineNumber: 1333,
                    columnNumber: 11
                }, this);
        }
    };
    // Get current step title
    const getCurrentStepTitle = ()=>{
        switch(currentStep){
            case 'selectId':
                return "Dépôt";
            case 'manageBetId':
                return "Dépôt - ID Utilisateur";
            case 'selectNetwork':
                return "Dépôt - Réseau";
            case 'selectPhone':
                return "Dépôt - Numéro de télé...";
            case 'enterDetails':
                return "Dépôt - Montant";
            default:
                return "Dépôt";
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `min-h-screen bg-gradient-to-br ${theme.colors.a_background} p-4`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
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
        `
            }, void 0, false, {
                fileName: "[project]/src/app/deposit/page.tsx",
                lineNumber: 1461,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-4xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-6 mb-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    if (currentStep === 'selectId') {
                                        window.location.href = '/dashboard';
                                    } else if (currentStep === 'manageBetId') {
                                        setCurrentStep('selectId');
                                    } else if (currentStep === 'selectNetwork') {
                                        setCurrentStep('manageBetId');
                                    } else if (currentStep === 'selectPhone') {
                                        setCurrentStep('selectNetwork');
                                    } else if (currentStep === 'enterDetails') {
                                        setCurrentStep('selectPhone');
                                    }
                                },
                                className: "p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    className: "h-8 w-8",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1537,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1536,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1520,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold tracking-tight",
                                children: getCurrentStepTitle()
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1540,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/deposit/page.tsx",
                        lineNumber: 1519,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pb-24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-6 p-4 bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-600/50 text-red-300 rounded-2xl backdrop-blur-sm",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                className: "w-5 h-5 mr-3"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1550,
                                                columnNumber: 19
                                            }, this),
                                            error
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1549,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1548,
                                    columnNumber: 15
                                }, this),
                                success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-6 p-4 bg-gradient-to-r from-green-900/50 to-green-800/50 border border-green-600/50 text-green-300 rounded-2xl backdrop-blur-sm",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                className: "w-5 h-5 mr-3"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1559,
                                                columnNumber: 19
                                            }, this),
                                            success
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1558,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1557,
                                    columnNumber: 15
                                }, this),
                                loading && !success && !error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-center items-center p-20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1568,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-500/20 animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1569,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1567,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1566,
                                    columnNumber: 15
                                }, this) : renderStep()
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1545,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/deposit/page.tsx",
                        lineNumber: 1544,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/deposit/page.tsx",
                lineNumber: 1517,
                columnNumber: 7
            }, this),
            isModalOpen && selectedTransaction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${theme.colors.background} rounded-lg shadow-xl w-full max-w-md`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold",
                                        children: t("Transaction Details")
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1586,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: closeTransactionDetails,
                                        className: "",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-6 h-6",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: "2",
                                                d: "M6 18L18 6M6 6l12 12"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1592,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1591,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1587,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1585,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center py-2 border-b dark:border-gray-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-gray-600 dark:text-gray-400",
                                                children: t("Amount")
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1599,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: [
                                                    selectedTransaction.transaction.amount,
                                                    " FCFA"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1600,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1598,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center py-2 border-b dark:border-gray-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-gray-600 dark:text-gray-400",
                                                children: t("Status")
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1604,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `font-medium ${selectedTransaction.transaction.status === 'completed' ? 'text-green-600 dark:text-green-400' : selectedTransaction.transaction.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`,
                                                children: selectedTransaction.transaction.status.charAt(0).toUpperCase() + selectedTransaction.transaction.status.slice(1)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1605,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1603,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center py-2 border-b dark:border-gray-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "",
                                                children: t("Reference")
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1617,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: selectedTransaction.transaction.reference
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1618,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1616,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center py-2 border-b dark:border-gray-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "",
                                                children: t("Date")
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1622,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: new Date(selectedTransaction.transaction.created_at).toLocaleString('fr-FR')
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1623,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1621,
                                        columnNumber: 17
                                    }, this),
                                    selectedTransaction.transaction.phone_number && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-center py-2 border-b dark:border-gray-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "",
                                                children: t("Phone Number")
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1630,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: selectedTransaction.transaction.phone_number
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1631,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1629,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1597,
                                columnNumber: 15
                            }, this),
                            transactionLink && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-6 flex justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>window.open(transactionLink, '_blank', 'noopener,noreferrer'),
                                    className: "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors",
                                    children: t("Click to continue payment")
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1639,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1638,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-6 flex justify-end",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: closeTransactionDetails,
                                    className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",
                                    children: t("Close")
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1649,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1648,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/deposit/page.tsx",
                        lineNumber: 1584,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/deposit/page.tsx",
                    lineNumber: 1583,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/deposit/page.tsx",
                lineNumber: 1582,
                columnNumber: 9
            }, this),
            showMoovModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${theme.colors.background} rounded-lg shadow-xl w-full max-w-md modal-content`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold",
                                        children: "Code USSD Moov"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1667,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowMoovModal(false),
                                        className: "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-6 h-6",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: "2",
                                                d: "M6 18L18 6M6 6l12 12"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1673,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1672,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1668,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1666,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-600 dark:text-gray-400",
                                        children: "Veuillez copier et coller ce code dans votre application téléphone pour compléter le paiement."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1679,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                                                children: "Numéro du marchand"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1684,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "font-mono text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900 rounded px-3 py-2",
                                                children: moovMerchantPhone
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1687,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1683,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                                                children: "Code USSD"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1693,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        readOnly: true,
                                                        value: moovUssdCode,
                                                        className: "flex-1 p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 font-mono text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/deposit/page.tsx",
                                                        lineNumber: 1697,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: copyUssdCode,
                                                        className: `px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${copied ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                                size: 16
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                                lineNumber: 1710,
                                                                columnNumber: 23
                                                            }, this),
                                                            copied ? 'Copié!' : 'Copier'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/deposit/page.tsx",
                                                        lineNumber: 1703,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1696,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1692,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1678,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-6 flex justify-end",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: closeMoovModal,
                                    className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",
                                    children: "J'ai compris"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1718,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1717,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/deposit/page.tsx",
                        lineNumber: 1665,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/deposit/page.tsx",
                    lineNumber: 1664,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/deposit/page.tsx",
                lineNumber: 1663,
                columnNumber: 9
            }, this),
            showOrangeModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${theme.colors.background} rounded-lg shadow-xl w-full max-w-md modal-content`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold",
                                        children: "Paiement Orange"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1736,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowOrangeModal(false),
                                        className: "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-6 h-6",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: "2",
                                                d: "M6 18L18 6M6 6l12 12"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1742,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1741,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1737,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1735,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: orangeTransactionLink ? // Show transaction link button
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-600 dark:text-gray-400",
                                            children: "Cliquez sur le bouton ci-dessous pour continuer votre paiement."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1751,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-6 flex justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>window.open(orangeTransactionLink, '_blank', 'noopener,noreferrer'),
                                                className: "px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2",
                                                children: "Continuer le paiement"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1755,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1754,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true) : // Show USSD code
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-600 dark:text-gray-400",
                                            children: "Veuillez copier et coller ce code dans votre application téléphone pour compléter le paiement."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1766,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                                                    children: "Numéro du marchand"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1771,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "font-mono text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900 rounded px-3 py-2",
                                                    children: orangeMerchantPhone
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1774,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1770,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                                                    children: "Code USSD"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1780,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            readOnly: true,
                                                            value: orangeUssdCode,
                                                            className: "flex-1 p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 font-mono text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/deposit/page.tsx",
                                                            lineNumber: 1784,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: copyOrangeUssdCode,
                                                            className: `px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${copied ? 'bg-green-600 text-white' : 'bg-orange-600 text-white hover:bg-orange-700'}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                                    size: 16
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                                    lineNumber: 1797,
                                                                    columnNumber: 27
                                                                }, this),
                                                                copied ? 'Copié!' : 'Copier'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/deposit/page.tsx",
                                                            lineNumber: 1790,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1783,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1779,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1747,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-6 flex justify-end",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: closeOrangeModal,
                                    className: "px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors",
                                    children: "J'ai compris"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1807,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1806,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/deposit/page.tsx",
                        lineNumber: 1734,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/deposit/page.tsx",
                    lineNumber: 1733,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/deposit/page.tsx",
                lineNumber: 1732,
                columnNumber: 9
            }, this),
            showEditPhoneModal && phoneToEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${theme.colors.background} rounded-lg shadow-xl w-full max-w-md modal-content`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold",
                                        children: t("Modifier le numéro de téléphone")
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1827,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setShowEditPhoneModal(false);
                                            setPhoneToEdit(null);
                                            setNewPhoneNumber('');
                                        },
                                        className: "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-6 h-6",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: "2",
                                                d: "M6 18L18 6M6 6l12 12"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1837,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1836,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1828,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1826,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                                            children: t("Numéro de téléphone")
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1844,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "tel",
                                            value: newPhoneNumber,
                                            onChange: (e)=>setNewPhoneNumber(e.target.value),
                                            className: "w-full p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600",
                                            placeholder: "ex: 771234567"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1847,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-slate-500 dark:text-slate-400 mt-1",
                                            children: t("Entrez le numéro sans le préfixe +225")
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1854,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1843,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1842,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-6 flex justify-end gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setShowEditPhoneModal(false);
                                            setPhoneToEdit(null);
                                            setNewPhoneNumber('');
                                        },
                                        className: "px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200",
                                        children: t("Annuler")
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1861,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleEditPhone,
                                        disabled: !newPhoneNumber.trim(),
                                        className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50",
                                        children: t("Modifier")
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1871,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1860,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/deposit/page.tsx",
                        lineNumber: 1825,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/deposit/page.tsx",
                    lineNumber: 1824,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/deposit/page.tsx",
                lineNumber: 1823,
                columnNumber: 11
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/deposit/page.tsx",
        lineNumber: 1460,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__217d59aa._.js.map