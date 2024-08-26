// src/firebase/fcm.js
import { messaging } from './firebaseConfig';
import { getToken, onMessage } from 'firebase/messaging';

export const requestFCMPermission = () => {
  return getToken(messaging, { vapidKey: 'BO2J09uLAZZxCI-JkUzse4IQM-aBQZUz4ITdz_NC7T1yksBdaH9YLoHRq5ha0ZhXOn7cB6X0SzqB4iyL90Fwtkg' })
    .then((currentToken) => {
      if (currentToken) {
        console.log('FCM token:', currentToken);
        // Kirim token ke server Anda atau simpan secara lokal
      } else {
        console.log('Tidak ada token registrasi yang tersedia.');
      }
    })
    .catch((err) => {
      console.error('Terjadi kesalahan saat mengambil token. ', err);
    });
};

export const onFCMMessage = () => {
  onMessage(messaging, (payload) => {
    console.log('Pesan diterima. ', payload);
    // Tampilkan notifikasi atau tangani pesan
  });
};
