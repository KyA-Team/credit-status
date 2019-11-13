const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '27017',
  dbName: process.env.DB_NAME || 'creditStatusDB',
  collectionName: process.env.DB_NAME || 'users',
  user: process.env.MONGO_USER,
  password: process.env.MONGO_PASSWORD,
  isSRV: (process.env.MONGO_SRV && process.env.MONGO_SRV.toLowerCase() === 'true') || false,
  quotaService: {
    host: process.env.QUOTA_HOST || 'localhost',
    port: process.env.QUOTA_PORT || 3000,
  },
  credentials: {
    token: process.env.ADMIN_TOKEN || 'admin',
  },
};

module.exports = config;
