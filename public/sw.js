/**
 * Service worker de desmontagem.
 *
 * Até a migração para Next.js o app registrava um service worker do Workbox
 * neste mesmo endereço, que guardava a casca da SPA e todos os chunks em
 * cache. Um app instalado continuaria abrindo esse build antigo, que pede
 * arquivos que não existem mais. O navegador procura atualização de `/sw.js`
 * a cada navegação; ao encontrar este arquivo, ele substitui o antigo, apaga
 * os caches e recarrega as janelas abertas uma única vez.
 *
 * Não intercepta requisições: o app atual não depende de service worker.
 * Manter este arquivo publicado enquanto houver instalação antiga por aí.
 */
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
      await self.clients.claim();

      // Só recarrega quando havia cache do build antigo, então roda uma vez.
      if (keys.length === 0) return;

      const windows = await self.clients.matchAll({ type: 'window' });
      windows.forEach(client => client.navigate(client.url));
    })()
  );
});
