import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import plantService from '../services/plantService';
import taskNotificationService from '../services/taskNotificationService';
import { debugLog, errorLog } from '../utils/debugLogger';

const GardenContext = createContext();

export const useGarden = () => {
  const context = useContext(GardenContext);
  if (!context) {
    throw new Error('useGarden must be used within a GardenProvider');
  }
  return context;
};

export const GardenProvider = ({ children }) => {
  const { user } = useAuth();
  const [gardens, setGardens] = useState([]);
  const [plants, setPlants] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUserData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Try to load saved gardens from localStorage first
      const gardensKey = `garden_planner_gardens_${user.id}`;
      const tasksKey = `garden_planner_tasks_${user.id}`;
      
      debugLog('Loading data for user:', user.id);
      debugLog('Looking for gardens key:', gardensKey);
      debugLog('Looking for tasks key:', tasksKey);
      
      const savedGardens = localStorage.getItem(gardensKey);
      const savedTasks = localStorage.getItem(tasksKey);
      
      debugLog('Found saved gardens:', !!savedGardens);
      debugLog('Found saved tasks:', !!savedTasks);
      
      let userGardens = [];
      let userTasks = [];
      
      // Load plants from plant service (supports both local and API data)
      const plantsData = await plantService.getPlants();

      // Load gardens - check saved data first, then fallback to mock data
      if (savedGardens) {
        userGardens = JSON.parse(savedGardens);
        debugLog('Loaded saved gardens:', userGardens);
      } else {
        // Load mock garden data only if no saved data exists
        const mockGardens = [
          {
            id: '1',
            userId: user.id,
            name: 'My First Garden',
            size: '3x6',
            layout: {
              width: 6, // 6 columns (A-F)
              height: 3, // 3 rows (1-3)
              plants: [
                { id: '1', plantId: 'tomato', x: 0, y: 0, datePlanted: '2024-03-15' },
                { id: '2', plantId: 'lettuce', x: 1, y: 0, datePlanted: '2024-03-10' },
                { id: '3', plantId: 'carrot', x: 2, y: 0, datePlanted: '2024-03-20' }
              ]
            }
          }
        ];
        userGardens = mockGardens;
      }

      // Generate current dates for tasks
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const mockTasks = [
        {
          id: '1',
          type: 'watering',
          title: 'Water tomato plants',
          dueDate: tomorrow.toISOString().split('T')[0],
          completed: false,
          gardenId: '1',
          plantId: 'tomato'
        },
        {
          id: '2',
          type: 'planting',
          title: 'Plant lettuce seeds',
          dueDate: nextWeek.toISOString().split('T')[0],
          completed: false,
          gardenId: '1',
          plantId: 'lettuce'
        },
        {
          id: '3',
          type: 'fertilizing',
          title: 'Fertilize carrot patch',
          dueDate: today.toISOString().split('T')[0],
          completed: false,
          gardenId: '1',
          plantId: 'carrot'
        },
        {
          id: '4',
          type: 'harvest',
          title: 'Harvest lettuce',
          dueDate: nextMonth.toISOString().split('T')[0],
          completed: false,
          gardenId: '1',
          plantId: 'lettuce'
        }
      ];
      
      // Load tasks - check saved data first, then fallback to mock data
      if (savedTasks) {
        userTasks = JSON.parse(savedTasks);
        debugLog('Loaded saved tasks:', userTasks);
      } else {
        userTasks = mockTasks;
      }

      setGardens(userGardens);
      setPlants(plantsData);
      setTasks(userTasks);
    } catch (error) {
      errorLog('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user, loadUserData]);

  // Helper function to save data to localStorage
  const saveToLocalStorage = (gardens, tasks) => {
    if (user) {
      localStorage.setItem(`garden_planner_gardens_${user.id}`, JSON.stringify(gardens));
      localStorage.setItem(`garden_planner_tasks_${user.id}`, JSON.stringify(tasks));
      debugLog('Saved to localStorage:', { gardens: gardens.length, tasks: tasks.length });
    }
  };

  const createGarden = (gardenData) => {
    const newGarden = {
      id: Date.now().toString(),
      userId: user.id,
      ...gardenData,
      layout: {
        width: 6, // 6 columns (A-F)
        height: 3, // 3 rows (1-3)
        plants: []
      }
    };
    const updatedGardens = [...gardens, newGarden];
    setGardens(updatedGardens);
    saveToLocalStorage(updatedGardens, tasks);
    return newGarden;
  };

  const deleteGarden = (gardenId) => {
    const updatedGardens = gardens.filter(garden => garden.id !== gardenId);
    const updatedTasks = tasks.filter(task => task.gardenId !== gardenId);
    setGardens(updatedGardens);
    setTasks(updatedTasks);
    saveToLocalStorage(updatedGardens, updatedTasks);
  };

  const updateGardenLayout = (gardenId, layout) => {
    debugLog('Updating garden layout for garden:', gardenId);
    debugLog('New layout:', layout);
    
    const updatedGardens = gardens.map(garden => 
      garden.id === gardenId 
        ? { ...garden, layout }
        : garden
    );
    debugLog('Updated gardens state:', updatedGardens);
    setGardens(updatedGardens);
    saveToLocalStorage(updatedGardens, tasks);
  };

  const addPlantToGarden = (gardenId, plantId, position) => {
    const garden = gardens.find(g => g.id === gardenId);
    if (!garden) return;

    const newPlant = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      plantId,
      x: position.x,
      y: position.y,
      datePlanted: new Date().toISOString().split('T')[0],
      customData: {} // Future: store custom notes and data per square
    };

    debugLog('Adding plant:', newPlant);
    debugLog('Current plants in garden:', garden.layout.plants);

    const updatedLayout = {
      ...garden.layout,
      plants: [...garden.layout.plants, newPlant]
    };

    debugLog('Updated plants:', updatedLayout.plants);
    updateGardenLayout(gardenId, updatedLayout);
  };

  const movePlantInGarden = (gardenId, plantedItem, newPosition) => {
    const garden = gardens.find(g => g.id === gardenId);
    if (!garden) return;

    debugLog('Moving plant:', { plantedItem, position: newPosition });

    // Check if target position is occupied
    const targetOccupied = garden.layout.plants.find(
      p => p.x === newPosition.x && p.y === newPosition.y && p.id !== plantedItem.id
    );
    
    if (targetOccupied) {
      debugLog('Target position occupied, cannot move');
      return;
    }

    const updatedLayout = {
      ...garden.layout,
      plants: garden.layout.plants.map(plant => 
        plant.id === plantedItem.id 
          ? { ...plant, x: newPosition.x, y: newPosition.y }
          : plant
      )
    };

    debugLog('Updated layout after move:', updatedLayout);
    updateGardenLayout(gardenId, updatedLayout);
  };

  const removePlantFromGarden = (gardenId, plantId) => {
    const garden = gardens.find(g => g.id === gardenId);
    if (!garden) return;

    const updatedLayout = {
      ...garden.layout,
      plants: garden.layout.plants.filter(p => p.id !== plantId)
    };

    updateGardenLayout(gardenId, updatedLayout);
  };

  const completeTask = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: true }
        : task
    ));
  };

  const addTask = async (taskData) => {
    console.log('🚀 addTask called with:', taskData);
    
    const newTask = {
      id: Date.now().toString(),
      completed: false,
      ...taskData
    };
    console.log('📝 Created new task:', newTask);
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveToLocalStorage(gardens, updatedTasks);
    
    // Create notification if enabled
    console.log('🔔 Task notification check:', { 
      enableNotification: taskData.enableNotification, 
      hasUser: !!user,
      userEmailNotifications: user?.emailNotifications,
      userWebPushNotifications: user?.webPushNotifications
    });
    
    if (taskData.enableNotification && user) {
      try {
        console.log('🔔 Attempting to create notification for task:', newTask.title);
        const notificationId = await taskNotificationService.createTaskNotification(newTask, user);
        console.log('✅ Successfully created notification:', notificationId);
        
        
      } catch (error) {
        console.error('❌ Failed to create task notification:', error);
        // Don't fail the task creation if notification fails
      }
    } else {
      console.log('⏭️ Skipping notification creation:', { 
        enableNotification: taskData.enableNotification, 
        hasUser: !!user 
      });
    }
    
    return newTask;
  };

  const deleteTask = async (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveToLocalStorage(gardens, updatedTasks);
    
    // Cancel notification if it exists
    try {
      await taskNotificationService.cancelTaskNotification(taskId);
      debugLog('Cancelled notification for deleted task:', taskId);
    } catch (error) {
      errorLog('Failed to cancel task notification:', error);
      // Don't fail the task deletion if notification cancellation fails
    }
  };

  const getPlantById = (plantId) => {
    return plants.find(plant => plant.id === plantId);
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return !task.completed && dueDate >= today && dueDate <= nextWeek;
    });
  };

  const value = {
    gardens,
    plants,
    tasks,
    loading,
    createGarden,
    deleteGarden,
    updateGardenLayout,
    addPlantToGarden,
    movePlantInGarden,
    removePlantFromGarden,
    completeTask,
    addTask,
    deleteTask,
    getPlantById,
    getUpcomingTasks
  };

  return (
    <GardenContext.Provider value={value}>
      {children}
    </GardenContext.Provider>
  );
};
