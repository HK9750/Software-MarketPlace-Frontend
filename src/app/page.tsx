'use client';

import Home from '@/components/Home/Home';
import useAuthCookies from '@/hooks/useAuthCookies';
import React from 'react';

const page = () => {
    useAuthCookies();
    return (
        <React.Fragment>
            <Home />
        </React.Fragment>
    );
};
export default page;
