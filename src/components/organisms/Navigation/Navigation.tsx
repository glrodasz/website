import { useState, useEffect, type FC } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ArrowSquareOut } from 'phosphor-react';
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
  const { theme, toggleTheme } = useTheme();

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

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
              <li className="qd-navigation__about-group">
                <span className="qd-navigation__about-label">About</span>
                <a
                  className={navLinkBtn}
                  href="https://vitae.guillermorodas.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Professional
                  <ArrowSquareOut size={12} weight="regular" aria-hidden />
                </a>
                <NavLink
                  to="/about/history"
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  My History
                </NavLink>
                <NavLink
                  to="/about/lifestyle"
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  Lifestyle
                </NavLink>
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

      {/* Fullscreen overlay menu */}
      <div
        className={[
          'qd-navigation__overlay',
          mobileOpen && 'qd-navigation__overlay--open',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden={!mobileOpen}
      >
        {/* Overlay header: brand + close button */}
        <div className="qd-navigation__overlay-header">
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
          <button
            type="button"
            className="qd-navigation__overlay-close"
            onClick={closeMobile}
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* 2-column grid: HOME | ABOUT */}
        <div className="qd-navigation__overlay-grid">
          <NavLink
            to="/"
            className={({ isActive }) =>
              [
                'qd-navigation__overlay-cell',
                'qd-navigation__overlay-cell--home',
                isActive && 'qd-navigation__overlay-cell--active',
              ]
                .filter(Boolean)
                .join(' ')
            }
            onClick={closeMobile}
            end
          >
            <span className="qd-navigation__overlay-num" aria-hidden="true">01</span>
            <span className="qd-navigation__overlay-item-name">
              HOME
              <span className="qd-navigation__overlay-arrow" aria-hidden="true">→</span>
            </span>
          </NavLink>

          <div className="qd-navigation__overlay-cell qd-navigation__overlay-cell--about">
            <span className="qd-navigation__overlay-num" aria-hidden="true">02</span>
            <span className="qd-navigation__overlay-section-label">ABOUT —</span>
            <ul className="qd-navigation__overlay-sub-list">
              <li>
                <a
                  className="qd-navigation__overlay-sub-link"
                  href="https://vitae.guillermorodas.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobile}
                >
                  <span className="qd-navigation__overlay-bullet" aria-hidden="true">•</span>
                  Professional
                  <ArrowSquareOut size={14} weight="regular" aria-hidden />
                  <span className="qd-navigation__overlay-arrow" aria-hidden="true">→</span>
                </a>
              </li>
              <li>
                <NavLink
                  to="/about/history"
                  className={({ isActive }) =>
                    [
                      'qd-navigation__overlay-sub-link',
                      isActive && 'qd-navigation__overlay-sub-link--active',
                    ]
                      .filter(Boolean)
                      .join(' ')
                  }
                  onClick={closeMobile}
                >
                  <span className="qd-navigation__overlay-bullet" aria-hidden="true">•</span>
                  My History
                  <span className="qd-navigation__overlay-arrow" aria-hidden="true">→</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about/lifestyle"
                  className={({ isActive }) =>
                    [
                      'qd-navigation__overlay-sub-link',
                      isActive && 'qd-navigation__overlay-sub-link--active',
                    ]
                      .filter(Boolean)
                      .join(' ')
                  }
                  onClick={closeMobile}
                >
                  <span className="qd-navigation__overlay-bullet" aria-hidden="true">•</span>
                  Lifestyle
                  <span className="qd-navigation__overlay-arrow" aria-hidden="true">→</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Full-width rows */}
        <NavLink
          to="/courses"
          className={({ isActive }) =>
            [
              'qd-navigation__overlay-row',
              isActive && 'qd-navigation__overlay-row--active',
            ]
              .filter(Boolean)
              .join(' ')
          }
          onClick={closeMobile}
        >
          <span className="qd-navigation__overlay-num" aria-hidden="true">03</span>
          <span className="qd-navigation__overlay-item-name">
            COURSES
            <span className="qd-navigation__overlay-arrow" aria-hidden="true">→</span>
          </span>
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            [
              'qd-navigation__overlay-row',
              isActive && 'qd-navigation__overlay-row--active',
            ]
              .filter(Boolean)
              .join(' ')
          }
          onClick={closeMobile}
        >
          <span className="qd-navigation__overlay-num" aria-hidden="true">04</span>
          <span className="qd-navigation__overlay-item-name">
            CONTACT
            <span className="qd-navigation__overlay-arrow" aria-hidden="true">→</span>
          </span>
        </NavLink>

        {/* Theme toggle */}
        <div className="qd-navigation__theme-wrap qd-navigation__theme-wrap--overlay">
          {themeToggle}
          <span className="qd-navigation__theme-label">{themeLabel}</span>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
