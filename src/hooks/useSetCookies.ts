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

                if (!session?.access_token || !session?.refresh_token) {
                    console.warn('No tokens found in session.');
                    return;
                }

                Cookies.set('access_token', session.access_token, {
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                });
                Cookies.set('refresh_token', session.refresh_token, {
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                });

                const response = await fetch('/api/auth/tokens', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        access_token: session.access_token,
                        refresh_token: session.refresh_token,
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
