import { env } from '../lib/env';

/**
 * Configurações específicas por ambiente
 * Centraliza todas as configurações baseadas no ambiente atual
 */
export const environments = {
  /**
   * Configurações da API
   */
  api: {
    baseURL: env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    retryAttempts: 3,
  },

  /**
   * Configurações de cache
   */
  cache: {
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  },
} as const;
