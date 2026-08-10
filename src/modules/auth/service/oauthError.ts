import { isAxiosError } from 'axios';

const FALLBACK_MESSAGE =
  'Não foi possível concluir a solicitação. Tente novamente.';

/**
 * Extrai `error_description` da resposta das rotas do protocolo OAuth
 * (`{ error, error_description }`). Necessário porque o interceptor global
 * do axios só normaliza `error.message` a partir de um campo `message`, que
 * essas rotas não retornam — confiar em `error.message` aqui devolveria a
 * mensagem genérica do axios ("Request failed with status code 404"), não a
 * descrição real do backend.
 */
export function getOAuthErrorMessage(error: unknown): string {
  if (
    isAxiosError(error) &&
    typeof error.response?.data === 'object' &&
    error.response.data !== null &&
    'error_description' in error.response.data &&
    typeof error.response.data.error_description === 'string'
  ) {
    return error.response.data.error_description;
  }

  return FALLBACK_MESSAGE;
}

/**
 * `true` quando o erro é um 404 do protocolo OAuth (`request_not_found`) —
 * o pedido de autorização não existe, expirou, ou já foi usado. É sempre um
 * estado terminal: não há destino para navegar nem sentido em tentar de novo.
 */
export function isRequestNotFoundError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 404;
}
