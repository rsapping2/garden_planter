import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { debugLog, errorLog } from '../utils/debugLogger';

/**
 * Notification Service - Handles CRUD operations for user notifications in Firestore
 */
class NotificationService {
  constructor() {
    this.collectionName = 'notifications';
  }

  /**
   * Get all notifications for a user
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of notification objects
   */
  async getUserNotifications(userId, options = {}) {
    try {
      debugLog(`Fetching notifications for user: ${userId}`);
      console.log('🔍 NotificationService - getUserNotifications called with userId:', userId);
      console.log('🔍 Current auth state:', auth.currentUser);
      
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const notificationsRef = collection(db, this.collectionName);
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(options.limit || 50)
      );
      
      debugLog('Executing Firestore query...');
      const querySnapshot = await getDocs(q);
      const notifications = [];
      
      querySnapshot.forEach((doc) => {
        notifications.push({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        });
      });
      
      debugLog(`Retrieved ${notifications.length} notifications for user ${userId}`);
      return notifications;
    } catch (error) {
      errorLog('Error fetching user notifications:', error);
      errorLog('Error details:', {
        code: error.code,
        message: error.message,
        userId: userId
      });
      throw error;
    }
  }

  /**
   * Create a new notification
   * @param {string} userId - User ID
   * @param {Object} notificationData - Notification data
   * @returns {Promise<string>} Notification ID
   */
  async createNotification(userId, notificationData) {
    try {
      const notificationsRef = collection(db, this.collectionName);
      const docRef = await addDoc(notificationsRef, {
        userId,
        ...notificationData,
        timestamp: serverTimestamp(),
        read: false,
        createdAt: serverTimestamp()
      });
      
      debugLog(`Created notification ${docRef.id} for user ${userId}`);
      return docRef.id;
    } catch (error) {
      errorLog('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Mark a notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise<void>}
   */
  async markAsRead(notificationId) {
    try {
      const notificationRef = doc(db, this.collectionName, notificationId);
      await updateDoc(notificationRef, {
        read: true,
        readAt: serverTimestamp()
      });
      
      debugLog(`Marked notification ${notificationId} as read`);
    } catch (error) {
      errorLog('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async markAllAsRead(userId) {
    try {
      const notifications = await this.getUserNotifications(userId);
      const unreadNotifications = notifications.filter(n => !n.read);
      
      const updatePromises = unreadNotifications.map(notification => 
        this.markAsRead(notification.id)
      );
      
      await Promise.all(updatePromises);
      debugLog(`Marked ${unreadNotifications.length} notifications as read for user ${userId}`);
    } catch (error) {
      errorLog('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise<void>}
   */
  async deleteNotification(notificationId) {
    try {
      const notificationRef = doc(db, this.collectionName, notificationId);
      await deleteDoc(notificationRef);
      
      debugLog(`Deleted notification ${notificationId}`);
    } catch (error) {
      errorLog('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count for a user
   * @param {string} userId - User ID
   * @returns {Promise<number>} Count of unread notifications
   */
  async getUnreadCount(userId) {
    try {
      const notifications = await this.getUserNotifications(userId);
      return notifications.filter(n => !n.read).length;
    } catch (error) {
      errorLog('Error getting unread count:', error);
      throw error;
    }
  }

  /**
   * Create sample notifications for a user (for demo purposes)
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async createSampleNotifications(userId) {
    try {
      const sampleNotifications = [
        {
          type: 'watering',
          title: 'Water your tomatoes',
          message: 'Your tomato plants need watering today',
          garden: 'My First Garden',
          plant: 'Tomato',
          priority: 'medium'
        },
        {
          type: 'harvest',
          title: 'Harvest lettuce ready',
          message: 'Your lettuce is ready for harvest',
          garden: 'My First Garden',
          plant: 'Lettuce',
          priority: 'high'
        },
        {
          type: 'planting',
          title: 'Plant carrots',
          message: 'Time to plant your carrot seeds',
          garden: 'My First Garden',
          plant: 'Carrot',
          priority: 'low'
        }
      ];

      // Check if user already has notifications
      const existingNotifications = await this.getUserNotifications(userId);
      if (existingNotifications.length > 0) {
        debugLog('User already has notifications, skipping sample creation');
        return;
      }

      // Create sample notifications with different timestamps
      for (let i = 0; i < sampleNotifications.length; i++) {
        const notification = sampleNotifications[i];
        const timestamp = new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000); // 1, 2, 3 days ago
        
        await this.createNotification(userId, {
          ...notification,
          timestamp: timestamp,
          read: i > 0 // First notification unread, others read
        });
      }

      debugLog(`Created ${sampleNotifications.length} sample notifications for user ${userId}`);
    } catch (error) {
      errorLog('Error creating sample notifications:', error);
      throw error;
    }
  }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;
