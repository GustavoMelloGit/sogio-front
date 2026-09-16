import type { FC } from 'react';
import { Badge } from '@/components/ui/badge';
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
  isStartingCheckout: boolean;
  isDisabled: boolean;
  onStartCheckout: () => void;
  className?: string;
};

export const ProPlanOption: FC<Props> = ({
  plan,
  isStartingCheckout,
  isDisabled,
  onStartCheckout,
  className,
}) => {
  const { t, language } = useTranslation('billing');
  const headingId = `plan-choice-${plan.code}`;
  const hasTrial = plan.trial_days > 0;
  const price = Currency.format(plan.price_amount, {
    locale: INTL_LOCALES[language],
  });

  return (
    <section aria-labelledby={headingId} className={className}>
      <Card className='border-primary ring-primary h-full shadow-lg ring-1'>
        <CardHeader className='gap-3'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <h2 id={headingId} className='text-xl font-bold'>
              {plan.name}
            </h2>
            <Badge>{t('planChoice.recommendedBadge')}</Badge>
          </div>
          <p className='text-muted-foreground text-sm'>
            {t('planChoice.pro.description')}
          </p>
          <div>
            <p className='text-3xl font-bold md:text-4xl'>
              {hasTrial
                ? t('planChoice.pro.trialHeadline', { count: plan.trial_days })
                : t('planChoice.monthlyPrice', { price })}
            </p>
            {hasTrial && (
              <p className='text-muted-foreground mt-1 text-sm'>
                {t('planChoice.pro.priceAfterTrial', { price })}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className='flex-1'>
          <PlanFeatureList capabilities={plan.capabilities} />
        </CardContent>

        <CardFooter className='flex-col items-stretch gap-3'>
          <Button
            size='lg'
            className='h-11 w-full text-base'
            isLoading={isStartingCheckout}
            disabled={isDisabled}
            onClick={onStartCheckout}
          >
            {hasTrial
              ? t('planChoice.pro.trialCta', { count: plan.trial_days })
              : t('planChoice.pro.subscribeCta', { plan: plan.name })}
          </Button>
          <p className='text-muted-foreground text-center text-xs md:text-sm'>
            {hasTrial
              ? t('planChoice.pro.trialReassurance')
              : t('planChoice.pro.reassurance')}
          </p>
        </CardFooter>
      </Card>
    </section>
  );
};
