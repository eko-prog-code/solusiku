importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js');

// Initialize Firebase
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

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
    try {
        console.log('Received background message ', payload);

        if (payload && payload.notification) {
            const notificationTitle = payload.notification.title || 'No Title';
            const notificationOptions = {
                body: payload.notification.body || 'No body content',
                icon: payload.notification.icon || '/firebase-logo.png'
            };

            self.registration.showNotification(notificationTitle, notificationOptions);
        } else {
            console.warn('Received payload does not contain notification data:', payload);
        }
    } catch (error) {
        console.error('Error handling background message: ', error);
    }
});

// Handle notification click events
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            if (clientList.length > 0) {
                let client = clientList[0];
                return client.focus();
            }
            return clients.openWindow('/');
        })
    );
});

// Log service worker lifecycle events
self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');

    const cacheAllowlist = ['your-cache-name'];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheAllowlist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    console.log('Fetching:', event.request.url);
});
