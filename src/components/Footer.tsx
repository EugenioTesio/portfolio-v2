import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Locale, usePortfolioData } from '../data/portfolio';
import { BLOG_FROM_PORTFOLIO_STATE, getBlogIndexPath } from '../utils/blogUrls';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { t, i18n } = useTranslation();
  const { PERSONAL_INFO } = usePortfolioData();
  const locale = (i18n.language.startsWith('es') ? 'es' : 'en') as Locale;

  const sectionLinks = [
    { id: 'about', label: t('footer.about') },
    { id: 'experience', label: t('footer.experience') },
    { id: 'projects', label: t('footer.projects') },
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
            {sectionLinks.slice(0, 3).map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className="hover:text-ink transition-colors"
              >
                {link.label}
              </button>
            ))}
            <Link
              to={getBlogIndexPath(locale)}
              state={BLOG_FROM_PORTFOLIO_STATE}
              className="hover:text-ink transition-colors"
            >
              {t('footer.blog')}
            </Link>
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-ink transition-colors"
            >
              {t('footer.contact')}
            </button>
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
