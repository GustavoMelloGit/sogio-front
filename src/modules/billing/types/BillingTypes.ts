import { z } from 'zod';

export const planCodeSchema = z.enum(['free', 'pro']);
export type PlanCode = z.infer<typeof planCodeSchema>;

export const planSchema = z.object({
  id: z.string(),
  code: planCodeSchema,
  name: z.string(),
  price_amount: z.number(),
  billing_interval: z.literal('monthly'),
  max_properties: z.number(),
  trial_days: z.number(),
});
export type Plan = z.infer<typeof planSchema>;

export const subscriptionStatusSchema = z.enum([
  'trialing',
  'active',
  'past_due',
  'canceled',
]);
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

export const blockedReasonSchema = z.enum([
  'trial_expired',
  'period_expired',
  'payment_failed',
  'no_subscription',
]);
export type BlockedReason = z.infer<typeof blockedReasonSchema>;

export const subscriptionSchema = z.object({
  has_platform_access: z.boolean(),
  status: subscriptionStatusSchema,
  max_properties: z.number(),
  blocked_reason: blockedReasonSchema.nullable(),
});
export type Subscription = z.infer<typeof subscriptionSchema>;

export const subscriptionHistoryEventTypeSchema = z.enum([
  'started',
  'plan_changed',
  'payment_failed',
  'canceled',
  'renewed',
]);
export type SubscriptionHistoryEventType = z.infer<
  typeof subscriptionHistoryEventTypeSchema
>;

export const subscriptionHistoryEntrySchema = z.object({
  id: z.string(),
  type: subscriptionHistoryEventTypeSchema,
  resulting_status: subscriptionStatusSchema,
  plan_id: z.string(),
  plan_code: planCodeSchema,
  plan_name: z.string(),
  occurred_at: z.string(),
  access_until: z.string().nullable(),
  reason: z.string().nullable(),
});
export type SubscriptionHistoryEntry = z.infer<
  typeof subscriptionHistoryEntrySchema
>;

export const checkoutSessionSchema = z.object({ url: z.string() });
export type CheckoutSession = z.infer<typeof checkoutSessionSchema>;

export const portalSessionSchema = z.object({ url: z.string() });
export type PortalSession = z.infer<typeof portalSessionSchema>;
