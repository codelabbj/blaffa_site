module.exports = [
"[project]/src/lib/push-notifications.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initializePushNotifications",
    ()=>initializePushNotifications
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$messaging$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/messaging/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.ts [app-ssr] (ecmascript)");
;
;
;
const firebaseConfig = {
    apiKey: "AIzaSyCpYf8cR98sJ9Vw12ARlXFUqJyy3PSI1Vg",
    authDomain: "betpay-509eb.firebaseapp.com",
    projectId: "betpay-509eb",
    storageBucket: "betpay-509eb.firebasestorage.app",
    messagingSenderId: "827338495555",
    appId: "1:827338495555:web:9949d7c2caffe2b599e6f6",
    vapidKey: "BFHKpREc3F52Eb4uBMUMmfuQQBj7yd_5IjXK248ZeVKO7axslH2S3s09DEo5r1zwQ3Apz4xZnNiyNBmx3vVNv38"
};
let isInitialized = false;
/**
 * Registry device on backend
 */ async function registerDeviceOnBackend(token, type) {
    try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            console.log('⚠️ [TEST LOG] No access token found, skipping backend registration');
            return;
        }
        console.log(`📱 [TEST LOG] Registering device on backend with token: ${token.substring(0, 10)}...`);
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`/blaffa/devices/`, {
            registration_id: token,
            type
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ [TEST LOG] Device registered successfully on backend');
    } catch (error) {
        console.error('❌ [TEST LOG] Error registering device on backend:', error);
    }
}
async function initializePushNotifications() {
    console.log('🚀 [TEST LOG] initializePushNotifications() called at:', new Date().toISOString());
    // Ne pas initialiser plusieurs fois
    if (isInitialized) {
        console.log('⚠️ [TEST LOG] Push notifications already initialized, skipping...');
        return;
    }
    console.log('🔍 [TEST LOG] Checking platform compatibility...');
    // Sur le web, on vérifie si le navigateur supporte les Service Workers et le Push
    if (("TURBOPACK compile-time value", "undefined") === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.log('❌ [TEST LOG] Push notifications not available on this browser - exiting');
        return;
    }
    //TURBOPACK unreachable
    ;
}
}),
];

//# sourceMappingURL=src_lib_push-notifications_ts_a5ecef4e._.js.map