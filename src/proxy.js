import { NextResponse } from 'next/server';

const defaultLocale = 'es';
const locales = ['es', 'en'];

export function proxy(request) {
  const { pathname } = request.nextUrl;
  
  // Skip public assets and API
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/api')
  ) {
    return;
  }

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  // En el futuro se podría usar Negotiator o Accept-Language aquí.
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Interceptar todas las peticiones excepto las de assets/internas
    '/((?!_next|favicon.svg|[^/]+\\.[\\w]+).*)',
  ],
};
