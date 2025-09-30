// Import required packages
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the server to accept JSON in the request body

// A simple test route
app.get('/', (req, res) => {
  res.send('Hello from the Reddit Clone Backend!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});