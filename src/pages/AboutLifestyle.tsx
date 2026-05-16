import { useTranslation, Trans } from 'react-i18next';
import {
  FAVORITE_BOOKS,
  FAVORITE_FILMS,
  GOODREADS_PROFILE,
  LETTERBOXD_PROFILE,
} from '../data/lifestyle';
import { LifestyleMediaCard } from '../components/molecules/LifestyleMediaCard';
import { Seo } from '../components/Seo';
import { defaultDescription, titleForPage } from '../data/site';
import { useLangPrefix } from '../hooks/useLangPrefix';
import './pages.css';
import './AboutLifestyle.css';
import { ArrowRight } from 'phosphor-react';
import { IconButton } from '../components/molecules/IconButton';

const AboutLifestyle: React.FC = () => {
  const { t } = useTranslation('about');
  const prefix = useLangPrefix();

  return (
    <div className="page">
      <Seo title={titleForPage(t('lifestyle.seo.pageLabel'))} description={defaultDescription} path={`${prefix}/about/lifestyle`} />
      <section className="page-hero">
        <span className="section-label">{t('lifestyle.hero.label')}</span>
        <h1 className="section-title">{t('lifestyle.hero.title')}</h1>
        <p className="lifestyle-intro">
          <Trans
            i18nKey="lifestyle.hero.intro"
            ns="about"
            components={{
              goodreads: (
                <a href={GOODREADS_PROFILE} target="_blank" rel="noopener noreferrer" />
              ),
              letterboxd: (
                <a href={LETTERBOXD_PROFILE} target="_blank" rel="noopener noreferrer" />
              ),
            }}
          />
        </p>
      </section>

      <hr className="section-divider" />

      <section className="page-section">
        <div className="lifestyle-section-head">
          <h2 className="section-title">{t('lifestyle.books.title')}</h2>
          <IconButton
            icon={<ArrowRight />}
            iconPosition="right"
            label={t('lifestyle.books.profileLink')}
            variant="secondary"
            size="small"
            href={GOODREADS_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
          />
        </div>
        <ul className="lifestyle-grid">
          {FAVORITE_BOOKS.map((b) => (
            <li key={b.href}>
              <LifestyleMediaCard
                href={b.href}
                imageUrl={b.coverUrl}
                title={b.title}
                summary={b.summary}
                placeholder="📖"
              />
            </li>
          ))}
        </ul>
      </section>

      <hr className="section-divider" />

      <section className="page-section">
        <div className="lifestyle-section-head">
          <h2 className="section-title">{t('lifestyle.films.title')}</h2>
          <IconButton
            href={LETTERBOXD_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            size="small"
            className="lifestyle-external"
            icon={<ArrowRight />}
            iconPosition="right"
            label={t('lifestyle.films.profileLink')}
          />
        </div>
        <ul className="lifestyle-grid">
          {FAVORITE_FILMS.map((f) => (
            <li key={f.href}>
              <LifestyleMediaCard
                href={f.href}
                imageUrl={f.posterUrl}
                title={f.title}
                summary={f.summary}
                placeholder="▶"
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AboutLifestyle;
