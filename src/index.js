// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { requestFCMPermission, onFCMMessage } from './firebase/fcm';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>  {/* Bungkus App dengan BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// Mendaftarkan service worker
serviceWorker.register();

// Meminta izin FCM dan mendengarkan pesan masuk
requestFCMPermission();
onFCMMessage();
