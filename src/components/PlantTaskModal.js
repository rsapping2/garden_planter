import React, { useState, useCallback } from 'react';
import { useGarden } from '../contexts/GardenContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getTodayLocalDateString } from '../utils/dateUtils';

const PlantTaskModal = ({ isOpen, onClose, plantedItem, plantData, gardenId, gardenName }) => {
  const { addTask } = useGarden();
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    type: 'watering',
    dueDate: getTodayLocalDateString(),
    notes: '',
    // Notification options
    enableNotification: true,
    notificationTiming: '0', // same day by default
    notificationType: 'both' // 'email', 'web', or 'both'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      const taskData = {
        title: formData.title.trim(),
        type: formData.type,
        dueDate: formData.dueDate,
        gardenId: gardenId,
        gardenName: gardenName,
        plantId: plantedItem.plantId,
        plantName: plantData?.name || 'Unknown Plant',
        plantedItemId: plantedItem.id,
        userId: user.id,
        notes: formData.notes.trim() || undefined,
        // Notification options
        enableNotification: formData.enableNotification,
        notificationTiming: formData.notificationTiming,
        notificationType: formData.notificationType
      };

      addTask(taskData);
      showSuccess('Task added successfully!');
      
      // Reset form
      setFormData({
        title: '',
        type: 'watering',
        dueDate: getTodayLocalDateString(),
        notes: '',
        enableNotification: true,
        notificationTiming: '0',
        notificationType: 'both'
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding task:', error);
      showError('Failed to add task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getTaskSuggestions = useCallback((taskType) => {
    const plantName = plantData?.name || 'plant';
    switch (taskType) {
      case 'watering':
        return `Water ${plantName}`;
      case 'fertilizing':
        return `Fertilize ${plantName}`;
      case 'pruning':
        return `Prune ${plantName}`;
      case 'harvest':
        return `Harvest ${plantName}`;
      case 'planting':
        return `Check ${plantName} growth`;
      default:
        return `Tend to ${plantName}`;
    }
  }, [plantData?.name]);

  // Auto-update title when task type changes
  React.useEffect(() => {
    if (!formData.title || formData.title === getTaskSuggestions(formData.type)) {
      setFormData(prev => ({
        ...prev,
        title: getTaskSuggestions(formData.type)
      }));
    }
  }, [formData.type, formData.title, getTaskSuggestions]);

  if (!isOpen || !plantedItem || !plantData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <span className="text-3xl mr-3">{plantData.image}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add Task</h2>
                <p className="text-gray-600 text-sm">{plantData.name} in {gardenName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
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
                <option value="fertilizing">🌿 Fertilizing</option>
                <option value="pruning">✂️ Pruning</option>
                <option value="harvest">🌾 Harvest</option>
                <option value="planting">🌱 Check Growth</option>
                <option value="other">📋 Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Task Description
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="What needs to be done?"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
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
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                id="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional details..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Notification Options */}
            <div className="border-t pt-4 mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">🔔 Notification Settings</h4>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableNotification"
                    name="enableNotification"
                    checked={formData.enableNotification}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      enableNotification: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="enableNotification" className="ml-2 text-sm text-gray-700">
                    Send notification for this task
                  </label>
                </div>

                {formData.enableNotification && (
                  <>
                    <div>
                      <label htmlFor="notificationTiming" className="block text-sm font-medium text-gray-700 mb-1">
                        Remind me
                      </label>
                      <select
                        name="notificationTiming"
                        id="notificationTiming"
                        value={formData.notificationTiming}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="0">On the due date</option>
                        <option value="1">1 day before</option>
                        <option value="2">2 days before</option>
                        <option value="3">3 days before</option>
                        <option value="7">1 week before</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="notificationType" className="block text-sm font-medium text-gray-700 mb-1">
                        Notification method
                      </label>
                      <select
                        name="notificationType"
                        id="notificationType"
                        value={formData.notificationType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="both">Email + Web Push</option>
                        <option value="email">Email only</option>
                        <option value="web">Web Push only</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting || !formData.title.trim()}
              >
                {isSubmitting ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlantTaskModal;


