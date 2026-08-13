import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ExternalStay } from '@/modules/stay/types/Stay';
import { queryClient } from '@/lib/query-client';
import { useBookStay } from '../service/PropertyService.hooks';
import { Page } from '@/components/layout/Page';
import { ROUTES } from '@/routes/routes';
import { CHECK_IN_HOUR, CHECK_OUT_HOUR } from '../types/Property';
import { Currency } from '@/lib/currency';
import { DateUtils } from '@/lib/date';
import { useTranslation } from '@/i18n/useTranslation';
import { BookStayForm, type BookStayFormData } from './BookStayForm';

type Props = {
  externalStay: ExternalStay;
  goBack: () => void;
};

const ReconcileStayForm: FC<Props> = ({ externalStay, goBack }) => {
  const { t } = useTranslation(['property']);
  const {
    mutate,
    isLoading: isSubmitting,
    error,
  } = useBookStay({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reconcileExternalStays'] });
      queryClient.invalidateQueries({ queryKey: ['propertyStays'] });
      goBack();
    },
  });

  const defaultValues: BookStayFormData = {
    check_in: (() => {
      const d = new Date(externalStay.start);
      d.setHours(CHECK_IN_HOUR, 0, 0, 0);
      return DateUtils.isoToInputDateTimeLocal(d);
    })(),
    check_out: (() => {
      const d = new Date(externalStay.end);
      d.setHours(CHECK_OUT_HOUR, 0, 0, 0);
      return DateUtils.isoToInputDateTimeLocal(d);
    })(),
    entrance_code: '',
    tenant_name: '',
    tenant_phone: '',
    tenant_sex: undefined as unknown as 'MALE' | 'FEMALE' | 'OTHER',
    guests: 1,
    price: 0,
  };

  const handleSubmit = (data: BookStayFormData): void => {
    mutate({
      check_in: new Date(data.check_in).toISOString(),
      check_out: new Date(data.check_out).toISOString(),
      entrance_code: data.entrance_code,
      tenant: {
        name: data.tenant_name,
        phone: data.tenant_phone.replace(/\D/g, ''),
        sex: data.tenant_sex,
      },
      guests: Number(data.guests),
      property: externalStay.property.id,
      price: Currency.toCents(Number(data.price)),
      source: externalStay.sourcePlatform,
    });
  };

  return (
    <Page.Container>
      <Page.Topbar
        nav={[
          {
            label: t('reconcileStaysView.title'),
            to: ROUTES.reconcileStays,
            onClick: () => goBack(),
          },
          { label: t('reconcileStayForm.breadcrumb') },
        ]}
      />
      <Page.Header
        title={t('reconcileStayForm.title')}
        description={t('reconcileStayForm.description', {
          property: externalStay.property.name,
        })}
      />
      <Page.Content>
        <Card className='w-full max-w-2xl'>
          <CardHeader>
            <CardTitle>{t('reconcileStayForm.title')}</CardTitle>
            <div className='text-sm text-muted-foreground space-y-1'>
              <p>
                <strong>{t('reconcileStayForm.propertyLabel')}</strong>{' '}
                {externalStay.property.name}
              </p>
              <p>
                <strong>{t('reconcileStayForm.platformLabel')}</strong>{' '}
                {externalStay.sourcePlatform}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <BookStayForm
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              errorMessage={error?.message}
              submitButtonText={t('reconcileStayForm.submitButton')}
            />
          </CardContent>
        </Card>
      </Page.Content>
    </Page.Container>
  );
};

export default ReconcileStayForm;
