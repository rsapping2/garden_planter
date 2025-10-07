import emailService from './emailService';

/**
 * Notification Scheduler - Handles automatic garden task reminders
 * 
 * This service would typically run on a backend server with cron jobs,
 * but here's how it could work for client-side scheduling or future backend integration.
 */
class NotificationScheduler {
  constructor() {
    this.scheduledNotifications = new Map();
  }

  /**
   * Schedule email reminders for upcoming tasks
   * @param {Object} user - User object with email and preferences
   * @param {Array} tasks - Array of task objects
   */
  async scheduleTaskReminders(user, tasks) {
    if (!user?.emailNotifications || !user?.email) {
      console.log('Email notifications disabled or no email address');
      return;
    }

    const now = new Date();
    const upcomingTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      const daysDiff = Math.ceil((taskDate - now) / (1000 * 60 * 60 * 24));
      
      // Send reminders 1 day before due date
      return daysDiff === 1 && !task.completed;
    });

    console.log(`Scheduling ${upcomingTasks.length} task reminders for ${user.email}`);

    for (const task of upcomingTasks) {
      try {
        // In a real implementation, this would be scheduled on the server
        // For now, we'll just send immediately for demonstration
        const result = await emailService.sendTaskReminder(user.email, task);
        
        if (result.success) {
          console.log(`✅ Task reminder scheduled for: ${task.title}`);
        } else {
          console.error(`❌ Failed to schedule reminder for: ${task.title}`);
        }
      } catch (error) {
        console.error('Error scheduling task reminder:', error);
      }
    }
  }

  /**
   * Send daily garden summary
   * @param {Object} user - User object
   * @param {Object} summary - Garden summary data
   */
  async sendDailySummary(user, summary) {
    if (!user?.emailNotifications || !user?.email) {
      return;
    }

    try {
      const result = await emailService.sendGardenSummary(user.email, summary);
      
      if (result.success) {
        console.log(`✅ Daily summary sent to ${user.email}`);
      } else {
        console.error(`❌ Failed to send daily summary to ${user.email}`);
      }
    } catch (error) {
      console.error('Error sending daily summary:', error);
    }
  }

  /**
   * Example of how this would work with a backend cron job
   * This is commented out since it's for backend implementation
   */
  /*
  setupBackendScheduler() {
    // This would run on your backend server
    
    // Daily at 8 AM - send task reminders
    cron.schedule('0 8 * * *', async () => {
      const users = await getUsersWithEmailNotifications();
      
      for (const user of users) {
        const tasks = await getTasksForUser(user.id);
        await this.scheduleTaskReminders(user, tasks);
      }
    });

    // Weekly on Sunday at 9 AM - send garden summary
    cron.schedule('0 9 * * 0', async () => {
      const users = await getUsersWithEmailNotifications();
      
      for (const user of users) {
        const summary = await getGardenSummaryForUser(user.id);
        await this.sendDailySummary(user, summary);
      }
    });
  }
  */

  /**
   * Client-side demo scheduler (for testing purposes)
   * In production, this would be handled by the backend
   */
  startDemoScheduler(user, tasks) {
    console.log('🔄 Starting demo notification scheduler...');
    
    // Check for reminders every minute (for demo purposes)
    const interval = setInterval(async () => {
      await this.scheduleTaskReminders(user, tasks);
    }, 60000); // 1 minute

    // Store interval for cleanup
    this.scheduledNotifications.set(user.id, interval);
    
    return interval;
  }

  /**
   * Stop the demo scheduler
   */
  stopDemoScheduler(userId) {
    const interval = this.scheduledNotifications.get(userId);
    if (interval) {
      clearInterval(interval);
      this.scheduledNotifications.delete(userId);
      console.log('⏹️ Demo notification scheduler stopped');
    }
  }
}

// Export singleton instance
export default new NotificationScheduler();


