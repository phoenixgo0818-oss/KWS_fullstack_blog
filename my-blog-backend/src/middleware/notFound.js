/**
 * 404 middleware — runs when no route matched the request.
 */
function notFound(req, res) {
  res.status(404).json({ error: 'Not found' });
}

module.exports = notFound;
