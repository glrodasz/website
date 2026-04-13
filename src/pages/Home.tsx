import { useCallback, useState } from 'react';
import { Button } from '../components/atoms/Button';
import { WaitlistForm } from '../components/molecules/WaitlistForm';
import {
  FREE_YOUTUBE_PLAYLISTS,
  HOME_FEATURED_PLAYLIST_ID,
  PLAYLIST_LANGUAGE_META,
  playlistUrl,
  youtubeThumb,
} from '../data/courses';
import { defaultDescription, defaultTitle } from '../data/site';
import { Seo } from '../components/Seo';
import { writingPosts, type BlogPost } from '../generated/writing-posts';
import './Home.css';
import { ArrowRight } from 'phosphor-react';
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
            alt={post.title}
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
  const [heroPhotoFailed, setHeroPhotoFailed] = useState(false);

  const featuredPlaylist = FREE_YOUTUBE_PLAYLISTS.find((p) => p.playlistId === HOME_FEATURED_PLAYLIST_ID);

  const onHeroPhotoError = useCallback(() => {
    setHeroPhotoFailed(true);
  }, []);

  return (
    <main className="page">
      <Seo title={defaultTitle} description={defaultDescription} path="/" />
      <section className="home-hero">
        <div className="home-hero__inner">
          <div className="home-hero__layout">
            <div className="home-hero__content-col">
              <div className="home-hero__text">
                <p className="home-hero__hello">Hello,</p>
                <h1 className="home-hero__fullname">
                  <span className="home-hero__name-line home-hero__name-line--first">
                    I&apos;m <strong>Guillermo</strong>
                  </span>
                  <span className="home-hero__name-line">Rodas</span>
                </h1>
                <p className="home-hero__tagline">I help developers to improve their skills while creating quality products.</p>
                <div className="home-hero__relocation-outer" aria-label="Location">

                </div>
                <div className="home-hero__ctas">
                  <Button to="/courses" variant="primary">AI Course</Button>
                  <Button to="/courses" variant="secondary" className="home-hero__cta-courses">Courses</Button>
                  <Button to="/contact" variant="tertiary">Get in touch</Button>
                </div>
              </div>
            </div>
            <div className="home-hero__photo-col">
              {!heroPhotoFailed ? (
                <img
                  className="home-hero__photo"
                  src="/images/guillermo-rodas.png"
                  alt="Guillermo Rodas"
                  width={800}
                  height={800}
                  onError={onHeroPhotoError}
                />
              ) : (
                <div className="home-hero__photo-placeholder">
                  <span className="home-hero__photo-placeholder-icon" aria-hidden="true">👤</span>
                  <span>Photo coming soon</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      <section className="home-courses">
        <div className="home-courses__inner">
          <div className="home-courses__header">
            <h2 className="home-courses__title">Courses</h2>
            <IconButton icon={<ArrowRight />} iconPosition="right" label="See all courses" variant="secondary" size="small" to="/courses">
            </IconButton>
          </div>
          <div className="home-courses__grid">
            <article className="home-course-card home-course-card--accent">
              <div className="home-course-card__body">
                <div className="home-course-card__badge-container">
                  <Badge variant="accent" size="small" uppercase>Coming soon</Badge>
                </div>
                <h3 className="home-course-card__name">AI-first programming</h3>
                <p className="home-course-card__desc">
                  Build software with AI as your primary tool — short, focused lessons across the stack.
                </p>
                <WaitlistForm />
              </div>
            </article>
            {featuredPlaylist && (
              <article className="home-course-card">
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
                    <div className="home-course-card__title-row">
                      <span className="home-course-card__lang-flag" aria-hidden="true">
                        {PLAYLIST_LANGUAGE_META[featuredPlaylist.language].flag}
                      </span>
                      <span className="sr-only">
                        {PLAYLIST_LANGUAGE_META[featuredPlaylist.language].label}
                      </span>
                      <h3 className="home-course-card__name">{featuredPlaylist.title}</h3>
                    </div>
                    <span className="home-course-card__cta">Open playlist on YouTube →</span>
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
            <h2 className="home-writing__title">Writing</h2>
            <IconButton
              icon={<ArrowRight />}
              iconPosition="right"
              label="See full blog"
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
    </main>
  );
};

export default Home;
