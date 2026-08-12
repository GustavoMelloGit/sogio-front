import type { FC } from 'react';
import { Page } from '@/components/layout/Page';
import { Alert } from '@/components/Alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/routes/routes';
import { useTranslation } from '@/i18n/useTranslation';
import { useConnectedApps } from '../service/OAuthService.hooks';
import { ConnectedAppCard } from '../components/ConnectedAppCard';

const ConnectedAppsView: FC = () => {
  const { t } = useTranslation('auth');
  const { apps, isLoading, error } = useConnectedApps();

  return (
    <Page.Container>
      <Page.Topbar
        nav={[
          { label: t('connectedApps.breadcrumbDashboard'), to: ROUTES.home },
          { label: t('connectedApps.breadcrumbConnectedApps') },
        ]}
      />
      <Page.Header
        title={t('connectedApps.title')}
        description={t('connectedApps.description')}
      />
      <Page.Content>
        {isLoading && (
          <div className='space-y-4'>
            <Skeleton className='h-40 w-full' />
            <Skeleton className='h-40 w-full' />
          </div>
        )}

        {error && (
          <Alert
            role='alert'
            variant='destructive'
            message={
              error instanceof Error
                ? error.message
                : t('connectedApps.listErrorFallback')
            }
          />
        )}

        {!isLoading && !error && apps.length === 0 && (
          <p className='text-center text-muted-foreground'>
            {t('connectedApps.emptyState')}
          </p>
        )}

        {!isLoading && !error && apps.length > 0 && (
          <ul className='space-y-4'>
            {apps.map(app => (
              <ConnectedAppCard key={app.consent_id} app={app} />
            ))}
          </ul>
        )}
      </Page.Content>
    </Page.Container>
  );
};

export default ConnectedAppsView;
