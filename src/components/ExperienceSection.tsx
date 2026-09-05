import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  Briefcase,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
  ArrowRight
} from 'lucide-react';
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
  const [expandedRoles, setExpandedRoles] = useState<Record<string, boolean>>({
    'itti-ueno': true,
    'pairtree': true
  });

  const toggleExpand = (id: string) => {
    setExpandedRoles(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const selectedCapability = CAPABILITIES.find(c => c.id === selectedCapabilityId);

  // If a capability is selected, highlight or filter experiences that back it up
  const displayedExperiences = selectedCapabilityId
    ? EXPERIENCES.filter(e => e.backedCapabilities.includes(selectedCapabilityId))
    : EXPERIENCES;

  return (
    <section id="experience" className="py-24 relative bg-transparent border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-[#00F5FF]/30 text-[#00F5FF] text-xs font-mono backdrop-blur-md">
              <Briefcase className="w-3.5 h-3.5" />
              <span className="font-bold tracking-[2px]">{t('experience.sectionBadge')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t('experience.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] to-[#9D00FF]">{t('experience.titleHighlight')}</span>
            </h2>
            <p className="text-[#A0A0A0] max-w-2xl text-base sm:text-lg">
              {t('experience.subtitle')}
            </p>
          </div>

          <button
            onClick={onNavigateToProjects}
            className="self-start md:self-auto inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00F5FF] hover:text-white font-mono transition-colors"
          >
            <span>{t('experience.exploreProjects')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Active Capability Filter Banner */}
        <AnimatePresence>
          {selectedCapability && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 rounded-[24px] bg-white/[0.03] border border-[#00F5FF]/40 backdrop-blur-xl flex items-center justify-between gap-4 shadow-[0_0_20px_rgba(0,245,255,0.15)]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-[#00F5FF]/40 flex items-center justify-center text-[#00F5FF]">
                  <Filter className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#00F5FF] font-bold">{t('experience.filteringFor')}</span>
                  <p className="text-sm font-bold text-white">{selectedCapability.title}</p>
                </div>
              </div>
              <button
                onClick={onClearCapabilityFilter}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-mono border border-white/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t('experience.showAllRoles')}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Experience Timeline */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-8 before:w-0.5 before:bg-white/10 before:pointer-events-none">
          {displayedExperiences.map((exp, index) => {
            const isExpanded = expandedRoles[exp.id] ?? false;

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-10 md:pl-20 group"
              >
                {/* Timeline Marker */}
                <div className="absolute left-1.5 md:left-5.5 top-6 -translate-x-1/2 w-6 h-6 rounded-full bg-[#050505] border-2 border-[#00F5FF] flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.6)] group-hover:scale-125 transition-transform z-10">
                  <div className={`w-2 h-2 rounded-full ${exp.current ? 'bg-[#00F5FF] animate-ping' : 'bg-[#00F5FF]'}`} />
                </div>

                {/* Experience Card */}
                <div className="rounded-[24px] bg-white/[0.03] border border-white/10 border-l-4 border-l-[#9D00FF] hover:border-white/20 p-6 md:p-8 backdrop-blur-xl shadow-2xl transition-all">
                  {/* Card Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
                          {exp.role}
                        </span>
                        {exp.current && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/[0.05] text-[#00F5FF] border border-[#00F5FF]/30">
                            {t('experience.currentRole')}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-[#A0A0A0]">
                        <span className="font-bold text-[#00F5FF] text-base">{exp.company}</span>
                        {exp.location && (
                          <span className="flex items-center gap-1 text-[#A0A0A0] text-xs">
                            <MapPin className="w-3 h-3 text-[#9D00FF]" />
                            {exp.location}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-[#00F5FF]" />
                        <span>{exp.period}</span>
                      </div>

                      {exp.featuredStat && (
                        <div className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-[#00F5FF]/30 text-right">
                          <div className="text-xs font-extrabold font-mono text-[#00F5FF]">{exp.featuredStat.value}</div>
                          <div className="text-[10px] text-[#A0A0A0] uppercase tracking-wider">{exp.featuredStat.label}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-sm text-slate-300 my-4 leading-relaxed font-normal">
                    {exp.summary}
                  </p>

                  {/* Capability Alignment Tags */}
                  <div className="mb-5 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono text-[#A0A0A0] uppercase tracking-wider mr-1">
                      {t('experience.validatedCapabilities')}
                    </span>
                    {exp.backedCapabilities.map((capId) => {
                      const cap = CAPABILITIES.find(c => c.id === capId);
                      if (!cap) return null;
                      const isHighlighted = selectedCapabilityId === capId;
                      return (
                        <span
                          key={capId}
                          className={`text-[11px] font-mono px-2.5 py-1 rounded-lg transition-all ${
                            isHighlighted
                              ? 'bg-[#00F5FF] text-black font-bold shadow-[0_0_12px_rgba(0,245,255,0.4)]'
                              : 'bg-white/[0.04] text-[#00F5FF] border border-[#00F5FF]/30'
                          }`}
                        >
                          {cap.title}
                        </span>
                      );
                    })}
                  </div>

                  {/* Expandable Key Contributions */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-mono uppercase tracking-[2px] text-[#00F5FF] font-bold">
                        {t('experience.engineeringHighlights')}
                      </h4>
                      <button
                        onClick={() => toggleExpand(exp.id)}
                        className="text-xs font-mono font-bold uppercase tracking-wider text-[#00F5FF] hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <span>{isExpanded ? t('experience.collapse') : t('experience.expandDetails')}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 pt-2"
                        >
                          {exp.bulletPoints.map((bp, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-2xl bg-black/30 border border-white/10 hover:border-white/20 space-y-1.5 transition-colors"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF]" />
                                  {bp.category}
                                </span>
                                {bp.metrics && (
                                  <span className="text-[11px] font-mono text-[#00F5FF] bg-white/[0.05] px-2 py-0.5 rounded border border-[#00F5FF]/30 font-bold">
                                    {bp.metrics}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#A0A0A0] leading-relaxed pl-3 border-l border-white/10">
                                {bp.text}
                              </p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Technologies Footer */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-1.5">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.03] text-slate-400 border border-white/10 hover:text-white hover:border-[#00F5FF]/40 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
