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

/** Status of a resolved subscription event — always tied to a real plan. */
export const subscriptionStatusSchema = z.enum([
  'trialing',
  'active',
  'past_due',
  'canceled',
]);
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

/**
 * Account-level entitlement status — a superset of `SubscriptionStatus` that
 * also covers accounts that never subscribed at all (`"none"`, paired with
 * `blocked_reason: "no_subscription"`). Only ever returned by
 * `/billing/subscription`, never by the history endpoint.
 */
export const accountStatusSchema = z.enum([
  'none',
  'trialing',
  'active',
  'past_due',
  'canceled',
]);
export type AccountStatus = z.infer<typeof accountStatusSchema>;

export const blockedReasonSchema = z.enum([
  'trial_expired',
  'period_expired',
  'payment_failed',
  'no_subscription',
]);
export type BlockedReason = z.infer<typeof blockedReasonSchema>;

export const subscriptionSchema = z.object({
  has_platform_access: z.boolean(),
  status: accountStatusSchema,
  max_properties: z.number(),
  // Only present in the payload when has_platform_access is false — omitted
  // entirely (not null) otherwise, so this must accept a missing key too.
  blocked_reason: blockedReasonSchema
    .nullish()
    .transform(value => value ?? null),
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
