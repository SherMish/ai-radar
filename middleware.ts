import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

interface CustomToken {
  role?: string;
  websites?: string | null;
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/business',
    '/business/((?!dashboard|api|register).*)'
  ]
}; 