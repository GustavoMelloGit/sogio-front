import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Currency } from '@/lib/currency';
import { useTranslation } from '@/i18n/useTranslation';
import { INTL_LOCALES } from '@/i18n/locale-maps';
import type { Plan } from '../../types/BillingTypes';
import { PlanFeatureList } from '../PlanFeatureList';

type Props = {
  plan: Plan;
  isChoosing: boolean;
  isDisabled: boolean;
  onChoose: () => void;
  className?: string;
};

export const FreePlanOption: FC<Props> = ({
  plan,
  isChoosing,
  isDisabled,
  onChoose,
  className,
}) => {
  const { t, language } = useTranslation('billing');
  const headingId = `plan-choice-${plan.code}`;
  const price = Currency.format(plan.price_amount, {
    locale: INTL_LOCALES[language],
  });

  return (
    <section aria-labelledby={headingId} className={className}>
      <Card className='bg-muted/40 shadow-none'>
        <CardHeader className='gap-3'>
          <h2 id={headingId} className='text-lg font-semibold'>
            {plan.name}
          </h2>
          <p className='text-muted-foreground text-sm'>
            {t('planChoice.free.description')}
          </p>
          <p className='text-2xl font-bold'>
            {t('planChoice.monthlyPrice', { price })}
          </p>
        </CardHeader>

        <CardContent className='flex-1'>
          <PlanFeatureList capabilities={plan.capabilities} />
        </CardContent>

        <CardFooter className='flex-col items-stretch gap-3'>
          <Button
            variant='outline'
            size='lg'
            className='h-11 w-full'
            isLoading={isChoosing}
            disabled={isDisabled}
            onClick={onChoose}
          >
            {t('planChoice.free.cta')}
          </Button>
          <p className='text-muted-foreground text-center text-xs md:text-sm'>
            {t('planChoice.free.note')}
          </p>
        </CardFooter>
      </Card>
    </section>
  );
};
