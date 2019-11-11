const _ = require('lodash');
const userService = require('./userService');

class UserController {
  getQuotaLimit = async (req, res) => {
    const key = _.get(req, 'params.key');
    const limit = await userService.getQuotaLimit(key);
    res.json({ quotaLimit: limit });
  };

  setQuotaLimit = async (req, res) => {
    const key = _.get(req, 'params.key');
    const newLimit = _.get(req, 'body.limit');
    const result = await userService.setQuotaLimit(key, newLimit);
    res.json({ success: result });
  };

  getAvailableQuota = async (req, res) => {
    const key = _.get(req, 'params.key');
    const available = await userService.getAvailableQuota(key);
    res.json({ availableQuota: available });
  };

  consumeCuota = async (req, res) => {
    const key = _.get(req, 'params.key');
    const consumed = _.get(req, 'body.consumed');
    const available = await userService.consumeQuota(key, consumed);
    res.json({ success: available });
  };
}

module.exports = new UserController();
