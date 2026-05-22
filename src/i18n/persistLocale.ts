import { COOKIE_KEY, type Locale } from './localeRedirect';

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

// Persist the chosen locale so the edge middleware honors it on the next request.
export function persistLocale(locale: Locale): void {
  document.cookie = `${COOKIE_KEY}=${locale}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}
