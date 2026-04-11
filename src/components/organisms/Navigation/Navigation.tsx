import { useState, type FC } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { SITE_NAME, SITE_TAGLINE } from '../../../data/site';
import { useTheme } from '../../../hooks/useTheme';
import './Navigation.css';

export interface NavigationProps {
  /** Override the site name shown in the brand. */
  siteName?: string;
  /** Override the tagline shown under the site name. */
  siteTagline?: string;
  /** Path to the brand mark image. */
  brandMarkSrc?: string;
}

const navLinkBtn = 'qd-navigation__link-btn';

function navLinkClass(isActive: boolean) {
  return [navLinkBtn, isActive ? 'qd-navigation__link-btn--active' : '']
    .filter(Boolean)
    .join(' ');
}

export const Navigation: FC<NavigationProps> = ({
  siteName = SITE_NAME,
  siteTagline = SITE_TAGLINE,
  brandMarkSrc = '/favicon.svg',
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const closeMobile = () => {
    setMobileOpen(false);
    setAboutOpen(false);
  };

  const themeLabel = theme === 'dark' ? 'Dark' : 'Light';
  const ariaLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  const themeToggle = (
    <button
      type="button"
      className={[
        'qd-navigation__theme-toggle',
        theme === 'light' && 'qd-navigation__theme-toggle--light',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={toggleTheme}
      aria-label={ariaLabel}
    >
      <span className="qd-navigation__theme-track">
        <span className="qd-navigation__theme-knob" />
      </span>
    </button>
  );

  return (
    <header className="qd-navigation">
      <nav className="qd-navigation__bar" aria-label="Main">
        <div className="qd-navigation__inner">
          <Link to="/" className="qd-navigation__brand" onClick={closeMobile}>
            <img
              className="qd-navigation__brand-mark"
              src={brandMarkSrc}
              alt=""
              width={48}
              height={48}
            />
            <span className="qd-navigation__brand-text">
              <span className="qd-navigation__brand-name">{siteName}</span>
              <span className="qd-navigation__brand-tagline">{siteTagline}</span>
            </span>
          </Link>

          <div className="qd-navigation__cluster">
            <ul className="qd-navigation__links">
              <li>
                <NavLink to="/" className={({ isActive }) => navLinkClass(isActive)} end>
                  Home
                </NavLink>
              </li>
              <li className="qd-navigation__dropdown">
                <button
                  type="button"
                  className={`${navLinkBtn} qd-navigation__dropdown-btn`}
                >
                  About
                  <span className="qd-navigation__chevron" aria-hidden />
                </button>
                <ul className="qd-navigation__dropdown-menu">
                  <li>
                    <a
                      className="qd-navigation__dropdown-item"
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
                        [
                          'qd-navigation__dropdown-item',
                          isActive && 'qd-navigation__dropdown-item--active',
                        ]
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
                        [
                          'qd-navigation__dropdown-item',
                          isActive && 'qd-navigation__dropdown-item--active',
                        ]
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

            <div className="qd-navigation__theme-wrap qd-navigation__theme-wrap--desktop">
              {themeToggle}
              <span className="qd-navigation__theme-label">{themeLabel}</span>
            </div>

            <button
              type="button"
              className={[
                'qd-navigation__hamburger',
                mobileOpen && 'qd-navigation__hamburger--open',
              ]
                .filter(Boolean)
                .join(' ')}
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

      <div
        className={[
          'qd-navigation__mobile',
          mobileOpen && 'qd-navigation__mobile--open',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <NavLink
          to="/"
          className={`${navLinkBtn} qd-navigation__mobile-link`}
          onClick={closeMobile}
          end
        >
          Home
        </NavLink>

        <div className="qd-navigation__mobile-about">
          <button
            type="button"
            className={`${navLinkBtn} qd-navigation__mobile-link qd-navigation__mobile-about-btn`}
            onClick={() => setAboutOpen((v) => !v)}
            aria-expanded={aboutOpen}
          >
            About
            <span
              className={[
                'qd-navigation__chevron',
                'qd-navigation__chevron--mobile',
                aboutOpen && 'qd-navigation__chevron--mobile-open',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-hidden
            />
          </button>
          {aboutOpen && (
            <div className="qd-navigation__mobile-sub">
              <a
                className="qd-navigation__dropdown-item"
                href="https://vitae.guillermorodas.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobile}
              >
                Professional
              </a>
              <NavLink
                to="/about/history"
                className="qd-navigation__dropdown-item"
                onClick={closeMobile}
              >
                My History
              </NavLink>
              <NavLink
                to="/about/lifestyle"
                className="qd-navigation__dropdown-item"
                onClick={closeMobile}
              >
                Lifestyle
              </NavLink>
            </div>
          )}
        </div>

        <NavLink
          to="/courses"
          className={`${navLinkBtn} qd-navigation__mobile-link`}
          onClick={closeMobile}
        >
          Courses
        </NavLink>
        <NavLink
          to="/contact"
          className={`${navLinkBtn} qd-navigation__mobile-link`}
          onClick={closeMobile}
        >
          Contact
        </NavLink>

        <div className="qd-navigation__theme-wrap qd-navigation__theme-wrap--mobile">
          {themeToggle}
          <span className="qd-navigation__theme-label">{themeLabel}</span>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
