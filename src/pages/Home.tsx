import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { useLangPrefix } from '../hooks/useLangPrefix';
import { Button } from '../components/atoms/Button';
import { Tag } from '../components/atoms/Tag';
import { WaitlistForm } from '../components/molecules/WaitlistForm';
import { CourseBackground } from '../components/organisms/CourseBackground';
import {
  FREE_YOUTUBE_PLAYLISTS,
  HOME_FEATURED_PLAYLIST_ID,
  PLAYLIST_LANGUAGE_META,
  playlistUrl,
  youtubeThumb,
} from '../data/courses';
import { Seo } from '../components/Seo';
import { writingPosts, type BlogPost } from '../generated/writing-posts';
import './Home.css';
import { ArrowRight, Globe } from 'phosphor-react';
import { IconButton } from '../components/molecules/IconButton';
import { Badge } from '../components/atoms/Badge';

const PostCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  const [coverFailed, setCoverFailed] = useState(false);

  const showCover = Boolean(post.cover) && !coverFailed;

  return (
    <article className="post-card">
      <a href={post.link} target="_blank" rel="noopener noreferrer">
        {showCover ? (
          <img
            src={post.cover}
            alt=""
            className="post-card__cover"
            loading="lazy"
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <div className="post-card__cover-placeholder" aria-hidden="true">✍️</div>
        )}
        <div className="post-card__body">
          <h3 className="post-card__title">{post.title}</h3>
          <div className="post-card__meta">
            {post.date && <span>{post.date}</span>}
            <span>{post.readTime}</span>
          </div>
          {post.excerpt && <p className="post-card__excerpt">{post.excerpt}</p>}
        </div>
      </a>
    </article>
  );
};

const Home: React.FC = () => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation('home');
  const isEs = i18n.language === 'es';
  const prefix = useLangPrefix();
  const featuredPlaylist = FREE_YOUTUBE_PLAYLISTS.find((p) => p.playlistId === HOME_FEATURED_PLAYLIST_ID);

  return (
    <div className="page">
      <Seo title={t('seo.title')} description={t('seo.description')} path={`${prefix}/`} />
      <section className="home-hero">
        <div className="home-hero__inner">
          <div className="home-hero__layout">
            <div className="home-hero__content-col">
              <div className="home-hero__text">
                <a href={`${prefix}/courses#ai-first`} className="home-hero__promo-pill">
                  <span className="home-hero__promo-icon" aria-hidden="true">⚡</span>
                  {t('hero.promoPill')}
                  <span className="home-hero__promo-arrow" aria-hidden="true">›</span>
                </a>
                <h1 className="home-hero__headline">
                  <span className="home-hero__headline-main">{t('hero.headlinePart1')}</span>{' '}
                  <span className="home-hero__headline-secondary">{t('hero.headlinePart2')}</span>
                </h1>
                <p className="home-hero__description">{t('hero.description')}</p>
                <div className="home-hero__ctas">
                  <Button to={`${prefix}/courses`} variant="primary">{t('hero.ctaCourses')}</Button>
                  <Button to={`${prefix}/contact`} variant="secondary">{t('hero.ctaContact')}</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      <section className="home-courses">
        <div className="home-courses__inner">
          <div className="home-courses__header">
            <h2 className="home-courses__title">{t('courses.title')}</h2>
            <IconButton icon={<ArrowRight />} iconPosition="right" label={t('courses.seeAll')} variant="secondary" size="small" to={`${prefix}/courses`}>
            </IconButton>
          </div>
          <div className="home-courses__grid">
            <article className="home-course-card home-course-card--accent">
              <CourseBackground theme={theme} />
              <div className="home-course-card__body">
                <div className="home-course-card__badge-container">
                  <Badge variant="accent" size="small" uppercase>{t('courses.comingSoon')}</Badge>
                </div>
                <h3 className="home-course-card__name">{t('courses.featuredTitle')}</h3>
                <p className="home-course-card__desc">
                  {t('courses.featuredDesc')}
                </p>
                <WaitlistForm />
              </div>
            </article>
            {featuredPlaylist && (
              <article className="home-course-card">
                <Tag size="small" variant="neutral" outlined className="lang-ribbon">
                  <span className="lang-tag__inner">
                    <Globe size={11} aria-hidden weight="regular" />
                    {isEs
                      ? PLAYLIST_LANGUAGE_META[featuredPlaylist.language].labelEs
                      : PLAYLIST_LANGUAGE_META[featuredPlaylist.language].label}
                  </span>
                </Tag>
                <a
                  href={playlistUrl(featuredPlaylist.playlistId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home-course-card__link"
                >
                  {featuredPlaylist.thumbnailVideoId ? (
                    <img
                      src={youtubeThumb(featuredPlaylist.thumbnailVideoId)}
                      alt=""
                      className="home-course-card__thumb"
                    />
                  ) : (
                    <div className="home-course-card__thumb-placeholder">▶</div>
                  )}
                  <div className="home-course-card__body">
                    <h3 className="home-course-card__name">{featuredPlaylist.title}</h3>
                    <span className="home-course-card__cta">{t('courses.openPlaylist')}</span>
                  </div>
                </a>
              </article>
            )}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      <section className="home-writing">
        <div className="home-writing__inner">
          <div className="home-writing__header">
            <h2 className="home-writing__title">{t('writing.title')}</h2>
            <IconButton
              icon={<ArrowRight />}
              iconPosition="right"
              label={t('writing.seeFull')}
              variant="secondary"
              size="small"
              href="https://undefined.sh"
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>

          <div className="home-writing__posts">
            {writingPosts.map((post) => (
              <PostCard key={`${post.link}|${post.cover ?? ''}`} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
