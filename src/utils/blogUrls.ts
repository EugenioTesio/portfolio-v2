import { Locale } from '../data/portfolio';

export function getBlogArticlePath(slug: string, locale: Locale = 'en'): string {
  const base = `/blog/${slug}`;
  return locale === 'es' ? `${base}?lng=es` : base;
}

export function getBlogArticleUrl(slug: string, locale: Locale = 'en'): string {
  return `${window.location.origin}${getBlogArticlePath(slug, locale)}`;
}
