import { PLANT_DATABASE } from '../data/plantsData';
import config from '../config/environment';

/**
 * Plant Service - Handles plant data loading with environment-based switching
 * 
 * Development: Uses local PLANT_DATABASE
 * Production: Can switch to API calls
 */
class PlantService {
  constructor() {
    this.useAPI = config.env === 'production' && config.apiUrl;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get all plants with optional filtering
   * @param {Object} filters - { type, sun, zone, search }
   * @returns {Promise<Array>} Array of plant objects
   */
  async getPlants(filters = {}) {
    if (this.useAPI) {
      return this._getPlantsFromAPI(filters);
    } else {
      return this._getPlantsFromLocal(filters);
    }
  }

  /**
   * Get a specific plant by ID
   * @param {string} plantId - Plant identifier
   * @returns {Promise<Object|null>} Plant object or null if not found
   */
  async getPlantById(plantId) {
    if (this.useAPI) {
      return this._getPlantFromAPI(plantId);
    } else {
      return this._getPlantFromLocal(plantId);
    }
  }

  /**
   * Get companion plants for a specific plant
   * @param {string} plantId - Plant identifier
   * @returns {Promise<Array>} Array of companion plant objects
   */
  async getCompanionPlants(plantId) {
    const plant = await this.getPlantById(plantId);
    if (!plant || !plant.companionIds) return [];

    const companions = await Promise.all(
      plant.companionIds.map(id => this.getPlantById(id))
    );
    
    return companions.filter(Boolean);
  }

  /**
   * Get plants suitable for a specific USDA zone
   * @param {number} zone - USDA hardiness zone
   * @returns {Promise<Array>} Array of suitable plant objects
   */
  async getPlantsByZone(zone) {
    const plants = await this.getPlants();
    return plants.filter(plant => 
      plant.zoneMin <= zone && plant.zoneMax >= zone
    );
  }

  // ===== LOCAL DATA METHODS =====

  _getPlantsFromLocal(filters = {}) {
    return new Promise((resolve) => {
      let filteredPlants = [...PLANT_DATABASE];

      // Apply filters
      if (filters.type && filters.type !== 'all') {
        filteredPlants = filteredPlants.filter(plant => plant.type === filters.type);
      }

      if (filters.sun && filters.sun !== 'all') {
        filteredPlants = filteredPlants.filter(plant => plant.sun === filters.sun);
      }

      if (filters.zone && filters.zone !== 'all') {
        const userZone = parseInt(filters.zone);
        filteredPlants = filteredPlants.filter(plant => 
          plant.zoneMin <= userZone && plant.zoneMax >= userZone
        );
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredPlants = filteredPlants.filter(plant => 
          plant.name.toLowerCase().includes(searchTerm)
        );
      }

      resolve(filteredPlants);
    });
  }

  _getPlantFromLocal(plantId) {
    return new Promise((resolve) => {
      const plant = PLANT_DATABASE.find(p => p.id === plantId);
      resolve(plant || null);
    });
  }

  // ===== API DATA METHODS =====

  async _getPlantsFromAPI(filters = {}) {
    const cacheKey = `plants_${JSON.stringify(filters)}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`${config.apiUrl}/api/plants?${queryParams}`);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const plants = data.plants || [];

      // Cache the result
      this.cache.set(cacheKey, {
        data: plants,
        timestamp: Date.now()
      });

      return plants;
    } catch (error) {
      console.error('Failed to fetch plants from API, falling back to local data:', error);
      return this._getPlantsFromLocal(filters);
    }
  }

  async _getPlantFromAPI(plantId) {
    const cacheKey = `plant_${plantId}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(`${config.apiUrl}/api/plants/${plantId}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const plant = data.plant || null;

      // Cache the result
      this.cache.set(cacheKey, {
        data: plant,
        timestamp: Date.now()
      });

      return plant;
    } catch (error) {
      console.error(`Failed to fetch plant ${plantId} from API, falling back to local data:`, error);
      return this._getPlantFromLocal(plantId);
    }
  }

  // ===== UTILITY METHODS =====

  /**
   * Clear the cache (useful for testing or when switching environments)
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Check if the service is using API or local data
   * @returns {boolean} True if using API, false if using local data
   */
  isUsingAPI() {
    return this.useAPI;
  }

  /**
   * Force switch to API mode (for testing)
   * @param {boolean} useAPI - Whether to use API
   */
  setAPIMode(useAPI) {
    this.useAPI = useAPI;
    this.clearCache();
  }
}

// Export a singleton instance
const plantService = new PlantService();
export default plantService;


