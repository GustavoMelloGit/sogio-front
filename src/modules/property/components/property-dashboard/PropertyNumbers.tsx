import { Card, CardContent } from '@/components/ui/card';
import { Currency } from '@/lib/currency';
import type { Stay } from '@/modules/stay/types/Stay';
import { type FC } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { INTL_LOCALES } from '@/i18n/locale-maps';

type Props = {
  stays: Stay[];
};

export const PropertyNumbers: FC<Props> = ({ stays }) => {
  const { t, language } = useTranslation(['property']);
  const intlLocale = INTL_LOCALES[language];
  const totalPriceInCents = stays.reduce((acc, stay) => acc + stay.price, 0);
  const medianPriceInCents = calculateMedianPrice(stays);

  return (
    <div className='flex flex-col justify-between gap-2'>
      <Card>
        <CardContent>
          <p>{t('propertyDashboard.propertyNumbers.staysCountLabel')}</p>
          <p className='text-4xl font-bold'>{stays.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <p>{t('propertyDashboard.propertyNumbers.totalAmountLabel')}</p>
          <p className='text-4xl font-bold'>
            {Currency.format(totalPriceInCents, { locale: intlLocale })}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <p>{t('propertyDashboard.propertyNumbers.medianAmountLabel')}</p>
          <p className='text-4xl font-bold'>
            {Currency.format(medianPriceInCents, { locale: intlLocale })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

function calculateMedianPrice(stays: Stay[]): number {
  const priceArray = stays.map(stay => stay.price);
  priceArray.sort((a, b) => a - b);
  const middleIndex = Math.floor(priceArray.length / 2);
  return priceArray[middleIndex];
}
