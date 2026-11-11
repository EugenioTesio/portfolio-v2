import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Mail } from 'lucide-react';
import { Locale } from '../data/portfolio';
import { getBlogIndexPath } from '../utils/blogUrls';
import LanguageToggle from './LanguageToggle';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export default function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language.startsWith('es') ? 'es' : 'en') as Locale;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const blogPath = getBlogIndexPath(locale);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sectionItems = [
    { id: 'about', label: t('nav.about') },
    { id: 'experience', label: t('nav.experience') },
    { id: 'projects', label: t('nav.projects') },
    { id: 'contact', label: t('nav.contact') },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const navLinkClass = (isActive: boolean) =>
    `px-3 py-2 text-base font-medium rounded-md transition-colors ${
      isActive ? 'bg-accent text-page' : 'text-muted hover:text-ink'
    }`;

  const mobileLinkClass = (isActive: boolean) =>
    `w-full text-left px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
      isActive
        ? 'bg-accent text-page'
        : 'text-muted hover:text-ink hover:bg-surface'
    }`;

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? 'bg-page/90 backdrop-blur-md border-b border-line py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <button
            id="brand-logo-button"
            onClick={() => handleLinkClick('hero')}
            className="flex items-center gap-3 group text-left rounded-md"
          >
            <span className="font-semibold text-xl tracking-tight text-ink group-hover:text-accent transition-colors">
              Eugenio Tesio
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {sectionItems.slice(0, 3).map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleLinkClick(item.id)}
                  className={navLinkClass(isActive)}
                >
                  {item.label}
                </button>
              );
            })}
            <Link
              id="nav-link-blog"
              to={blogPath}
              className={navLinkClass(false)}
            >
              {t('nav.blog')}
            </Link>
            <button
              id="nav-link-contact"
              onClick={() => handleLinkClick('contact')}
              className={navLinkClass(activeSection === 'contact')}
            >
              {t('nav.contact')}
            </button>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <LanguageToggle />
            <button
              id="header-contact-button"
              onClick={() => handleLinkClick('contact')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-page text-lg font-medium hover:brightness-110 transition-all"
            >
              <Mail className="w-4 h-4" />
              <span>{t('nav.getInTouch')}</span>
            </button>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <LanguageToggle />
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-line text-ink"
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
            className="lg:hidden bg-page border-b border-line px-4 pt-3 pb-6 space-y-1 mt-3"
          >
            {sectionItems.slice(0, 3).map((item) => (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={mobileLinkClass(activeSection === item.id)}
              >
                {item.label}
              </button>
            ))}
            <Link
              to={blogPath}
              onClick={() => setMobileMenuOpen(false)}
              className={`block ${mobileLinkClass(false)}`}
            >
              {t('nav.blog')}
            </Link>
            <button
              onClick={() => handleLinkClick('contact')}
              className={mobileLinkClass(activeSection === 'contact')}
            >
              {t('nav.contact')}
            </button>
            <div className="pt-2">
              <button
                onClick={() => handleLinkClick('contact')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-accent text-page font-medium text-lg"
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
