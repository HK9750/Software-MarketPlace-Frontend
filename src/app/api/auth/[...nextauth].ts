import { NextAuthOptions } from "next-auth";
import NextAuth, { getServerSession } from "next-auth/next";
import Auth0 from "next-auth/providers/auth0";

const {
  NEXT_PUBLIC_AUTH0_CLIENT_ID,
  NEXT_PUBLIC_AUTH0_CLIENT_SECRET,
  NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL,
  NEXT_PUBLIC_AUTH0_SECRET,
  NEXT_PUBLIC_AUTH0_SCOPE,
} = process.env;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

async function socialAuth(endpoint: string, body: Record<string, unknown>) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
}

export const authOptions: NextAuthOptions = {
  providers: [
    Auth0({
      clientId: NEXT_PUBLIC_AUTH0_CLIENT_ID ?? "",
      clientSecret: NEXT_PUBLIC_AUTH0_CLIENT_SECRET ?? "",
      issuer: NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL ?? "",
      authorization: {
        params: {
          scope: NEXT_PUBLIC_AUTH0_SCOPE || "openid profile email",
        },
      },
    }),
  ],
  secret: NEXT_PUBLIC_AUTH0_SECRET,
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) {
        console.error("Email is missing", { user });
        return false;
      }

      const userEmail = user.email.toLowerCase();
      const username = user.name || "Unknown";

      try {
        const socialResponse = await socialAuth("/auth/social", {
          username,
          email: userEmail,
        });

        if (socialResponse.accessToken && socialResponse.refreshToken) {
          user.access_token = socialResponse.accessToken;
          user.refresh_token = socialResponse.refreshToken;
          return true;
        } else {
          console.error("Backend didn’t return tokens", socialResponse);
          return false;
        }
      } catch (error) {
        console.error("Error calling backend/auth/social", error);
        return false;
      }
    },

    async session({ session, user }) {
      if (user.access_token) {
        session.access_token = user.access_token;
      }
      if (user.refresh_token) {
        session.refresh_token = user.refresh_token;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export const useGetSession = () => {
  return getServerSession(authOptions);
};

export { handler as GET, handler as POST };
