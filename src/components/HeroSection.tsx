import { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import { motion } from 'motion/react';
import {
  Smartphone,
  Server,
  Layers,
  ShieldCheck,
  Cpu,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Sparkles,
  Award,
  Briefcase,
  GraduationCap,
  ExternalLink,
  Mail,
  Bot,
  Camera,
  UploadCloud,
  Check
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import regeneratedProfileImage from '../assets/images/regenerated_image_1788456283242.jpg';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const [profileImg, setProfileImg] = useState<string>(() => {
    return localStorage.getItem('eugenio_profile_img') || regeneratedProfileImage;
  });
  const [isDragging, setIsDragging] = useState(false);
  const [justUploaded, setJustUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // If user previously stored an older placeholder, migrate it to the new regenerated image
    const stored = localStorage.getItem('eugenio_profile_img');
    if (!stored || stored === '/profile-image-2.png' || stored === '/eugenio-tesio.jpg') {
      localStorage.setItem('eugenio_profile_img', regeneratedProfileImage);
      setProfileImg(regeneratedProfileImage);
    }

    const handleAvatarUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setProfileImg(customEvent.detail);
      } else {
        const storedItem = localStorage.getItem('eugenio_profile_img');
        if (storedItem) setProfileImg(storedItem);
      }
    };
    window.addEventListener('eugenio-avatar-update', handleAvatarUpdate);
    return () => window.removeEventListener('eugenio-avatar-update', handleAvatarUpdate);
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setProfileImg(dataUrl);
        localStorage.setItem('eugenio_profile_img', dataUrl);
        window.dispatchEvent(new CustomEvent('eugenio-avatar-update', { detail: dataUrl }));
        setJustUploaded(true);
        setTimeout(() => setJustUploaded(false), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-20 overflow-hidden flex flex-col justify-center bg-transparent"
    >
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-[#00F5FF]/30 text-[#00F5FF] text-xs font-mono backdrop-blur-md shadow-[0_0_15px_rgba(0,245,255,0.15)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#00F5FF] animate-pulse" />
            <span className="text-[#A0A0A0]">CURRENT STATUS:</span>
            <span className="font-semibold text-white tracking-wide">Mobile Expert & Systems Architect @ ueno bank</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#A0A0A0] text-xs font-mono backdrop-blur-md"
          >
            <MapPin className="w-3.5 h-3.5 text-[#00F5FF]" />
            <span>{PERSONAL_INFO.location}</span>
          </motion.div>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Comprehensive Overview */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-[#00F5FF]/30 text-[#00F5FF] text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-bold tracking-[2px]">00. EXECUTIVE OVERVIEW</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-white">
                <span className="bg-gradient-to-r from-white via-[#E0E0E0] to-[#A0A0A0] bg-clip-text text-transparent block">
                  Eugenio Tesio
                </span>
                <span className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#A0A0A0] block mt-1">
                  Architecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] via-[#9D00FF] to-[#FF00E5]">High-Scale</span> Mobile & Distributed Cloud Systems
                </span>
              </h1>
              
              {/* Comprehensive Overview Covering All Experience */}
              <div className="space-y-3 text-[#A0A0A0] text-base leading-relaxed pt-2">
                <p>
                  I'm a <strong className="text-white font-semibold">Mobile Expert</strong>, <strong className="text-white font-semibold">Systems Architect</strong>, and <strong className="text-white font-semibold">Electronics Engineer</strong> with over 14 years of end-to-end software engineering, hardware telemetry, and AI-accelerated delivery experience. I specialize in designing, modernizing, and scaling mission-critical platforms using <span className="text-[#00F5FF] font-medium">Flutter (BLoC & Riverpod)</span>, <span className="text-white font-medium">Python (FastAPI)</span>, <span className="text-[#9D00FF] font-medium">Java (Spring Boot)</span>, <span className="text-[#00F5FF] font-medium">Google Cloud Platform</span>, and <span className="text-[#FF00E5] font-medium">Multi-Agent AI Engineering</span>.
                </p>
                <p className="text-sm sm:text-base">
                  At <strong className="text-white">ueno bank (ITTI S.A.E.C.A.)</strong>, I lead mobile architecture for 50+ Flutter engineers, orchestrating the migration to a modular Micro-App & App Shell ecosystem, pioneering multi-agent AI development workflows (Cursor, GitHub Copilot, Spec-Driven Development), harmonizing retail & corporate apps, establishing a 15-day multi-store release train, and hardening security with Fintech RASP. My career spans delivering <strong className="text-white">100% backend test coverage with FastAPI</strong> at <span className="text-slate-200">PairTree</span> (adoption platform), building scalable <span className="text-slate-200">Nest.js & Riverpod</span> apps at <span className="text-slate-200">Tandamos</span>, powering enterprise GCP Pub/Sub microservices at <span className="text-slate-200">Valtech</span>, and a decade of full-stack engineering with <strong className="text-[#00F5FF]">zero mobile store rejections</strong>.
                </p>
              </div>
            </motion.div>

            {/* Comprehensive Experience Trail Chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-2 pt-1"
            >
              <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-white/[0.08] to-white/[0.03] border border-[#00F5FF]/50 text-xs font-mono text-white flex items-center gap-1.5 hover:border-[#00F5FF] transition-all shadow-[0_0_15px_rgba(0,245,255,0.2)]">
                <Bot className="w-3.5 h-3.5 text-[#00F5FF] animate-pulse" />
                <span className="text-[#00F5FF] font-bold">Multi-Agent AI & LLMs</span>
                <span className="text-slate-300">· SDD & CodeGen</span>
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-xs font-mono text-slate-200 flex items-center gap-1.5 hover:border-[#00F5FF]/40 transition-colors">
                <Layers className="w-3.5 h-3.5 text-[#00F5FF]" />
                ueno bank · Micro-Apps & RASP
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-xs font-mono text-slate-200 flex items-center gap-1.5 hover:border-[#9D00FF]/40 transition-colors">
                <Server className="w-3.5 h-3.5 text-[#9D00FF]" />
                PairTree · 100% FastAPI Pytest
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-xs font-mono text-slate-200 flex items-center gap-1.5 hover:border-[#00F5FF]/40 transition-colors">
                <Cpu className="w-3.5 h-3.5 text-[#00F5FF]" />
                Valtech · Spring Boot & GCP
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-xs font-mono text-slate-200 flex items-center gap-1.5 hover:border-[#FF00E5]/40 transition-colors">
                <GraduationCap className="w-3.5 h-3.5 text-[#FF00E5]" />
                UTN · Electronics Engineer & IoT
              </span>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-3"
            >
              <button
                id="hero-explore-projects-btn"
                onClick={() => onNavigate('projects')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#00F5FF] text-black font-extrabold uppercase text-xs tracking-wider hover:brightness-110 hover:shadow-[0_0_25px_rgba(0,245,255,0.5)] active:scale-95 transition-all cursor-pointer"
              >
                <span>View Case Studies</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-experience-btn"
                onClick={() => onNavigate('experience')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white text-xs uppercase tracking-wider font-semibold transition-all"
              >
                <Briefcase className="w-4 h-4 text-[#00F5FF]" />
                <span>Career Timeline</span>
              </button>

              <button
                id="hero-contact-btn"
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-transparent hover:bg-white/[0.04] text-[#A0A0A0] hover:text-white text-xs uppercase tracking-wider font-medium transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Direct Contact</span>
              </button>
            </motion.div>

            {/* Quick Metrics Bar - Glass Bento Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10"
            >
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                <div className="text-2xl font-extrabold font-mono text-[#00F5FF]">14+ Yrs</div>
                <div className="text-[11px] text-[#A0A0A0] uppercase tracking-wider mt-0.5">Software & IoT</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                <div className="text-2xl font-extrabold font-mono text-[#9D00FF]">50+</div>
                <div className="text-[11px] text-[#A0A0A0] uppercase tracking-wider mt-0.5">Engineers Scaled</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                <div className="text-2xl font-extrabold font-mono text-white">100%</div>
                <div className="text-[11px] text-[#A0A0A0] uppercase tracking-wider mt-0.5">Backend Coverage</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                <div className="text-2xl font-extrabold font-mono text-[#00F5FF]">0</div>
                <div className="text-[11px] text-[#A0A0A0] uppercase tracking-wider mt-0.5">Store Rejections</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Eugenio Tesio Profile Image & Glass Bento Card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="rounded-[28px] bg-white/[0.03] border border-white/15 backdrop-blur-2xl p-4 sm:p-5 shadow-2xl relative group overflow-hidden hover:border-[#00F5FF]/40 transition-all duration-500 shadow-black/80"
            >
              {/* Profile Image Container with Drag & Drop */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative w-full h-[420px] sm:h-[480px] rounded-[22px] overflow-hidden bg-black/40 border transition-all duration-300 ${
                  isDragging ? 'border-[#00F5FF] ring-4 ring-[#00F5FF]/20 scale-[0.99]' : 'border-white/10'
                }`}
              >
                <img
                  src={profileImg}
                  alt="Eugenio Tesio - Mobile Expert & Systems Architect"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    if (e.currentTarget.src.includes('profile-image-2')) {
                      e.currentTarget.src = '/eugenio-tesio-tech.jpg';
                    } else if (e.currentTarget.src.includes('eugenio-tesio-tech')) {
                      e.currentTarget.src = '/eugenio-tesio.jpg';
                    }
                  }}
                  className="w-full h-full object-cover object-center filter brightness-100 contrast-105 group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />

                {/* Subtle Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#00F5FF]/10 via-transparent to-[#9D00FF]/15 pointer-events-none" />

                {/* Dragging Overlay */}
                {isDragging && (
                  <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 z-20 pointer-events-none border-2 border-dashed border-[#00F5FF]">
                    <UploadCloud className="w-12 h-12 text-[#00F5FF] animate-bounce mb-3" />
                    <p className="text-white font-bold text-sm">Drop your photo here</p>
                    <p className="text-[#A0A0A0] text-xs mt-1 font-mono">Updates avatar across portfolio</p>
                  </div>
                )}

                {/* Top Overlay Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 border border-[#00F5FF]/40 backdrop-blur-md text-[11px] font-mono text-[#00F5FF] font-bold shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-[#00F5FF] animate-pulse" />
                    <span>EUGENIO TESIO</span>
                  </div>

                  <div className="flex items-center gap-2 pointer-events-auto">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="hero-profile-upload"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      title="Upload or change photo"
                      className="px-2.5 py-1 rounded-full bg-black/75 hover:bg-black border border-white/20 hover:border-[#00F5FF]/60 backdrop-blur-md text-[11px] font-mono text-slate-200 hover:text-[#00F5FF] flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                    >
                      {justUploaded ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Updated!</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-3 h-3 text-[#00F5FF]" />
                          <span>Change Photo</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Floating Bottom Highlights on Image */}
                <div className="absolute bottom-4 left-4 right-4 space-y-2.5 pointer-events-none z-10">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-black/80 border border-white/15 backdrop-blur-md">
                      <div className="text-[10px] font-mono text-[#00F5FF] font-bold uppercase tracking-wider">
                        Leadership
                      </div>
                      <div className="text-xs font-semibold text-white">
                        50+ Mobile Devs
                      </div>
                      <div className="text-[10px] text-[#A0A0A0]">
                        Micro-App Arch
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/80 border border-white/15 backdrop-blur-md">
                      <div className="text-[10px] font-mono text-[#9D00FF] font-bold uppercase tracking-wider">
                        Release SLA
                      </div>
                      <div className="text-xs font-semibold text-white">
                        15-Day Cadence
                      </div>
                      <div className="text-[10px] text-[#A0A0A0]">
                        3 App Stores
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bento Footer Bar with Career Milestones */}
              <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white tracking-wide">
                    Mobile Expert & Systems Architect
                  </div>
                  <div className="text-[11px] font-mono text-[#A0A0A0] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-[#00F5FF]" />
                    <span>Verified Production Track Record</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-[#00F5FF] hover:text-white transition-colors"
                >
                  <span>Full Bio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
