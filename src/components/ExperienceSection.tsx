import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, ChevronDown, ChevronUp, X } from 'lucide-react';
import { usePortfolioData } from '../data/portfolio';

interface ExperienceSectionProps {
  selectedCapabilityId: string | null;
  onClearCapabilityFilter: () => void;
  onNavigateToProjects: () => void;
}

export default function ExperienceSection({
  selectedCapabilityId,
  onClearCapabilityFilter,
  onNavigateToProjects
}: ExperienceSectionProps) {
  const { t } = useTranslation();
  const { EXPERIENCES, CAPABILITIES } = usePortfolioData();
  const [expandedRoles, setExpandedRoles] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string, currentlyExpanded: boolean) => {
    setExpandedRoles(prev => ({
      ...prev,
      [id]: !currentlyExpanded
    }));
  };

  const selectedCapability = CAPABILITIES.find(c => c.id === selectedCapabilityId);

  const displayedExperiences = selectedCapabilityId
    ? EXPERIENCES.filter(e => e.backedCapabilities.includes(selectedCapabilityId))
    : EXPERIENCES;

  return (
    <section id="experience" className="py-[5.5rem] border-t border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-[65ch]">
            <h2 className="text-4xl sm:text-5xl font-semibold text-ink tracking-tight leading-snug">
              {t('experience.title')} {t('experience.titleHighlight')}
            </h2>
            <p className="text-xl leading-[1.6] text-muted">
              {t('experience.subtitle')}
            </p>
          </div>

          <button
            onClick={onNavigateToProjects}
            className="self-start md:self-auto text-lg font-medium text-accent underline underline-offset-4"
          >
            {t('experience.exploreProjects')}
          </button>
        </div>

        <AnimatePresence>
          {selectedCapability && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-8 p-4 rounded-2xl bg-surface border border-line flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-base text-faint">{t('experience.filteringFor')}</p>
                <p className="text-base font-semibold text-ink">{selectedCapability.title}</p>
              </div>
              <button
                onClick={onClearCapabilityFilter}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-line text-base text-ink"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t('experience.showAllRoles')}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:w-px before:bg-line before:pointer-events-none">
          {displayedExperiences.map((exp, index) => {
            const isCurrent = Boolean(exp.current);
            const isExpanded = expandedRoles[exp.id] ?? (isCurrent || index === 0);

            return (
              <motion.article
                key={exp.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.2) }}
                className="relative pl-10"
              >
                <div className="absolute left-3 top-7 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-ink" />

                <div className="rounded-2xl bg-surface border border-line p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-2xl font-semibold text-ink tracking-tight">
                          {exp.role}
                        </h3>
                        {exp.current && (
                          <span className="text-base text-faint">
                            {t('experience.currentRole')}
                          </span>
                        )}
                      </div>
                      <p className="text-lg text-muted">
                        <span className="text-ink">{exp.company}</span>
                        {exp.location && (
                          <span className="inline-flex items-center gap-1 ml-3">
                            <MapPin className="w-3.5 h-3.5" />
                            {exp.location}
                          </span>
                        )}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-base text-ink shrink-0">
                      <Calendar className="w-4 h-4" />
                      {exp.period}
                    </span>
                  </div>

                  <p className="text-xl leading-[1.6] text-ink mt-4 max-w-[65ch]">
                    {exp.featuredStat && (
                      <span className="font-semibold">
                        {exp.featuredStat.value} {exp.featuredStat.label}.{' '}
                      </span>
                    )}
                    {exp.summary}
                  </p>

                  {selectedCapabilityId && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-base text-faint">{t('experience.validatedCapabilities')}</span>
                      {exp.backedCapabilities.map((capId) => {
                        const cap = CAPABILITIES.find(c => c.id === capId);
                        if (!cap) return null;
                        const isHighlighted = selectedCapabilityId === capId;
                        return (
                          <span
                            key={capId}
                            className={`text-base px-2 py-0.5 rounded-md ${
                              isHighlighted ? 'bg-accent text-page' : 'text-muted'
                            }`}
                          >
                            {cap.title}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-5">
                    <button
                      onClick={() => toggleExpand(exp.id, isExpanded)}
                      className="text-lg font-medium text-accent inline-flex items-center gap-1"
                    >
                      <span>{isExpanded ? t('experience.collapse') : t('experience.expandDetails')}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2">
                            <div className="divide-y divide-line">
                              {exp.bulletPoints.map((bp, idx) => (
                                <div key={idx} className="py-6 max-w-[68ch]">
                                  <h4 className="text-xl font-semibold text-ink tracking-tight">
                                    {bp.category}
                                  </h4>
                                  {bp.metrics && (
                                    <p className="mt-1.5 text-base font-medium text-accent">
                                      {bp.metrics}
                                    </p>
                                  )}
                                  <p className="mt-3 text-lg leading-[1.65] text-ink">
                                    {bp.text}
                                  </p>
                                </div>
                              ))}
                            </div>
                            {exp.technologies.length > 0 && (
                              <ul className="flex flex-wrap gap-2.5 pt-6 border-t border-line">
                                {exp.technologies.map((tech) => (
                                  <li
                                    key={tech}
                                    className="px-3.5 py-2 rounded-lg bg-ink text-page text-base font-semibold tracking-tight"
                                  >
                                    {tech}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
