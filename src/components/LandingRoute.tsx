'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/modules/auth/service/AuthService';
import { ROUTES } from '@/routes/routes';

/**
 * Guarda das páginas públicas de marketing.
 *
 * Usa a checagem síncrona de token em vez de `useAuthData` de propósito: a
 * landing é a rota mais visitada por gente anônima e não deve disparar nenhuma
 * request de autenticação nem exibir spinner antes do primeiro pixel. Quem já
 * tem sessão vai direto para o app.
 *
 * Roda depois da hidratação, e não no render: o HTML é estático e igual para
 * todo mundo, e o token só existe no `localStorage` do navegador.
 */
export const LandingRoute = () => {
  const router = useRouter();

  useEffect(() => {
    if (AuthService.isAuthenticated()) router.replace(ROUTES.home);
  }, [router]);

  return null;
};
