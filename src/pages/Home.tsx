import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

    // Try to find cover image in content or enclosure
    const enclosureUrl = item.querySelector('enclosure')?.getAttribute('url') ?? '';
    const mediaContent = item.querySelector('content')?.getAttribute('url') ?? '';
    const cover = enclosureUrl || mediaContent || '';

    // Strip HTML from description for excerpt
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

const RECENT_TALKS = [
  {
    event: 'Invincible Innovation · April 2025',
    title: 'AI and Humans: Staying Ahead in AI — Practical Insights for Developers',
  },
  {
    event: 'DevFest Singapore / EpicHey! · Nov 2023',
    title: 'WebAuthn & Passkeys: The Future of Authentication',
  },
];

const Home: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>(STATIC_POSTS);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    const RSS_URL = 'https://undefined.sh/rss.xml';
    const PROXY = `https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}`;

    const fetchPosts = async () => {
      try {
        // Try direct fetch first
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
        // Direct fetch failed, try proxy
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
        // Both failed, keep static posts
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
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero__content">
          <span className="home-hero__label">Welcome</span>
          <h1 className="home-hero__title">
            Hello, I'm <span className="accent">Guillermo Rodas</span>,
          </h1>
          <p className="home-hero__subtitle">
            and I help developers improve their skills while creating quality products.
          </p>
          <div className="home-hero__location">
            <span className="home-hero__location-tag">🇨🇴 From Colombia</span>
            <span className="home-hero__location-tag">🇸🇪 Living in Sweden</span>
          </div>
          <div className="home-hero__ctas">
            <Link to="/courses" className="btn btn-primary">Courses</Link>
            <Link to="/courses" className="btn btn-primary">AI Course</Link>
            <Link to="/contact" className="btn btn-outline">Get in touch</Link>
          </div>
        </div>
        <div className="home-hero__photo" aria-hidden="true">
          <div className="home-hero__photo-placeholder">
            <span className="home-hero__photo-placeholder-icon">👤</span>
            <span>Photo coming soon</span>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* Intro Video */}
      <section className="home-video">
        <div className="home-video__inner">
          <div className="home-video__label-col">
            <span className="home-video__eyebrow">Intro</span>
            <span className="home-video__label-text">Watch intro</span>
          </div>
          <div className="home-video__embed" aria-label="Intro video placeholder">
            <div className="home-video__play-icon" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Teaching */}
      <section className="home-teaching">
        <div className="home-teaching__content">
          <span className="home-teaching__label">Education</span>
          <h2 className="home-teaching__title">I'm an online teacher</h2>
          <p className="home-teaching__copy">
            Over the past decade I've taught thousands of developers through online platforms,
            bootcamps, and workshops. My courses focus on practical, real-world JavaScript,
            React, Node.js, and modern web development — helping you grow from junior to senior.
          </p>
          <Link to="/courses" className="btn btn-primary">See my courses</Link>
        </div>
        <div className="home-teaching__visual" aria-hidden="true">
          <div className="home-teaching__platform home-teaching__platform--featured">Platzi</div>
          <div className="home-teaching__platform">Código Facilito</div>
          <div className="home-teaching__platform">Platzi Master</div>
          <div className="home-teaching__platform">Undefined Academy</div>
          <div className="home-teaching__platform">World Tech Makers</div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* Writing / Blog */}
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

      {/* Talks Preview */}
      <section className="home-talks">
        <div className="home-talks__header">
          <h2 className="home-talks__title">Talks</h2>
          <Link to="/talks" className="btn btn-outline">See all talks</Link>
        </div>
        <div className="home-talks__grid">
          {RECENT_TALKS.map((talk, i) => (
            <div key={i} className="talk-card">
              <div className="talk-card__event">{talk.event}</div>
              <h3 className="talk-card__title">{talk.title}</h3>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
