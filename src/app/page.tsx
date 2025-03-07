'use client';

import Home from '@/components/Home';
import { useRootContext } from '@/lib/Providers/RootContext';
import React from 'react';

const Page = () => {
    const { user } = useRootContext();
    console.log(user);
    return (
        <React.Fragment>
            <Home />
        </React.Fragment>
    );
};
export default Page;
