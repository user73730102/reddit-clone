// This file runs before any server-side tests.
// Its job is to load the environment variables from the .env file.
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });