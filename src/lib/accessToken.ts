/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";

export default function useAccessToken(){
    const token = useSelector((state: any) => state.auth.accessToken);
    const accessToken = token;
    if (!accessToken) {
        return null
    }
    return accessToken
}

