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
        };
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60, // Sesi berakhir dalam 24 jam
  },
  callbacks: {
    jwt({ token, user }) {
      // Saat login pertama kali (objek 'user' tersedia)
      if (user) {
        token.id = Number(user.id); 
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      // Pastikan session.user ada sebelum dimodifikasi
      if (session.user) {
        // Ambil data dari token (yang diperkaya oleh callback jwt)
        // dan pastikan tipenya sesuai dengan definisi di next-auth.d.ts
        session.user.id = token.id; // token.id di sini sudah dipastikan number dari callback jwt
        session.user.role = token.role;
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