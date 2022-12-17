const ApiError = require('./../utils/errors/ApiError');
const Typebox = require('@sinclair/typebox');
const { ValidationError, object } = require('joi');
const { TypeboxError } = require('typebox-express-middleware');
const { captureMessage } = require('@sentry/node');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new ApiError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new ApiError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ApiError(message, 400);
};

const handleJWTError = () =>
  new ApiError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new ApiError('Your token has expired! Please log in again.', 401);

const sendError = (err, req, res) => {
  console.error('ERROR 💥', err);

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  // if (process.env.NODE_ENV === 'development') {
  //   sendErrorDev(err, req, res);
  // }
  // else if (process.env.NODE_ENV === 'production') {
  let error = { ...err };
  error.message = err.message;
  console.log(err);
  if (error.code === 'LIMIT_FILE_SIZE')
    error = new ApiError('Payload too large, the limit is 250mb', 413);
  else if (error.name === 'CastError') error = handleCastErrorDB(error);
  else if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  else if (error.name === 'ValidationError')
    error = handleValidationErrorDB(error);
  else if (error.name === 'JsonWebTokenError') error = handleJWTError();
  else if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
  else if (error instanceof ValidationError)
    error = error.details.map((err) => err.message);
  else if (error.type === 'NotFound') error = error;
  else if (err.name == 'TypeboxError') {
    error.message = error.errors;
    error = error;
  } else {
    error.message = 'Internal Server Error';
    captureMessage(error);
  }
  sendError(error, req, res);
  // }
};
