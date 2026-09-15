import type { MetadataRoute } from 'next';
import { ROUTES } from '@/routes/routes';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sogio',
    short_name: 'Sogio',
    description: 'Sogio is a platform for managing your properties and stays.',
    theme_color: '#000000',
    background_color: '#000000',
    display: 'standalone',
    // A raiz é a landing page pública; o app instalado abre direto no produto
    // autenticado.
    start_url: ROUTES.home,
    scope: '/',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
