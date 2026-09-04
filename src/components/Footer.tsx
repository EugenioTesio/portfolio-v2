import { Terminal, ArrowUp, Mail, MapPin, Heart } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-transparent border-t border-white/10 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
          {/* Brand Info */}
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
                Senior Flutter & Python Enthusiast · Mobile Expert
              </div>
            </div>
          </div>

          {/* Quick Nav Anchor links */}
          <div className="flex flex-wrap items-center gap-5 text-xs font-mono uppercase tracking-wider text-[#A0A0A0]">
            <button onClick={() => onNavigate('about')} className="hover:text-[#00F5FF] transition-colors">
              About
            </button>
            <button onClick={() => onNavigate('experience')} className="hover:text-[#00F5FF] transition-colors">
              Experience
            </button>
            <button onClick={() => onNavigate('projects')} className="hover:text-[#00F5FF] transition-colors">
              Projects
            </button>
            <button onClick={() => onNavigate('blog')} className="hover:text-[#00F5FF] transition-colors">
              Blog
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-[#00F5FF] transition-colors">
              Contact
            </button>
          </div>

          {/* Back to top button */}
          <button
            id="back-to-top-btn"
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-[#A0A0A0] hover:text-[#00F5FF] hover:border-[#00F5FF]/40 text-xs font-mono uppercase tracking-wider transition-all backdrop-blur-md"
            aria-label="Back to top"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#00F5FF]" />
          </button>
        </div>

        {/* Bottom copyright and metadata */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#A0A0A0]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Eugenio Tesio. Immersive UI Portfolio.</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#A0A0A0]">
            <MapPin className="w-3 h-3 text-[#00F5FF]" />
            <span>San Francisco, Córdoba, Argentina</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
