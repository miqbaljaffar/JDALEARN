import { NextRequest, NextResponse } from 'next/server';
import { ratelimit } from '@/lib/rate-limiter';

export async function middleware(request: NextRequest) {
  // Hanya terapkan rate limiting untuk endpoint spesifik (login credentials)
  if (
    request.nextUrl.pathname === '/api/auth/callback/credentials' &&
    request.method === 'POST'
  ) {
    // Dapatkan IP dari header 'x-forwarded-for' atau fallback ke '127.0.0.1'
    const ip = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
    
    const { success, limit, remaining, reset } = await ratelimit.limit(ip);

    if (!success) {
      return new NextResponse('Too many login attempts. Please try again later.', {
        status: 429, // Status "Too Many Requests"
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': new Date(reset).toUTCString(),
        },
      });
    }
  }

  return NextResponse.next();
}

// Konfigurasi matcher untuk menentukan path mana yang akan dijalankan oleh middleware
export const config = {
  matcher: '/api/auth/callback/credentials',
};