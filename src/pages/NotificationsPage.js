import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import config from '../config/environment';
import emailService from '../services/emailService';
import notificationService from '../services/notificationService';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NotificationsPage = () => {
  const { user, updateUser } = useAuth();
  const { showError, showSuccess, showWarning } = useToast();
  const navigate = useNavigate();
  
  const [notificationSettings, setNotificationSettings] = useState({
    email: user?.emailNotifications !== false,
    webPush: user?.webPushNotifications !== false,
    frequency: 'daily',
    advanceNotice: 1,
    taskTypes: {
      watering: true,
      planting: true,
      harvest: true,
      fertilizing: true,
      pruning: false
    }
  });

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const settingsInitialized = useRef(false);
  const userIdRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);
  const [lastNotificationTime, setLastNotificationTime] = useState(null);
  const [isNotificationCooldown, setIsNotificationCooldown] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [user, navigate]);

  // Load notifications from Firestore
  useEffect(() => {
    const loadNotifications = async () => {
      if (!user?.id) {
        console.log('No user ID available, skipping notification load');
        setNotifications([]);
        setLoading(false);
        userIdRef.current = null;
        return;
      }
      
      // Only reload if user ID actually changed (not just the user object reference)
      if (userIdRef.current === user.id) {
        console.log('User ID unchanged, skipping reload to prevent duplicate data');
        return;
      }
      
      console.log('Loading notifications for user:', user.id);
      userIdRef.current = user.id;
      
      // Always use Firestore - no localStorage fallback
      
      try {
        setLoading(true);
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Firestore connection timeout')), 5000)
        );
        
        const userNotifications = await Promise.race([
          notificationService.getUserNotifications(user.id),
          timeoutPromise
        ]);
        
        // Set notifications (empty array if no notifications exist)
        console.log(`📬 Found ${userNotifications.length} existing notifications`);
        console.log('📋 Notification details:', userNotifications.map(n => ({ 
          id: n.id, 
          title: n.title, 
          read: n.read,
          timestamp: n.timestamp,
          type: n.type 
        })));
        setNotifications(userNotifications);
      } catch (error) {
        console.error('Error loading notifications:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          userId: user.id
        });
        
        // Always use Firestore - no localStorage fallback
        console.error('Firestore error:', error);
        showError(`Failed to load notifications: ${error.message}`);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [user?.id, showError]);

  // Handle notification cooldown timer
  useEffect(() => {
    if (lastNotificationTime) {
      setIsNotificationCooldown(true);
      const timer = setTimeout(() => {
        setIsNotificationCooldown(false);
      }, 60000); // 1 minute cooldown

      return () => clearTimeout(timer);
    }
  }, [lastNotificationTime]);

  // Sync local notification settings with user profile (only on initial load)
  useEffect(() => {
    if (user && !settingsInitialized.current) {
      setNotificationSettings(prev => ({
        ...prev,
        email: user.emailNotifications !== false,
        webPush: user.webPushNotifications !== false
      }));
      settingsInitialized.current = true;
    }
  }, [user]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'watering': return '💧';
      case 'planting': return '🌱';
      case 'harvest': return '🌾';
      case 'fertilizing': return '🌿';
      case 'pruning': return '✂️';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'watering': return 'bg-blue-100 text-blue-800';
      case 'planting': return 'bg-green-100 text-green-800';
      case 'harvest': return 'bg-yellow-100 text-yellow-800';
      case 'fertilizing': return 'bg-purple-100 text-purple-800';
      case 'pruning': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      return `${days} days ago`;
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      showError('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(user.id);
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      showError('Failed to mark all notifications as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
      showError('Failed to delete notification');
    }
  };

  const updateSettings = async (key, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));

    // Persist critical settings to user profile
    if (key === 'email' || key === 'webPush') {
      try {
        const userUpdateKey = key === 'email' ? 'emailNotifications' : 'webPushNotifications';
        await updateUser({ [userUpdateKey]: value });
      } catch (error) {
        console.error('Failed to update user notification preferences:', error);
        // Revert the local state if update fails
        setNotificationSettings(prev => ({
          ...prev,
          [key]: !value
        }));
      }
    }
  };

  const updateTaskTypeSetting = (taskType, enabled) => {
    setNotificationSettings(prev => ({
      ...prev,
      taskTypes: {
        ...prev.taskTypes,
        [taskType]: enabled
      }
    }));
  };

  const testNotification = async () => {
    // Check if user email is verified
    if (!user?.emailVerified) {
      showError('Email verification required! You must verify your email address before testing notifications. Please check your email for a verification link or go to your Profile to resend verification.');
      return;
    }

    // Check rate limiting (1 minute cooldown)
    if (isNotificationCooldown) {
      const timeRemaining = Math.ceil((60000 - (Date.now() - lastNotificationTime)) / 1000);
      showWarning(`Please wait ${timeRemaining} seconds before testing notifications again. This helps prevent spam and ensures proper functionality.`);
      return;
    }

    // Check if notifications are supported
    if (!('Notification' in window)) {
      showError('This browser does not support notifications');
      return;
    }

    // Check current permission status
    let permission = Notification.permission;
    
    // If permission is default, request it
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }
    
    // Handle the permission result
    if (permission === 'granted') {
      try {
        // Send browser notification
        const notification = new Notification('🌱 Garden Planner Test', {
          body: 'This is a test notification from Garden Planner! Your notifications are working correctly.',
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'test-notification',
          requireInteraction: false,
          silent: false
        });
        
        // Set cooldown timer
        setLastNotificationTime(Date.now());
        
        // Auto-close after 5 seconds
        setTimeout(() => {
          notification.close();
        }, 5000);
        
        // Send email notification if email notifications are enabled
        let emailResult = { success: true, message: 'Email notifications disabled' };
        if (notificationSettings.email && user?.email) {
          try {
            emailResult = await emailService.sendTestNotification(user.email);
          } catch (error) {
            console.error('Email notification error:', error);
            emailResult = { success: false, message: 'Email notification failed' };
          }
        }
        
        // Show success message with both results as a single numbered list
        const messages = [
          'Browser notification sent!',
          notificationSettings.email 
            ? (emailResult.success 
                ? ' Email notification sent! (Check console for mock email in development)'
                : ' Email notification failed')
            : 'Email notifications disabled',
          'Note: You can test notifications again in 1 minute.'
        ];
        
        // Create a single toast with numbered list
        const numberedMessage = messages.map((message, index) => 
          `${index + 1}) ${message}`
        ).join('\n');
        
        showSuccess(numberedMessage, { showIcon: false });
        
      } catch (error) {
        console.error('Error creating notification:', error);
        showError('Failed to create notification. Please check your browser settings.');
      }
    } else if (permission === 'denied') {
      showError('Notifications are blocked. Please enable them in your browser settings: 1. Click the lock icon in your address bar 2. Allow notifications for this site 3. Refresh the page and try again');
    } else {
      showError('Notification permission denied. Please try again or check your browser settings.');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header showWelcome={true} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-2">
                Manage your garden reminders and notifications
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="btn-secondary"
              >
                Settings
              </button>
              <button
                onClick={!user?.emailVerified ? () => navigate('/profile') : testNotification}
                disabled={isNotificationCooldown}
                className={`btn-primary ${isNotificationCooldown ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={
                  !user?.emailVerified 
                    ? 'Go to Profile to verify your email address'
                    : isNotificationCooldown
                    ? 'Please wait before testing notifications again'
                    : 'Send a test notification'
                }
              >
                {!user?.emailVerified 
                  ? '🔒 Verify Email First'
                  : isNotificationCooldown
                  ? '⏱️ Please Wait'
                  : 'Test Notification'
                }
              </button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Delivery Methods */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Delivery Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="email-notifications"
                      defaultChecked={notificationSettings.email}
                      onChange={(e) => updateSettings('email', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                    />
                    <label htmlFor="email-notifications" className="ml-3 text-gray-700 cursor-pointer">
                      Email notifications
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="web-push-notifications"
                      defaultChecked={notificationSettings.webPush}
                      onChange={(e) => updateSettings('webPush', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                    />
                    <label htmlFor="web-push-notifications" className="ml-3 text-gray-700 cursor-pointer">
                      Web push notifications
                    </label>
                  </div>
                  
                </div>
              </div>

              {/* Frequency and Timing */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Frequency & Timing</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notification Frequency
                    </label>
                    <select
                      value={notificationSettings.frequency}
                      onChange={(e) => updateSettings('frequency', e.target.value)}
                      className="input-field"
                    >
                      <option value="immediate">Immediate</option>
                      <option value="daily">Daily digest</option>
                      <option value="weekly">Weekly digest</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Advance Notice (days)
                    </label>
                    <select
                      value={notificationSettings.advanceNotice}
                      onChange={(e) => updateSettings('advanceNotice', parseInt(e.target.value))}
                      className="input-field"
                    >
                      <option value={0}>Same day</option>
                      <option value={1}>1 day before</option>
                      <option value={2}>2 days before</option>
                      <option value={3}>3 days before</option>
                      <option value={7}>1 week before</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Types */}
            <div className="mt-8">
              <h3 className="font-semibold text-gray-900 mb-4">Task Types</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(notificationSettings.taskTypes).map(([taskType, enabled]) => (
                  <label key={taskType} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => updateTaskTypeSetting(taskType, e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-3 text-gray-700 capitalize">{taskType}</span>
                  </label>
                ))}
              </div>
            </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <Link 
                    to="/profile" 
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Manage Email in Profile →
                  </Link>
                  <button
                    onClick={() => {
                      setShowSettings(false);
                      // Show a brief confirmation
                      showSuccess('Notification settings saved successfully!');
                    }}
                    className="btn-primary"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-primary-100 text-primary-800 text-sm px-2 py-1 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </h2>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-primary-600 hover:text-primary-500 text-sm"
              >
                Mark all as read
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-gray-600">Loading notifications...</span>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.read 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-white border-primary-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNotificationColor(notification.type)}`}>
                          {notification.type}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <span>{notification.garden} • {notification.plant}</span>
                          <span className="ml-2">• {formatTimestamp(notification.timestamp)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-primary-600 hover:text-primary-500 text-sm"
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-500 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications yet</h3>
              <p className="text-gray-600 mb-6">
                You'll receive notifications about your garden tasks and reminders here.
              </p>
              <Link to="/garden-planner" className="btn-primary">
                Plan Your Garden
              </Link>
            </div>
          )}
        </div>

        {/* Notification Tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">💡 Notification Tips</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Enable web push notifications for instant alerts</li>
              <li>• Set advance notice to prepare for upcoming tasks</li>
              <li>• Use daily digest to avoid notification overload</li>
              <li>• Customize which task types you want to be notified about</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">🔒 Security Notice</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Email verification required for test notifications</li>
              <li>• Test notifications limited to once per minute</li>
              <li>• Click "Verify Email First" to go to Profile settings</li>
              {config.showDemoCodes && (
                <li>• Use any 6-digit demo code shown in verification modal</li>
              )}
              <li>• Re-verification needed after email changes</li>
            </ul>
          </div>
          
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">🔧 Troubleshooting</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Make sure notifications are enabled in your browser</li>
              <li>• <strong>Email notifications:</strong> Check browser console for mock emails in development</li>
              <li>• Enable email notifications in settings above to receive test emails</li>
              <li>• Check your email spam folder for missed notifications (production only)</li>
              <li>• Update your notification preferences as needed</li>
              <li>• Contact support if notifications aren't working</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotificationsPage;
