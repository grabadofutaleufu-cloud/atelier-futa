const CACHE_NAME = 'atelier-futa-v3';
const ASSETS = [
  './', './index.html', './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
];
// Los tiles de OpenStreetMap (https://*.tile.openstreetmap.org/...) no se listan aquí
// a propósito: se van cacheando solos, tile por tile, la primera vez que el usuario
// los ve con señal (ver el fetch handler más abajo). Así cada artista solo
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

const isTile = url => url.includes('tile.openstreetmap.org');
const isAppShell = url => url.endsWith('/') || url.endsWith('index.html') || url.endsWith('.js') || url.endsWith('.json') || url.endsWith('.css');

self.addEventListener('fetch', event => {
  const url = event.request.url;

  if (isTile(url)) {
    // Los tiles del mapa casi no cambian: prioriza la caché para que sirvan offline al instante.
    event.respondWith(
      caches.match(event.request).then(cached => {
        const network = fetch(event.request).then(res => {
          if (res.ok) caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // App shell (HTML/JS/CSS): siempre intenta traer la versión más nueva primero.
  // Si no hay señal, recién ahí usa lo guardado, para que las actualizaciones
  // se vean apenas hay conexión, en vez de quedar pegado en una versión vieja.
  event.respondWith(
    fetch(event.request)
      .then(res => {
        if (res.ok) caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
