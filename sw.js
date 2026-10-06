/* ============================================================
   Cielo Sur — Service Worker
   Cachea el shell completo. Cada asset falla individualmente
   sin romper la instalación.
   ============================================================ */

const CACHE = 'cielosur-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './styles.css',
  './chart.css',
  './app.js',
  './wiki.js',
  './data.js',
  './assets/icon.svg',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      // Cachear individualmente: si uno falla, no rompe la instalación.
      await Promise.all(
        ASSETS.map(url =>
          cache.add(url).catch(err => {
            console.warn('[SW] No se pudo cachear:', url, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  // Solo manejamos requests del mismo origen.
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(event.request, copy));
        return res;
      }).catch(() => {
        // Fallback solo para navegación.
        if (event.request.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});