import { contactSocials } from '../data/socials';
import './pages.css';

const Contact: React.FC = () => (
  <main className="page">
    <section className="page-hero">
      <span className="section-label">Contact</span>
      <h1 className="section-title">Say Hello</h1>
      <p className="contact-hero__lead">
        It would be a pleasure to meet you.
      </p>
    </section>

    <section className="page-section">
      <div className="contact-simple">
        <a href="mailto:me@guillermorodas.com" className="contact-email">
          me@guillermorodas.com
        </a>
        <h2 className="contact-simple__subtitle">Social</h2>
        <ul className="contact-social-list">
          {contactSocials.map((s) => (
            <li key={s.id}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-list__link"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  </main>
);

export default Contact;
