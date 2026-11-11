import { useTranslation } from 'react-i18next';
import { usePortfolioData } from '../data/portfolio';

interface AboutSectionProps {
  onNavigate: (sectionId: string) => void;
}

const GROUP_KEYS = ['mobile', 'backend', 'delivery', 'hardware'] as const;

export default function AboutSection({ onNavigate }: AboutSectionProps) {
  const { t } = useTranslation();
  const { PERSONAL_INFO } = usePortfolioData();

  return (
    <section id="about" className="py-[5.5rem] border-t border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 mb-12 max-w-[65ch]">
          <h2 className="text-4xl sm:text-5xl font-semibold text-ink tracking-tight leading-snug">
            {t('about.title')}
          </h2>
          <p className="text-xl leading-[1.6] text-muted">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-5 max-w-[65ch]">
            <p className="text-xl leading-[1.6] text-muted">
              {t('about.degreeLead')}{' '}
              <span className="text-ink">{t('about.degreeTitle')}</span>
              {' · '}
              {PERSONAL_INFO.education.institution}
              {' · '}
              {PERSONAL_INFO.education.period}
            </p>
            <p className="text-xl leading-[1.6] text-muted">
              {t('about.capstoneDesc')}
            </p>
            <p className="text-xl leading-[1.6] text-muted">
              {t('about.electronicsDesc')}
            </p>
            <p className="text-base text-faint">{t('about.languages')}</p>
            <button
              onClick={() => onNavigate('experience')}
              className="text-lg font-medium text-accent underline underline-offset-4"
            >
              {t('about.seeRoles')}
            </button>
          </div>

          <div className="lg:col-span-5 space-y-8">
            {GROUP_KEYS.map((key) => (
              <div key={key} className="space-y-3">
                <h3 className="text-2xl font-semibold text-ink tracking-tight">
                  {t(`about.groups.${key}.title`)}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {t(`about.groups.${key}.items`).split(', ').map((item) => (
                    <li
                      key={item}
                      className="px-3.5 py-2 rounded-lg bg-ink text-page text-base font-semibold tracking-tight"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-lg leading-relaxed text-ink">
                  {t(`about.groups.${key}.proof`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
