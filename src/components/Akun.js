import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { storage } from '../firebase/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as databaseRef, get } from 'firebase/database';
import { getDatabase } from 'firebase/database';
import './Akun.css';

const Akun = () => {
  const { userId } = useParams(); // Get userId from the route parameters
  const { user, setProfilePicUrl } = useContext(UserContext);
  const [userData, setUserData] = useState({});
  const [profilePicUrl, setProfilePicUrlState] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const database = getDatabase();
    if (userId) {
      // Fetch user data based on userId
      const userRef = databaseRef(database, `users/${userId}`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        } else {
          setError('User data not found');
        }
      }).catch((error) => {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data');
      });

      // Fetch profile picture
      const fetchProfilePic = async () => {
        try {
          const profilePicRef = storageRef(storage, `profilePictures/${userId}`);
          const url = await getDownloadURL(profilePicRef);
          setProfilePicUrlState(url);
        } catch (error) {
          console.error('Failed to fetch profile picture:', error);
        }
      };

      fetchProfilePic();
    }
  }, [userId]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile && user) {
      const profilePicRef = storageRef(storage, `profilePictures/${userId}`);
      uploadBytes(profilePicRef, selectedFile)
        .then(() => getDownloadURL(profilePicRef))
        .then((url) => {
          setProfilePicUrlState(url); // Update the profile picture URL
          if (user.uid === userId) {
            setProfilePicUrl(url); // Also update the context if the current user is viewing their own profile
          }
          alert('Foto profil berhasil diunggah!');
        })
        .catch((error) => {
          console.error(error);
          alert('Gagal mengunggah foto profil.');
        });
    }
  };

  return (
    <div className="akun-container">
      <div className="profile-header">
        <h2>Hai {userData.name || 'User'}</h2>
        <p>(Sedang Online)</p>
      </div>
      <div className="profile-info">
        <div className="profile-picture-container">
          {profilePicUrl ? (
            <img
              src={profilePicUrl}
              alt="Profile"
              className="profile-picture"
            />
          ) : (
            <div className="profile-picture-placeholder">Foto Profil</div>
          )}
        </div>
        {user && user.uid === userId && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <button onClick={handleUpload}>Upload Foto Profil</button>
          </>
        )}
        <div className="info">
          <p><strong>Email:</strong> {userData.email || 'N/A'}</p>
          <p><strong>No Telpon:</strong> {userData.phoneNumber || 'N/A'}</p>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Akun;
