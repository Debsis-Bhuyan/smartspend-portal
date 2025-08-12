import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationsPage = () => {
    const { notifications, loading, error, refresh } = useNotifications();
    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">All Notifications</h1>
                <button
                    onClick={refresh}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Refresh
                </button>
            </div>

            {loading && <p className="text-gray-600">Loading notifications...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            <ul className="space-y-4">
                {notifications.map((notification) => (
                    <li
                        key={notification.id}
                        className={`p-4 rounded shadow ${notification.read ? 'bg-white' : 'bg-yellow-100'
                            }`}
                    >
                        <div className="font-medium text-lg">{notification.title}</div>
                        <p className="text-gray-700">{notification.message}</p>
                        <p className="text-sm text-gray-400 mt-1">
                            {new Date(notification.timestamp).toLocaleString()}
                        </p>
                    </li>
                ))}
            </ul>

            {notifications.length === 0 && !loading && (
                <p className="text-gray-600 text-center mt-8">No notifications found.</p>
            )}
        </div>
    );
};

export default NotificationsPage;
