import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;

  // Rutas públicas accesibles para todos
  const publicRoutes = ['/', '/signup', '/login'];

  if (token) {
    if (publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } else {
    const protectedRoutes = ['/dashboard', '/create', '/control', '/manage', '/market', '/profile'];
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/signup', '/login', '/dashboard/:path*', '/create/:path*', '/control/:path*', '/manage/:path*', '/market/:path*', '/profile/:path*'],
};
