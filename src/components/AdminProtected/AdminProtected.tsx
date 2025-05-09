/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import Loader from '@/components/Loader';
import Unauthorized from '@/components/UnAuthorized';
import { useSelector } from 'react-redux';

interface AdminProtectedProps {
    children: React.ReactNode;
}

const AdminProtected: React.FC<AdminProtectedProps> = ({ children }) => {
    const user = useSelector((state: any) => state.auth.userData);

    if (user === undefined) return <Loader />;
    if (!user || user.role !== 'ADMIN') return <Unauthorized />;

    return <>{children}</>;
};

export default AdminProtected;
