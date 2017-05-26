fetch('/api/v1/news')
  .then(response => response.json())
  .then(newsArticles => {
    appendNews(newsArticles);
  })
  .catch(error => console.log('error: ', error));


const appendNews = (articles) => {
  let articlesFrag = document.createDocumentFragment();

  articles.forEach(article => {
    let headline = document.createElement('li');
    headline.innerText = article.headline;
    articlesFrag.appendChild(headline);
  });

  $('#latest-headlines').append(articlesFrag);
};