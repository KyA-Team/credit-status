/* eslint-disable max-classes-per-file */
const { MongoClient } = require('mongodb');
const config = require('../utils/config');
const DBUrlBuilder = require('./utils/DBUrlBuilder');
const { initializeMockData } = require('./utils/dbPopulator');


class DatabaseClient {
  constructor() {
    this.connectionURL = new DBUrlBuilder(config.host, config.port)
      .withSRV(config.isSRV)
      .withAuth(config.user, config.password)
      .build();
  }

  async getConnectedClient() {
    const client = new MongoClient(this.connectionURL);
    await client.connect();
    return client;
  }

  async getDBConnection(dbName) {
    if (this.client == null) {
      this.client = await this.getConnectedClient();
    }
    return this.client.db(dbName);
  }
}

const dbClient = new DatabaseClient();
initializeMockData(dbClient, config.dbName, config.collectionName);

module.exports = dbClient;
