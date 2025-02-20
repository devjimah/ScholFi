import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get auth cookie
  const authCookie = request.cookies.get('auth')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/signup');
  const isHomePage = request.nextUrl.pathname === '/';

  // If user is authenticated and on homepage, redirect to bets
  if (authCookie && isHomePage) {
    const betsUrl = new URL('/bets', request.url);
    return NextResponse.redirect(betsUrl);
  }

  // If the page is not an auth page and user is not authenticated, redirect to login
  if (!authCookie && !isAuthPage && !isHomePage) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and trying to access auth pages, redirect to bets
  if (authCookie && isAuthPage) {
    const betsUrl = new URL('/bets', request.url);
    return NextResponse.redirect(betsUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/bets/:path*',
    '/profile/:path*',
    '/login',
    '/signup'
  ]
};
