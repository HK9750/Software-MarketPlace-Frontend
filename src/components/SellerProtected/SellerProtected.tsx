/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import Loader from '@/components/Loader';
import Unauthorized from '@/components/UnAuthorized';
import { useSelector } from 'react-redux';

interface SellerProtectedProps {
    children: React.ReactNode;
}

const SellerProtected: React.FC<SellerProtectedProps> = ({ children }) => {
    const user = useSelector((state: any) => state.auth.userData);


    if ( user === undefined) return <Loader />;
    if (!user || user.role !== 'SELLER') return <Unauthorized />;

    return <>{children}</>;
};

export default SellerProtected;
