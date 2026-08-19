// Load env vars from .env FIRST
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const sanitizeRequest = require('./middleware/sanitize');
const csrfProtection = require('./middleware/csrf');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// FIX: Validate required env vars at startup to fail fast
const REQUIRED_ENV = ['JWT_SECRET', 'MONGODB_URI'];
const missingEnv = REQUIRED_ENV.filter(key => !process.env[key]);
if (missingEnv.length > 0) {
  console.error('FATAL: Missing required environment variables:', missingEnv.join(', '));
  console.error('Please copy .env.example to .env and fill in all values.');
  process.exit(1);
}

const app = express();
connectDB();

// FIX: Render (and most PaaS hosts) terminate TLS at a proxy and forward
// plain HTTP internally with an X-Forwarded-Proto header. Without this,
// req.secure is always false even on a live HTTPS request — which silently
// broke the sameSite:'none' cookie logic below (it was gated on NODE_ENV
// instead, which Render doesn't set by default either) and would also make
// express-rate-limit key everything off the proxy's IP instead of the real
// client IP.
app.set('trust proxy', 1);

// FIX #11: security headers + strict CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  hsts: process.env.NODE_ENV === 'production'
    ? { maxAge: 31536000, includeSubDomains: true, preload: true }
    : false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// FIX #5 + FIX #6: CORS locked to explicit allowlist, credentials:true now required
// because auth moved from a localStorage bearer token to an httpOnly cookie.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : false,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

// FIX: limit request body size to prevent large-payload attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// FIX #1: strip $ and . operators from body/query/params to block NoSQL operator injection
app.use(sanitizeRequest);

// FIX #7: rate limit auth endpoints against brute force / credential stuffing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// FIX: Global rate limiter for all authenticated API routes
// Prevents abuse (spamming thousands of requests) even after login
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please slow down.' }
});
app.use('/api/students', apiLimiter);
app.use('/api/attendance', apiLimiter);
app.use('/api/fees', apiLimiter);

// FIX #14: CSRF protection, required now that auth uses an ambient cookie instead
// of a manually-attached Authorization header (double-submit token pattern)
app.use(csrfProtection);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/fees', require('./routes/fees'));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Vidhya+ API is running...',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const errorMessage = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong. Please try again.' 
    : err.message;
  res.status(err.status || 500).json({ 
    success: false,
    message: errorMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Bind to all network interfaces

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 CORS allowed origins: ${allowedOrigins.length ? allowedOrigins.join(', ') : '(none configured)'}`);
  console.log(`📡 Listening on ${HOST}:${PORT}`);
});
