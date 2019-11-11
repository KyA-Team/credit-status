const _ = require('lodash');
const userService = require('./userService');

class UserController {
  async getQuotaLimit(req, res) {
    const key = _.get(req, 'params.key');
    const limit = await userService.getLimitQuota(key);
    res.json({ quotaLimit: limit });
  }

  async setQuotaLimit(req, res) {
    const key = _.get(req, 'params.key');
    const newLimit = _.get(req, 'body.limit');

    const result = await userService.setLimitQuota(key, newLimit);
    res.json({ success: result });
  }

  async getAvailableQuota(req, res) {
    const key = _.get(req, 'params.key');
    const available = await userService.getAvailableQuota(key);
    res.json({ availableQuota: available });
  }

  async consumeCuota(req, res) {
    const key = _.get(req, 'params.key');
    const consumed = _.get(req, 'body.consumed');
    const available = await userService.consumeQuota(key, consumed);
    res.json({ success: available });
  }
}

module.exports = new UserController();
