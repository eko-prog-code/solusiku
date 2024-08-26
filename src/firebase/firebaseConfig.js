// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getMessaging } from 'firebase/messaging';
import { getStorage } from 'firebase/storage';

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);
const messaging = getMessaging(app);

export { auth, database, storage, messaging };
