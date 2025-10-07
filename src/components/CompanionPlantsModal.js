import React from 'react';

const CompanionPlantsModal = ({ isOpen, onClose, plant, companionPlants }) => {
  if (!isOpen || !plant) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        {/* Center the modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div className="text-center">
              <div className="text-4xl mb-3">{plant.image}</div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Companion Plants for {plant.name}
              </h3>
            </div>
            
            {companionPlants.length > 0 ? (
              <div className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {companionPlants.map(companion => (
                    <div key={companion.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl">{companion.image}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{companion.name}</p>
                        <p className="text-xs text-gray-500">{companion.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Tip:</span> Companion planting can help with pest control, 
                    improve soil health, and maximize garden space utilization.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-center">
                <p className="text-gray-500">No specific companion plants listed for {plant.name}.</p>
              </div>
            )}
          </div>

          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanionPlantsModal;


