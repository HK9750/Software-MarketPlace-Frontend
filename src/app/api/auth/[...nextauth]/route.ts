// import axiosInstance from '@/utils/axios';
import { NextAuthOptions } from 'next-auth';
import NextAuth, { getServerSession } from 'next-auth/next';
import Auth0 from 'next-auth/providers/auth0';
import axios from "axios";
import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';

const {
    NEXT_PUBLIC_AUTH0_CLIENT_ID,
    NEXT_PUBLIC_AUTH0_CLIENT_SECRET,
    NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL,
    NEXT_PUBLIC_AUTH0_SECRET,
    NEXT_PUBLIC_AUTH0_SCOPE,
} = process.env;

type SocialAuthResponse = {
    accessToken: string;
    refreshToken: string;
};

async function socialAuth(
    endpoint: string,
    body: Record<string, unknown>,
    cookieHeader?: string
): Promise<SocialAuthResponse> {
    // console.log("COOKIE HEADER", cookieHeader);
    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (cookieHeader) {
            headers['Cookie'] = cookieHeader;
        }

        const response = await axios.post<SocialAuthResponse>(
            endpoint,
            body,
            {
                withCredentials: true,
                headers,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error calling social auth:', error);
        throw new Error('Failed to authenticate');
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        Auth0({
            clientId: NEXT_PUBLIC_AUTH0_CLIENT_ID ?? '',
            clientSecret: NEXT_PUBLIC_AUTH0_CLIENT_SECRET ?? '',
            issuer: NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL ?? '',
            authorization: {
                params: {
                    scope: NEXT_PUBLIC_AUTH0_SCOPE || 'openid profile email',
                },
            },
        }),
    ],
    // Define custom cookie settings for local development.
    cookies: {
        sessionToken: {
            name: 'next-auth.session-token',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: false, // For local development over HTTP
            },
        },
        // Add the state cookie configuration.
        state: {
            name: 'next-auth.state',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: false, // For local development over HTTP
            },
        },
    },
    secret: NEXT_PUBLIC_AUTH0_SECRET,
    // debug: true, // Enable debug logging to help diagnose issues.
    callbacks: {
        async signIn({ user, req }) {
            if (!user?.email) {
                console.error('Email is missing', { user });
                return false;
            }

            const userEmail = user.email.toLowerCase();
            const username = user.name || 'Unknown';

            const cookieHeader = req?.headers?.cookie || '';
            console.log("COOKIE HEADER", cookieHeader);

            try {
                const socialResponse = await socialAuth('/auth/social', {
                    username,
                    email: userEmail,
                    cookieHeader
                });

                if (socialResponse.accessToken && socialResponse.refreshToken) {
                    user.access_token = socialResponse.accessToken;
                    user.refresh_token = socialResponse.refreshToken;
                    return true;
                } else {
                    console.error(
                        'Backend did not return tokens',
                        socialResponse
                    );
                    return false;
                }
            } catch (error) {
                console.error('Error in signIn callback:', error);
                return false;
            }
        },
        async session({ session, token }) {
            session.access_token = token.access_token as string;
            session.refresh_token = token.refresh_token as string;
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.access_token = user.access_token;
                token.refresh_token = user.refresh_token;
            }
            return token;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith('/')) return `${baseUrl}${url}`;
            else if (
                new URL(url).origin ===
                process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL
            )
                return url;
            return baseUrl;
        },
    },
};

const handler = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions);
export const useGetSession = () => getServerSession(authOptions);

export { handler as GET, handler as POST };
