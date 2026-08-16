import { z } from 'zod';
import api from '@/lib/api';
import {
  planSchema,
  subscriptionSchema,
  checkoutSessionSchema,
  portalSessionSchema,
  type Plan,
  type Subscription,
  type CheckoutSession,
  type PortalSession,
} from '../types/BillingTypes';

/**
 * Serviço de billing — assinatura é por conta (owner), nunca por
 * propriedade. Checkout e gestão de assinatura acontecem via páginas
 * hospedadas do Stripe; este serviço só troca a sessão pela URL de redirect.
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

  static async createCheckoutSession(planId: string): Promise<CheckoutSession> {
    const response = await api.post('/billing/checkout-session', { planId });
    return checkoutSessionSchema.parse(response.data);
  }

  static async createPortalSession(): Promise<PortalSession> {
    const response = await api.post('/billing/portal-session');
    return portalSessionSchema.parse(response.data);
  }
}
