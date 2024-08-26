// src/NotificationManager.js
export function requestNotificationPermission() {
    if ('Notification' in window) {
        return Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
                setNotificationPreference(true);
            } else {
                console.log('Notification permission denied.');
                setNotificationPreference(false);
            }
            return permission; // Return the permission status
        }).catch(error => {
            console.error('Error requesting notification permission:', error);
        });
    } else {
        console.log('Notifications are not supported by this browser.');
        return Promise.reject('Notifications are not supported');
    }
}

export function checkNotificationPermission() {
    if ('Notification' in window) {
        return Notification.permission;
    } else {
        console.log('Notifications are not supported by this browser.');
        return 'denied'; // Default to 'denied' if notifications are not supported
    }
}

export function setNotificationPreference(preference) {
    localStorage.setItem('notificationsEnabled', preference);
}

export function getNotificationPreference() {
    return localStorage.getItem('notificationsEnabled') === 'true';
}
