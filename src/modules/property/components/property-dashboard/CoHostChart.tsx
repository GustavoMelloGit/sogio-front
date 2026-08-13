import { type FC } from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Currency } from '@/lib/currency';
import type { Stay } from '@/modules/stay/types/Stay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/i18n/useTranslation';
import { INTL_LOCALES } from '@/i18n/locale-maps';

type Props = {
  stays: Stay[];
};

export const CoHostChart: FC<Props> = ({ stays }) => {
  const { t, language } = useTranslation(['property']);
  const intlLocale = INTL_LOCALES[language];
  const groupedStays = groupStaysByMonth(stays, intlLocale);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('propertyDashboard.coHostChart.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            cohost_payment: {
              label: t('propertyDashboard.coHostChart.legendLabel'),
              color: 'var(--chart-1)',
            },
          }}
        >
          <BarChart accessibilityLayer data={groupedStays}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='month' tickLine={false} axisLine={false} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) =>
                Currency.format(value, { locale: intlLocale })
              }
            />
            <Bar dataKey='cohost_payment' fill='var(--chart-1)' radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

type ChartData = {
  month: string;
  cohost_payment: number;
  stays: number;
};

function groupStaysByMonth(stays: Stay[], intlLocale: string): ChartData[] {
  const months = new Array(12).fill(0).map((_, index) => index + 1);
  return months.map(month => {
    const thisMonthStays = stays.filter(
      stay => stay.check_in.getMonth() + 1 === month
    );
    const monthName = new Date(0, month - 1).toLocaleString(intlLocale, {
      month: 'short',
    });
    return {
      month: monthName,
      cohost_payment: thisMonthStays.reduce(
        (acc, stay) => acc + calculateCohostPayment(stay),
        0
      ),
      stays: thisMonthStays.length,
    };
  });
}

function calculateCohostPayment(stay: Stay): number {
  const INTERNAL_COMMISSION = 0.1;
  const EXTERNAL_COMMISSION = 0.12;
  const CLEANING_FEE = 150_00; // R$ 150,00;
  const commission =
    stay.source === 'INTERNAL' ? INTERNAL_COMMISSION : EXTERNAL_COMMISSION;
  const priceInCents = stay.price;

  return (priceInCents - CLEANING_FEE) * commission;
}
