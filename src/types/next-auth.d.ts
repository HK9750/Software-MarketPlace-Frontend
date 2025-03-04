import { User as NextAuthUser } from 'next-auth';

declare module 'next-auth' {
    interface User extends NextAuthUser {
        access_token?: string;
        refresh_token?: string;
    }

    interface Session {
        access_token?: string;
        refresh_token?: string;
    }
}
