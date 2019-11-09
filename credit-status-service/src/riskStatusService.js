var dbClient = require('./databaseClient');

function getCreditStatus(cuils, callback) {
    const ids = cuils.map(numStr => parseInt(numStr));
    return findDocumentByIDs(dbClient, ids);
}

async function findDocumentByIDs(dbClient, ids, callback) {
    const db = dbClient.db('riskStatusDB')
    // Get the documents collection
    const collection = db.collection('riskStatus');
    // Find some documents
    return collection.find({_id: {
            $in: ids
        }}).toArray();
}
module.exports = {getCreditStatus};