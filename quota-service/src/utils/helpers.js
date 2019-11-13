const moment = require('moment');
const AppError = require('./appError');

const getTimeDiff = (date1, date2, timeUnit = 'h') => moment(date1).minutes(0).diff(moment(date2).minutes(0), timeUnit);

const validateExistence = (data, message) => {
  if (!data) {
    throw new AppError(message || 'The provided key does not exists', 404);
  }
};

const validateType = (val, type, message) => {
  // eslint-disable-next-line valid-typeof
  if (typeof val === type) {
    return;
  }
  throw new AppError(message || `The provided value must be a ${type}`, 400);
};

module.exports = { getTimeDiff, validateExistence, validateType };
