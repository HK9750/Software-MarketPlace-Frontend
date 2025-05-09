/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Loader from '@/components/Loader';
import ProfilePage from '@/components/Profile/ProfilePage';
import { useSelector } from 'react-redux';

export default function Profile() {
    const user = useSelector((state: any) => state.auth.userData);
    console.log(user);
    return user && user?.profile && user?.profile?.firstName ? (
        <ProfilePage userData={user} />
    ) : (
        <Loader />
    );
}
