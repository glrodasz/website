import {
  FAVORITE_BOOKS,
  FAVORITE_FILMS,
  GOODREADS_PROFILE,
  LETTERBOXD_PROFILE,
} from '../data/lifestyle';
import { Button } from '../components/atoms/Button';
import { LifestyleMediaCard } from '../components/molecules/LifestyleMediaCard';
import { Seo } from '../components/Seo';
import { defaultDescription, titleForPage } from '../data/site';
import './pages.css';
import './AboutLifestyle.css';

const AboutLifestyle: React.FC = () => (
  <main className="page">
    <Seo title={titleForPage('Lifestyle')} description={defaultDescription} path="/about/lifestyle" />
    <section className="page-hero">
      <span className="section-label">About</span>
      <h1 className="section-title">Lifestyle</h1>
      <p className="lifestyle-intro">
        Books and films I keep coming back to — plus where to find more on{' '}
        <a href={GOODREADS_PROFILE} target="_blank" rel="noopener noreferrer">Goodreads</a>
        {' '}and{' '}
        <a href={LETTERBOXD_PROFILE} target="_blank" rel="noopener noreferrer">Letterboxd</a>.
      </p>
    </section>

    <hr className="section-divider" />

    <section className="page-section">
      <div className="lifestyle-section-head">
        <h2 className="section-title">Favorite books</h2>
        <Button
          href={GOODREADS_PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
          className="lifestyle-external"
        >
          Goodreads profile →
        </Button>
      </div>
      <ul className="lifestyle-grid">
        {FAVORITE_BOOKS.map((b) => (
          <li key={b.href}>
            <LifestyleMediaCard
              href={b.href}
              imageUrl={b.coverUrl}
              title={b.title}
              subtitle={b.author}
              placeholder="📖"
            />
          </li>
        ))}
      </ul>
    </section>

    <hr className="section-divider" />

    <section className="page-section">
      <div className="lifestyle-section-head">
        <h2 className="section-title">Favorite films</h2>
        <Button
          href={LETTERBOXD_PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
          className="lifestyle-external"
        >
          Letterboxd profile →
        </Button>
      </div>
      <ul className="lifestyle-grid">
        {FAVORITE_FILMS.map((f) => (
          <li key={f.href}>
            <LifestyleMediaCard
              href={f.href}
              imageUrl={f.posterUrl}
              title={f.title}
              placeholder="▶"
            />
          </li>
        ))}
      </ul>
    </section>
  </main>
);

export default AboutLifestyle;
