import {
  FAVORITE_BOOKS,
  FAVORITE_FILMS,
  GOODREADS_PROFILE,
  LETTERBOXD_PROFILE,
} from '../data/lifestyle';
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
        <a
          href={GOODREADS_PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline lifestyle-external"
        >
          Goodreads profile →
        </a>
      </div>
      <ul className="lifestyle-grid lifestyle-grid--books">
        {FAVORITE_BOOKS.map((b) => (
          <li key={b.href}>
            <a href={b.href} target="_blank" rel="noopener noreferrer" className="lifestyle-book-card">
              {b.coverUrl ? (
                <img src={b.coverUrl} alt="" className="lifestyle-card__media" loading="lazy" />
              ) : (
                <div className="lifestyle-card__media-placeholder" aria-hidden="true">
                  📖
                </div>
              )}
              <div className="lifestyle-book-card__meta">
                <span className="lifestyle-book-card__title">{b.title}</span>
                {b.author && <span className="lifestyle-book-card__author">{b.author}</span>}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>

    <hr className="section-divider" />

    <section className="page-section">
      <div className="lifestyle-section-head">
        <h2 className="section-title">Favorite films</h2>
        <a
          href={LETTERBOXD_PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline lifestyle-external"
        >
          Letterboxd profile →
        </a>
      </div>
      <ul className="lifestyle-grid lifestyle-grid--films">
        {FAVORITE_FILMS.map((f) => (
          <li key={f.href}>
            <a href={f.href} target="_blank" rel="noopener noreferrer" className="lifestyle-film-card">
              {f.posterUrl ? (
                <img src={f.posterUrl} alt="" className="lifestyle-card__media" loading="lazy" />
              ) : (
                <div className="lifestyle-card__media-placeholder" aria-hidden="true">▶</div>
              )}
              <span className="lifestyle-film-card__title">{f.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  </main>
);

export default AboutLifestyle;
