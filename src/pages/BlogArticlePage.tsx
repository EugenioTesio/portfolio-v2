import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import BlogArticleReader from '../components/BlogArticleReader';
import BlogPageHeader from '../components/BlogPageHeader';
import { getBlogPostBySlug } from '../data/blogLoader';
import { BlogPost } from '../types';
import { getBlogIndexPath, resolveLocale } from '../utils/blogUrls';

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);

  const locale = resolveLocale(i18n.language, searchParams.get('lng'));
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

  let body;
  if (post === undefined) {
    body = (
      <div className="min-h-[50vh] flex items-center justify-center text-muted text-lg">
        Loading…
      </div>
    );
  } else if (!post) {
    body = (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
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
  } else {
    body = (
      <div className="py-12 sm:py-16 px-3 sm:px-6">
        <BlogArticleReader post={post} backHref={backHref} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <BlogPageHeader />
      {body}
    </div>
  );
}
