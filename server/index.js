const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Sentry = require('@sentry/node');

// Load environment variables for non-test environments
if (process.env.NODE_ENV !== 'test') {
  require('dotenv').config();
}

const app = express();

// --- Sentry Initialization (Production/Development Only) ---
// Initialize Sentry only if the DSN is available and not in a test env
if (process.env.NODE_ENV !== 'test' && process.env.SENTRY_SERVER_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_SERVER_DSN,
    integrations: [
      new Sentry.Integration.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  });
  // The Sentry request handler must be the first middleware
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

// --- Middleware ---
const corsOptions = {
  origin: process.env.CLIENT_URL,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions)); // Use the configured cors middleware
app.use(express.json());   // Middleware to parse JSON bodies

// --- API Routes ---
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/communities', require('./routes/communityRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

// --- Sentry Error Handler (Production/Development Only) ---
// This must be after all controllers and before any other error middleware
if (process.env.NODE_ENV !== 'test' && process.env.SENTRY_SERVER_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// --- Server Startup and Database Connection ---
const PORT = process.env.PORT || 5000;
let server;

// Separate the connection logic so it can be used by tests
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// We need to connect to the DB for tests, but not start the server listening.
// For development/production, we connect and then start listening.
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    server = app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  });
} else {
  // For the test environment, we still need to connect to the DB.
  // The test setup (`beforeAll`) will handle this.
  // We export the app so supertest can start it on a random port.
}

// --- Graceful Shutdown Logic ---
const gracefulShutdown = () => {
  console.log('Received shutdown signal. Closing server...');
  // Check if the server is running before trying to close it
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed.');
        process.exit(0);
      });
    });
  } else {
    // If the server isn't running, just close the DB connection
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = app;