const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (request, response) => {
  fs.readFile(`${__dirname}/index.html`, (error, file) => {
    response.send(file)
  })
})

app.get('/api/v1/headlines', (request, response) => {
  database('headlines').select()
  .then(headlines => {
    response.status(200).json(headlines)
  })
  .catch(error => {
    console.error('error:', error);
  });
})

app.get('/api/v1/headlines/:id', (request, response) => {
  database('headlines').where('id', request.params.id).select()
    .then(headlines => {
      response.status(200).json(headlines)
    })
    .catch(error => {
      console.error('error: ', error);
    })
})

app.get('/api/v1/sports', (request, response) => {
  database('sports').select()
    .then(sports => {
      response.status(200).json(sports)
    })
    .catch(error => {
      console.error('error:', error);
    });
})

app.listen(app.get('port'));


module.exports = app;
