import { useTranslation } from 'react-i18next';

const LOCALES = ['en', 'es'] as const;

export default function LanguageToggle() {
  const { i18n, t } = useTranslation();

  const currentLocale = i18n.language.startsWith('es') ? 'es' : 'en';

  return (
    <div
      className="flex items-center gap-0.5 p-0.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md"
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
            className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider transition-all ${
              isActive
                ? 'bg-[#00F5FF] text-black shadow-[0_0_12px_rgba(0,245,255,0.35)]'
                : 'text-[#A0A0A0] hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            {locale.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
