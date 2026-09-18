/**
 * Prefixo do produto autenticado. A raiz `/` pertence à landing page pública,
 * que é pré-renderizada no build para ser lida por buscadores e crawlers de IA.
 */
const APP = '/app';

const PUBLIC_ROUTES = {
  // Pré-renderizado
  landing: '/',
  landingEn: '/en',
  guides: '/guias',
  guide: (slug: string) => `/guias/${slug}`,
  privacyPolicy: '/privacidade',
  termsOfUse: '/termos',

  // Fora do app de propósito: links enviados a hóspedes e fluxos de autenticação
  // que precisam continuar funcionando nas URLs já divulgadas.
  stayInstructions: (stay_id: string) => `/stay/${stay_id}`,
  login: '/login',
  signup: '/signup',
  connectAuthorize: '/connect/authorize',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
} as const;

const PRIVATE_ROUTES = {
  home: APP,
  choosePlan: `${APP}/choose-plan`,
  properties: `${APP}/properties`,
  property: (property_id: string) => `${APP}/property/${property_id}`,
  createProperty: `${APP}/property/new`,
  reconcileStays: `${APP}/reconcile-stays`,
  stayDetail: (property_id: string, stay_id: string) =>
    `${APP}/property/${property_id}/stay/${stay_id}`,
  connectedApps: `${APP}/settings/connected-apps`,
  changePassword: `${APP}/settings/change-password`,
  billingSettings: `${APP}/settings/billing`,
} as const;

export const ROUTES = { ...PUBLIC_ROUTES, ...PRIVATE_ROUTES } as const;

/**
 * Públicas que deixam de fazer sentido com sessão ativa: quem já entrou não
 * precisa da landing. As demais públicas — guias, instruções de estadia,
 * redefinição de senha, consentimento — servem aos dois casos e não
 * redirecionam.
 */
export const GUEST_ONLY_PATHS: string[] = [
  PUBLIC_ROUTES.landing,
  PUBLIC_ROUTES.landingEn,
];

/** Query param que leva ao login o caminho para onde voltar depois dele. */
export const RETURN_PARAM = 'from';

const MAX_RETURN_PATH_LENGTH = 512;

const isUnsafeCharacter = (char: string): boolean => {
  const code = char.charCodeAt(0);
  return char === '\\' || code <= 0x1f || code === 0x7f;
};

/**
 * Destino depois do login. Só aceita caminho relativo ao próprio site: um
 * `?from=//outro.site` ou `?from=https://...` viraria redirecionamento aberto.
 *
 * Caractere de controle e `\` são recusados em qualquer posição porque o
 * navegador os remove ou normaliza ao montar a URL: `/<TAB>/outro.site` vira
 * `//outro.site`. É a mesma regra que a API aplica ao `return_to`.
 */
export const returnPath = (from: string | null | undefined): string =>
  from &&
  from.length <= MAX_RETURN_PATH_LENGTH &&
  /^\/(?!\/)/.test(from) &&
  !Array.from(from).some(isUnsafeCharacter)
    ? from
    : ROUTES.home;
