'use client';

import { useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import axios from 'axios';
import { RootContext } from '@/lib/contexts/RootContext';
import { SessionUser } from '@/types/types';
import useSetCookies from '@/hooks/useSetCookies';
import { useGetCookies } from '@/hooks/useGetCookies';

const GET_USER_PROFILE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`;

type ProvidersProps = {
    children: React.ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
    useSetCookies();
    const { access_token, refresh_token, loading, error } = useGetCookies();
    const [user, setUser] = useState<SessionUser | null>(null);

    useEffect(() => {
        if (!loading && access_token && !error) {
            (async () => {
                try {
                    const response: any = await axios.get(
                        GET_USER_PROFILE_URL,
                        {
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                                'X-Refresh-Token': refresh_token || '',
                            },
                        }
                    );
                    setUser(response.data.user);
                } catch (err) {
                    console.error('Error fetching user profile:', err);
                }
            })();
        }
    }, [loading, access_token, refresh_token, error]);

    return (
        <SessionProvider>
            <RootContext.Provider value={{ user, access_token, refresh_token }}>
                {children}
            </RootContext.Provider>
        </SessionProvider>
    );
};
