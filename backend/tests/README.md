# Test Structure

This directory contains the test suite for the Garden Planter backend API, organized to eliminate code duplication and provide shared utilities.

## 📁 Directory Structure

```
tests/
├── setup/                    # Shared test configuration and utilities
│   ├── testApp.js           # Express app creation utilities
│   ├── testUtils.js         # Common test data and assertions
│   ├── jest.config.js       # Jest configuration
│   └── jest.setup.js        # Jest setup file
├── integration/             # Integration tests
│   ├── auth.test.js         # Authentication API tests
│   └── plants.test.js       # Plants API tests
├── unit/                    # Unit tests (future)
└── README.md               # This file
```

## 🛠️ Shared Utilities

### Test App Creation (`testApp.js`)

- **`createTestApp(options)`** - Generic test app creator
- **`createAuthTestApp()`** - Pre-configured auth routes
- **`createPlantsTestApp()`** - Pre-configured plants routes
- **`createMultiRouteTestApp(routeGroups)`** - Multiple route groups

### Test Data & Assertions (`testUtils.js`)

- **`testUsers`** - Valid/invalid user data for testing
- **`testPlants`** - Valid/invalid plant data for testing
- **`assertions`** - Common assertion helpers
- **`helpers`** - Utility functions (unique emails, delays, etc.)
- **`constants`** - HTTP status codes and validation rules

## 🚀 Usage Examples

### Basic Test Structure

```javascript
const request = require('supertest');
const { createAuthTestApp } = require('../setup/testApp');
const { testUsers, assertions, constants } = require('../setup/testUtils');

describe('Auth Routes', () => {
  let app;

  beforeEach(() => {
    app = createAuthTestApp();
  });

  test('should register user', async () => {
    const userData = helpers.generateTestUser();
    
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(constants.HTTP_STATUS.CREATED);

    assertions.expectUserStructure(response.body.user, userData);
  });
});
```

### Using Shared Assertions

```javascript
// Check user structure
assertions.expectUserStructure(user, expectedData);

// Check plant structure  
assertions.expectPlantStructure(plant);

// Check error responses
assertions.expectErrorResponse(response, 400, 'Invalid email');

// Check success responses
assertions.expectSuccessResponse(response, 201);
```

### Using Test Data

```javascript
// Pre-defined test data
const userData = testUsers.valid;
const invalidData = testUsers.invalid;

// Generate unique test data
const uniqueUser = helpers.generateTestUser();
const uniqueEmail = helpers.generateUniqueEmail('test');
```

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run integration tests only
npm run test:integration

# Run unit tests only
npm run test:unit

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## 📊 Benefits

### ✅ Eliminated Duplication
- **Before**: Each test file had duplicate `createTestApp` functions
- **After**: Shared utilities in `setup/` directory

### ✅ Consistent Assertions
- **Before**: Inconsistent assertion patterns across tests
- **After**: Standardized assertion helpers

### ✅ Reusable Test Data
- **Before**: Hardcoded test data in each file
- **After**: Centralized test data with variations

### ✅ Better Maintainability
- **Before**: Changes required updates in multiple files
- **After**: Single source of truth for common functionality

## 🔧 Configuration

The Jest configuration is centralized in `tests/setup/jest.config.js` and includes:

- **Test environment**: Node.js
- **Coverage thresholds**: 80% for all metrics
- **Test timeout**: 10 seconds
- **Setup files**: Automatic loading of shared utilities
- **Coverage reports**: Text, LCOV, and HTML formats

## 📝 Adding New Tests

1. **Create test file** in appropriate directory (`integration/` or `unit/`)
2. **Import shared utilities** from `../setup/`
3. **Use common patterns** for consistency
4. **Follow naming conventions** for test descriptions

## 🎯 Best Practices

- Use shared assertions instead of custom expect statements
- Generate unique test data to avoid conflicts
- Use constants for HTTP status codes
- Keep tests focused and atomic
- Use descriptive test names
