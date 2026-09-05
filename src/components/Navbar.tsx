import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Terminal, Menu, X, Mail } from 'lucide-react';
import LanguageToggle from './LanguageToggle';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export default function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: t('nav.about') },
    { id: 'experience', label: t('nav.experience') },
    { id: 'projects', label: t('nav.projects') },
    { id: 'blog', label: t('nav.blog') },
    { id: 'contact', label: t('nav.contact') },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/80 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <button
            id="brand-logo-button"
            onClick={() => handleLinkClick('hero')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#00F5FF] group-hover:border-[#00F5FF]/60 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(0,245,255,0.3)] transition-all duration-300 backdrop-blur-md">
              <Terminal className="w-5 h-5 text-[#00F5FF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-[#00F5FF] transition-colors">
                  ET<span className="text-[#00F5FF]">.</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-white/[0.05] text-[#00F5FF] border border-[#00F5FF]/30">
                  {t('nav.mobileExpert')}
                </span>
              </div>
              <p className="text-xs text-[#A0A0A0] font-mono hidden sm:block">
                {t('nav.subtitle')}
              </p>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1.5 rounded-full border border-white/10 backdrop-blur-xl">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleLinkClick(item.id)}
                  className={`relative px-4 py-1.5 text-xs tracking-wider uppercase font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? 'text-black font-bold'
                      : 'text-[#A0A0A0] hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 rounded-full bg-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.45)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle />

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-[#00F5FF]/30 text-[#00F5FF] text-xs backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F5FF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F5FF]"></span>
              </span>
              <span className="font-medium text-[11px] tracking-wide">{t('nav.openForRoles')}</span>
            </div>

            <button
              id="header-contact-button"
              onClick={() => handleLinkClick('contact')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00F5FF] text-black text-xs font-bold uppercase tracking-wider hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,245,255,0.5)] active:scale-95 transition-all"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{t('nav.getInTouch')}</span>
            </button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <LanguageToggle />
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-white hover:border-white/20"
              aria-label={t('nav.toggleMenu')}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#050505]/95 backdrop-blur-2xl border-b border-white/10 px-4 pt-3 pb-6 space-y-2 mt-3"
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-[#00F5FF]/30 text-[#00F5FF] text-xs mb-3">
              <span className="w-2 h-2 rounded-full bg-[#00F5FF] animate-pulse" />
              <span>{t('nav.mobileOpenForRoles')}</span>
            </div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium uppercase tracking-wider transition-colors ${
                  activeSection === item.id
                    ? 'bg-[#00F5FF] text-black font-bold shadow-[0_0_15px_rgba(0,245,255,0.4)]'
                    : 'text-[#A0A0A0] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2">
              <button
                onClick={() => handleLinkClick('contact')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#00F5FF] text-black font-bold uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(0,245,255,0.4)]"
              >
                <Mail className="w-4 h-4" />
                <span>{t('nav.contactEugenio')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
