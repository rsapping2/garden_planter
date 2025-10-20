import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useGarden } from '../contexts/GardenContext';
import { useAuth } from '../contexts/AuthContext';
import PlantCard from '../components/PlantCard';
import GardenGrid from '../components/GardenGrid';
import PlantInfoModal from '../components/PlantInfoModal';
import PlantTaskModal from '../components/PlantTaskModal';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { debugLog } from '../utils/debugLogger';
// Zone-specific dates are handled in PlantCard and PlantInfoModal components

const GardenPlanner = () => {
  const [searchParams] = useSearchParams();
  const gardenId = searchParams.get('garden');
  const { gardens, plants, addPlantToGarden, movePlantInGarden, removePlantFromGarden, getPlantById } = useGarden();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedGarden, setSelectedGarden] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [showPlantTaskModal, setShowPlantTaskModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterZone, setFilterZone] = useState('all');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (gardenId && gardens.length > 0) {
      const garden = gardens.find(g => g.id === gardenId);
      setSelectedGarden(garden || gardens[0]);
    } else if (gardens.length > 0) {
      setSelectedGarden(gardens[0]);
    }
  }, [gardenId, gardens, user, navigate]);

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || plant.type === filterType;
    
    // Fix zone matching - extract number from zone string like "10a" -> 10
    let matchesZone = true;
    if (filterZone === 'zone' && user?.usdaZone) {
      const userZoneNum = parseInt(user.usdaZone);
      matchesZone = plant.zoneMin <= userZoneNum && plant.zoneMax >= userZoneNum;
    }
    
    return matchesSearch && matchesType && matchesZone;
  });

  // Debug logging
  debugLog('Garden Planner Debug:', {
    plantsCount: plants.length,
    filteredPlantsCount: filteredPlants.length,
    searchTerm,
    filterType,
    filterZone,
    userZone: user?.usdaZone
  });

  const handlePlantDrop = (plant, x, y) => {
    if (!selectedGarden) return;
    
    // Get the current garden data from context (not stale local state)
    const currentGarden = gardens.find(g => g.id === selectedGarden.id);
    if (!currentGarden) return;
    
    debugLog('Plant dropped:', { plant, position: { x, y } });
    debugLog('Current garden from context:', currentGarden);
    
    // Check if position is already occupied using current data
    const existingPlant = currentGarden.layout.plants.find(p => p.x === x && p.y === y);
    if (existingPlant) {
      alert('This position is already occupied!');
      return;
    }

    addPlantToGarden(currentGarden.id, plant.id, { x, y });
  };

  const handlePlantClick = (plant) => {
    setSelectedPlant(plant);
    setShowPlantModal(true);
  };

  const handlePlantMove = (plantedItem, x, y) => {
    if (!selectedGarden) return;
    
    // Get the current garden data from context
    const currentGarden = gardens.find(g => g.id === selectedGarden.id);
    if (!currentGarden) return;
    
    debugLog('Plant move requested:', { plantedItem, position: { x, y } });
    
    movePlantInGarden(currentGarden.id, plantedItem, { x, y });
  };

  const handleEmptySlotClick = () => {
    // For now, we'll just show an alert. In a full implementation, 
    // this would open a plant selection modal
    alert(`Empty slot. Drag a plant from the sidebar to add it here!`);
  };

  const handleRemovePlant = (plant) => {
    if (selectedGarden && plant) {
      removePlantFromGarden(selectedGarden.id, plant.id);
      setShowPlantModal(false);
    }
  };

  const handleAddTask = () => {
    setShowPlantModal(false);
    setShowPlantTaskModal(true);
  };


  if (!selectedGarden) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌱</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Garden Selected</h2>
          <p className="text-gray-600 mb-6">
            Please create a garden first or select an existing one.
          </p>
          <Link to="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header showWelcome={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Garden Planner</h1>
              <p className="text-gray-600 mt-2">
                Design your garden layout by dragging plants from the library
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedGarden.id}
                onChange={(e) => {
                  const garden = gardens.find(g => g.id === e.target.value);
                  setSelectedGarden(garden);
                }}
                className="input-field"
              >
                {gardens.map(garden => (
                  <option key={garden.id} value={garden.id}>
                    {garden.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Plant Library Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Plant Library</h2>
              
              {/* Debug info */}
              <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
                <p>Plants loaded: {plants.length}</p>
                <p>Filtered plants: {filteredPlants.length}</p>
                <p>Search: "{searchTerm}"</p>
                <p>Type filter: {filterType}</p>
                <p>Zone filter: {filterZone}</p>
              </div>
              
              {/* Search and Filters */}
              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  placeholder="Search plants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field"
                />
                
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
                  value={filterZone}
                  onChange={(e) => setFilterZone(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Zones</option>
                  <option value="zone">My Zone ({user?.usdaZone})</option>
                </select>
              </div>

              {/* Plant Cards */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredPlants.length > 0 ? (
                  filteredPlants.map(plant => (
                    <PlantCard
                      key={plant.id}
                      plant={plant}
                      onPlantClick={handlePlantClick}
                      userZone={user?.usdaZone}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🔍</div>
                    <p className="text-gray-600">No plants found</p>
                    <p className="text-sm text-gray-500">Try adjusting your filters</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Total plants available: {plants.length}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Garden Grid */}
          <div className="lg:col-span-3">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedGarden.name}</h2>
                  <p className="text-gray-600">
                    {selectedGarden.layout.width} × {selectedGarden.layout.height} grid
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {(gardens.find(g => g.id === selectedGarden.id) || selectedGarden).layout.plants.length} plants
                  </span>
                  <button className="btn-secondary text-sm">
                    Save Layout
                  </button>
                </div>
              </div>

                <GardenGrid
                  garden={gardens.find(g => g.id === selectedGarden.id) || selectedGarden}
                  onPlantDrop={handlePlantDrop}
                  onPlantMove={handlePlantMove}
                  onPlantClick={handlePlantClick}
                  onEmptySlotClick={handleEmptySlotClick}
                />

              {/* Instructions */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Drag plants from the library to the garden grid</li>
                  <li>• Drag planted items to move them between squares</li>
                  <li>• Click on planted slots to view plant details</li>
                  <li>• Use filters to find plants suitable for your zone</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plant Info Modal */}
      <PlantInfoModal
        plant={selectedPlant ? getPlantById(selectedPlant.plantId) : null}
        isOpen={showPlantModal}
        onClose={() => setShowPlantModal(false)}
        onRemove={handleRemovePlant}
        onAddTask={handleAddTask}
        userZone={user?.usdaZone}
      />

      {/* Plant Task Modal */}
      <PlantTaskModal
        isOpen={showPlantTaskModal}
        onClose={() => setShowPlantTaskModal(false)}
        plantedItem={selectedPlant}
        plantData={selectedPlant ? getPlantById(selectedPlant.plantId) : null}
        gardenId={selectedGarden?.id}
        gardenName={selectedGarden?.name}
      />
      
      <Footer />
    </div>
  );
};

export default GardenPlanner;
