'use client';

import { AUTH_PROVIDER } from '@/lib/constants';
import { useRootContext } from '@/lib/contexts/RootContext';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const SocialAuth = () => {
    const rootContext = useRootContext();
    const router = useRouter();
    console.log('SocialAuth', process.env.NEXTAUTH_URL);

    useEffect(() => {
        const handleSocialAuth = async () => {
            if (typeof window === 'undefined') return;
            if (rootContext?.user?.id) {
                router.replace('/');
            } else {
                await signIn(AUTH_PROVIDER, {
                    callbackUrl: process.env.NEXTAUTH_URL,
                });
            }
        };
        void handleSocialAuth();
    }, [rootContext, router]);

    return null;
};

export default SocialAuth;
