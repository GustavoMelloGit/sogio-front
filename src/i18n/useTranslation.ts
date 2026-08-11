import { useTranslation as useI18nextTranslation } from 'react-i18next';
import type { Language } from './language';

type TranslationValues = Record<string, string | number>;

export type TranslateFn = (key: string, values?: TranslationValues) => string;

export interface UseTranslationResult {
  t: TranslateFn;
  language: Language;
  changeLanguage: (language: Language) => void;
}

/**
 * Wraps the underlying i18n library behind a stable interface so it can be
 * swapped (e.g. away from react-i18next) without touching every consumer.
 */
export function useTranslation(
  namespaces?: string | string[]
): UseTranslationResult {
  const { t, i18n } = useI18nextTranslation(namespaces);

  return {
    t,
    language: i18n.language as Language,
    changeLanguage: language => {
      void i18n.changeLanguage(language);
    },
  };
}
