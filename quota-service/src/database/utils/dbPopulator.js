const userModel = require('../../modules/user/userModel');

const initializeMockData = async (dbClient, dbName, collectionName) => {
  const docs = [
    userModel.create('00000', 0),
    userModel.create('11111', 10),
    userModel.create('22222', 100),
    userModel.create('33333', 50),
    userModel.create('44444', 500),
  ];

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
