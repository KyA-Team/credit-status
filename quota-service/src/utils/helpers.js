const moment = require('moment');

const DATE_FORMAT = 'YYYYMMDDmm';

const getTimeDiff = (date1, date2, format = DATE_FORMAT, timeUnit = 'm') => moment(date1, format).diff(moment(date2, format), timeUnit);

module.exports = { getTimeDiff };
