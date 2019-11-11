const creditStatusService = require('./creditStatusService');
const authentication = require('./authentication');


const multipleQuery = async (req, res) => {
  const ids = req.body;
  if (!Array.isArray(ids)) {
    res.status(400).json({ status: 'Invalid request' });
    return;
  }

  // TODO: Don't send the ids length, remove duplicates first
  const hasQuota = await authentication.hasQuota(ids.length, res);
  if (!hasQuota) {
    return;
  }

  creditStatusService.getCreditStatus(ids).then((creditStatus) => {
    if (creditStatus.length) {
      res.json(creditStatus);
    } else {
      res.status(404).json([]);
    }
  }).catch((reason) => { res.status(500).json({}); throw reason; });
};

const singleQuery = async (req, res) => {
  const { id } = req.params;
  const hasQuota = await authentication.hasQuota(1, res);
  if (!hasQuota) {
    return;
  }
  creditStatusService.getCreditStatus([id]).then((creditStatus) => {
    if (creditStatus.length) {
      res.json(creditStatus);
    } else {
      res.status(404).json({});
    }
  });
};

module.exports = {
  multipleQuery,
  singleQuery,
};
