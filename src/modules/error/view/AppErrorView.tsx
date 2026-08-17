import type { FC } from 'react';
import { TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/routes/routes';
import { useTranslation } from '@/i18n/useTranslation';

/**
 * Shown when the app fails to render. The dashboard link is a full page load
 * on purpose: the most common cause is a stale build, and only a fresh
 * document request picks up the current one.
 */
export const AppErrorView: FC = () => {
  const { t } = useTranslation('error');

  return (
    <div className='min-h-dvh flex items-center justify-center bg-background px-6 py-12'>
      <div className='w-full max-w-md text-center space-y-6'>
        <TriangleAlert
          className='mx-auto size-12 text-destructive'
          aria-hidden='true'
        />

        <div className='space-y-2'>
          <h1 className='text-2xl font-semibold text-foreground'>
            {t('appError.title')}
          </h1>
          <p className='text-muted-foreground'>{t('appError.description')}</p>
        </div>

        <Button
          size='lg'
          className='w-full'
          onClick={() => window.location.assign(ROUTES.home)}
        >
          {t('appError.backToDashboard')}
        </Button>
      </div>
    </div>
  );
};
