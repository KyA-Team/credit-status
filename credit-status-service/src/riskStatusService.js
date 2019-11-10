const dbClient = require('./databaseClient');

async function findDocumentByIDs(client, ids) {
  const db = client.db('riskStatusDB');
  // Get the documents collection
  const collection = db.collection('riskStatus');
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
