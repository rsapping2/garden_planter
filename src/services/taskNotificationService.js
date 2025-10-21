import notificationService from './notificationService';
import { debugLog, errorLog } from '../utils/debugLogger';

/**
 * Task Notification Service - Handles creating notifications from tasks
 */
class TaskNotificationService {
  constructor() {
    this.pendingNotifications = new Map(); // Store pending notifications by task ID
  }

  /**
   * Create a notification for a task
   * @param {Object} task - Task object
   * @param {Object} user - User object
   * @returns {Promise<string|null>} Notification ID or null if not created
   */
  async createTaskNotification(task, user) {
    try {
      debugLog('Creating notification for task:', task.title);
      debugLog('Task data:', { enableNotification: task.enableNotification, notificationTiming: task.notificationTiming, dueDate: task.dueDate });
      debugLog('User data:', { emailNotifications: user.emailNotifications, webPushNotifications: user.webPushNotifications });
      
      // Check if notifications are enabled for this task
      if (!task.enableNotification) {
        debugLog('Notifications disabled for task:', task.title);
        return null;
      }

      // Check if user has notification preferences enabled
      if (!user.emailNotifications && !user.webPushNotifications) {
        debugLog('User has all notifications disabled');
        return null;
      }

      // Calculate notification date
      const dueDate = new Date(task.dueDate);
      const timingDays = parseInt(task.notificationTiming || 0);
      
      let notificationDate;
      if (timingDays === 0) {
        // Same day notification - use today
        notificationDate = new Date();
        notificationDate.setHours(9, 0, 0, 0); // Set to 9 AM today
      } else {
        // Future notification - calculate days before due date
        notificationDate = new Date(dueDate);
        notificationDate.setDate(notificationDate.getDate() - timingDays);
        notificationDate.setHours(9, 0, 0, 0); // Set to 9 AM on the notification date
      }

      // Don't create notifications for past dates (but allow same-day)
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Reset to start of today for comparison
      const notificationDateStart = new Date(notificationDate);
      notificationDateStart.setHours(0, 0, 0, 0); // Reset to start of notification day
      
      debugLog('Notification date calculation:', { 
        dueDate: task.dueDate, 
        timingDays, 
        notificationDate: notificationDate.toISOString(), 
        notificationDateStart: notificationDateStart.toISOString(),
        now: now.toISOString(),
        isPast: notificationDateStart < now 
      });
      
      if (notificationDateStart < now) {
        debugLog('Notification date is in the past, skipping:', task.title);
        return null;
      }

      // Create notification data
      const notificationData = {
        type: task.type,
        title: `Reminder: ${task.title}`,
        message: this.generateNotificationMessage(task),
        garden: task.gardenName || 'Unknown Garden',
        plant: task.plantName || null,
        priority: this.getTaskPriority(task.type),
        taskId: task.id,
        scheduledFor: notificationDate,
        notificationType: task.notificationType || 'both',
        // Additional context
        taskTitle: task.title,
        taskType: task.type,
        dueDate: task.dueDate,
        notes: task.notes || null
      };

      // Create the notification
      const notificationId = await notificationService.createNotification(user.id, notificationData);
      
      // Store pending notification for potential cancellation
      this.pendingNotifications.set(task.id, {
        notificationId,
        scheduledFor: notificationDate
      });

      debugLog(`Created notification for task "${task.title}" scheduled for ${notificationDate.toISOString()}`);
      debugLog('Notification details:', { notificationId, taskId: task.id, scheduledFor: notificationDate });
      return notificationId;

    } catch (error) {
      errorLog('Error creating task notification:', error);
      throw error;
    }
  }

  /**
   * Cancel a notification for a task
   * @param {string} taskId - Task ID
   * @returns {Promise<void>}
   */
  async cancelTaskNotification(taskId) {
    try {
      const pending = this.pendingNotifications.get(taskId);
      if (pending) {
        await notificationService.deleteNotification(pending.notificationId);
        this.pendingNotifications.delete(taskId);
        debugLog(`Cancelled notification for task ${taskId}`);
      }
    } catch (error) {
      errorLog('Error cancelling task notification:', error);
      throw error;
    }
  }

  /**
   * Update a notification for a task
   * @param {Object} task - Updated task object
   * @param {Object} user - User object
   * @returns {Promise<string|null>} New notification ID or null
   */
  async updateTaskNotification(task, user) {
    try {
      // Cancel existing notification
      await this.cancelTaskNotification(task.id);
      
      // Create new notification if enabled
      if (task.enableNotification) {
        return await this.createTaskNotification(task, user);
      }
      
      return null;
    } catch (error) {
      errorLog('Error updating task notification:', error);
      throw error;
    }
  }

  /**
   * Generate a contextual notification message
   * @param {Object} task - Task object
   * @returns {string} Notification message
   */
  generateNotificationMessage(task) {
    const baseMessage = `Your task "${task.title}" is due soon`;
    
    if (task.plantName) {
      return `${baseMessage} for ${task.plantName} in ${task.gardenName}`;
    }
    
    return `${baseMessage} in ${task.gardenName}`;
  }

  /**
   * Get priority level based on task type
   * @param {string} taskType - Task type
   * @returns {string} Priority level
   */
  getTaskPriority(taskType) {
    const priorityMap = {
      'watering': 'high',
      'harvest': 'high', 
      'planting': 'medium',
      'fertilizing': 'medium',
      'pruning': 'low',
      'other': 'low'
    };
    
    return priorityMap[taskType] || 'medium';
  }

  /**
   * Get notification icon based on task type
   * @param {string} taskType - Task type
   * @returns {string} Icon emoji
   */
  getNotificationIcon(taskType) {
    const iconMap = {
      'watering': '💧',
      'planting': '🌱',
      'harvest': '🌾',
      'fertilizing': '🌿',
      'pruning': '✂️',
      'other': '📋'
    };
    
    return iconMap[taskType] || '🔔';
  }

  /**
   * Schedule all pending notifications (for future implementation)
   * This would integrate with a proper scheduling system
   */
  async schedulePendingNotifications() {
    // This would be implemented with a proper job scheduler
    // For now, notifications are created immediately
    debugLog('Scheduling pending notifications...');
  }
}

// Export singleton instance
const taskNotificationService = new TaskNotificationService();
export default taskNotificationService;
