import React, { useState, useContext } from 'react';
import { getDatabase, ref, push, set, serverTimestamp } from 'firebase/database';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const CreateStatus = ({ userName }) => {
    const [status, setStatus] = useState('');
    const { user } = useContext(UserContext);
    const database = getDatabase();
    const navigate = useNavigate();

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!user) {
            navigate('/login');
            return;
        }

        if (status.trim() === '') return;

        const statusRef = ref(database, 'statuses');
        const newStatusRef = push(statusRef);

        set(newStatusRef, {
            status: status,
            userId: user.uid,
            userName: userName || 'Anonymous',
            createdAt: serverTimestamp()
        }).then(() => {
            setStatus('');
            alert('Status updated successfully!');
        }).catch(error => {
            console.error('Failed to update status:', error);
        });
    };

    return (
        <div className="status-container">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Update your status..."
                    value={status}
                    onChange={handleStatusChange}
                    className="status-input"
                />
                <button type="submit" className="status-button">Update Status</button>
            </form>
        </div>
    );
};

export default CreateStatus;
