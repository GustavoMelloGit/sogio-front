import { describe, expect, it } from 'vitest';
import { env } from '@/lib/env';
import { ROUTES } from '@/routes/routes';
import {
  googleSignInUrl,
  passwordSignInPath,
  resolveGoogleSignInOutcome,
} from './googleSignIn';

const outcome = (query: Record<string, string>) =>
  resolveGoogleSignInOutcome(new URLSearchParams(query));

const CONSENT = '/connect/authorize?request_id=abc';

describe('googleSignInUrl', () => {
  const start = `${env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '')}/auth/google/start`;

  it('aponta para o início do fluxo na API', () => {
    expect(googleSignInUrl(null)).toBe(start);
  });

  it('leva o destino de retorno quando ele é seguro', () => {
    const url = new URL(googleSignInUrl(CONSENT));
    expect(url.searchParams.get('return_to')).toBe(CONSENT);
  });

  it.each(['//outro.site', 'https://outro.site', '/\t/outro.site'])(
    'descarta o destino inseguro %j',
    from => {
      expect(googleSignInUrl(from)).toBe(start);
    }
  );
});

describe('resolveGoogleSignInOutcome', () => {
  it.each(['signed_in', 'linked'])(
    '%s volta para o destino de retorno',
    status => {
      expect(
        outcome({ status, return_to: '/app/properties?year=2026' })
      ).toMatchObject({ kind: 'navigate', to: '/app/properties?year=2026' });
    }
  );

  it('signed_in sem destino vai para o painel', () => {
    expect(outcome({ status: 'signed_in' })).toEqual({
      kind: 'navigate',
      to: ROUTES.home,
    });
  });

  it('linked avisa o vínculo', () => {
    expect(outcome({ status: 'linked' })).toEqual({
      kind: 'navigate',
      to: ROUTES.home,
      notice: 'linked',
    });
  });

  it('account_created vai para a escolha de plano', () => {
    expect(
      outcome({ status: 'account_created', return_to: '/app/properties' })
    ).toEqual({ kind: 'navigate', to: ROUTES.choosePlan });
  });

  it('account_created respeita o consentimento OAuth', () => {
    expect(outcome({ status: 'account_created', return_to: CONSENT })).toEqual({
      kind: 'navigate',
      to: CONSENT,
    });
  });

  it.each(['//outro.site', 'https://outro.site', '/\t/outro.site', '/\\x'])(
    'nunca navega para o destino inseguro %j',
    returnTo => {
      expect(outcome({ status: 'signed_in', return_to: returnTo })).toEqual({
        kind: 'navigate',
        to: ROUTES.home,
      });
    }
  );

  it('um consentimento de mentira não escapa da escolha de plano', () => {
    expect(
      outcome({ status: 'account_created', return_to: '//connect/authorize' })
    ).toEqual({ kind: 'navigate', to: ROUTES.choosePlan });
  });

  it('canceled volta ao login preservando o destino', () => {
    expect(
      outcome({ error: 'canceled', return_to: '/app/properties' })
    ).toEqual({ kind: 'navigate', to: '/login?from=%2Fapp%2Fproperties' });
  });

  it('canceled sem destino volta ao login', () => {
    expect(outcome({ error: 'canceled' })).toEqual({
      kind: 'navigate',
      to: ROUTES.login,
    });
  });

  it('canceled a partir do consentimento volta ao consentimento', () => {
    expect(outcome({ error: 'canceled', return_to: CONSENT })).toEqual({
      kind: 'navigate',
      to: CONSENT,
    });
  });

  it.each([
    'expired',
    'email_not_verified',
    'account_conflict',
    'unavailable',
  ] as const)('%s vira tela de erro com o destino saneado', error => {
    expect(outcome({ error, return_to: '/app/properties' })).toEqual({
      kind: 'error',
      error,
      returnTo: '/app/properties',
    });
  });

  it('erro descarta o destino inseguro', () => {
    expect(outcome({ error: 'expired', return_to: '//outro.site' })).toEqual({
      kind: 'error',
      error: 'expired',
      returnTo: null,
    });
  });

  it.each<Record<string, string>>([
    {},
    { status: 'desconhecido' },
    { error: 'desconhecido' },
  ])('resposta fora do contrato %j vira indisponível', query => {
    expect(outcome(query)).toEqual({
      kind: 'error',
      error: 'unavailable',
      returnTo: null,
    });
  });

  it('erro prevalece sobre status', () => {
    expect(outcome({ status: 'signed_in', error: 'expired' })).toMatchObject({
      kind: 'error',
      error: 'expired',
    });
  });
});

describe('passwordSignInPath', () => {
  it('leva ao login com o destino', () => {
    expect(passwordSignInPath('/app')).toBe('/login?from=%2Fapp');
  });

  it('leva ao consentimento, que tem login próprio', () => {
    expect(passwordSignInPath(CONSENT)).toBe(CONSENT);
  });
});
