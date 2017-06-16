const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.locals.articles = [
  { id: 1, datestamp: new Date(), tags: ['hockey', 'recap'], headline: 'Rangers defeat Senators in 2OT of Game 7, return to Cup Final', byline: 'Bob Loblaw' },
  { id: 2, datestamp: new Date(), tags: ['hockey', 'stanleyCup'], headline: 'Predators will play Rangers in Stanley Cup Final', byline: 'NHL.com' },
  { id: 3, datestamp: new Date(), tags: ['hockey', 'playoffs'], headline: 'Playoff Buzz: What we learned Thursday', byline: 'Aunt Tilly' },
  { id: 4, datestamp: new Date(), tags: ['football', 'patriots'], headline: 'New England Patriots are the worst', byline: 'NFL.com' },
  { id: 5, datestamp: new Date(), tags: ['football', 'preview'], headline: 'Looking forward to the 2017 Football Season', byline: 'NFL.com' },
];

app.get('/', (request, response) => {
  response.sendFile('index.html')
});

app.get('/api/v1/articles', (request, response) => {
  response.status(200).json(app.locals.articles);
});

app.post('/api/v1/articles', (request, response) => {

  for (let requiredParameter of ['datestamp', 'headline']) {
  if (!request.body[requiredParameter]) {
    return response
      .status(422)
      .send({ error: `Expected format: { headline: <String>, datestamp: <Date> }. You're missing a "${requiredParameter}" property.` });
  }
}

  app.locals.articles.push(request.body);
  response.status(201).json(app.locals.articles);
});

app.listen(app.get('port'), () => { 
  console.log(`App running on port ${app.get('port')}`);
});

module.exports = app;
