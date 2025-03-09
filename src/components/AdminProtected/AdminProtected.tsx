'use client';

import React from 'react';
import { useRootContext } from '@/lib/contexts/RootContext';
import Loader from '@/components/Loader';
import Unauthorized from '@/components/UnAuthorized';

interface AdminProtectedProps {
    children: React.ReactNode;
}

const AdminProtected: React.FC<AdminProtectedProps> = ({ children }) => {
    const { user, loading } = useRootContext();

    if (loading) return <Loader />;
    if (!user || user.role !== 'SELLER') return <Unauthorized />;

    return <>{children}</>;
};

export default AdminProtected;
