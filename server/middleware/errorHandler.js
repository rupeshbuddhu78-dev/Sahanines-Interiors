const AppError = require('../utils/AppError');

const handleCastError = (err) => new AppError(`Invalid ${err.path}: ${err.value}`, 400);
const handleDuplicateKey = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(`Duplicate value for ${field}: ${err.keyValue[field]}`, 409);
};
const handleValidation = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(`Invalid input: ${messages.join('. ')}`, 400);
};
const handleJWT = () => new AppError('Invalid token. Please log in again.', 401);
const handleExpiredJWT = () => new AppError('Session expired. Please log in again.', 401);

module.exports = (err, req, res, next) => {
  let error = err;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';

  if (err.name === 'CastError') error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateKey(err);
  if (err.name === 'ValidationError') error = handleValidation(err);
  if (err.name === 'JsonWebTokenError') error = handleJWT();
  if (err.name === 'TokenExpiredError') error = handleExpiredJWT();

  const isDev = process.env.NODE_ENV !== 'production';
  const payload = {
    success: false,
    status: error.status,
    message: error.message || 'Internal server error',
  };
  if (isDev) payload.stack = err.stack;

  // Log unexpected errors
  if (!error.isOperational) {
    console.error('[Error]', err);
  }

  res.status(error.statusCode).json(payload);
};
