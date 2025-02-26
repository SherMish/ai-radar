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
  // Add debug logging
  console.log('Middleware running for path:', request.nextUrl.pathname);
  
  const token = await getToken({ req: request }) as CustomToken;
  console.log('Middleware - Full token:', token);
  
  // Check if the path starts with /business
  if (request.nextUrl.pathname.startsWith('/business')) {
    console.log('Business route detected');
    
    // Skip middleware for these routes
    if (request.nextUrl.pathname.startsWith('/business/dashboard') || 
        request.nextUrl.pathname.startsWith('/business/api') ||
        request.nextUrl.pathname.startsWith('/business/register')) {
      console.log('Skipping middleware for:', request.nextUrl.pathname);
      return NextResponse.next();
    }

    if (!token) {
      console.log('No token found');
      return NextResponse.next();
    }

    console.log('Checking conditions:', {
      role: token.role,
      hasWebsites: !!token.websites,
      isBusinessOwner: token.role === 'business_owner'
    });

    if (token.role === 'business_owner' && token.websites) {
      console.log('Redirecting business owner to dashboard');
      return NextResponse.redirect(new URL('/business/dashboard', request.url));
    }
  }

  // Protect business dashboard routes
  if (request.nextUrl.pathname.startsWith('/business/dashboard')) {
    if (!token) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    if (token.role !== 'business_owner') {
      // Redirect to home if not a business owner
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (!token.websites) {
      // Redirect to registration if no website is associated
      return NextResponse.redirect(new URL('/business/register', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/business',
    '/business/((?!dashboard|api|register).*)',
    '/business/dashboard/:path*'
  ]
}; 