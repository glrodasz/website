import { COOKIE_KEY, resolveLocaleRedirect } from './src/i18n/localeRedirect';

function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }
  return null;
}

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const to = resolveLocaleRedirect({
    pathname: url.pathname,
    cookieLocale: readCookie(request.headers.get('cookie'), COOKIE_KEY),
    acceptLanguage: request.headers.get('accept-language'),
  });

  if (to) return Response.redirect(new URL(to, url), 307);
}

export const config = {
  matcher: ['/((?!api/|assets/|components/|flags/|images/|logos/|og/|vectors/|.*\\.).*)'],
};
