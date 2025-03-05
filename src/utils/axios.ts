import axios from 'axios';
import Cookies from 'js-cookie';
import cookie from 'cookie'; 

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        let access_token: string | undefined;
        let refresh_token: string | undefined;

        if (typeof window !== 'undefined') {
            access_token = Cookies.get('access_token');
            refresh_token = Cookies.get('refresh_token');
        } else {
            console.log('Server side request', config.headers);
            if (config.headers && config.headers.cookie) {
                const parsedCookies = cookie.parse(config.headers.cookie);
                access_token = parsedCookies.access_token;
                refresh_token = parsedCookies.refresh_token;
            }
        }

        if (access_token && refresh_token && config.headers) {
            config.headers.Authorization = `Bearer ${access_token}`;
            config.headers['X-Refresh-Token'] = refresh_token;
        }

        console.log('Access Token:', access_token, 'Refresh Token:', refresh_token);
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
