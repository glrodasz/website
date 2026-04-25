import ReactMarkdown from 'react-markdown';
import { Seo } from '../components/Seo';
import { defaultDescription, titleForPage } from '../data/site';
import historyMarkdown from '../content/history.md?raw';
import './pages.css';
import './AboutHistory.css';

const markdownComponents = {
  a: ({ href, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  ),
};

const AboutHistory: React.FC = () => (
  <main className="page">
    <Seo title={titleForPage('My History')} description={defaultDescription} path="/about/history" />

    <section className="page-hero">
      <span className="section-label">About</span>
      <h1 className="section-title">My History</h1>
    </section>

    <hr className="section-divider" />

    <section className="page-section history-bio">
      <ReactMarkdown components={markdownComponents}>{historyMarkdown}</ReactMarkdown>
    </section>
  </main>
);

export default AboutHistory;
