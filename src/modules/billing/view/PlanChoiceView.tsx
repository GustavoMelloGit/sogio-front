'use client';

import '@/i18n/appNamespaces';
import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Check, ChevronRight } from 'lucide-react';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/routes/routes';
import { useTranslation } from '@/i18n/useTranslation';
import {
  useCreateCheckoutSession,
  usePlans,
  useRefreshSubscription,
} from '../service/BillingService.hooks';
import { PlanChoiceLayout } from '../components/plan-choice/PlanChoiceLayout';
import { ProPlanOption } from '../components/plan-choice/ProPlanOption';
import { FreePlanOption } from '../components/plan-choice/FreePlanOption';

const PlanChoiceView: FC = () => {
  const { t } = useTranslation('billing');
  const router = useRouter();
  const {
    plans,
    isLoading: isLoadingPlans,
    isFetching: isFetchingPlans,
    error: plansError,
    refetch: refetchPlans,
  } = usePlans();
  const { createCheckoutSession, isCreatingCheckoutSession } =
    useCreateCheckoutSession();
  const refreshSubscription = useRefreshSubscription();

  const proPlan = plans.find(plan => plan.code === 'pro');
  const freePlan = plans.find(plan => plan.code === 'free');

  const handleStartCheckout = (): void => {
    createCheckoutSession(
      { planCode: 'pro', returnTo: 'onboarding' },
      {
        onError: error => {
          if (isAxiosError(error) && error.response?.status === 409) {
            toast.info(t('planChoice.pro.alreadySubscribed'));
            void refreshSubscription();
            router.replace(ROUTES.home);
            return;
          }
          toast.error(
            error instanceof Error ? error.message : t('checkoutErrorFallback')
          );
        },
      }
    );
  };

  const handleChooseFree = (): void => {
    router.replace(ROUTES.home);
  };

  return (
    <PlanChoiceLayout>
      <div className='flex flex-col gap-4'>
        <ol
          aria-label={t('planChoice.steps.label')}
          className='text-muted-foreground flex flex-wrap items-center gap-2 text-sm'
        >
          <li className='flex items-center gap-1.5'>
            <Check className='text-primary size-4' aria-hidden='true' />
            <span>
              <span className='sr-only'>{t('planChoice.steps.done')} </span>
              {t('planChoice.steps.account')}
            </span>
            <ChevronRight className='size-4' aria-hidden='true' />
          </li>
          <li aria-current='step' className='text-foreground font-medium'>
            {t('planChoice.steps.plan')}
          </li>
        </ol>

        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl font-bold md:text-3xl'>
            {t('planChoice.title')}
          </h1>
          <p className='text-muted-foreground md:text-lg'>
            {t('planChoice.subtitle')}
          </p>
        </div>
      </div>

      {isLoadingPlans && (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6'>
          <Skeleton className='h-[30rem]' />
          <Skeleton className='h-[30rem]' />
        </div>
      )}

      {plansError && (
        <div className='flex flex-col items-start gap-3'>
          <Alert role='alert' message={t('planChoice.loadError')} />
          <Button
            variant='outline'
            className='h-11'
            isLoading={isFetchingPlans}
            onClick={() => void refetchPlans()}
          >
            {t('planChoice.retry')}
          </Button>
        </div>
      )}

      {!isLoadingPlans && !plansError && (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6'>
          {freePlan && (
            <FreePlanOption
              plan={freePlan}
              isDisabled={isCreatingCheckoutSession}
              onChoose={handleChooseFree}
            />
          )}
          {proPlan && (
            <ProPlanOption
              plan={proPlan}
              isStartingCheckout={isCreatingCheckoutSession}
              isDisabled={isCreatingCheckoutSession}
              onStartCheckout={handleStartCheckout}
            />
          )}
        </div>
      )}
    </PlanChoiceLayout>
  );
};

export default PlanChoiceView;
