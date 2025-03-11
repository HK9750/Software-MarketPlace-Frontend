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
    // Ensure cookies are set on mount
    useSetCookies();

    // Retrieve cookies and their loading state
    const {
        access_token,
        refresh_token,
        loading: cookiesLoading,
        error,
    } = useGetCookies();

    // Manage the fetched user profile and its loading state
    const [user, setUser] = useState<SessionUser | null>(null);
    const [userLoading, setUserLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;

        // Fetch the user profile only after cookies have loaded
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

    // Combined loading state: true if either cookie or user profile is still loading
    const combinedLoading = cookiesLoading || userLoading;

    // Function to re-fetch the user profile (e.g., after a cart update)
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
