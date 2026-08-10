import type { FC } from 'react';
import { Page } from '@/components/layout/Page';
import { Alert } from '@/components/Alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/routes/routes';
import { useConnectedApps } from '../service/OAuthService.hooks';
import { ConnectedAppCard } from '../components/ConnectedAppCard';

const LIST_ERROR_FALLBACK_MESSAGE = 'Erro ao carregar aplicativos conectados.';

const ConnectedAppsView: FC = () => {
  const { apps, isLoading, error } = useConnectedApps();

  return (
    <Page.Container>
      <Page.Topbar
        nav={[
          { label: 'Dashboard', to: ROUTES.home },
          { label: 'Aplicativos conectados' },
        ]}
      />
      <Page.Header
        title='Aplicativos conectados'
        description='Gerencie os aplicativos que têm acesso à sua conta StayHub.'
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
                : LIST_ERROR_FALLBACK_MESSAGE
            }
          />
        )}

        {!isLoading && !error && apps.length === 0 && (
          <p className='text-center text-muted-foreground'>
            Quando você conectar um cliente MCP à sua conta, ele aparecerá aqui.
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
