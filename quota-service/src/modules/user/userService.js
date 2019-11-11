const _ = require('lodash');
const client = require('../../databaseClient');
const config = require('../../utils/config');
const { getTimeDiff } = require('../../utils/helpers');

class UserService {
  getCollection = () => client.db(config.dbName).collection(config.collectionName);

  resetLimitQuota = async (key) => {
    this.getCollection().updateOne({ key }, {
      $set: {
        consumedQuota: 0,
        lastReset: Date.now(),
      },
    });
  };

  setQuotaLimit = async (key, newLimit) => {
    const { result } = await this.getCollection().updateOne({ key }, {
      $set: {
        quotaLimit: newLimit,
      },
    });
    return _.isEqual(result.nModified, 1);
  };

  getQuotaLimit = async (key) => {
    const { quotaLimit } = await this.getCollection().findOne({ key });
    return quotaLimit;
  };

  getAvailableQuota = async (key) => {
    const data = await this.getCollection().findOne({ key });
    const { quotaLimit, consumedQuota, lastReset } = data;
    const timeDiff = getTimeDiff(Date.now(), lastReset);
    if (timeDiff >= 1) {
      await this.resetLimitQuota(key);
      return quotaLimit;
    }

    return quotaLimit - consumedQuota;
  };

  consumeQuota = async (key, consumed) => {
    const { result } = await this.getCollection().updateOne({ key }, {
      $inc: {
        consumedQuota: consumed,
      },
    });
    return _.isEqual(result.nModified, 1);
  };
}

module.exports = new UserService();
