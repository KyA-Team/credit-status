const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const userRoutes = require('./modules/user/userRoutes');
const AppError = require('./utils/appError');

app.use(bodyParser.json());
app.use(mongoSanitize());
app.use(xss());

app.use('/api', userRoutes);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
