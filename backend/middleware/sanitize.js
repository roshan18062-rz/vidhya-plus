// FIX #1: strips Mongo operator keys ($... or keys containing '.') from
// req.body / req.query / req.params, recursively, in place.
//
// NOTE: the 'express-mongo-sanitize' package was tried first and rejected —
// it reassigns req.query wholesale, and Express 5's req.query is a getter-only
// property, so it crashed every request with:
//   "TypeError: Cannot set property query of #<IncomingMessage> which has only a getter"
// This version mutates existing objects' keys instead of reassigning the
// container, which works under both Express 5's default 'simple' query parser
// and the JSON body parser.
function sanitizeInPlace(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
      continue;
    }
    if (obj[key] && typeof obj[key] === 'object') {
      sanitizeInPlace(obj[key]);
    }
  }
  return obj;
}

const sanitizeRequest = (req, res, next) => {
  sanitizeInPlace(req.body);
  sanitizeInPlace(req.query);
  sanitizeInPlace(req.params);
  next();
};

module.exports = sanitizeRequest;
