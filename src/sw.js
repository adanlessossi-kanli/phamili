const CACHE_NAME = 'phamili-v1';
const urlsToCache = [
  '/',
  '/home',
  '/blog',
  '/media',
  '/about',
  '/styles.css',
  '/main.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});