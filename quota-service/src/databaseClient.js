const { MongoClient } = require('mongodb');
const config = require('./utils/config');
const userModel = require('./modules/user/userModel');

class UrlBuilder {
  constructor(host, port) {
    this.host = host;
    this.port = port;
    this.protocol = 'mongodb';
  }

  withAuth(user, pass) {
    if (user && pass) {
      this.user = encodeURIComponent(user);
      this.pass = encodeURIComponent(pass);
    }
    return this;
  }

  withSRV(isSRV) {
    this.protocol = isSRV ? 'mongodb+srv' : 'mongodb';
    this.isSRV = isSRV;
    return this;
  }

  build() {
    const urlArray = [this.protocol, '://'];
    if (this.user) {
      urlArray.push(this.user, ':', this.pass, '@');
    }
    urlArray.push(this.host);
    if (!this.isSRV) {
      urlArray.push(':', this.port);
    }
    const url = urlArray.join('');
    console.debug(`Connection string generated for mongo: ${url.replace(this.pass, '###')}`); // eslint-disable-line no-console
    return url;
  }
}

// Connection URL
const url = new UrlBuilder(config.host, config.port)
  .withSRV(config.isSRV)
  .withAuth(config.user, config.password)
  .build();

const client = new MongoClient(url);
const connection = client.connect(); // initialized connection
let db;


connection.then(async () => {
  const docs = [
    userModel.create('11111', 10),
    userModel.create('22222', 100),
    userModel.create('33333', 50),
    userModel.create('44444', 500),
  ];
  db = client.db(config.dbName);

  const coll = db.collection(config.collectionName);
  for (const doc of docs) {
    coll.insertOne(doc, { upsert: true }, (err, result) => {
      if (err) console.error('Trying to insert entry that already exists');// throw err
      console.debug('Document inserted', doc, `with result ${result}`); // eslint-disable-line no-console
    });
  }
  console.debug('DB mock data loaded'); // eslint-disable-line no-console
});

module.exports = client;
