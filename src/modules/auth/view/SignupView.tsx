'use client';

import type React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { RETURN_PARAM, ROUTES, returnPath } from '@/routes/routes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/i18n/useTranslation';
import { SignupForm } from '../components/SignupForm';

/**
 * Página de cadastro de usuário
 * Permite que novos usuários se registrem na aplicação
 */
const SignupView: React.FC = () => {
  const { t } = useTranslation('auth');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSuccess = (): void => {
    router.replace(returnPath(searchParams.get(RETURN_PARAM)));
  };

  return (
    <main className='flex min-h-dvh items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>{t('signup.title')}</CardTitle>
          <CardDescription>{t('signup.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <SignupForm
            onSuccess={handleSuccess}
            onError={error => {
              console.error(t('signup.consoleErrorPrefix'), error);
            }}
          />

          <div className='text-center'>
            <span className='text-sm text-muted-foreground'>
              {t('signup.alreadyHaveAccountText')}{' '}
              <Link
                href={ROUTES.login}
                className='font-medium text-blue-600 hover:text-blue-500'
              >
                {t('signup.loginLink')}
              </Link>
            </span>
          </div>

          <div className='text-xs text-muted-foreground'>
            {t('signup.termsText')}{' '}
            <Link href='/terms' className='text-blue-600 hover:text-blue-500'>
              {t('signup.termsLink')}
            </Link>{' '}
            {t('signup.andConnector')}{' '}
            <Link href='/privacy' className='text-blue-600 hover:text-blue-500'>
              {t('signup.privacyLink')}
            </Link>
            .
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default SignupView;
