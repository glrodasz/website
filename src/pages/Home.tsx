import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AI_FIRST_WAITLIST_MAILTO,
  FREE_YOUTUBE_PLAYLISTS,
  HOME_FEATURED_PLAYLIST_ID,
  playlistUrl,
  youtubeThumb,
} from '../data/courses';
import { defaultDescription, defaultTitle, SITE_TAGLINE } from '../data/site';
import { Seo } from '../components/Seo';
import './Home.css';

interface BlogPost {
  title: string;
  link: string;
  date: string;
  readTime: string;
  excerpt: string;
  cover: string;
}

const STATIC_POSTS: BlogPost[] = [
  {
    title: 'Building AI-First Applications: A Practical Guide',
    link: 'https://undefined.sh',
    date: 'Jan 2025',
    readTime: '8 min read',
    excerpt: 'Exploring how to integrate AI tools and workflows into modern web development, from code generation to intelligent UI patterns.',
    cover: '',
  },
  {
    title: 'WebAuthn & Passkeys: The Future of Authentication',
    link: 'https://undefined.sh',
    date: 'Nov 2023',
    readTime: '6 min read',
    excerpt: 'A deep dive into the WebAuthn standard, why passkeys matter, and how to implement them in your web applications today.',
    cover: '',
  },
  {
    title: 'Why Every Developer Should Try Live Coding on Stream',
    link: 'https://undefined.sh',
    date: 'Aug 2022',
    readTime: '5 min read',
    excerpt: 'Live coding is one of the most authentic ways to teach programming. Here is why I started, what I learned, and how you can too.',
    cover: '',
  },
];

function parseFeed(xmlText: string): BlogPost[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'application/xml');
  const items = Array.from(doc.querySelectorAll('item')).slice(0, 3);

  return items.map((item) => {
    const title = item.querySelector('title')?.textContent ?? '';
    const link = item.querySelector('link')?.textContent ?? 'https://undefined.sh';
    const pubDate = item.querySelector('pubDate')?.textContent ?? '';
    const description = item.querySelector('description')?.textContent ?? '';

    const date = pubDate
      ? new Date(pubDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : '';

    const enclosureUrl = item.querySelector('enclosure')?.getAttribute('url') ?? '';
    const mediaContent = item.querySelector('content')?.getAttribute('url') ?? '';
    const cover = enclosureUrl || mediaContent || '';

    const div = document.createElement('div');
    div.innerHTML = description;
    const excerpt = div.textContent?.slice(0, 160) ?? '';

    return { title, link, date, readTime: '5 min read', excerpt, cover };
  });
}

const PostCard: React.FC<{ post: BlogPost }> = ({ post }) => (
  <article className="post-card">
    <a href={post.link} target="_blank" rel="noopener noreferrer">
      {post.cover ? (
        <img src={post.cover} alt={post.title} className="post-card__cover" loading="lazy" />
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

const Home: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>(STATIC_POSTS);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [heroPhotoFailed, setHeroPhotoFailed] = useState(false);

  const featuredPlaylist = FREE_YOUTUBE_PLAYLISTS.find((p) => p.playlistId === HOME_FEATURED_PLAYLIST_ID);

  const onHeroPhotoError = useCallback(() => {
    setHeroPhotoFailed(true);
  }, []);

  useEffect(() => {
    const RSS_URL = 'https://undefined.sh/rss.xml';
    const PROXY = `https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}`;

    const fetchPosts = async () => {
      try {
        const directRes = await fetch(RSS_URL, { signal: AbortSignal.timeout(5000) });
        if (directRes.ok) {
          const text = await directRes.text();
          const parsed = parseFeed(text);
          if (parsed.length > 0) {
            setPosts(parsed);
            return;
          }
        }
      } catch {
        // try proxy
      }

      try {
        const proxyRes = await fetch(PROXY, { signal: AbortSignal.timeout(8000) });
        if (proxyRes.ok) {
          const data = await proxyRes.json();
          const parsed = parseFeed(data.contents ?? '');
          if (parsed.length > 0) {
            setPosts(parsed);
          }
        }
      } catch {
        // keep static
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts().catch(() => setLoadingPosts(false));
  }, []);

  useEffect(() => {
    if (!loadingPosts) return;
    const timer = setTimeout(() => setLoadingPosts(false), 10000);
    return () => clearTimeout(timer);
  }, [loadingPosts]);

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
                  <Link to="/courses" className="btn btn-primary">Courses</Link>
                  <Link to="/courses" className="btn btn-primary">AI Course</Link>
                  <Link to="/contact" className="btn btn-outline">Get in touch</Link>
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
            <Link to="/courses" className="btn btn-outline home-courses__see-all">
              See all courses
            </Link>
          </div>
          <div className="home-courses__grid">
            <article className="home-course-card home-course-card--accent">
              <div className="home-course-card__body">
                <span className="home-course-card__badge">Coming soon</span>
                <h3 className="home-course-card__name">AI-first programming</h3>
                <p className="home-course-card__desc">
                  Build software with AI as your primary tool — short, focused lessons across the stack.
                </p>
                <a href={AI_FIRST_WAITLIST_MAILTO} className="btn btn-primary">
                  Join waitlist
                </a>
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
                    <h3 className="home-course-card__name">{featuredPlaylist.title}</h3>
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
            <a
              href="https://undefined.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              See full blog → undefined.sh
            </a>
          </div>

          {loadingPosts ? (
            <div className="home-writing__loading">Loading posts…</div>
          ) : (
            <div className="home-writing__posts">
              {posts.map((post, i) => (
                <PostCard key={i} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;
