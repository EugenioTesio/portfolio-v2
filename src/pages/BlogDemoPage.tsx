import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import BlogPageHeader from '../components/BlogPageHeader';
import BlogDemo from '../components/BlogDemo';
import { getBlogPosts } from '../data/blogLoader';
import { resolveLocale } from '../utils/blogUrls';
export default function BlogDemoPage() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const { i18n, t } = useTranslation();
  const locale = resolveLocale(i18n.language, params.get('lng'));
  const post = getBlogPosts(locale).find(p => p.slug === slug && p.demo);
  useEffect(() => { document.title = `${post?.demo?.title ?? t('blog.articleNotFound')} | Eugenio Tesio`; return () => { document.title = 'Eugenio Tesio Portfolio'; }; }, [post?.demo?.title, t]);
  return <><BlogPageHeader /><main className="max-w-6xl mx-auto px-3 sm:px-6 py-8">
    <Link className="text-accent" to={post ? `/blog/${post.slug}?lng=${locale}` : `/blog?lng=${locale}`}>{t(post ? 'demo.back' : 'blog.backToArticles')}</Link>
    {post ? <><h1 className="text-3xl font-semibold mt-6">{post.demo!.title}</h1><BlogDemo post={post} locale={locale} standalone /></> : <p className="py-12">{t('blog.articleNotFound')}</p>}
  </main></>;
}
