import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { Seo } from '../components/Seo';
import { defaultDescription, titleForPage } from '../data/site';
import { useLangPrefix } from '../hooks/useLangPrefix';
import historyEn from '../content/history.md?raw';
import historyEs from '../content/history.es.md?raw';
import './pages.css';
import './AboutHistory.css';

const markdownComponents = {
  a: ({ href, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  ),
};

const AboutHistory: React.FC = () => {
  const { t, i18n } = useTranslation('about');
  const prefix = useLangPrefix();
  const historyMarkdown = i18n.language === 'es' ? historyEs : historyEn;

  return (
    <div className="page">
      <Seo title={titleForPage(t('history.seo.pageLabel'))} description={defaultDescription} path={`${prefix}/about/history`} />

      <section className="page-hero">
        <span className="section-label">{t('history.hero.label')}</span>
        <h1 className="section-title">{t('history.hero.title')}</h1>
      </section>

      <hr className="section-divider" />

      <section className="page-section history-bio">
        <ReactMarkdown components={markdownComponents}>{historyMarkdown}</ReactMarkdown>
      </section>
    </div>
  );
};

export default AboutHistory;
