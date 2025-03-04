import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectToDatabase from '@/lib/db';
import User from '@/lib/models/User';
import { surveyForms } from '@/lib/surveyForms';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        try {
          await connectToDatabase();
          return true;
        } catch (error) {
          console.error('Sign in error:', error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      // Add user information to session
      session.user.id = token.sub;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect back to the homepage after sign-in
      // Our client-side code will handle the redirection to the selected survey
      return baseUrl;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };