import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FolderGit2,
  ExternalLink,
  Layers,
  Server,
  Cpu,
  Radio,
  ArrowRight,
  CheckCircle2,
  X,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import { ProjectItem } from '../types';

interface ProjectsGalleryProps {
  onSelectProject?: (projectId: string) => void;
}

export default function ProjectsGallery({ onSelectProject }: ProjectsGalleryProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'mobile' | 'backend' | 'devops' | 'iot'>('all');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'mobile', label: 'Mobile & Flutter' },
    { id: 'backend', label: 'Backend & APIs' },
    { id: 'iot', label: 'IoT & Hardware' }
  ];

  const filteredProjects = selectedFilter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === selectedFilter);

  const openProjectDetail = (project: ProjectItem) => {
    setActiveModalProject(project);
    if (onSelectProject) {
      onSelectProject(project.id);
    }
  };

  return (
    <section id="projects" className="py-24 relative bg-transparent border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-[#00F5FF]/30 text-[#00F5FF] text-xs font-mono backdrop-blur-md">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span className="font-bold tracking-[2px]">03. PROJECTS GALLERY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Flagship Engineering & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] via-[#9D00FF] to-[#FF00E5]">Architecture Case Studies</span>
            </h2>
            <p className="text-[#A0A0A0] max-w-2xl text-base sm:text-lg">
              Explore in-depth architectural deep-dives from enterprise mobile banking overhauls to physical RS485 industrial IoT systems.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 self-start md:self-auto">
            {filters.map((f) => (
              <button
                key={f.id}
                id={`project-filter-${f.id}`}
                onClick={() => setSelectedFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                  selectedFilter === f.id
                    ? 'bg-[#00F5FF] text-black font-bold shadow-[0_0_15px_rgba(0,245,255,0.3)]'
                    : 'text-[#A0A0A0] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group rounded-[24px] bg-white/[0.03] border border-white/10 hover:border-[#00F5FF]/40 p-6 flex flex-col justify-between backdrop-blur-xl transition-all duration-300 shadow-2xl hover:shadow-[0_0_35px_rgba(0,245,255,0.15)]"
            >
              <div>
                {/* Header with Category Badge & Featured Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.05] text-[#00F5FF] border border-[#00F5FF]/30">
                    {project.categoryLabel}
                  </span>
                  {project.featured && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-[#FF00E5] border border-[#FF00E5]/30 flex items-center gap-1 font-bold">
                      <Sparkles className="w-2.5 h-2.5" />
                      Featured
                    </span>
                  )}
                </div>

                {/* Project Title & Tagline */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00F5FF] transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-[#A0A0A0] leading-relaxed mb-5">
                  {project.tagline}
                </p>

                {/* Key Metrics Chips */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {project.metrics.slice(0, 2).map((metric, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-black/30 border border-white/10">
                      <div className="text-sm font-extrabold font-mono text-[#00F5FF]">{metric.value}</div>
                      <div className="text-[10px] text-[#A0A0A0] truncate uppercase tracking-wider">{metric.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white/[0.04] text-slate-300 border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-lg bg-white/[0.02] text-[#A0A0A0] border border-white/5">
                      +{project.technologies.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  id={`view-project-btn-${project.id}`}
                  onClick={() => openProjectDetail(project)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-xs font-bold uppercase tracking-wider text-[#00F5FF] hover:text-white border border-white/10 hover:border-[#00F5FF]/40 transition-all group/btn"
                >
                  <span>Open Architecture Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform text-[#00F5FF]" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[24px] bg-[#050505]/95 border border-white/15 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-200 backdrop-blur-2xl"
            >
              {/* Close Button */}
              <button
                id="close-project-modal-btn"
                onClick={() => setActiveModalProject(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#A0A0A0] hover:text-white border border-white/10 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Top Metadata */}
              <div className="space-y-2 pr-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.05] text-[#00F5FF] border border-[#00F5FF]/30">
                    {activeModalProject.categoryLabel}
                  </span>
                  {activeModalProject.featured && (
                    <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.05] text-[#FF00E5] border border-[#FF00E5]/30">
                      Flagship Initiative
                    </span>
                  )}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {activeModalProject.title}
                </h3>
                <p className="text-sm text-[#A0A0A0]">
                  {activeModalProject.tagline}
                </p>
              </div>

              {/* Metrics Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {activeModalProject.metrics.map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div className="text-base font-extrabold font-mono text-[#00F5FF]">{m.value}</div>
                    <div className="text-xs text-[#A0A0A0] uppercase tracking-wider truncate">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Overview */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-mono uppercase tracking-[2px] text-[#00F5FF] font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#00F5FF]" />
                  Project Overview
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {activeModalProject.overview}
                </p>
              </div>

              {/* Challenge vs Solution Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4" />
                    <span>The Engineering Challenge</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeModalProject.challenge}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-[#00F5FF]/30 space-y-2">
                  <div className="flex items-center gap-2 text-[#00F5FF] font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Engineered Solution</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeModalProject.solution}
                  </p>
                </div>
              </div>

              {/* Architecture Highlights */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-mono uppercase tracking-[2px] text-[#00F5FF] font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#00F5FF]" />
                  Key Architectural Decisions
                </h4>
                <div className="space-y-2">
                  {activeModalProject.architectureHighlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] mt-1.5 flex-shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results & Business Outcomes */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-mono uppercase tracking-[2px] text-[#9D00FF] font-bold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#9D00FF]" />
                  Quantifiable Results
                </h4>
                <div className="space-y-2">
                  {activeModalProject.results.map((result, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#00F5FF]" />
                      <span>{result}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies Used */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <h4 className="text-[11px] font-mono uppercase tracking-[2px] text-[#A0A0A0] font-bold">
                  Full Technology Stack
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalProject.technologies.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/[0.04] text-slate-300 border border-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  {activeModalProject.links?.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#00F5FF] text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
                <button
                  onClick={() => setActiveModalProject(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-mono uppercase tracking-wider border border-white/10 transition-colors"
                >
                  Close Case Study
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
