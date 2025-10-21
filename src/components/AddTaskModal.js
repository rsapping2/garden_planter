import React, { useState } from 'react';
import { useGarden } from '../contexts/GardenContext';
import { getTodayLocalDateString } from '../utils/dateUtils';
import { validateTaskTitle, validateTaskNotes } from '../utils/validation';
import FieldTooltip from './FieldTooltip';

const AddTaskModal = ({ isOpen, onClose }) => {
  const { gardens, addTask } = useGarden();
  const [formData, setFormData] = useState({
    title: '',
    type: 'watering',
    dueDate: getTodayLocalDateString(),
    gardenId: gardens.length > 0 ? gardens[0].id : '',
    notes: '',
    // Notification options
    enableNotification: true,
    notificationTiming: '0', // same day by default
    notificationType: 'both' // 'email', 'web', or 'both'
  });
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    
    // Validate form data
    const titleValidation = validateTaskTitle(formData.title);
    const notesValidation = validateTaskNotes(formData.notes);
    
    const newErrors = {};
    if (!titleValidation.isValid) {
      newErrors.title = titleValidation.error;
    }
    if (!notesValidation.isValid) {
      newErrors.notes = notesValidation.error;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      const selectedGarden = gardens.find(g => g.id === formData.gardenId);
      const taskData = {
        ...formData,
        title: titleValidation.sanitized,
        notes: notesValidation.sanitized,
        gardenName: selectedGarden?.name || 'Unknown Garden'
      };
      await addTask(taskData);
      setFormData({
        title: '',
        type: 'watering',
        dueDate: getTodayLocalDateString(),
        gardenId: gardens.length > 0 ? gardens[0].id : '',
        notes: '',
        enableNotification: true,
        notificationTiming: '0',
        notificationType: 'both'
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing (only if form has been submitted)
    if (hasSubmitted && errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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
                <FieldTooltip fieldType="taskTitle">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Task Title
                  </label>
                </FieldTooltip>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Water tomato plants"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  maxLength="100"
                  required
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
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

              <div>
                <FieldTooltip fieldType="taskNotes">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                </FieldTooltip>
                <textarea
                  name="notes"
                  id="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any additional notes about this task..."
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.notes ? 'border-red-300' : 'border-gray-300'
                  }`}
                  rows="3"
                  maxLength="500"
                />
                {errors.notes && (
                  <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                )}
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
