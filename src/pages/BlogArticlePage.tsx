import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import BlogArticleReader from '../components/BlogArticleReader';
import { getBlogPostBySlug } from '../data/blogLoader';
import { Locale } from '../data/portfolio';
import { BlogPost } from '../types';
import { getBlogIndexPath } from '../utils/blogUrls';

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);

  const lngParam = searchParams.get('lng');

  useEffect(() => {
    if (lngParam === 'es' && !i18n.language.startsWith('es')) {
      i18n.changeLanguage('es');
    }
  }, [lngParam, i18n]);

  const locale = (i18n.language.startsWith('es') ? 'es' : 'en') as Locale;
  const backHref = getBlogIndexPath(locale);

  useEffect(() => {
    let cancelled = false;
    setPost(undefined);

    if (!slug) {
      setPost(null);
      return;
    }

    void getBlogPostBySlug(slug, locale).then((result) => {
      if (!cancelled) setPost(result ?? null);
    });

    return () => {
      cancelled = true;
    };
  }, [slug, locale]);

  if (post === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted text-lg">
        Loading…
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-ink font-medium">{t('blog.articleNotFound')}</p>
          <Link
            to={backHref}
            className="inline-flex items-center gap-2 text-lg font-medium text-accent"
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
      <BlogArticleReader post={post} backHref={backHref} />
    </div>
  );
}
