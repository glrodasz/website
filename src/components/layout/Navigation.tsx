import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const closeMobile = () => {
    setMobileOpen(false);
    setAboutOpen(false);
  };

  return (
    <header>
      <nav className="nav">
        <div className="nav__inner">
          <Link to="/" className="nav__logo" onClick={closeMobile}>
            guillermorodas.com
          </Link>

          {/* Desktop links */}
          <ul className="nav__links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`} end>
                Home
              </NavLink>
            </li>
            <li className="nav__dropdown">
              <span className="nav__link nav__dropdown-btn">
                About <span className="nav__arrow">▼</span>
              </span>
              <ul className="nav__dropdown-menu">
                <li>
                  <NavLink to="/about/professional" className={({ isActive }) => isActive ? 'active' : ''}>
                    Professional
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about/history" className={({ isActive }) => isActive ? 'active' : ''}>
                    History
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about/lifestyle" className={({ isActive }) => isActive ? 'active' : ''}>
                    Lifestyle
                  </NavLink>
                </li>
              </ul>
            </li>
            <li>
              <NavLink to="/courses" className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}>
                Courses
              </NavLink>
            </li>
            <li>
              <NavLink to="/talks" className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}>
                Talks
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}>
                Contact
              </NavLink>
            </li>
          </ul>

          {/* Hamburger */}
          <button
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
      </nav>

      {/* Mobile menu */}
      <div className={`nav__mobile${mobileOpen ? ' open' : ''}`}>
        <NavLink to="/" className="nav__mobile-link" onClick={closeMobile} end>
          Home
        </NavLink>

        <div>
          <button
            className="nav__mobile-link"
            style={{ width: '100%', background: '#F5E642', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            onClick={() => setAboutOpen((v) => !v)}
          >
            About <span className="nav__arrow" style={{ transform: aboutOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
          </button>
          {aboutOpen && (
            <div className="nav__mobile-sub">
              <NavLink to="/about/professional" onClick={closeMobile}>Professional</NavLink>
              <NavLink to="/about/history" onClick={closeMobile}>History</NavLink>
              <NavLink to="/about/lifestyle" onClick={closeMobile}>Lifestyle</NavLink>
            </div>
          )}
        </div>

        <NavLink to="/courses" className="nav__mobile-link" onClick={closeMobile}>
          Courses
        </NavLink>
        <NavLink to="/talks" className="nav__mobile-link" onClick={closeMobile}>
          Talks
        </NavLink>
        <NavLink to="/contact" className="nav__mobile-link" onClick={closeMobile}>
          Contact
        </NavLink>
      </div>
    </header>
  );
};

export default Navigation;
