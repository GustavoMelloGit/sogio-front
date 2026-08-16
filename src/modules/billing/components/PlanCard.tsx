import type { FC } from 'react';
import { Check } from 'lucide-react';
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
import { PLAN_UPCOMING_FEATURES } from '../constants/planFeatures';

type Props = {
  plan: Plan;
  isCurrentPlan: boolean;
  isProcessing: boolean;
  onSelectPlan: () => void;
  onManageSubscription: () => void;
};

export const PlanCard: FC<Props> = ({
  plan,
  isCurrentPlan,
  isProcessing,
  onSelectPlan,
  onManageSubscription,
}) => {
  const { t, language } = useTranslation('billing');
  const isFree = plan.code === 'free';
  const upcomingFeatures = PLAN_UPCOMING_FEATURES[plan.code];

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
        <ul className='space-y-2 text-sm'>
          <li className='flex items-center gap-2'>
            <Check
              className='size-4 shrink-0 text-primary'
              aria-hidden='true'
            />
            {t('pricing.propertyLimit', { count: plan.max_properties })}
          </li>
          {upcomingFeatures.map(labelKey => (
            <li
              key={labelKey}
              className='flex items-center gap-2 text-muted-foreground'
            >
              <Check className='size-4 shrink-0' aria-hidden='true' />
              <span>{t(labelKey)}</span>
              <Badge variant='outline' className='text-[10px]'>
                {t('pricing.comingSoonBadge')}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>

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
    </Card>
  );
};
