const rq = require('request-promise');
const _ = require('lodash');
const config = require('./config');

const getAvailableQuota = async (key) => {
  const { host } = config.quotaService;
  const { port } = config.quotaService;
  const uri = `http://${host}:${port}/api/available-quota/${key}`;
  const options = {
    uri,
    json: true,
  };
  const response = await rq.get(options);
  return response.availableQuota || 0;
};

module.exports = { getAvailableQuota };
