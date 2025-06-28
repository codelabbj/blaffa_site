(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/components/ThemeProvider.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ThemeProvider": (()=>ThemeProvider),
    "useTheme": (()=>useTheme)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
// Define your theme configurations
const themes = {
    light: {
        mode: 'light',
        colors: {
            primary: '#0070f3',
            secondary: '#0ea5e9',
            s_text: 'text-blue-600',
            d_text: 'text-slate-900',
            s_background: 'from-slate-100/80 to-slate-200/80',
            sl_background: 'bg-slate-100',
            c_background: 'bg-slate-100/50',
            a_background: 'from-slate-100 via-blue-100 to-slate-50',
            background: 'bg-slate-50',
            text: '#1f2937',
            accent: '#8b5cf6',
            hover: 'hover:bg-gray-100'
        },
        values: {
            borderRadius: '0.5rem',
            fontSizes: {
                small: '0.875rem',
                medium: '1rem',
                large: '1.25rem'
            },
            spacing: {
                small: '0.5rem',
                medium: '1rem',
                large: '2rem'
            }
        }
    },
    dark: {
        mode: 'dark',
        colors: {
            primary: '#3b82f6',
            secondary: '#0ea5e9',
            s_text: 'text-blue-300',
            d_text: 'text-slate-300',
            s_background: 'from-slate-800/80 to-slate-700/80',
            sl_background: 'bg-slate-900',
            c_background: 'bg-slate-800/50',
            a_background: 'from-slate-900 via-blue-900 to-slate-800',
            background: 'bg-slate-800',
            text: '#f9fafb',
            accent: '#a78bfa',
            hover: 'hover:bg-gray-700'
        },
        values: {
            borderRadius: '0.5rem',
            fontSizes: {
                small: '0.875rem',
                medium: '1rem',
                large: '1.25rem'
            },
            spacing: {
                small: '0.5rem',
                medium: '1rem',
                large: '2rem'
            }
        }
    }
};
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const ThemeProvider = ({ children })=>{
    _s();
    const [themeMode, setThemeMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('light');
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Set theme mode and save to localStorage
    const setTheme = (mode)=>{
        setThemeMode(mode);
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.setItem('theme', mode);
            applyTheme(mode);
        }
    };
    // Toggle between light and dark theme
    const toggleTheme = ()=>{
        setTheme(themeMode === 'light' ? 'dark' : 'light');
    };
    // Apply theme to document
    const applyTheme = (mode)=>{
        const root = document.documentElement;
        const currentTheme = themes[mode];
        // Apply color variables
        Object.entries(currentTheme.colors).forEach(([key, value])=>{
            if (typeof value === 'string' && value.startsWith('#')) {
                root.style.setProperty(`--color-${key}`, value);
            }
        });
        // Apply other theme values
        root.style.setProperty('--border-radius', currentTheme.values.borderRadius);
        // Apply font sizes
        Object.entries(currentTheme.values.fontSizes).forEach(([key, value])=>{
            root.style.setProperty(`--font-size-${key}`, value);
        });
        // Apply spacing
        Object.entries(currentTheme.values.spacing).forEach(([key, value])=>{
            root.style.setProperty(`--spacing-${key}`, value);
        });
        // Set data attribute for CSS selectors
        root.setAttribute('data-theme', mode);
    };
    // Initialize theme on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            // Check for saved theme preference or system preference
            const savedTheme = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('theme') : ("TURBOPACK unreachable", undefined);
            const prefersDark = "object" !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
            setThemeMode(initialTheme);
            applyTheme(initialTheme);
            setMounted(true);
            // Listen for system theme changes
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = {
                "ThemeProvider.useEffect.handleChange": (e)=>{
                    if (!localStorage.getItem('theme')) {
                        const newTheme = e.matches ? 'dark' : 'light';
                        setThemeMode(newTheme);
                        applyTheme(newTheme);
                    }
                }
            }["ThemeProvider.useEffect.handleChange"];
            mediaQuery.addEventListener('change', handleChange);
            return ({
                "ThemeProvider.useEffect": ()=>mediaQuery.removeEventListener('change', handleChange)
            })["ThemeProvider.useEffect"];
        }
    }["ThemeProvider.useEffect"], []);
    // Don't render theme-dependent content until we know the theme
    if (!mounted) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: {
            theme: themes[themeMode],
            setTheme,
            toggleTheme
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `${themeMode}-theme`,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/ThemeProvider.tsx",
            lineNumber: 260,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ThemeProvider.tsx",
        lineNumber: 259,
        columnNumber: 5
    }, this);
};
_s(ThemeProvider, "GCh6uYz1Z8MtGcaIiQeNyRK/0Lc=");
_c = ThemeProvider;
const useTheme = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
_s1(useTheme, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/context/WebSocketContext.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/contexts/WebSocketContext.tsx
__turbopack_context__.s({
    "WebSocketProvider": (()=>WebSocketProvider),
    "useWebSocket": (()=>useWebSocket)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const WebSocketContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const WebSocketProvider = ({ children })=>{
    _s();
    const ws = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const messageHandlers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const reconnectAttempts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const isConnected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // const reconnectTimeout = useRef<NodeJS.Timeout>();
    const reconnectTimeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const connect = ()=>{
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.log('No access token found, skipping WebSocket connection');
            return;
        }
        if (ws.current) {
            ws.current.close();
        }
        try {
            const wsUrl = `wss://api.blaffa.net/ws/socket?token=${encodeURIComponent(token)}`;
            ws.current = new WebSocket(wsUrl);
            ws.current.onopen = ()=>{
                console.log('WebSocket connected');
                isConnected.current = true;
                reconnectAttempts.current = 0;
            };
            ws.current.onmessage = (event)=>{
                try {
                    const data = JSON.parse(event.data);
                    console.log('WebSocket message received:', data);
                    // const normalizedData = {
                    //   ...data,
                    //   // If data has a data property, use that as the URL
                    //   ...(data.data && { url: data.data })
                    // };
                    messageHandlers.current.forEach((handler)=>handler(data));
                } catch (error) {
                    console.error('Error processing WebSocket message:', error);
                }
            };
            ws.current.onclose = ()=>{
                isConnected.current = false;
                console.log('WebSocket disconnected, attempting to reconnect...');
                const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
                reconnectAttempts.current++;
                reconnectTimeout.current = setTimeout(connect, delay);
            };
            ws.current.onerror = (error)=>{
                console.error('WebSocket error:', error);
            };
        } catch (error) {
            console.error('WebSocket connection error:', error);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WebSocketProvider.useEffect": ()=>{
            connect();
            return ({
                "WebSocketProvider.useEffect": ()=>{
                    if (ws.current) {
                        ws.current.close();
                    }
                    if (reconnectTimeout.current) {
                        clearTimeout(reconnectTimeout.current);
                    }
                }
            })["WebSocketProvider.useEffect"];
        }
    }["WebSocketProvider.useEffect"], []);
    const addMessageHandler = (handler)=>{
        messageHandlers.current.push(handler);
        return ()=>{
            messageHandlers.current = messageHandlers.current.filter((h)=>h !== handler);
        };
    };
    const sendMessage = (message)=>{
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not connected');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WebSocketContext.Provider, {
        value: {
            addMessageHandler,
            sendMessage,
            isConnected: isConnected.current
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/WebSocketContext.tsx",
        lineNumber: 105,
        columnNumber: 5
    }, this);
};
_s(WebSocketProvider, "VU1qDyR+6GKr6/oBfPmrYvBP728=");
_c = WebSocketProvider;
const useWebSocket = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(WebSocketContext);
    if (context === undefined) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};
