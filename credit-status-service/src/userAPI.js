const rq = require('request-promise');
const _ = require('lodash');
const config = require('./config');

const getAvailableQuota = async (key) => {
  const { host } = config.quotaService;
  const { port } = config.quotaService;
  const uri = `http://${host}:${port}/api/available-quota/${key}`;
  const options = {
    uri,
    simple: false,
    json: true,
    headers: {
      Authorization: `bearer ${config.quotaService.adminKey}`,
    },
  };
  const response = await rq.get(options);
  return response.availableQuota || 0;
};

const consumeQuota = async (key, amount) => {
  const { host } = config.quotaService;
  const { port } = config.quotaService;
  const uri = `http://${host}:${port}/api/consume-quota/${key}`;
  const options = {
    uri,
    json: true,
    body: {
      consumed: amount,
    },
    headers: {
      Authorization: `bearer ${config.quotaService.adminKey}`,
    },
  };
  const response = await rq.put(options);
  return response.availableQuota || 0;
};

module.exports = { getAvailableQuota, consumeQuota };
