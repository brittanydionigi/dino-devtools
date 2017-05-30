fetch('http://localhost:3000/api/v1/news')
  .then(response => response.json())
  .then(newsArticles => {
    appendNews(newsArticles);
  })
  .catch(error => {
    console.log('error: ', error);
    displayNotification(error);
  });


const displayNotification = (message) => {
  $('#notification-box').text(message);
};

const appendNews = (articles) => {
  let articlesFrag = document.createDocumentFragment();

  articles.forEach(article => {
    let headline = document.createElement('li');
    headline.innerText = article.headline;
    articlesFrag.appendChild(headline);
  });

  $('#latest-headlines').append(articlesFrag);
};


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