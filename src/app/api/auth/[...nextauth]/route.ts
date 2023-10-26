import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';

import type { NextAuthOptions } from 'next-auth';
import prisma from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Required');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error('EmailNotExist&email=' + credentials.email);
        }

        if (!user.password) {
          throw new Error('NoPasswordSet&email=' + credentials.email);
        }

        const isCorrectPassword = await compare(
          credentials.password,
          user.password,
        );

        if (!isCorrectPassword) {
          throw new Error('IncorrectPassword&email=' + credentials.email);
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session }) {
      if (!session.user?.email) return session;

      const user = await prisma.user.findUnique({
        where: {
          email: session.user?.email,
        },
      });

      // @ts-ignore
      session.user.role = user?.role;

      return session;
    },
    async jwt({ token }) {
      if (!token?.email) return token;

      const user = await prisma.user.findUnique({
        where: {
          email: token?.email,
        },
      });

      // @ts-ignore
      token.role = user?.role;

      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
