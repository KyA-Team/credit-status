const moment = require('moment');

const getTimeDiff = (date1, date2, timeUnit = 'h') => moment(date1).minutes(0).diff(moment(date2).minutes(0), timeUnit);

module.exports = { getTimeDiff };
