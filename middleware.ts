import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_SEGMENTS = new Set(['edit', 'preview']);

// Simple JWT decode function for middleware (Edge Runtime compatible)
function decodeJWT(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1] ?? '';
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Expect paths like /{company}/{segment}
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length >= 2) {
    const companySlug = parts[0] as string;
    const segment = (parts[1] ?? '') as string;

    if (segment && PROTECTED_SEGMENTS.has(segment)) {
      const token = req.cookies.get('token')?.value;
      if (!token) {
        console.log('Middleware: No token found, redirecting to login');
        const url = new URL('/login', req.url);
        return NextResponse.redirect(url);
      }
      
      try {
        const payload = decodeJWT(token);
        console.log('Middleware: Token payload:', payload);
        console.log('Middleware: Expected companySlug:', companySlug);
        
        if (!payload?.companySlug || payload.companySlug !== companySlug) {
          console.log('Middleware: Company slug mismatch, redirecting to login');
          const url = new URL('/login', req.url);
          return NextResponse.redirect(url);
        }
        console.log('Middleware: Authentication successful');
      } catch (error) {
        console.log('Middleware: Token verification failed:', error);
        const url = new URL('/login', req.url);
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/:company/edit',
    '/:company/preview'
  ]
};