_s1(useWebSocket, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "WebSocketProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/i18n.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "initializeI18n": (()=>initializeI18n)
});
(()=>{
    const e = new Error("Cannot find module 'i18next'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module 'react-i18next'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18next$2d$browser$2d$languagedetector$2f$dist$2f$esm$2f$i18nextBrowserLanguageDetector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/i18next-browser-languagedetector/dist/esm/i18nextBrowserLanguageDetector.js [app-client] (ecmascript)");
;
;
;
const resources = {
    en: {
        translation: {
            // General translations
            "Secure 256-bit SSL encryption": "Secure 256-bit SSL encryption",
            //Left side Content
            "Secure Global Payments": "Secure Global Payments",
            "Fast, secure transactions with real-time tracking": "Fast, secure transactions with real-time tracking",
            "Bank-level Security": "Bank-level Security",
            "Simple Payments": "Simple Payments",
            "Mobile Money": "Mobile Money",
            "Simple Payment": "Simple Payment",
            "Mobile Integration": "Mobile IIntegration",
            "Processing Time": "Processing Time",
            "24/7 Support": "24/7 Support",
            "Your trusted partner for secure transactions": "Your trusted partner for secure transactions",
            "Available": "Available",
            "Transaction Smoothness": "Transaction Smoothness",
            "© 2025 Blaffa. All rights reserved .": "© 2025 blaffa. All rights reserved .",
            // Dashboard Header translations
            "Welcome to our amazing platform": "Welcome to our amazing platform",
            "Discover incredible opportunities": "Discover incredible opportunities",
            "DEPOSIT": "DEPOSIT",
            "WITHDRAW": "WITHDRAW",
            "Transaction History": "Transaction History",
            "Hello": "Hello",
            "theme": "theme",
            // AuthForm translations
            "Welcome to Blaffa": "Welcome to Blaffa",
            "Login": "Login",
            "Register": "Register",
            "Full Name": "Full Name",
            "Enter your full name": "Enter your full name",
            "Email": "Email",
            "Enter your email address": "Enter your email address",
            "Phone": "Phone",
            "Enter your phone number": "Enter your phone number",
            "Email or Phone": "Email or Phone",
            "Enter your email or phone": "Enter your email or phone",
            "Password": "Password",
            "Enter your password": "Enter your password",
            "Confirm Password": "Confirm Password",
            "Confirm your password": "Confirm your password",
            "Forgot Password?": "Forgot Password?",
            "Sign In": "Sign In",
            "Invalid email or phone number": "Invalid email or phone number",
            "Invalid email address": "Invalid email address",
            "Invalid phone number": "Invalid phone number",
            "The password must include at least one uppercase letter, one lowercase letter, one digit, and be at least 6 characters long.": "The password must include at least one uppercase letter, one lowercase letter, one digit, and be at least 6 characters long.",
            "Passwords do not match": "Passwords do not match",
            "Login successful! Redirecting to your dashboard...": "Login successful! Redirecting to your dashboard...",
            "Registration successful! Please login.": "Registration successful! Please login.",
            "An unexpected error occurred.": "An unexpected error occurred.",
            "if you cant see it check your Junk folder as well": "if you cant see it check your Junk folder as well",
            "Log in": "Log in",
            "Verify Code": "Verify Code",
            "Confirm New Password": "Confirm New Password",
            "OTP verified successfully": "OTP verified successfully",
            "Create a new password for your account": "Create a new password for your account",
            "if you cant see it check your Junk older as well": "if you cant see it check your Junk older as well",
            "Forgot Password": "Forgot Password",
            "Enter Verification Code": "Enter Verification Code",
            "We sent a code to your email. Please enter it below.": "We sent a code to your email. Please enter it below.",
            "Enter your email to receive a verification code": "Enter your email to receive a verification code",
            "Send Verification Code": "Send Verification Code",
            "Back to Login": "Back to Login",
            "OTP has been sent to your email', 'if you cant see it check your Junk older as well": "OTP has been sent to your email', 'if you cant see it check your Junk older as well",
            // Profile Page translations
            "Profile": "Profile",
            "Edit your personal information here": "Edit your personal information here",
            "Loading profile...": "Loading profile...",
            "Personal Information": "Personal Information",
            "Danger Zone": "Danger Zone",
            "Back": "Back",
            "First Name": "First Name",
            "Last Name": "Last Name",
            "E-mail": "E-mail",
            "Mobile Number": "Mobile Number",
            "Update Details": "Update Details",
            "Reset Password": "Reset Password",
            "Add New Bet ID": "Add New Bet ID",
            "App Name": "App Name",
            "Select App": "Select App",
            "Saved Bet IDs": "Saved Bet IDs",
            "User Bet ID": "User Bet ID",
            "Enter your bet ID": "Enter your bet ID",
            "Add Bet ID": "Add Bet ID",
            "No bet IDs saved yet": "No bet IDs saved yet",
            "Note": "Note",
            "To update your password, enter the old password and the new one you want to use": "To update your password, enter the old password and the new one you want to use",
            "Old Password": "Old Password",
            "New Password": "New Password",
            "Details updated successfully!": "Details updated successfully!",
            "Failed to update details": "Failed to update details",
            "You must be logged in to update your details.": "You must be logged in to update your details.",
            "You must be logged in to change your password.": "You must be logged in to change your password.",
            "New password and confirm password do not match.": "New password and confirm password do not match.",
            "Password changed successfully!": "Password changed successfully!",
            "Failed to change password": "Failed to change password",
            "Delete My Account": "Delete My Account",
            "Delete Account": "Delete Account",
            "Delete Account Permanently": "Delete Account Permanently",
            "Are you sure you want to delete your account? This action cannot be undone.": "Are you sure you want to delete your account? This action cannot be undone.",
            "Account deleted successfully!": "Account deleted successfully!",
            "Warning": "Warning",
            "This action cannot be undone.": "This action cannot be undone.",
            "All your personal data will be permanently deleted.": "All your personal data will be permanently deleted.",
            "You will lose access to all your transactions and account history.": "You will lose access to all your transactions and account history.",
            "Type your email to confirm deletion": "Type your email to confirm deletion",
            "This action will permanently delete your account and all associated data. This cannot be undone.": "This action will permanently delete your account and all associated data. This cannot be undone.",
            "All account data will be immediately erased from our systems.": "All account data will be immediately erased from our systems.",
            "Use strong, unique passwords": "Use strong, unique passwords",
            "Update your password regularly": "Update your password regularly",
            "History": "History",
            "View All": "View All",
            "MY ID": "MY ID",
            // Transaction History translations
            "No transactions found": "No transactions found",
            "You haven't made any transactions yet.": "You haven't made any transactions yet.",
            "Loading transactions...": "Loading transactions...",
            "Failed to fetch transactions": "Failed to fetch transactions",
            "You must be logged in to view transactions.": "You must be logged in to view transactions.",
            "Failed to load transactions. Please try again.": "Failed to load transactions. Please try again.",
            "All": "All",
            "Deposits": "Deposits",
            "Withdraw": "Withdraw",
            "See more": "See more",
            "Transaction Details": "Transaction details",
            "Payment Method": "Payment Method",
            "For deposits": "For deposits",
            "Status": "Status",
            "Number": "Number",
            "Transaction Date": "Transaction Date",
            "Transaction ID": "Transaction ID",
            "Close": "Close",
            // Notification translations
            "Notifications": "Notifications",
            "No notifications found": "No notifications found",
            "Loading notifications...": "Loading notifications...",
            "Failed to fetch notifications": "Failed to fetch notifications",
            "You must be logged in to view notifications.": "You must be logged in to view notifications.",
            "Failed to load notifications. Please try again.": "Failed to load notifications. Please try again.",
            "Mark all as read": "Mark all as read",
            "Load more": "Load more",
            "Loading...": "Loading...",
            "Mark as read": "Mark as read",
            "Mark as unread": "Mark as unread",
            "Available Coupons": "Available Coupons",
            "No Coupons Available": "No Coupons Available",
            "Check back later!": "Check back later!",
            // Withdraw Page translations
            "Withdraw Funds": "Withdraw Funds",
            "Withdraw from your account": "Withdraw from your account",
            "Please fill in all fields": "Please fill in all fields",
            "Phone numbers do not match": "Phone numbers do not match",
            "Withdrawal request submitted successfully!": "Withdrawal request submitted successfully!",
            "Something went wrong. Please try again.": "Something went wrong. Please try again.",
            "Network error. Please check your connection and try again.": "Network error. Please check your connection and try again.",
            "Take Note": "Take Note",
            "The currency of your account must be in XOF": "The currency of your account must be in XOF",
            "CITY": "CITY",
            "STREET": "STREET",
            "ID": "ID",
            "Enter ID": "Enter ID",
            "Withdrawal Code": "Withdrawal Code",
            "Enter your withdrawal code": "Enter your withdrawal code",
            "Enter number": "Enter number",
            "Confirm Number": "Confirm Number",
            "Enter Confirm number": "Enter Confirm number",
            "Network": "Network",
            "Processing...": "Processing...",
            "Submit my request": "Submit my request",
            //Deposit Page translations
            "Deposit Funds": "Deposit Funds",
            "Select Network": "Select Network",
            "Select Bet ID": "Select Bet ID",
            "Enter Details": "Enter Details",
            "Select Your Betting Platform": "Select Your Betting Platform",
            "Back to Bet IDs": "Back to Bet IDs",
            "Phone Number": "Phone Number",
            "Submit": "Submit",
            "Click to continue payment": "Click to continue payment",
            "Make deposits to your account": "Make deposits to your account",
            "Make your deposits to your account here": "Make your deposits to your account here",
            "IMPORTANT": "IMPORTANT",
            "Your account currency must be in XOF.": "Your account currency must be in XOF.",
            "Enter your ID": "Enter your ID",
            "Enter or select your betting app ID": "Enter or select your betting app ID",
            "This is your 1xbet user ID": "This is your 1xbet user ID",
            "Enter your betting app ID or select from saved IDs.": "Enter your betting app ID or select from saved IDs.",
            "You are entering a new ID. Defaulting to 1xbet app.": "You are entering a new ID. Defaulting to 1xbet app.",
            "Saved IDs": "Saved IDs",
            "Selected App": "Select App id",
            "Betting App ID": "Betting App ID",
            "Unknown App": "Unknown ",
            "Amount": "Amount",
            "Enter deposit amount": "Enter deposit amount",
            "Selected Bet ID": "Selected Bet ID",
            "Enter your mobile money number": "Enter your mobile money number",
            "Your mobile money number": "Your mobile money number",
            "Please select a network": "Please select a network",
            "Proceed": "Proceed",
            "Deposit successful! Transaction ID:": "Deposit successful! Transaction ID:",
            "Failed to load necessary data. Please try again later.": "Failed to load necessary data. Please try again later.",
            "Error fetching data:": "Error fetching data:",
            "Error processing deposit:": "Error processing deposit:",
            "Failed to process deposit. Please try again.": "Failed to process deposit. Please try again.",
            "You must be logged in to access this feature.": "You must be logged in to access this feature.",
            // Modal and Bet ID management translations
            "Confirmer l'ID de pari": "Confirmer l'ID de pari",
            "Confirm Bet ID": "Confirm Bet ID",
            "Nom de l'utilisateur": "Nom de l'utilisateur",
            "User Name": "User Name",
            "ID de pari": "ID de pari",
            "Bet ID": "Bet ID",
            "Appareil": "Appareil",
            "Device": "Device",
            "Annuler": "Annuler",
            "Cancel": "Cancel",
            "Confirmer": "Confirmer",
            "Confirm": "Confirm",
            "ID de pari invalide": "ID de pari invalide",
            "Invalid Bet ID": "Invalid Bet ID",
            "L'ID de pari est invalide ou n'existe pas.": "L'ID de pari est invalide ou n'existe pas.",
            "Bet ID is invalid or does not exist.": "Bet ID is invalid or does not exist.",
            "Échec de la validation de l'ID de pari. Veuillez réessayer.": "Échec de la validation de l'ID de pari. Veuillez réessayer.",
            "Failed to validate Bet ID. Please try again.": "Failed to validate Bet ID. Please try again.",
            "ID de pari ajouté avec succès !": "ID de pari ajouté avec succès !",
            "Bet ID added successfully!": "Bet ID added successfully!",
            "Fermer": "Fermer",
            "Failed to add bet ID": "Failed to add bet ID",
            "Veuillez sélectionner une application et saisir un ID de pari.": "Veuillez sélectionner une application et saisir un ID de pari.",
            "Please select an app and enter a bet ID.": "Please select an app and enter a bet ID.",
            "Vous devez être connecté pour ajouter un ID de pari.": "Vous devez être connecté pour ajouter un ID de pari.",
            "You must be logged in to add a bet ID.": "You must be logged in to add a bet ID.",
            "No account was found with the ID {{betid}}. Make sure it is spelled correctly and try again.": "No account was found with the ID {{betid}}. Make sure it is spelled correctly and try again.",
            "Transaction initiated successfully!": "Transaction initiated successfully!"
        }
    },
    fr: {
        translation: {
            // General translations
            "Secure 256-bit SSL encryption": "Chiffrement SSL 256 bits sécurisé",
            //Left side Content
            "Secure Global Payments": "Paiements mondiaux sécurisés",
            "Fast, secure transactions with real-time tracking": "Transactions rapides et sécurisées avec suivi en temps réel",
            "Bank-level Security": "Sécurité de niveau bancaire",
            "Mobile Money": "Argent mobile",
            "Simple Payment": "Paiement simple",
            "Mobile Integration": "Intégration mobile",
            "Payments made easy": "Paiements faciles",
            "24/7 Support": "Support 24/7",
            "Available": "Disponible",
            "Transaction Smoothness": "Fluidité de la transaction",
            "Processing Time": "Temps de traitement",
            "© 2025 Blaffa. All rights reserved .": "© 2025 Blaffa. Tous droits réservés.",
            "theme": "thème",
            // Dashboard Header translations
            "DEPOSIT": "DÉPOSER",
            "WITHDRAW": "RETIRER",
            "Transaction History": "Historique des transactions",
            "Logout": "Déconnexion",
            "Hello": "Bonjour",
            "History": "Historique",
            "View All": "Voir tout",
            "MY ID": "MON ID",
            //Hero
            "Welcome to our amazing platform": "Bienvenue sur notre incroyable plateforme",
            "Discover incredible opportunities": "Découvrez des opportunités incroyables",
            // AuthForm translations
            "Welcome to Blaffa": "Bienvenue sur Blaffa",
            "Login": "Connexion",
            "Register": "Inscription",
            "Full Name": "Nom complet",
            "Enter your full name": "Entrez votre nom complet",
            "Email": "Email",
            "Enter your email address": "Entrez votre adresse email",
            "Phone": "Téléphone",
            "Enter your phone number": "Entrez votre numéro de téléphone",
            "Email or Phone": "Email ou Téléphone",
            "Enter your email or phone": "Entrez votre email ou téléphone",
            "Password": "Mot de passe",
            "Enter your password": "Entrez votre mot de passe",
            "Confirm Password": "Confirmez le mot de passe",
            "Confirm your password": "Confirmez votre mot de passe",
            "Forgot Password?": "Mot de passe oublié ?",
            "Sign In": "Se connecter",
            "Invalid email or phone number": "Email ou numéro de téléphone invalide",
            "Invalid email address": "Adresse email invalide",
            "Invalid phone number": "Numéro de téléphone invalide",
            "The password must include at least one uppercase letter, one lowercase letter, one digit, and be at least 6 characters long.": "Le mot de passe doit inclure au moins une lettre majuscule, une lettre minuscule, un chiffre et comporter au moins 6 caractères.",
            "Passwords do not match": "Les mots de passe ne correspondent pas",
            "Login successful! Redirecting to your dashboard...": "Connexion réussie ! Redirection vers votre tableau de bord...",
            "Registration successful! Please login.": "Inscription réussie ! Veuillez vous connecter.",
            "An unexpected error occurred.": "Une erreur inattendue s'est produite.",
            "if you cant see it check your Junk folder as well": "si vous ne le voyez pas, vérifiez également votre dossier indésirable",
            "Log in": "Se connecter",
            "Verify Code": "Vérifier le code",
            "Confirm New Password": "Confirmez le nouveau mot de passe",
            "OTP verified successfully": "OTP vérifié avec succès",
            "Create a new password for your account": "Créez un nouveau mot de passe pour votre compte",
            "if you cant see it check your Junk older as well": "si vous ne le voyez pas, vérifiez également votre dossier indésirable",
            "Forgot Password": "Mot de passe oublié",
            "Enter Verification Code": "Entrez le code de vérification",
            "We sent a code to your email. Please enter it below.": "Nous avons envoyé un code à votre email. Veuillez l'entrer ci-dessous.",
            "Enter your email to receive a verification code": "Entrez votre email pour recevoir un code de vérification",
            "Send Verification Code": "Envoyer le code de vérification",
            "Back to Login": "Retour à la connexion",
            "OTP has been sent to your email', 'if you cant see it check your Junk older as well": "OTP a été envoyé à votre email', 'si vous ne le voyez pas, vérifiez également votre dossier indésirable",
            // Profile Page translations
            "Profile": "Profil",
            "Edit your personal information here": "Modifiez vos informations personnelles ici",
            "Loading profile...": "Chargement du profil...",
            "Personal Information": "Informations personnelles",
            "Danger Zone": "Zone de danger",
            "Back": "Retour",
            "First Name": "Prénom",
            "Last Name": "Nom",
            "E-mail": "E-mail",
            "Mobile Number": "Numéro de téléphone",
            "Update Details": "Mettre à jour les informations",
            "Reset Password": "Réinitialiser le mot de passe",
            "Add New Bet ID": "Ajouter un nouvel identifiant de pari",
            "App Name": "Nom de l'application",
            "Select App": "Sélectionner l'application",
            "Saved Bet IDs": "Identifiants de pari enregistrés",
            "User Bet ID": "Identifiant de pari utilisateur",
            "Enter your bet ID": "Saisir votre identifiant de pari",
            "Add Bet ID": "Ajouter un identifiant de pari",
            "No bet IDs saved yet": "Aucun identifiant de pari enregistré pour le moment",
            "Note": "Remarque",
            "To update your password, enter the old password and the new one you want to use": "Pour mettre à jour votre mot de passe, entrez l'ancien mot de passe et le nouveau que vous souhaitez utiliser",
            "Old Password": "Ancien mot de passe",
            "New Password": "Nouveau mot de passe",
            "Details updated successfully!": "Informations mises à jour avec succès !",
            "Failed to update details": "Échec de la mise à jour des informations",
            "You must be logged in to update your details.": "Vous devez être connecté pour mettre à jour vos informations.",
            "You must be logged in to change your password.": "Vous devez être connecté pour changer votre mot de passe.",
            "New password and confirm password do not match.": "Le nouveau mot de passe et la confirmation ne correspondent pas.",
            "Password changed successfully!": "Mot de passe changé avec succès !",
            "Failed to change password": "Échec du changement de mot de passe",
            "Delete My Account": "Supprimer mon compte",
            "Delete Account": "Supprimer compte",
            "Are you sure you want to delete your account? This action cannot be undone.": "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action ne peut pas être annulée.",
            "Account deleted successfully!": "Compte supprimé avec succès !",
            "Warning": "Avertissement",
            "This action cannot be undone.": "Cette action ne peut pas être annulée.",
            "Failed to delete account": "Échec de la suppression du compte",
            "You must be logged in to delete your account.": "Vous devez être connecté pour supprimer votre compte.",
            "You must be logged in to view your account details.": "Vous devez être connecté pour voir les détails de votre compte.",
            "All your personal data will be permanently deleted.": "Toutes vos données personnelles seront définitivement supprimées.",
            "You will lose access to all your transactions and account history.": "Vous perdrez l'accès à toutes vos transactions et à l'historique de votre compte.",
            "Type your email to confirm deletion": "Tapez votre email pour confirmer la suppression",
            "This action will permanently delete your account and all associated data. This cannot be undone.": "Cette action supprimera définitivement votre compte et toutes les données associées. Cela ne peut pas être annulé.",
            "All account data will be immediately erased from our systems.": "Toutes les données du compte seront immédiatement effacées de nos systèmes.",
            "Are you sure you want to delete your account?": "Êtes-vous sûr de vouloir supprimer votre compte ?",
            "Use strong, unique passwords": "Utilisez des mots de passe forts et uniques",
            "Update your password regularly": "Mettez à jour votre mot de passe régulièrement",
            "Your password has been reset successfully!": "Votre mot de passe a été réinitialisé avec succès !",
            "Your password has been updated successfully!": "Votre mot de passe a été mis à jour avec succès !",
            "Your password has been updated successfully.": "Votre mot de passe a été mis à jour avec succès.",
            "Check back later!": "Revoyez plus tard !",
            "No Coupons Available": "Aucun coupon disponible",
            "Available Coupons": "Coupons disponibles",
            // Transaction History translations
            "No transactions found": "Aucune transaction trouvée",
            "You haven't made any transactions yet.": "Vous n'avez pas encore fait de transactions.",
            "Loading transactions...": "Chargement des transactions...",
            "Failed to fetch transactions": "Échec de la récupération des transactions",
            "You must be logged in to view transactions.": "Vous devez être connecté pour voir les transactions.",
            "Failed to load transactions. Please try again.": "Échec du chargement des transactions. Veuillez réessayer.",
            "All": "Tous",
            "Deposit": "Dépôt",
            "Withdraw": "Retrait",
            "See more": "Voir plus",
            "Transaction Details": "Détails de la transaction",
            "Payment Method": "Méthode de paiement",
            "For deposits": "Pour les dépôts",
            "Status": "Statut",
            "Number": "Numéro",
            "Transaction Date": "Date de la transaction",
            "Transaction ID": "ID de la transaction",
            "Close": "Fermer",
            // Notification translations
            "Notifications": "Notifications",
            "No notifications found": "Aucune notification trouvée",
            "Loading notifications...": "Chargement des notifications...",
            "Failed to fetch notifications": "Échec de la récupération des notifications",
            "You must be logged in to view notifications.": "Vous devez être connecté pour voir les notifications.",
            "Failed to load notifications. Please try again.": "Échec du chargement des notifications. Veuillez réessayer.",
            "Mark all as read": "Tout marquer comme lu",
            "Load more": "Charger plus",
            "Loading...": "Chargement...",
            "Mark as read": "Marquer comme lu",
            "Mark as unread": "Marquer comme non lu",
            // Withdraw Page translations
            "Phone Number": "Numéro de téléphone",
            "Withdraw from your account": "Retirer de votre compte",
            "Please fill in all fields": "Veuillez remplir tous les champs",
            "Phone numbers do not match": "Les numéros de téléphone ne correspondent pas",
            "Withdrawal request submitted successfully!": "Demande de retrait soumise avec succès !",
            "Something went wrong. Please try again.": "Une erreur s'est produite. Veuillez réessayer.",
            "Network error. Please check your connection and try again.": "Erreur réseau. Veuillez vérifier votre connexion et réessayer.",
            "Take Note": "Prenez note",
            "The currency of your account must be in XOF": "La devise de votre compte doit être en XOF",
            "CITY": "VILLE",
            "STREET": "RUE",
            "ID": "ID",
            "Enter ID": "Entrez l'ID",
            "Withdrawal Code": "Code de retrait",
            "Enter your withdrawal code": "Entrez votre code de retrait",
            "Enter number": "Entrez le numéro",
            "Confirm Number": "Confirmez le numéro",
            "Enter Confirm number": "Entrez le numéro de confirmation",
            "Network": "Réseau",
            "Processing...": "Traitement...",
            "Submit my request": "Soumettre ma demande",
            "Withdraw Funds": "Retirer des fonds",
            // Deposit Page translations
            "Deposit Funds": "Déposer des fonds",
            "Select Bet ID": "Sélectionnez l'ID de pari",
            "Enter Details": "Entrez les détails",
            "Select Network": "Sélectionnez le réseau",
            "Select Your Betting Platform": "Sélectionnez votre plateforme de paris",
            "Back to Bet IDs": "Retour aux ID de pari",
            "Selected Bet ID": "ID de pari sélectionné",
            "Submit": "Soumettre",
            "Deposit to your account": "Déposez sur votre compte",
            "Deposit to your account here": "Déposez sur votre compte ici",
            "Click to continue payment": "Cliquez pour continuer le paiement",
            "Make deposits to your account": "Effectuez des dépôts sur votre compte",
            "Make your deposits to your account here": "Effectuez vos dépôts sur votre compte ici",
            "IMPORTANT": "IMPORTANT",
            "Your account currency must be in XOF.": "La devise de votre compte doit être en XOF.",
            "Enter your 1xbet user ID": "Entrez votre ID utilisateur 1xbet",
            "Enter your ID": "Entrez votre ID",
            "Enter or select your betting app ID": "Entrez ou sélectionnez votre ID de l'application de paris",
            "Enter your betting app ID or select from saved IDs.": " Entrez votre ID de l'application de paris ou sélectionnez-en un enregistré.",
            "Selected App": "Sélectionnez l'ID",
            "Saved IDs": "IDs enregistrés",
            "Unknown App": "Appareil inconnu",
            "This is your 1xbet user ID": "Ceci est votre ID utilisateur 1xbet",
            "Amount": "Montant",
            "Enter deposit amount": "Entrez le montant du dépôt",
            "Enter your mobile money number": "Entrez votre numéro de mobile money",
            "Your mobile money number": "Votre numéro de mobile money",
            "Please select a network": "Veuillez sélectionner un réseau",
            "Proceed": "Procéder",
            "Deposit successful! Transaction ID:": "Dépôt réussi ! ID de transaction :",
            "Failed to load necessary data. Please try again later.": "Échec du chargement des données nécessaires. Veuillez réessayer plus tard.",
            "Error fetching data:": "Erreur lors de la récupération des données :",
            "Error processing deposit:": "Erreur lors du traitement du dépôt :",
            "Failed to process deposit. Please try again.": "Échec du traitement du dépôt. Veuillez réessayer.",
            "You must be logged in to access this feature.": "Vous devez être connecté pour accéder à cette fonctionnalité.",
            // Modal and Bet ID management translations
            "Confirmer l'ID de pari": "Confirmer l'ID de pari",
            "Confirm Bet ID": "Confirm Bet ID",
            "Nom de l'utilisateur": "Nom de l'utilisateur",
            "User Name": "User Name",
            "ID de pari": "ID de pari",
            "Bet ID": "Bet ID",
            "Appareil": "Appareil",
            "Device": "Device",
            "Annuler": "Annuler",
            "Cancel": "Cancel",
            "Confirmer": "Confirmer",
            "Confirm": "Confirm",
            "ID de pari invalide": "ID de pari invalide",
            "Invalid Bet ID": "Invalid Bet ID",
            "L'ID de pari est invalide ou n'existe pas.": "L'ID de pari est invalide ou n'existe pas.",
            "Bet ID is invalid or does not exist.": "Bet ID is invalid or does not exist.",
            "Échec de la validation de l'ID de pari. Veuillez réessayer.": "Échec de la validation de l'ID de pari. Veuillez réessayer.",
            "Failed to validate Bet ID. Please try again.": "Failed to validate Bet ID. Please try again.",
            "ID de pari ajouté avec succès !": "ID de pari ajouté avec succès !",
            "Bet ID added successfully!": "Bet ID added successfully!",
            "Fermer": "Fermer",
            "Failed to add bet ID": "Échec de l'ajout de l'ID de pari",
            "Veuillez sélectionner une application et saisir un ID de pari.": "Veuillez sélectionner une application et saisir un ID de pari.",
            "Please select an app and enter a bet ID.": "Please select an app and enter a bet ID.",
            "Vous devez être connecté pour ajouter un ID de pari.": "Vous devez être connecté pour ajouter un ID de pari.",
            "You must be logged in to add a bet ID.": "You must be logged in to add a bet ID.",
            "No account was found with the ID {{betid}}. Make sure it is spelled correctly and try again.": "Aucun compte n'a été trouvé avec l'ID {{betid}}. Vérifiez l'orthographe et réessayez.",
            "Transaction initiated successfully!": "Transaction initiée avec succès !"
        }
    }
};
const initializeI18n = ()=>{
    // Configuration for i18next
    const config = {
        resources,
        lng: 'fr',
        fallbackLng: 'fr',
        supportedLngs: [
            'fr',
            'en'
        ],
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: [
                'localStorage',
                'navigator'
            ],
            lookupLocalStorage: 'i18nextLng',
            caches: [
                'localStorage'
            ]
        }
    };
    i18n.use(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18next$2d$browser$2d$languagedetector$2f$dist$2f$esm$2f$i18nextBrowserLanguageDetector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]).use(initReactI18next).init(config);
    // .init({
    //   resources,
    //   fallbackLng: 'fr',
    //   supportedLngs: ['en', 'fr'],
    //   interpolation: {
    //     escapeValue: false,
    //   },
    //   detection: {
    //     order: ['localStorage', 'navigator'],
    //     lookupLocalStorage: 'i18nextLng',
    //     caches: ['localStorage'],
    //   },
    // });
    // Set default language if not set
    if ("TURBOPACK compile-time truthy", 1) {
        const savedLanguage = localStorage.getItem('i18nextLng');
        if (!savedLanguage) {
            i18n.changeLanguage('fr');
            localStorage.setItem('i18nextLng', 'fr');
        }
    }
    return i18n;
};
const __TURBOPACK__default__export__ = i18n;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/layout.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// 'use client';
// import React from 'react';
// import { ThemeProvider } from '../components/ThemeProvider';
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
//       <body className="antialiased">
//         <ThemeProvider>
//           <div className="min-h-screen">
//             <main>{children}</main>
//           </div>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }
__turbopack_context__.s({
    "default": (()=>RootLayout)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ThemeProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$WebSocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/WebSocketContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'react-i18next'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/i18n.ts [app-client] (ecmascript)");
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
// Initialize i18n
const i18n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeI18n"])();
function LayoutContent({ children }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LayoutContent.useEffect": ()=>{
            // Set language from localStorage or default to 'fr'
            const lang = localStorage.getItem('i18nextLng') || 'fr';
            i18n.changeLanguage(lang);
            // Update HTML lang attribute
            document.documentElement.lang = lang;
        }
    }["LayoutContent.useEffect"], [
        pathname,
        searchParams
    ]);
    //return <>{children}</>;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            children: children
        }, void 0, false, {
            fileName: "[project]/src/app/layout.tsx",
            lineNumber: 70,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/layout.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
_s(LayoutContent, "h6p6PpCFmP4Mu5bIMduBzSZThBE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = LayoutContent;
function RootLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: i18n.language,
        className: "overflow-x-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("head", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1.0"
                }, void 0, false, {
                    fileName: "[project]/src/app/layout.tsx",
                    lineNumber: 86,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/layout.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
                className: "antialiased overflow-x-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(I18nextProvider, {
                    i18n: i18n,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$WebSocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WebSocketProvider"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
                                fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: "Loading..."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/layout.tsx",
                                    lineNumber: 92,
                                    columnNumber: 33
                                }, void 0),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LayoutContent, {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-h-screen",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                                            children: children
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/layout.tsx",
                                            lineNumber: 95,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/layout.tsx",
                                        lineNumber: 94,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/layout.tsx",
                                    lineNumber: 93,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/layout.tsx",
                                lineNumber: 92,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/layout.tsx",
                            lineNumber: 91,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/layout.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/layout.tsx",
                    lineNumber: 89,
                    columnNumber: 7
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/layout.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/layout.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
_c1 = RootLayout;
var _c, _c1;
__turbopack_context__.k.register(_c, "LayoutContent");
__turbopack_context__.k.register(_c1, "RootLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return (type.displayName || "Context") + ".Provider";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, self, source, owner, props, debugStack, debugTask) {
        self = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== self ? self : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, source, self, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, self, source, getOwner(), maybeKey, debugStack, debugTask);
    }
    function validateChildKeys(node) {
        "object" === typeof node && null !== node && node.$$typeof === REACT_ELEMENT_TYPE && node._store && (node._store.validated = 1);
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler");
    Symbol.for("react.provider");
    var REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        "react-stack-bottom-frame": function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React["react-stack-bottom-frame"].bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren, source, self) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, source, self, trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
} else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}}),
"[project]/node_modules/i18next-browser-languagedetector/dist/esm/i18nextBrowserLanguageDetector.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Browser)
});
const { slice, forEach } = [];
function defaults(obj) {
    forEach.call(slice.call(arguments, 1), (source)=>{
        if (source) {
            for(const prop in source){
                if (obj[prop] === undefined) obj[prop] = source[prop];
            }
        }
    });
    return obj;
}
function hasXSS(input) {
    if (typeof input !== 'string') return false;
    // Common XSS attack patterns
    const xssPatterns = [
        /<\s*script.*?>/i,
        /<\s*\/\s*script\s*>/i,
        /<\s*img.*?on\w+\s*=/i,
        /<\s*\w+\s*on\w+\s*=.*?>/i,
        /javascript\s*:/i,
        /vbscript\s*:/i,
        /expression\s*\(/i,
        /eval\s*\(/i,
        /alert\s*\(/i,
        /document\.cookie/i,
        /document\.write\s*\(/i,
        /window\.location/i,
        /innerHTML/i
    ];
    return xssPatterns.some((pattern)=>pattern.test(input));
}
// eslint-disable-next-line no-control-regex
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
const serializeCookie = function(name, val) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
        path: '/'
    };
    const opt = options;
    const value = encodeURIComponent(val);
    let str = `${name}=${value}`;
    if (opt.maxAge > 0) {
        const maxAge = opt.maxAge - 0;
        if (Number.isNaN(maxAge)) throw new Error('maxAge should be a Number');
        str += `; Max-Age=${Math.floor(maxAge)}`;
    }
    if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain)) {
            throw new TypeError('option domain is invalid');
        }
        str += `; Domain=${opt.domain}`;
    }
    if (opt.path) {
        if (!fieldContentRegExp.test(opt.path)) {
            throw new TypeError('option path is invalid');
        }
        str += `; Path=${opt.path}`;
    }
    if (opt.expires) {
        if (typeof opt.expires.toUTCString !== 'function') {
            throw new TypeError('option expires is invalid');
        }
        str += `; Expires=${opt.expires.toUTCString()}`;
    }
    if (opt.httpOnly) str += '; HttpOnly';
    if (opt.secure) str += '; Secure';
    if (opt.sameSite) {
        const sameSite = typeof opt.sameSite === 'string' ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch(sameSite){
            case true:
                str += '; SameSite=Strict';
                break;
            case 'lax':
                str += '; SameSite=Lax';
                break;
            case 'strict':
                str += '; SameSite=Strict';
                break;
            case 'none':
                str += '; SameSite=None';
                break;
            default:
                throw new TypeError('option sameSite is invalid');
        }
    }
    if (opt.partitioned) str += '; Partitioned';
    return str;
};
const cookie = {
    create (name, value, minutes, domain) {
        let cookieOptions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
            path: '/',
            sameSite: 'strict'
        };
        if (minutes) {
            cookieOptions.expires = new Date();
            cookieOptions.expires.setTime(cookieOptions.expires.getTime() + minutes * 60 * 1000);
        }
        if (domain) cookieOptions.domain = domain;
        document.cookie = serializeCookie(name, encodeURIComponent(value), cookieOptions);
    },
    read (name) {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++){
            let c = ca[i];
            while(c.charAt(0) === ' ')c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    remove (name) {
        this.create(name, '', -1);
    }
};
var cookie$1 = {
    name: 'cookie',
    // Deconstruct the options object and extract the lookupCookie property
    lookup (_ref) {
        let { lookupCookie } = _ref;
        if (lookupCookie && typeof document !== 'undefined') {
            return cookie.read(lookupCookie) || undefined;
        }
        return undefined;
    },
    // Deconstruct the options object and extract the lookupCookie, cookieMinutes, cookieDomain, and cookieOptions properties
    cacheUserLanguage (lng, _ref2) {
        let { lookupCookie, cookieMinutes, cookieDomain, cookieOptions } = _ref2;
        if (lookupCookie && typeof document !== 'undefined') {
            cookie.create(lookupCookie, lng, cookieMinutes, cookieDomain, cookieOptions);
        }
    }
};
var querystring = {
    name: 'querystring',
    // Deconstruct the options object and extract the lookupQuerystring property
    lookup (_ref) {
        let { lookupQuerystring } = _ref;
        let found;
        if (typeof window !== 'undefined') {
            let { search } = window.location;
            if (!window.location.search && window.location.hash?.indexOf('?') > -1) {
                search = window.location.hash.substring(window.location.hash.indexOf('?'));
            }
            const query = search.substring(1);
            const params = query.split('&');
            for(let i = 0; i < params.length; i++){
                const pos = params[i].indexOf('=');
                if (pos > 0) {
                    const key = params[i].substring(0, pos);
                    if (key === lookupQuerystring) {
                        found = params[i].substring(pos + 1);
                    }
                }
            }
        }
        return found;
    }
};
let hasLocalStorageSupport = null;
const localStorageAvailable = ()=>{
    if (hasLocalStorageSupport !== null) return hasLocalStorageSupport;
    try {
        hasLocalStorageSupport = typeof window !== 'undefined' && window.localStorage !== null;
        if (!hasLocalStorageSupport) {
            return false;
        }
        const testKey = 'i18next.translate.boo';
        window.localStorage.setItem(testKey, 'foo');
        window.localStorage.removeItem(testKey);
    } catch (e) {
        hasLocalStorageSupport = false;
    }
    return hasLocalStorageSupport;
};
var localStorage = {
    name: 'localStorage',
    // Deconstruct the options object and extract the lookupLocalStorage property
    lookup (_ref) {
        let { lookupLocalStorage } = _ref;
        if (lookupLocalStorage && localStorageAvailable()) {
            return window.localStorage.getItem(lookupLocalStorage) || undefined; // Undefined ensures type consistency with the previous version of this function
        }
        return undefined;
    },
    // Deconstruct the options object and extract the lookupLocalStorage property
    cacheUserLanguage (lng, _ref2) {
        let { lookupLocalStorage } = _ref2;
        if (lookupLocalStorage && localStorageAvailable()) {
            window.localStorage.setItem(lookupLocalStorage, lng);
        }
    }
};
let hasSessionStorageSupport = null;
const sessionStorageAvailable = ()=>{
    if (hasSessionStorageSupport !== null) return hasSessionStorageSupport;
    try {
        hasSessionStorageSupport = typeof window !== 'undefined' && window.sessionStorage !== null;
        if (!hasSessionStorageSupport) {
            return false;
        }
        const testKey = 'i18next.translate.boo';
        window.sessionStorage.setItem(testKey, 'foo');
        window.sessionStorage.removeItem(testKey);
    } catch (e) {
        hasSessionStorageSupport = false;
    }
    return hasSessionStorageSupport;
};
var sessionStorage = {
    name: 'sessionStorage',
    lookup (_ref) {
        let { lookupSessionStorage } = _ref;
        if (lookupSessionStorage && sessionStorageAvailable()) {
            return window.sessionStorage.getItem(lookupSessionStorage) || undefined;
        }
        return undefined;
    },
    cacheUserLanguage (lng, _ref2) {
        let { lookupSessionStorage } = _ref2;
        if (lookupSessionStorage && sessionStorageAvailable()) {
            window.sessionStorage.setItem(lookupSessionStorage, lng);
        }
    }
};
var navigator$1 = {
    name: 'navigator',
    lookup (options) {
        const found = [];
        if (typeof navigator !== 'undefined') {
            const { languages, userLanguage, language } = navigator;
            if (languages) {
                // chrome only; not an array, so can't use .push.apply instead of iterating
                for(let i = 0; i < languages.length; i++){
                    found.push(languages[i]);
                }
            }
            if (userLanguage) {
                found.push(userLanguage);
            }
            if (language) {
                found.push(language);
            }
        }
        return found.length > 0 ? found : undefined;
    }
};
var htmlTag = {
    name: 'htmlTag',
    // Deconstruct the options object and extract the htmlTag property
    lookup (_ref) {
        let { htmlTag } = _ref;
        let found;
        const internalHtmlTag = htmlTag || (typeof document !== 'undefined' ? document.documentElement : null);
        if (internalHtmlTag && typeof internalHtmlTag.getAttribute === 'function') {
            found = internalHtmlTag.getAttribute('lang');
        }
        return found;
    }
};
var path = {
    name: 'path',
    // Deconstruct the options object and extract the lookupFromPathIndex property
    lookup (_ref) {
        let { lookupFromPathIndex } = _ref;
        if (typeof window === 'undefined') return undefined;
        const language = window.location.pathname.match(/\/([a-zA-Z-]*)/g);
        if (!Array.isArray(language)) return undefined;
        const index = typeof lookupFromPathIndex === 'number' ? lookupFromPathIndex : 0;
        return language[index]?.replace('/', '');
    }
};
var subdomain = {
    name: 'subdomain',
    lookup (_ref) {
        let { lookupFromSubdomainIndex } = _ref;
        // If given get the subdomain index else 1
        const internalLookupFromSubdomainIndex = typeof lookupFromSubdomainIndex === 'number' ? lookupFromSubdomainIndex + 1 : 1;
        // get all matches if window.location. is existing
        // first item of match is the match itself and the second is the first group match which should be the first subdomain match
        // is the hostname no public domain get the or option of localhost
        const language = typeof window !== 'undefined' && window.location?.hostname?.match(/^(\w{2,5})\.(([a-z0-9-]{1,63}\.[a-z]{2,6})|localhost)/i);
        // if there is no match (null) return undefined
        if (!language) return undefined;
        // return the given group match
        return language[internalLookupFromSubdomainIndex];
    }
};
// some environments, throws when accessing document.cookie
let canCookies = false;
try {
    // eslint-disable-next-line no-unused-expressions
    document.cookie;
    canCookies = true;
// eslint-disable-next-line no-empty
} catch (e) {}
const order = [
    'querystring',
    'cookie',
    'localStorage',
    'sessionStorage',
    'navigator',
    'htmlTag'
];
if (!canCookies) order.splice(1, 1);
const getDefaults = ()=>({
        order,
        lookupQuerystring: 'lng',
        lookupCookie: 'i18next',
        lookupLocalStorage: 'i18nextLng',
        lookupSessionStorage: 'i18nextLng',
        // cache user language
        caches: [
            'localStorage'
        ],
        excludeCacheFor: [
            'cimode'
        ],
        // cookieMinutes: 10,
        // cookieDomain: 'myDomain'
        convertDetectedLanguage: (l)=>l
    });
