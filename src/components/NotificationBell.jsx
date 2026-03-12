import { useState, useEffect, useRef } from 'react';
import axiosClient from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Poll for notifications every 30 seconds
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const fetchNotifications = () => {
        axiosClient.get('/notifications')
            .then(({ data }) => {
                setNotifications(data);
                setUnreadCount(data.length);
            })
            .catch(err => console.error("Error fetching notifications:", err));
    };

    const markAsRead = (id, link = null) => {
        axiosClient.post(`/notifications/${id}/read`)
            .then(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
                setUnreadCount(prev => Math.max(0, prev - 1));
                if (link) navigate(link);
            })
            .catch(err => console.error("Error marking as read:", err));
    };

    const markAllRead = () => {
        axiosClient.post('/notifications/read-all')
            .then(() => {
                setNotifications([]);
                setUnreadCount(0);
            })
            .catch(err => console.error("Error marking all read:", err));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
                    <div className="py-2">
                        <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <span className="text-sm font-semibold text-gray-700">Notifications</span>
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-64 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="px-4 py-6 text-center text-gray-500 text-sm">
                                    No new notifications
                                </div>
                            ) : (
                                notifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors"
                                        onClick={() => markAsRead(notification.id, notification.data.type === 'new_booking' ? '/rentals' : '/my-rentals')}
                                    >
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 pt-1">
                                                {notification.data.type === 'status_changed' && (
                                                    <span className="text-xl">
                                                        {notification.data.status === 'approved' ? '✅' :
                                                            notification.data.status === 'rejected' ? '❌' : 'ℹ️'}
                                                    </span>
                                                )}
                                                {notification.data.type === 'new_booking' && <span className="text-xl">🆕</span>}
                                                {notification.data.type === 'payment_submitted' && <span className="text-xl">💰</span>}
                                            </div>
                                            <div className="ml-3 w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {notification.data.message}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {new Date(notification.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
