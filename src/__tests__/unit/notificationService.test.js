import notificationService from '../../services/notificationService';

// Mock Firebase Firestore
const mockAddDoc = jest.fn();
const mockUpdateDoc = jest.fn();
const mockDeleteDoc = jest.fn();
const mockGetDocs = jest.fn();
const mockGetDocsFromServer = jest.fn();
const mockCollection = jest.fn();
const mockDoc = jest.fn();
const mockQuery = jest.fn();
const mockWhere = jest.fn();
const mockOrderBy = jest.fn();
const mockLimit = jest.fn();
const mockServerTimestamp = jest.fn(() => new Date());

jest.mock('firebase/firestore', () => ({
  collection: (...args) => mockCollection(...args),
  doc: (...args) => mockDoc(...args),
  addDoc: (...args) => mockAddDoc(...args),
  updateDoc: (...args) => mockUpdateDoc(...args),
  deleteDoc: (...args) => mockDeleteDoc(...args),
  getDocs: (...args) => mockGetDocs(...args),
  getDocsFromServer: (...args) => mockGetDocsFromServer(...args),
  query: (...args) => mockQuery(...args),
  where: (...args) => mockWhere(...args),
  orderBy: (...args) => mockOrderBy(...args),
  limit: (...args) => mockLimit(...args),
  serverTimestamp: () => mockServerTimestamp()
}));

