const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const sanitizeRequest = require('./middleware/sanitize');
const csrfProtection = require('./middleware/csrf');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
connectDB();

// FIX #11: security headers
app.use(helmet());

// FIX #5 + FIX #6: CORS locked to explicit allowlist, credentials:true now required
// because auth moved from a localStorage bearer token to an httpOnly cookie.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : false,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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