import type { MetadataRoute } from 'next';
import { ROUTES } from '@/routes/routes';
import { SITE_URL } from '@/seo/site';

/** Crawlers de IA liberados explicitamente — sem isso vários assumem bloqueio. */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'CCBot',
  'Applebot-Extended',
  'Bytespider',
  'meta-externalagent',
];

/**
 * Rotas sem valor de busca. `/app` vai sem barra final de propósito: com
 * `/app/` a regra não casa com `/app`, que é justamente a URL do produto.
 */
const DISALLOWED = [
  ROUTES.home,
  ROUTES.login,
  ROUTES.signup,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
  '/connect',
  '/stay/',
];

export default function robots(): MetadataRoute.Robots {
  // Cada `User-agent` repete a lista porque um robô obedece só ao grupo mais
  // específico que casa com ele: um bloco com apenas `Allow: /` não herda os
  // `Disallow` do grupo `*`.
  return {
    rules: ['*', ...AI_CRAWLERS].map(userAgent => ({
      userAgent,
      allow: '/',
      disallow: DISALLOWED,
    })),
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
