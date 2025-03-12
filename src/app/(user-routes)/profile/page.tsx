'use client'

import Loader from "@/components/Loader";
import ProfilePage from "@/components/Profile/ProfilePage"
import { useRootContext } from "@/lib/contexts/RootContext";
import { MyProfile } from "@/types/types";
import axios from "axios";
import { useEffect, useState } from "react";


export default function Profile() {
    const [userData, setUserData] = useState<MyProfile | null>(null)
    const { access_token, refresh_token, loading } = useRootContext();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    useEffect(() => {
        if (!loading && access_token) {
            (async () => {
                try {
                    const response = await axios.get<{ success: boolean, data: MyProfile }>(
                        `${backendUrl}/profile/me`,
                        {
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                                'X-Refresh-Token': refresh_token || '',
                            },
                        }
                    );
                    setUserData(response.data.data);
                } catch (error) {
                    console.error('Error :', error);
                }
            })()
        }
    }, [access_token, refresh_token, loading, backendUrl])

    return userData ? <ProfilePage userData={userData} /> : <Loader/>
}

