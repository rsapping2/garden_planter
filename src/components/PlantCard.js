import React from 'react';
import { useDrag } from 'react-dnd';
import { getZoneSpecificDates, formatPlantingWindow } from '../utils/zonePlantingDates';

const PlantCard = ({ plant, onPlantClick, userZone }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'plant',
    item: { plant },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`card cursor-move hover:shadow-lg transition-all duration-200 h-full flex flex-col ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={() => onPlantClick(plant)}
    >
      <div className="text-center flex-1 flex flex-col">
        <div className="text-4xl mb-3">{plant.image}</div>
        <h3 className="font-semibold text-gray-900 mb-2">{plant.name}</h3>
        <div className="space-y-1 text-sm text-gray-600 flex-1">
          <p><span className="font-medium">Type:</span> {plant.type}</p>
          <p><span className="font-medium">Sun:</span> {plant.sun}</p>
          <p><span className="font-medium">Spacing:</span> {plant.spacing}"</p>
          <div className="min-h-[60px]"> {/* Fixed height container for planting info */}
            {userZone && (
              <div>
                <p className="font-medium">Planting:</p>
                <p className="text-xs">
                  {(() => {
                    const zoneDates = getZoneSpecificDates(plant.id, userZone);
                    if (zoneDates) {
                      return formatPlantingWindow(zoneDates.plantingStart, zoneDates.plantingEnd);
                    }
                    const start = new Date(plant.plantingStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    const end = new Date(plant.plantingEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    return `${start} - ${end}`;
                  })()}
                </p>
                {getZoneSpecificDates(plant.id, userZone) && (
                  <p className="text-xs text-primary-600">✓ Zone {userZone}</p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="mt-3">
          <span className="inline-block px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
            Zones {plant.zoneMin}-{plant.zoneMax}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
