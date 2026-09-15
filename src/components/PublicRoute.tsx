'use client';

import React from 'react';
import { redirect, useSearchParams } from 'next/navigation';
import { useAuthData } from '@/modules/auth/service/AuthService.hooks';
import { RETURN_PARAM, returnPath } from '@/routes/routes';
import { AuthLoadingSpinner } from './AuthLoadingSpinner';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para rotas públicas (login/signup)
 * Redireciona usuários já autenticados para a página inicial
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthData();
  const searchParams = useSearchParams();

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return <AuthLoadingSpinner />;
  }

  // Se estiver autenticado, redireciona para a página inicial ou para onde estava tentando ir
  if (isAuthenticated) {
    redirect(returnPath(searchParams.get(RETURN_PARAM)));
  }

  // Se não autenticado, renderiza o conteúdo público
  return <>{children}</>;
};
