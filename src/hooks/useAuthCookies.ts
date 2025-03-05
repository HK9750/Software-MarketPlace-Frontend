import { useEffect } from 'react';
import { getSession } from 'next-auth/react';
import Cookies from 'js-cookie';

const useAuthCookies = () => {
    useEffect(() => {
        const storeTokens = async () => {
            const session = await getSession();
            console.log('Session in useAuthCookies:', session);
            if (session?.access_token && session?.refresh_token) {
                Cookies.set('access_token', session.access_token, {
                    secure: process.env.NODE_ENV === 'production',
                    httpOnly: false,
                });
                Cookies.set('refresh_token', session.refresh_token, {
                    secure: process.env.NODE_ENV === 'production',
                    httpOnly: false,
                });
            }
        };

        storeTokens();
    }, []);
};

export default useAuthCookies;
