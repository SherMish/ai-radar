import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

if (!process.env.NEXTAUTH_URL) {
  console.warn("NEXTAUTH_URL not set, defaulting to http://localhost:3000");
}

if (!process.env.NEXTAUTH_SECRET) {
  console.warn("NEXTAUTH_SECRET not set, using a temporary secret. Please set NEXTAUTH_SECRET in production!");
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || "temporary-secret-for-development",
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };