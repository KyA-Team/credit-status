const dbClient = require('./databaseClient');
const config = require('./config');

async function findDocumentByIDs(client, ids) {
  const db = client.db(config.dbName);
  // Get the documents collection
  const collection = db.collection(config.collectionName);
  // Find some documents
  return collection.find({
    _id: {
      $in: ids,
    },
  }).toArray();
}

function getCreditStatus(cuils) {
  const ids = cuils.map((numStr) => parseInt(numStr));
  return findDocumentByIDs(dbClient, ids);
}

module.exports = { getCreditStatus };
