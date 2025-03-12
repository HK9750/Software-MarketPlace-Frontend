'use client';

import { useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import axios from 'axios';
import { RootContext } from '@/lib/contexts/RootContext';
import { SessionUser } from '@/types/types';
import useSetCookies from '@/hooks/useSetCookies';
import { useGetCookies } from '@/hooks/useGetCookies';
import { initSocket } from '@/lib/socket';

const GET_USER_PROFILE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`;

type ProvidersProps = {
    children: React.ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
    useSetCookies();

    const {
        access_token,
        refresh_token,
        loading: cookiesLoading,
        error,
    } = useGetCookies();

    const [user, setUser] = useState<SessionUser | null>(null);
    const [userLoading, setUserLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;

        if (!cookiesLoading && access_token && !error) {
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
                    if (isMounted) {
                        setUser(response.data.user);
                    }
                } catch (err) {
                    console.error('Error fetching user profile:', err);
                } finally {
                    if (isMounted) {
                        setUserLoading(false);
                    }
                }
            })();
        } else if (!cookiesLoading) {
            // No valid token or error exists so end loading
            setUserLoading(false);
        }

        return () => {
            isMounted = false;
        };
    }, [cookiesLoading, access_token, refresh_token, error]);

    useEffect(() => {
        const socket = initSocket();
        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });
    }, []);

    const combinedLoading = cookiesLoading || userLoading;

    const refetchUserProfile = async () => {
        if (!cookiesLoading && access_token && !error) {
            try {
                const response: any = await axios.get(GET_USER_PROFILE_URL, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        'X-Refresh-Token': refresh_token || '',
                    },
                });
                setUser(response.data.user);
            } catch (err) {
                console.error('Error re-fetching user profile:', err);
            }
        }
    };

    return (
        <SessionProvider>
            <RootContext.Provider
                value={{
                    user,
                    access_token,
                    refresh_token,
                    loading: combinedLoading,
                    refetchUserProfile,
                }}
            >
                {children}
            </RootContext.Provider>
        </SessionProvider>
    );
};
