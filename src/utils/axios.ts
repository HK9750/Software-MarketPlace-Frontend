import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: process.env.BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const access_token = Cookies.get('access_token');
        const refresh_token = Cookies.get('refresh_token');
        if (access_token && refresh_token) {
            if (config.headers) {
                config.headers.Authorization = `Bearer ${access_token}`;
                config.headers['X-Refresh-Token'] = refresh_token;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
