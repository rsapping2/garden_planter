const express = require('express');

/**
 * Creates a test Express app with common middleware and error handling
 * @param {Object} options - Configuration options
 * @param {string} options.routePath - The API route path (e.g., '/api/auth')
 * @param {Object} options.routes - The route handler to mount
 * @param {Object} options.middleware - Additional middleware to add
 * @returns {Object} Express app instance
 */
const createTestApp = ({ routePath, routes, middleware = [] } = {}) => {
  const app = express();
  
  // Common middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Add any additional middleware
  middleware.forEach(middlewareFn => {
    app.use(middlewareFn);
  });
  
  // Mount routes if provided
  if (routePath && routes) {
    app.use(routePath, routes);
  }
  
  // Error handling middleware
  app.use((err, _req, res, _next) => {
    console.error('Test error:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error'
    });
  });
  
  // 404 handler
  app.use('*', (_req, res) => {
    res.status(404).json({
      error: 'Route not found'
    });
  });
  
  return app;
};

/**
 * Creates a test app specifically for auth routes
 * @returns {Object} Express app with auth routes
 */
const createAuthTestApp = () => {
  const authRoutes = require('../../src/routes/auth');
  return createTestApp({
    routePath: '/api/auth',
    routes: authRoutes
  });
};

/**
 * Creates a test app specifically for plants routes
 * @returns {Object} Express app with plants routes
 */
const createPlantsTestApp = () => {
  const plantsRoutes = require('../../src/routes/plants');
  return createTestApp({
    routePath: '/api/plants',
    routes: plantsRoutes
  });
};

/**
 * Creates a test app with multiple route groups
 * @param {Array} routeGroups - Array of {routePath, routes} objects
 * @returns {Object} Express app with multiple routes
 */
const createMultiRouteTestApp = (routeGroups) => {
  const app = express();
  
  // Common middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Mount all route groups
  routeGroups.forEach(({ routePath, routes }) => {
    app.use(routePath, routes);
  });
  
  // Error handling middleware
  app.use((err, _req, res, _next) => {
    console.error('Test error:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error'
    });
  });
  
  // 404 handler
  app.use('*', (_req, res) => {
    res.status(404).json({
      error: 'Route not found'
    });
  });
  
  return app;
};

module.exports = {
  createTestApp,
  createAuthTestApp,
  createPlantsTestApp,
  createMultiRouteTestApp
};
