import { useEffect, useRef, type FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Page } from '@/components/layout/Page';
import { Alert } from '@/components/Alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/routes/routes';
import { useTranslation } from '@/i18n/useTranslation';
import {
  usePlans,
  useSubscription,
  useRefreshSubscription,
  useCreateCheckoutSession,
  useCreatePortalSession,
} from '../service/BillingService.hooks';
import { CurrentPlanCard } from '../components/CurrentPlanCard';
import { PricingTable } from '../components/PricingTable';

const BillingSettingsView: FC = () => {
  const { t } = useTranslation('billing');
  const [searchParams, setSearchParams] = useSearchParams();

  const { plans, isLoading: isLoadingPlans, error: plansError } = usePlans();
  const {
    subscription,
    isLoading: isLoadingSubscription,
    error: subscriptionError,
  } = useSubscription();
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

  const handleSelectPlan = (planId: string): void => {
    createCheckoutSession(planId, {
      onError: error => {
        toast.error(
          error instanceof Error ? error.message : t('checkoutErrorFallback')
        );
      },
    });
  };

  const handleManageSubscription = (): void => {
    createPortalSession(undefined, {
      onError: error => {
        toast.error(
          error instanceof Error ? error.message : t('portalErrorFallback')
        );
      },
    });
  };

  const isLoading = isLoadingPlans || isLoadingSubscription;
  const error = plansError ?? subscriptionError;
  const currentPlan = plans.find(plan => plan.slug === subscription?.planSlug);
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
            plan={currentPlan}
            isManaging={isManagingSubscription}
            onManageSubscription={handleManageSubscription}
          />
        )}

        {!isLoading && !error && subscription && plans.length > 0 && (
          <PricingTable
            plans={plans}
            currentPlanSlug={subscription.planSlug}
            isProcessing={isCreatingCheckoutSession || isCreatingPortalSession}
            onSelectPlan={handleSelectPlan}
            onManageSubscription={handleManageSubscription}
          />
        )}
      </Page.Content>
    </Page.Container>
  );
};

export default BillingSettingsView;
