import 'next-auth/jwt';
import { DefaultSession } from 'next-auth';

// Mendefinisikan ulang modul untuk menambahkan properti kustom
declare module 'next-auth' {
  /**
   * Tipe User diperbarui untuk mencocokkan skema Prisma Anda.
   * 'id' sekarang adalah 'number' dan 'role' ditambahkan.
   */
  interface User {
    id: number;
    role?: string;
  }

  /**
   * Tipe Session diperbarui untuk menyertakan 'id' sebagai 'number' dan 'role'.
   */
  interface Session extends DefaultSession {
    user?: {
      id: number;
      role?: string;
    } & DefaultSession['user'];
  }
}

// Mendefinisikan ulang token JWT untuk menyertakan properti kustom
declare module 'next-auth/jwt' {
  /** Token diperbarui untuk membawa 'id' dan 'role' */
  interface JWT {
    id: number;
    role?: string;
  }
}