jest.mock('../../config/firebase', () => ({
  db: {},
  auth: { currentUser: { uid: 'test-uid' } }
}));

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserNotifications', () => {
    it('should fetch notifications for a user', async () => {
      const mockDate = new Date();
      const mockNotifications = [
        {
          id: 'notif1',
          data: () => ({
            userId: 'user1',
            title: 'Test Notification',
            message: 'Test message',
            read: false,
            timestamp: {
              toDate: () => mockDate
            }
          })
        }
      ];

      // Mock with forEach method
      mockGetDocsFromServer.mockResolvedValue({ 
        docs: mockNotifications,
        forEach: (callback) => mockNotifications.forEach(callback)
      });

      const result = await notificationService.getUserNotifications('user1');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('notif1');
      expect(result[0].title).toBe('Test Notification');
    });

    it('should return empty array when no notifications exist', async () => {
      mockGetDocsFromServer.mockResolvedValue({ 
        docs: [],
        forEach: (callback) => [].forEach(callback)
      });

      const result = await notificationService.getUserNotifications('user1');

      expect(result).toEqual([]);
    });

    it('should query with correct parameters', async () => {
      mockGetDocsFromServer.mockResolvedValue({ 
        docs: [],
        forEach: (callback) => [].forEach(callback)
      });

      await notificationService.getUserNotifications('user1');

      expect(mockCollection).toHaveBeenCalled();
      expect(mockQuery).toHaveBeenCalled();
      expect(mockWhere).toHaveBeenCalledWith('userId', '==', 'user1');
      expect(mockOrderBy).toHaveBeenCalledWith('timestamp', 'desc');
    });
  });

  describe('createNotification', () => {
    it('should create a notification with all required fields', async () => {
      const mockNotificationId = 'new-notif-id';
      mockServerTimestamp.mockReturnValue(new Date());
      mockAddDoc.mockImplementation((collection, data) => {
        // Verify data structure
        expect(data.userId).toBe('user1');
        expect(data.title).toBe('Test');
        expect(data.read).toBe(false);
        expect(data.timestamp).toBeInstanceOf(Date);
        expect(data.createdAt).toBeInstanceOf(Date);
        return Promise.resolve({ id: mockNotificationId });
      });

      const notificationData = {
        title: 'Test',
        message: 'Test message',
        type: 'info'
      };

      const result = await notificationService.createNotification('user1', notificationData);

      expect(result).toBe(mockNotificationId);
      expect(mockAddDoc).toHaveBeenCalled();
    });

    it('should include optional fields when provided', async () => {
      mockAddDoc.mockResolvedValue({ id: 'notif-id' });

      const notificationData = {
        title: 'Test',
        message: 'Test message',
        type: 'reminder',
        priority: 'high',
        garden: 'My Garden',
        plant: 'Tomato'
      };

      await notificationService.createNotification('user1', notificationData);

      const addedData = mockAddDoc.mock.calls[0][1];
      expect(addedData.type).toBe('reminder');
      expect(addedData.priority).toBe('high');
      expect(addedData.garden).toBe('My Garden');
      expect(addedData.plant).toBe('Tomato');
    });
  });

  describe('markAsRead', () => {
    it('should update notification read status to true', async () => {
      mockUpdateDoc.mockResolvedValue();
      mockServerTimestamp.mockReturnValue(new Date());

      await notificationService.markAsRead('notif1');

      expect(mockDoc).toHaveBeenCalled();
      expect(mockUpdateDoc).toHaveBeenCalled();
      
      // Check the call includes read: true and readAt timestamp
      const updateCall = mockUpdateDoc.mock.calls[0][1];
      expect(updateCall.read).toBe(true);
      expect(updateCall.readAt).toBeInstanceOf(Date);
    });

    it('should handle errors gracefully', async () => {
      mockUpdateDoc.mockRejectedValue(new Error('Firestore error'));

      await expect(
        notificationService.markAsRead('notif1')
      ).rejects.toThrow('Firestore error');
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all unread notifications as read', async () => {
      const mockUnreadNotifications = [
        { id: 'notif1', data: () => ({ read: false }) },
        { id: 'notif2', data: () => ({ read: false }) }
      ];

      // Mock getUserNotifications to return unread notifications
      mockGetDocsFromServer.mockResolvedValue({ 
        docs: mockUnreadNotifications,
        forEach: (callback) => mockUnreadNotifications.forEach(callback)
      });
      mockGetDocs.mockResolvedValue({ docs: mockUnreadNotifications });
      mockUpdateDoc.mockResolvedValue();

      await notificationService.markAllAsRead('user1');

      expect(mockUpdateDoc).toHaveBeenCalledTimes(2);
    });

    it('should filter unread notifications in memory', async () => {
      const mockMixedNotifications = [
        { id: 'notif1', data: () => ({ read: false }) },
        { id: 'notif2', data: () => ({ read: true }) },
        { id: 'notif3', data: () => ({ read: false }) }
      ];

      mockGetDocsFromServer.mockResolvedValue({ 
        docs: mockMixedNotifications,
        forEach: (callback) => mockMixedNotifications.forEach(callback)
      });
      mockUpdateDoc.mockResolvedValue();

      await notificationService.markAllAsRead('user1');

      // Should only update the 2 unread notifications
      expect(mockUpdateDoc).toHaveBeenCalledTimes(2);
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification', async () => {
      mockDeleteDoc.mockResolvedValue();

      await notificationService.deleteNotification('notif1');

      expect(mockDoc).toHaveBeenCalled();
      expect(mockDeleteDoc).toHaveBeenCalled();
    });

    it('should handle delete errors', async () => {
      mockDeleteDoc.mockRejectedValue(new Error('Delete failed'));

      await expect(
        notificationService.deleteNotification('notif1')
      ).rejects.toThrow('Delete failed');
    });
  });

  describe('createSampleNotifications', () => {
    it('should create multiple sample notifications', async () => {
      // Mock getUserNotifications to return empty array (no existing notifications)
      mockGetDocsFromServer.mockResolvedValue({ 
        docs: [],
        forEach: (callback) => [].forEach(callback)
      });
      mockAddDoc.mockResolvedValue({ id: 'sample-notif' });

      await notificationService.createSampleNotifications('user1');

      // Should create 3 sample notifications
      expect(mockAddDoc).toHaveBeenCalledTimes(3);
    });

    it('should create notifications with correct structure', async () => {
      // Mock getUserNotifications to return empty array
      mockGetDocsFromServer.mockResolvedValue({ 
        docs: [],
        forEach: (callback) => [].forEach(callback)
      });
      mockAddDoc.mockResolvedValue({ id: 'sample-notif' });

      await notificationService.createSampleNotifications('user1');

      const firstCall = mockAddDoc.mock.calls[0][1];
      expect(firstCall.userId).toBe('user1');
      expect(firstCall.title).toBeDefined();
      expect(firstCall.message).toBeDefined();
      expect(firstCall.type).toBeDefined();
      expect(firstCall.read).toBe(false);
    });
  });
});

