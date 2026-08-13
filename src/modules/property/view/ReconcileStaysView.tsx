import type { FC } from 'react';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/Alert';
import { useTranslation } from '@/i18n/useTranslation';
import { INTL_LOCALES } from '@/i18n/locale-maps';
import { useReconcileExternalStays } from '../service/PropertyService.hooks';
import ReconcileStayForm from '../components/ReconcileStayForm';
import type { ExternalStay } from '@/modules/stay/types/Stay';
import { Page } from '@/components/layout/Page';

const ReconcileStaysView: FC = () => {
  const { t, language } = useTranslation(['property']);
  const [selectedStay, setSelectedStay] = useState<ExternalStay | null>(null);

  const {
    stays: externalStays,
    isLoading: isLoadingStays,
    error: staysError,
  } = useReconcileExternalStays();

  const handleGoBack = (): void => {
    setSelectedStay(null);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat(INTL_LOCALES[language], {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  if (selectedStay) {
    return (
      <ReconcileStayForm externalStay={selectedStay} goBack={handleGoBack} />
    );
  }

  return (
    <Page.Container>
      <Page.Topbar nav={[{ label: t('reconcileStaysView.title') }]} />
      <Page.Header
        title={t('reconcileStaysView.title')}
        description={t('reconcileStaysView.description', {
          count: externalStays?.length ?? 0,
        })}
      />
      <Page.Content>
        {staysError && (
          <Alert
            variant='destructive'
            title={t('reconcileStaysView.errorTitle')}
            message={staysError.message}
          />
        )}
        {isLoadingStays && (
          <p className='text-center'>{t('reconcileStaysView.loading')}</p>
        )}
        {(!externalStays || externalStays.length === 0) && !isLoadingStays && (
          <p className='text-muted-foreground text-center'>
            {t('reconcileStaysView.emptyState')}
          </p>
        )}
        {externalStays && externalStays.length > 0 && (
          <div className='grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4'>
            {externalStays.map(stay => (
              <Card
                key={`${stay.property.id}-${stay.start.toISOString()}`}
                className='gap-2'
              >
                <CardHeader>
                  <CardTitle className='flex justify-between items-start'>
                    <span>{stay.property.name}</span>
                    <span className='text-sm font-normal text-muted-foreground capitalize'>
                      {stay.sourcePlatform}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='[&>div]:flex [&>div]:justify-between [&>div]:items-center [&>div]:gap-1'>
                    <div>
                      <p className='text-muted-foreground'>
                        {t('reconcileStaysView.checkInLabel')}
                      </p>
                      <p className='font-medium'>{formatDate(stay.start)}</p>
                    </div>
                    <div>
                      <p className='text-muted-foreground'>
                        {t('reconcileStaysView.checkOutLabel')}
                      </p>
                      <p className='font-medium'>{formatDate(stay.end)}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => setSelectedStay(stay)}
                    className='w-full'
                  >
                    {t('reconcileStaysView.registerStay')}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </Page.Content>
    </Page.Container>
  );
};

export default ReconcileStaysView;
