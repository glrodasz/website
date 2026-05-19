import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { useLangPrefix } from '../hooks/useLangPrefix';
import { Badge } from '../components/atoms/Badge';
import { Tag } from '../components/atoms/Tag';
import { Button } from '../components/atoms/Button';
import { WaitlistForm } from '../components/molecules/WaitlistForm';
import { CourseBackground } from '../components/organisms/CourseBackground';
import {
  FREE_YOUTUBE_PLAYLISTS,
  OTHER_PLATFORM_COURSES,
  PLAYLIST_LANGUAGE_META,
  type PlaylistLanguage,
  playlistUrl,
  youtubeThumb,
} from '../data/courses';
import { GARAJE_CODE_PILLS, garajeWatchUrl } from '../data/garajeCodePills';
import { Seo } from '../components/Seo';
import { defaultDescription, titleForPage } from '../data/site';
import './pages.css';

const INITIAL_TUTORIALS = 6;

const LangTag: React.FC<{ lang: PlaylistLanguage; isEs: boolean }> = ({ lang, isEs }) => {
  const meta = PLAYLIST_LANGUAGE_META[lang];
  return <Tag size="small" variant="neutral">{isEs ? meta.labelEs : meta.label}</Tag>;
};

const Courses: React.FC = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const { t, i18n } = useTranslation('courses');
  const prefix = useLangPrefix();
  const [showAllTutorials, setShowAllTutorials] = useState(false);
  const isEs = i18n.language === 'es';

  useEffect(() => {
    if (location.hash !== '#ai-first') return;
    const section = document.getElementById('ai-first');
    if (!section) return;
    const nav = document.querySelector<HTMLElement>('.qd-navigation');
    const navHeight = nav?.offsetHeight ?? 0;
    const top = section.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
    section.querySelector<HTMLInputElement>('input')?.focus();
  }, [location.key, location.hash]);

  const visibleTutorials = useMemo(
    () => (showAllTutorials ? GARAJE_CODE_PILLS : GARAJE_CODE_PILLS.slice(0, INITIAL_TUTORIALS)),
    [showAllTutorials],
  );
  const hasMoreTutorials = GARAJE_CODE_PILLS.length > INITIAL_TUTORIALS;

  return (
    <div className="page">
      <Seo title={titleForPage(t('seo.pageLabel'))} description={defaultDescription} path={`${prefix}/courses`} />
      <section className="page-hero">
        <span className="section-label">{t('hero.label')}</span>
        <h1 className="section-title">{t('hero.title')}</h1>
      </section>

      <section className="page-section" id="ai-first">
        <div className="featured-course-card">
          <CourseBackground theme={theme} />
          <div className="featured-course-card__content">
            <div className="featured-course-card__header">
              <Badge variant="accent" size="small" uppercase>
                {t('aifirst.badge')}
              </Badge>
            </div>
            <h2 className="featured-course-card__title">{t('aifirst.title')}</h2>
            <p className="featured-course-card__description">
              {t('aifirst.description')}
            </p>
            <WaitlistForm />
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      <section className="page-section">
        <h2 className="section-title">{t('free.title')}</h2>
        <p className="page-section__lead">
          {t('free.lead')}
        </p>
        <div className="card-grid card-grid--2 playlist-card-grid">
          {FREE_YOUTUBE_PLAYLISTS.map((pl) => (
            <a
              key={pl.playlistId}
              href={playlistUrl(pl.playlistId)}
              target="_blank"
              rel="noopener noreferrer"
              className="playlist-card"
            >
              {pl.thumbnailVideoId ? (
                <img
                  src={youtubeThumb(pl.thumbnailVideoId)}
                  alt=""
                  className="playlist-card__img"
                />
              ) : (
                <div className="playlist-card__img-placeholder">▶</div>
              )}
              <div className="playlist-card__body">
                <LangTag lang={pl.language} isEs={isEs} />
                <div className="playlist-card__title-row">
                  <h3 className="playlist-card__title">{pl.title}</h3>
                </div>
                <span className="playlist-card__link">{t('free.watchLink')}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <hr className="section-divider" />

      <section className="page-section">
        <h2 className="section-title">{t('tutorials.title')}</h2>
        <p className="page-section__lead">
          {t('tutorials.lead')}
        </p>
        <ul className="tutorial-list">
          {visibleTutorials.map((v) => (
            <li key={v.videoId}>
              <a
                href={garajeWatchUrl(v.videoId)}
                target="_blank"
                rel="noopener noreferrer"
                className="tutorial-row"
              >
                <img
                  src={youtubeThumb(v.videoId)}
                  alt=""
                  className="tutorial-row__thumb"
                  width={120}
                  height={68}
                  loading="lazy"
                />
                <div className="tutorial-row__info">
                  <LangTag lang={v.language} isEs={isEs} />
                  <span className="tutorial-row__title">
                    {isEs ? v.title : v.titleEn}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
        {hasMoreTutorials && (
          <Button
            variant="tertiary"
            size="small"
            className="btn-load-more"
            onClick={() => setShowAllTutorials((s) => !s)}
          >
            {showAllTutorials ? t('tutorials.showLess') : t('tutorials.loadMore')}
          </Button>
        )}
      </section>

      <hr className="section-divider" />

      <section className="page-section">
        <h2 className="section-title">{t('platforms.title')}</h2>
        <div className="card-grid card-grid--3 platform-course-grid">
          {OTHER_PLATFORM_COURSES.map((c) => (
            <a
              key={c.id}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="platform-course-card"
            >
              {c.logoSrc && (
                <img
                  src={
                    theme === 'dark' && c.logoSrcDark ? c.logoSrcDark : c.logoSrc
                  }
                  alt={c.platform}
                  className="platform-course-card__logo"
                  loading="lazy"
                />
              )}
              <div className="platform-course-card__header">
                <span className="platform-course-card__platform">{c.platform}</span>
                {c.language && <LangTag lang={c.language} isEs={isEs} />}
              </div>
              <h3 className="platform-course-card__title">{c.title}</h3>
              {c.description && <p className="platform-course-card__desc">{c.description}</p>}
              <span className="platform-course-card__cta">{t('platforms.openCourse')}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Courses;
