import { useTranslation } from 'react-i18next';
import * as portfolioEn from './en';
import * as portfolioEs from './es';

export type Locale = 'en' | 'es';

export type PortfolioData = typeof portfolioEn;

const portfolioByLocale: Record<Locale, PortfolioData> = {
  en: portfolioEn,
  es: portfolioEs,
};

export function getPortfolioData(locale: string): PortfolioData {
  return locale === 'es' ? portfolioByLocale.es : portfolioByLocale.en;
}

export function usePortfolioData(): PortfolioData {
  const { i18n } = useTranslation();
  return getPortfolioData(i18n.language);
}

export { portfolioEn, portfolioEs };
