import { loadOfflineArticles, saveForOfflineReading } from './indexedDB';

const fetchLatestHeadlines = () => {
  fetch('/api/v1/news')
  .then(response => response.json())
  .then(articles => appendArticles(articles))
  .catch(error => loadOfflineArticles());
};

const handleOfflineState = () => {
  updateConnectionStatus('offline');
  loadOfflineArticles();
}

const handleOnlineState = () => {
  updateConnectionStatus('online');
  fetchLatestHeadlines();
}

window.addEventListener('online', event => {
  handleOnlineState();
});

window.addEventListener('offline', event => {
  handleOfflineState();
});


const updateConnectionStatus = (status) => {
  const $connectionStatus = $('#connection-status');

  if (status === 'offline') {
    $connectionStatus.addClass('offline').text(status);
  } else {
    $connectionStatus.removeClass('offline').text(status);
  }
};

export const appendArticles = (articles) => {
  $('#latest-headlines').html('');
  let articlesFrag = document.createDocumentFragment();

  articles.forEach(article => {
    let articleElem = document.createElement('li');
    articleElem.id = `article-${article.id}`;

    let headline = document.createElement('p');
    headline.innerText = article.headline;

    let byline = document.createElement('span');
    byline.innerText = article.byline;

    articleElem.appendChild(headline);
    articleElem.appendChild(byline);
    articlesFrag.appendChild(articleElem);
  });

  $('#latest-headlines').append(articlesFrag);
};

$('#latest-headlines').on('click', 'li', function(event) {
  let article = $(this)[0];
  saveForOfflineReading({
    id: $(article).attr('id').split('-')[1],
    headline: $(article).find('p').text(),
    byline: $(article).find('span').text()
  });

  $(article).addClass('starred');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    fetchLatestHeadlines();
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        // Registration was successful
        console.log('ServiceWorker registration successful');
      }).catch(err => {
        // registration failed :(
        console.log(`ServiceWorker registration failed: ${err}`);
      });
  });
}