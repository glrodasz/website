import { useState, useEffect, useRef, type FC } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ArrowSquareOut, CaretDown } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { SITE_NAME, SITE_TAGLINE } from '../../../data/site';
import { useTheme } from '../../../hooks/useTheme';
import { useFocusTrap } from '../../../hooks/useFocusTrap';
import { useLangPrefix } from '../../../hooks/useLangPrefix';
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
  const [isAboutCollapsed, setIsAboutCollapsed] = useState(
    () => window.matchMedia('(max-width: 1169px)').matches
  );
  const aboutRef = useRef<HTMLLIElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const prefix = useLangPrefix();
  const location = useLocation();

  useFocusTrap(overlayRef, mobileOpen);

  const closeMobile = () => setMobileOpen(false);

  // Build the alternate-language URL by toggling the /es prefix.
  // Derived from pathname (not i18n.language) so it's always in sync with the URL.
  const altLangHref = (() => {
    const isEs = location.pathname.startsWith('/es');
    if (isEs) {
      return location.pathname.replace(/^\/es(\/|$)/, '/') || '/';
    }
    return `/es${location.pathname === '/' ? '' : location.pathname}`;
  })();

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

  useEffect(() => {
    if (!aboutOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAboutOpen(false);
    };
    const onClickOutside = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [aboutOpen]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1169px)');
    const onChange = (e: MediaQueryListEvent) => {
      setIsAboutCollapsed(e.matches);
      if (!e.matches) setAboutOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const themeLabel = theme === 'dark' ? t('nav.themeDark') : t('nav.themeLight');
  const ariaLabel = theme === 'dark' ? t('nav.switchToLight') : t('nav.switchToDark');

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

  const langSwitcher = (
    <Link
      to={altLangHref}
      className="qd-navigation__lang-switcher"
      aria-label={location.pathname.startsWith('/es') ? 'Switch to English' : 'Cambiar a Español'}
    >
      {t('nav.langSwitcher')}
    </Link>
  );

  return (
    <header className="qd-navigation">
      <nav className="qd-navigation__bar" aria-label="Main">
        <div className="qd-navigation__inner">
          <Link to={`${prefix}/`} className="qd-navigation__brand" onClick={closeMobile}>
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
                <NavLink to={`${prefix}/`} className={({ isActive }) => navLinkClass(isActive)} end>
                  {t('nav.home')}
                </NavLink>
              </li>
              <li
                className={[
                  'qd-navigation__about-item',
                  isAboutCollapsed && 'qd-navigation__about-item--collapsed',
                ]
                  .filter(Boolean)
                  .join(' ')}
                ref={aboutRef}
              >
                {/* Single morphing pill — animates between expanded and collapsed */}
                <div className="qd-navigation__about-group">
                  <button
                    type="button"
                    className="qd-navigation__about-label"
                    onClick={() => isAboutCollapsed && setAboutOpen((v) => !v)}
                    tabIndex={isAboutCollapsed ? 0 : -1}
                    aria-expanded={isAboutCollapsed ? aboutOpen : undefined}
                    aria-haspopup={isAboutCollapsed ? 'true' : undefined}
                  >
                    {t('nav.about')}
                    <span className="qd-navigation__about-caret" aria-hidden="true">
                      <CaretDown size={12} weight="bold" />
                    </span>
                  </button>
                  <div className="qd-navigation__about-sublinks">
                    <a
                      className={navLinkBtn}
                      href="https://vitae.guillermorodas.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={isAboutCollapsed ? -1 : 0}
                    >
                      {t('nav.professional')}
                      <ArrowSquareOut size={12} weight="regular" aria-hidden />
                    </a>
                    <NavLink
                      to={`${prefix}/about/history`}
                      className={({ isActive }) => navLinkClass(isActive)}
                      tabIndex={isAboutCollapsed ? -1 : 0}
                    >
                      {t('nav.myHistory')}
                    </NavLink>
                    <NavLink
                      to={`${prefix}/about/lifestyle`}
                      className={({ isActive }) => navLinkClass(isActive)}
                      tabIndex={isAboutCollapsed ? -1 : 0}
                    >
                      {t('nav.lifestyle')}
                    </NavLink>
                  </div>
                </div>

                {/* Dropdown — appears below the pill when collapsed and open */}
                {isAboutCollapsed && aboutOpen && (
                  <div className="qd-navigation__about-dropdown" role="menu">
                    <a
                      className="qd-navigation__about-dropdown-link"
                      href="https://vitae.guillermorodas.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setAboutOpen(false)}
                      role="menuitem"
                    >
                      {t('nav.professional')}
                      <ArrowSquareOut size={12} weight="regular" aria-hidden />
                    </a>
                    <NavLink
                      to={`${prefix}/about/history`}
                      className={({ isActive }) =>
                        [
                          'qd-navigation__about-dropdown-link',
                          isActive && 'qd-navigation__about-dropdown-link--active',
                        ]
                          .filter(Boolean)
                          .join(' ')
                      }
                      onClick={() => setAboutOpen(false)}
                      role="menuitem"
                    >
                      {t('nav.myHistory')}
                    </NavLink>
                    <NavLink
                      to={`${prefix}/about/lifestyle`}
                      className={({ isActive }) =>
                        [
                          'qd-navigation__about-dropdown-link',
                          isActive && 'qd-navigation__about-dropdown-link--active',
                        ]
                          .filter(Boolean)
                          .join(' ')
                      }
                      onClick={() => setAboutOpen(false)}
                      role="menuitem"
                    >
                      {t('nav.lifestyle')}
                    </NavLink>
                  </div>
                )}
              </li>
              <li>
                <a
                  className={navLinkBtn}
                  href="https://undefined.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('nav.blog')}
                  <ArrowSquareOut size={12} weight="regular" aria-hidden />
                </a>
              </li>
              <li>
                <a
                  className={navLinkBtn}
                  href="https://undefined.academy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('nav.bootcamp')}
                  <ArrowSquareOut size={12} weight="regular" aria-hidden />
                </a>
              </li>
              <li>
                <NavLink to={`${prefix}/courses`} className={({ isActive }) => navLinkClass(isActive)}>
                  {t('nav.courses')}
                </NavLink>
              </li>
              <li>
                <NavLink to={`${prefix}/contact`} className={({ isActive }) => navLinkClass(isActive)}>
                  {t('nav.contact')}
                </NavLink>
              </li>
            </ul>

            <div className="qd-navigation__theme-wrap qd-navigation__theme-wrap--desktop">
              {langSwitcher}
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
              aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={mobileOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop blur layer */}
      <div
        className={[
          'qd-navigation__backdrop',
          mobileOpen && 'qd-navigation__backdrop--open',
        ]
          .filter(Boolean)
          .join(' ')}
      />

      {/* Fullscreen overlay menu */}
      <div
        ref={overlayRef}
        className={[
          'qd-navigation__overlay',
          mobileOpen && 'qd-navigation__overlay--open',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden={!mobileOpen}
        aria-modal={mobileOpen ? 'true' : undefined}
        aria-label={t('nav.navigationMenu')}
        role="dialog"
        tabIndex={-1}
      >
        {/* Overlay header: brand + close button */}
        <div className="qd-navigation__overlay-header">
          <Link to={`${prefix}/`} className="qd-navigation__brand" onClick={closeMobile}>
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
            aria-label={t('nav.closeMenu')}
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
            to={`${prefix}/`}
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
              {t('nav.home').toUpperCase()}
              <span className="qd-navigation__overlay-arrow" aria-hidden="true">→</span>
            </span>
          </NavLink>

          <div className="qd-navigation__overlay-cell qd-navigation__overlay-cell--about">
            <span className="qd-navigation__overlay-num" aria-hidden="true">02</span>
            <span className="qd-navigation__overlay-section-label">{t('nav.about').toUpperCase()} —</span>
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
                  {t('nav.professional')}
                  <ArrowSquareOut size={14} weight="regular" aria-hidden />
                  <span className="qd-navigation__overlay-arrow" aria-hidden="true">→</span>
                </a>
              </li>
              <li>
                <NavLink
                  to={`${prefix}/about/history`}
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
                  {t('nav.myHistory')}
                  <span className="qd-navigation__overlay-arrow" aria-hidden="true">→</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`${prefix}/about/lifestyle`}
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
                  {t('nav.lifestyle')}
                  <span className="qd-navigation__overlay-arrow" aria-hidden="true">→</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Full-width rows */}
        <a
          className="qd-navigation__overlay-row"
          href="https://undefined.sh"
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMobile}
        >
          <span className="qd-navigation__overlay-num" aria-hidden="true">03</span>
          <span className="qd-navigation__overlay-item-name">
            {t('nav.blog').toUpperCase()}
            <ArrowSquareOut size={16} weight="regular" aria-hidden />
            <span className="qd-navigation__overlay-arrow" aria-hidden="true">→</span>
          </span>
        </a>

        <a
          className="qd-navigation__overlay-row"
          href="https://undefined.academy"
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMobile}
        >
          <span className="qd-navigation__overlay-num" aria-hidden="true">04</span>
          <span className="qd-navigation__overlay-item-name">
            {t('nav.bootcamp').toUpperCase()}
            <ArrowSquareOut size={16} weight="regular" aria-hidden />
            <span className="qd-navigation__overlay-arrow" aria-hidden="true">→</span>
          </span>
        </a>

        <NavLink
          to={`${prefix}/courses`}
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
          <span className="qd-navigation__overlay-num" aria-hidden="true">05</span>
          <span className="qd-navigation__overlay-item-name">
            {t('nav.courses').toUpperCase()}
            <span className="qd-navigation__overlay-arrow" aria-hidden="true">→</span>
          </span>
        </NavLink>

        <NavLink
          to={`${prefix}/contact`}
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
          <span className="qd-navigation__overlay-num" aria-hidden="true">06</span>
          <span className="qd-navigation__overlay-item-name">
            {t('nav.contact').toUpperCase()}
            <span className="qd-navigation__overlay-arrow" aria-hidden="true">→</span>
          </span>
        </NavLink>

        {/* Theme toggle + lang switcher */}
        <div className="qd-navigation__theme-wrap qd-navigation__theme-wrap--overlay">
          {langSwitcher}
          {themeToggle}
          <span className="qd-navigation__theme-label">{themeLabel}</span>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
