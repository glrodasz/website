import './pages.css';

interface TimelineEntry {
  period: string;
  company: string;
  role: string;
  bullets: string[];
}

const TIMELINE: TimelineEntry[] = [
  {
    period: '2020 – Present',
    company: 'EQT Group',
    role: 'Senior Full-stack Engineer',
    bullets: [
      'Building AI-powered deal intelligence tools used across the firm',
      'Leading the design system initiative to unify product UI',
      'Driving tech enablement and developer experience improvements',
    ],
  },
  {
    period: '2019 – 2020',
    company: 'Klarna',
    role: 'Engineer',
    bullets: [
      'Developed and maintained microfrontend UI packages',
      'Contributed to continuous delivery infrastructure',
    ],
  },
  {
    period: '2016 – 2019',
    company: 'Auth0',
    role: 'Engineer',
    bullets: [
      'Built features using Hapi.js, MongoDB, and React',
      'Introduced Storybook and snapshot testing to the team',
      'Became Auth0 Ambassador for community contributions',
    ],
  },
  {
    period: '2015 – 2016',
    company: 'Huge Inc.',
    role: 'Web Engineer',
    bullets: [
      'Developed a fintech application using React and Redux',
      'Ensured cross-browser and mobile compatibility',
      'Led technical onboarding and training for new engineers',
    ],
  },
  {
    period: '2012 – 2015',
    company: 'Komet Sales',
    role: 'Full-stack Developer',
    bullets: [
      'Architected frontend codebase from the ground up',
      'Led migration from SVN to Git',
      'Introduced and championed Scrum/Agile practices',
    ],
  },
];

interface EducationEntry {
  school: string;
  degree: string;
  year: string;
}

const EDUCATION: EducationEntry[] = [
  {
    school: 'Hyper Island',
    degree: 'UX Designer Upskill',
    year: '2023 – 2024',
  },
  {
    school: 'Universidad Nacional de Colombia',
    degree: 'Systems Engineering',
    year: 'Undergraduate',
  },
  {
    school: 'CENSA',
    degree: 'Digital Graphic Design',
    year: 'Diploma',
  },
];

const AboutHistory: React.FC = () => (
  <main className="page">
    <section className="page-hero">
      <span className="section-label">About</span>
      <h1 className="section-title">My Story</h1>
      <p style={{ fontSize: '1.05rem', color: '#cccccc', maxWidth: '640px', lineHeight: '1.7' }}>
        A journey across Latin America and Scandinavia, from early web experiments to building
        AI-powered products at a global investment firm.
      </p>
    </section>

    <hr className="section-divider" />

    <section className="page-section">
      <h2 className="section-title">Experience</h2>
      <div className="timeline">
        {TIMELINE.map((entry) => (
          <div key={entry.company} className="timeline__item">
            <div className="timeline__period">{entry.period}</div>
            <div className="timeline__company">{entry.company}</div>
            <div className="timeline__role">{entry.role}</div>
            <ul className="timeline__bullets">
              {entry.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>

    <hr className="section-divider" />

    <section className="page-section">
      <h2 className="section-title">Education</h2>
      <div className="education-grid">
        {EDUCATION.map((edu) => (
          <div key={edu.school} className="education-item">
            <div className="education-item__school">{edu.school}</div>
            <div className="education-item__degree">{edu.degree}</div>
            <div className="education-item__year">{edu.year}</div>
          </div>
        ))}
      </div>
    </section>
  </main>
);

export default AboutHistory;
