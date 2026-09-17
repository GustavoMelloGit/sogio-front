'use client';

import { type FC, type ReactNode } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { useUserProperties } from '../service/PropertyService.hooks';
import { Button, buttonVariants } from '@/components/ui/button';
import { Alert } from '@/components/Alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/routes/routes';
import { Page } from '@/components/layout/Page';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { PropertyListEmptyState } from '../components/PropertyListEmptyState';
import { PropertyCardActions } from '../components/PropertyCardActions';

const PropertyListView: FC = () => {
  const { t } = useTranslation(['property', 'common']);
  const router = useRouter();
  const { properties, isLoading, error } = useUserProperties();
  const isEmpty = !isLoading && !error && properties.length === 0;

  /**
   * Only the listing swaps between states. The topbar around it holds the
   * sidebar trigger, which on mobile is the single way out of this page —
   * replacing the whole page with an error would strand the user here.
   */
  const renderProperties = (): ReactNode => {
    if (isLoading) {
      return (
        <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2'>
          <Skeleton className='aspect-square w-full' />
          <Skeleton className='aspect-square w-full' />
          <Skeleton className='aspect-square w-full' />
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant='destructive' message={t('propertyList.errorTitle')}>
          {t('propertyList.errorMessage')}
        </Alert>
      );
    }

    if (isEmpty) {
      return <PropertyListEmptyState />;
    }

    return (
      <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2'>
        {properties.map(property => {
          return (
            <Card className='group relative pt-0 gap-0' key={property.id}>
              <PropertyCardActions
                property={property}
                className='absolute right-2 top-2 z-10 pointer-fine:opacity-0 pointer-fine:group-focus-within:opacity-100 pointer-fine:group-hover:opacity-100 pointer-fine:data-[state=open]:opacity-100'
              />
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
                  href={ROUTES.property(property.id)}
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
    );
  };

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
          !isEmpty && (
            <Button onClick={() => router.push(ROUTES.createProperty)}>
              <Plus className='w-4 h-4' />
              {t('propertyList.newPropertyButton')}
            </Button>
          )
        }
      />
      <Page.Content>{renderProperties()}</Page.Content>
    </Page.Container>
  );
};

export default PropertyListView;
