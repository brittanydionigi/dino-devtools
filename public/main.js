const articles = [
  { headline: 'Penguins defeat Senators in 2OT of Game 7, return to Cup Final', byline: 'Bob Loblaw' },
  { headline: 'Penguins will play Predators in Stanley Cup Final', byline: 'Bob Loblaw' },
  { headline: 'Playoff Buzz: What we learned Thursday', byline: 'Bob Loblaw' },
];

const appendNews = (articles) => {
  let articlesFrag = document.createDocumentFragment();

  articles.forEach(article => {
    let headline = document.createElement('li');
    let byline = document.createElement('span');
    byline.innerText = article.byline;
    headline.innerHTML = article.headline;
    headline.appendChild(byline);
    articlesFrag.appendChild(headline);
  });

  $('#latest-headlines').append(articlesFrag);
};

appendNews(articles);