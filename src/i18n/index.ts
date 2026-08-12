import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import commonEn from './locales/en/common.json';
import commonPt from './locales/pt/common.json';
import dashboardEn from './locales/en/dashboard.json';
import dashboardPt from './locales/pt/dashboard.json';
import authEn from './locales/en/auth.json';
import authPt from './locales/pt/auth.json';
import errorEn from './locales/en/error.json';
import errorPt from './locales/pt/error.json';
import stayEn from './locales/en/stay.json';
import stayPt from './locales/pt/stay.json';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './language';

export const defaultNS = 'common';

export const resources = {
  en: {
    common: commonEn,
    dashboard: dashboardEn,
    auth: authEn,
    error: errorEn,
    stay: stayEn,
  },
  pt: {
    common: commonPt,
    dashboard: dashboardPt,
    auth: authPt,
    error: errorPt,
    stay: stayPt,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
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
