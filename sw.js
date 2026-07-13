const CACHE_NAME = 'atelier-futa-v2';
const ASSETS = [
  './', './index.html', './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
];
// Los tiles de OpenStreetMap (https://*.tile.openstreetmap.org/...) no se listan aquí
// a propósito: se van cacheando solos, tile por tile, la primera vez que el usuario
// los ve con señal (ver el fetch handler cache-first más abajo). Así cada artista solo
// "descarga" el pedazo de mapa por el que realmente pasó, sin bajar toda la región.

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first: sirve desde caché si existe, y de paso actualiza en segundo plano.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request)
        .then(res => {
          if (res.ok) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, res.clone()));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
