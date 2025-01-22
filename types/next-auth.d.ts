import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      isWebsiteOwner: boolean;
      isVerifiedWebsiteOwner: boolean;
    } & DefaultSession['user']
  }

  interface User {
    role: string;
    isWebsiteOwner: boolean;
    isVerifiedWebsiteOwner: boolean;
  }
} 