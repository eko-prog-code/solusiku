// public/service-worker.js

importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyDdlwG8NuR3DsdS5jIB8WC1Ybm2Jugiluk",
    authDomain: "solusiku-2024.firebaseapp.com",
    databaseURL: "https://solusiku-2024-default-rtdb.firebaseio.com",
    projectId: "solusiku-2024",
    storageBucket: "solusiku-2024.appspot.com",
    messagingSenderId: "91927535904",
    appId: "1:91927535904:web:5ac48bc61e8b1d7450f745",
    measurementId: "G-BGTCMQQZDG"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification.title;
  const options = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(title, options);
});