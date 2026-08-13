export const SUPPORTED_LANGUAGES = ['en', 'pt'] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'pt';
