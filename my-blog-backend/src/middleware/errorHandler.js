/**
 * Global error handler — last middleware; maps errors to JSON responses.
 * Handles Mongoose validation errors and duplicate key (11000).
 */
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return res.status(400).json({ error: message || 'Validation failed' });
  }

  if (err.code === 11000) {
    return res.status(409).json({ error: 'Already exists' });
  }

  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;
