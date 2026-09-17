'use client';

import type { FC } from 'react';
import { WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';

type ConnectionErrorViewProps = {
  onRetry: () => void;
  isRetrying: boolean;
};

export const ConnectionErrorView: FC<ConnectionErrorViewProps> = ({
  onRetry,
  isRetrying,
}) => {
  const { t } = useTranslation('error');

  return (
    <div className='min-h-dvh flex items-center justify-center bg-background px-6 py-12'>
      <div className='w-full max-w-md text-center space-y-6'>
        <WifiOff
          className='mx-auto size-12 text-muted-foreground'
          aria-hidden='true'
        />

        <div className='space-y-2'>
          <h1 className='text-2xl font-semibold text-foreground'>
            {t('connectionError.title')}
          </h1>
          <p className='text-muted-foreground'>
            {t('connectionError.description')}
          </p>
        </div>

        <Button
          size='lg'
          className='w-full'
          onClick={onRetry}
          isLoading={isRetrying}
        >
          {t('connectionError.retry')}
        </Button>
      </div>
    </div>
  );
};
