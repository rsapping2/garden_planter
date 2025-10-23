const request = require('supertest');
const { createAuthTestApp } = require('../setup/testApp');
const { testUsers, assertions, helpers, constants } = require('../setup/testUtils');

describe('Auth Routes', () => {
  let app;

  beforeEach(() => {
    app = createAuthTestApp();
  });

  describe('POST /api/auth/register', () => {
    test('should register a new user with valid data', async () => {
      const userData = helpers.generateTestUser();

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(constants.HTTP_STATUS.CREATED);

      assertions.expectSuccessResponse(response, constants.HTTP_STATUS.CREATED);
      assertions.expectUserStructure(response.body.user, userData);
      expect(response.body.token).toBeDefined();
    });

    test('should return 400 for invalid email', async () => {
      const invalidData = {
        ...testUsers.invalid,
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(constants.HTTP_STATUS.BAD_REQUEST);

      expect(response.body.errors).toBeDefined();
    });

    test('should return 400 for short password', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123',
        name: 'Test User',
        zipCode: '90210'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });

    test('should return 400 for duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'Password!2#',
        name: 'Test User',
        zipCode: '90210'
      };

      // First registration should succeed
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Second registration should fail
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      const userData = {
        email: 'logintest@example.com',
        password: 'Password!2#',
        name: 'Login Test User',
        zipCode: '90210'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);
    });

    test('should login with valid credentials', async () => {
      const loginData = {
        email: 'logintest@example.com',
        password: 'Password!2#'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(loginData.email);
      expect(response.body.user.password).toBeUndefined();
      expect(response.body.token).toBeDefined();
    });

    test('should return 401 for invalid credentials', async () => {
      const loginData = {
        email: 'logintest@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.error).toBe('Invalid credentials');
    });

    test('should return 400 for missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/auth/me', () => {
    test('should get user profile with valid user ID', async () => {
      // Create a test user first
      const userData = {
        email: 'profiletest@example.com',
        password: 'Password!2#',
        name: 'Profile Test User',
        zipCode: '90210'
      };

      const signupResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);

      const userId = signupResponse.body.user.id;

      const response = await request(app)
        .get('/api/auth/me')
        .set('user-id', userId.toString())
        .expect(200);

      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('profiletest@example.com');
      expect(response.body.user.password).toBeUndefined();
    });

    test('should return 404 without user ID', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(404);

      expect(response.body.error).toBeDefined();
    });

    test('should return 404 with invalid user ID', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('user-id', '999')
        .expect(404);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

      // Should handle the error gracefully
      expect(response.status).toBe(400);
    });
  });

  describe('Performance', () => {
    test('should respond quickly to auth requests', async () => {
      const startTime = Date.now();
      
      const userData = {
        email: 'performance@example.com',
        password: 'Password!2#',
        name: 'Performance Test',
        zipCode: '90210'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);
        
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(2000);
    });
  });
});
