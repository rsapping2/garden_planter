import React from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { useGarden } from '../contexts/GardenContext';

const GardenGrid = ({ garden, onPlantDrop, onPlantMove, onPlantClick, onEmptySlotClick }) => {
  const { getPlantById } = useGarden();

  // Removed main grid drop target - using individual slot drop targets instead

  const handleSlotClick = (x, y) => {
    const existingPlant = garden.layout.plants.find(p => p.x === x && p.y === y);
    if (existingPlant) {
      onPlantClick(existingPlant);
    } else if (onEmptySlotClick) {
      onEmptySlotClick(x, y);
    }
  };

  // Draggable planted item component
  const DraggablePlantedItem = ({ plantedItem, plantData }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'planted-item',
      item: { plantedItem, plantData },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    return (
      <div
        ref={drag}
        className={`cursor-move ${isDragging ? 'opacity-50' : ''} h-full w-full flex flex-col sm:flex-row items-center justify-center gap-1 p-1`}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="text-sm sm:text-lg flex-shrink-0">{plantData?.image || '🌱'}</div>
        <div className="text-xs font-medium truncate text-center sm:text-left min-w-0">
          {plantData?.name || 'Unknown'}
        </div>
      </div>
    );
  };

  // Individual slot drop target
  const SlotDropTarget = ({ x, y, children }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: ['plant', 'planted-item'],
      drop: (item) => {
        if (item.plant) {
          // Dropping a new plant from library
          onPlantDrop(item.plant, x, y);
        } else if (item.plantedItem) {
          // Moving an existing planted item
          onPlantMove(item.plantedItem, x, y);
        }
        return { x, y };
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }));

    const existingPlant = garden.layout.plants.find(p => p.x === x && p.y === y);
    const plantData = existingPlant ? getPlantById(existingPlant.plantId) : null;

    return (
      <div
        ref={drop}
        className={`plant-slot ${isOver ? 'border-primary-400 bg-primary-50' : ''}`}
        onClick={() => handleSlotClick(x, y)}
        data-x={x}
        data-y={y}
        title={
          existingPlant 
            ? `${plantData?.name || 'Unknown Plant'} - Planted: ${existingPlant.datePlanted}` 
            : `Empty slot ${x + 1}${String.fromCharCode(65 + y)} - Drop a plant here`
        }
      >
        {children}
      </div>
    );
  };

  return (
    <div className="garden-grid-container">
      {/* Top axis labels (horizontal - 6 columns 1-6) */}
      <div className="grid-axis-top">
        <div></div> {/* Empty corner */}
        <div className="axis-labels-row">
          {Array.from({ length: garden.layout.width }, (_, i) => (
            <div key={i} className="axis-label text-center text-sm font-medium text-gray-500">
              {i + 1} {/* 1, 2, 3, 4, 5, 6 */}
            </div>
          ))}
        </div>
      </div>
      
      {/* Main content area */}
      <div className="grid-main-area">
        {/* Left axis labels (vertical - 3 rows A-C) */}
        <div className="grid-axis-left">
          {Array.from({ length: garden.layout.height }, (_, i) => (
            <div key={i} className="axis-label flex items-center justify-center text-sm font-medium text-gray-500 pr-2">
              {String.fromCharCode(65 + i)} {/* A, B, C */}
            </div>
          ))}
        </div>
        
        {/* Garden grid */}
        <div className="plant-grid">
          {Array.from({ length: garden.layout.width * garden.layout.height }).map((_, index) => {
            const x = index % garden.layout.width; // x = column (0-5 for A-F)
            const y = Math.floor(index / garden.layout.width); // y = row (0-2 for 1-3)
            const plant = garden.layout.plants.find(p => p.x === x && p.y === y);
            const plantData = plant ? getPlantById(plant.plantId) : null;

            return (
              <SlotDropTarget key={index} x={x} y={y}>
                <div className={`${plant ? 'occupied' : ''} w-full h-full flex items-center justify-center`}>
                  {plant ? (
                    <DraggablePlantedItem 
                      plantedItem={plant} 
                      plantData={plantData} 
                    />
                  ) : (
                    <div className="text-gray-300 text-2xl font-light">+</div>
                  )}
                </div>
              </SlotDropTarget>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GardenGrid;
