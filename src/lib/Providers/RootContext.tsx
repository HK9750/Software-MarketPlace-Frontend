'use client';

import React, { useContext } from 'react';
import type { SessionUser } from '@/types/types';

interface RootContextProps {
    user: SessionUser | null | undefined;
}

export const RootContext = React.createContext<RootContextProps>({
    user: null,
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
