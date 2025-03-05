'use client';
import React, { useContext } from 'react';
import type { SessionUser } from '@/types/types';

interface RootContextProps {
    user: SessionUser | null | undefined;
}

export const RootContext = React.createContext<RootContextProps | null>(null);

export const useRootContext = () => useContext(RootContext);
