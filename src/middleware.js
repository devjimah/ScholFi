import { NextResponse } from 'next/server';

// Protected routes that require wallet connection and auth
const protectedRoutes = ['/bets', '/polls', '/raffles', '/stakes'];

// Auth routes that should redirect to /bets if already authenticated
const authRoutes = ['/login', '/signup'];

// Public routes that don't need any protection
const publicRoutes = ['/', '/api', '/_next', '/favicon.ico'];

export function middleware(request) {
  // Get the current path
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes and static files
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get auth status from cookies
  const isAuthenticated = request.cookies.get('auth')?.value === 'true';
  const isWalletConnected = request.cookies.get('wallet.connected')?.value === 'true';

  // Handle auth routes (login/signup)
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (isAuthenticated && isWalletConnected) {
      return NextResponse.redirect(new URL('/bets', request.url));
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated || !isWalletConnected) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
