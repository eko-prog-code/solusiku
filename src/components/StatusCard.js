import React from 'react';
import './StatusCard.css'
const StatusCard = ({ status, onViewProfile }) => {
    const { status: statusText, userName, createdAt, userId } = status;
    // Validasi dan format tanggal
    const date = createdAt ? new Date(createdAt).toLocaleString() : 'Tanggal tidak tersedia';

    return (
        <div className="status-card">
            <h3>{status.userName}</h3>
            <p>{status.status}</p>
            <small>Created At: {date}</small>
            <button onClick={onViewProfile}>View Profile</button>
        </div>
    );
};

export default StatusCard;


            