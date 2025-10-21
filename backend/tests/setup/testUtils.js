/**
 * Common test data and utilities for integration tests
 */

/**
 * Sample user data for testing
 */
const testUsers = {
  valid: {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    zipCode: '90210'
  },
  invalid: {
    email: 'invalid-email',
    password: '123',
    name: '',
    zipCode: 'invalid'
  },
  duplicate: {
    email: 'duplicate@example.com',
    password: 'password123',
    name: 'Duplicate User',
    zipCode: '10001'
  }
};

/**
 * Sample plant data for testing
 */
const testPlants = {
  valid: {
    name: 'Test Plant',
    type: 'vegetable',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 3,
    zoneMax: 9
  },
  invalid: {
    name: '',
    type: 'invalid-type',
    sun: 'invalid-sun',
    soil: '',
    zoneMin: 'invalid',
    zoneMax: 'invalid'
  }
};

/**
 * Common test assertions
 */
const assertions = {
  /**
   * Asserts that a response has the expected user structure
   * @param {Object} user - User object to validate
   * @param {Object} expectedData - Expected user data
   */
  expectUserStructure: (user, expectedData = {}) => {
    expect(user).toBeDefined();
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('zipCode');
    expect(user).toHaveProperty('usdaZone');
    expect(user).not.toHaveProperty('password'); // Password should never be returned
    
    // Check specific values if provided
    if (expectedData.email) expect(user.email).toBe(expectedData.email);
    if (expectedData.name) expect(user.name).toBe(expectedData.name);
    if (expectedData.zipCode) expect(user.zipCode).toBe(expectedData.zipCode);
  },

  /**
   * Asserts that a response has the expected plant structure
   * @param {Object} plant - Plant object to validate
   */
  expectPlantStructure: (plant) => {
    expect(plant).toBeDefined();
    expect(plant).toHaveProperty('id');
    expect(plant).toHaveProperty('name');
    expect(plant).toHaveProperty('type');
    expect(plant).toHaveProperty('sun');
    expect(plant).toHaveProperty('soil');
    expect(plant).toHaveProperty('zoneMin');
    expect(plant).toHaveProperty('zoneMax');
  },

  /**
   * Asserts that a response has the expected error structure
   * @param {Object} response - Response object
   * @param {number} expectedStatus - Expected status code
   * @param {string} expectedError - Expected error message
   */
  expectErrorResponse: (response, expectedStatus, expectedError) => {
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toHaveProperty('error');
    if (expectedError) {
      expect(response.body.error).toContain(expectedError);
    }
  },

  /**
   * Asserts that a response has the expected success structure
   * @param {Object} response - Response object
   * @param {number} expectedStatus - Expected status code
   */
  expectSuccessResponse: (response, expectedStatus = 200) => {
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toBeDefined();
  }
};

/**
 * Common test helpers
 */
const helpers = {
  /**
   * Generates a unique email for testing
   * @param {string} prefix - Email prefix
   * @returns {string} Unique email
   */
  generateUniqueEmail: (prefix = 'test') => {
    return `${prefix}-${Date.now()}@example.com`;
  },

  /**
   * Generates test user data with unique email
   * @param {Object} overrides - Data to override defaults
   * @returns {Object} Test user data
   */
  generateTestUser: (overrides = {}) => {
    return {
      ...testUsers.valid,
      email: helpers.generateUniqueEmail(),
      ...overrides
    };
  },

  /**
   * Waits for a specified amount of time
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise} Promise that resolves after the delay
   */
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  /**
   * Creates a mock request object
   * @param {Object} options - Request options
   * @returns {Object} Mock request object
   */
  createMockRequest: (options = {}) => ({
    body: {},
    params: {},
    query: {},
    headers: {},
    user: null,
    ...options
  }),

  /**
   * Creates a mock response object
   * @returns {Object} Mock response object
   */
  createMockResponse: () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis()
    };
    return res;
  }
};

/**
 * Common test constants
 */
const constants = {
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
  },
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 6,
    MAX_NAME_LENGTH: 50,
    ZIP_CODE_LENGTH: 5
  }
};

module.exports = {
  testUsers,
  testPlants,
  assertions,
  helpers,
  constants
};
