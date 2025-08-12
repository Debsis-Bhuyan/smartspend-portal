import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '@/context/AuthContext';

export interface Notification {
    id: number;
    title: string;
    message: string;
    read: boolean;
    timestamp: string;
}

export const useNotifications = () => {
    const { getTokens } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);

        try {
            const { accessToken } = await getTokens(); // Get the access token
            if (!accessToken) {
                throw new Error('No access token found');
            }
            const res = await axiosInstance.get<Notification[]>('/notifications', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setNotifications(res.data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return { notifications, loading, error, refresh: fetchNotifications };
};
