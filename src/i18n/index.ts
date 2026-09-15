import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import commonEn from './locales/en/common.json';
import commonPt from './locales/pt/common.json';
import authEn from './locales/en/auth.json';
import authPt from './locales/pt/auth.json';
import errorEn from './locales/en/error.json';
import errorPt from './locales/pt/error.json';
import landingEn from './locales/en/landing.json';
import landingPt from './locales/pt/landing.json';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './language';

export const defaultNS = 'common';

/**
 * Só os namespaces que a landing pública e as telas de autenticação precisam.
 * Os do produto (`dashboard`, `property`, `stay`, `billing`) são registrados
 * por `appNamespaces.ts`, que viaja no chunk do `AppLayout` — assim a landing
 * não baixa 56 KB de tradução de telas que ela não tem.
 */
export const resources = {
  en: {
    common: commonEn,
    auth: authEn,
    error: errorEn,
    landing: landingEn,
  },
  pt: {
    common: commonPt,
    auth: authPt,
    error: errorPt,
    landing: landingPt,
  },
} as const;

// O detector lê `localStorage` e `navigator`, que só existem no navegador. No
// servidor o idioma é sempre o padrão; as páginas públicas em outro idioma
// fixam o seu com `I18nPageProvider`.
if (typeof window !== 'undefined') i18n.use(LanguageDetector);

i18n.use(initReactI18next).init({
  resources,
  lng: typeof window === 'undefined' ? DEFAULT_LANGUAGE : undefined,
  // Os recursos já vêm no bundle. Síncrono, o render no servidor sai traduzido
  // em vez de mostrar as chaves cruas.
  initAsync: false,
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

export default i18n;
