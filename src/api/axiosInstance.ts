import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_CORE_URL;

const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    withCredentials: true,
});

export default axiosInstance;
