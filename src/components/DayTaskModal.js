import React, { useState } from 'react';
import { useGarden } from '../contexts/GardenContext';

const DayTaskModal = ({ isOpen, onClose, selectedDate, tasks }) => {
  const { completeTask, deleteTask, gardens } = useGarden();
  const [hasChanges, setHasChanges] = useState(false);

  const getTaskIcon = (taskType) => {
    switch (taskType) {
      case 'watering': return '💧';
      case 'planting': return '🌱';
      case 'harvest': return '🌾';
      case 'fertilizing': return '🌿';
      case 'pruning': return '✂️';
      default: return '📋';
    }
  };

  const getTaskColor = (taskType) => {
    switch (taskType) {
      case 'watering': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planting': return 'bg-green-100 text-green-800 border-green-200';
      case 'harvest': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'fertilizing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pruning': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCompleteTask = (taskId) => {
    completeTask(taskId);
    setHasChanges(true);
  };

  const handleDeleteTask = (taskId, taskTitle) => {
    if (window.confirm(`Are you sure you want to delete "${taskTitle}"?`)) {
      deleteTask(taskId);
      setHasChanges(true);
    }
  };

  const handleSave = () => {
    setHasChanges(false);
    onClose();
  };

  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        setHasChanges(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!isOpen || !selectedDate) return null;

  const dateString = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">📅</div>
              <h3 className="text-xl leading-6 font-medium text-gray-900 mb-1">
                {dateString}
              </h3>
              <p className="text-sm text-gray-500">
                {tasks.length === 0 ? 'No tasks scheduled' : `${tasks.length} task${tasks.length === 1 ? '' : 's'} scheduled`}
              </p>
            </div>
            
            {/* Tasks List */}
            <div className="max-h-96 overflow-y-auto">
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🌱</div>
                  <p className="text-gray-500">No tasks scheduled for this day.</p>
                  <p className="text-sm text-gray-400 mt-2">You can add new tasks using the "Add Task" button.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div key={task.id} className={`p-4 rounded-lg border-2 ${getTaskColor(task.type)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">{getTaskIcon(task.type)}</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{task.title}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-sm font-medium capitalize">{task.type}</span>
                              {task.gardenId && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-sm text-gray-600">
                                    {gardens.find(g => g.id === task.gardenId)?.name || `Garden ${task.gardenId}`}
                                  </span>
                                </>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        {/* Task Actions */}
                        <div className="flex items-center space-x-2">
                          {task.completed ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ Completed
                            </span>
                          ) : (
                            <button
                              onClick={() => handleCompleteTask(task.id)}
                              className="inline-flex items-center px-3 py-1 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              ✓ Complete
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteTask(task.id, task.title)}
                            className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            title="Delete task"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                      
                      {/* Additional task details could go here */}
                      {task.description && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-between items-center">
            {hasChanges && (
              <div className="flex items-center text-sm text-orange-600">
                <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                Unsaved changes
              </div>
            )}
            <div className={`flex space-x-3 ${hasChanges ? '' : 'ml-auto'}`}>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleClose}
              >
                Close
              </button>
              {hasChanges && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayTaskModal;
