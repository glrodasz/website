import { Seo } from '../components/Seo';
import { defaultDescription, titleForPage } from '../data/site';
import './pages.css';

const AboutHistory: React.FC = () => (
  <main className="page">
    <Seo title={titleForPage('My History')} description={defaultDescription} path="/about/history" />
    <section className="page-hero">
      <span className="section-label">About</span>
      <h1 className="section-title">My History</h1>
      <p className="about-placeholder__text">
        This page is coming soon.
      </p>
    </section>
  </main>
);

export default AboutHistory;
