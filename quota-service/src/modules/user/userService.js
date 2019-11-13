const _ = require('lodash');
const client = require('../../database/databaseClient');
const config = require('../../utils/config');
const { getTimeDiff, validateExistence, validateType } = require('../../utils/helpers');

class UserService {
  getCollection = async () => {
    const db = await client.getDBConnection(config.dbName);
    return db.collection(config.collectionName);
  };

  resetLimitQuota = async (key) => {
    await this.getCollection()
      .then((collection) => collection.updateOne({ key }, {
        $set: {
          consumedQuota: 0,
          lastReset: Date.now(),
        },
      }));
  };

  setQuotaLimit = async (key, newLimit) => {
    validateType(newLimit, 'number');
    const data = await this.getCollection().then((collection) => collection.updateOne({ key }, {
      $set: {
        quotaLimit: newLimit,
      },
    }));
    validateExistence(data);
    return _.isEqual(data.result.ok, 1);
  };

  getQuotaLimit = async (key) => {
    const data = await this.getCollection()
      .then((collection) => collection.findOne({ key }));
    validateExistence(data);
    return data.quotaLimit;
  };

  getAvailableQuota = async (key) => {
    const data = await this.getCollection()
      .then((collection) => collection.findOne({ key }));
    validateExistence(data);
    const { quotaLimit, consumedQuota, lastReset } = data;
    const timeDiff = getTimeDiff(Date.now(), lastReset);
    if (timeDiff >= 1) {
      await this.resetLimitQuota(key);
      return quotaLimit;
    }

    return quotaLimit - consumedQuota;
  };

  consumeQuota = async (key, consumed) => {
    validateType(consumed, 'number');
    const data = await this.getCollection()
      .then((collection) => collection.updateOne({ key }, {
        $inc: {
          consumedQuota: consumed,
        },
      }));
    validateExistence(data);
    return _.isEqual(data.result.ok, 1);
  };
}

module.exports = new UserService();
