const request = require('supertest');
const app = require('../index'); // Import our server's app object
const mongoose = require('mongoose');


// Connect to the database before running tests
beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_URL);
});

// Disconnect after tests are done
afterAll(async () => {
  await mongoose.connection.close();
});

// Test Suite for Post API
describe('GET /api/posts', () => {
  it('should return all posts and respond with a 200 status code', async () => {
    const response = await request(app).get('/api/posts');
    
    // Assertions
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(Array.isArray(response.body)).toBe(true);
  });
});