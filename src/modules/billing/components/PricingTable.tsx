import type { FC } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import type { Plan, PlanSlug } from '../types/BillingTypes';
import { PlanCard } from './PlanCard';

type Props = {
  plans: Plan[];
  currentPlanSlug: PlanSlug;
  isProcessing: boolean;
  onSelectPlan: (planId: string) => void;
  onManageSubscription: () => void;
};

export const PricingTable: FC<Props> = ({
  plans,
  currentPlanSlug,
  isProcessing,
  onSelectPlan,
  onManageSubscription,
}) => {
  const { t } = useTranslation('billing');

  return (
    <section aria-labelledby='pricing-title' className='space-y-4'>
      <div>
        <h2 id='pricing-title' className='text-xl font-semibold'>
          {t('pricing.title')}
        </h2>
        <p className='text-muted-foreground text-sm'>
          {t('pricing.description')}
        </p>
      </div>

      <div className='flex flex-col gap-4 md:flex-row'>
        {plans.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={plan.slug === currentPlanSlug}
            isProcessing={isProcessing}
            onSelectPlan={() => onSelectPlan(plan.id)}
            onManageSubscription={onManageSubscription}
          />
        ))}
      </div>
    </section>
  );
};
