const dbClient = require('../../database/databaseClient');
const config = require('../../config');

const findDocumentsByIDs = async (ids) => {
  const db = await dbClient.getDBConnection(config.dbName);
  const collection = db.collection(config.collectionName);
  return collection.find({
    _id: {
      $in: ids,
    },
  }).toArray();
};

const getCreditStatus = async (cuils) => {
  const ids = cuils.map((numStr) => parseInt(numStr));
  const docs = await findDocumentsByIDs(ids);
  // eslint-disable-next-line no-underscore-dangle
  return docs.map((doc) => ({ cuit: doc._id, creditStatus: doc.creditStatus }));
}

module.exports = { getCreditStatus };
