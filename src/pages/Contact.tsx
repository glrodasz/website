import { useState } from 'react';
import './pages.css';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    fetch('https://formspree.io/f/placeholder', {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    })
      .then(() => setSubmitted(true))
      .catch(() => setSubmitted(true));
  };

  return (
    <main className="page">
      <section className="page-hero">
        <span className="section-label">Contact</span>
        <h1 className="section-title">Say Hello</h1>
        <p style={{ fontSize: '1.1rem', color: '#aaaaaa' }}>
          It would be a pleasure to meet you
        </p>
      </section>

      <section className="page-section">
        <div className="contact-layout">
          <div className="contact-info">
            <h2 className="section-title" style={{ fontSize: '1.5rem' }}>Get in touch</h2>
            <a href="mailto:me@guillermorodas.com" className="contact-email">
              me@guillermorodas.com
            </a>
            <div className="contact-social">
              <a href="https://x.com/rodasdev" target="_blank" rel="noopener noreferrer" className="social-link">
                X / Twitter
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
                YouTube
              </a>
              <a href="https://instagram.com/guillermorodas" target="_blank" rel="noopener noreferrer" className="social-link">
                Instagram
              </a>
            </div>
          </div>

          <div className="contact-form-wrapper">
            {submitted ? (
              <div className="contact-success">
                <span style={{ fontSize: '2rem' }}>✅</span>
                <h3>Message sent!</h3>
                <p>Thanks for reaching out. I'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-field">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input id="name" name="name" type="text" required className="form-input" placeholder="Your name" />
                </div>
                <div className="form-field">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input id="email" name="email" type="email" required className="form-input" placeholder="your@email.com" />
                </div>
                <div className="form-field">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea id="message" name="message" required rows={6} className="form-input form-textarea" placeholder="What's on your mind?" />
                </div>
                <button type="submit" className="btn btn-primary">
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
