import { Locale } from '../data/portfolio';

export const BLOG_FROM_PORTFOLIO_STATE = { fromPortfolio: true } as const;

export type BlogLocationState = {
  fromPortfolio?: boolean;
};

function withLocaleQuery(path: string, locale: Locale): string {
  return `${path}?lng=${locale}`;
}

/** URL `lng` wins when it is explicit. Otherwise follow the active i18n language. */
export function resolveLocale(language: string, lngParam?: string | null): Locale {
  if (lngParam === 'es' || lngParam === 'en') return lngParam;
  return language.startsWith('es') ? 'es' : 'en';
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
