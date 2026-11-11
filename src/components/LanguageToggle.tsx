import { useTranslation } from 'react-i18next';

const LOCALES = ['en', 'es'] as const;

export default function LanguageToggle() {
  const { i18n, t } = useTranslation();

  const currentLocale = i18n.language.startsWith('es') ? 'es' : 'en';

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
            onClick={() => i18n.changeLanguage(locale)}
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
