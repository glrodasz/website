import './pages.css';

const AboutHistory: React.FC = () => (
  <main className="page">
    <section className="page-hero">
      <span className="section-label">About</span>
      <h1 className="section-title">My History</h1>
      <p
        className="about-placeholder__text"
        style={{
          fontSize: '1.05rem',
          color: 'var(--system-tokens--colors--foregrounds--contrast, #cccccc)',
          maxWidth: '640px',
          lineHeight: 1.7,
        }}
      >
        This page is coming soon.
      </p>
    </section>
  </main>
);

export default AboutHistory;
