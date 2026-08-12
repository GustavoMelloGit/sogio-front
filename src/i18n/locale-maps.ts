import type { Locale } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import type { Language } from './language';

/** date-fns `locale` option, keyed by active language. */
export const DATE_FNS_LOCALES: Record<Language, Locale> = {
  pt: ptBR,
  en: enUS,
};

/** `Intl.NumberFormat`/`Intl.DateTimeFormat` locale tag, keyed by active language. */
export const INTL_LOCALES: Record<Language, string> = {
  pt: 'pt-BR',
  en: 'en-US',
};

/** date-fns format string for a long, spelled-out date (e.g. picker headers). */
export const LONG_DATE_FORMATS: Record<Language, string> = {
  pt: "d 'de' MMMM 'de' yyyy",
  en: 'MMMM d, yyyy',
};

/** date-fns format string for a short date (e.g. list rows, badges). */
export const SHORT_DATE_FORMATS: Record<Language, string> = {
  pt: "d 'de' MMM",
  en: 'MMM d',
};
