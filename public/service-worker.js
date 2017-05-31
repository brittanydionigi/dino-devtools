let syncQueue = [];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('assets-v7').then(cache => {
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
  let cacheWhitelist = ['assets-v7'];

  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    }).then(() => clients.claim())
  );
});

const addArticle = () => {
  let newestArticle = syncQueue.shift();
  return fetch('/api/v1/articles', {
    method: 'POST',
    body: JSON.stringify(newestArticle),
    headers: { 'Content-Type': 'application/json' }
  });
}

self.addEventListener('message', (event) => {
  if (event.data.type === 'add-article') {
    syncQueue.push(event.data.article);
  }
  self.registration.sync.register('addArticle')
});

self.addEventListener('sync', function (event) {
  if (event.tag === 'addArticle') {
    event.waitUntil(addArticle()
      .then(response => response.json())
      .then(articles => {
        self.clients.matchAll().then(clients => {
          clients[0].postMessage({ articles: articles });
        });
        self.registration.showNotification("Added new article");
      })
      .catch(error => {
        console.log('error: ', error);
      })
    );
  }
});