/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
// Express automatically knows that this entire function is an error
// handling middleware by specifying 4 parameters
module.exports = (err, _req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
