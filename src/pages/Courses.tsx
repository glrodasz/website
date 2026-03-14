import './pages.css';

const PAST_COURSES = [
  { platform: 'Platzi', detail: 'Multiple courses', years: '2018, 2019, 2023' },
  { platform: 'Código Facilito', detail: 'Bootcamp Instructor', years: '2022 – 2024' },
  { platform: 'Platzi Master', detail: 'Bootcamp Instructor', years: '2020 – 2022' },
  { platform: 'Undefined Academy', detail: 'Bootcamp Instructor', years: '2023' },
  { platform: 'World Tech Makers', detail: 'Instructor', years: '2017' },
];

const Courses: React.FC = () => (
  <main className="page">
    <section className="page-hero">
      <span className="section-label">Education</span>
      <h1 className="section-title">Courses</h1>
    </section>

    <section className="page-section">
      <div className="featured-course-card">
        <div className="featured-course-card__header">
          <span className="badge">Coming Soon</span>
        </div>
        <h2 className="featured-course-card__title">AI-First Programming Course</h2>
        <p className="featured-course-card__description">
          Learn to build software using AI as your primary tool. Covers JavaScript/TypeScript,
          Python, Go, and Rust through 5-minute focused video lessons. Designed for developers
          who want to move fast and build better with AI.
        </p>
        <a
          href="mailto:me@guillermorodas.com?subject=AI-First%20Programming%20Course%20Waitlist"
          className="btn btn-primary"
        >
          Join waitlist
        </a>
      </div>
    </section>

    <hr className="section-divider" />

    <section className="page-section">
      <h2 className="section-title">Past Teaching</h2>
      <div className="card-grid card-grid--3">
        {PAST_COURSES.map((course) => (
          <div key={course.platform + course.years} className="card">
            <div className="card__body">
              <div className="card__tag">{course.years}</div>
              <h3 className="card__title">{course.platform}</h3>
              <p className="card__excerpt">{course.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  </main>
);

export default Courses;
