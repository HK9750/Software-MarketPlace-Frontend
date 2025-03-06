// app/page.tsx
import { cookies } from "next/headers";

export default function Page() {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token")?.value || "No access token found";
    const refreshToken = cookieStore.get("refresh_token")?.value || "No refresh token found";

    return (
        <div>
            <p>Access Token: {accessToken}</p>
            <p>Refresh Token: {refreshToken}</p>
        </div>
    );
}
