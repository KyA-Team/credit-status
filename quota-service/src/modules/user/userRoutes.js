const express = require('express');

const router = express.Router();
const userController = require('./userController');

router
  .route('/available-quota/:key')
  .get(userController.getAvailableQuota);

router
  .route('/quota-limit/:key')
  .get(userController.getQuotaLimit)
  .post(userController.setQuotaLimit);

router
  .route('/consume-quota/:key')
  .post(userController.consumeCuota);

module.exports = router;
