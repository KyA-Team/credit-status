
const create = (key, quotaLimit, consumedQuota = 0, lastReset = Date.now()) => ({
  key,
  quotaLimit,
  consumedQuota,
  lastReset,
});

module.exports = { create };
