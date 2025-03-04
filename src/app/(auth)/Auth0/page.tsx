'use client';

import { AUTH_PROVIDER } from '@/lib/constants';
import { useRootContext } from '@/lib/Providers/RootContext';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

const SocialAuth = () => {
    const rootContext = useRootContext();
    const router = useRouter();

    useEffect(() => {
        const handleSocialAuth = async () => {
            if (typeof window === 'undefined') return;
            if (rootContext?.user?.id) {
                router.replace('/');
            } else {
                const res = await signIn(AUTH_PROVIDER, {
                    callbackUrl:
                        process.env.AUTH0_REDIRECT_URI ||
                        'http://localhost:3000/api/auth/callback/auth0',
                    redirect: false,
                });
                if (res?.ok) {
                    const session = await getSession();
                    if (session?.access_token && session?.refresh_token) {
                        Cookies.set('access_token', session.access_token, {
                            secure: false,
                            sameSite: 'strict',
                        });
                        Cookies.set('refresh_token', session.refresh_token, {
                            secure: false,
                            sameSite: 'strict',
                        });
                    }
                    router.replace(res.url || '/');
                }
            }
        };
        void handleSocialAuth();
    }, [rootContext, router]);

    return null;
};

export default SocialAuth;
