import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Detect admin subdomain (e.g. admin.royalbengal.com or admin.localhost:3000)
  const isAdminSubdomain = hostname.startsWith('admin.');

  if (isAdminSubdomain) {
    // If requesting root of admin subdomain, rewrite to /admin
    if (url.pathname === '/') {
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }
    // If path does not start with /admin, prefix it with /admin
    if (!url.pathname.startsWith('/admin') && !url.pathname.startsWith('/_next') && !url.pathname.includes('.')) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, _next, and favicon
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
