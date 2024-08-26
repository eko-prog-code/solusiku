import React from 'react';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import './Home.css'; // Tambahkan file CSS untuk styling

const Home = () => {
  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log('User signed out');
    });
  };

  return (
    <div className="home-container">
      <div className="header">
        {/* Konten header lain (seperti navbar) bisa ditempatkan di sini */}
      </div>
      
      <div className="logout-icon-container">
        <img 
          src="https://firebasestorage.googleapis.com/v0/b/solusiku-2024.appspot.com/o/logout-icon.png?alt=media&token=2e8cfd42-e4db-45de-8488-b476086ab583" 
          alt="Logout Icon" 
          className="logout-icon" 
          onClick={handleLogout} 
        />
      </div>
    </div>
  );
};

export default Home;
