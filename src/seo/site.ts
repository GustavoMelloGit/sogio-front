import { env } from '@/lib/env';

/** URL pública do site, sem barra final. Base de canonical, hreflang e sitemap. */
export const SITE_URL = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');

/** Arte dedicada em 1200x630 para cards sociais. */
export const OG_IMAGE = `${SITE_URL}/og-cover.png`;
