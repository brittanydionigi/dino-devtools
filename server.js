const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('express-cors');
const fs = require('fs');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(cors({
    allowedOrigins: ['localhost:8000']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.options('/api/v1/news');

app.locals.headlines = [
  { id: 1, headline: 'Penguins defeat Senators in 2OT of Game 7, return to Cup Final', byline: 'Bob Loblaw' },
  { id: 2, headline: 'Penguins will play Predators in Stanley Cup Final', byline: 'Bob Loblaw' },
  { id: 3, headline: 'Playoff Buzz: What we learned Thursday', byline: 'Bob Loblaw' },
];

app.get('/', (request, response) => {
  response.sendFile('index.html')
});

app.get('/api/v1/news', (request, response) => {
  response.status(200).json(app.locals.headlines);
});


// app.get('/api/v1/news', (request, response) => {
//   database('fake_news').select()
//   .then(news => {
//     response.status(200).json(news)
//   })
//   .catch(error => {
//     console.error('error:', error);
//   });
// });

app.get('/api/v1/news/:id', (request, response) => {
  database('news').where('id', request.params.id).select()
    .then(news => {
      response.status(200).json(news)
    })
    .catch(error => {
      console.error('error: ', error);
    });
});

app.post('/api/v1/news', (request, response) => {
  const newsArticle = request.body;

  database('news').insert(newsArticle)
    .then(article => {
      response.status(201).json(article)
    })
    .catch(error => {
      console.log('error: ', error);
    });
});

app.listen(app.get('port'), () => { console.log(`App running on port ${app.get('port')}`) });

module.exports = app;
