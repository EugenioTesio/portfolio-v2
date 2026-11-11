import { Locale } from '../data/portfolio';

export const BLOG_FROM_PORTFOLIO_STATE = { fromPortfolio: true } as const;

export type BlogLocationState = {
  fromPortfolio?: boolean;
};

function withLocaleQuery(path: string, locale: Locale): string {
  return locale === 'es' ? `${path}?lng=es` : path;
}

export function getBlogIndexPath(locale: Locale = 'en'): string {
  return withLocaleQuery('/blog', locale);
}

export function getBlogIndexUrl(locale: Locale = 'en'): string {
  return `${window.location.origin}${getBlogIndexPath(locale)}`;
}

export function getBlogArticlePath(slug: string, locale: Locale = 'en'): string {
  return withLocaleQuery(`/blog/${slug}`, locale);
}

export function getBlogArticleUrl(slug: string, locale: Locale = 'en'): string {
  return `${window.location.origin}${getBlogArticlePath(slug, locale)}`;
}
