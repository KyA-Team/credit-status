const AppError = require('../../utils/appError');
const config = require('../../utils/config');
const catchAsync = require('../../utils/catchAsync');

class AuthController {
  validateCredentials = catchAsync(async (req, res, next) => {
    const token = req.get('authorization');
    if (!token) {
      throw new AppError('You are not authenticated', 401);
    } else if (token !== `bearer ${config.credentials.token}`) {
      throw new AppError('You do not have permission to perform this action', 403);
    }
    next();
  });
}

module.exports = new AuthController();
