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
  const { t, i18n } = useTranslation('about');
  const prefix = useLangPrefix();
  const isEs = i18n.language === 'es';

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
                variant="book"
                href={b.href}
                imageUrl={b.coverUrl}
                title={b.title}
                subtitle={b.author}
                summary={isEs ? (b.summaryEs ?? b.summary) : b.summary}
                placeholder="📖"
                linkLabel={t('lifestyle.books.cardLink')}
                flipLabel={t('lifestyle.card.flip', { title: b.title })}
                flipBackLabel={t('lifestyle.card.flipBack')}
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
                variant="dvd"
                href={f.href}
                imageUrl={f.posterUrl}
                title={f.title}
                summary={isEs ? (f.summaryEs ?? f.summary) : f.summary}
                placeholder="▶"
                linkLabel={t('lifestyle.films.cardLink')}
                flipLabel={t('lifestyle.card.flip', { title: f.title })}
                flipBackLabel={t('lifestyle.card.flipBack')}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AboutLifestyle;
