'use client';

import '@/i18n/appNamespaces';
import {
  useEffect,
  useRef,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { AuthLoadingSpinner } from '@/components/AuthLoadingSpinner';
import { ROUTES } from '@/routes/routes';
import { useTranslation } from '@/i18n/useTranslation';
import { useSubscription } from '../../service/BillingService.hooks';
import PlanChoiceView from '../../view/PlanChoiceView';
import { CheckoutConfirmation } from './CheckoutConfirmation';

const CHECKOUT_CONFIRMATION_TIMEOUT_MS = 30_000;

export const PlanChoiceGate: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation('billing');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const checkoutResult =
    pathname === ROUTES.home ? searchParams.get('checkout') : null;
  const isBackFromPaidCheckout = checkoutResult === 'success';

  const [isConfirmationDelayed, setIsConfirmationDelayed] = useState(false);
  const { subscription, isLoading, error, refetch } = useSubscription({
    pollUntilPlanChosen: isBackFromPaidCheckout && !isConfirmationDelayed,
  });

  const needsPlanChoice = !error && subscription?.needs_plan_choice === true;
  const isAwaitingConfirmation = needsPlanChoice && isBackFromPaidCheckout;

  useEffect(() => {
    if (!isAwaitingConfirmation || isConfirmationDelayed) return;
    const timeout = setTimeout(
      () => setIsConfirmationDelayed(true),
      CHECKOUT_CONFIRMATION_TIMEOUT_MS
    );
    return () => clearTimeout(timeout);
  }, [isAwaitingConfirmation, isConfirmationDelayed]);

  const handledCheckoutResultRef = useRef<string | null>(null);

  useEffect(() => {
    if (!checkoutResult || !subscription || isAwaitingConfirmation) return;
    if (handledCheckoutResultRef.current === checkoutResult) return;
    handledCheckoutResultRef.current = checkoutResult;

    if (checkoutResult === 'success') {
      toast.success(t('planChoice.checkout.successToast'));
    } else {
      toast.info(t('planChoice.checkout.canceledToast'));
    }

    router.replace(ROUTES.home);
  }, [checkoutResult, subscription, isAwaitingConfirmation, router, t]);

  if (isLoading) return <AuthLoadingSpinner />;

  if (isAwaitingConfirmation) {
    return (
      <CheckoutConfirmation
        isDelayed={isConfirmationDelayed}
        onCheckAgain={() => {
          setIsConfirmationDelayed(false);
          void refetch();
        }}
        onBackToPlans={() => router.replace(ROUTES.home)}
      />
    );
  }

  if (needsPlanChoice) return <PlanChoiceView />;

  return children;
};
