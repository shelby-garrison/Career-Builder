import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const PROTECTED_SEGMENTS = new Set(['edit', 'preview']);

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
        const url = new URL('/login', req.url);
        return NextResponse.redirect(url);
      }
      try {
        const secret: string = (process.env.JWT_SECRET as string) ?? '';
        if (!secret) throw new Error('JWT secret missing');
        const payload = jwt.verify(token, secret) as { companySlug?: string };
        if (!payload?.companySlug || payload.companySlug !== companySlug) {
          const url = new URL('/login', req.url);
          return NextResponse.redirect(url);
        }
      } catch {
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


