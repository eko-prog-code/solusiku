import React, { useState, useEffect, useContext } from 'react';
import { getAuth, signOut as firebaseSignOut } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { getDatabase } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import Status from '../components/CreateStatus';
import StatusCard from '../components/StatusCard';
import { UserContext } from '../context/UserContext'; 
import './Home.css';

const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [statuses, setStatuses] = useState([]);
    const auth = getAuth();
    const database = getDatabase();
    const navigate = useNavigate();
    const { userData } = useContext(UserContext);

    useEffect(() => {
        const statusesRef = ref(database, 'statuses');
        onValue(statusesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const statusesArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setStatuses(statusesArray.reverse());
            }
        });
    }, [database]);

    const handleCreateStatus = () => {
        if (!auth.currentUser) {
            navigate('/login');
        } else {
            setShowModal(true);
        }
    };

    const handleViewProfile = (userId) => {
        if (!auth.currentUser) {
            navigate('/login');
        } else {
            navigate(`/akun/${userId}`);
        }
    };

    const handleLogout = () => {
        firebaseSignOut(auth).then(() => {
            console.log('User signed out');
            navigate('/login'); // Redirect to login after sign out
        }).catch((error) => {
            console.error('Error during sign out:', error);
        });
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    return (
        <div>
            <div className="logout-icon-container">
                <img
                    src="https://firebasestorage.googleapis.com/v0/b/solusiku-2024.appspot.com/o/logout-icon.png?alt=media&token=2e8cfd42-e4db-45de-8488-b476086ab583"
                    alt="Logout Icon"
                    className="logout-icon"
                    onClick={handleLogout}
                />
            </div>

            <div className="centered-image-container">
                <img
                    src="https://firebasestorage.googleapis.com/v0/b/solusiku-2024.appspot.com/o/tanya-solusiku.png?alt=media&token=a27bff9b-8713-464e-8450-044790313125"
                    alt="Tanya SolusiKu"
                    className="centered-image"
                    onClick={handleCreateStatus} // Call function to handle status creation
                />
            </div>

            {auth.currentUser && (
                <div className="profile-header">
                    <h4>Hai {userData.name || 'User'}</h4>
                    <h4>Resolvist: Dedikasikan Ide Anda untuk Inovasi!</h4>
                </div>
            )}

            <Status userName={userData.name} /> 

            <div className="status-list">
                {statuses.length > 0 ? (
                    statuses.map(status => (
                        <StatusCard 
                            key={status.id} 
                            status={status} 
                            onViewProfile={() => handleViewProfile(status.userId)} // Pass handler function to StatusCard
                        />
                    ))
                ) : (
                    <p>No statuses available.</p>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={toggleModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={toggleModal}>Tutup</button>
                        <div>
                            <h1>SolusiKu</h1>
                            <p>Platform interaktif untuk mencari dan menerapkan solusi atas masalah sosial dan teknologi.</p>
                            <p>Pengguna SolusiKu adalah bagian dari profesi baru yang disebut <strong>Resolvist</strong>, para ahli yang berfokus pada mengidentifikasi dan memecahkan masalah dengan pendekatan inovatif dan teknologi.</p>
                            <p>Profesi ini disebut "Resolvist," berasal dari kata "resolve," yang berarti menyelesaikan atau memecahkan masalah. Akhiran "-ist" menambah kesan profesional, mirip dengan istilah seperti "artist" dan "scientist," yang menunjukkan keahlian dalam suatu bidang.</p>
                            <p>Para Resolvist tidak hanya mencari solusi, tetapi juga menciptakan perubahan nyata melalui event pitching dan penerapan teknologi mutakhir.</p>
                            <br />
                            <h3>Cara Kerja Resolvist</h3>
                            <p>Resolvist berperan dalam mengidentifikasi, menganalisis, dan memecahkan masalah sosial yang dihadapi masyarakat sehari-hari dengan menggunakan teknologi. Mereka mengumpulkan berbagai kasus masalah dari kehidupan nyata, media sosial, konten di YouTube, dan sumber berita. Setelah mengumpulkan data, Resolvist menampilkan masalah-masalah ini pada sebuah platform digital yang interaktif, yang memungkinkan masyarakat untuk mengenali, berinteraksi, dan mencari solusi bagi masalah yang relevan dengan kehidupan mereka.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
