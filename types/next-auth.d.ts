import { DefaultSession } from 'next-auth';
import NextAuth from "next-auth"

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      isWebsiteOwner: boolean;
      isVerifiedWebsiteOwner: boolean;
      businessId?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession['user']
  }

  interface User {
    id: string;
    role: string;
    isWebsiteOwner: boolean;
    isVerifiedWebsiteOwner: boolean;
    businessId?: string;
  }
} 