const handleError = (res, error) => (
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  }));

module.exports = { handleError };
