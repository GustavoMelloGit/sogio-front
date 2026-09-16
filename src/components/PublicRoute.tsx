'use client';

import { useState, type FC, type PropsWithChildren } from 'react';
import { redirect, useSearchParams } from 'next/navigation';
import { useAuthData } from '@/modules/auth/service/AuthService.hooks';
import { RETURN_PARAM, returnPath } from '@/routes/routes';
import { AuthLoadingSpinner } from './AuthLoadingSpinner';

export const PublicRoute: FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthData();

  if (isLoading) {
    return <AuthLoadingSpinner />;
  }

  return (
    <PublicContent hadSessionOnArrival={isAuthenticated}>
      {children}
    </PublicContent>
  );
};

type PublicContentProps = PropsWithChildren<{ hadSessionOnArrival: boolean }>;

const PublicContent: FC<PublicContentProps> = ({
  hadSessionOnArrival,
  children,
}) => {
  const [shouldLeave] = useState(hadSessionOnArrival);
  const searchParams = useSearchParams();

  if (shouldLeave) {
    redirect(returnPath(searchParams.get(RETURN_PARAM)));
  }

  return children;
};
