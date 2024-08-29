import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref as databaseRef, onValue } from 'firebase/database';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm) {
      const database = getDatabase();
      const portfolioRef = databaseRef(database, 'portfolios');

      onValue(portfolioRef, (snapshot) => {
        if (snapshot.exists()) {
          const portfolios = snapshot.val();
          const results = [];

          // Iterate through each user's portfolio
          Object.keys(portfolios).forEach((userId) => {
            Object.values(portfolios[userId]).forEach((portfolio) => {
              // Check if kategori is defined and is a string before calling toLowerCase
              if (typeof portfolio.kategori === 'string' && portfolio.kategori.toLowerCase().includes(searchTerm.toLowerCase())) {
                results.push({
                  userId: userId,
                  userName: portfolio.userName,
                  userImage: portfolio.userImage,
                  category: portfolio.kategori, // Add category
                });
              } else if (typeof portfolio.kategori !== 'string') {
                console.error(`Invalid category value for user ${userId}:`, portfolio.kategori);
              }
            });
          });

          setFilteredResults(results);
        } else {
          setFilteredResults([]);
        }
      });
    } else {
      setFilteredResults([]);
    }
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleResultClick = (userId) => {
    navigate(`/akun/${userId}`);
  };

  return (
    <div style={{ padding: '20px' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#fff' }}>Search Akun profile & Portfolio Solusi</h3>
      <input
        type="text"
        placeholder="Cari berdasarkan kategori..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
          padding: '10px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          width: '100%',
          boxSizing: 'border-box',
          fontSize: '16px',
          color: '#fff', // Text color
        }}
      />
      <div style={{ marginTop: '20px' }}>
        {filteredResults.length > 0 ? (
          filteredResults.map((result, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px',
                cursor: 'pointer',
                border: '1px solid #ddd',
                padding: '10px',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
              }}
              onClick={() => handleResultClick(result.userId)}
            >
              <img 
                src={result.userImage} 
                alt={`${result.userName}'s profile`} 
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  marginRight: '10px',
                }} 
              />
              <div>
                <p style={{ margin: '0', fontWeight: 'bold' }}>{result.userName}</p>
                <p style={{ margin: '0', color: '#555' }}>{result.category}</p> {/* Display category */}
              </div>
            </div>
          ))
        ) : (
          <p style={{ fontStyle: 'italic', color: '#777' }}>Tidak ada hasil yang ditemukan.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
