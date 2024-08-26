import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import './App.css'; // Tambahkan file CSS untuk styling

function App() {
  useEffect(() => {
    // Anda dapat menambahkan logika untuk mengelola izin notifikasi di sini jika diperlukan
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
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register" className="register-link">Register</Link> 
        </div>
      </nav>

      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
