const mongoose = require('mongoose');

// FIX: was calling process.exit(1) on any connection failure, which killed
// the entire server (including the port Render checks for) on things like a
// transient DNS hiccup or a wrong URI — turning a fixable config problem into
// a permanent crash loop. Now it logs and retries instead, so the HTTP server
// stays up (health checks still respond) while the DB connection is retried.
const connectDB = async (retryDelayMs = 5000) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error(`   Retrying in ${retryDelayMs / 1000}s... (check MONGODB_URI and Atlas Network Access)`);
    setTimeout(() => connectDB(retryDelayMs), retryDelayMs);
  }
};

mongoose.connection.on('disconnected', () => {
  console.error('⚠️  MongoDB disconnected, attempting to reconnect...');
});

module.exports = connectDB;
