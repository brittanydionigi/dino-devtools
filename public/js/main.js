import moment from 'moment';
import { 
  loadOfflineArticles,
  checkOfflineAvailability,
  saveOfflineArticle,
  removeOfflineArticle } from './indexedDB';
import { sendMessage } from './sendMessage';

const fetchLatestHeadlines = () => {
  fetch('/api/v1/articles')
  .then(response => response.json())
  .then(articles => appendArticles(articles))
  .catch(error => loadOfflineArticles());
};

const handleOnlineState = () => {
  updateConnectionStatus('online');
  fetchLatestHeadlines();
};

const handleOfflineState = () => {
  updateConnectionStatus('offline');
  loadOfflineArticles();
};

window.addEventListener('online', event => {
  console.log('online!');
  handleOnlineState();
});

window.addEventListener('offline', event => {
  console.log('offline!');
  handleOfflineState();
});

const updateConnectionStatus = (status) => {
  const $connectionStatus = $('#connection-status');
 
  if (status === 'offline') {
    $connectionStatus.addClass('offline').text(status);
  } else {
    $connectionStatus.removeClass('offline').text(status);
  }
}

export const appendArticles = (articles) => {
  $('#latest-headlines').html('');
  let articlesFrag = document.createDocumentFragment();

  articles.forEach(article => {
    let articleElem = document.createElement('li');

    let headline = document.createElement('p');
    headline.innerText = article.headline;
    headline.dataset.articleId = article.id;

    checkOfflineAvailability(article.id)
    .then(article => {
      if (article) { headline.classList.add('starred'); }
    });

    let byline = document.createElement('span');
    byline.innerText = article.byline;

    let datestamp = document.createElement('span');
    datestamp.classList.add('datestamp');
    datestamp.innerText = moment(article.datestamp).format('MMMM Do YYYY, h:mm:ss a');

    articleElem.appendChild(headline);
    articleElem.appendChild(byline);
    articleElem.appendChild(datestamp);
    articlesFrag.appendChild(articleElem);
  });

  $('#latest-headlines').append(articlesFrag);
};

$('#latest-headlines').on('click', 'span.datestamp', function(event) {
  console.log("HEY");
  let what = 'Thu Jusehsn 15 201tehsregse7 12:49:22 GsethrgserfsMT-0600 (MDT)'
  let elem = event.currentTarget;
  elem.innerText = moment(what).format('ddderd');
});

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

if ('serviceWorker' in navigator && 'SyncManager' in window && 'Notification' in window) {
  window.addEventListener('load', () => {
    fetchLatestHeadlines();
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => navigator.serviceWorker.ready)
      .then(registration => {
        Notification.requestPermission();
        $('#submit-article').on('click', function(event) {
          let headline = $('#headline-input').val();
          let byline = $('#byline-input').val();

          sendMessage({ 
            type: 'add-article',
            article: { headline, byline, id: Math.random() }
          });
        });

      }).catch(err => {
        // registration failed :(
        console.log(`ServiceWorker registration failed: ${err}`);
      });
  });
}

navigator.serviceWorker.addEventListener('message', function(event) {
  if (event.data.articles) {
    appendArticles(event.data.articles);
  }
});