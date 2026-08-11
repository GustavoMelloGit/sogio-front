import {
  useEffect,
  useRef,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Alert } from '@/components/Alert';
import { useAuthData } from '../service/AuthService.hooks';
import {
  useDecideAuthorizationRequest,
  usePendingAuthorizationRequest,
} from '../service/OAuthService.hooks';
import {
  getOAuthErrorMessage,
  isRequestNotFoundError,
} from '../service/oauthError';
import { InlineSigninForm } from '../components/InlineSigninForm';
import type { AuthorizationDecision } from '../types/OAuthTypes';

const INVALID_LINK_TITLE = 'Link de autorização inválido';
const INVALID_LINK_MESSAGE =
  'Este link de autorização é inválido. Feche esta janela e tente novamente a partir do aplicativo que solicitou o acesso.';
const EXPIRED_LINK_MESSAGE =
  'Este link expirou, já foi usado, ou não existe mais. Feche esta janela e tente novamente a partir do aplicativo que solicitou o acesso.';

const PageShell: FC<PropsWithChildren> = ({ children }) => (
  <main className='flex min-h-dvh items-center justify-center bg-background px-4 py-12'>
    <Card className='w-full max-w-sm'>{children}</Card>
  </main>
);

const AppIdentity: FC<{ name: string; verified: boolean }> = ({
  name,
  verified,
}) => (
  <div className='flex flex-wrap items-center gap-2'>
    <span className='font-semibold'>{name}</span>
    {!verified && <Badge variant='outline'>Não verificado</Badge>}
  </div>
);

const ErrorCard: FC<{ title: string; message: string }> = ({
  title,
  message,
}) => (
  <PageShell>
    <CardHeader>
      <h1 className='text-lg leading-none font-semibold'>{title}</h1>
    </CardHeader>
    <CardContent>
      <Alert role='alert' variant='destructive' message={message} />
    </CardContent>
  </PageShell>
);

const LoadingCard: FC = () => (
  <PageShell>
    <CardHeader className='space-y-3'>
      <Skeleton className='h-5 w-40' />
      <Skeleton className='h-4 w-full' />
    </CardHeader>
    <CardContent className='space-y-4'>
      <Skeleton className='h-16 w-full' />
      <Skeleton className='h-10 w-full' />
      <Skeleton className='h-10 w-full' />
    </CardContent>
  </PageShell>
);

/**
 * Tela de consentimento OAuth. Não usa `ProtectedRoute`: `ProtectedRoute`/
 * `LoginView` hoje só restauram `location.state.from.pathname` no retorno do
 * login, nunca `.search` — envolver esta rota nele perderia `?request_id=`
 * sempre que o usuário precisasse logar durante o fluxo. Em vez disso, a
 * própria tela trata "não autenticado" sem navegar para lugar nenhum (ver
 * `InlineSigninForm`), o que também evita depender do redirect global do
 * axios em 401 para esta rota.
 */
