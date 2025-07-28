import NextAuth, { AuthOptions, Profile } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@/lib/prisma';
import { compare } from 'bcrypt';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
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

        // Pastikan user ada DAN passwordnya ada (untuk user non-google)
        if (!user || !user.password) {
          return null;
        }

        // Cek apakah user sudah verifikasi email (jika login pakai password)
        if (!user.emailVerified) {
          // Melempar error agar bisa ditangkap di front-end
          throw new Error("Email belum diverifikasi. Silakan cek email Anda.");
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
    maxAge: 24 * 60 * 60, // 1 hari
  },
  // --- KESALAHAN ADA DI SINI, SEHARUSNYA HANYA ADA SATU KEY 'callbacks' ---
  callbacks: {
    // Callback 'signIn' untuk menangani login, terutama dari Google
    async signIn({ user, account, profile }: { user: AdapterUser | any, account: any, profile?: Profile | any }) {
      // Jika login menggunakan Google
      if (account?.provider === 'google') {
        if (profile?.email) {
          // Cek apakah user sudah ada
          const existingUser = await prisma.user.findUnique({
             where: { email: profile.email },
          });

          // Jika user belum ada, buat user baru
          if (!existingUser) {
              await prisma.user.create({
                  data: {
                      email: profile.email,
                      name: profile.name,
                      image: profile.picture,
                      role: 'CUSTOMER',
                      emailVerified: new Date(), // Langsung verifikasi untuk login Google
                  },
              });
          }
        }
      }
      return true; // Lanjutkan proses login
    },

    // Callback 'jwt' untuk menambahkan data ke token
    async jwt({ token, user }) {
      // Saat login awal, `user` object tersedia
      if (user) {
        token.id = Number(user.id); 
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.phoneNumber = user.phoneNumber;
        token.address = user.address;
      }
      return token;
    },

    // Callback 'session' untuk menambahkan data dari token ke sesi
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
    // Anda bisa menambahkan halaman error di sini
    // error: '/auth/error', 
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
