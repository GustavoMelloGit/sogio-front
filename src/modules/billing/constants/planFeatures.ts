import type { PlanCapabilities } from '../types/BillingTypes';

export type PlanFeature = {
  labelKey: string;
  isIncluded: boolean;
  values?: Record<string, number>;
};

export const planFeaturesOf = (
  capabilities: PlanCapabilities
): PlanFeature[] => [
  {
    labelKey: 'pricing.features.aiAssistant',
    isIncluded: capabilities.ai_assistant,
  },
  {
    labelKey: 'pricing.features.properties',
    isIncluded: true,
    values: { count: capabilities.max_properties },
  },
  { labelKey: 'pricing.features.dashboard', isIncluded: true },
  {
    labelKey: 'pricing.features.exportReports',
    isIncluded: capabilities.export_reports,
  },
  {
    labelKey: 'pricing.features.bulkImport',
    isIncluded: capabilities.bulk_import,
  },
];
