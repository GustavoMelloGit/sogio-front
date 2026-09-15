import type { TranslateFn } from '@/i18n/useTranslation';
import type { Language } from '@/i18n/language';
import landingEn from '@/i18n/locales/en/landing.json';
import landingPt from '@/i18n/locales/pt/landing.json';

const DICTIONARIES: Record<Language, unknown> = {
  en: landingEn,
  pt: landingPt,
};

/**
 * Tradutor de leitura direta sobre o JSON da landing, para metadata e JSON-LD.
 *
 * Roda em Server Component, onde o `react-i18next` não pode ser importado. Os
 * builders só pedem chaves de `meta` e `faq`, nenhuma com interpolação, então
 * um `reduce` por caminho basta. A chave ausente estoura o build de propósito:
 * uma `meta` vazia passaria despercebida até alguém olhar o resultado da busca.
 */
export const landingTranslator =
  (language: Language): TranslateFn =>
  key => {
    const value = key
      .split('.')
      .reduce<unknown>(
        (node, part) =>
          node && typeof node === 'object'
            ? (node as Record<string, unknown>)[part]
            : undefined,
        DICTIONARIES[language]
      );

    if (typeof value !== 'string') {
      throw new Error(
        `[seo] chave de tradução ausente em ${language}: "${key}"`
      );
    }

    return value;
  };
