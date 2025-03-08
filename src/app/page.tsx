'use client';

import Home from '@/components/Home';
import React from 'react';
import { useRootContext } from '@/lib/contexts/RootContext';

const Page = () => {
    const { user, access_token, refresh_token } = useRootContext();
    console.log('user', user);
    return (
        <React.Fragment>
            <Home />
        </React.Fragment>
    );
};
export default Page;
