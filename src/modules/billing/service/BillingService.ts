import { z } from 'zod';
import api from '@/lib/api';
import { buildUrlWithParams } from '@/lib/utils';
import { paginationSchema, type PaginatedResponse } from '@/types/api';
import {
  planSchema,
  subscriptionSchema,
  subscriptionHistoryEntrySchema,
  checkoutSessionSchema,
  portalSessionSchema,
  type Plan,
  type PlanCode,
  type Subscription,
  type SubscriptionHistoryEntry,
  type CheckoutSession,
  type PortalSession,
} from '../types/BillingTypes';

const subscriptionHistoryResponseSchema = z.object({
  data: z.array(subscriptionHistoryEntrySchema),
  pagination: paginationSchema,
});

/**
 * Serviço de billing — assinatura é por conta (owner), nunca por
 * propriedade. Checkout e gestão de assinatura acontecem via páginas
 * hospedadas do Stripe; este serviço só troca a sessão pela URL de redirect.
 * `/billing/subscription` e `/billing/subscription/history` respondem mesmo
 * para contas bloqueadas — nunca gatear essas duas chamadas por entitlement.
 */
export class BillingService {
  static async listPlans(): Promise<Plan[]> {
    const response = await api.get('/billing/plans');
    return z.array(planSchema).parse(response.data);
  }

  static async getSubscription(): Promise<Subscription> {
    const response = await api.get('/billing/subscription');
    return subscriptionSchema.parse(response.data);
  }

  static async getSubscriptionHistory(
    page = 1,
    limit?: number
  ): Promise<PaginatedResponse<SubscriptionHistoryEntry>> {
    const url = buildUrlWithParams('/billing/subscription/history', {
      page,
      limit,
    });
    const response = await api.get(url);
    return subscriptionHistoryResponseSchema.parse(response.data);
  }

  static async createCheckoutSession(
    planCode: PlanCode
  ): Promise<CheckoutSession> {
    const response = await api.post('/billing/checkout-session', {
      plan_code: planCode,
    });
    return checkoutSessionSchema.parse(response.data);
  }

  static async createPortalSession(): Promise<PortalSession> {
    const response = await api.post('/billing/portal-session');
    return portalSessionSchema.parse(response.data);
  }
}
