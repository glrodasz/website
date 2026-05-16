import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { footerSocials, type SocialLink } from '../../../data/socials';
import {
  FooterSocialIcon,
  FOOTER_MOBILE_SOCIAL_IDS,
} from '../../molecules/FooterSocialIcon';
import { useLangPrefix } from '../../../hooks/useLangPrefix';
import './Footer.css';

export interface FooterProps {
  /** Defaults to the current year. */
  year?: number;
  /** Override the default site social list. */
  socials?: SocialLink[];
}

export const Footer: FC<FooterProps> = ({
  year = new Date().getFullYear(),
  socials = footerSocials,
}) => {
  const { t } = useTranslation();
  const prefix = useLangPrefix();

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
            <h2 className="qd-footer__col-title">{t('footer.aboutMe')}</h2>
            <ul>
              <li>
                <a
                  href="https://vitae.guillermorodas.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('footer.professionalProfile')}
                </a>
              </li>
              <li>
                <Link to={`${prefix}/about/history`}>{t('footer.myHistory')}</Link>
              </li>
              <li>
                <Link to={`${prefix}/about/lifestyle`}>{t('footer.lifestyle')}</Link>
              </li>
            </ul>
          </div>

          <div className="qd-footer__col">
            <h2 className="qd-footer__col-title">{t('footer.courses')}</h2>
            <ul>
              <li>
                <Link to={`${prefix}/courses`}>{t('footer.allCourses')}</Link>
              </li>
              <li>
                <Link to={`${prefix}/courses#ai-first`}>{t('footer.joinWaitlist')}</Link>
              </li>
            </ul>
          </div>

          <div className="qd-footer__col">
            <h2 className="qd-footer__col-title">{t('footer.content')}</h2>
            <ul>
              <li>
                <a href="https://undefined.sh" target="_blank" rel="noopener noreferrer">
                  {t('footer.blog')}
                </a>
              </li>
              <li>
                <a href="https://undefined.academy" target="_blank" rel="noopener noreferrer">
                  {t('footer.bootcamp')}
                </a>
              </li>
            </ul>
          </div>

          <div className="qd-footer__col">
            <h2 className="qd-footer__col-title">{t('footer.contact')}</h2>
            <ul>
              <li>
                <a href="mailto:me@guillermorodas.com">{t('footer.email')}</a>
              </li>
              <li>
                <Link to={`${prefix}/contact`}>{t('footer.socialEmail')}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="qd-footer__social">
          <span className="qd-footer__social-label">{t('footer.followMe')}</span>
          <div className="qd-footer__social-icons qd-footer__social-icons--desktop">
            {socials.map((s) => socialLink(s, 'desktop'))}
          </div>
          <div className="qd-footer__social-icons qd-footer__social-icons--mobile">
            {mobileSocials.map((s) => socialLink(s, 'mobile'))}
          </div>
        </div>

        <div className="qd-footer__bottom">
          <p className="qd-footer__copyright">
            {t('footer.copyright', { year })}
          </p>
          <Link to={`${prefix}/`} className="qd-footer__logo">
            guillermorodas.com
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
