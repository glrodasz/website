import { Briefcase, EnvelopeSimple, HandWaving, Rocket } from 'phosphor-react';
import { FooterSocialIcon } from '../components/molecules/FooterSocialIcon/FooterSocialIcon';
import { Seo } from '../components/Seo';
import { defaultDescription, titleForPage } from '../data/site';
import './pages.css';

const Contact: React.FC = () => (
  <main className="page">
    <Seo title={titleForPage('Contact')} description={defaultDescription} path="/contact" />
    <section className="page-hero">
      <span className="section-label">Contact</span>
      <h1 className="section-title">Say Hello</h1>
      <p className="contact-hero__lead">
        Pick the right channel for what you have in mind.
      </p>
    </section>

    <section className="page-section">
      <div className="contact-intents">

        <div className="contact-intent">
          <div className="contact-intent__icon" aria-hidden="true">
            <HandWaving size={28} weight="regular" />
          </div>
          <div className="contact-intent__content">
            <span className="contact-intent__label">Just saying hi?</span>
            <p className="contact-intent__body">
              Drop a quick hello or ask any question — I&apos;m always happy to hear from you. Slide into my DMs on Twitter or Instagram.
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
            <span className="contact-intent__label">Want to work on something together?</span>
            <p className="contact-intent__body">
              I&apos;ve worked with several startups and I do entrepreneurship myself — so I know the difference between a bare idea and a real project. If you have more than just a concept and a solid deal to offer, write me directly.
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
            <span className="contact-intent__label">Job offer or career advice?</span>
            <p className="contact-intent__body">
              LinkedIn is the right place for professional conversations. Write me directly there.
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
          I write in Spanish on{' '}
          <a href="https://x.com/guillermorodas" target="_blank" rel="noopener noreferrer" className="contact-language-note__link">
            <FooterSocialIcon id="twitter" />
            Twitter
          </a>
          . If you&apos;d rather follow me in English, you&apos;ll find me on{' '}
          <a href="https://bsky.app/profile/guillermorodas.com" target="_blank" rel="noopener noreferrer" className="contact-language-note__link">
            <FooterSocialIcon id="bluesky" />
            Bluesky
          </a>
          ,{' '}
          <a href="https://threads.net/@_guillermorodas" target="_blank" rel="noopener noreferrer" className="contact-language-note__link">
            <FooterSocialIcon id="threads" />
            Threads
          </a>
          , or{' '}
          <a href="https://mastodon.cloud/@guillermorodas" target="_blank" rel="noopener noreferrer" className="contact-language-note__link">
            <FooterSocialIcon id="mastodon" />
            Mastodon
          </a>
          .
        </p>
      </aside>
    </section>
  </main>
);

export default Contact;
