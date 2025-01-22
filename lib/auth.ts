import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from './mongodb';
import User from './models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        await connectDB();
        
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          isWebsiteOwner: user.isWebsiteOwner,
          isVerifiedWebsiteOwner: user.isVerifiedWebsiteOwner,
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await connectDB();
          
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              googleId: account.providerAccountId,
              lastLoginAt: new Date(),
            });
          } else {
            await User.findByIdAndUpdate(existingUser._id, {
              lastLoginAt: new Date(),
              name: user.name,
              image: user.image,
            });
          }
          
          return true;
        } catch (error) {
          console.error('Error during sign in:', error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: session.user.email });
          
          if (dbUser) {
            session.user.id = dbUser._id.toString();
            session.user.role = dbUser.role;
            session.user.isWebsiteOwner = dbUser.isWebsiteOwner;
            session.user.isVerifiedWebsiteOwner = dbUser.isVerifiedWebsiteOwner;
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      return session;
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.googleId = account.providerAccountId;
      }
      if (user) {
        token.role = user.role;
        token.isWebsiteOwner = user.isWebsiteOwner;
        token.isVerifiedWebsiteOwner = user.isVerifiedWebsiteOwner;
      }
      return token;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 