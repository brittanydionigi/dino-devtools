self.addEventListener('install', event => {
  console.log('Service worker installed!');
  event.waitUntil(
    caches.open('assets-v2').then(cache => {
      return cache.addAll([
        './index.html',
        './css/main.css',
        './lib/jquery-3.2.1.js',
        './main.js',
        './img/logo.png'
      ])
    })
  );
});

self.addEventListener('activate', function(event) {
  var cacheWhitelist = ['assets-v2'];

  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});