import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { storage } from '../firebase/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getDatabase, ref as databaseRef, get, set, push, onValue, remove } from 'firebase/database';
import './Akun.css';
import ReactPlayer from 'react-player';

const Akun = () => {
  const { userId } = useParams();
  const { user, setProfilePicUrl } = useContext(UserContext);
  const [userData, setUserData] = useState({});
  const [profilePicUrl, setProfilePicUrlState] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [portfolioData, setPortfolioData] = useState({
    coreProblem: '',
    solutionDescription: '',
    badges: '',
    testimonials: '',
    pitchingFee: '',
    openMeetingDate: '',
    youtubeTrailer: '',
    kategori: ''
  });
  const [submittedPortfolios, setSubmittedPortfolios] = useState([]);
  const [priceListImages, setPriceListImages] = useState([]);
  const [selectedPriceListFile, setSelectedPriceListFile] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);

  useEffect(() => {
    const fetchPriceListImages = async () => {
      try {
        const priceListsRef = databaseRef(getDatabase(), `priceLists/${userId}`);
        onValue(priceListsRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const urls = Object.values(data).map(item => item.url);
            setPriceListImages(urls);
          }
        });
      } catch (error) {
        console.error('Failed to fetch price list images:', error);
      }
    };

    if (userId) {
      fetchPriceListImages();
    }
  }, [userId]);

  useEffect(() => {
    const database = getDatabase();
    if (userId) {
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

      const fetchProfilePic = async () => {
        try {
          const profilePicRef = storageRef(storage, `profilePictures/${userId}`);
          try {
            const url = await getDownloadURL(profilePicRef);
            setProfilePicUrlState(url);
          } catch (urlError) {
            setProfilePicUrlState(''); // No profile picture available
          }
        } catch (error) {
          console.error('Failed to fetch profile picture:', error);
        }
      };

      fetchProfilePic();

      const portfolioRef = databaseRef(database, `portfolios/${userId}`);
      onValue(portfolioRef, (snapshot) => {
        if (snapshot.exists()) {
          const portfolios = Object.values(snapshot.val())
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sorting by timestamp
          setSubmittedPortfolios(portfolios);
        }
      });
    }
  }, [userId]);

  const handlePriceListFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedPriceListFile(e.target.files[0]);
    }
  };

  const handlePriceListUpload = () => {
    if (selectedPriceListFile && user) {
      const priceListRef = storageRef(storage, `priceLists/${userId}/${selectedPriceListFile.name}`);
      uploadBytes(priceListRef, selectedPriceListFile)
        .then(() => getDownloadURL(priceListRef))
        .then(async (url) => {
          setPriceListImages(prevImages => [...prevImages, url]);
          const database = getDatabase();
          const priceListDatabaseRef = databaseRef(database, `priceLists/${userId}`);
          await push(priceListDatabaseRef, { url: url, name: selectedPriceListFile.name });
          alert('Harga produk berhasil diunggah!');
        })
        .catch((error) => {
          console.error(error);
          alert('Gagal mengunggah harga produk.');
        });
    }
  };

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
          setProfilePicUrlState(url);
          if (user.uid === userId) {
            setProfilePicUrl(url);
          }
          alert('Foto profil berhasil diunggah!');
        })
        .catch((error) => {
          console.error(error);
          alert('Gagal mengunggah foto profil.');
        });
    }
  };

  const handleDeleteImage = async (url) => {
    console.log('Delete clicked for URL:', url);
    if (!user || user.uid !== userId) return;
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus gambar ini?');
    if (!confirmDelete) return;

    try {
      // Extract the image name from URL
      const imageName = url.split('/').pop();
      const storagePath = `priceLists/${userId}/${imageName}`;
      const imageRef = storageRef(storage, storagePath);

      // Remove from database
      const database = getDatabase();
      const priceListDatabaseRef = databaseRef(database, `priceLists/${userId}`);
      const snapshot = await get(priceListDatabaseRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        for (const [key, value] of Object.entries(data)) {
          if (value.url === url) {
            await remove(databaseRef(database, `priceLists/${userId}/${key}`));
            break;
          }
        }
      }

      // Remove from storage
      await deleteObject(imageRef);
      setPriceListImages(prevImages => prevImages.filter(imageUrl => imageUrl !== url));

      alert('Image successfully deleted.');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image.');
    }
  };


  const handleImageClick = (url) => {
    setZoomedImage(url);
  };


  const handlePortfolioFormChange = (e) => {
    const { name, value } = e.target;
    setPortfolioData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const formatPitchingFee = (value) => {
    value = value.replace(/\./g, '');
    if (!isNaN(value) && value.length > 3) {
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    return value;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'pitchingFee') {
      const formattedValue = formatPitchingFee(value);
      setPortfolioData(prevData => ({
        ...prevData,
        [name]: formattedValue
      }));
    }
  };

  const handlePortfolioSubmit = async (e) => {
    e.preventDefault();
    const database = getDatabase();
    const updatedPortfolioData = {
      ...portfolioData,
      userId: userId,
      userName: userData.name,
      userImage: profilePicUrl,
      timestamp: new Date().toISOString()
    };
    const portfolioRef = databaseRef(database, `portfolios/${userId}`);

    try {
      const newPortfolioRef = push(portfolioRef);
      await set(newPortfolioRef, updatedPortfolioData);
      alert('Portofolio Solusi berhasil disimpan!');
      setShowPortfolioForm(false);
    } catch (error) {
      console.error('Error saving portfolio:', error);
      alert('Gagal menyimpan portofolio solusi.');
    }
  };

  const handleShareClick = () => {
    const domain = "https://solusiku.vercel.app";
    const profileLink = `${domain}/akun/${userId}`;
    navigator.clipboard.writeText(profileLink)
      .then(() => {
        alert('Tautan profil berhasil disalin!');
      })
      .catch(() => {
        alert('Gagal menyalin tautan profil.');
      });
  };

  const formatDisplayFee = (fee) => {
    let value = fee.replace(/\./g, '');
    if (!isNaN(value) && value.length > 3) {
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    return value;
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
          <div className="share-icon" onClick={handleShareClick}>
            📤 Share Profile
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>

      {user && user.uid === userId && (
        <>
          <div className="separator-line"></div>
          <div className="professional-dashboard">
            <h3>Professional Dashboard</h3>
            <button onClick={() => setShowPortfolioForm(!showPortfolioForm)}>
              Portofolio Solusi
            </button>

            {showPortfolioForm && (
              <form onSubmit={handlePortfolioSubmit} className="portfolio-form">
                <label>
                  Core Problem (Link YouTube):
                  <input
                    type="text"
                    name="coreProblem"
                    value={portfolioData.coreProblem}
                    onChange={handlePortfolioFormChange}
                  />
                </label>
                <label>
                  Kategori:
                  <input
                    type="text"
                    name="kategori"
                    value={portfolioData.kategori}
                    onChange={handlePortfolioFormChange}
                  />
                </label>

                <label>
                  Masalah yang Diselesaikan:
                  <textarea
                    name="solutionDescription"
                    value={portfolioData.solutionDescription}
                    onChange={handlePortfolioFormChange}
                  />
                </label>
                <label>
                  Badge dan Pencapaian:
                  <textarea
                    name="badges"
                    value={portfolioData.badges}
                    onChange={handlePortfolioFormChange}
                  />
                </label>
                <label>
                  Testimoni Klien:
                  <textarea
                    name="testimonials"
                    value={portfolioData.testimonials}
                    onChange={handlePortfolioFormChange}
                  />
                </label>
                <label>
                  Pitching Fee:
                  <input
                    type="text"
                    name="pitchingFee"
                    value={portfolioData.pitchingFee}
                    onChange={handlePortfolioFormChange}
                    onBlur={handleBlur}
                  />
                </label>
                <label>
                  Date Open Meeting:
                  <input
                    type="text"
                    name="openMeetingDate"
                    value={portfolioData.openMeetingDate}
                    onChange={handlePortfolioFormChange}
                  />
                </label>
                <label>
                  Link YouTube Trailer:
                  <input
                    type="text"
                    name="youtubeTrailer"
                    value={portfolioData.youtubeTrailer}
                    onChange={handlePortfolioFormChange}
                  />
                </label>
                <button type="submit">Simpan Portofolio</button>
              </form>
            )}
          </div>
        </>
      )}

      <div className="unix-929-portfolio-container">
        <h3 className="unix-929-portfolio-title">Portofolio Solusi</h3>
        {submittedPortfolios.reverse().map((portfolio, index) => (
          <div key={index} className="unix-929-portfolio-card">
            <h4>Portofolio #{index + 1}</h4>
            <p className="unix-929-portfolio-text"><strong>Kategori:</strong> {portfolio.kategori}</p>
            <p className="unix-929-portfolio-text"><strong>Video Core Problem:</strong></p>
            {portfolio.coreProblem && (
              <div className="unix-929-portfolio-video">
                <ReactPlayer url={portfolio.coreProblem} controls={true} />
              </div>
            )}
            <p className="unix-929-portfolio-text"><strong>Masalah yang Diselesaikan:</strong> {portfolio.solutionDescription}</p>
            <p className="unix-929-portfolio-text"><strong>Trailer Video We have the solution to the problem:</strong></p>
            {portfolio.youtubeTrailer && (
              <div className="unix-929-portfolio-video">
                <ReactPlayer url={portfolio.youtubeTrailer} controls={true} />
              </div>
            )}
            <p className="unix-929-portfolio-text"><strong>Badge dan Pencapaian:</strong> {portfolio.badges}</p>
            <p className="unix-929-portfolio-text"><strong>Testimoni Klien:</strong> {portfolio.testimonials}</p>
            <p className="unix-929-portfolio-text"><strong>Pitching Fee:</strong> {formatDisplayFee(portfolio.pitchingFee)}</p>
            <p className="unix-929-portfolio-text"><strong>Date Open Meeting:</strong> {portfolio.openMeetingDate}</p>
          </div>
        ))}
      </div>
      <div className="price-list-section">
        <h3 className="price-list-title">Produk Price List</h3>
        {user && user.uid === userId && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handlePriceListFileChange}
            />
            <button onClick={handlePriceListUpload}>Upload Harga Produk</button>
          </>
        )}
        <div className="price-list-images">
          {priceListImages.slice().reverse().map((url, index) => (
            <div
              key={index}
              className="price-list-image-container"
              onClick={() => handleImageClick(url)}
            >
              {user && user.uid === userId && (
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent image click event from triggering
                    handleDeleteImage(url);
                  }}
                >
                  Delete
                </button>
              )}
              <img
                src={url}
                alt={`Product ${index + 1}`}
                className="price-list-image"
              />
            </div>
          ))}
        </div>



        {zoomedImage && (
          <div className="zoomed-image-overlay" onClick={() => setZoomedImage(null)}>
            <img src={zoomedImage} alt="Zoomed" className="zoomed-image" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Akun;