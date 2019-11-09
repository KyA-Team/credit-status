config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '27017',
    dbName: process.env.DB_NAME || 'riskStatusDB',
    collectionName: process.env.DB_NAME || 'riskStatus',
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    isSRV: (process.env.MONGO_SRV && process.env.MONGO_SRV.toLowerCase() == 'true') || false
}

module.exports = config