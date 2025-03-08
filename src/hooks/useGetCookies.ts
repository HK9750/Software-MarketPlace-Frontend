'use client';

import { useEffect, useState } from 'react';

export const useGetCookies = () => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const getCookies = async () => {
            try {
                const response = await fetch('/api/auth/tokens', { signal });
                if (!response.ok) {
                    setAccessToken(null);
                    setRefreshToken(null);
                }
                const data = await response.json();
                setAccessToken(data.access_token);
                setRefreshToken(data.refresh_token);
            } catch (err: unknown) {
                if (err instanceof DOMException && err.name === 'AbortError') {
                    console.log('Request aborted');
                    return;
                }
                console.error('Error fetching tokens:', err);
                setError('Failed to fetch tokens.');
            } finally {
                setLoading(false);
            }
        };

        getCookies();

        return () => controller.abort();
    }, []);

    return {
        access_token: accessToken,
        refresh_token: refreshToken,
        loading,
        error,
    };
};
