// Import scripts for Firebase
importScripts('https://www.gstatic.com/firebasejs/9.19.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.19.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyDdlwG8NuR3DsdS5jIB8WC1Ybm2Jugiluk",
    authDomain: "solusiku-2024.firebaseapp.com",
    databaseURL: "https://solusiku-2024-default-rtdb.firebaseio.com",
    projectId: "solusiku-2024",
    storageBucket: "solusiku-2024.appspot.com",
    messagingSenderId: "91927535904",
    appId: "1:91927535904:web:5ac48bc61e8b1d7450f745",
    measurementId: "G-BGTCMQQZDG"
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});