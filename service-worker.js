const VERSION = 'exercise-library-v1';
const APP_CACHE = VERSION + '-app';
const MEDIA_CACHE = VERSION + '-media';
const APP_SHELL = ['./app.html', './index.html', './manifest.webmanifest', './app-icon.svg'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(APP_CACHE).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key !== APP_CACHE && key !== MEDIA_CACHE).map(key => caches.delete(key))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.includes('/images/') || url.pathname.includes('/videos/')) {
    event.respondWith(cacheFirst(event.request, MEDIA_CACHE));
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('./app.html')));
    return;
  }

  event.respondWith(cacheFirst(event.request, APP_CACHE));
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}