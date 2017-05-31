import { logDbRecords, saveForOfflineReading } from './indexedDB';

const fetchLatestHeadlines = () => {
  fetch('/api/v1/news')
  .then(response => response.json())
  .then(articles => {
    appendConnectionStatus('Online!');
    appendNews(articles)
  })
  .catch(error => {
    appendConnectionStatus('Error fetching articles. Showing offline articles instead.');
    logDbRecords();
  });
};


fetchLatestHeadlines();

window.addEventListener('online', event => {
  console.log('online again!');
  fetchLatestHeadlines()
});

window.addEventListener('offline', event => {
  console.log('offline!');
  logDbRecords();
});


const appendConnectionStatus = (message) => {
  $('#notification').text(message);
};

const appendNews = (articles) => {
  $('#latest-headlines').html('');
  let articlesFrag = document.createDocumentFragment();

  articles.forEach(article => {
    console.log('article: ', article);
    let headline = document.createElement('li');
    let byline = document.createElement('span');
    byline.innerText = article.byline;
    headline.id = `article-${article.id}`;
    headline.innerHTML = article.headline;
    headline.appendChild(byline);
    articlesFrag.appendChild(headline);
  });

  $('#latest-headlines').append(articlesFrag);
};

$('#latest-headlines').on('click', 'li', (event) => {
  let article = $(event.target)[0];
  saveForOfflineReading({
    id: article.id.split('-')[1],
    headline: $(article).text(),
    byline: $(article).find('span').text()
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
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