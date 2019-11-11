const express = require('express');
const bodyParser = require('body-parser'); // Parse JSON in request body
const creditStatusController = require('./creditStatusController');

const app = express();
const authentication = require('./authentication');

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Nothing goes here'));

app.get('/creditStatus/multipleQuery', (req, res) => {
  res.status(400).send('You should be using POST');
});

app.get('/creditStatus', (req, res) => {
  res.status(400).send('You need to add a CUIL for this to work');
});

app.post('/creditStatus/multipleQuery', authentication.parseKey, creditStatusController.multipleQuery);

app.get('/creditStatus/:id(\\d+)', authentication.parseKey, creditStatusController.singleQuery);

app.get('/break', () => {
  throw new Error('Forced error for testing');
});

app.use((req, res) => {
  res.status(404).send('The page you are looking for does not exist');
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error(err.stack); // eslint-disable-line no-console
  res.status(500).send('Oh no, the app just had an error!');
});

module.exports = app;
