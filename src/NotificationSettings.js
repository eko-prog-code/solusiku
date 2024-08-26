import React, { useEffect, useState } from 'react';
import { requestNotificationPermission, checkNotificationPermission, getNotificationPreference, setNotificationPreference } from './NotificationManager';

function NotificationSettings() {
    const [enabled, setEnabled] = useState(getNotificationPreference());
    const [status, setStatus] = useState(checkNotificationPermission());

    useEffect(() => {
        // Update status on component mount
        const currentStatus = checkNotificationPermission();
        setStatus(currentStatus);
        setEnabled(currentStatus === 'granted');
    }, []);

    const toggleNotifications = () => {
        if (status === 'denied') {
            alert('Please enable notifications in your browser settings.');
            return;
        }

        const newState = !enabled;
        setNotificationPreference(newState);
        setEnabled(newState);

        if (newState) {
            requestNotificationPermission().then(() => {
                const updatedStatus = checkNotificationPermission();
                setStatus(updatedStatus);
                setEnabled(updatedStatus === 'granted');
            }).catch((error) => {
                console.error('Error requesting notification permission:', error);
            });
        } else {
            setStatus('denied');
        }
    };

    return (
        <div>
            <h2>Notification Settings</h2>
            <label>
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={toggleNotifications}
                />
                Enable Notifications
            </label>
            <p>Status: {status === 'granted' ? 'Notifications Enabled' : 'Notifications Disabled'}</p>
        </div>
    );
}

export default NotificationSettings;
