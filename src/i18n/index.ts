import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import commonEn from './locales/en/common.json';
import commonPt from './locales/pt/common.json';
import dashboardEn from './locales/en/dashboard.json';
import dashboardPt from './locales/pt/dashboard.json';

export const defaultNS = 'common';

export const resources = {
  en: { common: commonEn, dashboard: dashboardEn },
  pt: { common: commonPt, dashboard: dashboardPt },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    supportedLngs: ['en', 'pt'],
    defaultNS,
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

document.documentElement.lang = i18n.language;
i18n.on('languageChanged', lng => {
  document.documentElement.lang = lng;
});

export default i18n;
