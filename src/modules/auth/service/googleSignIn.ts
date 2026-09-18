import { env } from '@/lib/env';
import { RETURN_PARAM, ROUTES, returnPath } from '@/routes/routes';

const GOOGLE_SIGN_IN_START_PATH = '/auth/google/start';

/** Nome do parâmetro com que a API recebe e devolve o destino de retorno. */
const GOOGLE_RETURN_PARAM = 'return_to';

const GOOGLE_SIGN_IN_ERRORS = [
  'canceled',
  'expired',
  'email_not_verified',
  'account_conflict',
  'unavailable',
] as const;

export type GoogleSignInError = (typeof GOOGLE_SIGN_IN_ERRORS)[number];

export type GoogleSignInOutcome =
  | { kind: 'navigate'; to: string; notice?: 'linked' }
  | { kind: 'error'; error: GoogleSignInError; returnTo: string | null };

const safeReturnTo = (value: string | null | undefined): string | null =>
  value && returnPath(value) === value ? value : null;

const isGoogleSignInError = (
  value: string | null
): value is GoogleSignInError =>
  GOOGLE_SIGN_IN_ERRORS.some(error => error === value);

const isConsentPath = (path: string): boolean =>
  new URL(path, 'http://sogio.local').pathname === ROUTES.connectAuthorize;

/**
 * URL para onde o navegador vai quando a pessoa escolhe entrar com o Google.
 * É navegação comum, nunca uma chamada pelo cliente HTTP: a API conduz o
 * fluxo com o Google e grava o cookie de sessão.
 */
export const googleSignInUrl = (from: string | null | undefined): string => {
  const url = new URL(
    `${env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '')}${GOOGLE_SIGN_IN_START_PATH}`
  );
  const returnTo = safeReturnTo(from);
  if (returnTo) url.searchParams.set(GOOGLE_RETURN_PARAM, returnTo);
  return url.toString();
};

/**
 * Tela para onde volta quem escolheu entrar com email e senha a partir de um
 * desfecho do Google. O consentimento OAuth tem o próprio formulário de
 * login, e mandá-lo para `/login` tiraria a pessoa daquele fluxo.
 */
export const passwordSignInPath = (returnTo: string | null): string => {
  if (!returnTo) return ROUTES.login;
  if (isConsentPath(returnTo)) return returnTo;
  return `${ROUTES.login}?${new URLSearchParams({ [RETURN_PARAM]: returnTo })}`;
};

/**
 * Decide o que fazer com o navegador que a API devolveu a `/login/google`.
 * O `return_to` chega pela URL, então é tratado como entrada não confiável e
 * passa por `returnPath()` antes de virar destino.
 */
export const resolveGoogleSignInOutcome = (
  params: URLSearchParams
): GoogleSignInOutcome => {
  const returnTo = safeReturnTo(params.get(GOOGLE_RETURN_PARAM));
  const status = params.get('status');
  const error = params.get('error');

  if (!error && (status === 'signed_in' || status === 'linked')) {
    return {
      kind: 'navigate',
      to: returnPath(returnTo),
      ...(status === 'linked' && { notice: 'linked' as const }),
    };
  }

  if (!error && status === 'account_created') {
    return {
      kind: 'navigate',
      to: returnTo && isConsentPath(returnTo) ? returnTo : ROUTES.choosePlan,
    };
  }

  if (error === 'canceled') {
    return { kind: 'navigate', to: passwordSignInPath(returnTo) };
  }

  return {
    kind: 'error',
    error: isGoogleSignInError(error) ? error : 'unavailable',
    returnTo,
  };
};
