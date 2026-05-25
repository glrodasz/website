import { describe, expect, it } from 'vitest';
import {
  buildLocalizedPath,
  isExemptPath,
  localeFromAcceptLanguage,
  resolveLocaleRedirect,
} from './localeRedirect';

describe('localeFromAcceptLanguage', () => {
  it('detects Spanish from the first tag', () => {
    expect(localeFromAcceptLanguage('es-ES,es;q=0.9,en;q=0.8')).toBe('es');
    expect(localeFromAcceptLanguage('es')).toBe('es');
  });

  it('falls back to English otherwise', () => {
    expect(localeFromAcceptLanguage('en-US,en;q=0.9')).toBe('en');
    expect(localeFromAcceptLanguage('fr-FR')).toBe('en');
    expect(localeFromAcceptLanguage(null)).toBe('en');
    expect(localeFromAcceptLanguage('')).toBe('en');
  });
});

describe('isExemptPath', () => {
  it('exempts already-Spanish paths', () => {
    expect(isExemptPath('/es')).toBe(true);
    expect(isExemptPath('/es/courses')).toBe(true);
  });

  it('exempts the English-only tokens area', () => {
    expect(isExemptPath('/tokens')).toBe(true);
    expect(isExemptPath('/tokens/colors')).toBe(true);
  });

  it('exempts API routes', () => {
    expect(isExemptPath('/api/subscribe')).toBe(true);
    expect(isExemptPath('/api/anything')).toBe(true);
  });

  it('does not exempt regular paths', () => {
    expect(isExemptPath('/')).toBe(false);
    expect(isExemptPath('/courses')).toBe(false);
    expect(isExemptPath('/establishment')).toBe(false); // not /es
  });
});

describe('buildLocalizedPath', () => {
  it('maps root to /es', () => {
    expect(buildLocalizedPath('/')).toBe('/es');
  });

  it('prefixes other paths', () => {
    expect(buildLocalizedPath('/courses')).toBe('/es/courses');
  });
});

describe('resolveLocaleRedirect', () => {
  it('redirects a Spanish browser at root', () => {
    expect(
      resolveLocaleRedirect({ pathname: '/', cookieLocale: null, acceptLanguage: 'es-ES' })
    ).toBe('/es');
  });

  it('passes through an English browser', () => {
    expect(
      resolveLocaleRedirect({ pathname: '/', cookieLocale: null, acceptLanguage: 'en-US' })
    ).toBeNull();
  });

  it('redirects nested paths for Spanish', () => {
    expect(
      resolveLocaleRedirect({ pathname: '/courses', cookieLocale: null, acceptLanguage: 'es' })
    ).toBe('/es/courses');
  });

  it('never redirects /tokens', () => {
    expect(
      resolveLocaleRedirect({ pathname: '/tokens', cookieLocale: 'es', acceptLanguage: 'es' })
    ).toBeNull();
  });

  it('does not double-prefix already-Spanish paths', () => {
    expect(
      resolveLocaleRedirect({ pathname: '/es/courses', cookieLocale: null, acceptLanguage: 'es' })
    ).toBeNull();
  });

  it('lets the cookie win over Accept-Language', () => {
    expect(
      resolveLocaleRedirect({ pathname: '/', cookieLocale: 'es', acceptLanguage: 'en' })
    ).toBe('/es');
    expect(
      resolveLocaleRedirect({ pathname: '/', cookieLocale: 'en', acceptLanguage: 'es' })
    ).toBeNull();
  });

  it('ignores invalid cookie values', () => {
    expect(
      resolveLocaleRedirect({ pathname: '/', cookieLocale: 'fr', acceptLanguage: 'es' })
    ).toBe('/es');
  });
});
