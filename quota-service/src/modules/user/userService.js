const _ = require('lodash');
const client = require('../../databaseClient');
const config = require('../../utils/config');
const { getTimeDiff } = require('../../utils/helpers');

class UserService {
  getCollection() {
    return client.db(config.dbName).collection(config.collectionName);
  }

  resetLimitQuota(key) {
    this.getCollection().updateOne({ key }, {
      $set: {
        consumedQuota: 0,
        lastReset: Date.now(),
      },
    });
  }

  async setLimitQuota(key, newLimit) {
    const { result } = await this.getCollection().updateOne({ key }, {
      $set: {
        quotaLimit: newLimit,
      },
    });
    return _.isEqual(result.nModified, 1);
  }

  async getLimitQuota(key) {
    const { quotaLimit } = await this.getCollection().findOne({ key });
    return quotaLimit;
  }

  async getAvailableQuota(key) {
    const data = await this.getCollection().findOne({ key });
    const { quotaLimit, consumedQuota, lastReset } = data;
    const timeDiff = getTimeDiff(Date.now(), lastReset);
    if (timeDiff >= 1) {
      this.resetLimitQuota(key);
      return quotaLimit;
    }

    return quotaLimit - consumedQuota;
  }

  async consumeQuota(key, consumed) {
    const { consumedQuota = 0 } = await this.getCollection().findOne({ key });
    const { result } = await this.getCollection().updateOne({ key }, {
      $set: {
        consumedQuota: consumedQuota + consumed,
      },
    });
    return _.isEqual(result.nModified, 1);
  }
}

module.exports = new UserService();
