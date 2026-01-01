import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const token = req.auth;
  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth/login') || 
                     req.nextUrl.pathname.startsWith('/auth/register');

  // Protected routes
  if (!isAuth) {
    if (
      req.nextUrl.pathname.startsWith('/dashboard') ||
      req.nextUrl.pathname.startsWith('/admin') ||
      req.nextUrl.pathname.startsWith('/design') ||
      req.nextUrl.pathname.startsWith('/checkout')
    ) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  // Admin-only routes
  if (isAuth && req.nextUrl.pathname.startsWith('/admin')) {
    if (token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuth && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/design/:path*',
    '/checkout/:path*',
    '/auth/login',
    '/auth/register',
  ],
};

// Use Node.js runtime instead of Edge runtime
export const runtime = 'nodejs';