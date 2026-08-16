export const ROUTES = {
  stayInstructions: (stay_id: string) => `/stay/${stay_id}`,
  stayDetail: (property_id: string, stay_id: string) =>
    `/property/${property_id}/stay/${stay_id}`,
  login: '/login',
  signup: '/signup',
  home: '/',
  properties: '/properties',
  property: (property_id: string) => `/property/${property_id}`,
  reconcileStays: '/reconcile-stays',
  createProperty: '/property/new',
  connectAuthorize: '/connect/authorize',
  connectedApps: '/settings/connected-apps',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  changePassword: '/settings/change-password',
  billingSettings: '/settings/billing',
} as const;
