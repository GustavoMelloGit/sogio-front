import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BillingService } from './BillingService';

export const billingQueryKeys = {
  plans: ['billing', 'plans'] as const,
  subscription: ['billing', 'subscription'] as const,
};

export const usePlans = () => {
  const {
    data: plans = [],
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: billingQueryKeys.plans,
    queryFn: () => BillingService.listPlans(),
    staleTime: 5 * 60 * 1000,
  });
  return { plans, isLoading, error };
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
    mutationFn: (planId: string) =>
      BillingService.createCheckoutSession(planId),
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
