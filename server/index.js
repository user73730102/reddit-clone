const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: process.env.CLIENT_URL, // Only allow requests from our client
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// --- API Routes ---
// This tells the server to use the routes defined in userRoutes.js
// for any request that starts with '/api/users'
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/communities', require('./routes/communityRoutes')); 
app.use('/api/posts', require('./routes/postRoutes')); 

// Test route (can be removed later)
app.get('/', (req, res) => {
  res.send('Hello from the Reddit Clone Backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});