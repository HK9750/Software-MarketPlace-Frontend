import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        access_token?: string;
        refresh_token?: string;
    }
    interface User extends DefaultUser {
        access_token?: string;
        refresh_token?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        access_token?: string;
        refresh_token?: string;
    }
}
