import type { Metadata, Viewport } from 'next';
import { env } from '@/lib/env';
import { OG_IMAGE, SITE_URL } from './site';

const TITLE = 'Sogio: cuide dos seus imóveis de temporada conversando';

/**
 * `<head>` padrão de qualquer rota. Landing e guias sobrescrevem título,
 * descrição, canonical e Open Graph com os seus.
 */
export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description:
    'Sem planilha e sem aprender sistema novo: mande um áudio e Sogio lança a reserva, organiza as despesas e diz quanto o imóvel deu de lucro.',
  authors: [{ name: 'Gustavo Marques de Mello' }],
  robots: { index: true, follow: true },
  // Verificação de buscador precisa estar no HTML servido, não injetada por
  // JavaScript. Sem a variável a meta não sai.
  verification: env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'Sogio',
    locale: 'pt_BR',
    title: TITLE,
    description:
      'Mande um áudio, uma foto da nota ou uma pergunta. Sogio lança, organiza e responde com números.',
    url: `${SITE_URL}/`,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Sogio',
      },
    ],
  },
  twitter: { card: 'summary_large_image' },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
    title: 'Sogio',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'mobile-web-app-title': 'Sogio',
    'msapplication-TileColor': '#fbfdfc',
    'msapplication-tap-highlight': 'no',
  },
};

export const rootViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fbfdfc',
};
