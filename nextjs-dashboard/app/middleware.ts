import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dapatkan token sesi untuk mengakses data pengguna (termasuk role)
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // --- Aturan untuk Halaman Admin (/dashboard) ---
  if (pathname.startsWith('/dashboard')) {
    // Jika tidak ada token (belum login) ATAU rolenya bukan ADMIN
    if (!token || token.role !== 'ADMIN') {
      // Alihkan ke halaman utama
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // --- Aturan untuk Halaman Customer yang Membutuhkan Login ---
  const customerProtectedRoutes = ['/profile', '/checkout', '/payment'];
  if (customerProtectedRoutes.some(route => pathname.startsWith(route))) {
    // Jika tidak ada token (belum login), paksa ke halaman login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Jika pengguna yang login adalah ADMIN, jangan izinkan akses.
    // Alihkan mereka kembali ke dashboard.
    if (token.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // --- Aturan untuk Halaman Login & Register ---
  // Jika pengguna sudah login, jangan biarkan mereka mengakses halaman login/register lagi
  if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
     // Arahkan berdasarkan role
     const url = token.role === 'ADMIN' ? '/dashboard' : '/';
     return NextResponse.redirect(new URL(url, request.url));
  }


  // Jika tidak ada aturan yang cocok, lanjutkan ke tujuan
  return NextResponse.next();
}

// Konfigurasi matcher untuk menentukan path mana yang akan dijalankan oleh middleware
export const config = {
  matcher: [
    /*
     * Cocokkan semua path KECUALI yang berikut:
     * - /api/: Path API
     * - /_next/static: File statis Next.js
     * - /_next/image: File optimasi gambar Next.js
     * - /favicon.ico: File favicon
     * - /Logo.png, /back.jpg, /proses.jpg, dll.: File gambar publik
     */
    '/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|favicon.ico).*)',
  ],
};