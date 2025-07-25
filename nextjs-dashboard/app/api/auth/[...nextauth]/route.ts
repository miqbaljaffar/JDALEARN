import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import { compare } from 'bcrypt';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        if (!user || !user.password) {
          return null;
        }
        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
          return null;
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber,
          address: user.address,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      // Saat login awal, `user` object tersedia
      if (user) {
        // SOLUSI ERROR 2: Pastikan konversi ke Number
        token.id = Number(user.id); 
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.phoneNumber = user.phoneNumber;
        token.address = user.address;
        return token;
      }

      // Untuk request berikutnya, refresh data dari DB
      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: Number(token.id) },
          });

          // SOLUSI ERROR 1: Jangan return null. Cukup update jika user ditemukan.
          if (dbUser) {
            // Perbarui token dengan data terbaru
            token.name = dbUser.name;
            token.role = dbUser.role;
            token.phoneNumber = dbUser.phoneNumber;
            token.address = dbUser.address;
          }
        } catch (error) {
          console.error("JWT Callback Error: Gagal mengambil data user dari DB.", error);
        }
      }
      
      return token;
    },

    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = Number(token.id);
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.phoneNumber = token.phoneNumber as string | null;
        session.user.address = token.address as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };