// src/components/NotificationModal.js
import React from 'react';

function NotificationModal({ onClose, onEnableNotifications }) {
  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2>Aktifkan Push Notifikasi</h2>
        <p>Apakah Anda ingin mengaktifkan push notifikasi agar tidak ketinggalan informasi penting?</p>
        <button onClick={onEnableNotifications}>Ya, Aktifkan</button>
        <button onClick={onClose}>Tidak, Terima Kasih</button>
      </div>
    </div>
  );
}

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    textAlign: 'center',
  },
};

export default NotificationModal;
