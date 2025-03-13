'use client';

import React, { useContext } from 'react';
import type { SessionUser } from '@/types/types';

interface RootContextProps {
    user: SessionUser | null | undefined;
    access_token: string | null | undefined;
    refresh_token: string | null | undefined;
    loading: boolean;
    setUser: (user: SessionUser | null) => void;
    setAccessToken: (token: string | null) => void; // ✅ New setter
    setRefreshToken: (token: string | null) => void;
    refetchUserProfile: () => void;
}

export const RootContext = React.createContext<RootContextProps>({
    user: null,
    setUser: () => { },
    access_token: null,
    refresh_token: null,
    loading: true,
    setAccessToken: () => { },
    setRefreshToken: () => { },
    refetchUserProfile: () => {},
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
