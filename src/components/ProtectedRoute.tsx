'use client';

import React from 'react';
import { redirect, usePathname, useSearchParams } from 'next/navigation';
import { useAuthData } from '@/modules/auth/service/AuthService.hooks';
import { RETURN_PARAM, ROUTES } from '@/routes/routes';
import { AuthLoadingSpinner } from './AuthLoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para proteger rotas que requerem autenticação
 * Redireciona usuários não autenticados para a página de login
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthData();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return <AuthLoadingSpinner />;
  }

  // Se não estiver autenticado, redireciona para login levando o caminho atual
  if (!isAuthenticated) {
    const search = searchParams.toString();
    const from = search ? `${pathname}?${search}` : pathname;
    redirect(
      `${ROUTES.login}?${new URLSearchParams({ [RETURN_PARAM]: from })}`
    );
  }

  // Se autenticado, renderiza o conteúdo protegido
  return <>{children}</>;
};
