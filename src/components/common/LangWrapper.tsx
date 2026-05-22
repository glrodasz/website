import { useEffect } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SUPPORTED_LANGS = ['es'];

export const LangWrapper: React.FC = () => {
  const { lang } = useParams<{ lang?: string }>();
  const { i18n } = useTranslation();

  const isLangSegment = lang !== undefined && SUPPORTED_LANGS.includes(lang);
  const isUnknownSegment = lang !== undefined && !SUPPORTED_LANGS.includes(lang);

  const locale = isLangSegment ? lang : 'en';

  useEffect(() => {
    i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute('content', locale === 'es' ? 'es_ES' : 'en_US');
  }, [locale, i18n]);

  if (isUnknownSegment) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
