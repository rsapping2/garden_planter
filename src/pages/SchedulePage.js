import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGarden } from '../contexts/GardenContext';
import { useAuth } from '../contexts/AuthContext';
import AddTaskModal from '../components/AddTaskModal';
import DayTaskModal from '../components/DayTaskModal';
import { createLocalDate, isSameDay } from '../utils/dateUtils';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SchedulePage = () => {
  const { gardens, tasks, completeTask } = useGarden();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterTaskType, setFilterTaskType] = useState('all');
  const [filterGarden, setFilterGarden] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showDayTaskModal, setShowDayTaskModal] = useState(false);
  const [selectedDayData, setSelectedDayData] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Generate calendar data
  const generateCalendarData = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendar = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayTasks = tasks.filter(task => {
        const taskDate = createLocalDate(task.dueDate);
        const matchesDate = isSameDay(taskDate, currentDate);
        const matchesType = filterTaskType === 'all' || task.type === filterTaskType;
        const matchesGarden = filterGarden === 'all' || task.gardenId === filterGarden;
        const matchesStatus = filterStatus === 'all' || 
          (filterStatus === 'completed' && task.completed) ||
          (filterStatus === 'pending' && !task.completed);
        return matchesDate && matchesType && matchesGarden && matchesStatus;
      });
      
      calendar.push({
        date: new Date(currentDate),
        tasks: dayTasks,
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: isSameDay(currentDate, new Date())
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return calendar;
  };


  const getUpcomingTasks = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return tasks
      .filter(task => {
        const dueDate = new Date(task.dueDate);
        const matchesDate = dueDate >= today && dueDate <= nextWeek;
        const matchesType = filterTaskType === 'all' || task.type === filterTaskType;
        const matchesGarden = filterGarden === 'all' || task.gardenId === filterGarden;
        const matchesStatus = filterStatus === 'all' || 
          (filterStatus === 'completed' && task.completed) ||
          (filterStatus === 'pending' && !task.completed);
        return matchesDate && matchesType && matchesGarden && matchesStatus;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

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


  const handleDayClick = (dayData) => {
    setSelectedDayData(dayData);
    setShowDayTaskModal(true);
  };

  const calendarData = generateCalendarData();
  const upcomingTasks = getUpcomingTasks();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header showWelcome={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Garden Schedule</h1>
              <p className="text-gray-600 mt-2">
                Track your planting, watering, and harvest schedule
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAddTaskModal(true)}
                className="btn-primary"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="all">All Tasks</option>
                <option value="pending">📝 Pending</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Garden</label>
              <select
                value={filterGarden}
                onChange={(e) => setFilterGarden(e.target.value)}
                className="input-field"
              >
                <option value="all">All Gardens</option>
                {gardens.map(garden => (
                  <option key={garden.id} value={garden.id}>
                    {garden.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
              <select
                value={filterTaskType}
                onChange={(e) => setFilterTaskType(e.target.value)}
                className="input-field"
              >
                <option value="all">All Types</option>
                <option value="watering">💧 Watering</option>
                <option value="planting">🌱 Planting</option>
                <option value="harvest">🌾 Harvest</option>
                <option value="fertilizing">🌿 Fertilizing</option>
                <option value="pruning">✂️ Pruning</option>
                <option value="other">📋 Other</option>
              </select>
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Month</label>
              <div className="input-field bg-gray-50 text-gray-700 cursor-default">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar View */}
          <div className="lg:col-span-3">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setMonth(newDate.getMonth() - 1);
                      setSelectedDate(newDate);
                    }}
                    className="btn-secondary"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setSelectedDate(new Date())}
                    className="btn-secondary"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setMonth(newDate.getMonth() + 1);
                      setSelectedDate(newDate);
                    }}
                    className="btn-secondary"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center font-semibold text-gray-600 text-sm">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarData.map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-24 p-2 border border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors ${
                      day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                    } ${day.isToday ? 'ring-2 ring-primary-500' : ''}`}
                    onClick={() => handleDayClick(day)}
                    title={`Click to view tasks for ${day.date.toLocaleDateString()}`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {day.date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {day.tasks.slice(0, 3).map(task => (
                        <div
                          key={task.id}
                          className={`text-xs p-1 rounded border ${getTaskColor(task.type)}`}
                          title={`${task.type}: ${task.title}`}
                        >
                          <span className="mr-1">{getTaskIcon(task.type)}</span>
                          {task.title.length > 15 ? task.title.substring(0, 15) + '...' : task.title}
                        </div>
                      ))}
                      {day.tasks.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{day.tasks.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Task Type Legend */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Task Types</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center">
                    <span className="mr-1">💧</span>
                    <span className="w-3 h-3 bg-blue-100 border border-blue-200 rounded mr-1"></span>
                    <span>Watering</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">🌱</span>
                    <span className="w-3 h-3 bg-green-100 border border-green-200 rounded mr-1"></span>
                    <span>Planting</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">🌾</span>
                    <span className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded mr-1"></span>
                    <span>Harvest</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">🌿</span>
                    <span className="w-3 h-3 bg-purple-100 border border-purple-200 rounded mr-1"></span>
                    <span>Fertilizing</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">✂️</span>
                    <span className="w-3 h-3 bg-red-100 border border-red-200 rounded mr-1"></span>
                    <span>Pruning</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">📋</span>
                    <span className="w-3 h-3 bg-gray-100 border border-gray-200 rounded mr-1"></span>
                    <span>Other</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
              {upcomingTasks.length > 0 ? (
                <div className="space-y-3">
                  {upcomingTasks.map(task => (
                    <div key={task.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl mr-3">{getTaskIcon(task.type)}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-600">
                          {task.type} • {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => completeTask(task.id)}
                        className="text-green-600 hover:text-green-700 text-sm"
                      >
                        ✓
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-gray-600">No upcoming tasks</p>
                </div>
              )}
            </div>

            {/* Task Legend */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Types</h3>
              <div className="space-y-2">
                {[
                  { type: 'watering', icon: '💧', label: 'Watering' },
                  { type: 'planting', icon: '🌱', label: 'Planting' },
                  { type: 'harvest', icon: '🌾', label: 'Harvest' },
                  { type: 'fertilizing', icon: '🌿', label: 'Fertilizing' },
                  { type: 'pruning', icon: '✂️', label: 'Pruning' }
                ].map(taskType => (
                  <div key={taskType.type} className="flex items-center">
                    <span className="text-xl mr-3">{taskType.icon}</span>
                    <span className="text-sm text-gray-600">{taskType.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {(() => {
                  const statusText = filterStatus === 'all' ? 'All Tasks' : 
                    filterStatus === 'completed' ? 'Completed Tasks' : 'Pending Tasks';
                  const gardenText = filterGarden === 'all' ? '' : gardens.find(g => g.id === filterGarden)?.name || 'Garden';
                  const taskText = filterTaskType === 'all' ? '' : `${filterTaskType.charAt(0).toUpperCase() + filterTaskType.slice(1)}`;
                  
                  // Build title based on active filters
                  const parts = [statusText];
                  if (gardenText) parts.push(gardenText);
                  if (taskText) parts.push(taskText);
                  
                  return parts.length === 1 ? parts[0] : parts.join(' - ');
                })()}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium">
                    {tasks.filter(t => {
                      const matchesType = filterTaskType === 'all' || t.type === filterTaskType;
                      const matchesGarden = filterGarden === 'all' || t.gardenId === filterGarden;
                      const matchesStatus = filterStatus === 'all' || 
                        (filterStatus === 'completed' && t.completed) ||
                        (filterStatus === 'pending' && !t.completed);
                      return matchesType && matchesGarden && matchesStatus;
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium text-green-600">
                    {tasks.filter(t => {
                      const matchesType = filterTaskType === 'all' || t.type === filterTaskType;
                      const matchesGarden = filterGarden === 'all' || t.gardenId === filterGarden;
                      const matchesStatus = filterStatus === 'all' || 
                        (filterStatus === 'completed' && t.completed) ||
                        (filterStatus === 'pending' && !t.completed);
                      return t.completed && matchesType && matchesGarden && matchesStatus;
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending:</span>
                  <span className="font-medium text-yellow-600">
                    {tasks.filter(t => {
                      const matchesType = filterTaskType === 'all' || t.type === filterTaskType;
                      const matchesGarden = filterGarden === 'all' || t.gardenId === filterGarden;
                      const matchesStatus = filterStatus === 'all' || 
                        (filterStatus === 'completed' && t.completed) ||
                        (filterStatus === 'pending' && !t.completed);
                      return !t.completed && matchesType && matchesGarden && matchesStatus;
                    }).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Task Modal */}
        <AddTaskModal
          isOpen={showAddTaskModal}
          onClose={() => setShowAddTaskModal(false)}
        />

        {/* Day Task Modal */}
        <DayTaskModal
          isOpen={showDayTaskModal}
          onClose={() => {
            setShowDayTaskModal(false);
            setSelectedDayData(null);
          }}
          selectedDate={selectedDayData?.date}
          tasks={selectedDayData?.tasks || []}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default SchedulePage;
