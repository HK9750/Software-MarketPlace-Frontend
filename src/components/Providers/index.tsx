'use client';

import { useEffect, useState } from 'react';
import { SessionProvider, getSession } from 'next-auth/react';
import { RootContext } from '@/lib/Providers/RootContext';
import { SessionUser } from '@/types/types';
import axios from 'axios';
import useSetCookies from '@/hooks/useSetCookies';
import Cookies from 'js-cookie';

const GET_USER_PROFILE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`;

type ProvidersProps = {
    children: React.ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
    useSetCookies();
    const [user, setUser] = useState<SessionUser | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                let access_token = null;
                let refresh_token = null;
                const session = await getSession();
                console.log('Session in Providers:', session);
                if (session) {
                    access_token = session.access_token;
                    refresh_token = session.access_token;
                } else {
                    access_token = Cookies.get('access_token');
                    refresh_token = Cookies.get('refresh_token');
                }

                const response: any = await axios.get(GET_USER_PROFILE_URL, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        'X-Refresh-Token': refresh_token || '',
                    },
                });
                console.log('User profile:', response.data);

                setUser(response.data.user);
            } catch (error: any) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUser();
    }, []);

    return (
        <SessionProvider>
            <RootContext.Provider value={{ user }}>
                {children}
            </RootContext.Provider>
        </SessionProvider>
    );
};
