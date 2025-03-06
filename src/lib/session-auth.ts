'use client';

import axios from 'axios';
import type { SessionUser } from '@/types/types';
import { getSession } from 'next-auth/react';

const GET_USER_PROFILE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`;

export const getSessionUser = async (): Promise<SessionUser | null> => {
    try {
        const session = await getSession();
        console.log('Session in getSessionUser:', session);
        const access_token = session?.access_token || null;
        const refresh_token = session?.refresh_token || null;
        const response = await axios.get<SessionUser>(GET_USER_PROFILE_URL, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'X-Refresh-Token': refresh_token,
            },
        });
        return response.data;
    } catch (error: any) {
        if (error.status === 401) {
            return null;
        } else {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }
};

// DO NOT EXPOSE THIS TOKEN CLIENT SIDE.
// // https://github.com/vercel/next.js/discussions/52006
// export async function getSessionTokens(): Promise<JWT | null> {
//     const req = {
//         headers: Object.fromEntries(headers() as unknown as Headers),
//         cookies: Object.fromEntries(
//             (await cookies()).getAll().map((c) => [c.name, c.value])
//         ),
//     };

//     // @ts-expect-error
//     const session = await getToken({ req });
//     return {
//         access_token: session?.accessToken as string | undefined,
//         refresh_tokken: session?.refreshToken,
//     };
// }
