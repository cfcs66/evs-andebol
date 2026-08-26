// Service worker do EVS Dashboard de Jogo.
// IMPORTANTE: sempre que fizeres uma alteração relevante, muda o número da versão
// abaixo (ex: v2 -> v3). Isso obriga o telemóvel a ir buscar a versão nova,
// em vez de continuar a usar uma cópia antiga guardada em cache.
const CACHE_NAME = 'evs-andebol-v5';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// Estratégia "rede primeiro, cache como reserva":
// - Com internet: vai sempre buscar a versão mais recente ao servidor.
// - Sem internet: usa a última cópia guardada.
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(networkResp => {
      if (e.request.method === 'GET') {
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, networkResp.clone()));
      }
      return networkResp;
    }).catch(() =>
      caches.open(CACHE_NAME).then(cache => cache.match(e.request))
    )
  );
});
