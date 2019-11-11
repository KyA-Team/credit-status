
const create = (key, quotaLimit, consumedQuota = 0, lastReset = Date.now()) => ({
  _id: key,
  key,
  quotaLimit,
  consumedQuota,
  lastReset,
});

module.exports = { create };
