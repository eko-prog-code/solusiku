import React from 'react';
import { auth } from '../firebase/firebase';
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
            
            <div className="content">
                <h1>SolusiKu</h1>
                <p>Platform interaktif untuk mencari dan menerapkan solusi atas masalah sosial dan teknologi.</p>
                <p>Pengguna SolusiKu adalah bagian dari profesi baru yang disebut <strong>Resolvist</strong>, para ahli yang berfokus pada mengidentifikasi dan memecahkan masalah dengan pendekatan inovatif dan teknologi.</p>
                <p>Profesi ini disebut "Resolvist," berasal dari kata "resolve," yang berarti menyelesaikan atau memecahkan masalah. Akhiran "-ist" menambah kesan profesional, mirip dengan istilah seperti "artist" dan "scientist," yang menunjukkan keahlian dalam suatu bidang.</p>
                <p>Para Resolvist tidak hanya mencari solusi, tetapi juga menciptakan perubahan nyata melalui event pitching dan penerapan teknologi mutakhir.</p>
                <br/>
                <h2>Cara Kerja Resolvist</h2>
                <p>Resolvist berperan dalam mengidentifikasi, menganalisis, dan memecahkan masalah sosial yang dihadapi masyarakat sehari-hari dengan menggunakan teknologi. Mereka mengumpulkan berbagai kasus masalah dari kehidupan nyata, media sosial, konten di YouTube, dan sumber berita. Setelah mengumpulkan data, Resolvist menampilkan masalah-masalah ini pada sebuah platform digital yang interaktif, yang memungkinkan masyarakat untuk mengenali, berinteraksi, dan mencari solusi bagi masalah yang relevan dengan kehidupan mereka.</p>
            </div>
        </div>
    );
};

export default Home;
