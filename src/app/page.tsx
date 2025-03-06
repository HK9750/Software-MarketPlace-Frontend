'use client';

import Home from '@/components/Home/Home';
import useAuthCookies from '@/hooks/useAuthCookies';
import axiosInstance from '@/utils/axios';
import React, { useEffect } from 'react';


const Page =  () => {
    useEffect(() => {
        const fetchData = async () => {
            const res = await axiosInstance.get('/profile');
            console.log(res.data);
        };
        fetchData();
    }, []);

    useAuthCookies();
    return (
        <React.Fragment>
            <Home />
        </React.Fragment>
    );
};
export default Page;
