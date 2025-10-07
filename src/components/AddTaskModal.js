import React, { useState } from 'react';
import { useGarden } from '../contexts/GardenContext';
import { getTodayLocalDateString } from '../utils/dateUtils';

const AddTaskModal = ({ isOpen, onClose }) => {
  const { gardens, addTask } = useGarden();
  const [formData, setFormData] = useState({
    title: '',
    type: 'watering',
    dueDate: getTodayLocalDateString(),
    gardenId: gardens.length > 0 ? gardens[0].id : ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      const selectedGarden = gardens.find(g => g.id === formData.gardenId);
      const taskData = {
        ...formData,
        gardenName: selectedGarden?.name || 'Unknown Garden'
      };
      addTask(taskData);
      setFormData({
        title: '',
        type: 'watering',
        dueDate: getTodayLocalDateString(),
        gardenId: gardens.length > 0 ? gardens[0].id : ''
      });
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div className="text-center mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Add New Task
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Water tomato plants"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Task Type
                </label>
                <select
                  name="type"
                  id="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="watering">💧 Watering</option>
                  <option value="planting">🌱 Planting</option>
                  <option value="harvest">🌾 Harvest</option>
                  <option value="fertilizing">🌿 Fertilizing</option>
                  <option value="pruning">✂️ Pruning</option>
                  <option value="other">📋 Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="gardenId" className="block text-sm font-medium text-gray-700 mb-1">
                  Garden
                </label>
                <select
                  name="gardenId"
                  id="gardenId"
                  value={formData.gardenId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  {gardens.length > 0 ? (
                    gardens.map(garden => (
                      <option key={garden.id} value={garden.id}>
                        {garden.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No gardens available</option>
                  )}
                </select>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
