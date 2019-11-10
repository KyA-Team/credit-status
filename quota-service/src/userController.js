const _ = require('lodash');

const availableQuotas = { 'limit10': 10, 'limit2': 2, 'limit0': 0, 'limit1': 1 }
class UserController {

  getLimit = async (req, res, next) => {
    res.status(200).send('no limit yet');
  }

  setLimit = async (req, res, next) => {

  }

  getAvailableQuota = (req, res, next) => {

    const key = _.get(req, 'params.key', 'limit10');
    const available = availableQuotas[key];
    res.json({availableQuota: available});
  }

}

module.exports = new UserController();