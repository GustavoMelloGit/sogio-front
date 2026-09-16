'use client';

import type { FC } from 'react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Check, ChevronRight } from 'lucide-react';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/i18n/useTranslation';
import {
  useChooseFreePlan,
  useCreateCheckoutSession,
  usePlans,
  useRefreshSubscription,
} from '../service/BillingService.hooks';
import { PlanChoiceLayout } from '../components/plan-choice/PlanChoiceLayout';
import { ProPlanOption } from '../components/plan-choice/ProPlanOption';
import { FreePlanOption } from '../components/plan-choice/FreePlanOption';

const PlanChoiceView: FC = () => {
  const { t } = useTranslation('billing');
  const {
    plans,
    isLoading: isLoadingPlans,
    isFetching: isFetchingPlans,
    error: plansError,
    refetch: refetchPlans,
  } = usePlans();
  const { createCheckoutSession, isCreatingCheckoutSession } =
    useCreateCheckoutSession();
  const { chooseFreePlan, isChoosingFreePlan } = useChooseFreePlan();
  const refreshSubscription = useRefreshSubscription();

  const proPlan = plans.find(plan => plan.code === 'pro');
  const freePlan = plans.find(plan => plan.code === 'free');
  const isSubmitting = isCreatingCheckoutSession || isChoosingFreePlan;

  const handleStartCheckout = (): void => {
    createCheckoutSession(
      { planCode: 'pro', returnTo: 'onboarding' },
      {
        onError: error => {
          if (isAxiosError(error) && error.response?.status === 409) {
            toast.info(t('checkoutAlreadySubscribedError'));
            void refreshSubscription();
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
    chooseFreePlan(undefined, {
      onError: error => {
        toast.error(
          error instanceof Error ? error.message : t('planChoice.free.error')
        );
      },
    });
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
        <div className='grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-6'>
          <Skeleton className='h-[30rem] md:col-span-3' />
          <Skeleton className='h-96 md:col-span-2' />
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
        <div className='grid grid-cols-1 gap-4 md:grid-cols-5 md:items-start md:gap-6'>
          {proPlan && (
            <ProPlanOption
              plan={proPlan}
              className='md:col-span-3'
              isStartingCheckout={isCreatingCheckoutSession}
              isDisabled={isSubmitting}
              onStartCheckout={handleStartCheckout}
            />
          )}
          {freePlan && (
            <FreePlanOption
              plan={freePlan}
              className='md:col-span-2'
              isChoosing={isChoosingFreePlan}
              isDisabled={isSubmitting}
              onChoose={handleChooseFree}
            />
          )}
        </div>
      )}
    </PlanChoiceLayout>
  );
};

export default PlanChoiceView;
