import { useMemo, useState } from 'react';
import { Badge } from '../components/atoms/Badge';
import { Button } from '../components/atoms/Button';
import {
  AI_FIRST_WAITLIST_MAILTO,
  FREE_YOUTUBE_PLAYLISTS,
  OTHER_PLATFORM_COURSES,
  PLAYLIST_LANGUAGE_META,
  playlistUrl,
  youtubeThumb,
} from '../data/courses';
import { GARAJE_CODE_PILLS, garajeWatchUrl } from '../data/garajeCodePills';
import { Seo } from '../components/Seo';
import { defaultDescription, titleForPage } from '../data/site';
import './pages.css';

const INITIAL_TUTORIALS = 5;

const Courses: React.FC = () => {
  const [showAllTutorials, setShowAllTutorials] = useState(false);
  const visibleTutorials = useMemo(
    () => (showAllTutorials ? GARAJE_CODE_PILLS : GARAJE_CODE_PILLS.slice(0, INITIAL_TUTORIALS)),
    [showAllTutorials],
  );
  const hasMoreTutorials = GARAJE_CODE_PILLS.length > INITIAL_TUTORIALS;

  return (
    <main className="page">
      <Seo title={titleForPage('Courses')} description={defaultDescription} path="/courses" />
      <section className="page-hero">
        <span className="section-label">Courses</span>
        <h1 className="section-title">Courses</h1>
      </section>

      <section className="page-section" id="ai-first">
        <div className="featured-course-card">
          <div className="featured-course-card__header">
            <Badge variant="accent" size="small" uppercase>
              Coming Soon
            </Badge>
          </div>
          <h2 className="featured-course-card__title">AI-First Programming Course</h2>
          <p className="featured-course-card__description">
            Learn to build software using AI as your primary tool. Covers JavaScript/TypeScript,
            Python, Go, and Rust through 5-minute focused video lessons. Designed for developers
            who want to move fast and build better with AI.
          </p>
          <Button variant="secondary" href={AI_FIRST_WAITLIST_MAILTO}>
            Join waitlist
          </Button>
        </div>
      </section>

      <hr className="section-divider" />

      <section className="page-section">
        <h2 className="section-title">Free courses</h2>
        <p className="page-section__lead">
          Full playlists on YouTube — no paywall.
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
                <div className="playlist-card__title-row">
                  <span className="playlist-card__lang-flag" aria-hidden="true">
                    {PLAYLIST_LANGUAGE_META[pl.language].flag}
                  </span>
                  <span className="sr-only">{PLAYLIST_LANGUAGE_META[pl.language].label}</span>
                  <h3 className="playlist-card__title">{pl.title}</h3>
                </div>
                <span className="playlist-card__link">Watch on YouTube →</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <hr className="section-divider" />

      <section className="page-section">
        <h2 className="section-title">Tutorials</h2>
        <p className="page-section__lead">
          Garaje Code Pills — short practical videos.
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
                <span className="tutorial-row__title">{v.title}</span>
              </a>
            </li>
          ))}
        </ul>
        {hasMoreTutorials && (
          <Button
            variant="secondary"
            size="small"
            className="btn-load-more"
            onClick={() => setShowAllTutorials((s) => !s)}
          >
            {showAllTutorials ? 'Show less' : 'Load more'}
          </Button>
        )}
      </section>

      <hr className="section-divider" />

      <section className="page-section">
        <h2 className="section-title">Courses on other platforms</h2>
        <div className="card-grid card-grid--3 platform-course-grid">
          {OTHER_PLATFORM_COURSES.map((c) => (
            <a
              key={c.id}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="platform-course-card"
            >
              <span className="platform-course-card__platform">{c.platform}</span>
              <h3 className="platform-course-card__title">{c.title}</h3>
              {c.description && <p className="platform-course-card__desc">{c.description}</p>}
              <span className="platform-course-card__cta">Open course →</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Courses;
