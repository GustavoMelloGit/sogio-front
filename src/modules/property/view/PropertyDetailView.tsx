import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/useTranslation';
import { useProperty } from '../service/PropertyService.hooks';
import { Button, buttonVariants } from '@/components/ui/button';
import { Alert } from '@/components/Alert';
import { ArrowLeft, Link as LinkIcon } from 'lucide-react';
import { PropertyStaysList } from '../components/PropertyStaysList';
import ExternalBookingModal from '../components/ExternalBookingModal';
import EditPropertyModal from '../components/EditPropertyModal';
import { Page } from '@/components/layout/Page';
import { ROUTES } from '@/routes/routes';
import { useDisclosure } from '@/hooks/useDisclosure';
import { PropertyDashboard } from '../components/property-dashboard/PropertyDashboard';
import { PropertyMovementsList } from '../components/PropertyMovementsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const PropertyDetailView: FC = () => {
  const { t } = useTranslation(['property']);
  const { property_id } = useParams<{ property_id: string }>();
  const { property, isLoading, error } = useProperty(property_id || '');
  const { isOpen, open, close } = useDisclosure();
  const {
    isOpen: isEditOpen,
    open: openEdit,
    close: closeEdit,
  } = useDisclosure();

  if (isLoading) {
    return (
      <Page.Container>
        <Page.Topbar
          nav={[
            { label: t('propertyList.title'), to: ROUTES.home },
            { label: t('propertyDetail.loadingBreadcrumb') },
          ]}
        />
        <Page.Header
          title={t('propertyDetail.loadingTitle')}
          description={t('propertyDetail.loadingDescription')}
        />
        <Page.Content>
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
        </Page.Content>
      </Page.Container>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto'>
        <Alert variant='destructive' message={t('propertyDetail.errorTitle')}>
          {t('propertyDetail.errorMessage')}
        </Alert>
        <div className='mt-4'>
          <Link
            to='/'
            className={buttonVariants({
              variant: 'outline',
              className: 'w-full',
            })}
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            {t('propertyDetail.backToHome')}
          </Link>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Alert
          variant='destructive'
          message={t('propertyDetail.notFoundTitle')}
        >
          {t('propertyDetail.notFoundMessage')}
        </Alert>
        <div className='mt-4'>
          <Link
            to='/'
            className={buttonVariants({
              variant: 'outline',
              className: 'w-full',
            })}
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            {t('propertyDetail.backToHome')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Page.Container>
      <Page.Topbar
        nav={[
          { label: t('propertyList.title'), to: ROUTES.home },
          { label: property.name },
        ]}
      />
      <Page.Header
        title={property.name}
        description={t('propertyDetail.description')}
        actions={
          <div className='flex gap-2'>
            <Button variant='outline' onClick={open}>
              <LinkIcon className='w-4 h-4 mr-2' />
              {t('propertyDetail.addLink')}
            </Button>
            <Button onClick={openEdit}>{t('propertyDetail.edit')}</Button>
          </div>
        }
      />
      <Page.Content>
        <PropertyDashboard propertyId={property.id} />
        <Tabs defaultValue='stays'>
          <TabsList>
            <TabsTrigger value='stays'>
              {t('propertyDetail.tabs.stays')}
            </TabsTrigger>
            <TabsTrigger value='movements'>
              {t('propertyDetail.tabs.movements')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value='stays'>
            <PropertyStaysList propertyId={property.id} />
          </TabsContent>
          <TabsContent value='movements'>
            <PropertyMovementsList propertyId={property.id} />
          </TabsContent>
        </Tabs>
      </Page.Content>

      <ExternalBookingModal
        propertyId={property.id}
        isOpen={isOpen}
        onClose={close}
      />

      <EditPropertyModal
        property={property}
        isOpen={isEditOpen}
        onClose={closeEdit}
      />
    </Page.Container>
  );
};

export default PropertyDetailView;
