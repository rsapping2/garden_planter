import React from 'react';
import { getZoneSpecificDates, formatPlantingWindow } from '../utils/zonePlantingDates';

const PlantInfoModal = ({ plant, isOpen, onClose, onRemove, onAddTask, userZone }) => {
  if (!isOpen || !plant) return null;

  const getCompanionPlants = () => {
    if (!plant.companionIds || plant.companionIds.length === 0) {
      return 'None specified';
    }
    return plant.companionIds.join(', ');
  };

  const getPlantingWindow = () => {
    // Try to get zone-specific dates first
    if (userZone) {
      const zoneDates = getZoneSpecificDates(plant.id, userZone);
      if (zoneDates) {
        return formatPlantingWindow(zoneDates.plantingStart, zoneDates.plantingEnd);
      }
    }
    
    // Fallback to generic dates
    const start = new Date(plant.plantingStart).toLocaleDateString();
    const end = new Date(plant.plantingEnd).toLocaleDateString();
    return `${start} - ${end}`;
  };

  const getHarvestWindow = () => {
    // Try to get zone-specific dates first
    if (userZone) {
      const zoneDates = getZoneSpecificDates(plant.id, userZone);
      if (zoneDates) {
        return formatPlantingWindow(zoneDates.harvestStart, zoneDates.harvestEnd);
      }
    }
    
    // Fallback to generic dates
    const start = new Date(plant.harvestStart).toLocaleDateString();
    const end = new Date(plant.harvestEnd).toLocaleDateString();
    return `${start} - ${end}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <span className="text-4xl mr-4">{plant.image}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{plant.name}</h2>
                <p className="text-gray-600 capitalize">{plant.type}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Plant Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Growing Requirements</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sun Requirements:</span>
                  <span className="font-medium capitalize">{plant.sun}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Soil Type:</span>
                  <span className="font-medium capitalize">{plant.soil}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Spacing:</span>
                  <span className="font-medium">{plant.spacing}" apart</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hardiness Zones:</span>
                  <span className="font-medium">{plant.zoneMin} - {plant.zoneMax}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Timing</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Planting Window:</span>
                  <p className="font-medium">{getPlantingWindow()}</p>
                  {userZone && getZoneSpecificDates(plant.id, userZone) && (
                    <p className="text-xs text-primary-600">✓ Zone {userZone} specific dates</p>
                  )}
                </div>
                <div>
                  <span className="text-gray-600">Harvest Window:</span>
                  <p className="font-medium">{getHarvestWindow()}</p>
                  {userZone && getZoneSpecificDates(plant.id, userZone) && (
                    <p className="text-xs text-primary-600">✓ Zone {userZone} specific dates</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Companion Plants */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Companion Plants</h3>
            <p className="text-gray-600 text-sm">{getCompanionPlants()}</p>
          </div>

          {/* Growing Tips */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Growing Tips</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Water regularly, especially during dry periods</li>
                <li>• Mulch around plants to retain moisture</li>
                <li>• Monitor for pests and diseases</li>
                <li>• Harvest regularly to encourage continued production</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              onClick={onRemove}
              className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg transition-colors"
            >
              Remove from Garden
            </button>
            <div className="flex space-x-3">
              <button
                onClick={onAddTask}
                className="bg-primary-100 text-primary-700 hover:bg-primary-200 px-4 py-2 rounded-lg transition-colors"
              >
                📋 Add Task
              </button>
              <button
                onClick={onClose}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantInfoModal;
