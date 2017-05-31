import { 
  loadOfflineArticles,
  checkOfflineAvailability,
  saveOfflineArticle,
  removeOfflineArticle } from './indexedDB';

const fetchLatestHeadlines = () => {
  fetch('/api/v1/articles')
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
    
    checkOfflineAvailability(article.id)
    .then(article => {
      if (article) { articleElem.classList.add('starred'); }
    })

    let headline = document.createElement('p');
    headline.innerText = article.headline;
    headline.dataset.articleId = article.id;

    let byline = document.createElement('span');
    byline.innerText = article.byline;

    articleElem.appendChild(headline);
    articleElem.appendChild(byline);
    articlesFrag.appendChild(articleElem);
  });

  $('#latest-headlines').append(articlesFrag);
};

$('#latest-headlines').on('click', 'p', function(event) {
  let elem = event.currentTarget;

  let id = elem.dataset.articleId;
  let headline = elem.innerText;
  let byline = elem.nextSibling.innerText;

  if (elem.classList.contains('starred')) {
    removeOfflineArticle(id);
  } else {
    saveOfflineArticle({ id, headline, byline });
  }

  elem.classList.toggle('starred');
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