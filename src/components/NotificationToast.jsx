import React, { useState, useEffect } from 'react';
import './NotificationToast.css';

const NotificationToast = ({ notification, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Auto-dismiss after 5 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    const getIcon = (type) => {
        switch (type) {
            case 'user_joined': return '👤';
            case 'verdict': return '⚖️';
            case 'achievement': return '🏆';
            default: return '🔔';
        }
    };

    return (
        <div className="notification-toast">
            <div className="notification-content">
                <div className="notification-icon">{getIcon(notification.type)}</div>
                <div className="notification-text">
                    <div className="notification-title">
                        {notification.type === 'user_joined' && 'New Participant'}
                        {notification.type === 'verdict' && 'Verdict Issued'}
                        {notification.type === 'achievement' && 'Achievement Unlocked!'}
                    </div>
                    <div className="notification-message">{notification.message}</div>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '18px' }}>
                    ✕
                </button>
            </div>
        </div>
    );
};

export default NotificationToast;
