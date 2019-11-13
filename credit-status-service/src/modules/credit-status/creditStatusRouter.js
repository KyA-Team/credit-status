const express = require('express');
const authentication = require('../../authentication');
const creditStatusController = require('./creditStatusController');

const router = express.Router();

router
  .route('/credit-status/multiple-query')
  .get((req, res) => res.status(400).send('You should be using POST'))
  .post(authentication.parseKey, creditStatusController.multipleQuery);

router
  .route('/credit-status')
  .get((req, res) => res.status(400).send('You need to add a CUIL for this to work'));

router
  .route('/credit-status/:id(\\d+)')
  .get(authentication.parseKey, creditStatusController.singleQuery);

module.exports = router;
