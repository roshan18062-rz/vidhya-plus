const crypto = require('crypto');

// FIX #14: double-submit-cookie CSRF protection.
// Needed as a direct consequence of FIX #6 (JWT moved from localStorage into an
// httpOnly cookie) — an ambient cookie is sent automatically by the browser on
// cross-site requests, which a manually-attached Authorization header never was.
//
// Flow:
//   1. GET requests: if no 'csrfToken' cookie exists yet, mint one (readable by
//      JS, NOT httpOnly, since the frontend must read it and echo it back).
//   2. State-changing requests (POST/PUT/DELETE): require header 'X-CSRF-Token'
//      to match the 'csrfToken' cookie. A cross-site attacker page can trigger
//      the cookie to be sent automatically, but cannot read it (browser same-
//      origin policy) to also set the matching header — so forged requests fail.

const CSRF_COOKIE = 'csrfToken';
const CSRF_HEADER = 'x-csrf-token';
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

const csrfProtection = (req, res, next) => {
  let token = req.cookies?.[CSRF_COOKIE];

  if (!token) {
    token = crypto.randomBytes(32).toString('hex');
    res.cookie(CSRF_COOKIE, token, {
      httpOnly: false, // frontend JS needs to read this one
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
  }

  if (SAFE_METHODS.includes(req.method)) {
    return next();
  }

  const headerToken = req.header(CSRF_HEADER);
  if (!headerToken || headerToken !== token) {
    return res.status(403).json({ message: 'Invalid or missing CSRF token' });
  }

  next();
};

module.exports = csrfProtection;
