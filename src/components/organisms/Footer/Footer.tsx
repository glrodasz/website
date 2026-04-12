import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { footerSocials, type SocialLink } from '../../../data/socials';
import {
  FooterSocialIcon,
  FOOTER_MOBILE_SOCIAL_IDS,
} from '../../molecules/FooterSocialIcon';
import './Footer.css';

export interface FooterProps {
  /** Defaults to the current year. */
  year?: number;
  /** Override the default site social list. */
  socials?: SocialLink[];
}

const AI_WAITLIST =
  'mailto:me@guillermorodas.com?subject=AI-First%20Programming%20Course%20Waitlist';

export const Footer: FC<FooterProps> = ({
  year = new Date().getFullYear(),
  socials = footerSocials,
}) => {
  const mobileSocials: SocialLink[] = FOOTER_MOBILE_SOCIAL_IDS.map((id) =>
    socials.find((s) => s.id === id)
  ).filter((s): s is SocialLink => s != null);

  const socialLink = (s: SocialLink, strip: 'desktop' | 'mobile') => (
    <a
      key={`${strip}-${s.id}`}
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      className="qd-footer__social-link"
      aria-label={s.label}
      title={s.label}
    >
      <FooterSocialIcon id={s.id} />
    </a>
  );

  return (
    <footer className="qd-footer">
      <div className="qd-footer__inner">
        <div className="qd-footer__grid">
          <div className="qd-footer__col">
            <p className="qd-footer__col-title">About me</p>
            <ul>
              <li>
                <a
                  href="https://vitae.guillermorodas.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Professional profile
                </a>
              </li>
              <li>
                <Link to="/about/history">My History</Link>
              </li>
              <li>
                <Link to="/about/lifestyle">Lifestyle</Link>
              </li>
            </ul>
          </div>

          <div className="qd-footer__col">
            <p className="qd-footer__col-title">Courses</p>
            <ul>
              <li>
                <Link to="/courses">All courses</Link>
              </li>
              <li>
                <a href={AI_WAITLIST}>AI-First — join waitlist</a>
              </li>
            </ul>
          </div>

          <div className="qd-footer__col">
            <p className="qd-footer__col-title">Content</p>
            <ul>
              <li>
                <a href="https://undefined.sh" target="_blank" rel="noopener noreferrer">
                  Blog → undefined.sh
                </a>
              </li>
            </ul>
          </div>

          <div className="qd-footer__col">
            <p className="qd-footer__col-title">Contact</p>
            <ul>
              <li>
                <a href="mailto:me@guillermorodas.com">me@guillermorodas.com</a>
              </li>
              <li>
                <Link to="/contact">Social &amp; email</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="qd-footer__social">
          <span className="qd-footer__social-label">Follow me</span>
          <div className="qd-footer__social-icons qd-footer__social-icons--desktop">
            {socials.map((s) => socialLink(s, 'desktop'))}
          </div>
          <div className="qd-footer__social-icons qd-footer__social-icons--mobile">
            {mobileSocials.map((s) => socialLink(s, 'mobile'))}
          </div>
        </div>

        <div className="qd-footer__bottom">
          <p className="qd-footer__copyright">
            &copy; {year} All rights reserved Guillermo Rodas
          </p>
          <Link to="/" className="qd-footer__logo">
            guillermorodas.com
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
