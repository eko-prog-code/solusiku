import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';
import { requestForToken, onMessageListener } from './firebase/fcm';
import { Sheet } from 'react-modal-sheet';

function App() {
  const [notification, setNotification] = useState({ title: '', body: '' });
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    requestForToken();

    const unsubscribeMessageListener = onMessageListener().then(payload => {
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
    }).catch(err => console.log('failed: ', err));

    return () => unsubscribeMessageListener;
  }, []);

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/solusiku-2024.appspot.com/o/Solusiku.png?alt=media&token=95f2c609-3a2e-4281-90e1-28758cfa5f1d"
            alt="Solusiku Logo"
            className="navbar-logo"
          />
          <span className="navbar-text">Solusiku</span>
        </div>
        <div className="navbar-menu">
          <button onClick={() => setIsSheetOpen(true)}>Menu</button>
        </div>
      </nav>

      <Sheet 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)} 
        snapPoints={[450, 0]} // Menambahkan titik snap untuk sheet
        initialSnap={0} // Posisi awal sheet
      >
        <Sheet.Container>
          <Sheet.Header /> {/* Tambahkan header untuk drag handle */}
          <Sheet.Content>
            <button className="close-sheet-button" onClick={() => setIsSheetOpen(false)}>X</button>
            <div className="modal-card-container">
              <Link to="/" onClick={() => setIsSheetOpen(false)} className="modal-card">Home</Link>
              <Link to="/login" onClick={() => setIsSheetOpen(false)} className="modal-card">Login</Link>
              <Link to="/register" onClick={() => setIsSheetOpen(false)} className="modal-card">Register</Link>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onClick={() => setIsSheetOpen(false)} />
      </Sheet>

      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        {notification.title && (
          <div className="notification-popup">
            <h2>{notification.title}</h2>
            <p>{notification.body}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
