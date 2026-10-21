import { useTranslation } from 'react-i18next';
import { ArrowUpRight, GithubLogo } from 'phosphor-react';
import { ProjectCard } from '../components/organisms/ProjectCard';
import { IconButton } from '../components/molecules/IconButton';
import { Seo } from '../components/Seo';
import { communityImage } from '../data/communityImages';
import { COMMUNITY_PROJECTS, FUN_PROJECTS } from '../data/funProjects';
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

      <section className="page-section">
        <h2 className="section-title">{t('community.title')}</h2>
        <p className="page-section__lead">{t('community.lead')}</p>
        <ul className="card-grid card-grid--3 fun-projects__community">
          {COMMUNITY_PROJECTS.map((project) => {
            const image = communityImage(project.slug);
            return (
              <li key={project.slug} className="fun-projects__community-item">
                <div className="fun-projects__community-media">
                  {image ? (
                    <img src={image} alt="" loading="lazy" className="fun-projects__community-image" />
                  ) : (
                    <span className="fun-projects__community-placeholder" aria-hidden="true">
                      {new URL(project.url).host}
                    </span>
                  )}
                </div>
                <div className="fun-projects__community-body">
                  <h3 className="fun-projects__community-name">
                    <a href={project.url} target="_blank" rel="noopener noreferrer">
                      {project.name}
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                  </h3>
                  <p className="fun-projects__community-description">
                    {isEs ? project.descriptionEs : project.description}
                  </p>
                </div>
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
