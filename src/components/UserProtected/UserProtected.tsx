'use client';

import React from 'react';
import Loader from '@/components/Loader';
import Unauthorized from '@/components/UnAuthorized';
import { useRootContext } from '@/lib/contexts/RootContext';

interface UserProtectedProps {
    children: React.ReactNode;
}

const UserProtected: React.FC<UserProtectedProps> = ({ children }) => {
    const { user, loading } = useRootContext();
    console.log('USER PROTECTED', user, loading);

    if (loading || user === undefined) return <Loader />;
    if (!user) return <Unauthorized />;

    return <>{children}</>;
};

export default UserProtected;
