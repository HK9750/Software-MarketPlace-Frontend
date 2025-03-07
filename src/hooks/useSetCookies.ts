'use client';

import { useEffect } from 'react';
import { getSession } from 'next-auth/react';
import Cookies from 'js-cookie';

const useSetCookies = () => {
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const storeTokens = async () => {
            try {
                const session = await getSession();
                console.log('Session in useSetCookies:', session);

                let accessToken = session?.access_token;
                let refreshToken = session?.refresh_token;

                if (!accessToken || !refreshToken) {
                    console.warn(
                        'No tokens found in session, checking cookies.'
                    );
                    accessToken = Cookies.get('access_token');
                    refreshToken = Cookies.get('refresh_token');

                    if (!accessToken || !refreshToken) {
                        console.warn('No tokens found in session or cookies.');
                        return;
                    }
                }

                const response = await fetch('/api/auth/tokens', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    }),
                    signal,
                });

                if (!response.ok) {
                    throw new Error(
                        `Failed to store tokens: ${response.statusText}`
                    );
                }

                console.log('Tokens successfully stored.');
            } catch (err: unknown) {
                if (err instanceof DOMException && err.name === 'AbortError') {
                    console.log('Request aborted');
                    return;
                }
                console.error('Error storing tokens:', err);
            }
        };

        storeTokens();

        return () => controller.abort();
    }, []);
};

export default useSetCookies;
