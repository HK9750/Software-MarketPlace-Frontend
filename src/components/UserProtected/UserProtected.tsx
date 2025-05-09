/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import Loader from '@/components/Loader';
import Unauthorized from '@/components/UnAuthorized';
import { useSelector } from 'react-redux';

interface UserProtectedProps {
    children: React.ReactNode;
}

const UserProtected: React.FC<UserProtectedProps> = ({ children }) => {
    const user = useSelector((state: any) => state.auth.userData);

    if (user === undefined) return <Loader />;
    if (!user) return <Unauthorized />;

    return <>{children}</>;
};

export default UserProtected;
