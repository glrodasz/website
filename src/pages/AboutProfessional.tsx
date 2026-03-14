import './pages.css';

interface Skill {
  name: string;
  years?: string;
}

const SKILLS: Skill[] = [
  { name: 'JavaScript', years: '13y' },
  { name: 'React', years: '10y' },
  { name: 'Node.js', years: '9y' },
  { name: 'TypeScript', years: '7y' },
  { name: 'GraphQL', years: '6y' },
  { name: 'PostgreSQL', years: '8y' },
  { name: 'MongoDB', years: '8y' },
  { name: 'AWS / GCP', years: '5y' },
  { name: 'Docker / Kubernetes', years: '5y' },
  { name: 'Next.js', years: '5y' },
  { name: 'Auth0 / OIDC', years: '7y' },
];

interface Language {
  flag: string;
  name: string;
  level: string;
}

const LANGUAGES: Language[] = [
  { flag: '🇬🇧', name: 'English', level: 'Fluent' },
  { flag: '🇪🇸', name: 'Spanish', level: 'Native' },
  { flag: '🇸🇪', name: 'Swedish', level: 'Elementary' },
];

const AboutProfessional: React.FC = () => (
  <main className="page">
    <section className="page-hero">
      <span className="section-label">About</span>
      <h1 className="section-title">Professional Profile</h1>
      <p style={{ fontSize: '1.1rem', color: '#cccccc', maxWidth: '680px', lineHeight: '1.7' }}>
        Senior Full-stack JavaScript Engineer with <strong style={{ color: '#ffffff' }}>13+ years</strong> of
        experience building scalable web applications. Currently at{' '}
        <strong style={{ color: '#F5E642' }}>EQT Group</strong>, driving AI initiatives and engineering
        excellence across the organisation. Passionate about developer education, design systems, and
        the intersection of AI and modern software development.
      </p>
      <div className="cta-group" style={{ marginTop: '32px' }}>
        <a
          href="https://vitae.guillermorodas.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          View full CV → vitae.guillermorodas.com
        </a>
      </div>
    </section>

    <hr className="section-divider" />

    <section className="page-section">
      <h2 className="section-title">Technical Skills</h2>
      <div className="skills-grid">
        {SKILLS.map((skill) => (
          <div key={skill.name} className="skill-item">
            <div className="skill-item__name">{skill.name}</div>
            {skill.years && <div className="skill-item__years">{skill.years}</div>}
          </div>
        ))}
      </div>
    </section>

    <hr className="section-divider" />

    <section className="page-section">
      <h2 className="section-title">Recognitions</h2>
      <div className="recognitions-list">
        <div className="recognition-item">
          <div>
            <div className="recognition-item__title">Auth0 Ambassador (former)</div>
            <div className="recognition-item__sub">Recognised for contributions to the Auth0 developer community</div>
          </div>
        </div>
        <div className="recognition-item">
          <div>
            <div className="recognition-item__title">Online Teacher at Platzi</div>
            <div className="recognition-item__sub">Instructor for JavaScript, React, and Node.js courses — 2018, 2019, 2023</div>
          </div>
        </div>
        <div className="recognition-item">
          <div>
            <div className="recognition-item__title">Online Teacher at Código Facilito</div>
            <div className="recognition-item__sub">Instructor and bootcamp lead — 2022–2024</div>
          </div>
        </div>
      </div>
    </section>

    <hr className="section-divider" />

    <section className="page-section">
      <h2 className="section-title">Languages</h2>
      <div className="languages-list">
        {LANGUAGES.map((lang) => (
          <div key={lang.name} className="language-item">
            <span className="language-item__flag" aria-hidden="true">{lang.flag}</span>
            <div>
              <div className="language-item__name">{lang.name}</div>
              <div className="language-item__level">{lang.level}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </main>
);

export default AboutProfessional;
