const express = require('express');

const router = express.Router();
const userController = require('./userController');

router
  .route('/available-quota/:key')
  .get(userController.getAvailableQuota);

router
  .route('/quota-limit/:key')
  .get(userController.getQuotaLimit)
  .put(userController.setQuotaLimit);

router
  .route('/consume-quota/:key')
  .put(userController.consumeCuota);

module.exports = router;
