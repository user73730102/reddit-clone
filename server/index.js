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
if (process.env.NODE_ENV !== 'test' && process.env.SENTRY_SERVER_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_SERVER_DSN,
    integrations: [
      // CORRECTED: Sentry.Integrations (plural)
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

// --- Middleware ---
const corsOptions = {
  origin: process.env.CLIENT_URL,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// --- API Routes ---
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/communities', require('./routes/communityRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

// --- Sentry Error Handler (Production/Development Only) ---
if (process.env.NODE_ENV !== 'test' && process.env.SENTRY_SERVER_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// --- Server Startup and Database Connection ---
const PORT = process.env.PORT || 5000;
let server;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    server = app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  });
}

// --- Graceful Shutdown Logic ---
const gracefulShutdown = async () => {
  console.log('Received shutdown signal. Closing server...');
  if (server) {
    server.close(async () => {
      console.log('HTTP server closed.');
      // CORRECTED: await mongoose.connection.close() with no callback
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  } else {
    // CORRECTED: await mongoose.connection.close() with no callback
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = app;