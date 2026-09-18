'use client';

import { useState, type FC } from 'react';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useTranslation } from '@/i18n/useTranslation';
import { useRequestPasswordReset } from '../service/AuthService.hooks';

type SetPasswordCardProps = {
  email: string;
};

/**
 * Conta criada pelo Google não tem senha, e a API recusa a troca sem a atual.
 * A primeira senha nasce pela recuperação de senha, com o email da conta — a
 * tela pública de recuperação não serve aqui, porque manda embora quem já
 * está logado.
 */
export const SetPasswordCard: FC<SetPasswordCardProps> = ({ email }) => {
  const { t } = useTranslation('auth');
  const {
    requestPasswordReset,
    isRequestPasswordResetLoading,
    requestPasswordResetError,
  } = useRequestPasswordReset();
  const [wasSent, setWasSent] = useState(false);

  return (
    <Card className='max-w-lg'>
      <CardHeader>
        <h2 className='leading-none font-semibold'>
          {t('changePassword.setPasswordCardTitle')}
        </h2>
      </CardHeader>
      <CardContent className='space-y-4'>
        <p className='text-sm'>
          {t('changePassword.setPasswordDescription', { email })}
        </p>
        <p className='text-sm text-muted-foreground'>
          {t('changePassword.setPasswordSessionsHint')}
        </p>

        <div role='status'>
          {wasSent && (
            <p className='text-sm font-medium'>
              {t('changePassword.setPasswordSuccess', { email })}
            </p>
          )}
        </div>

        {requestPasswordResetError && (
          <Alert
            role='alert'
            variant='destructive'
            message={t('changePassword.setPasswordError')}
          />
        )}

        <Button
          className='h-11 w-full md:h-9 md:w-auto'
          isLoading={isRequestPasswordResetLoading}
          onClick={() =>
            requestPasswordReset(
              { email },
              { onSuccess: () => setWasSent(true) }
            )
          }
        >
          {t('changePassword.setPasswordButton')}
        </Button>
      </CardContent>
    </Card>
  );
};
