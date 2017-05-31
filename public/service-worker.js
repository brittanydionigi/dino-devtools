self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('assets-v10').then(cache => {
      return cache.addAll([
        '/',
        '/css/main.css',
        '/lib/jquery-3.2.1.js',
        '/img/logo.png',
        '/bundle.js',
      ])
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  let cacheWhitelist = ['assets-v10'];

  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});