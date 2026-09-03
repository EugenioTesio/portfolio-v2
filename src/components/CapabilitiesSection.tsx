import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Layers,
  Server,
  Cpu,
  ShieldCheck,
  Sparkles,
  Activity,
  Radio,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Flame
} from 'lucide-react';
import { CAPABILITIES, EXPERIENCES } from '../data/portfolioData';
import { SkillCapability } from '../types';

interface CapabilitiesSectionProps {
  onSelectCapabilityForExperience: (capabilityId: string) => void;
  selectedCapabilityId: string | null;
}

export default function CapabilitiesSection({
  onSelectCapabilityForExperience,
  selectedCapabilityId
}: CapabilitiesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'mobile' | 'backend' | 'devops' | 'security' | 'ai' | 'iot'>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'Server': return <Server className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      case 'Radio': return <Radio className="w-5 h-5" />;
      default: return <Layers className="w-5 h-5" />;
    }
  };

  const filteredCapabilities = activeCategory === 'all'
    ? CAPABILITIES
    : CAPABILITIES.filter(c => c.category === activeCategory);

  const getBackingExperience = (evidenceKey: string) => {
    return EXPERIENCES.find(e => e.id === evidenceKey);
  };

  return (
    <section id="capabilities" className="py-24 relative bg-transparent border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-[#00F5FF]/30 text-[#00F5FF] text-xs font-mono backdrop-blur-md">
              <Cpu className="w-3.5 h-3.5" />
              <span className="font-bold tracking-[2px]">02. WHAT I CAN DO</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              High-Velocity Capabilities Backed by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] to-[#9D00FF]">Hard Evidence</span>
            </h2>
            <p className="text-[#A0A0A0] max-w-2xl text-base sm:text-lg">
              Every capability below represents an engineering discipline proven in production across enterprise banking, agtech platforms, and industrial IoT.
            </p>
          </div>

          {/* Interactive Category Filter */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 self-start md:self-auto">
            {(['all', 'mobile', 'backend', 'devops', 'security', 'ai', 'iot'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all uppercase tracking-wider ${
                  activeCategory === cat
                    ? 'bg-[#00F5FF] text-black font-bold shadow-[0_0_15px_rgba(0,245,255,0.3)]'
                    : 'text-[#A0A0A0] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCapabilities.map((capability, index) => {
            const isSelected = selectedCapabilityId === capability.id;
            const backingExp = getBackingExperience(capability.evidenceKey);

            return (
              <motion.div
                key={capability.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`group relative rounded-[24px] p-7 flex flex-col justify-between backdrop-blur-xl transition-all duration-300 ${
                  isSelected
                    ? 'bg-white/[0.08] border-2 border-[#00F5FF] shadow-[0_0_35px_rgba(0,245,255,0.25)]'
                    : 'bg-white/[0.03] border border-white/10 hover:border-[#00F5FF]/40 hover:shadow-[0_0_30px_rgba(0,245,255,0.12)]'
                }`}
              >
                {/* Top Badge & Icon */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 text-[#00F5FF] flex items-center justify-center group-hover:scale-105 group-hover:border-[#00F5FF]/50 transition-all">
                      {getIcon(capability.icon)}
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/[0.05] text-[#00F5FF] border border-[#00F5FF]/30">
                      {capability.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-[#00F5FF] transition-colors">
                    {capability.title}
                  </h3>
                  <p className="text-sm text-[#A0A0A0] leading-relaxed mb-5">
                    {capability.shortDescription}
                  </p>

                  {/* Technologies Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {capability.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.04] text-slate-300 border border-white/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Evidence Link Section */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[#A0A0A0] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00F5FF]" />
                      Backed up in:
                    </span>
                    <span className="font-semibold text-white text-right truncate max-w-[170px]">
                      {backingExp ? backingExp.company : 'Production Engineering'}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectCapabilityForExperience(capability.id)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-xs font-bold uppercase tracking-wider text-[#00F5FF] hover:text-white border border-white/10 hover:border-[#00F5FF]/40 transition-all group/btn"
                  >
                    <span>Inspect Proof & Metrics</span>
                    <ChevronRight className="w-4 h-4 text-[#00F5FF] group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
