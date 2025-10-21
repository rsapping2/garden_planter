const request = require('supertest');
const { createPlantsTestApp } = require('../setup/testApp');
const { testPlants, assertions, constants } = require('../setup/testUtils');

describe('Plants Routes', () => {
  let app;

  beforeEach(() => {
    app = createPlantsTestApp();
  });

  describe('GET /api/plants', () => {
    test('should return plants array', async () => {
      const response = await request(app)
        .get('/api/plants')
        .expect(constants.HTTP_STATUS.OK);

      assertions.expectSuccessResponse(response);
      expect(response.body.plants).toBeDefined();
      expect(Array.isArray(response.body.plants)).toBe(true);
      expect(response.body.plants.length).toBeGreaterThan(0);
      
      // Check plant structure using shared assertion
      const plant = response.body.plants[0];
      assertions.expectPlantStructure(plant);
    });

    test('should filter plants by type', async () => {
      const response = await request(app)
        .get('/api/plants?type=vegetable')
        .expect(constants.HTTP_STATUS.OK);

      expect(response.body.plants).toBeDefined();
      expect(Array.isArray(response.body.plants)).toBe(true);
      
      // All returned plants should be vegetables
      response.body.plants.forEach(plant => {
        expect(plant.type).toBe('vegetable');
      });
    });

    test('should search plants by name', async () => {
      const response = await request(app)
        .get('/api/plants?search=tomato')
        .expect(200);

      expect(response.body.plants).toBeDefined();
      expect(Array.isArray(response.body.plants)).toBe(true);
      
      // Should find tomato
      const tomato = response.body.plants.find(p => p.name.toLowerCase().includes('tomato'));
      expect(tomato).toBeDefined();
    });
  });

  describe('GET /api/plants/:id', () => {
    test('should return specific plant by ID', async () => {
      const response = await request(app)
        .get('/api/plants/tomato')
        .expect(200);

      expect(response.body.plant).toBeDefined();
      expect(response.body.plant.id).toBe('tomato');
      expect(response.body.plant.name).toBe('Tomato');
    });

    test('should return 404 for non-existent plant', async () => {
      const response = await request(app)
        .get('/api/plants/nonexistent')
        .expect(404);

      expect(response.body.error).toBe('Plant not found');
    });
  });

  describe('GET /api/plants/:id/companions', () => {
    test('should return companion plants', async () => {
      const response = await request(app)
        .get('/api/plants/tomato/companions')
        .expect(200);

      expect(response.body.companions).toBeDefined();
      expect(Array.isArray(response.body.companions)).toBe(true);
      
      // Should have basil and marigold as companions
      const companionNames = response.body.companions.map(c => c.name);
      expect(companionNames).toContain('Basil');
      expect(companionNames).toContain('Marigold');
    });

    test('should return 404 for non-existent plant companions', async () => {
      const response = await request(app)
        .get('/api/plants/nonexistent/companions')
        .expect(404);

      expect(response.body.error).toBe('Plant not found');
    });
  });

  describe('GET /api/plants/zone/:zone', () => {
    test('should return plants suitable for zone', async () => {
      const response = await request(app)
        .get('/api/plants/zone/7a')
        .expect(200);

      expect(response.body.plants).toBeDefined();
      expect(Array.isArray(response.body.plants)).toBe(true);
      
      // All plants should be suitable for zone 7
      response.body.plants.forEach(plant => {
        expect(plant.zoneMin).toBeLessThanOrEqual(7);
        expect(plant.zoneMax).toBeGreaterThanOrEqual(7);
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle server errors gracefully', async () => {
      // Test with undefined plant ID
      const response = await request(app)
        .get('/api/plants/undefined/companions')
        .expect(404);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('Performance', () => {
    test('should respond quickly', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/api/plants')
        .expect(200);
        
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(1000);
    });
  });
});
