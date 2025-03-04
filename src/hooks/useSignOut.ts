import { signOut as nextSignOut } from 'next-auth/react';
import { useCallback } from 'react';

export const NEXT_PUBLIC_AUTH0_CLIENT_ID = 'Rolh8o06mto17Sd70TCfvTM87DACF3n1';
export const NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL =
    'dev-zj0wxdh1ax1zcnh1.us.auth0.com';

export const useSignOut = (callbackUrl: string) => {
    return useCallback(async () => {
        const endSessionUrl = `${NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL}/v2/logout?client_id=${NEXT_PUBLIC_AUTH0_CLIENT_ID}&returnTo=${callbackUrl}`;

        let response;

        try {
            response = await fetch(endSessionUrl, {
                method: 'GET',
                credentials: 'include',
                mode: 'no-cors',
            });
        } catch (error) {
            console.error('Error occurred in fetching senSessionUrl', error);
        }

        await nextSignOut({ callbackUrl });
        return response;
    }, [callbackUrl]);
};
