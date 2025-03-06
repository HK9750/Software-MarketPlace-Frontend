'use client';

import { signOut as nextSignOut } from 'next-auth/react';
import { useCallback } from 'react';

export const useSignOut = (callbackUrl: string) => {
    return useCallback(async () => {
        const endSessionUrl = `${process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL}/v2/logout?client_id=${process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}&returnTo=${callbackUrl}`;

        let response;

        try {
            response = await fetch(endSessionUrl, {
                method: 'GET',
                credentials: 'include',
                mode: 'no-cors',
            });
            await fetch('/api/auth/tokens', {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Error occurred in fetching senSessionUrl', error);
        }

        await nextSignOut({ callbackUrl });
        return response;
    }, [callbackUrl]);
};
