const initializeMockData = async (dbClient, dbName, collectionName) => {
  const docs = [
    { _id: 1254, creditStatus: 2 },
    { _id: 94779065, creditStatus: 1 },
    { _id: 35366634, creditStatus: 3 }];

  const db = await dbClient.getDBConnection(dbName);

  const coll = db.collection(collectionName);
  try {
    const result = await coll.insertMany(docs, { ordered: false });
    console.debug(`DB populated with result: ${result}`); // eslint-disable-line no-console
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Error while populating DB: ${err}`);
    // eslint-disable-next-line no-console
    console.error('Result:', err.result);
  }
};

module.exports = { initializeMockData };
