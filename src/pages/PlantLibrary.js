import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getZoneSpecificDates, formatPlantingWindow } from '../utils/zonePlantingDates';
import CompanionPlantsModal from '../components/CompanionPlantsModal';
import Header from '../components/Header';
import Footer from '../components/Footer';
import plantService from '../services/plantService';

// Fallback plant database for Plant Library (works without authentication)
const FALLBACK_PLANT_DATABASE = [
  {
    id: 'tomato',
    name: 'Tomato',
    type: 'vegetable',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 3,
    zoneMax: 11,
    spacing: 24,
    companionIds: ['basil', 'marigold'],
    plantingStart: '2024-03-01',
    plantingEnd: '2024-05-15',
    harvestStart: '2024-07-01',
    harvestEnd: '2024-10-15',
    image: '🍅'
  },
  {
    id: 'lettuce',
    name: 'Lettuce',
    type: 'vegetable',
    sun: 'partial',
    soil: 'moist',
    zoneMin: 2,
    zoneMax: 11,
    spacing: 6,
    companionIds: ['carrot', 'radish'],
    plantingStart: '2024-02-15',
    plantingEnd: '2024-04-30',
    harvestStart: '2024-04-15',
    harvestEnd: '2024-06-30',
    image: '🥬'
  },
  {
    id: 'carrot',
    name: 'Carrot',
    type: 'vegetable',
    sun: 'full',
    soil: 'loose',
    zoneMin: 3,
    zoneMax: 10,
    spacing: 3,
    companionIds: ['lettuce', 'onion'],
    plantingStart: '2024-03-01',
    plantingEnd: '2024-05-01',
    harvestStart: '2024-06-15',
    harvestEnd: '2024-08-15',
    image: '🥕'
  },
  {
    id: 'basil',
    name: 'Basil',
    type: 'herb',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 4,
    zoneMax: 11,
    spacing: 12,
    companionIds: ['tomato'],
    plantingStart: '2024-04-01',
    plantingEnd: '2024-06-15',
    harvestStart: '2024-06-01',
    harvestEnd: '2024-09-30',
    image: '🌿'
  },
  {
    id: 'marigold',
    name: 'Marigold',
    type: 'flower',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 2,
    zoneMax: 11,
    spacing: 8,
    companionIds: ['tomato', 'pepper'],
    plantingStart: '2024-04-01',
    plantingEnd: '2024-06-01',
    harvestStart: '2024-07-01',
    harvestEnd: '2024-10-31',
    image: '🌼'
  },
  {
    id: 'pepper',
    name: 'Bell Pepper',
    type: 'vegetable',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 4,
    zoneMax: 11,
    spacing: 18,
    companionIds: ['marigold', 'basil'],
    plantingStart: '2024-04-15',
    plantingEnd: '2024-06-01',
    harvestStart: '2024-07-15',
    harvestEnd: '2024-10-15',
    image: '🫑'
  },
  {
    id: 'onion',
    name: 'Onion',
    type: 'vegetable',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 3,
    zoneMax: 9,
    spacing: 4,
    companionIds: ['carrot', 'lettuce'],
    plantingStart: '2024-03-01',
    plantingEnd: '2024-04-15',
    harvestStart: '2024-07-01',
    harvestEnd: '2024-08-15',
    image: '🧅'
  },
  {
    id: 'radish',
    name: 'Radish',
    type: 'vegetable',
    sun: 'full',
    soil: 'loose',
    zoneMin: 2,
    zoneMax: 11,
    spacing: 2,
    companionIds: ['lettuce', 'carrot'],
    plantingStart: '2024-03-01',
    plantingEnd: '2024-05-01',
    harvestStart: '2024-04-15',
    harvestEnd: '2024-06-01',
    image: '🥗'
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    type: 'vegetable',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 4,
    zoneMax: 11,
    spacing: 36,
    companionIds: ['beans', 'corn', 'sunflower'],
    plantingStart: '2024-04-15',
    plantingEnd: '2024-06-15',
    harvestStart: '2024-07-01',
    harvestEnd: '2024-09-30',
    image: '🥒'
  },
  {
    id: 'beans',
    name: 'Green Beans',
    type: 'vegetable',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 3,
    zoneMax: 10,
    spacing: 6,
    companionIds: ['corn', 'cucumber', 'potato'],
    plantingStart: '2024-04-15',
    plantingEnd: '2024-07-01',
    harvestStart: '2024-06-15',
    harvestEnd: '2024-09-15',
    image: '🫘'
  },
  {
    id: 'corn',
    name: 'Sweet Corn',
    type: 'vegetable',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 4,
    zoneMax: 8,
    spacing: 12,
    companionIds: ['beans', 'cucumber', 'squash'],
    plantingStart: '2024-04-15',
    plantingEnd: '2024-06-01',
    harvestStart: '2024-07-15',
    harvestEnd: '2024-09-15',
    image: '🌽'
  },
  {
    id: 'potato',
    name: 'Potato',
    type: 'vegetable',
    sun: 'full',
    soil: 'loose',
    zoneMin: 3,
    zoneMax: 9,
    spacing: 12,
    companionIds: ['beans', 'cabbage', 'marigold'],
    plantingStart: '2024-03-15',
    plantingEnd: '2024-05-15',
    harvestStart: '2024-07-01',
    harvestEnd: '2024-09-30',
    image: '🥔'
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    type: 'vegetable',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 2,
    zoneMax: 9,
    spacing: 18,
    companionIds: ['potato', 'onion', 'marigold'],
    plantingStart: '2024-03-01',
    plantingEnd: '2024-05-01',
    harvestStart: '2024-06-15',
    harvestEnd: '2024-08-15',
    image: '🥬'
  },
  {
    id: 'spinach',
    name: 'Spinach',
    type: 'vegetable',
    sun: 'partial',
    soil: 'moist',
    zoneMin: 2,
    zoneMax: 9,
    spacing: 4,
    companionIds: ['strawberry', 'radish', 'lettuce'],
    plantingStart: '2024-03-01',
    plantingEnd: '2024-05-01',
    harvestStart: '2024-04-15',
    harvestEnd: '2024-06-15',
    image: '🥬'
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    type: 'fruit',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 3,
    zoneMax: 10,
    spacing: 18,
    companionIds: ['spinach', 'lettuce', 'thyme'],
    plantingStart: '2024-03-15',
    plantingEnd: '2024-05-15',
    harvestStart: '2024-05-15',
    harvestEnd: '2024-07-15',
    image: '🍓'
  },
  {
    id: 'thyme',
    name: 'Thyme',
    type: 'herb',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 5,
    zoneMax: 9,
    spacing: 12,
    companionIds: ['strawberry', 'tomato', 'cabbage'],
    plantingStart: '2024-04-01',
    plantingEnd: '2024-06-01',
    harvestStart: '2024-06-01',
    harvestEnd: '2024-09-30',
    image: '🌿'
  },
  {
    id: 'oregano',
    name: 'Oregano',
    type: 'herb',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 4,
    zoneMax: 9,
    spacing: 12,
    companionIds: ['tomato', 'pepper', 'basil'],
    plantingStart: '2024-04-01',
    plantingEnd: '2024-06-01',
    harvestStart: '2024-06-01',
    harvestEnd: '2024-09-30',
    image: '🌿'
  },
  {
    id: 'mint',
    name: 'Mint',
    type: 'herb',
    sun: 'partial',
    soil: 'moist',
    zoneMin: 3,
    zoneMax: 9,
    spacing: 18,
    companionIds: ['cabbage', 'tomato'],
    plantingStart: '2024-04-01',
    plantingEnd: '2024-06-01',
    harvestStart: '2024-06-01',
    harvestEnd: '2024-09-30',
    image: '🌿'
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    type: 'flower',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 2,
    zoneMax: 11,
    spacing: 24,
    companionIds: ['cucumber', 'corn', 'beans'],
    plantingStart: '2024-04-15',
    plantingEnd: '2024-06-15',
    harvestStart: '2024-08-01',
    harvestEnd: '2024-10-15',
    image: '🌻'
  },
  {
    id: 'zucchini',
    name: 'Zucchini',
    type: 'vegetable',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 3,
    zoneMax: 9,
    spacing: 36,
    companionIds: ['corn', 'beans', 'marigold'],
    plantingStart: '2024-05-01',
    plantingEnd: '2024-06-15',
    harvestStart: '2024-07-01',
    harvestEnd: '2024-09-30',
    image: '🥒'
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    type: 'vegetable',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 3,
    zoneMax: 9,
    spacing: 18,
    companionIds: ['onion', 'marigold', 'thyme'],
    plantingStart: '2024-03-01',
    plantingEnd: '2024-05-01',
    harvestStart: '2024-06-01',
    harvestEnd: '2024-08-15',
    image: '🥦'
  },
  {
    id: 'peas',
    name: 'Garden Peas',
    type: 'vegetable',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 2,
    zoneMax: 9,
    spacing: 3,
    companionIds: ['carrot', 'radish', 'corn'],
    plantingStart: '2024-02-15',
    plantingEnd: '2024-04-15',
    harvestStart: '2024-05-15',
    harvestEnd: '2024-07-15',
    image: '🫛'
  },
  {
    id: 'squash',
    name: 'Summer Squash',
    type: 'vegetable',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 3,
    zoneMax: 9,
    spacing: 36,
    companionIds: ['corn', 'beans', 'marigold'],
    plantingStart: '2024-05-01',
    plantingEnd: '2024-06-15',
    harvestStart: '2024-07-01',
    harvestEnd: '2024-09-30',
    image: '🥒'
  },
  {
    id: 'eggplant',
    name: 'Eggplant',
    type: 'vegetable',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 4,
    zoneMax: 10,
    spacing: 24,
    companionIds: ['basil', 'marigold', 'pepper'],
    plantingStart: '2024-04-15',
    plantingEnd: '2024-06-01',
    harvestStart: '2024-07-15',
    harvestEnd: '2024-09-30',
    image: '🍆'
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower',
    type: 'vegetable',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 2,
    zoneMax: 9,
    spacing: 18,
    companionIds: ['onion', 'marigold', 'thyme'],
    plantingStart: '2024-03-01',
    plantingEnd: '2024-05-01',
    harvestStart: '2024-06-15',
    harvestEnd: '2024-08-15',
    image: '🥬'
  },
  {
    id: 'kale',
    name: 'Kale',
    type: 'vegetable',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 2,
    zoneMax: 9,
    spacing: 12,
    companionIds: ['onion', 'marigold', 'herbs'],
    plantingStart: '2024-03-01',
    plantingEnd: '2024-05-01',
    harvestStart: '2024-05-15',
    harvestEnd: '2024-11-15',
    image: '🥬'
  },
  {
    id: 'rosemary',
    name: 'Rosemary',
    type: 'herb',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 6,
    zoneMax: 10,
    spacing: 24,
    companionIds: ['sage', 'thyme', 'cabbage'],
    plantingStart: '2024-04-01',
    plantingEnd: '2024-06-01',
    harvestStart: '2024-06-01',
    harvestEnd: '2024-12-31',
    image: '🌿'
  },
  {
    id: 'sage',
    name: 'Sage',
    type: 'herb',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 4,
    zoneMax: 9,
    spacing: 18,
    companionIds: ['rosemary', 'thyme', 'cabbage'],
    plantingStart: '2024-04-01',
    plantingEnd: '2024-06-01',
    harvestStart: '2024-06-01',
    harvestEnd: '2024-10-31',
    image: '🌿'
  },
  {
    id: 'chives',
    name: 'Chives',
    type: 'herb',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 3,
    zoneMax: 9,
    spacing: 8,
    companionIds: ['carrot', 'tomato', 'cabbage'],
    plantingStart: '2024-03-01',
    plantingEnd: '2024-05-01',
    harvestStart: '2024-05-01',
    harvestEnd: '2024-10-31',
    image: '🌿'
  },
  {
    id: 'lavender',
    name: 'Lavender',
    type: 'flower',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 5,
    zoneMax: 9,
    spacing: 24,
    companionIds: ['rosemary', 'sage', 'thyme'],
    plantingStart: '2024-04-01',
    plantingEnd: '2024-06-01',
    harvestStart: '2024-06-15',
    harvestEnd: '2024-08-15',
    image: '💜'
  },
  {
    id: 'nasturtium',
    name: 'Nasturtium',
    type: 'flower',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 2,
    zoneMax: 11,
    spacing: 12,
    companionIds: ['cucumber', 'tomato', 'radish'],
    plantingStart: '2024-04-15',
    plantingEnd: '2024-06-15',
    harvestStart: '2024-06-15',
    harvestEnd: '2024-09-30',
    image: '🌺'
  },
  {
    id: 'beets',
    name: 'Beets',
    type: 'vegetable',
    sun: 'full',
    soil: 'well-drained',
    zoneMin: 2,
    zoneMax: 10,
    spacing: 4,
    companionIds: ['onion', 'cabbage', 'lettuce'],
    plantingStart: '2024-03-01',
    plantingEnd: '2024-05-01',
    harvestStart: '2024-06-01',
    harvestEnd: '2024-08-15',
    image: '🥕'
  }
];

