/**
 * optionalAuthenticate — like `authenticate`, but never rejects the request.
 * If a valid Bearer token is present, attaches the decoded payload to req.user.
 * Otherwise req.user stays undefined and the request proceeds as a guest.
 * Used on public GET routes that still want to know "is someone logged in?"
 * (e.g. to compute a per-user `hasUpvoted` flag).
 */
const jwt = require('jsonwebtoken');

function optionalAuthenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      // invalid/expired token on a public route — ignore, treat as guest
    }
  }

  next();
}

module.exports = optionalAuthenticate;
