import { useTranslation } from 'react-i18next';
import { GithubLogo } from 'phosphor-react';
import { ProjectCard } from '../components/organisms/ProjectCard';
import { IconButton } from '../components/molecules/IconButton';
import { Seo } from '../components/Seo';
import { FUN_PROJECTS } from '../data/funProjects';
import { projectScreenshot } from '../data/projectScreenshots';
import { titleForPage } from '../data/site';
import { useLangPrefix } from '../hooks/useLangPrefix';
import './pages.css';
import './FunProjects.css';

const GITHUB_PROFILE = 'https://github.com/glrodasz';

const FunProjects: React.FC = () => {
  const { t, i18n } = useTranslation('funProjects');
  const prefix = useLangPrefix();
  const isEs = i18n.language === 'es';

  return (
    <div className="page">
      <Seo
        title={titleForPage(t('seo.pageLabel'))}
        description={t('seo.description')}
        path={`${prefix}/projects`}
      />
      <section className="page-hero">
        <span className="section-label">{t('hero.label')}</span>
        <h1 className="section-title">{t('hero.title')}</h1>
        <p className="page-section__lead fun-projects__lead">{t('hero.lead')}</p>
      </section>

      <section className="page-section">
        <ul className="fun-projects__list">
          {FUN_PROJECTS.map((project) => {
            const name = { project: project.name };
            return (
              <li key={project.slug}>
                <ProjectCard
                  title={project.name}
                  description={isEs ? project.descriptionEs : project.description}
                  url={project.url}
                  repoUrl={project.repoUrl}
                  image={projectScreenshot(project.slug)}
                  imageAlt={t('card.screenshotAlt', name)}
                  tags={project.tags}
                  visitLabel={t('card.visit')}
                  sourceLabel={t('card.source')}
                  shareLabel={t('card.share')}
                  shareText={t('card.shareText', name)}
                  shareOnLabel={(network) => t('card.shareOn', { ...name, network })}
                  shareNativeLabel={t('card.shareNative', name)}
                  copyLinkLabel={t('card.copyLink', name)}
                  copiedLabel={t('card.copied')}
                />
              </li>
            );
          })}
        </ul>
      </section>

      <hr className="section-divider" />

      <section className="page-section fun-projects__more">
        <h2 className="section-title">{t('more.title')}</h2>
        <p className="page-section__lead">{t('more.lead')}</p>
        <IconButton
          variant="secondary"
          size="large"
          href={GITHUB_PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          icon={<GithubLogo size={20} weight="bold" aria-hidden />}
          label={t('more.cta')}
        />
      </section>
    </div>
  );
};

export default FunProjects;
