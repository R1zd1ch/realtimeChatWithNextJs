import NextAuth, { type NextAuthOptions } from 'next-auth';
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter';
import GoogleProvider from 'next-auth/providers/google';
import { db } from './db';
import { fetchRedis } from '@/helpers/redis';

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('Missing Google client ID or secret');
  return { clientId, clientSecret };
}

export const handler: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Присвоение token.id, если существует user
      if (user) {
        token.id = user.id;
      }

      // Получение пользователя из Redis и установка дополнительных полей
      if (!token.id) {
        const dbUserResult = await fetchRedis('get', `user:${token.sub}`);

        if (dbUserResult) {
          const dbUser = JSON.parse(dbUserResult);

          // Присвоение данных из Redis
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.picture = dbUser.image;
        }
      }

      console.log('Token after processing in jwt callback:', token);
      return token;
    },

    async session({ session, token }) {
      // Установка session.user.id, если присутствует token.id
      if (token.id) {
        session.user = {
          ...session.user,
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.picture,
        };
        console.log('Session user with ID:', session.user);
      } else {
        console.warn('Token.id was undefined in session callback');
      }

      return session;
    },

    redirect() {
      return '/dashboard';
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Экспорт как обработчик
export default NextAuth(handler);
