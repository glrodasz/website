import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { useLangPrefix } from '../hooks/useLangPrefix';
import { Seo } from '../components/Seo';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { WaitlistForm } from '../components/molecules/WaitlistForm';
import { CourseBackground } from '../components/organisms/CourseBackground';
import { titleForPage, defaultDescription } from '../data/site';
import './pages.css';
import './NotFound.css';

type SuggestionKey = 'courses' | 'aboutHistory' | 'aboutLifestyle' | 'contact' | 'tokens';

const SUGGESTION_RULES: Array<{ pattern: RegExp; key: SuggestionKey; path: string }> = [
  { pattern: /cour/i,    key: 'courses',        path: '/courses' },
  { pattern: /hist/i,    key: 'aboutHistory',   path: '/about/history' },
  { pattern: /life/i,    key: 'aboutLifestyle', path: '/about/lifestyle' },
  { pattern: /about/i,   key: 'aboutHistory',   path: '/about/history' },
  { pattern: /contact/i, key: 'contact',        path: '/contact' },
  { pattern: /token/i,   key: 'tokens',         path: '/tokens' },
];

const NotFound: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation('notFound');
  const prefix = useLangPrefix();
  const { pathname } = useLocation();

  const suggestion = useMemo(() => {
    const rule = SUGGESTION_RULES.find(({ pattern }) => pattern.test(pathname));
    if (!rule) return null;
    const resolvedPath = rule.key === 'tokens' ? rule.path : `${prefix}${rule.path}`;
    return { key: rule.key, path: resolvedPath };
  }, [pathname, prefix]);

  return (
    <div className="page">
      <Seo title={titleForPage(t('seo.pageLabel'))} description={defaultDescription} path={`${prefix}/`} />

      <section className="page-hero">
        <span className="section-label not-found-hero__eyebrow" aria-hidden="true">
          {t('hero.label')}
        </span>
        <h1 className="not-found-hero__heading">{t('hero.title')}</h1>
        <p className="not-found-hero__lead">{t('hero.lead')}</p>

        {suggestion && (
          <p className="not-found-hero__suggestion">
            {t('suggestion.prefix')}{' '}
            <Link to={suggestion.path} className="not-found-hero__suggestion-link">
              {t(`suggestion.pages.${suggestion.key}`)}
            </Link>
            {t('suggestion.suffix')}
          </p>
        )}

        <div className="not-found-hero__actions">
          <Button variant="primary" to={prefix || '/'}>
            {t('hero.cta')}
          </Button>
        </div>
      </section>

      <hr className="section-divider" />

      <section className="page-section">
        <div className="featured-course-card">
          <CourseBackground theme={theme} />
          <div className="featured-course-card__content">
            <div className="featured-course-card__header">
              <Badge variant="accent" size="small" uppercase>
                {t('course.badge')}
              </Badge>
            </div>
            <span className="section-label">{t('course.label')}</span>
            <h2 className="featured-course-card__title">{t('course.title')}</h2>
            <p className="featured-course-card__description">{t('course.description')}</p>
            <WaitlistForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
