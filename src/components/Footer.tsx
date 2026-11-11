import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePortfolioData } from '../data/portfolio';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { t } = useTranslation();
  const { PERSONAL_INFO } = usePortfolioData();

  const links = [
    { id: 'about', label: t('footer.about') },
    { id: 'experience', label: t('footer.experience') },
    { id: 'projects', label: t('footer.projects') },
    { id: 'blog', label: t('footer.blog') },
    { id: 'contact', label: t('footer.contact') },
  ];

  return (
    <footer className="border-t border-line py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="font-semibold text-ink">{PERSONAL_INFO.name}</p>
            <p className="text-base text-faint mt-1">{t('footer.subtitle')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-base text-muted">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className="hover:text-ink transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
          <button
            id="back-to-top-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-base text-muted hover:text-ink self-start md:self-auto"
            aria-label={t('footer.backToTop')}
          >
            {t('footer.top')}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-base text-faint">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <p className="inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {PERSONAL_INFO.location}
          </p>
        </div>
      </div>
    </footer>
  );
}
