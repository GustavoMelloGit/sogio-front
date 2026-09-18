'use client';

import { useEffect, useState, type FC } from 'react';
import { Google } from '@/components/icons/Google';
import { buttonVariants } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';
import { googleSignInUrl } from '../service/googleSignIn';

const LABEL_KEYS = {
  signIn: 'googleSignIn.signInButton',
  continue: 'googleSignIn.continueButton',
  retry: 'googleSignIn.retryButton',
} as const;

type GoogleSignInButtonProps = {
  from?: string | null;
  label?: keyof typeof LABEL_KEYS;
  className?: string;
};

/**
 * Link, e não botão com chamada HTTP: o navegador inteiro vai para a API, que
 * conduz o fluxo com o Google e devolve a pessoa em `/login/google`.
 */
export const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({
  from,
  label = 'signIn',
  className,
}) => {
  const { t } = useTranslation('auth');
  const [isLeaving, setIsLeaving] = useState(false);

  // Voltar do Google pelo botão "voltar" pode restaurar a página do cache do
  // navegador com o link ainda travado.
  useEffect(() => {
    const reset = () => setIsLeaving(false);
    window.addEventListener('pageshow', reset);
    return () => window.removeEventListener('pageshow', reset);
  }, []);

  return (
    <a
      href={googleSignInUrl(from)}
      aria-disabled={isLeaving || undefined}
      onClick={event => {
        if (isLeaving) {
          event.preventDefault();
          return;
        }
        setIsLeaving(true);
      }}
      className={cn(
        buttonVariants({ variant: 'outline' }),
        'h-11 w-full aria-disabled:opacity-70',
        className
      )}
    >
      {isLeaving ? (
        <span aria-hidden='true'>
          <Spinner size='sm' />
        </span>
      ) : (
        <Google aria-hidden='true' className='size-[18px]' />
      )}
      {t(LABEL_KEYS[label])}
    </a>
  );
};

export const AuthMethodSeparator: FC = () => {
  const { t } = useTranslation('auth');

  return (
    <div className='flex items-center gap-3'>
      <span aria-hidden='true' className='h-px flex-1 bg-border' />
      <span className='text-xs text-muted-foreground uppercase'>
        {t('googleSignIn.separator')}
      </span>
      <span aria-hidden='true' className='h-px flex-1 bg-border' />
    </div>
  );
};
