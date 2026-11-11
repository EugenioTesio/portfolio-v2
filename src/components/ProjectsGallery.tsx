import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, ArrowRight, X } from 'lucide-react';
import { usePortfolioData } from '../data/portfolio';
import { ProjectItem } from '../types';

interface ProjectsGalleryProps {
  onSelectProject?: (projectId: string) => void;
}

export default function ProjectsGallery({ onSelectProject }: ProjectsGalleryProps) {
  const { t } = useTranslation();
  const { PROJECTS } = usePortfolioData();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'mobile' | 'backend' | 'devops' | 'iot'>('all');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  const filters = [
    { id: 'all', label: t('projects.filters.all') },
    { id: 'mobile', label: t('projects.filters.mobile') },
    { id: 'backend', label: t('projects.filters.backend') },
    { id: 'iot', label: t('projects.filters.iot') }
  ] as const;

  const filteredProjects = selectedFilter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === selectedFilter);

  const featuredProjects = filteredProjects.filter(project => project.featured);
  const otherProjects = filteredProjects.filter(project => !project.featured);

  const openProjectDetail = (project: ProjectItem) => {
    setActiveModalProject(project);
    if (onSelectProject) {
      onSelectProject(project.id);
    }
  };

  return (
    <section id="projects" className="py-[5.5rem] border-t border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-[65ch]">
            <h2 className="text-4xl sm:text-5xl font-semibold text-ink tracking-tight leading-snug">
              {t('projects.title')} {t('projects.titleHighlight')}
            </h2>
            <p className="text-xl leading-[1.6] text-muted">
              {t('projects.subtitle')}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                id={`project-filter-${f.id}`}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-base font-medium transition-colors ${
                  selectedFilter === f.id
                    ? 'bg-accent text-page'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {featuredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProjects.map((project) => (
              <article
                key={project.id}
                className="rounded-2xl bg-surface border border-line p-6 flex flex-col gap-4"
              >
                <p className="text-base text-faint">{project.categoryLabel}</p>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-ink">{project.title}</h3>
                  <p className="text-lg leading-relaxed text-muted">{project.tagline}</p>
                </div>
                <dl className="grid grid-cols-2 gap-4">
                  {project.metrics.slice(0, 2).map((metric) => (
                    <div key={metric.label}>
                      <dt className="text-base text-faint">{metric.label}</dt>
                      <dd className="text-lg font-semibold text-ink">{metric.value}</dd>
                    </div>
                  ))}
                </dl>
                <button
                  id={`view-project-btn-${project.id}`}
                  onClick={() => openProjectDetail(project)}
                  className="mt-auto inline-flex items-center gap-1.5 text-lg font-medium text-accent"
                >
                  <span>{t('projects.openCaseStudy')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </article>
            ))}
          </div>
        )}

        {otherProjects.length > 0 && (
          <ul className={`${featuredProjects.length > 0 ? 'mt-8' : ''} divide-y divide-line border-y border-line`}>
            {otherProjects.map((project) => (
              <li key={project.id} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="max-w-[65ch]">
                  <p className="text-base text-faint">{project.categoryLabel}</p>
                  <h3 className="text-xl font-semibold text-ink mt-1">{project.title}</h3>
                  <p className="text-lg leading-relaxed text-muted mt-1">{project.tagline}</p>
                </div>
                <button
                  id={`view-project-btn-${project.id}`}
                  onClick={() => openProjectDetail(project)}
                  className="inline-flex items-center gap-1.5 text-lg font-medium text-accent shrink-0"
                >
                  <span>{t('projects.openCaseStudy')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {activeModalProject && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-page">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface border border-line p-6 sm:p-8 space-y-6">
              <button
                id="close-project-modal-btn"
                onClick={() => setActiveModalProject(null)}
                className="absolute top-5 right-5 p-2 rounded-lg text-muted hover:text-ink"
                aria-label={t('projects.closeModal')}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2 pr-10 max-w-[65ch]">
                <p className="text-base text-faint">{activeModalProject.categoryLabel}</p>
                <h3 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tight leading-snug">
                  {activeModalProject.title}
                </h3>
                <p className="text-xl leading-[1.6] text-muted">
                  {activeModalProject.tagline}
                </p>
              </div>

              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {activeModalProject.metrics.map((metric) => (
                  <div key={metric.label}>
                    <dt className="text-base text-faint">{metric.label}</dt>
                    <dd className="text-lg font-semibold text-ink">{metric.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="space-y-2 max-w-[65ch]">
                <h4 className="text-base font-semibold text-ink">{t('projects.projectOverview')}</h4>
                <p className="text-xl leading-[1.6] text-muted">{activeModalProject.overview}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-base font-semibold text-ink">{t('projects.challenge')}</h4>
                  <p className="text-lg leading-relaxed text-muted">{activeModalProject.challenge}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-base font-semibold text-ink">{t('projects.solution')}</h4>
                  <p className="text-lg leading-relaxed text-muted">{activeModalProject.solution}</p>
                </div>
              </div>

              <div className="space-y-3 max-w-[65ch]">
                <h4 className="text-base font-semibold text-ink">{t('projects.architectureDecisions')}</h4>
                <ul className="space-y-2">
                  {activeModalProject.architectureHighlights.map((highlight) => (
                    <li key={highlight} className="text-lg leading-relaxed text-muted">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 max-w-[65ch]">
                <h4 className="text-base font-semibold text-ink">{t('projects.quantifiableResults')}</h4>
                <ul className="space-y-2">
                  {activeModalProject.results.map((result) => (
                    <li key={result} className="text-lg leading-relaxed text-muted">
                      {result}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-line">
                <h4 className="text-base font-semibold text-ink">{t('projects.fullTechStack')}</h4>
                <p className="text-base text-faint leading-relaxed">
                  {activeModalProject.technologies.join(' · ')}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3">
                  {activeModalProject.links?.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-accent text-page text-lg font-medium"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ))}
                </div>
                <button
                  onClick={() => setActiveModalProject(null)}
                  className="px-4 py-2.5 rounded-lg border border-line text-ink text-lg font-medium"
                >
                  {t('projects.closeCaseStudy')}
                </button>
              </div>
            </div>
          </div>
        )}
    </section>
  );
}
