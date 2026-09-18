'use client';

import { useEffect, useMemo, type FC } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/routes/routes';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import {
  passwordSignInPath,
  resolveGoogleSignInOutcome,
  type GoogleSignInError,
} from '../service/googleSignIn';

const LINKED_TOAST_ID = 'google-account-linked';

const actionClassName = 'h-11 w-full';

type ErrorActionsProps = {
  error: GoogleSignInError;
  returnTo: string | null;
};

const ErrorActions: FC<ErrorActionsProps> = ({ error, returnTo }) => {
  const { t } = useTranslation('auth');
  const retryFirst = error === 'expired' || error === 'unavailable';

  const passwordSignIn = (
    <Link
      href={passwordSignInPath(returnTo)}
      className={cn(
        buttonVariants({ variant: retryFirst ? 'ghost' : 'default' }),
        actionClassName
      )}
    >
      {t('googleSignIn.passwordSignInLink')}
    </Link>
  );

  if (retryFirst) {
    return (
      <>
        <GoogleSignInButton from={returnTo} label='retry' />
        {passwordSignIn}
      </>
    );
  }

  return (
    <>
      {passwordSignIn}
      {error === 'account_conflict' ? (
        <Link
          href={ROUTES.forgotPassword}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            actionClassName
          )}
        >
          {t('googleSignIn.forgotPasswordLink')}
        </Link>
      ) : (
        <GoogleSignInButton from={returnTo} label='retry' />
      )}
    </>
  );
};

/**
 * Recebe o navegador que a API devolveu depois do Google. Fica fora do
 * `PublicRoute` e do `proxy.ts`: a pessoa chega com o cookie de sessão recém
 * gravado, e qualquer um dos dois a tiraria daqui antes de a query ser lida.
 */
const GoogleSignInResultView: FC = () => {
  const { t } = useTranslation('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const outcome = useMemo(
    () =>
      resolveGoogleSignInOutcome(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  useEffect(() => {
    if (outcome.kind !== 'navigate') return;

    queryClient.removeQueries({ queryKey: ['auth'] });
    if (outcome.notice === 'linked') {
      toast.success(t('googleSignIn.linkedToast'), { id: LINKED_TOAST_ID });
    }
    router.replace(outcome.to);
  }, [outcome, queryClient, router, t]);

  if (outcome.kind === 'navigate') {
    return (
      <main className='flex min-h-dvh items-center justify-center bg-background px-4'>
        <div className='flex items-center gap-3' aria-live='polite'>
          <span aria-hidden='true'>
            <Spinner />
          </span>
          <span className='text-sm text-muted-foreground'>
            {t('googleSignIn.processing')}
          </span>
        </div>
      </main>
    );
  }

  return (
    <main className='flex min-h-dvh items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <h1 className='text-lg leading-none font-semibold'>
            {t('googleSignIn.errorTitle')}
          </h1>
        </CardHeader>
        <CardContent className='space-y-6'>
          <p role='alert' className='text-sm'>
            {t(`googleSignIn.errors.${outcome.error}`)}
          </p>
          <div className='flex flex-col gap-3'>
            <ErrorActions error={outcome.error} returnTo={outcome.returnTo} />
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default GoogleSignInResultView;
