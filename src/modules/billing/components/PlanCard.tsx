import type { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Currency } from '@/lib/currency';
import { useTranslation } from '@/i18n/useTranslation';
import { INTL_LOCALES } from '@/i18n/locale-maps';
import type { Plan } from '../types/BillingTypes';
import { PlanFeatureList } from './PlanFeatureList';

type Props = {
  plan: Plan;
  isCurrentPlan: boolean;
  isProcessing: boolean;
  canManageSubscription: boolean;
  onSelectPlan: () => void;
  onManageSubscription: () => void;
};

export const PlanCard: FC<Props> = ({
  plan,
  isCurrentPlan,
  isProcessing,
  canManageSubscription,
  onSelectPlan,
  onManageSubscription,
}) => {
  const { t, language } = useTranslation('billing');
  const isFree = plan.code === 'free';

  return (
    <Card className={cn('flex-1', !isFree && 'border-primary shadow-md')}>
      <CardHeader className='gap-3'>
        <div className='flex items-center justify-between gap-2'>
          <h3 className='text-lg font-semibold'>{plan.name}</h3>
          {isCurrentPlan && (
            <Badge variant='secondary'>{t('pricing.currentPlanBadge')}</Badge>
          )}
        </div>

        <div className='flex items-baseline gap-1'>
          <span className='text-3xl font-bold'>
            {isFree
              ? t('pricing.free')
              : Currency.format(plan.price_amount, {
                  locale: INTL_LOCALES[language],
                })}
          </span>
          {!isFree && (
            <span className='text-muted-foreground text-sm'>
              {t('pricing.perMonth')}
            </span>
          )}
        </div>

        {plan.trial_days > 0 ? (
          <Badge variant='outline' className='w-fit'>
            {t('pricing.trialBadge', { count: plan.trial_days })}
          </Badge>
        ) : null}
      </CardHeader>

      <CardContent className='flex-1'>
        <PlanFeatureList capabilities={plan.capabilities} />
      </CardContent>

      {(!isFree || isCurrentPlan || canManageSubscription) && (
        <CardFooter>
          {isCurrentPlan ? (
            <Button variant='outline' className='w-full' disabled>
              {t('pricing.currentButton')}
            </Button>
          ) : isFree ? (
            <Button
              variant='outline'
              className='w-full'
              isLoading={isProcessing}
              onClick={onManageSubscription}
            >
              {t('pricing.manageButton')}
            </Button>
          ) : (
            <Button
              className='w-full'
              isLoading={isProcessing}
              onClick={onSelectPlan}
            >
              {t('pricing.selectButton', { plan: plan.name })}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
