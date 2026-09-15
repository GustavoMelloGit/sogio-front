import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { env } from './env';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converte um objeto de filtros em query parameters para URLs
 * Remove valores undefined, null e strings vazias
 * Converte arrays em formato de query string apropriado
 * @param filters - Objeto com os filtros a serem convertidos
 * @returns String de query parameters formatada (sem o '?')
 */
export function objectToQueryParams(filters: Record<string, unknown>): string {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(item => {
        if (item !== undefined && item !== null && item !== '') {
          params.append(key, String(item));
        }
      });
    } else {
      params.set(key, String(value));
    }
  });

  return params.toString();
}

/**
 * Constrói uma URL completa com query parameters a partir de uma base URL e filtros
 * @param baseUrl - URL base (ex: '/property/123/stays')
 * @param filters - Objeto com os filtros a serem convertidos em query parameters
 * @returns URL completa com query parameters
 */
export function buildUrlWithParams(
  baseUrl: string,
  filters?: Record<string, unknown>
): string {
  const url = new URL(baseUrl, env.NEXT_PUBLIC_API_URL); // URL base temporária para parsing

  if (filters) {
    const queryParams = objectToQueryParams(filters);
    if (queryParams) {
      url.search = queryParams;
    }
  }

  return url.pathname + url.search;
}

/**
 * Copia o texto para a área de transferência
 * @param text - Texto a ser copiado
 */
export function toClipboard(text: string): void {
  navigator.clipboard.writeText(text);
}

/**
 * Retorna a palavra singular ou plural com base no número de itens
 * @param count - Número de itens
 * @param word - Palavra singular
 * @param word - Palavra plural
 * @returns Palavra singular ou plural com base no número de itens
 */
export function pluralize(
  count: number,
  word: string,
  pluralWord: string
): string {
  return count === 1 ? word : pluralWord;
}
