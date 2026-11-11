import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Locale } from '../data/portfolio';
import { getBlogIndexPath } from '../utils/blogUrls';
import BlogPostList from './BlogPostList';

export default function BlogSection() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language.startsWith('es') ? 'es' : 'en') as Locale;

  return (
    <section id="blog" className="py-[5.5rem] border-t border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 mb-10 max-w-[65ch]">
          <h2 className="text-4xl sm:text-5xl font-semibold text-ink tracking-tight leading-snug">
            {[t('blog.title'), t('blog.titleHighlight')].filter(Boolean).join(' ')}
          </h2>
          <p className="text-xl leading-[1.6] text-muted">{t('blog.subtitle')}</p>
        </div>

        <BlogPostList limit={3} showFilters={false} openInNewTab />

        <div className="mt-10">
          <Link
            to={getBlogIndexPath(locale)}
            className="inline-flex items-center gap-1.5 text-lg font-medium text-accent"
          >
            <span>{t('blog.viewAllArticles')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
