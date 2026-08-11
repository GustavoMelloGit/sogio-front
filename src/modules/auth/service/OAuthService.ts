import { z } from 'zod';
import api from '@/lib/api';
import {
  pendingAuthorizationRequestSchema,
  decisionResponseSchema,
  connectedAppSchema,
  type PendingAuthorizationRequest,
  type AuthorizationDecision,
  type DecisionResponse,
  type ConnectedApp,
} from '../types/OAuthTypes';

/**
 * Serviço responsável pelo protocolo de autorização delegada OAuth do
 * servidor MCP: consulta e decisão do pedido de consentimento, e gestão dos
 * aplicativos já conectados à conta do usuário.
 */
export class OAuthService {
  /**
   * Consulta um pedido de autorização pendente pelo `request_id` opaco da
   * query string. Rota pública — funciona sem sessão, nunca responde 401.
   */
  static async getPendingAuthorizationRequest(
    requestId: string
  ): Promise<PendingAuthorizationRequest> {
    const response = await api.get('/connect/authorize/pending-request', {
      params: { request_id: requestId },
    });
    return pendingAuthorizationRequestSchema.parse(response.data);
  }

  /**
   * Envia a decisão do usuário autenticado (aprovar ou negar) para um
   * pedido de autorização. Retorna a URL completa para onde o navegador
   * deve navegar em seguida.
   */
  static async decideAuthorizationRequest(
    requestId: string,
    decision: AuthorizationDecision
  ): Promise<DecisionResponse> {
    const response = await api.post('/connect/authorize/decision', {
      request_id: requestId,
      decision,
    });
    return decisionResponseSchema.parse(response.data);
  }

  /**
   * Lista os aplicativos MCP que o usuário autenticado já autorizou.
   */
  static async listConnectedApps(): Promise<ConnectedApp[]> {
    const response = await api.get('/auth/connected-apps');
    return z.array(connectedAppSchema).parse(response.data);
  }

  /**
   * Revoga o consentimento identificado por `consentId` e, em cascata,
   * todas as credenciais derivadas dele.
   */
  static async disconnectApp(consentId: string): Promise<void> {
    await api.delete(`/auth/connected-apps/${consentId}`);
  }
}
