import { useEffect, useRef, type FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { Page } from '@/components/layout/Page';
import { Alert } from '@/components/Alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/routes/routes';
import { useTranslation } from '@/i18n/useTranslation';
import {
  usePlans,
  useSubscription,
  useSubscriptionHistory,
  useRefreshSubscription,
  useCreateCheckoutSession,
  useCreatePortalSession,
} from '../service/BillingService.hooks';
import { CurrentPlanCard } from '../components/CurrentPlanCard';
import { PricingTable } from '../components/PricingTable';
import { SubscriptionHistoryList } from '../components/SubscriptionHistoryList';
import type { PlanCode } from '../types/BillingTypes';

const BillingSettingsView: FC = () => {
  const { t } = useTranslation('billing');
  const [searchParams, setSearchParams] = useSearchParams();

  const { plans, isLoading: isLoadingPlans, error: plansError } = usePlans();
  const {
    subscription,
    isLoading: isLoadingSubscription,
    error: subscriptionError,
  } = useSubscription();
  // Page 1's most recent entry doubles as "current plan identity" — the
  // subscription endpoint itself never returns a plan code or name.
  const {
    history,
    isLoading: isLoadingHistory,
    error: historyError,
  } = useSubscriptionHistory(1);
  const latestEvent = history[0];

  const refreshSubscription = useRefreshSubscription();

  const { createCheckoutSession, isCreatingCheckoutSession } =
    useCreateCheckoutSession();
  const { createPortalSession, isCreatingPortalSession } =
    useCreatePortalSession();

  const hasHandledCheckoutResultRef = useRef(false);

  useEffect(() => {
    if (hasHandledCheckoutResultRef.current) return;
    const checkoutResult = searchParams.get('checkout');
    if (!checkoutResult) return;
    hasHandledCheckoutResultRef.current = true;

    if (checkoutResult === 'success') {
      toast.success(t('checkout.successToast'));
      void refreshSubscription();
    } else {
      toast.info(t('checkout.canceledToast'));
    }

    setSearchParams(
      params => {
        params.delete('checkout');
        return params;
      },
      { replace: true }
    );
  }, [searchParams, setSearchParams, refreshSubscription, t]);

  const handleSelectPlan = (planCode: PlanCode): void => {
    createCheckoutSession(planCode, {
      onError: error => {
        if (isAxiosError(error) && error.response?.status === 409) {
          toast.error(t('checkoutAlreadySubscribedError'));
          return;
        }
        toast.error(
          error instanceof Error ? error.message : t('checkoutErrorFallback')
        );
      },
    });
  };

  const handleManageSubscription = (): void => {
    createPortalSession(undefined, {
      onError: error => {
        if (
          isAxiosError(error) &&
          (error.response?.status === 404 || error.response?.status === 409)
        ) {
          toast.error(t('portalNoSubscriptionError'));
          return;
        }
        toast.error(
          error instanceof Error ? error.message : t('portalErrorFallback')
        );
      },
    });
  };

  const isLoading = isLoadingPlans || isLoadingSubscription || isLoadingHistory;
  const error = plansError ?? subscriptionError ?? historyError;
  const isManagingSubscription = isCreatingPortalSession;

  return (
    <Page.Container>
      <Page.Topbar
        nav={[
          { label: t('page.breadcrumbHome'), to: ROUTES.home },
          { label: t('page.breadcrumbBilling') },
        ]}
      />
      <Page.Header
        title={t('page.title')}
        description={t('page.description')}
      />
      <Page.Content>
        {isLoading && (
          <div className='space-y-4'>
            <Skeleton className='h-40 w-full' />
            <Skeleton className='h-64 w-full' />
          </div>
        )}

        {error && (
          <Alert
            role='alert'
            variant='destructive'
            message={
              error instanceof Error ? error.message : t('loadErrorFallback')
            }
          />
        )}

        {!isLoading && !error && subscription && (
          <CurrentPlanCard
            subscription={subscription}
            latestEvent={latestEvent}
            isManaging={isManagingSubscription}
            onManageSubscription={handleManageSubscription}
          />
        )}

        {!isLoading && !error && plans.length > 0 && (
          <PricingTable
            plans={plans}
            currentPlanCode={latestEvent?.plan_code}
            isProcessing={isCreatingCheckoutSession || isCreatingPortalSession}
            onSelectPlan={handleSelectPlan}
            onManageSubscription={handleManageSubscription}
          />
        )}

        {!isLoading && !error && <SubscriptionHistoryList />}
      </Page.Content>
    </Page.Container>
  );
};

export default BillingSettingsView;
