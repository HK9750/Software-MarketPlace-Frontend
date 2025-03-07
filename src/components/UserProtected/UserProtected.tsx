'use client';

import React from 'react';
import { useGetCookies } from '@/hooks/useGetCookies';
import Loader from '@/components/Loader';
import Unauthorized from '@/components/UnAuthorized';

interface UserProtectedProps {
    children: React.ReactNode;
}

const UserProtected: React.FC<UserProtectedProps> = ({ children }) => {
    const { accessToken, loading, error } = useGetCookies();

    if (loading) return <Loader />;
    if (error || !accessToken) return <Unauthorized />;

    return <>{children}</>;
};

export default UserProtected;
