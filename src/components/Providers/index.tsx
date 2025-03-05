'use client';

import { SessionProvider } from 'next-auth/react';
import { RootContext } from '@/lib/Providers/RootContext';
import { SessionUser } from '@/types/types';

type ProvidersProps = {
    children: React.ReactNode;
    user: SessionUser | null | undefined;
};

export const Providers = ({ children, user }: ProvidersProps) => {
    return (
        <SessionProvider>
            <RootContext.Provider value={{ user }}>
                {children}
            </RootContext.Provider>
        </SessionProvider>
    );
};
