import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  writeBatch 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import plantService from '../services/plantService';
import taskNotificationService from '../services/taskNotificationService';
import { debugLog, errorLog } from '../utils/debugLogger';
import { validateGardenName, validateTaskTitle, validateTaskNotes } from '../utils/validation';

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
      debugLog('Loading data for user from Firestore:', user.id);
      
      // Load plants from plant service (supports both local and API data)
      const plantsData = await plantService.getPlants();
      
      // Load gardens from Firestore
      let userGardens = [];
      try {
        const gardensQuery = query(
          collection(db, 'gardens'),
          where('userId', '==', user.id)
        );
        const gardensSnapshot = await getDocs(gardensQuery);
        userGardens = gardensSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        debugLog(`Loaded ${userGardens.length} gardens from Firestore`);
      } catch (error) {
        errorLog('Error loading gardens from Firestore:', error);
      }
      
      // Load tasks from Firestore
      let userTasks = [];
      try {
        const tasksQuery = query(
          collection(db, 'tasks'),
          where('userId', '==', user.id)
        );
        const tasksSnapshot = await getDocs(tasksQuery);
        userTasks = tasksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        debugLog(`Loaded ${userTasks.length} tasks from Firestore`);
      } catch (error) {
        errorLog('Error loading tasks from Firestore:', error);
      }

      // If no gardens found in Firestore, create a starter garden
      if (userGardens.length === 0) {
        debugLog('No gardens found, creating starter garden');
        const starterGarden = {
          userId: user.id,
          name: 'My First Garden',
          size: '3x6',
          description: 'A starter garden for vegetables',
          layout: {
            width: 6, // 6 columns (A-F)
            height: 3, // 3 rows (1-3)
            plants: [
              { id: '1', plantId: 'tomato', x: 0, y: 0, datePlanted: '2024-03-15' },
              { id: '2', plantId: 'lettuce', x: 1, y: 0, datePlanted: '2024-03-10' },
              { id: '3', plantId: 'carrot', x: 2, y: 0, datePlanted: '2024-03-20' }
            ]
          }
        };
        
        try {
          const gardenRef = await addDoc(collection(db, 'gardens'), starterGarden);
          userGardens = [{ id: gardenRef.id, ...starterGarden }];
          debugLog('Created starter garden in Firestore:', gardenRef.id);
        } catch (error) {
          errorLog('Error creating starter garden:', error);
          // Fallback to local state only
          userGardens = [{ id: '1', ...starterGarden }];
        }
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
      
      // If no tasks found in Firestore, create starter tasks
      if (userTasks.length === 0 && userGardens.length > 0) {
        debugLog('No tasks found, creating starter tasks');
        const starterTasks = mockTasks.map(task => ({
          ...task,
          userId: user.id,
          gardenId: userGardens[0].id,
          gardenName: userGardens[0].name
        }));
        
        try {
          const batch = writeBatch(db);
          const taskRefs = [];
          
          for (const task of starterTasks) {
            const taskRef = doc(collection(db, 'tasks'));
            batch.set(taskRef, task);
            taskRefs.push({ id: taskRef.id, ...task });
          }
          
          await batch.commit();
          userTasks = taskRefs;
          debugLog(`Created ${userTasks.length} starter tasks in Firestore`);
        } catch (error) {
          errorLog('Error creating starter tasks:', error);
          // Fallback to local state only
          userTasks = starterTasks;
        }
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

  // Helper functions removed - now using Firestore directly

  const createGarden = async (gardenData) => {
    // Validate and sanitize garden name
    const nameValidation = validateGardenName(gardenData.name);
    if (!nameValidation.isValid) {
      errorLog('Invalid garden name:', nameValidation.error);
      throw new Error(nameValidation.error);
    }
    
    const newGardenData = {
      userId: user.id,
      name: nameValidation.sanitized,
      size: gardenData.size || '3x6',
      description: gardenData.description ? validateGardenName(gardenData.description).sanitized : '',
      layout: {
        width: 6, // 6 columns (A-F)
        height: 3, // 3 rows (1-3)
        plants: []
      }
    };
    
    try {
      // Save to Firestore
      const gardenRef = await addDoc(collection(db, 'gardens'), newGardenData);
      const newGarden = { id: gardenRef.id, ...newGardenData };
      
      // Update local state
      const updatedGardens = [...gardens, newGarden];
      setGardens(updatedGardens);
      
      debugLog('Garden created in Firestore:', gardenRef.id);
      return newGarden;
    } catch (error) {
      errorLog('Error creating garden in Firestore:', error);
      throw error;
    }
  };

  const deleteGarden = async (gardenId) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'gardens', gardenId));
      
      // Delete associated tasks
      const gardenTasks = tasks.filter(task => task.gardenId === gardenId);
      const batch = writeBatch(db);
      gardenTasks.forEach(task => {
        batch.delete(doc(db, 'tasks', task.id));
      });
      await batch.commit();
      
      // Update local state
      const updatedGardens = gardens.filter(garden => garden.id !== gardenId);
      const updatedTasks = tasks.filter(task => task.gardenId !== gardenId);
      setGardens(updatedGardens);
      setTasks(updatedTasks);
      
      debugLog('Garden and associated tasks deleted from Firestore:', gardenId);
    } catch (error) {
      errorLog('Error deleting garden from Firestore:', error);
      throw error;
    }
  };

  const updateGardenLayout = async (gardenId, layout) => {
    debugLog('Updating garden layout for garden:', gardenId);
    debugLog('New layout:', layout);
    
    try {
      // Update in Firestore
      await updateDoc(doc(db, 'gardens', gardenId), { layout });
      
      // Update local state
      const updatedGardens = gardens.map(garden => 
        garden.id === gardenId 
          ? { ...garden, layout }
          : garden
      );
      debugLog('Updated gardens state:', updatedGardens);
      setGardens(updatedGardens);
      
      debugLog('Garden layout updated in Firestore:', gardenId);
    } catch (error) {
      errorLog('Error updating garden layout in Firestore:', error);
      throw error;
    }
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

  const completeTask = async (taskId) => {
    try {
      // Update in Firestore
      await updateDoc(doc(db, 'tasks', taskId), { completed: true });
      
      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: true }
          : task
      ));
      
      debugLog('Task completed in Firestore:', taskId);
    } catch (error) {
      errorLog('Error completing task in Firestore:', error);
      throw error;
    }
  };

  const addTask = async (taskData) => {
    debugLog('addTask called with:', taskData);
    
    // Validate and sanitize task data
    const titleValidation = validateTaskTitle(taskData.title);
    const notesValidation = taskData.notes ? validateTaskNotes(taskData.notes) : { isValid: true, sanitized: '' };
    
    if (!titleValidation.isValid) {
      errorLog('Invalid task title:', titleValidation.error);
      throw new Error(titleValidation.error);
    }
    
    if (!notesValidation.isValid) {
      errorLog('Invalid task notes:', notesValidation.error);
      throw new Error(notesValidation.error);
    }
    
    const newTaskData = {
      userId: user.id,
      completed: false,
      title: titleValidation.sanitized,
      type: taskData.type,
      dueDate: taskData.dueDate,
      gardenId: taskData.gardenId,
      gardenName: taskData.gardenName,
      notes: notesValidation.sanitized,
      enableNotification: taskData.enableNotification,
      notificationTiming: taskData.notificationTiming,
      notificationType: taskData.notificationType
    };
    debugLog('Creating new task:', newTaskData);
    
    try {
      // Save to Firestore
      const taskRef = await addDoc(collection(db, 'tasks'), newTaskData);
      const newTask = { id: taskRef.id, ...newTaskData };
      
      // Update local state
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      
      debugLog('Task created in Firestore:', taskRef.id);
    
      // Create notification if enabled
      debugLog('Task notification check:', { 
        enableNotification: taskData.enableNotification, 
        hasUser: !!user,
        userEmailNotifications: user?.emailNotifications,
        userWebPushNotifications: user?.webPushNotifications
      });
      
      if (taskData.enableNotification && user) {
        try {
          debugLog('Attempting to create notification for task:', newTask.title);
          const notificationId = await taskNotificationService.createTaskNotification(newTask, user);
          debugLog('Successfully created notification:', notificationId);
        } catch (error) {
          errorLog('Failed to create task notification:', error);
          // Don't fail the task creation if notification fails
        }
      } else {
        debugLog('Skipping notification creation:', { 
          enableNotification: taskData.enableNotification, 
          hasUser: !!user 
        });
      }
      
      return newTask;
    } catch (error) {
      errorLog('Error creating task in Firestore:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'tasks', taskId));
      
      // Update local state
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      
      debugLog('Task deleted from Firestore:', taskId);
      
      // Cancel notification if it exists
      try {
        await taskNotificationService.cancelTaskNotification(taskId);
        debugLog('Cancelled notification for deleted task:', taskId);
      } catch (error) {
        errorLog('Failed to cancel task notification:', error);
        // Don't fail the task deletion if notification cancellation fails
      }
    } catch (error) {
      errorLog('Error deleting task from Firestore:', error);
      throw error;
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