const PlantLibrary = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [plants, setPlants] = useState(FALLBACK_PLANT_DATABASE);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSun, setFilterSun] = useState('all');
  const [filterZone, setFilterZone] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showCompanionModal, setShowCompanionModal] = useState(false);
  const [selectedPlantForCompanions, setSelectedPlantForCompanions] = useState(null);

  // Load plants on component mount
  useEffect(() => {
    const loadPlants = async () => {
      try {
        setLoading(true);
        const plantsData = await plantService.getPlants();
        setPlants(plantsData);
      } catch (error) {
        console.error('Failed to load plants:', error);
        // Keep fallback data on error
      } finally {
        setLoading(false);
      }
    };

    loadPlants();
  }, []);

  const filteredAndSortedPlants = plants
    .filter(plant => {
      const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || plant.type === filterType;
      const matchesSun = filterSun === 'all' || plant.sun === filterSun;
      const matchesZone = filterZone === 'all' || 
        (user?.usdaZone && 
         plant.zoneMin <= parseInt(user.usdaZone) && 
         plant.zoneMax >= parseInt(user.usdaZone));
      
      return matchesSearch && matchesType && matchesSun && matchesZone;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'spacing':
          return a.spacing - b.spacing;
        default:
          return 0;
      }
    });

  const getCompanionPlants = (companionIds) => {
    if (!companionIds || companionIds.length === 0) return [];
    return companionIds.map(id => plants.find(p => p.id === id)).filter(Boolean);
  };

  const getPlantingWindow = (plant) => {
    // Try to get zone-specific dates first
    if (user?.usdaZone) {
      const zoneDates = getZoneSpecificDates(plant.id, user.usdaZone);
      if (zoneDates) {
        return formatPlantingWindow(zoneDates.plantingStart, zoneDates.plantingEnd);
      }
    }
    
    // Fallback to generic dates
    const start = new Date(plant.plantingStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = new Date(plant.plantingEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${start} - ${end}`;
  };

  const handleProtectedNavigation = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate('/auth');
    }
  };

  const showCompanionPlants = (plant) => {
    setSelectedPlantForCompanions(plant);
    setShowCompanionModal(true);
  };

  const PlantCard = ({ plant }) => (
    <div className="card hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="text-center mb-4">
        <div className="text-5xl mb-3">{plant.image}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{plant.name}</h3>
        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full capitalize">
          {plant.type}
        </span>
      </div>
      
      <div className="space-y-3 text-sm flex-1">
        <div className="flex justify-between">
          <span className="text-gray-600">Sun:</span>
          <span className="font-medium capitalize">{plant.sun}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Soil:</span>
          <span className="font-medium capitalize">{plant.soil}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Spacing:</span>
          <span className="font-medium">{plant.spacing}"</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Zones:</span>
          <span className="font-medium">{plant.zoneMin}-{plant.zoneMax}</span>
        </div>
        <div className="min-h-[60px]"> {/* Fixed height container for planting info */}
          <span className="text-gray-600">Planting:</span>
          <p className="font-medium text-sm">{getPlantingWindow(plant)}</p>
          {user?.usdaZone && getZoneSpecificDates(plant.id, user.usdaZone) && (
            <p className="text-xs text-primary-600">✓ Zone {user.usdaZone} specific</p>
          )}
        </div>
      </div>

      {/* Companion Plants Section - Always same height */}
      <div className="mt-4 pt-4 border-t min-h-[60px]">
        {plant.companionIds && plant.companionIds.length > 0 ? (
          <>
            <p className="text-xs text-gray-600 mb-2">Companion Plants:</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {getCompanionPlants(plant.companionIds).slice(0, 2).map(companion => (
                <span key={companion.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {companion.name}
                </span>
              ))}
            </div>
            {plant.companionIds.length > 2 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showCompanionPlants(plant);
                }}
                className="text-xs text-primary-600 hover:text-primary-700 underline"
              >
                Show {plant.companionIds.length - 2} more
              </button>
            )}
          </>
        ) : (
          <p className="text-xs text-gray-400">No companion plants listed</p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t">
        <button
          onClick={() => handleProtectedNavigation(`/garden-planner?addPlant=${plant.id}`)}
          className="w-full btn-primary text-center block"
        >
          Add to Garden
        </button>
      </div>
    </div>
  );

  const PlantListItem = ({ plant }) => (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="text-4xl">{plant.image}</div>
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{plant.name}</h3>
            <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full capitalize">
              {plant.type}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              Zones {plant.zoneMin}-{plant.zoneMax}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Sun:</span> {plant.sun}
            </div>
            <div>
              <span className="font-medium">Soil:</span> {plant.soil}
            </div>
            <div>
              <span className="font-medium">Spacing:</span> {plant.spacing}"
            </div>
            <div>
              <span className="font-medium">Planting:</span> {getPlantingWindow(plant)}
              {user?.usdaZone && getZoneSpecificDates(plant.id, user.usdaZone) && (
                <span className="ml-2 text-xs text-primary-600">✓ Zone {user.usdaZone}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => handleProtectedNavigation(`/garden-planner?addPlant=${plant.id}`)}
            className="btn-primary text-sm"
          >
            Add to Garden
          </button>
          <button className="btn-secondary text-sm">
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header showWelcome={!!user} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading plant library...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header showWelcome={!!user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Plant Library</h1>
          <p className="text-gray-600 mt-2">
            Discover plants perfect for your garden and growing zone
          </p>
        </div>

        {/* Filters and Search */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Search plants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="vegetable">Vegetables</option>
              <option value="herb">Herbs</option>
              <option value="flower">Flowers</option>
            </select>
            
            <select
              value={filterSun}
              onChange={(e) => setFilterSun(e.target.value)}
              className="input-field"
            >
              <option value="all">All Sun</option>
              <option value="full">Full Sun</option>
              <option value="partial">Partial Sun</option>
              <option value="shade">Shade</option>
            </select>
            
            <select
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
              className="input-field"
            >
              <option value="all">All Zones</option>
              <option value="zone">My Zone ({user?.usdaZone})</option>
            </select>
            
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field flex-1"
              >
                <option value="name">Sort by Name</option>
                <option value="type">Sort by Type</option>
                <option value="spacing">Sort by Spacing</option>
              </select>
              
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}
                >
                  ☰
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredAndSortedPlants.length} of {plants.length} plants
            {user?.usdaZone && (
              <span className="ml-2 text-sm bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                Zone {user.usdaZone}
              </span>
            )}
          </p>
        </div>

        {/* Plant Grid/List */}
        {filteredAndSortedPlants.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredAndSortedPlants.map(plant => (
              viewMode === 'grid' ? (
                <PlantCard key={plant.id} plant={plant} />
              ) : (
                <PlantListItem key={plant.id} plant={plant} />
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No plants found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find more plants.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterSun('all');
                setFilterZone('all');
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Plant Categories Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="text-4xl mb-3">🥕</div>
            <h3 className="font-semibold text-gray-900 mb-2">Vegetables</h3>
            <p className="text-sm text-gray-600">
              Nutritious and delicious crops perfect for your garden
            </p>
          </div>
          
          <div className="card text-center">
            <div className="text-4xl mb-3">🌿</div>
            <h3 className="font-semibold text-gray-900 mb-2">Herbs</h3>
            <p className="text-sm text-gray-600">
              Aromatic plants that enhance your cooking and garden
            </p>
          </div>
          
          <div className="card text-center">
            <div className="text-4xl mb-3">🌸</div>
            <h3 className="font-semibold text-gray-900 mb-2">Flowers</h3>
            <p className="text-sm text-gray-600">
              Beautiful blooms that attract pollinators and add color
            </p>
          </div>
        </div>
      </div>

      {/* Companion Plants Modal */}
      <CompanionPlantsModal
        isOpen={showCompanionModal}
        onClose={() => setShowCompanionModal(false)}
        plant={selectedPlantForCompanions}
        companionPlants={selectedPlantForCompanions ? getCompanionPlants(selectedPlantForCompanions.companionIds) : []}
      />
      
      <Footer />
    </div>
  );
};

export default PlantLibrary;
