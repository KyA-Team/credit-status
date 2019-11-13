const express = require('express');

const router = express.Router();
const userController = require('./userController');
const authController = require('../auth/authController');

router
  .route('/available-quota/:key')
  .get(
    authController.validateCredentials,
    userController.getAvailableQuota,
  );

router
  .route('/quota-limit/:key')
  .get(
    authController.validateCredentials,
    userController.getQuotaLimit,
  )
  .put(
    authController.validateCredentials,
    userController.setQuotaLimit,
  );

router
  .route('/consume-quota/:key')
  .put(
    authController.validateCredentials,
    userController.consumeQuota
  );

module.exports = router;
