// Environment-based test user configuration
const TEST_CONFIG = {
  development: {
    baseUrl: 'http://localhost:3000',
    users: {
      admin: {
        email: 'admin@test.com',
        password: 'admin123',
        name: 'Admin User'
      },
      user: {
        email: 'user@test.com', 
        password: 'user123',
        name: 'Test User'
      }
    }
  },
  production: {
    baseUrl: 'https://your-app.com',
    users: {
      admin: {
        email: 'test-admin@yourdomain.com',
        password: 'test-admin-123',
        name: 'Test Admin'
      },
      user: {
        email: 'test-user@yourdomain.com',
        password: 'test-user-123', 
        name: 'Test User'
      }
    }
  }
};

function getTestConfig() {
  const environment = process.env.NODE_ENV || 'development';
  return TEST_CONFIG[environment];
}

function getTestUser(role = 'user') {
  const config = getTestConfig();
  return config.users[role];
}

module.exports = {
  getTestConfig,
  getTestUser,
  TEST_CONFIG
};
