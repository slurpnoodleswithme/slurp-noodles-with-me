const CACHE_NAME = 'ramen-lab-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Instalacja Service Workera i cache'owanie zasobów
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Aktywacja i czyszczenie starych cache'y
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Strategia pobierania (Network First dla HTML, Cache First dla zasobów)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Jeśli sieć odpowie, możemy zaktualizować cache w tle (opcjonalnie)
        return response;
      })
      .catch(() => {
        // Jeśli nie ma sieci, sięgamy do cache
        return caches.match(event.request);
      })
  );
});
