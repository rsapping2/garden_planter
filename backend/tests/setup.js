// Test setup file
// This file runs before all tests

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.PORT = '3001';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to silence console.log in tests
  // log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Global test timeout
jest.setTimeout(10000);

// Add a dummy test to prevent Jest from failing on empty test suite
describe('Test Setup', () => {
  test('should set up test environment correctly', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.JWT_SECRET).toBe('test-jwt-secret-key');
  });
});
