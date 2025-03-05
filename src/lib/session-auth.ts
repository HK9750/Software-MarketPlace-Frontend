'use server';

import axiosInstance from '@/utils/axios';
import { cookies, headers } from 'next/headers';
import type { JWT } from 'next-auth/jwt';
import type { SessionUser } from '@/types/types';
import { getToken } from 'next-auth/jwt';

const GET_USER_PROFILE_URL = '/profile';

export const getSessionUser = async (): Promise<SessionUser> => {
    try {
        const response =
            await axiosInstance.get<SessionUser>(GET_USER_PROFILE_URL);
        return response.data;
    } catch (error: any) {
        console.error(
            `Axios error while fetching session user: ${error.message}`,
            error.response?.data
        );
        throw new Error(
            'Failed to retrieve session user. Please try again later.'
        );
    }
};

// DO NOT EXPOSE THIS TOKEN CLIENT SIDE.
// https://github.com/vercel/next.js/discussions/52006
export async function getSessionAccessToken(): Promise<JWT | null> {
    const req = {
        headers: Object.fromEntries(headers() as unknown as Headers),
        cookies: Object.fromEntries(
            (await cookies()).getAll().map((c) => [c.name, c.value])
        ),
    };

    // @ts-expect-error
    const session = await getToken({ req });
    // @ts-expect-error the types are wrong for some reason
    return session?.accessToken;
}
