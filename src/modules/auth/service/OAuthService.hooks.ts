import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OAuthService } from './OAuthService';
import type { AuthorizationDecision } from '../types/OAuthTypes';

/**
 * Hook para consultar um pedido de autorização pendente.
 * `enabled: false` quando `requestId` é nulo (ex.: `request_id` ausente da
 * query string) — a tela trata esse caso antes mesmo de chamar a API.
 */
export const usePendingAuthorizationRequest = (requestId: string | null) => {
  const {
    data: request,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ['pendingAuthorizationRequest', requestId],
    queryFn: () =>
      OAuthService.getPendingAuthorizationRequest(requestId as string),
    enabled: !!requestId,
  });

  return { request, isLoading, error };
};

/**
 * Hook para enviar a decisão (aprovar/negar) de um pedido de autorização.
 * Usado tanto pela UI interativa quanto pelo atalho de reconexão automática
 * (`has_existing_consent: true`).
 */
export const useDecideAuthorizationRequest = () => {
  const {
    mutate: decide,
    mutateAsync: decideAsync,
    isPending: isLoading,
    error,
    variables,
  } = useMutation({
    mutationFn: ({
      requestId,
      decision,
    }: {
      requestId: string;
      decision: AuthorizationDecision;
    }) => OAuthService.decideAuthorizationRequest(requestId, decision),
  });

  return {
    decide,
    decideAsync,
    isLoading,
    error,
    pendingDecision: variables?.decision,
  };
};

/**
 * Hook para listar os aplicativos conectados do usuário autenticado.
 */
export const useConnectedApps = () => {
  const {
    data: apps,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ['connectedApps'],
    queryFn: () => OAuthService.listConnectedApps(),
  });

  return { apps: apps ?? [], isLoading, error };
};

/**
 * Hook para desconectar (revogar) um aplicativo já autorizado. Invalida a
 * lista de aplicativos conectados após sucesso.
 */
export const useDisconnectApp = () => {
  const queryClient = useQueryClient();

  const {
    mutate: disconnect,
    isPending: isLoading,
    error,
    reset,
  } = useMutation({
    mutationFn: (consentId: string) => OAuthService.disconnectApp(consentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connectedApps'] });
    },
  });

  return { disconnect, isLoading, error, reset };
};
