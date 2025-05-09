/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { SessionUser } from '@/types/types';
import axios from 'axios';

const GET_USER_PROFILE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile`;

/**
 * Fetches the user profile using the provided access token.
 * @param access_token The user's access token.
 * @returns The user profile or null if not found/unauthorized.
 */
export async function fetchUserProfile(
    access_token: string
): Promise<SessionUser | null> {
    try {
        const response = await axios.get<SessionUser>(GET_USER_PROFILE_URL, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            return null;
        } else {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }
}
