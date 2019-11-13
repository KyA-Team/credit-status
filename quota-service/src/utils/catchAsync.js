const { handleError } = require('./errorHandler');

const catchAsync = (asyncFunction) => (
  (req, res, next) => {
    asyncFunction(req, res, next).catch((error) => {
      handleError(res, error);
    });
  }
);

module.exports = catchAsync;
