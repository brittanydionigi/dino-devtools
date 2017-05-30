self.addEventListener('install', event => {
  console.log('Service worker installed!');
  event.waitUntil(
    caches.open('assets-v1').then(cache => {
      return cache.addAll([
        './index.html',
        './css/main.css',
        './main.js',
        './logo.png'
      ])
    })
  );
});