class Browser {
    constructor(services){
        let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        this.type = 'languageDetector';
        this.detectors = {};
        this.init(services, options);
    }
    init() {
        let services = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
            languageUtils: {}
        };
        let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        let i18nOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        this.services = services;
        this.options = defaults(options, this.options || {}, getDefaults());
        if (typeof this.options.convertDetectedLanguage === 'string' && this.options.convertDetectedLanguage.indexOf('15897') > -1) {
            this.options.convertDetectedLanguage = (l)=>l.replace('-', '_');
        }
        // backwards compatibility
        if (this.options.lookupFromUrlIndex) this.options.lookupFromPathIndex = this.options.lookupFromUrlIndex;
        this.i18nOptions = i18nOptions;
        this.addDetector(cookie$1);
        this.addDetector(querystring);
        this.addDetector(localStorage);
        this.addDetector(sessionStorage);
        this.addDetector(navigator$1);
        this.addDetector(htmlTag);
        this.addDetector(path);
        this.addDetector(subdomain);
    }
    addDetector(detector) {
        this.detectors[detector.name] = detector;
        return this;
    }
    detect() {
        let detectionOrder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.options.order;
        let detected = [];
        detectionOrder.forEach((detectorName)=>{
            if (this.detectors[detectorName]) {
                let lookup = this.detectors[detectorName].lookup(this.options);
                if (lookup && typeof lookup === 'string') lookup = [
                    lookup
                ];
                if (lookup) detected = detected.concat(lookup);
            }
        });
        detected = detected.filter((d)=>d !== undefined && d !== null && !hasXSS(d)).map((d)=>this.options.convertDetectedLanguage(d));
        if (this.services && this.services.languageUtils && this.services.languageUtils.getBestMatchFromCodes) return detected; // new i18next v19.5.0
        return detected.length > 0 ? detected[0] : null; // a little backward compatibility
    }
    cacheUserLanguage(lng) {
        let caches = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.options.caches;
        if (!caches) return;
        if (this.options.excludeCacheFor && this.options.excludeCacheFor.indexOf(lng) > -1) return;
        caches.forEach((cacheName)=>{
            if (this.detectors[cacheName]) this.detectors[cacheName].cacheUserLanguage(lng, this.options);
        });
    }
}
Browser.type = 'languageDetector';
;
}}),
}]);

//# sourceMappingURL=_8ea27987._.js.map