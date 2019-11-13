const creditStatusService = require('./creditStatusService');
const authentication = require('../../authentication');
const userAPI = require('../../userAPI');

const respondCreditStatus = async (ids, res) => {
  const hasQuota = await authentication.hasQuota(ids.length, res);
  if (!hasQuota) return;

  try {
    const creditStatus = await creditStatusService.getCreditStatus(ids);
    if (creditStatus.length) {
      res.json(creditStatus);
      userAPI.consumeQuota(res.locals.key, ids.length);
    } else {
      res.status(404).json([]);
    }
  } catch (reason) {
    res.status(500).json({});
    // eslint-disable-next-line no-console
    console.error('Error getting credit status from DB', reason);
  }
};

const multipleQuery = async (req, res) => {
  const ids = req.body;
  if (!Array.isArray(ids)) {
    res.status(400).json({ status: 'Invalid request' });
    return;
  }
  const uniqueIds = [...new Set(ids)]; // Remove duplicates
  respondCreditStatus(uniqueIds, res);
};

const singleQuery = async (req, res) => {
  const { id } = req.params;
  respondCreditStatus([id], res);
};

module.exports = {
  multipleQuery,
  singleQuery,
};
