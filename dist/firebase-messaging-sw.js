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
//   apiKey: "AIzaSyCpYf8cR98sJ9Vw12ARlXFUqJyy3PSI1Vg",
//   authDomain: "betpay-509eb.firebaseapp.com",
//   projectId: "betpay-509eb",
//   storageBucket: "betpay-509eb.firebasestorage.app",
//   messagingSenderId: "827338495555",
//   appId: "1:827338495555:web:9949d7c2caffe2b599e6f6",
//   measurementId: "G-R4KR24GJJY"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
firebase.initializeApp({
  apiKey: "AIzaSyCpYf8cR98sJ9Vw12ARlXFUqJyy3PSI1Vg",
  authDomain: "betpay-509eb.firebaseapp.com",
  projectId: "betpay-509eb",
  storageBucket: "betpay-509eb.firebasestorage.app",
  messagingSenderId: "827338495555",
  appId: "1:827338495555:web:9949d7c2caffe2b599e6f6",
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