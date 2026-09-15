import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // O service worker e o manifest precisam ser revalidados a cada visita:
        // um `sw.js` preso em cache impede o app instalado de ver o deploy novo.
        source: '/:file(sw.js|manifest.webmanifest)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
