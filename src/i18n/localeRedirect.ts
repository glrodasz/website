export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];
export const COOKIE_KEY = 'locale';

const DEFAULT_LOCALE: Locale = 'en';

function isLocale(value: string | null): value is Locale {
  return value === 'en' || value === 'es';
}

export function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;
  const first = header
    .split(',')[0]
    .trim()
    .toLowerCase();
  return first.startsWith('es') ? 'es' : DEFAULT_LOCALE;
}

export function isExemptPath(pathname: string): boolean {
  return (
    pathname === '/es' ||
    pathname.startsWith('/es/') ||
    pathname === '/tokens' ||
    pathname.startsWith('/tokens/')
  );
}

export function buildLocalizedPath(pathname: string): string {
  if (pathname === '/') return '/es';
  return `/es${pathname}`;
}

export function resolveLocaleRedirect(input: {
  pathname: string;
  cookieLocale: string | null;
  acceptLanguage: string | null;
}): string | null {
  const { pathname, cookieLocale, acceptLanguage } = input;

  if (isExemptPath(pathname)) return null;

  const target: Locale = isLocale(cookieLocale)
    ? cookieLocale
    : localeFromAcceptLanguage(acceptLanguage);

  return target === 'es' ? buildLocalizedPath(pathname) : null;
}
