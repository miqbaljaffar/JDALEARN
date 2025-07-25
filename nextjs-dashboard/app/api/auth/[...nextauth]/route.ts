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
    /**
     * Callback JWT: Mengelola isi token.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id); 
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.phoneNumber = user.phoneNumber;
        token.address = user.address;
        return token;
      }
      // Untuk request berikutnya, pastikan token.id ada sebelum query.
      if (!token.id) return token;

      // Ambil data terbaru dari database untuk memastikan sesi selalu fresh.
      const dbUser = await prisma.user.findUnique({
        where: { id: Number(token.id) }, 
      });

      // Jika user ada di DB, perbarui token dengan data terbaru.
      if (dbUser) {
        token.name = dbUser.name;
        token.role = dbUser.role;
        token.phoneNumber = dbUser.phoneNumber;
        token.address = dbUser.address;
      }
      
      return token;
    },

    /**
     * Callback Session: Mengelola data sesi yang dikirim ke client.
     */
    session({ session, token }) {
      // Salin data dari token (yang sudah dijamin fresh) ke objek session.
      if (session.user) {
        // **PERBAIKAN KEDUA:** Konversi juga di sini untuk memastikan tipe data cocok.
        session.user.id = Number(token.id); 
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.phoneNumber = token.phoneNumber;
        session.user.address = token.address;
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
