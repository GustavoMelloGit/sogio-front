'use client';

import '@/i18n/appNamespaces';
import { useEffect, useRef, useState, type FC } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslation } from '@/i18n/useTranslation';
import {
  useIsOnFreePlan,
  useRefreshSubscription,
} from '../service/BillingService.hooks';

const CHECKOUT_PARAM = 'checkout';
const PRO_ACCESS_REFRESH_INTERVAL_MS = 2000;
const PRO_ACCESS_WAIT_TIMEOUT_MS = 30_000;

export const CheckoutReturnHandler: FC = () => {
  const { t } = useTranslation('billing');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const refreshSubscription = useRefreshSubscription();
  const { isOnFreePlan } = useIsOnFreePlan();
  const [isAwaitingProAccess, setIsAwaitingProAccess] = useState(false);
  const hasHandledCheckoutRef = useRef(false);

  const checkoutResult = searchParams.get(CHECKOUT_PARAM);

  useEffect(() => {
    if (hasHandledCheckoutRef.current) return;
    if (checkoutResult !== 'success' && checkoutResult !== 'canceled') return;
    hasHandledCheckoutRef.current = true;

    if (checkoutResult === 'success') {
      toast.success(t('checkout.successToast'));
      void refreshSubscription();
      setIsAwaitingProAccess(true);
    } else {
      toast.info(t('checkout.canceledToast'));
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete(CHECKOUT_PARAM);
    const search = params.toString();
    router.replace(search ? `${pathname}?${search}` : pathname);
  }, [checkoutResult, searchParams, pathname, router, refreshSubscription, t]);

  useEffect(() => {
    if (!isAwaitingProAccess) return;
    const timeout = setTimeout(
      () => setIsAwaitingProAccess(false),
      PRO_ACCESS_WAIT_TIMEOUT_MS
    );
    return () => clearTimeout(timeout);
  }, [isAwaitingProAccess]);

  const shouldRefreshSubscription = isAwaitingProAccess && isOnFreePlan;

  useEffect(() => {
    if (!shouldRefreshSubscription) return;
    const interval = setInterval(
      () => void refreshSubscription(),
      PRO_ACCESS_REFRESH_INTERVAL_MS
    );
    return () => clearInterval(interval);
  }, [shouldRefreshSubscription, refreshSubscription]);

  return null;
};
