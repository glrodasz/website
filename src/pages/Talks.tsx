import './pages.css';

const TALKS = [
  {
    title: 'AI and Humans: Invincible Innovation',
    subtitle: 'Staying Ahead in AI: Practical Insights for Developers',
    events: [{ event: 'Invincible Innovation', date: 'April 2025' }],
  },
  {
    title: 'WebAuthn & Passkeys: The Future of Authentication',
    subtitle: '',
    events: [
      { event: 'DevFest Singapore / EpicHey!', date: 'November 2023' },
      { event: 'DevFest Zagreb', date: 'October 2023' },
    ],
  },
  {
    title: 'Why everyone should do streaming live coding?',
    subtitle: '',
    events: [
      { event: 'DevFest Stockholm', date: 'December 2022' },
      { event: 'Nerdearla', date: 'August 2022' },
    ],
  },
  {
    title: 'Online Teacher',
    subtitle: '',
    events: [
      { event: 'Platzi', date: 'December 2018' },
      { event: 'Platzi', date: 'July 2019' },
      { event: 'Platzi', date: 'March 2023' },
      { event: 'Código Facilito', date: 'September 2023' },
    ],
  },
];

const PODCASTS = [
  {
    show: 'freeCodeCamp en Español',
    title: 'From Java to JavaScript',
    date: 'December 2023',
  },
  {
    show: 'Humans of Platzi',
    title: 'The power of English and networking',
    date: 'July 2023',
  },
  {
    show: 'EnPixeles',
    title: 'Creating communities in post-pandemic',
    date: 'December 2021',
  },
];

const Talks: React.FC = () => (
  <main className="page">
    <section className="page-hero">
      <span className="section-label">Speaking</span>
      <h1 className="section-title">Talks</h1>
      <p style={{ fontSize: '1.1rem', color: '#aaaaaa', marginTop: '8px' }}>
        Conferences, meetups, and podcast appearances
      </p>
    </section>

    <section className="page-section">
      <div className="talks-list">
        {TALKS.map((talk) => (
          <div key={talk.title} className="talk-item">
            <h2 className="talk-item__title">{talk.title}</h2>
            {talk.subtitle && (
              <p className="talk-item__subtitle">{talk.subtitle}</p>
            )}
            <div className="talk-item__events">
              {talk.events.map((e) => (
                <span key={e.event + e.date} className="talk-item__event-tag">
                  {e.event} · {e.date}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>

    <hr className="section-divider" />

    <section className="page-section">
      <h2 className="section-title">Podcasts</h2>
      <div className="card-grid card-grid--3">
        {PODCASTS.map((pod) => (
          <div key={pod.show + pod.date} className="card">
            <div className="card__body">
              <div className="card__meta">{pod.date}</div>
              <div className="card__tag">{pod.show}</div>
              <h3 className="card__title">{pod.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  </main>
);

export default Talks;
