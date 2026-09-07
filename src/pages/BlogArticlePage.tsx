import { useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import BlogArticleReader from '../components/BlogArticleReader';
import { getBlogPostBySlug } from '../data/blogLoader';
import { Locale } from '../data/portfolio';

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();

  const lngParam = searchParams.get('lng');

  useEffect(() => {
    if (lngParam === 'es' && !i18n.language.startsWith('es')) {
      i18n.changeLanguage('es');
    }
  }, [lngParam, i18n]);

  const locale = (i18n.language.startsWith('es') ? 'es' : 'en') as Locale;

  const post = useMemo(() => {
    if (!slug) return undefined;
    return getBlogPostBySlug(slug, locale);
  }, [slug, locale]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4 p-8 rounded-[24px] bg-white/[0.03] border border-white/10 backdrop-blur-xl max-w-md">
          <p className="text-white font-bold">{t('blog.articleNotFound')}</p>
          <Link
            to="/#blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00F5FF] hover:text-white transition-colors font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('blog.backToArticles')}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 sm:py-24 px-3 sm:px-6">
      <BlogArticleReader post={post} backHref="/#blog" />
    </div>
  );
}
