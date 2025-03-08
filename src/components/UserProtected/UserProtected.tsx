'use client';

import React from 'react';
import { useGetCookies } from '@/hooks/useGetCookies';
import Loader from '@/components/Loader';
import Unauthorized from '@/components/UnAuthorized';

interface UserProtectedProps {
    children: React.ReactNode;
}

const UserProtected: React.FC<UserProtectedProps> = ({ children }) => {
    const { access_token, loading, error } = useGetCookies();

    if (loading) return <Loader />;
    if (error || !access_token) return <Unauthorized />;

    return <>{children}</>;
};

export default UserProtected;
