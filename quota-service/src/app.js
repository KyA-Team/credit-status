const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const userRoutes = require('./modules/user/userRoutes');

app.use(bodyParser.json());
app.use(mongoSanitize());
app.use(xss());

app.use('/api', userRoutes);
app.get('/', (req, res) => res.send('Nothing goes here'));
app.get('/break', () => {
  throw new Error('Forced error for testing');
});

app.use((req, res) => {
  res.status(404).send('The page you are looking for does not exist');
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res,_next) => {
  console.error(err.stack); // eslint-disable-line no-console
  res.status(500).send('Oh no, the app just had an error!');
});

module.exports = app;
