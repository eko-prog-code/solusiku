import { initializeApp } from "firebase/app";
import { getAuth, signOut as firebaseSignOut } from "firebase/auth"; // Tambahkan signOut
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

// Initialize Firebase Messaging
const messaging = getMessaging(app);

// Request FCM Token
export const requestForToken = () => {
  return getToken(messaging, { vapidKey: "BO2J09uLAZZxCI-JkUzse4IQM-aBQZUz4ITdz_NC7T1yksBdaH9YLoHRq5ha0ZhXOn7cB6X0SzqB4iyL90Fwtkg" })  // Replace with your VAPID key
    .then((currentToken) => {
      if (currentToken) {
        console.log('Current token for client: ', currentToken);
        // Here you can send the token to your server or save it to database
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
};

// Listen to messages when app is in the foreground
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { auth, database, storage, messaging, firebaseSignOut as signOut }; // Tambahkan signOut
