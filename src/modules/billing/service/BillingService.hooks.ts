import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BillingService } from './BillingService';
import type { CheckoutReturnTo, PlanCode } from '../types/BillingTypes';

export const billingQueryKeys = {
  plans: ['billing', 'plans'] as const,
  subscription: ['billing', 'subscription'] as const,
  subscriptionHistory: (page: number) =>
    ['billing', 'subscription', 'history', page] as const,
};

export const usePlans = () => {
  const {
    data: plans = [],
    isPending: isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: billingQueryKeys.plans,
    queryFn: () => BillingService.listPlans(),
    staleTime: 5 * 60 * 1000,
  });
  return { plans, isLoading, isFetching, error, refetch };
};

export const useSubscription = () => {
  const {
    data: subscription,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: billingQueryKeys.subscription,
    queryFn: () => BillingService.getSubscription(),
    staleTime: 5 * 60 * 1000,
  });
  return { subscription, isLoading, error };
};

export const useSubscriptionHistory = (page: number) => {
  const {
    data,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: billingQueryKeys.subscriptionHistory(page),
    queryFn: () => BillingService.getSubscriptionHistory(page),
    staleTime: 5 * 60 * 1000,
  });
  return {
    history: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    error,
  };
};

/**
 * Whether the account currently has no Pro entitlement — it never subscribed
 * (`status: "none"`, so the history is empty), it sits on the free plan, or
 * its Pro access has lapsed. Drives the "activate Pro" upsell, so it stays
 * `false` while the queries are in flight or failed: better to omit the CTA
 * than to flash it at someone who already pays. Both queries are shared with
 * the billing page cache, so this costs no extra request there.
 */
export const useIsOnFreePlan = () => {
  const {
    subscription,
    isLoading: isLoadingSubscription,
    error: subscriptionError,
  } = useSubscription();
  // The subscription endpoint never returns a plan code — page 1's most
  // recent history entry is the only source of plan identity.
  const {
    history,
    isLoading: isLoadingHistory,
    error: historyError,
  } = useSubscriptionHistory(1);

  const isLoading = isLoadingSubscription || isLoadingHistory;
  const error = subscriptionError ?? historyError;
  const hasProAccess =
    history[0]?.plan_code === 'pro' && subscription?.has_platform_access;

  return { isOnFreePlan: !isLoading && !error && !hasProAccess, isLoading };
};

/**
 * Invalidates both `/billing/subscription` and every cached
 * `/billing/subscription/history` page — `['billing', 'subscription']` is a
 * prefix of the history query key, so a single call covers both.
 */
export const useRefreshSubscription = () => {
  const queryClient = useQueryClient();
  return useCallback(
    () =>
      queryClient.invalidateQueries({
        queryKey: billingQueryKeys.subscription,
      }),
    [queryClient]
  );
};

export const useCreateCheckoutSession = () => {
  const {
    mutate: createCheckoutSession,
    isPending: isCreatingCheckoutSession,
    error: checkoutSessionError,
  } = useMutation({
    mutationFn: ({
      planCode,
      returnTo,
    }: {
      planCode: PlanCode;
      returnTo: CheckoutReturnTo;
    }) => BillingService.createCheckoutSession(planCode, returnTo),
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
  });
  return {
    createCheckoutSession,
    isCreatingCheckoutSession,
    checkoutSessionError,
  };
};

export const useCreatePortalSession = () => {
  const {
    mutate: createPortalSession,
    isPending: isCreatingPortalSession,
    error: portalSessionError,
  } = useMutation({
    mutationFn: () => BillingService.createPortalSession(),
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
  });
  return { createPortalSession, isCreatingPortalSession, portalSessionError };
};
