import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { resolveLocale } from '../utils/blogUrls';

const LOCALES = ['en', 'es'] as const;

function isBlogPath(pathname: string): boolean {
  return pathname === '/blog' || pathname.startsWith('/blog/');
}

export default function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const onBlog = isBlogPath(location.pathname);
  const lngParam = onBlog ? searchParams.get('lng') : null;
  const currentLocale = resolveLocale(i18n.language, lngParam);

  useEffect(() => {
    if (!onBlog) return;
    if (lngParam !== 'en' && lngParam !== 'es') return;
    const active = i18n.language.startsWith('es') ? 'es' : 'en';
    if (active !== lngParam) {
      void i18n.changeLanguage(lngParam);
    }
    // Apply the URL locale when it changes. The i18n instance is stable, so a
    // language update does not re-run this effect and fight the new URL.
  }, [onBlog, lngParam, i18n]);

  const selectLocale = (locale: (typeof LOCALES)[number]) => {
    if (locale === currentLocale) return;

    if (!onBlog) {
      void i18n.changeLanguage(locale);
      return;
    }

    const next = new URLSearchParams(searchParams);
    next.set('lng', locale);
    setSearchParams(next, {
      replace: true,
      preventScrollReset: true,
      state: location.state,
    });
  };

  return (
    <div
      className="flex items-center gap-0.5 p-0.5 rounded-lg bg-surface border border-line"
      role="group"
      aria-label={t('languageToggle.label')}
    >
      {LOCALES.map((locale) => {
        const isActive = currentLocale === locale;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => selectLocale(locale)}
            aria-pressed={isActive}
            aria-label={t(`languageToggle.${locale}`)}
            className={`px-2.5 py-1 rounded-md text-base font-medium transition-colors ${
              isActive
                ? 'bg-accent text-page'
                : 'text-muted hover:text-ink'
            }`}
          >
            {locale.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
