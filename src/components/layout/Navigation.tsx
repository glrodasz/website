import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navigation.css';
import { SITE_NAME, SITE_TAGLINE } from '../../data/site';

const navLinkBtn = 'nav__link-btn';

function navLinkClass(isActive: boolean) {
  return [navLinkBtn, isActive ? 'nav__link-btn--active' : ''].filter(Boolean).join(' ');
}

const Navigation: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const closeMobile = () => {
    setMobileOpen(false);
    setAboutOpen(false);
  };

  return (
    <header className="site-header">
      <nav className="nav" aria-label="Main">
        <div className="nav__inner">
          <Link to="/" className="nav__brand" onClick={closeMobile}>
            <img
              className="nav__brand-mark"
              src="/favicon.svg"
              alt=""
              width={40}
              height={40}
            />
            <span className="nav__brand-text">
              <span className="nav__brand-name">{SITE_NAME}</span>
              <span className="nav__brand-tagline">{SITE_TAGLINE}</span>
            </span>
          </Link>

          <div className="nav__cluster">
            <ul className="nav__links">
              <li>
                <NavLink to="/" className={({ isActive }) => navLinkClass(isActive)} end>
                  Home
                </NavLink>
              </li>
              <li className="nav__dropdown">
                <button type="button" className={`${navLinkBtn} nav__dropdown-btn`}>
                  About
                  <span className="nav__chevron" aria-hidden />
                </button>
                <ul className="nav__dropdown-menu">
                  <li>
                    <a
                      className="nav__dropdown-item"
                      href="https://vitae.guillermorodas.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Professional
                    </a>
                  </li>
                  <li>
                    <NavLink
                      to="/about/history"
                      className={({ isActive }) =>
                        ['nav__dropdown-item', isActive ? 'nav__dropdown-item--active' : '']
                          .filter(Boolean)
                          .join(' ')
                      }
                    >
                      My History
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/about/lifestyle"
                      className={({ isActive }) =>
                        ['nav__dropdown-item', isActive ? 'nav__dropdown-item--active' : '']
                          .filter(Boolean)
                          .join(' ')
                      }
                    >
                      Lifestyle
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li>
                <NavLink to="/courses" className={({ isActive }) => navLinkClass(isActive)}>
                  Courses
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={({ isActive }) => navLinkClass(isActive)}>
                  Contact
                </NavLink>
              </li>
            </ul>

            <div className="nav__theme-wrap nav__theme-wrap--desktop">
              <button
                type="button"
                className="nav__theme-toggle"
                disabled
                aria-label="Theme (coming soon)"
              >
                <span className="nav__theme-track">
                  <span className="nav__theme-knob" />
                </span>
              </button>
              <span className="nav__theme-label">Light</span>
            </div>

            <button
              type="button"
              className={`nav__hamburger${mobileOpen ? ' open' : ''}`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`nav__mobile${mobileOpen ? ' open' : ''}`}>
        <NavLink to="/" className={`${navLinkBtn} nav__mobile-link`} onClick={closeMobile} end>
          Home
        </NavLink>

        <div className="nav__mobile-about">
          <button
            type="button"
            className={`${navLinkBtn} nav__mobile-link nav__mobile-about-btn`}
            onClick={() => setAboutOpen((v) => !v)}
            aria-expanded={aboutOpen}
          >
            About
            <span className={`nav__chevron nav__chevron--mobile${aboutOpen ? ' open' : ''}`} aria-hidden />
          </button>
          {aboutOpen && (
            <div className="nav__mobile-sub">
              <a
                className="nav__dropdown-item"
                href="https://vitae.guillermorodas.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobile}
              >
                Professional
              </a>
              <NavLink
                to="/about/history"
                className="nav__dropdown-item"
                onClick={closeMobile}
              >
                My History
              </NavLink>
              <NavLink
                to="/about/lifestyle"
                className="nav__dropdown-item"
                onClick={closeMobile}
              >
                Lifestyle
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/courses" className={`${navLinkBtn} nav__mobile-link`} onClick={closeMobile}>
          Courses
        </NavLink>
        <NavLink to="/contact" className={`${navLinkBtn} nav__mobile-link`} onClick={closeMobile}>
          Contact
        </NavLink>

        <div className="nav__theme-wrap nav__theme-wrap--mobile">
          <button type="button" className="nav__theme-toggle" disabled aria-label="Theme (coming soon)">
            <span className="nav__theme-track">
              <span className="nav__theme-knob" />
            </span>
          </button>
          <span className="nav__theme-label">Light</span>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
