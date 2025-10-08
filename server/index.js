const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Sentry = require('@sentry/node');

// Load environment variables for non-test environments
if (process.env.NODE_ENV !== 'test') {
  require('dotenv').config();
}

const app = express();

// --- Sentry Initialization (Using your simpler syntax) ---
if (process.env.NODE_ENV !== 'test' && process.env.SENTRY_SERVER_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_SERVER_DSN, // Use our project's variable name
    integrations: [Sentry.expressIntegration()], // Your simpler syntax is better!
    tracesSampleRate: 1.0,
  });
  // Sentry's expressIntegration adds these handlers automatically now.
}

// --- Middleware ---
const corsOptions = {
  origin: process.env.CLIENT_URL, // Restore our security options
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// --- API Routes (Using our project's routes) ---
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/communities', require('./routes/communityRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

// --- Sentry Error Handler (Using your simpler syntax) ---
if (process.env.NODE_ENV !== 'test' && process.env.SENTRY_SERVER_DSN) {
  app.use(Sentry.expressErrorHandler()); // Your simpler syntax is better!
}

// --- Server Startup and Database Connection (Test-safe) ---
const PORT = process.env.PORT || 5000;
let server;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL); // Use our project's variable name
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    Sentry.captureException(error); // Also send DB connection errors to Sentry
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    server = app.listen(PORT, '0.0.0.0', () => { // Use '0.0.0.0' for Docker
      console.log(`Server is running on port: ${PORT}`);
    });
  });
}

// --- Graceful Shutdown Logic (Restored) ---
const gracefulShutdown = async () => {
  console.log('Received shutdown signal. Closing server...');
  if (server) {
    server.close(async () => {
      console.log('HTTP server closed.');
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  } else {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = app;