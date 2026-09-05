import { Terminal, ArrowUp, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePortfolioData } from '../data/portfolio';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { t } = useTranslation();
  const { PERSONAL_INFO } = usePortfolioData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-transparent border-t border-white/10 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-[#00F5FF]/30 flex items-center justify-center text-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.2)]">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white tracking-tight flex items-center gap-2">
                <span>{PERSONAL_INFO.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-[#00F5FF] border border-[#00F5FF]/30 font-bold">
                  ET.
                </span>
              </div>
              <div className="text-xs font-mono text-[#A0A0A0]">
                {t('footer.subtitle')}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-mono uppercase tracking-wider text-[#A0A0A0]">
            <button onClick={() => onNavigate('about')} className="hover:text-[#00F5FF] transition-colors">
              {t('footer.about')}
            </button>
            <button onClick={() => onNavigate('experience')} className="hover:text-[#00F5FF] transition-colors">
              {t('footer.experience')}
            </button>
            <button onClick={() => onNavigate('projects')} className="hover:text-[#00F5FF] transition-colors">
              {t('footer.projects')}
            </button>
            <button onClick={() => onNavigate('blog')} className="hover:text-[#00F5FF] transition-colors">
              {t('footer.blog')}
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-[#00F5FF] transition-colors">
              {t('footer.contact')}
            </button>
          </div>

          <button
            id="back-to-top-btn"
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-[#A0A0A0] hover:text-[#00F5FF] hover:border-[#00F5FF]/40 text-xs font-mono uppercase tracking-wider transition-all backdrop-blur-md"
            aria-label={t('footer.backToTop')}
          >
            <span>{t('footer.top')}</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#00F5FF]" />
          </button>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#A0A0A0]">
          <div className="flex items-center gap-2">
            <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#A0A0A0]">
            <MapPin className="w-3 h-3 text-[#00F5FF]" />
            <span>{PERSONAL_INFO.location}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
