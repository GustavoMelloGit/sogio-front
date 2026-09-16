import { NextResponse, type NextRequest } from 'next/server';
import { env } from '@/lib/env';
import { GUEST_ONLY_PATHS, RETURN_PARAM, ROUTES } from '@/routes/routes';

/**
 * Decide no servidor quem vê o quê, lendo o cookie da sessão.
 *
 * Só a presença do cookie é consultada: quem valida a sessão é a API, que tem
 * o banco. Um cookie inválido passa por aqui e morre no primeiro `/auth/me`,
 * que devolve 401 — o custo de errar é uma ida a mais, e o ganho é não
 * precisar do segredo de sessão aqui dentro.
 *
 * É o que apaga o pisca-pisca que existia antes: a landing e o painel já
 * chegam ao navegador na tela certa, em vez de montar uma e trocar depois de
 * hidratar.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.has(env.NEXT_PUBLIC_SESSION_COOKIE_NAME);

  if (hasSession && GUEST_ONLY_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL(ROUTES.home, request.url));
  }

  if (!hasSession && pathname.startsWith(ROUTES.home)) {
    const login = new URL(ROUTES.login, request.url);
    login.searchParams.set(RETURN_PARAM, `${pathname}${search}`);

    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

/**
 * Literal por exigência do Next, que lê este campo em tempo de build e não
 * consegue avaliar `ROUTES`. Precisa acompanhar `GUEST_ONLY_PATHS` e o
 * prefixo do produto — o teste em `src/routes/routes.test.ts` falha se
 * divergirem.
 */
export const config = {
  matcher: ['/', '/en', '/login', '/signup', '/app/:path*'],
};
