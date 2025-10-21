/**
 * Jest setup file for integration tests
 * This file runs before each test file
 */

// Increase timeout for integration tests
jest.setTimeout(10000);

// Global test utilities
global.testUtils = require('./testUtils');
global.testApp = require('./testApp');

// Mock console methods in tests to reduce noise
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Restore console after each test
afterEach(() => {
  global.console = originalConsole;
});

// Global test helpers
global.createTestApp = global.testApp.createTestApp;
global.createAuthTestApp = global.testApp.createAuthTestApp;
global.createPlantsTestApp = global.testApp.createPlantsTestApp;

// Global assertions
global.expectUserStructure = global.testUtils.assertions.expectUserStructure;
global.expectPlantStructure = global.testUtils.assertions.expectPlantStructure;
global.expectErrorResponse = global.testUtils.assertions.expectErrorResponse;
global.expectSuccessResponse = global.testUtils.assertions.expectSuccessResponse;

// Global constants
global.HTTP_STATUS = global.testUtils.constants.HTTP_STATUS;
global.VALIDATION = global.testUtils.constants.VALIDATION;
