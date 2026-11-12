import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import BlogPageHeader from '../components/BlogPageHeader';
import BlogPostList from '../components/BlogPostList';
import { BlogLocationState } from '../utils/blogUrls';

const DEFAULT_TITLE = 'Eugenio Tesio Portfolio';

export default function BlogIndexPage() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const fromPortfolio = Boolean(
    (location.state as BlogLocationState | null)?.fromPortfolio
  );

  useEffect(() => {
    document.title = `${t('blog.indexTitle')} | Eugenio Tesio`;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [t, i18n.language]);

  return (
    <div className="min-h-screen">
      <BlogPageHeader
        leading={
          fromPortfolio ? (
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-lg font-medium text-muted hover:text-ink"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('blog.backToPortfolio')}</span>
            </Link>
          ) : null
        }
      />

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
