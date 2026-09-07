import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  GraduationCap,
  MapPin,
  Cpu,
  Layers,
  Server,
  Award,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Wrench,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { usePortfolioData } from '../data/portfolio';
import regeneratedProfileImage from '../assets/images/regenerated_image_1788456283242.jpg';

interface AboutSectionProps {
  onNavigate: (sectionId: string) => void;
}

export default function AboutSection({ onNavigate }: AboutSectionProps) {
  const { t } = useTranslation();
  const { PERSONAL_INFO } = usePortfolioData();
  const [selectedTechPillar, setSelectedTechPillar] = useState<'all' | 'mobile' | 'backend' | 'cloud' | 'iot'>('all');
  const [avatarImg, setAvatarImg] = useState<string>(() => {
    return localStorage.getItem('eugenio_profile_img') || regeneratedProfileImage;
  });

  useEffect(() => {
    // If user previously stored an older placeholder, migrate it to the new regenerated image
    const stored = localStorage.getItem('eugenio_profile_img');
    if (!stored || stored === '/profile-image-2.png' || stored === '/eugenio-tesio.jpg') {
      localStorage.setItem('eugenio_profile_img', regeneratedProfileImage);
      setAvatarImg(regeneratedProfileImage);
    }

    const handleAvatarUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setAvatarImg(customEvent.detail);
      } else {
        const storedItem = localStorage.getItem('eugenio_profile_img');
        if (storedItem) setAvatarImg(storedItem);
      }
    };
    window.addEventListener('eugenio-avatar-update', handleAvatarUpdate);
    return () => window.removeEventListener('eugenio-avatar-update', handleAvatarUpdate);
  }, []);

  const techMatrix = [
    { name: 'Flutter (BLoC & Riverpod)', category: 'mobile', proficiency: 'Mastery', highlight: 'Micro-App & App Shell architectures' },
    { name: 'Python (FastAPI & Flask)', category: 'backend', proficiency: 'Mastery', highlight: '100% test coverage with pytest fixtures' },
    { name: 'Java (Spring Boot)', category: 'backend', proficiency: 'Advanced', highlight: 'Enterprise GCP Pub/Sub message queues' },
    { name: 'Micro-Apps & App Shell', category: 'mobile', proficiency: 'Architect', highlight: 'Scaled 50+ Flutter engineers at ueno bank' },
    { name: 'Codemagic & GitHub Actions', category: 'cloud', proficiency: 'Mastery', highlight: '15-day automated release train pipelines' },
    { name: 'Fintech RASP & Security', category: 'mobile', proficiency: 'Specialist', highlight: 'Anti-root, anti-tamper, hardened WebViews' },
    { name: 'Google Cloud Platform (GCP)', category: 'cloud', proficiency: 'Advanced', highlight: 'Cloud Run, App Engine, Pub/Sub, Cloud Build' },
    { name: 'Node.js (Fastify & Nest.js)', category: 'backend', proficiency: 'Advanced', highlight: 'BFF optimization and TypeORM services' },
    { name: 'RS485 Serial Bus & IoT', category: 'iot', proficiency: 'Hardware Engineer', highlight: 'Smart Lub industrial device for Vulcano' },
    { name: 'OCPP 1.6 EV Protocols', category: 'iot', proficiency: 'Specialist', highlight: 'Smart EV charge network WebSocket backends' },
    { name: 'Linux Server Administration', category: 'cloud', proficiency: 'Advanced', highlight: 'Production service hosting & daemon scripts' },
    { name: 'New Relic & Instabug APM', category: 'mobile', proficiency: 'Advanced', highlight: 'Mobile telemetry and crash velocity triage' }
  ];

  const filteredTech = selectedTechPillar === 'all' 
    ? techMatrix 
    : techMatrix.filter(t => t.category === selectedTechPillar);

  return (
    <section id="about" className="py-24 relative bg-transparent border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-[#00F5FF]/30 text-[#00F5FF] text-xs font-mono backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-bold tracking-[2px]">{t('about.sectionBadge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('about.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] to-[#9D00FF]">{t('about.titleHighlight')}</span>
          </h2>
          <p className="text-[#A0A0A0] max-w-3xl text-base sm:text-lg">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Two-Column About Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left: Bio & Engineering Mindset */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-8 rounded-[24px] bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl space-y-5 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-black/40 border border-[#00F5FF]/40 flex-shrink-0 shadow-[0_0_15px_rgba(0,245,255,0.25)]">
                    <img
                      src={avatarImg}
                      alt="Eugenio Tesio"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        if (e.currentTarget.src.includes('profile-image-2')) {
                          e.currentTarget.src = '/eugenio-tesio-tech.jpg';
                        } else if (e.currentTarget.src.includes('eugenio-tesio-tech')) {
                          e.currentTarget.src = '/eugenio-tesio.jpg';
                        }
                      }}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{PERSONAL_INFO.name}</h3>
                    <p className="text-xs text-[#A0A0A0] font-mono flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#00F5FF]" />
                      {PERSONAL_INFO.location}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-[#00F5FF]/30 text-[#00F5FF] text-xs font-mono font-bold tracking-wide">
                  {t('about.yearsExp')}
                </span>
              </div>

              <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                <p dangerouslySetInnerHTML={{ __html: t('about.bioP1') }} />
                <p dangerouslySetInnerHTML={{ __html: t('about.bioP2') }} />
                <p dangerouslySetInnerHTML={{ __html: t('about.bioP3') }} />
                <p dangerouslySetInnerHTML={{ __html: t('about.bioP4') }} />
                <p className="text-[#A0A0A0] text-sm border-l-2 border-[#9D00FF] pl-4 italic">
                  {t('about.quote')}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-[#A0A0A0]">
                  <span className="w-2 h-2 rounded-full bg-[#00F5FF]" />
                  <span>{t('about.languages')}</span>
                </div>
                <button
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#00F5FF] hover:text-white transition-colors"
                >
                  <span>{t('about.connect')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: UTN Degree & Commercialized Smart Lub Highlight */}
          <div className="lg:col-span-5 space-y-6">
            {/* Education & Smart Lub Card */}
            <div className="p-8 rounded-[24px] bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl space-y-5 relative overflow-hidden hover:border-white/20 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#00F5FF] flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-[#00F5FF]" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-[#00F5FF] uppercase tracking-wider font-bold">
                    {t('about.academicDegree')}
                  </span>
                  <h3 className="text-base font-bold text-white leading-snug mt-0.5">
                    {t('about.degreeTitle')}
                  </h3>
                  <p className="text-xs text-[#A0A0A0] mt-0.5">
                    {PERSONAL_INFO.education.institution} · {PERSONAL_INFO.education.period}
                  </p>
                  <p className="text-xs font-mono text-[#A0A0A0] mt-1">
                    {t('about.graduatedAs')} <strong className="text-white">{t('about.ingeniero')}</strong>
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#00F5FF] flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-[#00F5FF]" />
                    {t('about.capstoneTitle')}
                  </span>
                  <span className="text-[10px] font-mono bg-white/[0.05] text-[#00F5FF] px-2 py-0.5 rounded border border-[#00F5FF]/30 font-bold">
                    {t('about.commercialProduct')}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal" dangerouslySetInnerHTML={{ __html: t('about.capstoneDesc') }} />
                <div className="pt-2 flex items-center gap-2 text-[11px] text-[#A0A0A0] border-t border-white/10">
                  <Award className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>{t('about.capstoneNote')}</span>
                </div>
              </div>

              {/* Hardware-to-Software Philosophy */}
              <div className="space-y-2 pt-2">
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#A0A0A0] flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-[#9D00FF]" />
                  {t('about.electronicsAdvantage')}
                </h4>
                <p className="text-xs text-[#A0A0A0] leading-relaxed">
                  {t('about.electronicsDesc')}
                </p>
              </div>
            </div>

            {/* Availability Callout Card */}
            <div className="p-6 rounded-[24px] bg-white/[0.03] border border-[#00F5FF]/30 backdrop-blur-xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#00F5FF] font-bold flex items-center gap-2 uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-[#00F5FF] animate-ping" />
                  {t('about.readyToCollaborate')}
                </div>
                <p className="text-xs text-slate-300">
                  {t('about.seekingProjects')}
                </p>
              </div>
              <button
                onClick={() => onNavigate('contact')}
                className="px-5 py-2.5 rounded-xl bg-[#00F5FF] text-black text-xs font-extrabold uppercase tracking-wider whitespace-nowrap hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all flex-shrink-0"
              >
                {t('about.reachOut')}
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Skills & Technology Matrix */}
        <div className="p-8 rounded-[24px] bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">{t('about.matrixTitle')}</h3>
              <p className="text-xs text-[#A0A0A0]">
                {t('about.matrixSubtitle')}
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10">
              {(['all', 'mobile', 'backend', 'cloud', 'iot'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedTechPillar(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all uppercase ${
                    selectedTechPillar === filter
                      ? 'bg-[#00F5FF] text-black font-bold shadow-[0_0_15px_rgba(0,245,255,0.3)]'
                      : 'text-[#A0A0A0] hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {t(`about.filters.${filter}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Verified Tech */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTech.map((tech) => (
              <div
                key={tech.name}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#00F5FF]/40 hover:shadow-[0_0_20px_rgba(0,245,255,0.1)] transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-100 group-hover:text-[#00F5FF] transition-colors">
                    {tech.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-[#00F5FF] border border-[#00F5FF]/30 font-bold">
                    {tech.proficiency}
                  </span>
                </div>
                <p className="text-xs text-[#A0A0A0] leading-relaxed">
                  {tech.highlight}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
