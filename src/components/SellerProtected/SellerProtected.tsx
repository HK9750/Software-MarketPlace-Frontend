'use client';

import React from 'react';
import { useRootContext } from '@/lib/contexts/RootContext';
import Loader from '@/components/Loader';
import Unauthorized from '@/components/UnAuthorized';

interface SellerProtectedProps {
    children: React.ReactNode;
}

const SellerProtected: React.FC<SellerProtectedProps> = ({ children }) => {
    const { user, loading } = useRootContext();

    if (loading || user === undefined) return <Loader />;
    if (!user || user.role !== 'SELLER') return <Unauthorized />;

    return <>{children}</>;
};

export default SellerProtected;
