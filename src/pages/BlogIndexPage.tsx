import { useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import BlogPostList from '../components/BlogPostList';
import LanguageToggle from '../components/LanguageToggle';
import { BlogLocationState } from '../utils/blogUrls';

const DEFAULT_TITLE = 'Eugenio Tesio Portfolio';

export default function BlogIndexPage() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const lngParam = searchParams.get('lng');
  const fromPortfolio = Boolean(
    (location.state as BlogLocationState | null)?.fromPortfolio
  );

  useEffect(() => {
    if (lngParam === 'es' && !i18n.language.startsWith('es')) {
      i18n.changeLanguage('es');
    }
  }, [lngParam, i18n]);

  useEffect(() => {
    document.title = `${t('blog.indexTitle')} | Eugenio Tesio`;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [t, i18n.language]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-page/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {fromPortfolio && (
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-lg font-medium text-muted hover:text-ink"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('blog.backToPortfolio')}</span>
              </Link>
            )}
            <Link
              to="/"
              className="font-semibold text-xl tracking-tight text-ink hover:text-accent transition-colors"
            >
              Eugenio Tesio
            </Link>
          </div>
          <LanguageToggle />
        </div>
      </header>

      <main className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3 mb-10 max-w-[65ch]">
            <h1 className="text-4xl sm:text-5xl font-semibold text-ink tracking-tight leading-snug">
              {[t('blog.title'), t('blog.titleHighlight')].filter(Boolean).join(' ')}
            </h1>
            <p className="text-xl leading-[1.6] text-muted">{t('blog.subtitle')}</p>
          </div>

          <BlogPostList />
        </div>
      </main>
    </div>
  );
}
