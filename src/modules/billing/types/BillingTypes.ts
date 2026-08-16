import { z } from 'zod';

export const planSlugSchema = z.enum(['free', 'pro']);
export type PlanSlug = z.infer<typeof planSlugSchema>;

export const planSchema = z.object({
  id: z.string(),
  slug: planSlugSchema,
  name: z.string(),
  price: z.number(),
  interval: z.literal('month'),
  propertyLimit: z.number().nullable(),
  trialDays: z.number().nullable(),
});
export type Plan = z.infer<typeof planSchema>;

export const subscriptionStatusSchema = z.enum([
  'active',
  'trialing',
  'past_due',
  'canceled',
  'incomplete',
]);
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

export const subscriptionSchema = z.object({
  planSlug: planSlugSchema,
  status: subscriptionStatusSchema,
  currentPeriodEnd: z.string().nullable(),
  trialEndsAt: z.string().nullable(),
  cancelAtPeriodEnd: z.boolean(),
});
export type Subscription = z.infer<typeof subscriptionSchema>;

export const checkoutSessionSchema = z.object({ url: z.string() });
export type CheckoutSession = z.infer<typeof checkoutSessionSchema>;

export const portalSessionSchema = z.object({ url: z.string() });
export type PortalSession = z.infer<typeof portalSessionSchema>;
