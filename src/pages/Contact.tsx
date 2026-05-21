import { Briefcase, EnvelopeSimple, HandWaving, Rocket } from 'phosphor-react';
import { useTranslation, Trans } from 'react-i18next';
import { FooterSocialIcon } from '../components/molecules/FooterSocialIcon/FooterSocialIcon';
import { Seo } from '../components/Seo';
import { defaultDescription, titleForPage } from '../data/site';
import { useLangPrefix } from '../hooks/useLangPrefix';
import './pages.css';

const Contact: React.FC = () => {
  const { t } = useTranslation('contact');
  const prefix = useLangPrefix();

  return (
    <div className="page">
      <Seo title={titleForPage(t('seo.pageLabel'))} description={defaultDescription} path={`${prefix}/contact`} />
      <section className="page-hero">
        <span className="section-label">{t('hero.label')}</span>
        <h1 className="section-title">{t('hero.title')}</h1>
        <p className="contact-hero__lead">
          {t('hero.lead')}
        </p>
      </section>

      <section className="page-section">
        <div className="contact-intents">

          <div className="contact-intent">
            <div className="contact-intent__icon" aria-hidden="true">
              <HandWaving size={28} weight="regular" />
            </div>
            <div className="contact-intent__content">
              <span className="contact-intent__label">{t('intents.hi.label')}</span>
              <p className="contact-intent__body">
                {t('intents.hi.body')}
              </p>
              <div className="contact-intent__links">
                <a
                  href="https://x.com/guillermorodas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-intent__link"
                >
                  <FooterSocialIcon id="twitter" />
                  Twitter
                </a>
                <a
                  href="https://instagram.com/_guillermorodas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-intent__link"
                >
                  <FooterSocialIcon id="instagram" />
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <div className="contact-intent">
            <div className="contact-intent__icon" aria-hidden="true">
              <Rocket size={28} weight="regular" />
            </div>
            <div className="contact-intent__content">
              <span className="contact-intent__label">{t('intents.work.label')}</span>
              <p className="contact-intent__body">
                {t('intents.work.body')}
              </p>
              <div className="contact-intent__links">
                <a
                  href="mailto:me@guillermorodas.com"
                  className="contact-intent__link"
                >
                  <EnvelopeSimple size={16} weight="regular" />
                  me@guillermorodas.com
                </a>
              </div>
            </div>
          </div>

          <div className="contact-intent">
            <div className="contact-intent__icon" aria-hidden="true">
              <Briefcase size={28} weight="regular" />
            </div>
            <div className="contact-intent__content">
              <span className="contact-intent__label">{t('intents.job.label')}</span>
              <p className="contact-intent__body">
                {t('intents.job.body')}
              </p>
              <div className="contact-intent__links">
                <a
                  href="https://linkedin.com/in/guillermorodas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-intent__link"
                >
                  <FooterSocialIcon id="linkedin" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

        </div>

        <aside className="contact-language-note">
          <p className="contact-language-note__text">
            <Trans
              i18nKey="langNote.text"
              ns="contact"
              components={{
                twitter: (
                  <a href="https://x.com/guillermorodas" target="_blank" rel="noopener noreferrer" className="contact-language-note__link">
                    <FooterSocialIcon id="twitter" />
                  </a>
                ),
                bluesky: (
                  <a href="https://bsky.app/profile/guillermorodas.com" target="_blank" rel="noopener noreferrer" className="contact-language-note__link">
                    <FooterSocialIcon id="bluesky" />
                  </a>
                ),
                threads: (
                  <a href="https://threads.net/@_guillermorodas" target="_blank" rel="noopener noreferrer" className="contact-language-note__link">
                    <FooterSocialIcon id="threads" />
                  </a>
                ),
                mastodon: (
                  <a href="https://mastodon.cloud/@guillermorodas" target="_blank" rel="noopener noreferrer" className="contact-language-note__link">
                    <FooterSocialIcon id="mastodon" />
                  </a>
                ),
              }}
            />
          </p>
        </aside>
      </section>
    </div>
  );
};

export default Contact;
