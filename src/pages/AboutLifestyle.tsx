import './pages.css';

const AboutLifestyle: React.FC = () => (
  <main className="page">
    <section className="page-hero">
      <span className="section-label">About</span>
      <h1 className="section-title">Lifestyle</h1>
      <p style={{ fontSize: '1.1rem', color: '#cccccc', maxWidth: '680px', lineHeight: '1.7' }}>
        Born and raised in <strong style={{ color: '#ffffff' }}>Medellín, Colombia</strong> 🇨🇴 — now
        calling <strong style={{ color: '#ffffff' }}>Sweden</strong> 🇸🇪 home. Living between two
        very different cultures has shaped how I think about people, technology, and the world.
      </p>
    </section>

    <hr className="section-divider" />

    <section className="page-section">
      <h2 className="section-title">Interests</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px',
          marginTop: '24px',
        }}
      >
        {[
          { emoji: '🎓', title: 'Programming Education', desc: 'Teaching and mentoring developers to level up their careers.' },
          { emoji: '✍️', title: 'Technical Writing', desc: 'Breaking down complex topics into accessible, practical content.' },
          { emoji: '🤖', title: 'AI Development', desc: 'Exploring how AI changes the way we build and ship software.' },
          { emoji: '📹', title: 'Content Creation', desc: 'Creating videos, articles, and courses for developers.' },
        ].map((item) => (
          <div
            key={item.title}
            style={{
              background: '#242424',
              border: '1px solid #2e2e2e',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{item.emoji}</div>
            <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '8px' }}>{item.title}</div>
            <p style={{ fontSize: '0.9rem', color: '#aaaaaa', margin: 0, lineHeight: '1.6' }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <hr className="section-divider" />

    <section className="page-section">
      <h2 className="section-title">Follow Along</h2>
      <p style={{ color: '#cccccc', maxWidth: '560px', lineHeight: '1.7' }}>
        I share thoughts on software development, AI, and life as a developer on social media.
        Come say hi!
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '24px' }}>
        <a
          href="https://x.com/rodasdev"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          @rodasdev on X
        </a>
        <a
          href="https://x.com/guillermorodas"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          @guillermorodas on X
        </a>
      </div>
    </section>
  </main>
);

export default AboutLifestyle;