const ConnectAuthorizeView: FC = () => {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('request_id');
  const queryClient = useQueryClient();

  const { isAuthenticated, isLoading: isAuthLoading } = useAuthData();
  const {
    request,
    isLoading: isRequestLoading,
    error: requestError,
  } = usePendingAuthorizationRequest(requestId);
  const {
    decide,
    decideAsync,
    isLoading: isDeciding,
    error: decisionError,
    pendingDecision,
  } = useDecideAuthorizationRequest();

  const [autoApproveFailed, setAutoApproveFailed] = useState(false);
  const hasAutoApprovedRef = useRef(false);

  const shouldAutoApprove =
    !!request?.has_existing_consent && isAuthenticated && !autoApproveFailed;

  // Atalho de reconexão: quando o backend já reconhece um consentimento
  // válido para este usuário/app, a decisão é enviada automaticamente, sem
  // mostrar a UI de aprovar/negar.
  useEffect(() => {
    if (!shouldAutoApprove || !requestId || hasAutoApprovedRef.current) {
      return;
    }
    hasAutoApprovedRef.current = true;
    decideAsync({ requestId, decision: 'approve' })
      .then(response => {
        window.location.href = response.redirect_to;
      })
      .catch(() => {
        setAutoApproveFailed(true);
      });
  }, [shouldAutoApprove, requestId, decideAsync]);

  const handleSigninSuccess = (): void => {
    if (!requestId) return;
    // O `has_existing_consent` da consulta original foi calculado para um
    // caller anônimo (sessão ausente). Reconsulta agora que há sessão, para
    // que o atalho de reconexão funcione também para quem loga durante o
    // próprio fluxo, não só para quem já estava logado ao chegar aqui.
    queryClient.invalidateQueries({
      queryKey: ['pendingAuthorizationRequest', requestId],
    });
  };

  const handleDecision = (decision: AuthorizationDecision): void => {
    if (!requestId) return;
    decide(
      { requestId, decision },
      {
        onSuccess: response => {
          window.location.href = response.redirect_to;
        },
      }
    );
  };

  if (!requestId) {
    return (
      <ErrorCard title={INVALID_LINK_TITLE} message={INVALID_LINK_MESSAGE} />
    );
  }

  if (isAuthLoading || isRequestLoading) {
    return <LoadingCard />;
  }

  if (requestError || !request) {
    const notFound = isRequestNotFoundError(requestError);
    return (
      <ErrorCard
        title={INVALID_LINK_TITLE}
        message={
          notFound ? EXPIRED_LINK_MESSAGE : getOAuthErrorMessage(requestError)
        }
      />
    );
  }

  if (autoApproveFailed) {
    const notFound = isRequestNotFoundError(decisionError);
    return (
      <ErrorCard
        title={INVALID_LINK_TITLE}
        message={
          notFound ? EXPIRED_LINK_MESSAGE : getOAuthErrorMessage(decisionError)
        }
      />
    );
  }

  if (shouldAutoApprove) {
    return (
      <PageShell>
        <CardHeader className='space-y-3'>
          <h1 className='text-lg leading-none font-semibold'>Reconectando</h1>
          <AppIdentity
            name={request.app_display_name}
            verified={request.app_display_name_verified}
          />
        </CardHeader>
        <CardContent>
          <div
            className='flex items-center justify-center gap-3 py-6'
            aria-live='polite'
          >
            <span aria-hidden='true'>
              <Spinner />
            </span>
            <span className='text-sm text-muted-foreground'>Reconectando…</span>
          </div>
        </CardContent>
      </PageShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageShell>
        <CardHeader className='space-y-3'>
          <h1 className='text-lg leading-none font-semibold'>
            Entrar para continuar
          </h1>
          <AppIdentity
            name={request.app_display_name}
            verified={request.app_display_name_verified}
          />
          <CardDescription>
            Entre com sua conta StayHub para revisar este pedido de acesso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InlineSigninForm onSuccess={handleSigninSuccess} />
        </CardContent>
      </PageShell>
    );
  }

  const decisionNotFound = decisionError
    ? isRequestNotFoundError(decisionError)
    : false;

  if (decisionNotFound) {
    return (
      <ErrorCard title={INVALID_LINK_TITLE} message={EXPIRED_LINK_MESSAGE} />
    );
  }

  return (
    <PageShell>
      <CardHeader className='space-y-3'>
        <h1 className='text-lg leading-none font-semibold'>Autorizar acesso</h1>
        <AppIdentity
          name={request.app_display_name}
          verified={request.app_display_name_verified}
        />
        <CardDescription>{request.scope_description}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='rounded-md border bg-muted p-3'>
          <p className='text-xs text-muted-foreground'>
            Você será redirecionado para
          </p>
          <p className='break-all font-mono text-sm'>{request.redirect_host}</p>
        </div>

        {decisionError && (
          <Alert
            role='alert'
            variant='destructive'
            message={getOAuthErrorMessage(decisionError)}
          />
        )}

        <div className='flex flex-col gap-2'>
          <Button
            size='lg'
            className='w-full'
            isLoading={isDeciding && pendingDecision === 'approve'}
            disabled={isDeciding}
            onClick={() => handleDecision('approve')}
          >
            Aprovar
          </Button>
          <Button
            size='lg'
            variant='outline'
            className='w-full'
            isLoading={isDeciding && pendingDecision === 'deny'}
            disabled={isDeciding}
            onClick={() => handleDecision('deny')}
          >
            Negar
          </Button>
        </div>
      </CardContent>
    </PageShell>
  );
};

export default ConnectAuthorizeView;
