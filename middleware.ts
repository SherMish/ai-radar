import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

interface CustomToken {
  role?: string;
  websites?: string;
  name?: string;
  email?: string;
}

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  console.log('Middleware token:', token); // Debug log

  // For /business route (not dashboard)
  if (request.nextUrl.pathname === '/business') {
    if (token?.role === 'business_owner') {
      console.log('Redirecting to dashboard from /business');
      return NextResponse.redirect(new URL('/business/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // For dashboard routes
  if (request.nextUrl.pathname.startsWith('/business/dashboard')) {
    if (!token) {
      console.log('No token, redirecting to signin');
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    if (token.role !== 'business_owner') {
      console.log('Not a business owner, redirecting to home');
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/business',
    '/business/dashboard/:path*'
  ]
}; 