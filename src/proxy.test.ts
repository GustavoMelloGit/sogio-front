import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { env } from '@/lib/env';
import { proxy } from './proxy';

const withSessionCookie = (path: string) =>
  new NextRequest(new URL(path, 'http://localhost'), {
    headers: { cookie: `${env.NEXT_PUBLIC_SESSION_COOKIE_NAME}=qualquer` },
  });

const redirectTarget = (response: Response) => {
  const location = response.headers.get('location');
  return location ? new URL(location).pathname : null;
};

describe('proxy com cookie de sessão', () => {
  it('leva a landing para o painel', () => {
    expect(redirectTarget(proxy(withSessionCookie('/')))).toBe('/app');
  });

  it.each(['/login', '/signup'])(
    'deixa %s abrir, já que o cookie pode ser de uma sessão recusada pela API',
    path => {
      expect(redirectTarget(proxy(withSessionCookie(path)))).toBeNull();
    }
  );
});
