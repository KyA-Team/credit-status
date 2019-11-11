const userAPI = require('./userAPI');

const parseKey = function (req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json({ status: 'Auth key missing in header' });
  }
  [, res.locals.key] = req.headers.authorization.split(' ');
  return next();
};

const hasQuota = async function (requiredQuota, res) {
  const { key } = res.locals;
  const available = await userAPI.getAvailableQuota(key);
  if (requiredQuota > available) {
    res
      .status(403)
      .json({ status: `Your available quota is not enough to fulfill your request. Needed: ${requiredQuota} / available: ${available}` });
    return false;
  }

  // TODO: Add logic to post consumed quota to remote service

  return true;
};


module.exports = { parseKey, hasQuota };
