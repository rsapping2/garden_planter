module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  collectCoverageFrom: [
    'src/routes/**/*.js',
    'src/utils/**/*.js',
    'src/services/**/*.js',
    'src/models/**/*.js',
    '!**/tests/**',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 10000
};


