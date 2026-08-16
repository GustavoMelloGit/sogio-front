import type { PlanCode } from '../types/BillingTypes';

/**
 * Marketing copy for features not yet gated by the backend. Kept on the
 * frontend on purpose — it's presentation content, not a business rule.
 */
export const PLAN_UPCOMING_FEATURES: Record<PlanCode, string[]> = {
  free: [],
  pro: [
    'pricing.features.reportExport',
    'pricing.features.bulkImportExport',
    'pricing.features.aiChat',
    'pricing.features.aiChatWhatsapp',
    'pricing.features.notifications',
  ],
};
