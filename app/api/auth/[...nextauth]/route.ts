import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

if (!process.env.NEXTAUTH_URL) {
  console.warn("NEXTAUTH_URL not set, defaulting to http://localhost:3000");
}

if (!process.env.NEXTAUTH_SECRET) {
  console.warn("NEXTAUTH_SECRET not set, using a temporary secret. Please set NEXTAUTH_SECRET in production!");
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };