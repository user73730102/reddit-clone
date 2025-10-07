module.exports = {
  testEnvironment: 'node',
  verbose: true,
  // This line tells Jest to run our setup file before the tests.
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};