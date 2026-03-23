import { Link } from 'react-router-dom';
import { footerSocials } from '../../data/socials';
import { FooterSocialIcon } from './FooterSocialIcon';
import './Footer.css';

const AI_WAITLIST =
  'mailto:me@guillermorodas.com?subject=AI-First%20Programming%20Course%20Waitlist';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          <div className="footer__col">
            <p className="footer__col-title">About me</p>
            <ul>
              <li>
                <a href="https://vitae.guillermorodas.com" target="_blank" rel="noopener noreferrer">
                  Professional profile
                </a>
              </li>
              <li><Link to="/about/history">My History</Link></li>
              <li><Link to="/about/lifestyle">Lifestyle</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <p className="footer__col-title">Courses</p>
            <ul>
              <li><Link to="/courses">All courses</Link></li>
              <li>
                <a href={AI_WAITLIST}>AI-First — join waitlist</a>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <p className="footer__col-title">Content</p>
            <ul>
              <li>
                <a href="https://undefined.sh" target="_blank" rel="noopener noreferrer">
                  Blog → undefined.sh
                </a>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <p className="footer__col-title">Contact</p>
            <ul>
              <li>
                <a href="mailto:me@guillermorodas.com">me@guillermorodas.com</a>
              </li>
              <li><Link to="/contact">Social &amp; email</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer__social">
          <span className="footer__social-label">Follow me</span>
          <div className="footer__social-icons">
            {footerSocials.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label={s.label}
                title={s.label}
              >
                <FooterSocialIcon id={s.id} />
              </a>
            ))}
          </div>
        </div>

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
