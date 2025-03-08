'use client';

import React, { useContext } from 'react';
import type { SessionUser } from '@/types/types';

interface RootContextProps {
    user: SessionUser | null | undefined;
    access_token: string | null | undefined;
    refresh_token: string | null | undefined;
}

export const RootContext = React.createContext<RootContextProps>({
    user: null,
    access_token: null,
    refresh_token: null,
});

export const useRootContext = () => {
    const context = useContext(RootContext);
    if (!context) {
        throw new Error(
            'useRootContext must be used within a RootContext.Provider'
        );
    }
    return context;
};
