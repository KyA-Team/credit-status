const express = require('express');
const bodyParser = require('body-parser'); // Parse JSON in request body
const creditStatusRouter = require('./modules/credit-status/creditStatusRouter');

const app = express();

app.use((req, res, next) => bodyParser.json()(req, res, () => next()));

app.get('/', (req, res) => res.send('Nothing goes here'));

app.use('/api', creditStatusRouter);

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
