// POS Enterprise Service Worker
const CACHE = 'pos-enterprise-v3';
const ASSETS = [
  './',
  './index.html',
  './login.html',
  './config.js',
  './pwa.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = e.request.url;
  if (
    url.includes('firestore') ||
    url.includes('googleapis') ||
    url.includes('firebase') ||
    url.includes('gstatic') ||
    url.includes('cdn.') ||
    url.includes('cdnjs')
  ) {
    return;
  }

  // Network-first for HTML + config.js (always get latest for demos)
  if (
    e.request.mode === 'navigate' ||
    url.endsWith('.html') ||
    url.includes('config.js') ||
    url.includes('index.html') ||
    url.includes('login.html')
  ) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        if (e.request.method === 'GET' && res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
