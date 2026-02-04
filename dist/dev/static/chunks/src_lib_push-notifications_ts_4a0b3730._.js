(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/push-notifications.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initializePushNotifications",
    ()=>initializePushNotifications
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$messaging$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/messaging/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$messaging$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/messaging/dist/esm/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/axios.ts [app-client] (ecmascript)");
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
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`/blaffa/devices/`, {
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
    if (("TURBOPACK compile-time value", "object") === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.log('❌ [TEST LOG] Push notifications not available on this browser - exiting');
        return;
    }
    console.log(`✅ [TEST LOG] Initializing push notifications on web platform (loading from remote URL)`);
    console.log(`ℹ️ [TEST LOG] Navigator serviceWorker available: true`);
    try {
        // Vérifier d'abord l'état actuel des permissions
        console.log('🔐 [TEST LOG] Checking current push notification permissions...');
        let permStatus = Notification.permission;
        console.log('🔐 [TEST LOG] Current permission status:', permStatus);
        // Si la permission n'a pas encore été demandée (default), la demander
        if (permStatus === 'default') {
            console.log('📋 [TEST LOG] Requesting push notification permissions...');
            permStatus = await Notification.requestPermission();
            console.log('📋 [TEST LOG] Permission request result:', permStatus);
        } else if (permStatus === 'denied') {
            console.warn('🚫 [TEST LOG] Push notification permission denied by user. User can enable it in browser settings.');
            return;
        } else if (permStatus === 'granted') {
            console.log('✅ [TEST LOG] Push notification permission already granted');
        }
        // Vérifier si la permission a été accordée avant de continuer
        if (permStatus !== 'granted') {
            console.warn('🚫 [TEST LOG] Push notification permission not granted:', permStatus);
            return;
        }
        console.log('✅ [TEST LOG] Push notification permission granted, setting up Firebase Messaging...');
        // Initialiser Firebase (si pas déjà fait)
        const app = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApps"])().length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeApp"])(firebaseConfig) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApp"])();
        const messaging = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$messaging$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMessaging"])(app);
        // Sur Android avec Capacitor, on crée un canal. Sur le web, on simule l'initialisation du canal "blaffa"
        console.log('✅ [TEST LOG] High priority notification channel "blaffa" configured for web');
        console.log('👂 [TEST LOG] Adding push notification event listeners...');
        // Écouter les messages reçus au premier plan
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$messaging$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onMessage"])(messaging, (payload)=>{
            console.log('📨 [TEST LOG] Push notification received while app in foreground:', {
                title: payload.notification?.title,
                body: payload.notification?.body,
                data: payload.data,
                timestamp: new Date().toISOString()
            });
            // Afficher une notification locale via le Service Worker registration
            navigator.serviceWorker.ready.then((registration)=>{
                registration.showNotification(payload.notification?.title || 'Notification', {
                    body: payload.notification?.body || '',
                    icon: '/logo.png',
                    data: payload.data
                });
                console.log('✅ [TEST LOG] Local notification shown for foreground push notification');
            });
        });
        console.log('📝 [TEST LOG] Requesting FCM registration token...');
        const fcmToken = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$messaging$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getToken"])(messaging, {
            vapidKey: firebaseConfig.vapidKey
        });
        if (fcmToken) {
            console.log('🔔 [TEST LOG] Push registration success! Token received:', {
                token_preview: fcmToken.substring(0, 30) + '...',
                full_token_length: fcmToken.length,
                timestamp: new Date().toISOString()
            });
            console.log(`📱 [TEST LOG] Platform detected: web, preparing to send token to backend...`);
            await registerDeviceOnBackend(fcmToken, 'web');
        } else {
            console.warn('⚠️ [TEST LOG] No registration token received from FCM');
        }
        isInitialized = true;
        console.log('✅ [TEST LOG] Push notifications registration initiated successfully!');
    } catch (error) {
        console.error('Error initializing push notifications:', error);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_lib_push-notifications_ts_4a0b3730._.js.map