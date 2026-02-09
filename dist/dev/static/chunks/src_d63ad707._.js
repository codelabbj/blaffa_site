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
                window.location.href = '/login';
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/deposit/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Deposits
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
//import Head from 'next/head';
//import axios from 'axios';
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [app-client] (ecmascript)");
//import styles from '../styles/Deposits.module.css';
//import { ClipboardIcon } from 'lucide-react'; // Make sure to install this package
//import { Transaction } from 'mongodb';
//import DashboardHeader from '@/components/DashboardHeader';
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ThemeProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$WebSocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/WebSocketContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.ts [app-client] (ecmascript)");
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
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    const [currentStep, setCurrentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('selectId');
    const [selectedPlatform, setSelectedPlatform] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [platforms, setPlatforms] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedNetwork, setSelectedNetwork] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        amount: '',
        phoneNumber: '',
        betid: '',
        otp_code: ''
    });
    const [validationErrors, setValidationErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        amount: '',
        phoneNumber: '',
        otp_code: ''
    });
    const [networks, setNetworks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [savedAppIds, setSavedAppIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]); // Used in manageBetId and other steps
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isModalOpen, setIsModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedTransaction, setSelectedTransaction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [transactionLink, setTransactionLink] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showPaymentModal, setShowPaymentModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { theme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const { addMessageHandler } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$WebSocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWebSocket"])();
    const [selectedBetId, setSelectedBetId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Phone number management state
    const [userPhones, setUserPhones] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedPhone, setSelectedPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [phoneLoading, setPhoneLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // const [showAddPhoneModal, setShowAddPhoneModal] = useState(false); // Removed
    const [showEditPhoneModal, setShowEditPhoneModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [phoneToEdit, setPhoneToEdit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [newPhoneNumber, setNewPhoneNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Deposits.useEffect": ()=>{
            const handleTransactionLink = {
                "Deposits.useEffect.handleTransactionLink": (data)=>{
                    if (data.type === 'transaction_link' && data.data) {
                        setTransactionLink(data.data); // Save the link for the modal button
                        setShowPaymentModal(true); // Open the modal
                    }
                }
            }["Deposits.useEffect.handleTransactionLink"];
            const removeHandler = addMessageHandler(handleTransactionLink);
            return ({
                "Deposits.useEffect": ()=>removeHandler()
            })["Deposits.useEffect"];
        }
    }["Deposits.useEffect"], [
        addMessageHandler
    ]);
    // Auto-hide error messages after 20 seconds
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Deposits.useEffect": ()=>{
            if (error) {
                const timer = setTimeout({
                    "Deposits.useEffect.timer": ()=>{
                        setError('');
                    }
                }["Deposits.useEffect.timer"], 20000); // 20 seconds
                return ({
                    "Deposits.useEffect": ()=>clearTimeout(timer)
                })["Deposits.useEffect"];
            }
        }
    }["Deposits.useEffect"], [
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
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/blaffa/app_name?operation_type=deposit');
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Deposits.useEffect": ()=>{
            const fetchData = {
                "Deposits.useEffect.fetchData": async ()=>{
                    const token = localStorage.getItem('accessToken');
                    // We allow loading the page without token now to see platforms
                    // specific user data (networks, saved IDs) will only be fetched if token exists
                    try {
                        setLoading(true);
                        const promises = [
                            fetchPlatforms()
                        ];
                        if (token) {
                            promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/blaffa/network-v2/?type=deposit', {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }).then({
                                "Deposits.useEffect.fetchData": (res)=>setNetworks(res.data)
                            }["Deposits.useEffect.fetchData"]));
                            promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/blaffa/id_link', {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }).then({
                                "Deposits.useEffect.fetchData": (res)=>{
                                    const data = res.data;
                                    let processedData = [];
                                    if (Array.isArray(data)) processedData = data;
                                    else if (data?.results) processedData = data.results;
                                    else if (data?.data) processedData = data.data;
                                    setSavedAppIds(processedData);
                                }
                            }["Deposits.useEffect.fetchData"]));
                        }
                        await Promise.allSettled(promises);
                    } catch (err) {
                        console.error('Error fetching data:', err);
                    // Don't show critical error if just public load
                    } finally{
                        setLoading(false);
                    }
                }
            }["Deposits.useEffect.fetchData"];
            fetchData();
        }
    }["Deposits.useEffect"], []);
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
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/blaffa/user-phone/', {
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
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/blaffa/id_link', {
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
    // Get current min and max deposit limits
    const getDepositLimits = ()=>{
        const minVal = selectedPlatform?.minimun_deposit || selectedPlatform?.minimum_deposit || '100';
        const maxVal = selectedPlatform?.max_deposit || selectedPlatform?.maximum_deposit || '1000000';
        return {
            min: parseFloat(String(minVal)),
            max: parseFloat(String(maxVal))
        };
    };
    const getNetworkMinAmount = ()=>{
        return getDepositLimits().min;
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
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/blaffa/transaction?country_code=${countryCode}`, transactionData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const transaction = response.data;
            setSelectedTransaction({
                transaction
            });
            setSuccess('Transaction initiée avec succès !');
            // Check for transaction link in response and show modal
            if (transaction.transaction_link) {
                setTransactionLink(transaction.transaction_link);
                setShowPaymentModal(true);
            }
            // Check if ussd_code is present in response and trigger dialer
            if (transaction.ussd_code) {
                attemptDialerRedirect(transaction.ussd_code);
            }
            // Only redirect main tab to dashboard if there's no payment link or ussd code
            if (!transaction.transaction_link && !transaction.ussd_code) {
                setTimeout(()=>{
                    if ("TURBOPACK compile-time truthy", 1) window.location.href = '/dashboard';
                }, 2000);
            }
            // Reset form
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
    // Attempt automatic dialer redirect
    const attemptDialerRedirect = (ussdCode)=>{
        try {
            const link = document.createElement('a');
            // Encode # as %23 for dialer compatibility
            const encodedCode = ussdCode.replace(/#/g, '%23');
            link.href = `tel:${encodedCode}`;
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
    const renderStep = ()=>{
        switch(currentStep){
            case 'selectId':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: `text-xl font-bold ${theme.colors.text} mb-2`,
                                children: "1. Sélectionnez votre plateforme"
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 847,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 846,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full flex justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full",
                                children: platforms.map((platform)=>{
                                    const isActive = selectedPlatform?.id === platform.id;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        onClick: ()=>handlePlatformSelect(platform),
                                        className: `cursor-pointer ${theme.colors.a_background} border rounded-2xl flex flex-col items-center p-6 transition-all duration-300
                        ${isActive ? 'border-blue-500 ring-1 ring-blue-500' : `${theme.mode === 'dark' ? 'border-slate-700' : 'border-slate-200'} hover:border-blue-300`}`,
                                        children: [
                                            platform.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-20 w-20 flex items-center justify-center mb-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: platform.image,
                                                    alt: platform.public_name || platform.name,
                                                    className: "h-16 w-16 object-contain"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 863,
                                                    columnNumber: 27
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 862,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `font-medium text-base text-center uppercase tracking-wider ${theme.colors.text}`,
                                                children: platform.public_name || platform.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 870,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, platform.id, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 855,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 851,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 850,
                            columnNumber: 13
                        }, this),
                        platforms.length === 0 && !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center justify-center py-20 px-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `${theme.colors.d_text} opacity-40 text-center`,
                                children: t("Aucune plateforme disponible")
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 881,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 880,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/deposit/page.tsx",
                    lineNumber: 845,
                    columnNumber: 11
                }, this);
            case 'manageBetId':
                const platformBetIds = savedAppIds.filter((id)=>id.app_name.id === selectedPlatform?.id);
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
                        setError(t("Erreur lors de la suppression de l'ID"));
                    }
                };
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: `text-xl font-bold ${theme.colors.text} mb-2`,
                                children: [
                                    "2. Choisissez ou créez votre ID pour ",
                                    selectedPlatform?.public_name || selectedPlatform?.name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 903,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 902,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: platformBetIds.map((id)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    onClick: ()=>{
                                        setSelectedBetId(id.link);
                                        setCurrentStep('selectNetwork');
                                    },
                                    className: `flex items-center justify-between ${theme.colors.a_background} border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-slate-200'} rounded-2xl px-6 py-5 cursor-pointer hover:border-blue-300 transition-all`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-6",
                                            children: [
                                                selectedPlatform?.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `${theme.mode === 'dark' ? 'bg-slate-700' : 'bg-slate-50'} p-2 rounded-lg`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: selectedPlatform.image,
                                                        alt: "",
                                                        className: "w-10 h-10 object-contain"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/deposit/page.tsx",
                                                        lineNumber: 919,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 918,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `text-xl font-bold tracking-wider ${theme.colors.text}`,
                                                    children: id.link
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 922,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 916,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: (e)=>{
                                                e.stopPropagation();
                                                handleDeleteBetId(id.id);
                                            },
                                            className: "p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                xmlns: "http://www.w3.org/2000/svg",
                                                className: "h-7 w-7",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 929,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 928,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 924,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, id.id, true, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 908,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 906,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pt-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    const platformName = selectedPlatform?.public_name || selectedPlatform?.name || '';
                                    const platformId = selectedPlatform?.id || '';
                                    window.location.href = `/bet_id?origin=deposit&platform=${encodeURIComponent(platformName)}&platform_id=${platformId}`;
                                },
                                className: "w-full py-4 border border-[#002d72] dark:border-blue-400 rounded-2xl flex items-center justify-center gap-3 text-[#002d72] dark:text-blue-400 font-bold text-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        size: 24,
                                        strokeWidth: 2.5
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 945,
                                        columnNumber: 17
                                    }, this),
                                    "Ajouter un nouvel ID"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 937,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 936,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center pt-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setCurrentStep('selectId'),
                                className: `${theme.colors.d_text} opacity-60 flex items-center gap-2 hover:opacity-100 transition-opacity`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-5 w-5",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 956,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 955,
                                        columnNumber: 17
                                    }, this),
                                    t("Retour aux plateformes")
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 951,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 950,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/deposit/page.tsx",
                    lineNumber: 901,
                    columnNumber: 11
                }, this);
            case 'selectNetwork':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: `text-xl font-bold ${theme.colors.text} mb-2`,
                                children: "3. Sélectionnez votre réseau"
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 967,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 966,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: networks.map((network)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    onClick: ()=>handleNetworkSelect(network),
                                    className: `flex items-center gap-4 p-4 ${theme.colors.a_background} border rounded-2xl cursor-pointer transition-all ${selectedNetwork?.id === network.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : `${theme.mode === 'dark' ? 'border-gray-700' : 'border-gray-200'} hover:border-gray-300`}`,
                                    children: [
                                        network.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-14 h-14 flex items-center justify-center flex-shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: network.image,
                                                alt: network.name,
                                                className: "w-12 h-12 object-contain"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 982,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 981,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `w-14 h-14 ${theme.mode === 'dark' ? 'bg-slate-800' : 'bg-gray-100'} rounded-lg flex items-center justify-center flex-shrink-0`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                className: `w-6 h-6 ${theme.colors.d_text} opacity-40`
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 986,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 985,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `text-lg font-medium ${theme.colors.text}`,
                                            children: network.public_name || network.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 989,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, network.id, true, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 972,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 970,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pt-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                lineNumber: 997,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 996,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center pt-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setCurrentStep('manageBetId'),
                                className: `${theme.colors.d_text} opacity-60 flex items-center gap-2 hover:opacity-100 transition-opacity`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-5 w-5",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1019,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1018,
                                        columnNumber: 17
                                    }, this),
                                    t("Retour")
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1014,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1013,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/deposit/page.tsx",
                    lineNumber: 965,
                    columnNumber: 11
                }, this);
            case 'selectPhone':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: `text-xl font-bold ${theme.colors.text} mb-2`,
                                children: [
                                    "4. Choisissez ou enregistrez votre numéro ",
                                    selectedNetwork?.public_name || selectedNetwork?.name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1031,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1030,
                            columnNumber: 13
                        }, this),
                        phoneLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center py-20",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1038,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1037,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3",
                                    children: userPhones.map((phone)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            onClick: ()=>handlePhoneSelect(phone),
                                            className: `flex items-center justify-between ${theme.colors.a_background} border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-slate-200'} rounded-2xl px-4 py-4 cursor-pointer hover:border-blue-300 transition-all`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0`,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                                className: "w-6 h-6 text-white"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                                lineNumber: 1051,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/deposit/page.tsx",
                                                            lineNumber: 1050,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-lg font-medium ${theme.colors.text}`,
                                                            children: formatPhoneWithCountryCode(phone.phone)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/deposit/page.tsx",
                                                            lineNumber: 1053,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1049,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: (e)=>{
                                                        e.stopPropagation();
                                                        handleDeletePhone(phone.id);
                                                    },
                                                    className: "p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        className: "h-6 w-6",
                                                        fill: "none",
                                                        viewBox: "0 0 24 24",
                                                        stroke: "currentColor",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            strokeWidth: 2,
                                                            d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/deposit/page.tsx",
                                                            lineNumber: 1065,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/deposit/page.tsx",
                                                        lineNumber: 1064,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1057,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, phone.id, true, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1044,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1042,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pt-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setCurrentStep('addPhone'),
                                        className: `w-full py-4 border-2 border-[#1e4a8e] text-[#1e4a8e] dark:border-blue-400 dark:text-blue-400 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                size: 24,
                                                strokeWidth: 2.5
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1077,
                                                columnNumber: 21
                                            }, this),
                                            "Ajouter un numéro"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1073,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1072,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-center pt-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setCurrentStep('selectNetwork'),
                                        className: `${theme.colors.d_text} opacity-60 flex items-center gap-2 hover:opacity-100 transition-opacity`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                xmlns: "http://www.w3.org/2000/svg",
                                                className: "h-5 w-5",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1088,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1087,
                                                columnNumber: 21
                                            }, this),
                                            t("Retour")
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1083,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1082,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/deposit/page.tsx",
                    lineNumber: 1029,
                    columnNumber: 11
                }, this);
            case 'addPhone':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `min-h-screen ${theme.colors.a_background}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4 mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setCurrentStep('selectPhone'),
                                    className: `p-1 ${theme.colors.hover} rounded-full transition-colors`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        size: 28,
                                        className: theme.colors.text
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1107,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1103,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: `text-xl font-bold ${theme.colors.text}`,
                                    children: "Dépôt - Numéro de télé..."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1109,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1102,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: `text-lg font-bold ${theme.colors.text} mb-2`,
                                children: [
                                    "4. Choisissez ou enregistrez votre numéro ",
                                    selectedNetwork?.public_name || selectedNetwork?.name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1116,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1115,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: `block text-lg font-bold ${theme.colors.text} mb-2 px-1`,
                                            children: "Nouveau numéro"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1123,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "tel",
                                            value: newPhoneNumber,
                                            onChange: (e)=>setNewPhoneNumber(e.target.value),
                                            placeholder: "Entrez votre numéro",
                                            className: `w-full h-14 px-4 rounded-xl border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-gray-300'} ${theme.colors.a_background} text-lg ${theme.colors.text} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400`
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1126,
                                            columnNumber: 17
                                        }, this),
                                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-red-500 text-sm mt-2 px-1",
                                            children: error
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1133,
                                            columnNumber: 27
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1122,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-4 pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setCurrentStep('selectPhone'),
                                            className: `flex-1 h-14 border-2 border-[#1e4a8e] text-[#1e4a8e] dark:border-blue-400 dark:text-blue-400 font-bold text-lg rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors`,
                                            children: "Annuler"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1137,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                            lineNumber: 1143,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1136,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1121,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/deposit/page.tsx",
                    lineNumber: 1100,
                    columnNumber: 11
                }, this);
            case 'enterDetails':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `min-h-screen ${theme.colors.a_background}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4 mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setCurrentStep('selectPhone'),
                                    className: "p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        size: 28,
                                        className: "text-gray-900 dark:text-gray-100"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1170,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1166,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: `text-xl font-bold ${theme.colors.text}`,
                                    children: "5. Confirmer le paiement"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1172,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1165,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: (e)=>{
                                e.preventDefault();
                                if (validateForm()) setCurrentStep('summary');
                            },
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: `block text-base ${theme.colors.d_text} opacity-70 mb-2`,
                                            children: "Montant (F CFA)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1180,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            name: "amount",
                                            value: formData.amount,
                                            onChange: handleInputChange,
                                            className: `w-full h-14 px-4 rounded-xl border ${!formData.amount ? theme.mode === 'dark' ? 'border-gray-600' : 'border-gray-300' : parseFloat(formData.amount) < getDepositLimits().min || parseFloat(formData.amount) > getDepositLimits().max ? 'border-red-500' : 'border-green-500'} bg-white dark:bg-gray-800 text-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`,
                                            placeholder: "Entrez le montant",
                                            required: true,
                                            min: getDepositLimits().min,
                                            max: getDepositLimits().max,
                                            step: "1"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1183,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `mt-2 text-sm font-medium ${!formData.amount ? theme.colors.d_text + ' opacity-50' : parseFloat(formData.amount) < getDepositLimits().min || parseFloat(formData.amount) > getDepositLimits().max ? 'text-red-500' : 'text-green-500'}`,
                                            children: [
                                                getDepositLimits().min,
                                                " F - ",
                                                getDepositLimits().max,
                                                " F"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1201,
                                            columnNumber: 17
                                        }, this),
                                        validationErrors.amount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-2 text-sm text-red-500",
                                            children: validationErrors.amount
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1210,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1179,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: `block text-base ${theme.colors.d_text} opacity-70 mb-2`,
                                            children: "Numéro de téléphone"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1216,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `flex items-center justify-center gap-2 px-4 py-3 w-1/3 ${theme.colors.a_background} border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-slate-300'} rounded-xl`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-2xl",
                                                            children: getCountryFlag(selectedNetwork?.indication)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/deposit/page.tsx",
                                                            lineNumber: 1222,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-lg font-medium ${theme.colors.text}`,
                                                            children: selectedNetwork?.indication || '+225'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/deposit/page.tsx",
                                                            lineNumber: 1225,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1221,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `flex-1 relative flex items-center h-14 px-4 rounded-xl border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-slate-300'} ${theme.colors.a_background}`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `text-lg ${theme.colors.text}`,
                                                        children: selectedPhone ? selectedNetwork?.indication ? selectedPhone.phone.replace(new RegExp(`^\\+?${selectedNetwork.indication.replace('+', '')}`), '') : selectedPhone.phone : ''
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/deposit/page.tsx",
                                                        lineNumber: 1231,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1230,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1219,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1215,
                                    columnNumber: 15
                                }, this),
                                selectedNetwork?.deposit_message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `p-4 ${theme.mode === 'dark' ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-xl`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-shrink-0 mt-0.5",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: `w-5 h-5 ${theme.mode === 'dark' ? 'text-blue-400' : 'text-blue-600'}`,
                                                    fill: "currentColor",
                                                    viewBox: "0 0 20 20",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        fillRule: "evenodd",
                                                        d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
                                                        clipRule: "evenodd"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/deposit/page.tsx",
                                                        lineNumber: 1244,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1243,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1242,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: `text-sm ${theme.mode === 'dark' ? 'text-blue-300' : 'text-blue-700'} uppercase font-medium`,
                                                children: selectedNetwork.deposit_message
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1247,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1241,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1240,
                                    columnNumber: 17
                                }, this),
                                selectedNetwork?.tape_code && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `p-4 ${theme.mode === 'dark' ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'} border rounded-xl`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-shrink-0 mt-0.5",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: `w-5 h-5 ${theme.mode === 'dark' ? 'text-green-400' : 'text-green-600'}`,
                                                    fill: "currentColor",
                                                    viewBox: "0 0 20 20",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        fillRule: "evenodd",
                                                        d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
                                                        clipRule: "evenodd"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/deposit/page.tsx",
                                                        lineNumber: 1260,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1259,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1258,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: `text-sm ${theme.mode === 'dark' ? 'text-green-300' : 'text-green-700'} font-medium`,
                                                children: [
                                                    "Code à taper: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold underline",
                                                        children: selectedNetwork.tape_code
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/deposit/page.tsx",
                                                        lineNumber: 1264,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1263,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1257,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1256,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center",
                                    children: selectedPlatform?.deposit_message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-orange-500 dark:text-orange-400 italic",
                                        children: selectedPlatform.deposit_message
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1279,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1271,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "pt-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: loading || !formData.amount || !selectedPhone,
                                        className: `w-full h-14 text-white font-bold text-lg rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`,
                                        style: {
                                            backgroundColor: theme.mode === 'dark' ? theme.colors.primary : '#1a4384'
                                        },
                                        children: loading ? 'Traitement...' : 'Dépôt'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1287,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1286,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1177,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/deposit/page.tsx",
                    lineNumber: 1163,
                    columnNumber: 11
                }, this);
            case 'summary':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: `text-2xl font-bold ${theme.colors.text}`,
                                children: "Confirmer le dépôt"
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1304,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1303,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `${theme.colors.a_background} border ${theme.mode === 'dark' ? 'border-slate-700' : 'border-slate-200'} rounded-3xl overflow-hidden shadow-sm`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `py-6 text-center bg-gradient-to-b ${theme.mode === 'dark' ? 'from-blue-900/10 to-transparent' : 'from-blue-50 to-transparent'}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `text-5xl font-extrabold ${theme.colors.text} tracking-tight`,
                                        children: [
                                            new Intl.NumberFormat('fr-FR').format(parseInt(formData.amount)),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-2xl align-top opacity-60 font-bold",
                                                children: "F"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1313,
                                                columnNumber: 86
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1312,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1311,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-6 pb-6 space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `h-px w-full ${theme.mode === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1320,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `${theme.colors.d_text} opacity-60 text-sm`,
                                                    children: "Plateforme"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1324,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        selectedPlatform?.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: selectedPlatform.image,
                                                            alt: "",
                                                            className: "w-5 h-5 object-contain"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/deposit/page.tsx",
                                                            lineNumber: 1327,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `font-semibold ${theme.colors.text}`,
                                                            children: selectedPlatform?.public_name || selectedPlatform?.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/deposit/page.tsx",
                                                            lineNumber: 1329,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1325,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1323,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `${theme.colors.d_text} opacity-60 text-sm`,
                                                    children: "ID Utilisateur"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1335,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `font-mono font-medium ${theme.colors.text} bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sm`,
                                                    children: selectedBetId
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1336,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1334,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `${theme.colors.d_text} opacity-60 text-sm`,
                                                    children: "Moyen de paiement"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1341,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        selectedNetwork?.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: selectedNetwork.image,
                                                            alt: "",
                                                            className: "w-5 h-5 object-contain"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/deposit/page.tsx",
                                                            lineNumber: 1344,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `font-semibold ${theme.colors.text}`,
                                                            children: selectedNetwork?.public_name || selectedNetwork?.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/deposit/page.tsx",
                                                            lineNumber: 1346,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1342,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1340,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `${theme.colors.d_text} opacity-60 text-sm`,
                                                    children: "Téléphone"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1352,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `font-semibold ${theme.colors.text}`,
                                                    children: formatPhoneWithCountryCode(selectedPhone?.phone || '')
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1353,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1351,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1318,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1308,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: `text-xs text-center ${theme.colors.d_text} opacity-50 px-6 leading-relaxed`,
                            children: "En confirmant, vous acceptez d'initier cette transaction sur le numéro indiqué."
                        }, void 0, false, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1359,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-3 pt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSubmit,
                                    disabled: loading,
                                    className: "w-full h-14 bg-[#002d72] hover:bg-[#001d4a] text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2",
                                    style: {
                                        backgroundColor: theme.mode === 'dark' ? theme.colors.primary : '#002d72'
                                    },
                                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1373,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Traitement..."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1374,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Confirmer le dépôt"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1377,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1365,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setCurrentStep('enterDetails'),
                                    disabled: loading,
                                    className: `w-full py-3 text-center font-bold text-sm ${theme.colors.d_text} opacity-50 hover:opacity-100 transition-opacity`,
                                    children: "Modifier les informations"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1381,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1364,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/deposit/page.tsx",
                    lineNumber: 1301,
                    columnNumber: 11
                }, this);
        }
    };
    // Helper to get country flag based on indication
    const getCountryFlag = (indication)=>{
        if (!indication) return '🇧🇫'; // Default
        const cleanIndication = indication.replace('+', '');
        switch(cleanIndication){
            case '226':
                return '🇧🇫'; // Burkina Faso
            case '225':
                return '🇨🇮'; // Cote d'Ivoire
            case '223':
                return '🇲🇱'; // Mali
            case '221':
                return '🇸🇳'; // Senegal
            case '228':
                return '🇹🇬'; // Togo
            case '229':
                return '🇧🇯'; // Benin
            case '237':
                return '🇨🇲'; // Cameroon
            case '224':
                return '🇬🇳'; // Guinea
            case '241':
                return '🇬🇦'; // Gabon
            case '242':
                return '🇨🇬'; // Congo
            case '243':
                return '🇨🇩'; // DRC
            case '227':
                return '🇳🇪'; // Niger
            case '233':
                return '🇬🇭'; // Ghana
            case '234':
                return '🇳🇬'; // Nigeria
            default:
                return '🌍';
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
                return "Dépôt - Informations";
            case 'summary':
                return "Confirmer le dépôt";
            default:
                return "Dépôt";
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `min-h-screen bg-gradient-to-br ${theme.colors.a_background} p-4`,
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
                lineNumber: 1439,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full px-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-6 mb-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    if (currentStep === 'selectId') {
                                        router.back();
                                    } else if (currentStep === 'manageBetId') {
                                        setCurrentStep('selectId');
                                    } else if (currentStep === 'selectNetwork') {
                                        setCurrentStep('manageBetId');
                                    } else if (currentStep === 'selectPhone') {
                                        setCurrentStep('selectNetwork');
                                    } else if (currentStep === 'enterDetails') {
                                        setCurrentStep('selectPhone');
                                    } else if (currentStep === 'summary') {
                                        setCurrentStep('enterDetails');
                                    }
                                },
                                className: "p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    className: "h-8 w-8",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1517,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1516,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1498,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold tracking-tight",
                                children: getCurrentStepTitle()
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1520,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/deposit/page.tsx",
                        lineNumber: 1497,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pb-24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-6 p-4 bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-600/50 text-red-300 rounded-2xl backdrop-blur-sm",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                className: "w-5 h-5 mr-3"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1530,
                                                columnNumber: 19
                                            }, this),
                                            error
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1529,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1528,
                                    columnNumber: 15
                                }, this),
                                success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-6 p-4 bg-gradient-to-r from-green-900/50 to-green-800/50 border border-green-600/50 text-green-300 rounded-2xl backdrop-blur-sm",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                className: "w-5 h-5 mr-3"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1539,
                                                columnNumber: 19
                                            }, this),
                                            success
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1538,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1537,
                                    columnNumber: 15
                                }, this),
                                loading && !success && !error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-center items-center p-20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1548,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-500/20 animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1549,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1547,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1546,
                                    columnNumber: 15
                                }, this) : renderStep()
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/deposit/page.tsx",
                            lineNumber: 1525,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/deposit/page.tsx",
                        lineNumber: 1524,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/deposit/page.tsx",
                lineNumber: 1495,
                columnNumber: 7
            }, this),
            showPaymentModal && transactionLink && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-2xl flex items-center justify-center p-4 z-50 modal-backdrop",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${theme.colors.background} rounded-3xl shadow-2xl w-full max-w-sm modal-content overflow-hidden border border-white/20 dark:border-gray-800`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-8 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-10 h-10 text-blue-500",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: "2",
                                        d: "M13 10V3L4 14h7v7l9-11h-7z"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1569,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1568,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1567,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: `text-2xl font-bold mb-8 tracking-tight ${theme.colors.text}`,
                                children: "Paiement requis"
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1573,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: transactionLink,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        onClick: ()=>{
                                            setShowPaymentModal(false);
                                            setTimeout(()=>{
                                                if ("TURBOPACK compile-time truthy", 1) window.location.href = '/dashboard';
                                            }, 100);
                                        },
                                        className: "w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3 active:scale-[0.98]",
                                        children: [
                                            "Continuer le paiement",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-5 h-5",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: "2",
                                                    d: "M14 5l7 7m0 0l-7 7m7-7H3"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/deposit/page.tsx",
                                                    lineNumber: 1590,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1589,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1576,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setShowPaymentModal(false);
                                            if ("TURBOPACK compile-time truthy", 1) window.location.href = '/dashboard';
                                        },
                                        className: "w-full py-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium transition-colors",
                                        children: "Retour au tableau de bord"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1594,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1575,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/deposit/page.tsx",
                        lineNumber: 1566,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/deposit/page.tsx",
                    lineNumber: 1565,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/deposit/page.tsx",
                lineNumber: 1564,
                columnNumber: 9
            }, this),
            showEditPhoneModal && phoneToEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${theme.colors.background} rounded-lg shadow-xl w-full max-w-md modal-content`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold",
                                        children: t("Modifier le numéro de téléphone")
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1616,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setShowEditPhoneModal(false);
                                            setPhoneToEdit(null);
                                            setNewPhoneNumber('');
                                        },
                                        className: "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-6 h-6",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: "2",
                                                d: "M6 18L18 6M6 6l12 12"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/deposit/page.tsx",
                                                lineNumber: 1626,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1625,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1617,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1615,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
                                            children: t("Numéro de téléphone")
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1633,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "tel",
                                            value: newPhoneNumber,
                                            onChange: (e)=>setNewPhoneNumber(e.target.value),
                                            className: "w-full p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600",
                                            placeholder: "ex: 771234567"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1636,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-slate-500 dark:text-slate-400 mt-1",
                                            children: t("Entrez le numéro sans le préfixe +225")
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/deposit/page.tsx",
                                            lineNumber: 1643,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/deposit/page.tsx",
                                    lineNumber: 1632,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1631,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-6 flex justify-end gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setShowEditPhoneModal(false);
                                            setPhoneToEdit(null);
                                            setNewPhoneNumber('');
                                        },
                                        className: "px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200",
                                        children: t("Annuler")
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1650,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleEditPhone,
                                        disabled: !newPhoneNumber.trim(),
                                        className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50",
                                        children: t("Modifier")
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/deposit/page.tsx",
                                        lineNumber: 1660,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/deposit/page.tsx",
                                lineNumber: 1649,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/deposit/page.tsx",
                        lineNumber: 1614,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/deposit/page.tsx",
                    lineNumber: 1613,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/deposit/page.tsx",
                lineNumber: 1612,
                columnNumber: 11
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/deposit/page.tsx",
        lineNumber: 1438,
        columnNumber: 5
    }, this);
}
_s(Deposits, "/BogTZNto3QfSkkxofFVw1AzGs0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$WebSocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWebSocket"]
    ];
});
_c = Deposits;
var _c;
__turbopack_context__.k.register(_c, "Deposits");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_d63ad707._.js.map