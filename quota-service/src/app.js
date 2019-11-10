const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const userController = require('./userController');

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Nothing goes here'))

app.get('/limit', userController.getLimit);
app.get('/available-quota/:key', userController.getAvailableQuota);
app.get('/bla', (req, res) => res.send('Nothing goes heree'));



app.use(function(req, res, next){
  res.status(404).send('The page you are looking for does not exist');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Oh no, the app just had an error!');
});

module.exports = app;