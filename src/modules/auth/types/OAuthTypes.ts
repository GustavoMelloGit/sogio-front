import { z } from 'zod';

/**
 * Resposta de `GET /connect/authorize/pending-request`.
 * `app_display_name` é autodeclarado pelo cliente MCP solicitante — nunca
 * confiável, sempre exibido com o selo de "não verificado". `redirect_host`
 * é o único sinal que o usuário pode de fato confiar.
 */
export const pendingAuthorizationRequestSchema = z.object({
  app_display_name: z.string(),
  app_display_name_verified: z.boolean(),
  redirect_host: z.string(),
  scope_description: z.string(),
  has_existing_consent: z.boolean(),
});

export type PendingAuthorizationRequest = z.infer<
  typeof pendingAuthorizationRequestSchema
>;

export type AuthorizationDecision = 'approve' | 'deny';

/**
 * Resposta de `POST /connect/authorize/decision`. `redirect_to` deve ser
 * usado apenas com navegação completa do navegador — nunca com o router do
 * React, já que o destino normalmente não pertence a esta SPA.
 */
export const decisionResponseSchema = z.object({
  redirect_to: z.string(),
});

export type DecisionResponse = z.infer<typeof decisionResponseSchema>;

/** Item de `GET /auth/connected-apps`. */
export const connectedAppSchema = z.object({
  consent_id: z.string(),
  app_display_name: z.string(),
  app_display_name_verified: z.boolean(),
  redirect_hosts: z.array(z.string()),
  granted_at: z.coerce.date(),
  last_used_at: z.coerce.date(),
});

export type ConnectedApp = z.infer<typeof connectedAppSchema>;

/**
 * Formato de erro das rotas do protocolo OAuth — `{ error, error_description }`,
 * diferente do `{ message }` que o interceptor de resposta do axios normaliza
 * para `error.message`. Usar `getOAuthErrorMessage` para extrair a mensagem
 * dessas respostas em vez de confiar em `error.message`.
 */
export interface OAuthProtocolError {
  error: string;
  error_description: string;
}
