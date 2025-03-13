'use client';

import Loader from '@/components/Loader';
import ProfilePage from '@/components/Profile/ProfilePage';
import { useRootContext } from '@/lib/contexts/RootContext';


export default function Profile() {
    const { user } = useRootContext();

    return user ? <ProfilePage userData={user} /> : <Loader />;
}
