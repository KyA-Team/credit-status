const MongoClient = require('mongodb').MongoClient;
const config = require('./config')

class urlBuilder {
    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.protocol = 'mongodb'
    }

    withAuth(user, pass) {
        if (user && pass) {
            this.user = encodeURIComponent(user)
            this.pass = encodeURIComponent(pass)
        }
        return this
    }

    withSRV(isSRV) {
        this.protocol = isSRV ? 'mongodb+srv' : 'mongodb'
        this.isSRV = isSRV
        return this
    }

    build() {
        let url_array = [ this.protocol, "://" ]
        if (this.user) {
            url_array.push(this.user, ":", this.pass, "@")
        }
        url_array.push(this.host)
        if (!this.isSRV) {
            url_array.push(":", this.port)
        }
        const url = url_array.join('')
        console.debug("Connection string generated for mongo: " + url.replace(this.pass, '###'))
        return url
    }
}

// Connection URL
const url = new urlBuilder(config.host, config.port)
                .withSRV(config.isSRV)
                .withAuth(config.user, config.password)
                .build()

const client = new MongoClient(url)
const connection = client.connect() // initialized connection
var db


connection.then(() => {
    console.debug("Connected")
    const docs = [ 
        { _id: 1254, creditStatus: 2 },
        { _id: 94779065, creditStatus: 1 },
        { _id: 35366634, creditStatus: 3 }]
    db = client.db(config.dbName)

    const coll = db.collection(config.collectionName)
    for (let doc of docs) {
        coll.insertOne(doc, upsert=true, (err, result) => {
            if(err) console.error("Trying to insert entry that already exists");//throw err
            console.debug("Document inserted ",doc)
        })
    }
    console.debug("DB mock data loaded")
})

module.exports = client;

