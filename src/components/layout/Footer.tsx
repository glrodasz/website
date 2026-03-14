import { Link } from 'react-router-dom';
import './Footer.css';

const XIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.264 5.633 5.9-5.633Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YouTubeIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const InstagramIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          {/* About me */}
          <div className="footer__col">
            <p className="footer__col-title">About me</p>
            <ul>
              <li><Link to="/about/professional">Professional profile</Link></li>
              <li><Link to="/about/history">My Story</Link></li>
              <li><Link to="/about/lifestyle">Lifestyle</Link></li>
            </ul>
          </div>

          {/* Courses */}
          <div className="footer__col">
            <p className="footer__col-title">Courses</p>
            <ul>
              <li><Link to="/courses">AI-First Programming Course</Link></li>
              <li><Link to="/courses">Past courses</Link></li>
            </ul>
          </div>

          {/* Content */}
          <div className="footer__col">
            <p className="footer__col-title">Content</p>
            <ul>
              <li><Link to="/talks">Talks</Link></li>
              <li>
                <a href="https://undefined.sh" target="_blank" rel="noopener noreferrer">
                  Blog → undefined.sh
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <p className="footer__col-title">Contact</p>
            <ul>
              <li>
                <a href="mailto:me@guillermorodas.com">me@guillermorodas.com</a>
              </li>
              <li>
                <Link to="/contact">Send me a message</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social icons */}
        <div className="footer__social">
          <span className="footer__social-label">Follow me</span>
          <a
            href="https://x.com/rodasdev"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__social-link"
            aria-label="X / Twitter @rodasdev"
          >
            <XIcon />
          </a>
          <a
            href="https://youtube.com/@guillermorodas"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__social-link"
            aria-label="YouTube"
          >
            <YouTubeIcon />
          </a>
          <a
            href="https://instagram.com/guillermorodas"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__social-link"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {currentYear} All rights reserved Guillermo Rodas
          </p>
          <Link to="/" className="footer__logo">guillermorodas.com</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
