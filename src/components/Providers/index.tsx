'use client';

import { useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import axios from 'axios';
import { RootContext } from '@/lib/Providers/RootContext';
import { SessionUser } from '@/types/types';
import useSetCookies from '@/hooks/useSetCookies';
import { useGetCookies } from '@/hooks/useGetCookies';

const GET_USER_PROFILE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`;

type ProvidersProps = {
    children: React.ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
    useSetCookies();
    const { accessToken, refreshToken, loading, error } = useGetCookies();
    const [user, setUser] = useState<SessionUser | null>(null);

    useEffect(() => {
        if (!loading && accessToken && !error) {
            (async () => {
                try {
                    const response: any = await axios.get(
                        GET_USER_PROFILE_URL,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                'X-Refresh-Token': refreshToken || '',
                            },
                        }
                    );
                    setUser(response.data.user);
                } catch (err) {
                    console.error('Error fetching user profile:', err);
                }
            })();
        }
    }, [loading, accessToken, refreshToken, error]);

    return (
        <SessionProvider>
            <RootContext.Provider value={{ user }}>
                {children}
            </RootContext.Provider>
        </SessionProvider>
    );
};
