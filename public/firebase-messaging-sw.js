// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing your app's Firebase config object
// Make sure these values match the ones in your NotificationBell component
// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const firebaseConfig = {
//   apiKey: "AIzaSyAy0fmT-yf9Hy1lqZwIKGO_yRjriZ_Oqo0",
//   authDomain: "yapson-2a432.firebaseapp.com",
//   projectId: "yapson-2a432",
//   storageBucket: "yapson-2a432.firebasestorage.app",
//   messagingSenderId: "261568619785",
//   appId: "1:261568619785:web:f8d634ab6ce9d54f4edfd8",
//   measurementId: "G-6G9LL7077L"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
firebase.initializeApp({
  apiKey: "AIzaSyAy0fmT-yf9Hy1lqZwIKGO_yRjriZ_Oqo0",
  authDomain: "yapson-2a432.firebaseapp.com",
  projectId: "yapson-2a432",
  storageBucket: "yapson-2a432.firebasestorage.app",
  messagingSenderId: "261568619785",
  appId: "1:261568619785:web:f8d634ab6ce9d54f4edfd8",
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// Optional: Add background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png' // Path to your app icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});