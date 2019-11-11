const dbClient = require('./databaseClient');

async function findDocumentByIDs(client, ids) {
  const db = client.db('creditStatusDB');
  // Get the documents collection
  const collection = db.collection('creditStatus');
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
