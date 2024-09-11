import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

import prisma, { PrismaAdapter } from 'utils/prisma';

const createOptions = (req) => ({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_APP_CLIENT_ID,
      clientSecret: process.env.GITHUB_APP_SECRET,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
          login: profile.login,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.colorSchema = token.colorSchema;
        session.userId = token.uid;
        session.githubHandle = token.githubHandle;
      }

      return session;
    },
    async jwt({ user, account, token, profile }) {
      if (req.query?.colorSchema) {
        token.colorSchema = req.query.colorSchema;
      }

      if (user) {
        token.uid = user.id;
        token.colorSchema = user.colorSchema;
      }

      if (account) {
        token.access_token = account.access_token;
      }
      if (profile) {
        token.githubHandle = profile.login;
      }

      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
});

export default async (req, res) => NextAuth(req, res, createOptions(req));
