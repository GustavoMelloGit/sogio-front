import { type FC } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { useUserProperties } from '../service/PropertyService.hooks';
import { Button, buttonVariants } from '@/components/ui/button';
import { Alert } from '@/components/Alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routes';
import { Page } from '@/components/layout/Page';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const PropertyListView: FC = () => {
  const { t } = useTranslation(['property', 'common']);
  const navigate = useNavigate();
  const { properties, isLoading, error } = useUserProperties();

  if (isLoading) {
    return (
      <Page.Container>
        <Page.Topbar
          nav={[
            { label: t('common:sidebar.nav.dashboard'), to: ROUTES.home },
            { label: t('common:sidebar.nav.properties') },
          ]}
        />
        <Page.Header
          title={t('propertyList.title')}
          description={t('propertyList.description')}
          actions={
            <Button onClick={() => navigate(ROUTES.createProperty)}>
              <Plus className='w-4 h-4' />
              {t('propertyList.newPropertyButton')}
            </Button>
          }
        />
        <Page.Content>
          <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2'>
            <Skeleton className='aspect-square w-full' />
            <Skeleton className='aspect-square w-full' />
            <Skeleton className='aspect-square w-full' />
          </div>
        </Page.Content>
      </Page.Container>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Alert variant='destructive' message={t('propertyList.errorTitle')}>
          {t('propertyList.errorMessage')}
        </Alert>
      </div>
    );
  }

  return (
    <Page.Container>
      <Page.Topbar
        nav={[
          { label: t('common:sidebar.nav.dashboard'), to: ROUTES.home },
          { label: t('common:sidebar.nav.properties') },
        ]}
      />
      <Page.Header
        title={t('propertyList.title')}
        description={t('propertyList.description')}
        actions={
          <Button onClick={() => navigate(ROUTES.createProperty)}>
            <Plus className='w-4 h-4' />
            {t('propertyList.newPropertyButton')}
          </Button>
        }
      />
      <Page.Content>
        {properties.length === 0 ? (
          <div className='text-center py-12'>
            <div className='mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
              <svg
                className='w-12 h-12 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                />
              </svg>
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              {t('propertyList.emptyState.title')}
            </h3>
            <p className='text-gray-500 mb-6'>
              {t('propertyList.emptyState.description')}
            </p>
            <Button onClick={() => navigate(ROUTES.createProperty)}>
              {t('propertyList.emptyState.cta')}
            </Button>
          </div>
        ) : (
          <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2'>
            {properties.map(property => {
              return (
                <Card className='pt-0 gap-0' key={property.id}>
                  <CardHeader className='p-0 rounded-[inherit]'>
                    <img
                      src='/apartment.webp'
                      alt={t('propertyList.propertyImageAlt')}
                      className='rounded-[inherit] rounded-b-none w-full aspect-video object-cover'
                    />
                  </CardHeader>
                  <CardContent className='pt-2 px-4 space-y-4'>
                    <CardTitle>{property.name}</CardTitle>
                    <Link
                      to={ROUTES.property(property.id)}
                      className={buttonVariants({
                        variant: 'default',
                        className: 'w-full',
                      })}
                    >
                      {t('propertyList.viewDetails')}
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </Page.Content>
    </Page.Container>
  );
};

export default PropertyListView;
