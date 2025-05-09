/* eslint-disable @typescript-eslint/no-explicit-any */
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

    const {
        access_token: cookieAccess,
        refresh_token: cookieRefresh,
        loading: cookiesLoading,
        error,
    } = useGetCookies();

    const [user, setUser] = useState<SessionUser | null | undefined>(undefined);
    const [userLoading, setUserLoading] = useState<boolean>(true);
    const [access_token, setAccessToken] = useState<string | null>(
        cookieAccess
    );
    const [refresh_token, setRefreshToken] = useState<string | null>(
        cookieRefresh
    );

    // Fetch user profile
    useEffect(() => {
        if (!access_token && !refresh_token) {
            setAccessToken(cookieAccess);
            setRefreshToken(cookieRefresh);
        }
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
                    if (isMounted) {
                        setUser(null);
                    }
                } finally {
                    if (isMounted) {
                        setUserLoading(false);
                    }
                }
            })();
        } else if (!cookiesLoading) {
            setUserLoading(false);
        }

        return () => {
            isMounted = false;
        };
    }, [
        cookiesLoading,
        access_token,
        refresh_token,
        error,
        cookieAccess,
        cookieRefresh,
    ]);

    const combinedLoading = cookiesLoading || userLoading;

    // Function to refetch profile on demand
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
                setUser(null);
            }
        }
    };

    // Retry fetch if user is null or undefined after initial load
    useEffect(() => {
        if (!userLoading && user == null) {
            const timer = setTimeout(() => {
                refetchUserProfile();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [userLoading, user]);

    return (
        <SessionProvider>
            <RootContext.Provider
                value={{
                    user,
                    setUser,
                    access_token,
                    refresh_token,
                    loading: combinedLoading,
                    setAccessToken,
                    setRefreshToken,
                    refetchUserProfile,
                }}
            >
                {children}
            </RootContext.Provider>
        </SessionProvider>
    );
};
